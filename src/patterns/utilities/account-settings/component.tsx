"use client";

import { useState } from "react";
import {
  Bell,
  Check,
  ChevronRight,
  KeyRound,
  LockKeyhole,
  Palette,
  Settings,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type { PatternPreviewProps } from "@/types/pattern";
import {
  UtilityLiquidIndicator,
  UtilityShowcase,
  utilityQuickSpring,
  utilitySpring,
} from "@/patterns/utilities/shared/utility-showcase";

type Section = "profile" | "security" | "notifications";

const sections = [
  { id: "profile" as const, label: "Perfil e aparência", Icon: Palette },
  { id: "security" as const, label: "Segurança", Icon: ShieldCheck },
  { id: "notifications" as const, label: "Notificações", Icon: Bell },
];

export default function AccountSettings(props: PatternPreviewProps) {
  const [section, setSection] = useState<Section>("profile");
  const [compact, setCompact] = useState(false);
  const [systemTheme, setSystemTheme] = useState(true);
  const [twoFactor, setTwoFactor] = useState(true);
  const [loginAlerts, setLoginAlerts] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [pushAlerts, setPushAlerts] = useState(false);
  const [projectAlerts, setProjectAlerts] = useState(true);
  const [saved, setSaved] = useState(false);

  const toggle = (value: boolean, setValue: (next: boolean) => void, label: string) => (
    <motion.button
      type="button"
      className={`u-switch${value ? " is-on" : ""}`}
      aria-label={label}
      aria-pressed={value}
      onClick={() => {
        setValue(!value);
        setSaved(false);
      }}
      whileTap={{ scale: 0.9 }}
      transition={utilityQuickSpring}
    >
      <motion.span
        animate={{ x: value ? 16 : 0, scale: value ? 1.04 : 1 }}
        transition={utilityQuickSpring}
      />
    </motion.button>
  );

  return (
    <UtilityShowcase
      {...props}
      eyebrow="Preferências sem ruído"
      title="Configurações da conta"
      description="Navegação por seções, controles persistentes e confirmação animada em um painel que cabe em qualquer contexto."
      accent={props.accent ?? "#418b72"}
    >
      {({ size }) => (
        <div className="utility-view u-split settings-view">
          <aside className="u-aside settings-aside">
            <div className="u-brand"><span className="u-brand-mark"><Settings size={16} /></span> Preferências</div>
            <nav className="settings-nav" aria-label="Seções de configuração">
              {sections.map(({ id, label, Icon }) => (
                <motion.button
                  key={id}
                  type="button"
                  className={section === id ? "is-active" : undefined}
                  onClick={() => { setSection(id); setSaved(false); }}
                  whileTap={{ scale: 0.96 }}
                  transition={utilityQuickSpring}
                >
                  <Icon size={15} /> <span>{label}</span> <ChevronRight size={13} />
                </motion.button>
              ))}
            </nav>
            <div className="settings-account u-hide-small">
              <span className="u-avatar">FS</span>
              <div><b>Fabiano Schmits</b><small>Plano pessoal</small></div>
            </div>
          </aside>

          <main className="u-main settings-main">
            <div className="u-tabs settings-inline-nav" role="tablist" aria-label="Seções de configuração">
              {sections.map(({ id, label, Icon }) => {
                const active = section === id;
                return (
                  <motion.button
                    key={id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    className={active ? "is-active" : undefined}
                    onClick={() => { setSection(id); setSaved(false); }}
                    whileTap={{ scale: 0.94 }}
                    transition={utilityQuickSpring}
                  >
                    {active ? <UtilityLiquidIndicator layoutId="settings-inline-pill" /> : null}
                    <Icon size={14} /> <span>{label}</span>
                  </motion.button>
                );
              })}
            </div>
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div key={section} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={utilitySpring}>
                <span className="u-kicker">{sections.find((item) => item.id === section)?.label}</span>
                <h2 className="settings-title">
                  {section === "profile" ? "Seu espaço, do seu jeito" : section === "security" ? "Proteção em camadas" : "Escolha o que merece interromper"}
                </h2>

                <div className="u-stack settings-options">
                  {section === "profile" ? (
                    <>
                      <div className="u-list-item settings-option">
                        <span className="u-list-icon"><UserRound size={15} /></span>
                        <div className="u-grow"><b>Nome público</b><small>Fabiano Schmits</small></div>
                        <motion.button type="button" className="u-link-button" whileTap={{ scale: 0.9 }} transition={utilityQuickSpring}>Editar</motion.button>
                      </div>
                      <div className="u-list-item settings-option">
                        <span className="u-list-icon"><Palette size={15} /></span>
                        <div className="u-grow"><b>Interface compacta</b><small>Reduz espaços sem perder clareza.</small></div>
                        {toggle(compact, setCompact, "Interface compacta")}
                      </div>
                      <div className="u-list-item settings-option">
                        <span className="u-list-icon"><Settings size={15} /></span>
                        <div className="u-grow"><b>Usar tema do sistema</b><small>Alterna claro e escuro com o dispositivo.</small></div>
                        {toggle(systemTheme, setSystemTheme, "Usar tema do sistema")}
                      </div>
                      <div className="u-list-item settings-option">
                        <span className="u-list-icon"><Palette size={15} /></span>
                        <div className="u-grow"><b>Idioma e região</b><small>Português (Brasil) · São Paulo</small></div>
                        <ChevronRight size={14} />
                      </div>
                    </>
                  ) : section === "security" ? (
                    <>
                      <div className="u-list-item settings-option">
                        <span className="u-list-icon"><LockKeyhole size={15} /></span>
                        <div className="u-grow"><b>Autenticação em duas etapas</b><small>Confirmação adicional em novos dispositivos.</small></div>
                        {toggle(twoFactor, setTwoFactor, "Autenticação em duas etapas")}
                      </div>
                      <div className="u-list-item settings-option">
                        <span className="u-list-icon"><KeyRound size={15} /></span>
                        <div className="u-grow"><b>Alterar senha</b><small>Atualizada há 34 dias.</small></div>
                        <ChevronRight size={14} />
                      </div>
                      <div className="u-list-item settings-option">
                        <span className="u-list-icon"><ShieldCheck size={15} /></span>
                        <div className="u-grow"><b>Alertas de novo acesso</b><small>Avise quando um dispositivo diferente entrar.</small></div>
                        {toggle(loginAlerts, setLoginAlerts, "Alertas de novo acesso")}
                      </div>
                      <div className="u-list-item settings-option">
                        <span className="u-list-icon"><Settings size={15} /></span>
                        <div className="u-grow"><b>Dispositivos conectados</b><small>3 sessões ativas · última agora</small></div>
                        <ChevronRight size={14} />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="u-list-item settings-option">
                        <span className="u-list-icon"><Bell size={15} /></span>
                        <div className="u-grow"><b>Resumo por e-mail</b><small>Uma síntese por dia.</small></div>
                        {toggle(emailAlerts, setEmailAlerts, "Resumo por e-mail")}
                      </div>
                      <div className="u-list-item settings-option">
                        <span className="u-list-icon"><Bell size={15} /></span>
                        <div className="u-grow"><b>Alertas no navegador</b><small>Apenas menções e aprovações.</small></div>
                        {toggle(pushAlerts, setPushAlerts, "Alertas no navegador")}
                      </div>
                      <div className="u-list-item settings-option">
                        <span className="u-list-icon"><Bell size={15} /></span>
                        <div className="u-grow"><b>Atualizações de projetos</b><small>Entregas, prazos e mudanças de status.</small></div>
                        {toggle(projectAlerts, setProjectAlerts, "Atualizações de projetos")}
                      </div>
                      <div className="u-list-item settings-option">
                        <span className="u-list-icon"><Bell size={15} /></span>
                        <div className="u-grow"><b>Horário silencioso</b><small>Todos os dias, das 22h às 8h.</small></div>
                        <ChevronRight size={14} />
                      </div>
                    </>
                  )}
                </div>

                {size !== "small" ? (
                  <motion.button
                    layout
                    type="button"
                    className="u-primary settings-save"
                    aria-live="polite"
                    onClick={() => setSaved(true)}
                    whileTap={{ scale: 0.96 }}
                    transition={utilityQuickSpring}
                  >
                    <AnimatePresence mode="popLayout" initial={false}>
                      <motion.span
                        layout
                        key={saved ? "saved" : "save"}
                        initial={{ opacity: 0, y: 5, scale: 0.92 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -5, scale: 0.92 }}
                        transition={utilityQuickSpring}
                        style={{ display: "inline-flex", alignItems: "center", gap: "0.42rem" }}
                      >
                        {saved ? <Check size={14} /> : null}
                        {saved ? "Preferências salvas" : "Salvar alterações"}
                      </motion.span>
                    </AnimatePresence>
                  </motion.button>
                ) : null}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      )}
    </UtilityShowcase>
  );
}
