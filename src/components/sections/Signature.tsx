"use client";

import dynamic from "next/dynamic";

const DesktopSignatureScene = dynamic(
  () =>
    import("@/components/three/SignatureScene").then(
      (mod) => mod.DesktopSignatureScene,
    ),
  { ssr: false },
);

const MobileSignatureScene = dynamic(
  () =>
    import("@/components/three/SignatureScene").then(
      (mod) => mod.MobileSignatureScene,
    ),
  { ssr: false },
);

export function Signature() {
  return (
    <>
      <DesktopSignatureScene />
      <MobileSignatureScene />
    </>
  );
}
