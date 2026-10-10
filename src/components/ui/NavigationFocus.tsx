"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

export function NavigationFocus() {
  const pathname = usePathname();
  const previousPath = useRef(pathname);

  useEffect(() => {
    if (previousPath.current === pathname) return;
    previousPath.current = pathname;
    // The mobile menu unmounts on navigation; move its keyboard focus into the new page.
    const heading = document.querySelector<HTMLElement>("main h1");
    if (heading) {
      heading.tabIndex = -1;
      heading.focus({ preventScroll: true });
    }
  }, [pathname]);

  return null;
}
