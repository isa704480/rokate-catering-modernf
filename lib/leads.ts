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
  const colRef = collection(db, "leads");
  const cleanData: Record<string, string | null> = {};
  for (const [k, v] of Object.entries(lead)) {
    if (v !== undefined) {
      cleanData[k] = v;
    }
  }

  // 4 sekundlik timeout: agar tarmoq yoki Firebase qoidasi bloklasa form qotib qolmasligi uchun
  const writePromise = addDoc(colRef, {
    ...cleanData,
    status: "new",
    createdAt: serverTimestamp(),
    createdClientTime: new Date().toISOString(),
  });

  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Firebase write timeout")), 4000)
  );

  return Promise.race([writePromise, timeoutPromise]);
}
