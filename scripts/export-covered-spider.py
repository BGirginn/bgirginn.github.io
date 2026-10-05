"""Place unchanged covered_spider print STLs using the matching FreeCAD assembly."""
import argparse
import hashlib
import json
import math
import shutil
import struct
import zipfile
import xml.etree.ElementTree as ET
from pathlib import Path

import FreeCAD as App
import Mesh
import MeshPart


def read_appearances(source: Path) -> tuple[dict[str, str], set[str]]:
    colors = {}
    overrides = set()
    with zipfile.ZipFile(source) as archive:
        gui = ET.fromstring(archive.read('GuiDocument.xml'))
        for provider in gui.iter('ViewProvider'):
            name = provider.attrib['name']
            override = provider.find("./Properties/Property[@name='OverrideMaterial']/Bool")
            if override is not None and override.get('value') == 'true':
                overrides.add(name)
            material = provider.find("./Properties/Property[@name='ShapeAppearance']/MaterialList")
            if material is None:
                continue
            raw = archive.read(material.attrib['file'])
            if material.get('version') != '3' or len(raw) != 40 or struct.unpack_from('<I', raw)[0] != 1:
                continue
            colors[name] = f'#{struct.unpack_from("<I", raw, 8)[0] >> 8:06x}'
    return colors, overrides


