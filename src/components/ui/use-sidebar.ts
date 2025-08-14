import * as React from "react";

export function useSidebar(SidebarContext: React.Context<unknown>) {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.");
  }
  return context;
} 