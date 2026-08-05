import Link from "next/link";

export default function NotFound() {
  return (
    <section className="not-found">
      <p>Página não encontrada.</p>
      <Link href="/">Voltar para UI Patterns</Link>
    </section>
  );
}
