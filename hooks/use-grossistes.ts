"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/lib/supabase/types";

type Grossiste = Database["public"]["Tables"]["grossistes"]["Row"];
export type { Grossiste };

export function useGrossistes() {
  const [grossistes, setGrossistes] = useState<Grossiste[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as any;

  const fetchGrossistes = useCallback(async () => {
    setLoading(true);
    const { data, error } = await db.from("grossistes").select("*").order("nom", { ascending: true });
    if (error) setError(error.message);
    else setGrossistes(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchGrossistes(); }, [fetchGrossistes]);

  const addGrossiste = async (grossiste: Partial<Grossiste>) => {
    const { data, error } = await db.from("grossistes").insert([grossiste]).select().single();
    if (error) throw error;
    await fetchGrossistes();
    return data as Grossiste;
  };

  const updateGrossiste = async (id: string, updates: Partial<Grossiste>) => {
    const { error } = await db.from("grossistes").update(updates).eq("id", id);
    if (error) throw error;
    await fetchGrossistes();
  };

  const deleteGrossiste = async (id: string) => {
    const { error } = await db.from("grossistes").delete().eq("id", id);
    if (error) throw error;
    await fetchGrossistes();
  };

  return { grossistes, loading, error, refresh: fetchGrossistes, addGrossiste, updateGrossiste, deleteGrossiste };
}
