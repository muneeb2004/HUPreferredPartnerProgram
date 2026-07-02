import { AdminShell } from "@/components/layout/admin/admin-shell";

import type * as React from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }): React.JSX.Element {
  return <AdminShell>{children}</AdminShell>;
}
