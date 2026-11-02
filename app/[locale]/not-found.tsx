import Link from "next/link";

export default function NotFound() {
  return (
    <section className="container-x flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <p className="eyebrow">404</p>
      <h1 className="mt-5 text-[clamp(2.4rem,5vw,3.6rem)]">Page not found · Страница не найдена</h1>
      <Link href="/" className="btn btn-primary mt-10">Rokate Catering</Link>
    </section>
  );
}
