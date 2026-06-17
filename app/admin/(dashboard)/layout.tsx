import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { Toaster } from "@/components/ui/sonner";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-neutral-50 dark:bg-neutral-950">
      <AdminSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 items-center border-b border-neutral-200 bg-white px-8 dark:border-neutral-800 dark:bg-neutral-900 shrink-0">
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">
            Control Panel
          </h2>
        </header>
        <main className="flex-1 overflow-y-auto p-8">{children}</main>
      </div>
      <Toaster />
    </div>
  );
}