def export(package: Path, output: Path) -> None:
    source = package / 'covered_spider.FCStd'
    colors, overrides = read_appearances(source)
    references = {'HIP_SG90': 'servo', 'KNEE_SG90': 'servo',
                  'HIP_Original_Horn': 'horn', 'KNEE_Original_Horn': 'horn'}
    doc = App.openDocument(str(source.resolve()))
    try:
        # Inverse print placements from the package's export_removable_covers.py.
        print_positions = {
            'HIP_Test_Interface': (3, 25, 70), 'HIP_Horn_Adapter': (11, 15, 0),
            'Femur': (8, 15, 0), 'KNEE_Horn_Adapter': (11, 15, 0),
            'Tibia': (8, 15, 0), 'Foot_Pad_Interface': (5, 10, 0),
            'Femur_Cover': (7, 15, -3), 'Tibia_Cover': (7, 15, -3),
        }
        objects = []
        for name in ('Chassis', 'Electronics_Deck', 'FL_Leg', 'FR_Leg', 'BL_Leg', 'BR_Leg'):
            group = doc.getObject(name)
            if group is None:
                raise ValueError(f'Missing assembly group: {name}')
            for obj in group.Group:
                original = obj.LinkedObject if obj.TypeId == 'App::Link' else obj
                if original.TypeId == 'PartDesign::Body' or original.Name in references:
                    objects.append((obj, original))
        if len(objects) != 57:
            raise ValueError(f'Expected 41 printed parts and 16 servo/horn instances, found {len(objects)}')
        bounds = App.BoundBox()
        for obj, original in objects:
            if original.Name not in references:
                bounds.add(obj.Shape.BoundBox)
        center = bounds.Center
        scale = 5.2 / max(bounds.XLength, bounds.YLength, bounds.ZLength)
        normalize = App.Matrix(scale, 0, 0, -center.x*scale,
                               0, 0, scale, -center.z*scale,
                               0, -scale, 0, center.y*scale,
                               0, 0, 0, 1)
        # Move each leg as one assembly; individual centroids would pull its joints apart.
        leg_offsets = {}
        for tag in ('FL', 'FR', 'BL', 'BR'):
            leg_bounds = App.BoundBox()
            for obj, _ in objects:
                if obj.Name.startswith(tag + '_') and obj.LinkedObject.Name not in references:
                    leg_bounds.add(obj.Shape.BoundBox)
            c = leg_bounds.Center
            radius = math.hypot(c.x, c.y)
            leg_offsets[tag] = App.Vector(0.42*c.x/radius, 0, -0.42*c.y/radius)
        parts, files, paths = [], {}, []
        output.mkdir(parents=True, exist_ok=True)
        for obj, original in objects:
            name = original.Name
            kind = references.get(name, 'printed')
            if obj.Name in overrides or name not in colors:
                raise ValueError(f'Unsupported or missing source material: {obj.Name}')
            if kind == 'printed':
                stl = package / 'STL' / f'{name}.stl'
                mesh = Mesh.Mesh(str(stl))
                if name in print_positions:
                    rotation = App.Rotation(App.Vector(0, 1, 0), -90) if name == 'HIP_Test_Interface' else App.Rotation()
                    printing = App.Placement(App.Vector(*print_positions[name]), rotation)
                    placement = original.Placement.multiply(printing.inverse())
                else:
                    # Chassis exports were translated onto the print bed without rotation.
                    placement = App.Placement(App.Vector(0, 0, original.Shape.BoundBox.ZMin), App.Rotation())
            else:
                # Supplier references are absent from the print files; export their
                # actual CAD shapes once and reuse the four original link placements.
                stl = output / f'{name}.stl'
                if name not in files:
                    mesh = MeshPart.meshFromShape(Shape=original.Shape, LinearDeflection=0.15,
                                                  AngularDeflection=0.3, Relative=False)
                    mesh.write(str(stl))
                mesh = Mesh.Mesh(str(stl))
                placement = App.Placement()
            if not mesh.isSolid():
                raise ValueError(f'Non-solid STL: {name}')
            if obj.TypeId == 'App::Link':
                placement = obj.LinkPlacement.multiply(placement)
            mesh.transform(placement.toMatrix())
            for axis in ('XMin', 'XMax', 'YMin', 'YMax', 'ZMin', 'ZMax'):
                if abs(getattr(mesh.BoundBox, axis)-getattr(obj.Shape.BoundBox, axis)) > 0.06:
                    raise ValueError(f'STL placement does not match CAD: {obj.Name} {axis}')
            matrix = normalize.multiply(placement.toMatrix())
            # Three.js Matrix4.fromArray uses column-major order.
            transform = [matrix.A[row*4+column] for column in range(4) for row in range(4)]
            cover = name in ('Femur_Cover', 'Tibia_Cover')
            tag = obj.Name.split('_', 1)[0]
            if tag in leg_offsets:
                offset = App.Vector(leg_offsets[tag])
                if cover:
                    # Local +Y is the initial outward cover lift in the CAD service notes.
                    # This straight inspection offset is not the complete physical service path.
                    direction = placement.Rotation.multVec(App.Vector(0, 1, 0))
                    offset += App.Vector(direction.x, direction.z, -direction.y)*0.48
            elif name == 'Central_Deck':
                offset = App.Vector(0, 0.65, 0)
            elif name == 'Seam_Plate':
                offset = App.Vector(0, 0.28, 0)
            elif name == 'Chassis_Quarter':
                c = obj.Shape.BoundBox.Center
                radius = math.hypot(c.x, c.y)
                offset = App.Vector(0.16*c.x/radius, 0, -0.16*c.y/radius)
            else:
                raise ValueError(f'Unclassified assembly part: {obj.Name}')
            offset = [round(v, 6) for v in (offset.x, offset.y, offset.z)]
            parts.append({'name': obj.Name, 'file': f'{name}.stl', 'matrix': transform,
                          'cover': cover, 'offset': offset, 'kind': kind, 'color': colors[name]})
            files[name] = {'file': f'{name}.stl', 'kind': kind, 'sha256': hashlib.sha256(stl.read_bytes()).hexdigest(),
                           'triangles': mesh.CountFacets}
            commands = []
            for edge in obj.Shape.Edges:
                points = [normalize.multVec(p) for p in edge.discretize(Deflection=0.15)]
                for a, b in zip(points, points[1:]):
                    for p, op in ((a, 'M'), (b, 'L')):
                        commands.append(f'{op}{400+85*(p.x*.9+p.z*.44):.2f},{290-85*(p.y*.94-p.x*.15+p.z*.30):.2f}')
            color = '#e0b773' if cover else '#83bdb8'
            paths.append(f'<path stroke="{color}" d="{"".join(commands)}"/>')
        output.mkdir(parents=True, exist_ok=True)
        for entry in files.values():
            if entry['kind'] == 'printed':
                shutil.copyfile(package/'STL'/entry['file'], output/entry['file'])
        (output/'assembly.json').write_text(json.dumps({
            'sourceSha256': hashlib.sha256(source.read_bytes()).hexdigest(),
            'files': list(files.values()), 'parts': parts,
        }, separators=(',', ':'))+'\n')
        (output/'outline.svg').write_text('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 580"><title>Covered spider STL assembly</title><g fill="none" stroke-width="1.1">'+''.join(paths)+'</g></svg>\n')
        print(f'Exported 11 unchanged print STLs and 4 CAD reference meshes, {len(parts)} colored instances; all bounds match CAD within 0.06 mm')
    finally:
        App.closeDocument(doc.Name)


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('package', type=Path)
    parser.add_argument('--output', type=Path, default=Path('public/models/covered-spider'))
    args = parser.parse_args()
    export(args.package, args.output)
