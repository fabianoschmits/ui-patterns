"use client";

import { useId, useState } from "react";
import { ArrowLeft, ArrowRight, Check, CreditCard, LockKeyhole, MapPin, PackageCheck, ShieldCheck, Truck } from "lucide-react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import type { PatternPreviewProps } from "@/types/pattern";
import { UtilityLiquidIndicator, UtilityShowcase, utilityQuickSpring, utilitySpring } from "@/patterns/utilities/shared/utility-showcase";

const steps = ["Entrega", "Pagamento", "Revisão"];

export default function CheckoutFlow(props: PatternPreviewProps) {
  const uid = useId().replace(/:/g, "");
  const [step, setStep] = useState(0);
  const [complete, setComplete] = useState(false);
  const [shipping, setShipping] = useState("express");
  const [saveCard, setSaveCard] = useState(true);

  const next = () => {
    if (step < 2) setStep((value) => value + 1);
    else setComplete(true);
  };

  return (
    <UtilityShowcase
      {...props}
      eyebrow="Jornada de conversão"
      title="Checkout progressivo"
      description="Uma compra dividida em passos claros, com continuidade visual, revisão fácil e finalização confiante."
      accent={props.accent ?? "#397d72"}
    >
      {({ size }) => (
        <div className="utility-view u-split checkout-view">
          <aside className="u-aside checkout-aside">
            <div className="u-brand"><span className="u-brand-mark"><LockKeyhole size={15} /></span> Checkout seguro</div>
            <div>
              <span className="u-kicker">Pedido #4826</span>
              <h2 className="u-title">Tudo certo para chegar até você.</h2>
              <p className="u-copy u-aside-copy">Seus dados ficam protegidos do primeiro ao último passo.</p>
            </div>
            <div className="checkout-order u-hide-small"><PackageCheck size={18} /><span><b>3 itens · R$ 905,00</b><small>Frete expresso incluído</small></span></div>
          </aside>

          <main className="u-main checkout-main">
            <LayoutGroup id={`checkout-steps-${uid}`}>
              <div className="checkout-steps checkout-liquid-steps" aria-label="Progresso da compra">
                {steps.map((label, index) => {
                  const active = index === step;
                  const done = index < step;
                  return (
                    <motion.button
                      type="button"
                      key={label}
                      className={active ? "is-active" : done ? "is-done" : ""}
                      aria-current={active ? "step" : undefined}
                      onClick={() => !complete && setStep(index)}
                      whileTap={{ scale: 0.94 }}
                      transition={utilityQuickSpring}
                    >
                      <motion.span
                        className="checkout-step-liquid-marker"
                        animate={{ y: active ? -2 : 0, scale: active ? 1.07 : 1 }}
                        transition={utilityQuickSpring}
                      >
                        {active ? (
                          <UtilityLiquidIndicator
                            layoutId={`checkout-step-indicator-${uid}`}
                            className="checkout-step-liquid-indicator"
                          />
                        ) : null}
                        <AnimatePresence mode="popLayout" initial={false}>
                          <motion.span
                            key={done ? "done" : `step-${index}`}
                            className="checkout-step-liquid-value"
                            initial={{ opacity: 0, scale: 0.6, rotate: -16 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            exit={{ opacity: 0, scale: 0.65, rotate: 16 }}
                            transition={utilityQuickSpring}
                          >
                            {done ? <Check size={11} /> : index + 1}
                          </motion.span>
                        </AnimatePresence>
                      </motion.span>
                      <motion.small
                        animate={{ y: active ? -1 : 0, scale: active ? 1.03 : 1 }}
                        transition={utilityQuickSpring}
                      >
                        {label}
                      </motion.small>
                    </motion.button>
                  );
                })}
                <motion.i
                  style={{ transformOrigin: "left center" }}
                  animate={{ scaleX: step / 2 }}
                  transition={utilitySpring}
                />
              </div>
            </LayoutGroup>

            <AnimatePresence mode="popLayout" initial={false}>
              {complete ? (
                <motion.div key="complete" className="checkout-complete" initial={{ opacity: 0, scale: 0.88 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.94, y: -8 }} transition={utilitySpring}>
                  <motion.span initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ ...utilityQuickSpring, delay: 0.1 }}><Check size={24} /></motion.span>
                  <span className="u-kicker">Pedido confirmado</span><h3>Agora é com a gente.</h3><p>Você receberá atualizações enquanto o pedido percorre o caminho até sua casa.</p>
                  <button type="button" className="u-secondary" onClick={() => { setComplete(false); setStep(0); }}>Acompanhar outro fluxo</button>
                </motion.div>
              ) : (
                <motion.div key={step} className="checkout-pane" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={utilitySpring}>
                  {step === 0 ? <Delivery shipping={shipping} onShipping={setShipping} compact={size === "small"} indicatorId={`checkout-shipping-indicator-${uid}`} /> : null}
                  {step === 1 ? <Payment saveCard={saveCard} onSaveCard={setSaveCard} compact={size === "small"} /> : null}
                  {step === 2 ? <Review compact={size === "small"} /> : null}
                </motion.div>
              )}
            </AnimatePresence>

            {!complete ? <div className="checkout-actions"><button type="button" className="u-secondary" disabled={step === 0} onClick={() => setStep((value) => Math.max(0, value - 1))}><ArrowLeft size={14} /> Voltar</button><button type="button" className="u-primary" onClick={next}>{step === 2 ? "Confirmar pedido" : "Continuar"} <ArrowRight size={14} /></button></div> : null}
          </main>
        </div>
      )}
    </UtilityShowcase>
  );
}

