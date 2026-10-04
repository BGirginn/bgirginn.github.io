"""Export assembly edges, surfaces and source colors with FreeCAD's Python; never save the source document."""
import argparse
import hashlib
import json
import struct
import zipfile
import xml.etree.ElementTree as ET
from pathlib import Path

import FreeCAD as App

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('source', type=Path)
parser.add_argument('--output', type=Path, default=Path('public/models'))
args = parser.parse_args()
# FreeCAD 1.1 stores version-3 material lists as little-endian packed colors.
# Require the observed single-material layout; never silently invent colors.
with zipfile.ZipFile(args.source) as archive:
    gui = ET.fromstring(archive.read('GuiDocument.xml'))
    appearances = {}
    for provider in gui.iter('ViewProvider'):
        material = provider.find("./Properties/Property[@name='ShapeAppearance']/MaterialList")
        if material is None:
            continue
        raw = archive.read(material.attrib['file'])
        if material.get('version') != '3' or len(raw) != 40 or struct.unpack_from('<I', raw)[0] != 1:
            continue
        diffuse = struct.unpack_from('<I', raw, 8)[0]
        appearances[provider.attrib['name']] = f'#{diffuse >> 8:06x}'

doc = App.openDocument(str(args.source.resolve()))
try:
    bodies = [o for o in doc.Objects if o.TypeId == 'PartDesign::Body']
    objects = list(bodies)
    for name in ('Supplier_References', 'Fastener_References', 'Cover_Fasteners'):
        group = doc.getObject(name)
        if group is None:
            raise ValueError(f'Missing assembly group: {name}')
        objects.extend(group.Group)
    bounds = App.BoundBox()
    for obj in objects:
        bounds.add(obj.Shape.BoundBox)
    center = bounds.Center
    scale = 5.5 / max(bounds.XLength, bounds.YLength, bounds.ZLength)
    parts = []
    for obj in objects:
        positions = []
        for edge in obj.Shape.Edges:
            points = edge.discretize(Deflection=0.15)
            for a, b in zip(points, points[1:]):
                for p in (a, b):
                    positions.extend(round(v * scale, 5) for v in
                                     (p.x-center.x, p.z-center.z, center.y-p.y))
        if not positions:
            raise ValueError(f'No edges: {obj.Name}')
        is_cover = obj.Name in ('Femur_Cover', 'Tibia_Cover')
        if obj.Name not in appearances:
            raise ValueError(f'Unsupported or missing source material: {obj.Name}')
        vertices, triangles = obj.Shape.tessellate(0.15)
        surface = [round(v * scale, 5) for p in vertices for v in
                   (p.x-center.x, p.z-center.z, center.y-p.y)]
        indices = [index for triangle in triangles for index in triangle]
        if not surface or not indices:
            raise ValueError(f'No surface mesh: {obj.Name}')
        parts.append({'name': obj.Name, 'cover': is_cover, 'positions': positions,
                      'color': appearances[obj.Name], 'surface': surface, 'indices': indices})
    payload = {'sourceSha256': hashlib.sha256(args.source.read_bytes()).hexdigest(),
               'units': 'normalized from mm', 'parts': parts}
    args.output.mkdir(parents=True, exist_ok=True)
    (args.output/'quadropod.json').write_text(json.dumps(payload, separators=(',', ':'))+'\n')
    # Orthographic reference projection from the same assembly coordinates.
    paths = []
    for part in parts:
        coords = part['positions']
        commands = []
        for i in range(0, len(coords), 6):
            for j, op in ((i, 'M'), (i+3, 'L')):
                x, y, z = coords[j:j+3]
                commands.append(f'{op}{400+105*(x*.9+z*.44):.2f},{290-85*(y*.94-x*.15+z*.30):.2f}')
        color = '#e0b773' if part['cover'] else '#83bdb8'
        paths.append(f'<path d="{"".join(commands)}" stroke="{color}"/>')
    svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 580"><title>Quadropod V0 FreeCAD leg assembly</title><g fill="none" stroke-width="1.1" stroke-linejoin="round">'+''.join(paths)+'</g></svg>\n'
    (args.output/'quadropod.svg').write_text(svg)
    print(f'Exported {len(parts)} parts, {sum(len(p["positions"])//6 for p in parts)} line segments')
finally:
    App.closeDocument(doc.Name)
