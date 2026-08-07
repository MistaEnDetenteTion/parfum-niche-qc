import type { Metadata } from "next";
import { ComparateurClient } from "./comparateur-client";
import { getComparateurData } from "@/app/actions/catalogue";

export const metadata: Metadata = {
  title: "Comparateur de rentabilité",
};

export default async function ComparateurPage() {
  const data = await getComparateurData();

  return (
    <main className="min-h-screen">
      <ComparateurClient initialData={data} />
    </main>
  );
}
