"use client";
import { useParams } from "next/navigation";
import { Suspense } from "react";
import { Editor } from "@/components/admin/Editor";
import { ListView } from "@/components/admin/ListView";
import { Card, Spinner } from "@/components/admin/ui";
import { useSchema } from "@/components/admin/useSchema";

export default function ResourcePage() {
  const { res } = useParams<{ res: string }>();
  const { schema, error } = useSchema(res);
  if (error) return <Card className="p-8 text-ink-muted">Раздел не найден или нет доступа.</Card>;
  if (!schema) return <Spinner />;
  if (schema.singleton) return <Editor key={schema.key} schema={schema} id={1} />;
  return <Suspense fallback={<Spinner />}><ListView key={schema.key} schema={schema} /></Suspense>;
}
