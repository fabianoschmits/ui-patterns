"use client";

import { useState } from "react";
import {
  Check,
  ChevronDown,
  Copy,
  Globe2,
  Link2,
  Lock,
  Mail,
  Send,
  ShieldCheck,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type { PatternPreviewProps } from "@/types/pattern";
import {
  UtilityShowcase,
  utilityQuickSpring,
  utilitySpring,
} from "@/patterns/utilities/shared/utility-showcase";

const initialPeople = [
  { id: 1, initials: "MC", name: "Marina Costa", email: "marina@lume.studio", role: "Editora" },
  { id: 2, initials: "CL", name: "Caio Lima", email: "caio@lume.studio", role: "Comentarista" },
  { id: 3, initials: "AN", name: "Ana Nunes", email: "ana@lume.studio", role: "Leitora" },
  { id: 4, initials: "RS", name: "Ravi Souza", email: "ravi@lume.studio", role: "Editor" },
  { id: 5, initials: "LT", name: "Lia Torres", email: "lia@lume.studio", role: "Comentarista" },
  { id: 6, initials: "BM", name: "Bia Mendes", email: "bia@lume.studio", role: "Leitora" },
];

export default function ShareAccessPanel(props: PatternPreviewProps) {
  const [people, setPeople] = useState(initialPeople);
  const [invite, setInvite] = useState("");
  const [publicLink, setPublicLink] = useState(false);
  const [copied, setCopied] = useState(false);

  return (
    <UtilityShowcase
      {...props}
      eyebrow="Colaboração com controle"
      title="Compartilhar e permitir"
      description="Convites, papéis e link público reunidos em um painel de acesso claro e reversível."
      accent={props.accent ?? "#7b67d6"}
    >
      {({ size }) => (
        <div className="utility-view u-split share-view">
          <aside className="u-aside share-aside">
            <div className="u-brand"><span className="u-brand-mark"><Users size={16} /></span> Acesso</div>
            <div>
              <span className="u-kicker">Projeto Aurora</span>
              <h2 className="u-title">As pessoas certas, com o acesso certo.</h2>
              <p className="u-copy u-aside-copy">Permissões simples de entender e fáceis de ajustar a qualquer momento.</p>
            </div>
            <div className="share-security u-hide-small"><ShieldCheck size={14} /> Alterações de acesso ficam registradas.</div>
          </aside>

          <main className="u-main share-main">
            <form
              className="share-invite"
              onSubmit={(event) => {
                event.preventDefault();
                if (!invite.trim()) return;
                setPeople((current) => [...current, { id: Date.now(), initials: invite.slice(0, 2).toUpperCase(), name: invite.split("@")[0], email: invite, role: "Leitora" }]);
                setInvite("");
              }}
            >
              <label className="u-input-wrap">
                <Mail size={15} />
                <input value={invite} onChange={(event) => setInvite(event.target.value)} placeholder="nome@empresa.com" aria-label="E-mail para convite" />
              </label>
              <button type="submit" className="u-primary"><Send size={14} /><span>Convidar</span></button>
            </form>

            <div className="u-row share-title"><span>{people.length} pessoas com acesso</span><UserPlus size={14} /></div>
            <motion.ul layout className="u-list share-people">
              <AnimatePresence mode="popLayout" initial={false}>
                {people.slice(0, size === "small" ? 4 : size === "medium" ? 5 : 6).map((person) => (
                  <motion.li layout key={person.id} className="u-list-item" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: 18 }} transition={utilitySpring}>
                    <span className="u-avatar">{person.initials}</span>
                    <div className="u-grow"><b>{person.name}</b><small>{person.email}</small></div>
                    <button type="button" className="share-role">{person.role}<ChevronDown size={12} /></button>
                    <button type="button" className="share-remove" aria-label={`Remover ${person.name}`} onClick={() => setPeople((current) => current.filter((item) => item.id !== person.id))}><X size={13} /></button>
                  </motion.li>
                ))}
              </AnimatePresence>
            </motion.ul>

            <div className="share-link">
              <span className="u-list-icon">{publicLink ? <Globe2 size={15} /> : <Lock size={15} />}</span>
              <div className="u-grow"><b>{publicLink ? "Qualquer pessoa com o link" : "Link restrito"}</b><small>{publicLink ? "Pode visualizar sem entrar" : "Somente convidados"}</small></div>
              <button type="button" className={`u-switch${publicLink ? " is-on" : ""}`} aria-pressed={publicLink} onClick={() => setPublicLink((value) => !value)}><motion.span animate={{ x: publicLink ? 16 : 0 }} transition={utilityQuickSpring} /></button>
            </div>

            {publicLink ? (
              <motion.button type="button" className="share-copy u-secondary" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 39 }} onClick={() => { setCopied(true); window.setTimeout(() => setCopied(false), 1400); }}>
                {copied ? <><Check size={14} /> Link copiado</> : <><Link2 size={14} /> lume.co/aurora <Copy size={13} /></>}
              </motion.button>
            ) : null}
          </main>
        </div>
      )}
    </UtilityShowcase>
  );
}
