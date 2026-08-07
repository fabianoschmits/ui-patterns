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
  UtilityLiquidIndicator,
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
              <motion.button
                type="button"
                className="u-icon-button"
                aria-label="Mais opções"
                whileTap={{ scale: 0.88, rotate: -6 }}
                transition={utilityQuickSpring}
              >
                <MoreHorizontal size={15} />
              </motion.button>
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
              <motion.button
                layout
                type="button"
                className="u-primary"
                aria-pressed={following}
                onClick={() => setFollowing((value) => !value)}
                whileTap={{ scale: 0.94 }}
                transition={utilityQuickSpring}
              >
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    layout
                    key={following ? "following" : "follow"}
                    initial={{ opacity: 0, y: 5, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -5, scale: 0.9 }}
                    transition={utilityQuickSpring}
                    style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem" }}
                  >
                    {following ? <Check size={14} /> : <Sparkles size={14} />}
                    {following ? "Seguindo" : "Seguir"}
                  </motion.span>
                </AnimatePresence>
              </motion.button>
              <motion.button
                type="button"
                className="u-icon-button"
                aria-label="Enviar mensagem"
                whileTap={{ scale: 0.88, rotate: -5 }}
                transition={utilityQuickSpring}
              >
                <MessageCircle size={15} />
              </motion.button>
            </div>

            <LayoutGroup id="profile-tabs">
              <div className="u-tabs profile-tabs" role="group" aria-label="Conteúdo do perfil">
                {(["about", "projects"] as const).map((item) => {
                  const active = tab === item;
                  return (
                    <motion.button
                      key={item}
                      type="button"
                      className={active ? "is-active" : undefined}
                      aria-pressed={active}
                      onClick={() => setTab(item)}
                      whileTap={{ scale: 0.94 }}
                      transition={utilityQuickSpring}
                    >
                      {active ? <UtilityLiquidIndicator layoutId="profile-tab-pill" /> : null}
                      {item === "about" ? "Sobre" : "Projetos"}
                    </motion.button>
                  );
                })}
              </div>
            </LayoutGroup>

            <AnimatePresence mode="popLayout" initial={false}>
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
