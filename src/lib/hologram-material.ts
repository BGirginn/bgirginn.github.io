import type { Material } from "three";

export function createHologramScan() {
  return {
    uScanPosition: { value: 0 },
    uScanHeight: { value: 1 },
    uScanStrength: { value: 0 },
  };
}

export type HologramScan = ReturnType<typeof createHologramScan>;

export function applyHologramScan(material: Material, scan: HologramScan) {
  material.onBeforeCompile = (shader) => {
    if (!shader.fragmentShader.includes("#include <color_fragment>"))
      throw new Error("Hardware line shader is missing its color stage");
    Object.assign(shader.uniforms, scan);
    shader.fragmentShader = `
      uniform float uScanPosition;
      uniform float uScanHeight;
      uniform float uScanStrength;
      ${shader.fragmentShader}
    `.replace(
      "#include <color_fragment>",
      `#include <color_fragment>
      float scanY = 1.0 - gl_FragCoord.y / max(uScanHeight, 1.0);
      float scanBand = 1.0 - smoothstep(0.004, 0.045, abs(scanY - uScanPosition));
      diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.28, 0.78, 1.0),
        scanBand * uScanStrength * 0.5);
      `,
    );
  };
  material.customProgramCacheKey = () => "hardware-hologram-scan-v1";
}
