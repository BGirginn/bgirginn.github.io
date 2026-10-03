"use client";

import { useEffect, useState } from "react";

export function useWebGLAvailable(enabled = true) {
  const [available, setAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    if (!enabled) return;

    try {
      if (!window.WebGL2RenderingContext) {
        setAvailable(false);
        return;
      }

      const canvas = document.createElement("canvas");
      const context = canvas.getContext("webgl2", {
        failIfMajorPerformanceCaveat: true,
      });
      setAvailable(Boolean(context));
      context?.getExtension("WEBGL_lose_context")?.loseContext();
    } catch {
      setAvailable(false);
    }
  }, [enabled]);

  return available;
}
