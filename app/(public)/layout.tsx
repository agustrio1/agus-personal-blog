import type { ReactNode } from "react";
import { GoogleAnalytics } from "@next/third-parties/google";

const gaId = process.env.NEXT_PUBLIC_GA_ID!;

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <GoogleAnalytics gaId={gaId} />
    </>
  );
} 