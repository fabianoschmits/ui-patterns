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
              <motion.span className="cart-count" key={items.length} initial={{ opacity: 0, y: 7 }} animate={{ opacity: 1, y: 0 }}>{items.length}</motion.span>
              <p className="u-copy">peças escolhidas com cuidado, prontas para seguir até você.</p>
            </div>
            <div className="cart-benefit u-hide-small"><Sparkles size={14} /><span><b>Frete cortesia</b><small>Você desbloqueou este benefício.</small></span></div>
          </aside>

          <main className="u-main cart-main">
            <div className="u-row cart-head"><div><span className="u-kicker">Meu carrinho</span><b>Revise sua escolha</b></div><Package size={16} /></div>
            <motion.ul layout className="u-list cart-items">
              <AnimatePresence mode="popLayout" initial={false}>
                {items.slice(0, size === "small" ? 2 : 3).map((item) => (
                  <motion.li layout key={item.id} className="u-list-item cart-item" initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 25, scale: 0.95 }} transition={utilitySpring}>
                    <span className={`cart-product tone-${item.tone}`}><Package size={17} /></span>
                    <div className="u-grow"><b>{item.name}</b><small>{item.variant}</small><strong>R$ {item.price.toFixed(2).replace(".", ",")}</strong></div>
                    <div className="cart-quantity">
                      <button type="button" onClick={() => changeQuantity(item.id, -1)} aria-label="Diminuir"><Minus size={11} /></button>
                      <motion.span key={item.quantity} initial={{ scale: 0.5 }} animate={{ scale: 1 }}>{item.quantity}</motion.span>
                      <button type="button" onClick={() => changeQuantity(item.id, 1)} aria-label="Aumentar"><Plus size={11} /></button>
                    </div>
                    <button type="button" className="cart-remove" onClick={() => setItems((current) => current.filter((entry) => entry.id !== item.id))} aria-label={`Remover ${item.name}`}><Trash2 size={13} /></button>
                  </motion.li>
                ))}
              </AnimatePresence>
            </motion.ul>

            {items.length === 0 ? <motion.div className="u-empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}><ShoppingBag size={24} /><b>Seu carrinho está leve.</b><small>Explore a coleção para começar.</small></motion.div> : (
              <div className="cart-summary">
                {size !== "small" ? (
                  <form className="cart-coupon" onSubmit={(event) => { event.preventDefault(); if (coupon.trim()) setDiscount(true); }}>
                    <label className="u-input-wrap"><Tag size={14} /><input value={coupon} onChange={(event) => setCoupon(event.target.value)} placeholder="Código de benefício" /></label>
                    <button type="submit" className="u-secondary">{discount ? <Check size={13} /> : "Aplicar"}</button>
                  </form>
                ) : null}
                <div className="cart-total"><span>Total estimado<small>Impostos incluídos</small></span><motion.b key={total} initial={{ opacity: 0.4, y: -4 }} animate={{ opacity: 1, y: 0 }}>R$ {total.toFixed(2).replace(".", ",")}</motion.b></div>
                <motion.button type="button" className="u-primary" whileTap={{ scale: 0.97 }} transition={utilityQuickSpring}>Continuar compra <ArrowRight size={14} /></motion.button>
              </div>
            )}
          </main>
        </div>
      )}
    </UtilityShowcase>
  );
}
