import type { Metadata } from "next";
import { AdminSidebar, AdminMobileHeader } from "@/components/admin/sidebar";

export const metadata: Metadata = {
  title: {
    default: "Centre de Commande",
    template: "%s | Centre de Commande",
  },
  description: "Back-office de gestion des parfums de niche — grossistes, commandes, stocks et calculateur de prix.",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <AdminMobileHeader />
        <main className="flex-1 overflow-y-auto scrollbar-thin">
          {children}
        </main>
      </div>
    </div>
  );
}
