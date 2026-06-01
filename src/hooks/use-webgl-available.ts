"use client";

import { useEffect, useState } from "react";

export function useWebGLAvailable() {
  const [available, setAvailable] = useState(false);

  useEffect(() => {
    let context: RenderingContext | null = null;

    try {
      if (!window.WebGLRenderingContext) {
        setAvailable(false);
        return;
      }

      const canvas = document.createElement("canvas");
      context =
        canvas.getContext("webgl2", { failIfMajorPerformanceCaveat: false }) ||
        canvas.getContext("webgl", { failIfMajorPerformanceCaveat: false }) ||
        canvas.getContext("experimental-webgl");
      setAvailable(Boolean(context));
    } catch {
      setAvailable(false);
    }

    return () => {
      const gl = context as WebGLRenderingContext | WebGL2RenderingContext | null;
      gl?.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  return available;
}
