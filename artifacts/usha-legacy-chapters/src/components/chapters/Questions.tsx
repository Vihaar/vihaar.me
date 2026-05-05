import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChapterShell, SmallCaps, GoldRule } from "../ChapterShell";
import { SailMark } from "../marks/SailMark";

const cards = [
  { title: "Path to $100M", q: "What is the most capital-efficient route from $34M to $100M over 10–15 years — given my risk capacity, time horizon, and existing concentration?" },
  { title: "Allocation Strategy", q: "How should I balance public vs private, US vs India, and direct vs fund — without over-diversifying away returns?" },
  { title: "Family Independence vs Support", q: "How much should I support my sons financially, and where does support quietly become a ceiling on their own building?" },
  { title: "Ambition & Spirituality", q: "How do I hold a $100M ambition and a daily spiritual practice in the same hand without one diluting the other?" },
];

export const Questions = () => {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <ChapterShell>
      <div className="h-full w-full px-16 py-14 flex flex-col">
        <SmallCaps>Chapter IX · For the Room</SmallCaps>
        <h2 className="font-serif text-5xl mt-4">Where I need your help.</h2>
        <GoldRule className="my-8 w-40" />
        <div className="grid grid-cols-2 gap-6 flex-1">
          {cards.map((c, i) => (
            <button key={c.title} onClick={() => setOpen(open === i ? null : i)}
              className="text-left border border-rule bg-paper/60 p-7 hover:border-gold transition-colors flex flex-col">
              <div className="flex items-baseline justify-between">
                <span className="tabular text-xs text-foreground/40">0{i + 1}</span>
                <span className="smallcaps text-gold">Open</span>
              </div>
              <div className="font-serif text-3xl mt-3">{c.title}</div>
              <AnimatePresence>
                {open === i && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                    <p className="font-garamond text-lg mt-5 text-foreground/85 leading-relaxed">{c.q}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          ))}
        </div>
        <div className="mt-10 flex items-center justify-center gap-6">
          <div className="h-px w-32 bg-gold/60" />
          <div className="text-center">
            <div className="font-serif italic text-xl">You cannot control the winds, but you can set your sails.</div>
            <SailMark size={80} className="mx-auto mt-2" />
          </div>
          <div className="h-px w-32 bg-gold/60" />
        </div>
      </div>
    </ChapterShell>
  );
};