function Delivery({
  shipping,
  onShipping,
  compact,
  indicatorId,
}: {
  shipping: string;
  onShipping: (value: string) => void;
  compact: boolean;
  indicatorId: string;
}) {
  const shippingOptions = [
    { id: "express", icon: Truck, title: "Expresso", copy: "Amanhã · grátis" },
    { id: "standard", icon: PackageCheck, title: "Consciente", copy: compact ? "4 dias" : "4 dias · menos emissões" },
  ];

  return (
    <>
      <span className="u-kicker">Onde entregar</span>
      <h3 className="checkout-title">Endereço e envio</h3>
      <div className="checkout-address">
        <MapPin size={15} />
        <span><b>Rua das Acácias, 128</b><small>Florianópolis · SC · 88000-120</small></span>
        <button type="button">Editar</button>
      </div>
      <LayoutGroup id={`${indicatorId}-group`}>
        <div className="checkout-options checkout-liquid-shipping" role="radiogroup" aria-label="Método de entrega">
          {shippingOptions.map(({ id, icon: Icon, title, copy }) => {
            const active = shipping === id;
            return (
              <motion.button
                type="button"
                role="radio"
                key={id}
                className={active ? "is-active" : ""}
                aria-checked={active}
                onClick={() => onShipping(id)}
                whileTap={{ scale: 0.96 }}
                transition={utilityQuickSpring}
              >
                {active ? (
                  <UtilityLiquidIndicator
                    layoutId={indicatorId}
                    tone="outline"
                    className="checkout-shipping-liquid-indicator"
                  />
                ) : null}
                <motion.span
                  className="checkout-shipping-liquid-icon"
                  animate={{ y: active ? -2 : 0, scale: active ? 1.08 : 1 }}
                  transition={utilityQuickSpring}
                >
                  <Icon size={16} />
                </motion.span>
                <span className="checkout-shipping-liquid-copy"><b>{title}</b><small>{copy}</small></span>
                <motion.i
                  className="checkout-shipping-liquid-radio"
                  animate={{ scale: active ? 1.08 : 1 }}
                  transition={utilityQuickSpring}
                />
              </motion.button>
            );
          })}
        </div>
      </LayoutGroup>
    </>
  );
}

function Payment({ saveCard, onSaveCard, compact }: { saveCard: boolean; onSaveCard: (value: boolean) => void; compact: boolean }) {
  return <><span className="u-kicker">Pagamento protegido</span><h3 className="checkout-title">Dados do cartão</h3><div className="checkout-card"><div><CreditCard size={18} /><ShieldCheck size={16} /></div><label><small>Número do cartão</small><span>•••• •••• •••• 4826</span></label><div><label><small>Validade</small><span>10 / 29</span></label><label><small>CVC</small><span>•••</span></label></div></div>{!compact ? <button type="button" className="checkout-save" onClick={() => onSaveCard(!saveCard)}><span className={`u-switch${saveCard ? " is-on" : ""}`}><motion.i animate={{ x: saveCard ? 16 : 0 }} transition={utilityQuickSpring} /></span><span><b>Salvar para a próxima compra</b><small>Protegido por criptografia</small></span></button> : null}</>;
}

function Review({ compact }: { compact: boolean }) {
  return <><span className="u-kicker">Última conferência</span><h3 className="checkout-title">Revise e confirme</h3><div className="checkout-review"><div><MapPin size={15} /><span><b>Entrega expressa</b><small>Rua das Acácias, 128 · amanhã</small></span></div><div><CreditCard size={15} /><span><b>Mastercard final 4826</b><small>Cobrança única e protegida</small></span></div>{!compact ? <div><ShieldCheck size={15} /><span><b>Compra protegida</b><small>Troca simples por até 30 dias</small></span></div> : null}</div><div className="checkout-total"><span>Total</span><b>R$ 905,00</b></div></>;
}
