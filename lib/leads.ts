import { db } from "./firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export type LeadPayload = {
  kind: "inquiry" | "partner";
  name: string;
  phone: string;
  date?: string;
  guests?: string;
  eventType?: string;
  place?: string;
  comment?: string;
  package?: string;
  company?: string;
  field?: string;
  email?: string;
  language?: string;
  page?: string;
  source?: string;
  campaign?: string;
};

export async function saveLeadToFirestore(lead: LeadPayload) {
  try {
    const colRef = collection(db, "leads");
    await addDoc(colRef, {
      ...lead,
      status: "new", // "new" | "contacted" | "completed"
      createdAt: serverTimestamp(),
      createdClientTime: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Firestore saveLead error:", err);
  }
}
