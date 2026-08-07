import type { Metadata } from "next";
import { CommandesManager } from "@/components/admin/commande-form";

export const metadata: Metadata = { title: "Lots de commande" };

export default function CommandesPage() {
  return <CommandesManager />;
}
