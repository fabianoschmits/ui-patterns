"use client";

import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock3,
  MapPin,
  Video,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type { PatternPreviewProps } from "@/types/pattern";
import {
  UtilityShowcase,
  utilityQuickSpring,
  utilitySpring,
} from "@/patterns/utilities/shared/utility-showcase";

const days = Array.from({ length: 14 }, (_, index) => ({
  day: index + 10,
  available: ![12, 16, 21].includes(index + 10),
}));
const times = ["09:30", "10:45", "14:00", "15:30", "17:15"];

export default function BookingCalendar(props: PatternPreviewProps) {
  const [day, setDay] = useState(14);
  const [time, setTime] = useState("14:00");
  const [confirmed, setConfirmed] = useState(false);
  const [online, setOnline] = useState(true);

  return (
    <UtilityShowcase
      {...props}
      eyebrow="Tempo com intenção"
      title="Agenda e reserva"
      description="Escolha de data, horário e formato com confirmação suave e leitura imediata da disponibilidade."
      accent={props.accent ?? "#d68a4a"}
    >
      {({ size }) => (
        <div className="utility-view u-split booking-view">
          <aside className="u-aside booking-aside">
            <div className="u-brand"><span className="u-brand-mark"><CalendarDays size={16} /></span> Agenda</div>
            <div>
              <span className="u-kicker">Conversa de descoberta</span>
              <h2 className="u-title">30 minutos para dar forma à próxima ideia.</h2>
              <p className="u-copy u-aside-copy">Escolha o momento mais confortável. O fuso horário é detectado automaticamente.</p>
            </div>
            <div className="booking-meta u-hide-small">
              <span><Clock3 size={13} /> 30 minutos</span>
              <span><MapPin size={13} /> Horário de Brasília</span>
            </div>
          </aside>

          <main className="u-main booking-main">
            <AnimatePresence mode="wait" initial={false}>
              {confirmed ? (
                <motion.div key="confirmed" className="booking-confirmed" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, x: 20 }} transition={utilitySpring}>
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ ...utilityQuickSpring, delay: 0.08 }}><Check size={24} /></motion.span>
                  <span className="u-kicker">Reserva confirmada</span>
                  <h3>14 de agosto, às {time}</h3>
                  <p>{online ? "O link da videochamada chegará por e-mail." : "Enviaremos o endereço e as orientações."}</p>
                  <button type="button" className="u-secondary" onClick={() => setConfirmed(false)}><ArrowLeft size={14} /> Alterar horário</button>
                </motion.div>
              ) : (
                <motion.div key="calendar" initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }} transition={utilitySpring}>
                  <div className="u-row booking-month">
                    <div><span className="u-kicker">Agosto 2026</span><b>Escolha um dia</b></div>
                    <div><button type="button" className="u-icon-button"><ChevronLeft size={14} /></button><button type="button" className="u-icon-button"><ChevronRight size={14} /></button></div>
                  </div>

                  <div className="booking-days" role="grid" aria-label="Dias disponíveis">
                    {days.slice(0, size === "small" ? 7 : 14).map((item) => (
                      <button
                        type="button"
                        key={item.day}
                        disabled={!item.available}
                        className={day === item.day ? "is-active" : undefined}
                        onClick={() => setDay(item.day)}
                      >
                        <small>{["SEG", "TER", "QUA", "QUI", "SEX", "SÁB", "DOM"][(item.day - 10) % 7]}</small>
                        <span>{item.day}</span>
                      </button>
                    ))}
                  </div>

                  <div className="booking-times" aria-label="Horários disponíveis">
                    {times.slice(0, size === "small" ? 3 : 5).map((item) => (
                      <button type="button" key={item} className={time === item ? "is-active" : undefined} onClick={() => setTime(item)}>{item}</button>
                    ))}
                  </div>

                  <button type="button" className="booking-format" onClick={() => setOnline((value) => !value)}>
                    <span className="u-list-icon">{online ? <Video size={15} /> : <MapPin size={15} />}</span>
                    <span><b>{online ? "Videochamada" : "Encontro presencial"}</b><small>{online ? "Google Meet" : "Centro, Florianópolis"}</small></span>
                    <ChevronRight size={14} />
                  </button>

                  <button type="button" className="u-primary booking-submit" onClick={() => setConfirmed(true)}>
                    Reservar dia {day}, às {time} <ArrowRight size={14} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        </div>
      )}
    </UtilityShowcase>
  );
}
