import type { Metadata } from "next";
import { Calculateur } from "@/components/admin/calculateur";

export const metadata: Metadata = { title: "Calculateur" };

export default function CalculateurPage() {
  return <Calculateur />;
}
