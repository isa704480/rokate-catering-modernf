"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { LeadItem } from "./AdminLeadsPanel";

/** Arizalar ro'yxatini Firestore'dan jonli o'qiydi (faqat o'qish). */
export function useLeads() {
  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "leads"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(
      q,
      (snap) => {
        setLeads(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as LeadItem));
        setLoading(false);
      },
      () => setLoading(false)
    );
    return () => unsub();
  }, []);

  return { leads, loading };
}

/** Firestore Timestamp yoki oddiy obyektdan Date yasaydi. */
export function leadDate(lead: LeadItem): Date | null {
  const v = lead.createdAt as unknown;
  if (!v) return lead.createdClientTime ? new Date(lead.createdClientTime) : null;
  if (typeof v === "object" && v !== null && "seconds" in v) {
    return new Date((v as { seconds: number }).seconds * 1000);
  }
  if (typeof (v as { toDate?: () => Date }).toDate === "function") {
    return (v as { toDate: () => Date }).toDate();
  }
  return null;
}
