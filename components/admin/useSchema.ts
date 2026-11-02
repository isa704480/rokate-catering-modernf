"use client";
import { useEffect, useState } from "react";
import { papi, type Schema } from "@/lib/panel";

export function useSchema(key: string) {
  const [schema, setSchema] = useState<Schema | null>(null);
  const [error, setError] = useState(false);
  useEffect(() => {
    setSchema(null);
    papi<Schema>(`schema/${key}`).then(setSchema).catch(() => setError(true));
  }, [key]);
  return { schema, error };
}
