import { patterns } from "@/data/patterns";
import { CatalogScrollRestorer, TransitionLink } from "@/components/transitions/transition-link";
import { StudioAtmosphere } from "@/components/home/studio-atmosphere";

export default function HomePage() {
  return (
    <div className="studio">
      <CatalogScrollRestorer />
      <StudioAtmosphere />

      <div className="studio-content">
        <header className="studio-header">
          <TransitionLink className="studio-brand" href="/">
            UI Patterns
          </TransitionLink>
          <p className="studio-tagline">
            Componentes de interface, um de cada vez.
          </p>
        </header>

        <ol className="studio-list">
          {patterns.map((pattern) => (
            <li key={pattern.slug}>
              <TransitionLink
                className="studio-item"
                href={`/patterns/${pattern.slug}`}
              >
                <span className="studio-meta">{pattern.category}</span>
                <span className="studio-name">{pattern.name}</span>
                <span className="studio-desc">{pattern.description}</span>
                <span className="studio-go">Ver</span>
              </TransitionLink>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
