"use client";

import { useMemo, useState } from "react";
import { ArrowRight, Check, Minus, Package, Plus, ShoppingBag, Sparkles, Tag, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type { PatternPreviewProps } from "@/types/pattern";
import { UtilityShowcase, utilityQuickSpring, utilitySpring } from "@/patterns/utilities/shared/utility-showcase";

const initialItems = [
  { id: 1, name: "Luminária Nébula", variant: "Areia · 42 cm", price: 389, quantity: 1, tone: "coral" },
  { id: 2, name: "Vaso Horizonte", variant: "Fumê · médio", price: 218, quantity: 2, tone: "blue" },
  { id: 3, name: "Manta Bruma", variant: "Linho · natural", price: 174, quantity: 1, tone: "mint" },
  { id: 4, name: "Bandeja Orbe", variant: "Freijó · 34 cm", price: 146, quantity: 1, tone: "coral" },
  { id: 5, name: "Almofada Aurora", variant: "Bouclé · areia", price: 129, quantity: 2, tone: "blue" },
  { id: 6, name: "Difusor Sereno", variant: "Cedro · 250 ml", price: 98, quantity: 1, tone: "mint" },
];

export default function ShoppingCart(props: PatternPreviewProps) {
  const [items, setItems] = useState(initialItems);
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(false);
  const subtotal = useMemo(() => items.reduce((sum, item) => sum + item.price * item.quantity, 0), [items]);
  const total = subtotal - (discount ? 80 : 0);

  const changeQuantity = (id: number, amount: number) => {
    setItems((current) => current
      .map((item) => item.id === id ? { ...item, quantity: Math.max(0, item.quantity + amount) } : item)
      .filter((item) => item.quantity > 0));
  };

  return (
    <UtilityShowcase
      {...props}
      eyebrow="Compra sem atrito"
      title="Carrinho inteligente"
      description="Itens, quantidades, benefício e resumo financeiro reagem juntos sem perder o contexto da compra."
      accent={props.accent ?? "#c86f55"}
    >
      {({ size }) => (
        <div className="utility-view u-split cart-view">
          <aside className="u-aside cart-aside">
            <div className="u-brand"><span className="u-brand-mark"><ShoppingBag size={16} /></span> Casa Lume</div>
            <div>
              <span className="u-kicker">Sua seleção</span>
              <span className="cart-count"><AnimatePresence mode="popLayout" initial={false}><motion.span key={items.length} initial={{ opacity: 0, y: 7, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -7, scale: 0.9 }} transition={utilityQuickSpring}>{items.length}</motion.span></AnimatePresence></span>
              <p className="u-copy">peças escolhidas com cuidado, prontas para seguir até você.</p>
            </div>
            <div className="cart-benefit u-hide-small"><Sparkles size={14} /><span><b>Frete cortesia</b><small>Você desbloqueou este benefício.</small></span></div>
          </aside>

          <main className="u-main cart-main">
            <div className="u-row cart-head"><div><span className="u-kicker">Meu carrinho</span><b>Revise sua escolha</b></div><Package size={16} /></div>
            <motion.ul layout className="u-list cart-items">
              <AnimatePresence mode="popLayout" initial={false}>
                {items.slice(0, size === "small" ? 3 : size === "medium" ? 5 : 6).map((item) => (
                  <motion.li layout key={item.id} className="u-list-item cart-item" initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 25, scale: 0.95 }} transition={utilitySpring}>
                    <span className={`cart-product tone-${item.tone}`}><Package size={17} /></span>
                    <div className="u-grow"><b>{item.name}</b><small>{item.variant}</small><strong>R$ {item.price.toFixed(2).replace(".", ",")}</strong></div>
                    <div className="cart-quantity">
                      <motion.button type="button" onClick={() => changeQuantity(item.id, -1)} aria-label={`Diminuir quantidade de ${item.name}`} whileTap={{ scale: 0.75, rotate: -8 }} transition={utilityQuickSpring}><Minus size={11} /></motion.button>
                      <AnimatePresence mode="popLayout" initial={false}><motion.span key={item.quantity} initial={{ opacity: 0, scale: 0.55, y: 4 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.55, y: -4 }} transition={utilityQuickSpring}>{item.quantity}</motion.span></AnimatePresence>
                      <motion.button type="button" onClick={() => changeQuantity(item.id, 1)} aria-label={`Aumentar quantidade de ${item.name}`} whileTap={{ scale: 0.75, rotate: 8 }} transition={utilityQuickSpring}><Plus size={11} /></motion.button>
                    </div>
                    <motion.button type="button" className="cart-remove" onClick={() => setItems((current) => current.filter((entry) => entry.id !== item.id))} aria-label={`Remover ${item.name}`} whileTap={{ scale: 0.78, rotate: 7 }} transition={utilityQuickSpring}><Trash2 size={13} /></motion.button>
                  </motion.li>
                ))}
              </AnimatePresence>
            </motion.ul>

            <AnimatePresence mode="popLayout" initial={false}>
              {items.length === 0 ? (
                <motion.div key="empty" className="u-empty" initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.94 }} transition={utilitySpring}><ShoppingBag size={24} /><b>Seu carrinho está leve.</b><small>Explore a coleção para começar.</small></motion.div>
              ) : (
                <motion.div key="summary" layout className="cart-summary" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} transition={utilitySpring}>
                  {size !== "small" ? (
                    <form className="cart-coupon" onSubmit={(event) => { event.preventDefault(); if (coupon.trim()) setDiscount(true); }}>
                      <label className="u-input-wrap"><Tag size={14} /><input value={coupon} onChange={(event) => { setCoupon(event.target.value); setDiscount(false); }} placeholder="Código de benefício" /></label>
                      <motion.button type="submit" className="u-secondary" whileTap={{ scale: 0.92 }} transition={utilityQuickSpring}>
                        <AnimatePresence mode="popLayout" initial={false}>
                          <motion.span key={discount ? "applied" : "apply"} initial={{ opacity: 0, y: 4, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -4, scale: 0.9 }} transition={utilityQuickSpring} style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
                            {discount ? <Check size={13} /> : null}{discount ? "Aplicado" : "Aplicar"}
                          </motion.span>
                        </AnimatePresence>
                      </motion.button>
                    </form>
                  ) : null}
                  <div className="cart-total"><span>Total estimado<small>Impostos incluídos</small></span><AnimatePresence mode="popLayout" initial={false}><motion.b key={total} initial={{ opacity: 0, y: 5, scale: 0.94 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -5, scale: 0.94 }} transition={utilityQuickSpring}>R$ {total.toFixed(2).replace(".", ",")}</motion.b></AnimatePresence></div>
                  <motion.button type="button" className="u-primary" whileTap={{ scale: 0.97 }} transition={utilityQuickSpring}>Continuar compra <ArrowRight size={14} /></motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        </div>
      )}
    </UtilityShowcase>
  );
}
