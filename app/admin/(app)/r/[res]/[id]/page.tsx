"use client";
import { useParams } from "next/navigation";
import { Editor } from "@/components/admin/Editor";
import { Card, Spinner } from "@/components/admin/ui";
import { useSchema } from "@/components/admin/useSchema";

export default function ItemPage() {
  const { res, id } = useParams<{ res: string; id: string }>();
  const { schema, error } = useSchema(res);
  if (error) return <Card className="p-8 text-ink-muted">Раздел не найден или нет доступа.</Card>;
  if (!schema) return <Spinner />;
  return <Editor key={`${res}-${id}`} schema={schema} id={id === "new" ? "new" : Number(id)} />;
}
