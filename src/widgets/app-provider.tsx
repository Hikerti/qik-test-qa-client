"use client";

import { ThemeProvider } from "@/features";
import { PropsWithChildren } from "react";

export function AppProvider({ children }: PropsWithChildren) {
  return (
    <>
      <ThemeProvider>{children}</ThemeProvider>
    </>
  );
}
