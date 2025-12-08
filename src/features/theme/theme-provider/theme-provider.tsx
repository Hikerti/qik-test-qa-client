"use client";

import React, { FC } from "react";
import { ClientThemeProvider } from "@features";

export const ThemeProvider: FC<ThemeProvider.Props> = ({ children }) => {
  const user = { theme: "light" };
  return <ClientThemeProvider user={user}>{children}</ClientThemeProvider>;
};

export namespace ThemeProvider {
  export type Props = { children?: React.ReactNode };
}
