import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { Toaster } from "@/components/ui/sonner";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      {/* Stationary Sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900 md:block">
        <AdminSidebar />
      </aside>

      {/* Main Content (Shifted right to accommodate sidebar) */}
      <main className="md:pl-64">
        <div className="p-8">
          {children}
        </div>
      </main>
      <Toaster />
    </div>
  );
}
