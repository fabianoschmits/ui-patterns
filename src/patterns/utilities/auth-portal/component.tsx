"use client";

import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  AtSign,
  Check,
  Eye,
  EyeOff,
  Fingerprint,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type { PatternPreviewProps } from "@/types/pattern";
import {
  UtilityShowcase,
  utilityQuickSpring,
  utilitySpring,
} from "@/patterns/utilities/shared/utility-showcase";
import { cn } from "@/lib/utils";
import "./auth-portal.css";

type AuthMode = "login" | "register" | "recovery";

const modeCopy: Record<AuthMode, { kicker: string; title: string; copy: string }> = {
  login: {
    kicker: "Que bom ter você aqui",
    title: "Entre no seu espaço.",
    copy: "Retome projetos, conversas e ideias exatamente de onde parou.",
  },
  register: {
    kicker: "Comece com calma",
    title: "Crie algo que é seu.",
    copy: "Uma conta simples, protegida e pronta para acompanhar o seu ritmo.",
  },
  recovery: {
    kicker: "Sem preocupação",
    title: "Vamos recuperar o acesso.",
    copy: "Enviaremos um link seguro para você definir uma nova senha.",
  },
};

export default function AuthPortal(props: PatternPreviewProps) {
  const [mode, setMode] = useState<AuthMode>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [complete, setComplete] = useState(false);
  const copy = modeCopy[mode];
  const alternateMode: AuthMode = mode === "register" ? "login" : mode === "recovery" ? "login" : "register";

  const changeMode = (next: AuthMode) => {
    setComplete(false);
    setMode(next);
  };

  return (
    <UtilityShowcase
      {...props}
      eyebrow="Autenticação fluida"
      title="Login & Cadastro"
      description="Um portal de acesso delicado, com transições contínuas entre entrada, criação de conta e recuperação."
      accent={props.accent ?? "#10b9ae"}
    >
      {({ size }) => (
        <div className="utility-view u-split auth-view">
          <motion.aside layout className="u-aside auth-aside" transition={utilitySpring}>
            <div className="u-brand">
              <span className="u-brand-mark"><Sparkles size={16} /></span>
              Lume
            </div>

            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={mode}
                className="auth-aside-copy"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={utilitySpring}
              >
                <span className="u-kicker">{copy.kicker}</span>
                <h2 className="u-title">{copy.title}</h2>
                <p className="u-copy">{copy.copy}</p>
              </motion.div>
            </AnimatePresence>

            <div className="auth-trust u-hide-small">
              <span><ShieldCheck size={14} /> Proteção inteligente</span>
              <span><Fingerprint size={14} /> Acesso sem atrito</span>
            </div>
          </motion.aside>

          <motion.div layout className="u-main auth-main" transition={utilitySpring}>
            <div className="auth-main-shell">
              <div className="auth-mode-toolbar">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={`prompt-${mode}`}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={utilitySpring}
                  >
                    {mode === "login" ? "Ainda não tem conta?" : mode === "register" ? "Já tem uma conta?" : "Lembrou sua senha?"}
                  </motion.span>
                </AnimatePresence>
                <motion.button
                  layout
                  type="button"
                  className="auth-mode-switch"
                  onClick={() => changeMode(alternateMode)}
                  whileTap={{ scale: 0.94 }}
                  transition={utilityQuickSpring}
                >
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.span
                      key={`switch-${mode}`}
                      initial={{ opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -8 }}
                      transition={utilityQuickSpring}
                    >
                      {mode === "login" ? "Criar conta" : "Entrar"}
                    </motion.span>
                  </AnimatePresence>
                  <motion.i animate={{ rotate: mode === "register" || mode === "recovery" ? 180 : 0 }} transition={utilityQuickSpring}>
                    <ArrowRight size={13} />
                  </motion.i>
                </motion.button>
              </div>

              <AnimatePresence mode="popLayout" initial={false}>
                {complete ? (
                  <motion.div
                  key="complete"
                  className="auth-complete"
                  initial={{ opacity: 0, scale: 0.9, y: 16 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.94 }}
                  transition={utilitySpring}
                >
                  <motion.span
                    initial={{ scale: 0, rotate: -35 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ ...utilitySpring, delay: 0.08 }}
                  >
                    <Check size={24} />
                  </motion.span>
                  <span className="u-kicker">Tudo certo</span>
                  <h3>{mode === "recovery" ? "Confira seu e-mail" : "Acesso liberado"}</h3>
                  <p>
                    {mode === "register"
                      ? "Sua conta foi criada e já está pronta para receber novas ideias."
                      : mode === "recovery"
                        ? "O link seguro chegará em instantes."
                        : "Sua área pessoal está sendo preparada."}
                  </p>
                  <button type="button" className="u-secondary" onClick={() => setComplete(false)}>
                    <ArrowLeft size={14} /> Voltar ao formulário
                  </button>
                  </motion.div>
                ) : (
                  <motion.div
                  key={mode}
                  className="auth-screen"
                  initial={{ opacity: 0, x: mode === "register" ? 24 : -18 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: mode === "register" ? -20 : 20 }}
                  transition={utilitySpring}
                >
                  <div className="auth-form-head">
                    <span className="u-kicker">
                      {mode === "login" ? "Acesso pessoal" : mode === "register" ? "Nova conta" : "Recuperação"}
                    </span>
                    <h3>
                      {mode === "login" ? "Bem-vindo de volta" : mode === "register" ? "Vamos começar" : "Qual é seu e-mail?"}
                    </h3>
                  </div>

                  <form
                    className="u-form auth-form"
                    onSubmit={(event) => {
                      event.preventDefault();
                      setComplete(true);
                    }}
                  >
                    {mode === "register" ? (
                      <label className="u-field">
                        Nome
                        <span className="u-input-wrap">
                          <UserRound size={15} />
                          <input required placeholder="Como podemos chamar você?" />
                        </span>
                      </label>
                    ) : null}

                    <label className="u-field">
                      E-mail
                      <span className="u-input-wrap">
                        <AtSign size={15} />
                        <input required type="email" placeholder="voce@exemplo.com" />
                      </span>
                    </label>

                    {mode !== "recovery" ? (
                      <label className="u-field">
                        Senha
                        <span className="u-input-wrap">
                          <LockKeyhole size={15} />
                          <input
                            required
                            minLength={6}
                            type={showPassword ? "text" : "password"}
                            placeholder={mode === "register" ? "Mínimo de 6 caracteres" : "Sua senha"}
                          />
                          <button
                            type="button"
                            aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                            onClick={() => setShowPassword((value) => !value)}
                          >
                            {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                          </button>
                        </span>
                      </label>
                    ) : null}

                    {mode === "login" ? (
                      <div className="u-row auth-options">
                        <button
                          type="button"
                          className="auth-check"
                          aria-pressed={remember}
                          onClick={() => setRemember((value) => !value)}
                        >
                          <span className={cn(remember && "is-checked")}>
                            {remember ? <Check size={11} /> : null}
                          </span>
                          Lembrar de mim
                        </button>
                        <button type="button" className="u-link-button" onClick={() => changeMode("recovery")}>
                          Esqueci a senha
                        </button>
                      </div>
                    ) : null}

                    <motion.button
                      type="submit"
                      className="u-primary"
                      whileTap={{ scale: 0.96 }}
                      transition={utilityQuickSpring}
                    >
                      {mode === "login" ? "Entrar" : mode === "register" ? "Criar minha conta" : "Enviar link seguro"}
                      <ArrowRight size={15} />
                    </motion.button>
                  </form>

                  {mode !== "recovery" && size !== "small" ? (
                    <>
                      <div className="u-divider">ou continue com</div>
                      <div className="auth-social">
                        <button type="button" className="u-secondary">G</button>
                        <button type="button" className="u-secondary">Apple</button>
                      </div>
                    </>
                  ) : null}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </UtilityShowcase>
  );
}
