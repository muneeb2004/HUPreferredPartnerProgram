import { AdminShell } from "@/components/layout/admin/admin-shell";

export default function AdminLayout({ children }: { children: React.ReactNode }): JSX.Element {
  return <AdminShell>{children}</AdminShell>;
}
