import type { Metadata } from "next";
import { ComparateurClient } from "./comparateur-client";
import { getComparateurData, getComparateurBundles } from "@/app/actions/catalogue";

export const metadata: Metadata = {
  title: "Comparateur de rentabilité",
};

export default async function ComparateurPage() {
  const data = await getComparateurData();
  const bundles = await getComparateurBundles();

  return (
    <main className="min-h-screen">
      <ComparateurClient initialData={data} initialBundles={bundles} />
    </main>
  );
}
