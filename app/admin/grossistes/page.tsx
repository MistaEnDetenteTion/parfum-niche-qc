import type { Metadata } from "next";
import { GrossistesManager } from "@/components/admin/grossiste-form";

export const metadata: Metadata = { title: "Grossistes" };

export default function GrossistesPage() {
  return <GrossistesManager />;
}
