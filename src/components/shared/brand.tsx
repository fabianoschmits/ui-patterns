import Link from "next/link";

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link className="brand" href="/" aria-label="UI Patterns — página inicial">
      <span className="brand-mark" aria-hidden="true"><i /><i /><i /></span>
      {!compact && <span className="brand-name">UI <strong>Patterns</strong></span>}
    </Link>
  );
}
