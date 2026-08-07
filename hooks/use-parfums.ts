"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/lib/supabase/types";

type Parfum = Database["public"]["Tables"]["parfums"]["Row"];
export type { Parfum };

export function useParfums() {
  const [parfums, setParfums] = useState<Parfum[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as any;

  const fetchParfums = useCallback(async () => {
    setLoading(true);
    const { data, error } = await db.from("parfums")
      .select("*")
      .order("maison", { ascending: true })
      .order("nom", { ascending: true });
    if (error) setError(error.message);
    else setParfums(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchParfums(); }, [fetchParfums]);

  const addParfum = async (parfum: Partial<Parfum>) => {
    const { data, error } = await db.from("parfums").insert([parfum]).select().single();
    if (error) throw error;
    await fetchParfums();
    return data as Parfum;
  };

  const updateParfum = async (id: string, updates: Partial<Parfum>) => {
    const { error } = await db.from("parfums").update(updates).eq("id", id);
    if (error) throw error;
    await fetchParfums();
  };

  const deleteParfum = async (id: string) => {
    const { error } = await db.from("parfums").delete().eq("id", id);
    if (error) throw error;
    await fetchParfums();
  };

  return { parfums, loading, error, refresh: fetchParfums, addParfum, updateParfum, deleteParfum };
}
