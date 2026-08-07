"use client";

import { useState } from "react";
import {
  ArrowUpRight,
  Check,
  MapPin,
  MessageCircle,
  MoreHorizontal,
  Sparkles,
  UserRound,
} from "lucide-react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import type { PatternPreviewProps } from "@/types/pattern";
import {
  UtilityShowcase,
  utilityQuickSpring,
  utilitySpring,
} from "@/patterns/utilities/shared/utility-showcase";

const projects = [
  { name: "Aurora", role: "Direção de produto", tone: "violet" },
  { name: "Nexo", role: "Sistema visual", tone: "mint" },
  { name: "Orbe", role: "Pesquisa", tone: "blue" },
  { name: "Horizonte", role: "Estratégia de produto", tone: "violet" },
  { name: "Brisa", role: "Direção de arte", tone: "mint" },
  { name: "Lume", role: "Experiência e motion", tone: "blue" },
];

export default function UserProfile(props: PatternPreviewProps) {
  const [tab, setTab] = useState<"about" | "projects">("about");
  const [following, setFollowing] = useState(false);

  return (
    <UtilityShowcase
      {...props}
      eyebrow="Identidade e presença"
      title="Perfil do usuário"
      description="Um perfil compacto que combina apresentação, números, projetos e ações sociais sem parecer uma ficha."
      accent={props.accent ?? "#df766e"}
    >
      {({ size }) => (
        <div className="utility-view u-split profile-view">
          <aside className="u-aside profile-aside">
            <div className="profile-top u-row">
              <span className="u-brand"><span className="u-brand-mark"><UserRound size={16} /></span> Pessoas</span>
              <button type="button" className="u-icon-button"><MoreHorizontal size={15} /></button>
            </div>
            <div className="profile-identity">
              <motion.div className="profile-avatar" whileHover={{ scale: 1.04, rotate: -2 }} transition={utilityQuickSpring}>
                MC <span><Check size={11} /></span>
              </motion.div>
              <span className="u-kicker">Product designer</span>
              <h2 className="u-title">Marina Costa</h2>
              <p className="u-copy"><MapPin size={12} /> Florianópolis, Brasil</p>
            </div>
            <div className="profile-stats">
              <span><b>42</b><small>Projetos</small></span>
              <span><b>8,4k</b><small>Seguidores</small></span>
              <span><b>126</b><small>Conexões</small></span>
            </div>
          </aside>

          <main className="u-main profile-main">
            <div className="profile-main-hero">
              <motion.div className="profile-avatar" whileHover={{ scale: 1.04, rotate: -2 }} transition={utilityQuickSpring}>
                MC <span><Check size={11} /></span>
              </motion.div>
              <div className="profile-main-identity">
                <span className="u-kicker">Product designer</span>
                <h2>Marina Costa</h2>
                <p><MapPin size={12} /> Florianópolis, Brasil</p>
              </div>
              <div className="profile-stats">
                <span><b>42</b><small>Projetos</small></span>
                <span><b>8,4k</b><small>Seguidores</small></span>
                <span><b>126</b><small>Conexões</small></span>
              </div>
            </div>
            <div className="u-row profile-actions">
              <button type="button" className="u-primary" onClick={() => setFollowing((value) => !value)}>
                {following ? <><Check size={14} /> Seguindo</> : <><Sparkles size={14} /> Seguir</>}
              </button>
              <button type="button" className="u-icon-button" aria-label="Enviar mensagem"><MessageCircle size={15} /></button>
            </div>

            <LayoutGroup id="profile-tabs">
              <div className="u-tabs profile-tabs">
                {(["about", "projects"] as const).map((item) => {
                  const active = tab === item;
                  return (
                    <button key={item} type="button" className={active ? "is-active" : undefined} onClick={() => setTab(item)}>
                      {active ? <motion.span layoutId="profile-tab-pill" className="u-tab-pill" transition={utilityQuickSpring} /> : null}
                      {item === "about" ? "Sobre" : "Projetos"}
                    </button>
                  );
                })}
              </div>
            </LayoutGroup>

            <AnimatePresence mode="wait" initial={false}>
              {tab === "about" ? (
                <motion.div key="about" className="profile-about" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }} transition={utilitySpring}>
                  <span className="u-kicker">Biografia</span>
                  <p>Transformo problemas complexos em experiências claras, humanas e silenciosamente memoráveis.</p>
                  {size !== "small" ? (
                    <div className="profile-skills">
                      {['Produto', 'Pesquisa', 'Motion', 'Sistemas'].map((skill) => <span className="u-badge" key={skill}>{skill}</span>)}
                    </div>
                  ) : null}
                  <div className="profile-note u-secondary-detail">
                    <Sparkles size={14} /> Disponível para colaborações selecionadas em setembro.
                  </div>
                </motion.div>
              ) : (
                <motion.ul key="projects" className="u-list" initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={utilitySpring}>
                  {projects.slice(0, size === "small" ? 3 : size === "medium" ? 5 : 6).map((project) => (
                    <li className="u-list-item" key={project.name}>
                      <span className={`profile-project tone-${project.tone}`}>{project.name.slice(0, 1)}</span>
                      <div className="u-grow"><b>{project.name}</b><small>{project.role}</small></div>
                      <ArrowUpRight size={14} />
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </main>
        </div>
      )}
    </UtilityShowcase>
  );
}
