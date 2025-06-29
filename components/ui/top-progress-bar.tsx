"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

// Custom styling (optional, biar lebih tipis dan di bawah navbar)
import "./top-progress-bar.css";

export default function TopProgressBar() {
  const pathname = usePathname();

  useEffect(() => {
    NProgress.start();
    NProgress.set(0.3); // start a bit ahead for effect

    // Simulate finish after route change
    NProgress.done();

    // Optionally, you can listen to route change events for more control
    // but with App Router, usePathname is enough for most cases
  }, [pathname]);

  return null;
}
