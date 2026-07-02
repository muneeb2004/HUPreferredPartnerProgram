import { PortalShell } from "@/components/layout/portal/portal-shell";

import type * as React from "react";

export default function PortalLayout({ children }: { children: React.ReactNode }): React.JSX.Element {
  return <PortalShell>{children}</PortalShell>;
}
