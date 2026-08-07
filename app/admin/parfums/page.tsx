import type { Metadata } from "next";
import { ParfumsManager } from "@/components/admin/parfum-form";

export const metadata: Metadata = { title: "Catalogue parfums" };

export default function ParfumsPage() {
  return <ParfumsManager />;
}
