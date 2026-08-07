"use client";

import { useMemo, useState } from "react";
import {
  Bell,
  BellRing,
  CheckCheck,
  FileCheck2,
  MessageSquareText,
  Sparkles,
  UserPlus,
} from "lucide-react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import type { PatternPreviewProps } from "@/types/pattern";
import {
  UtilityShowcase,
  utilityQuickSpring,
  utilitySpring,
} from "@/patterns/utilities/shared/utility-showcase";

const initialNotifications = [
  { id: 1, title: "Marina comentou no projeto", copy: "A nova direção ficou muito mais clara.", time: "agora", unread: true, Icon: MessageSquareText },
  { id: 2, title: "Arquivo aprovado", copy: "Identidade-v4.pdf está pronto para entrega.", time: "12 min", unread: true, Icon: FileCheck2 },
  { id: 3, title: "Novo membro no espaço", copy: "Caio entrou no time de Produto.", time: "1 h", unread: false, Icon: UserPlus },
  { id: 4, title: "Resumo semanal disponível", copy: "Você concluiu 18 atividades esta semana.", time: "ontem", unread: false, Icon: Sparkles },
  { id: 5, title: "Comentário resolvido", copy: "Ana encerrou a conversa sobre o checkout.", time: "ontem", unread: false, Icon: MessageSquareText },
  { id: 6, title: "Nova entrega aprovada", copy: "Protótipo-mobile.fig seguiu para desenvolvimento.", time: "2 dias", unread: false, Icon: FileCheck2 },
  { id: 7, title: "Convite aceito", copy: "Ravi agora participa do projeto Horizonte.", time: "2 dias", unread: false, Icon: UserPlus },
  { id: 8, title: "Marco alcançado", copy: "A equipe completou 100 entregas no workspace.", time: "3 dias", unread: false, Icon: Sparkles },
];

export default function NotificationCenter(props: PatternPreviewProps) {
  const [items, setItems] = useState(initialNotifications);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const unread = items.filter((item) => item.unread).length;
  const visible = useMemo(
    () => items.filter((item) => filter === "all" || item.unread),
    [filter, items],
  );

  return (
    <UtilityShowcase
      {...props}
      eyebrow="Atualizações com contexto"
      title="Central de notificações"
      description="Mensagens, aprovações e atividades reunidas em uma fila clara, interativa e silenciosa."
      accent={props.accent ?? "#8769dc"}
    >
      {({ size }) => (
        <div className="utility-view u-split notify-view">
          <aside className="u-aside notify-aside">
            <div className="u-brand">
              <span className="u-brand-mark"><BellRing size={16} /></span>
              Sinais
            </div>
            <div>
              <motion.strong key={unread} className="notify-count" initial={{ scale: 0.75 }} animate={{ scale: 1 }}>
                {unread}
              </motion.strong>
              <h2 className="u-title">{unread === 1 ? "Algo pede atenção." : "Tudo que importa, no tempo certo."}</h2>
              <p className="u-copy u-aside-copy">Marque, filtre e retome cada atualização sem perder seu lugar.</p>
            </div>
            <span className="u-badge u-hide-small"><Bell size={11} /> Resumo inteligente ativado</span>
          </aside>

          <main className="u-main notify-main">
            <div className="u-row notify-head">
              <LayoutGroup id="notification-tabs">
                <div className="u-tabs notify-tabs">
                  {(["all", "unread"] as const).map((item) => {
                    const active = filter === item;
                    return (
                      <button key={item} type="button" className={active ? "is-active" : undefined} onClick={() => setFilter(item)}>
                        {active ? <motion.span layoutId="notification-pill" className="u-tab-pill" transition={utilityQuickSpring} /> : null}
                        {item === "all" ? "Todas" : `Não lidas ${unread}`}
                      </button>
                    );
                  })}
                </div>
              </LayoutGroup>
              <button
                type="button"
                className="u-icon-button"
                aria-label="Marcar todas como lidas"
                onClick={() => setItems((current) => current.map((item) => ({ ...item, unread: false })))}
              >
                <CheckCheck size={15} />
              </button>
            </div>

            <AnimatePresence mode="popLayout" initial={false}>
              {visible.length ? (
                <motion.ul layout className="u-list notify-list">
                  {visible.slice(0, size === "small" ? 4 : size === "medium" ? 6 : 8).map((item) => {
                    const Icon = item.Icon;
                    return (
                      <motion.li
                        layout
                        key={item.id}
                        className={`u-list-item notify-item${item.unread ? " is-unread" : ""}`}
                        initial={{ opacity: 0, x: 14 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 22, scale: 0.97 }}
                        transition={utilitySpring}
                        onClick={() => setItems((current) => current.map((entry) => entry.id === item.id ? { ...entry, unread: false } : entry))}
                      >
                        <span className="u-list-icon"><Icon size={15} /></span>
                        <div className="u-grow">
                          <b>{item.title}</b>
                          <p>{item.copy}</p>
                        </div>
                        <small>{item.time}</small>
                        {item.unread ? <i aria-label="Não lida" /> : null}
                      </motion.li>
                    );
                  })}
                </motion.ul>
              ) : (
                <motion.div className="u-empty" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                  <span><CheckCheck size={19} /></span>
                  <b>Tudo em dia</b>
                  <p>Novas atualizações aparecerão aqui.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        </div>
      )}
    </UtilityShowcase>
  );
}
