"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import LoadingOverlay from "@/components/LoadingOverlay";
import { Toaster } from "@/components/ui/toaster";

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  const [isNavigating, setIsNavigating] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsNavigating(true);
    const timer = setTimeout(() => {
      setIsNavigating(false);
    }, 800);  // ⬅ try 800ms for testing (you can adjust it)

    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <>
      {children}
      <Toaster />
      {isNavigating && (
        <LoadingOverlay navigating={isNavigating} />
      )}
    </>
  );
}
