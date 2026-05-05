import { motion } from "framer-motion";
import { ChapterShell, SmallCaps, GoldRule } from "../ChapterShell";
import { SailMark } from "../marks/SailMark";
import { worries, fears } from "@/data/winds";
import lakeDusk from "@/assets/photos/lake-dusk.jpeg";
import sailboat from "@/assets/photos/sailboat-tube.jpeg";

const Col = ({ title, items, delay }: { title: string; items: string[]; delay: number }) => (
  <div>
    <SmallCaps>{title}</SmallCaps>
    <GoldRule className="mt-4 w-24" />
    <ul className="mt-8 space-y-5">
      {items.map((t, idx) => (
        <motion.li key={t} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: delay + idx * 0.08 }}
          className="font-garamond text-xl md:text-2xl leading-snug text-foreground border-l border-gold/40 pl-5 hover:border-gold transition-colors">
          {t}
        </motion.li>
      ))}
    </ul>
  </div>
);

export const Winds = () => (
  <ChapterShell>
    <div className="absolute inset-0 opacity-[0.10] pointer-events-none">
      <img src={lakeDusk} className="h-full w-full object-cover" alt="" />
      <div className="absolute inset-0 bg-gradient-to-b from-paper/70 via-paper/40 to-paper/80" />
    </div>
    <div className="relative h-full w-full px-12 md:px-20 py-16 flex flex-col">
      <div className="flex items-center justify-between">
        <SmallCaps>Chapter II · The Winds</SmallCaps>
        <SmallCaps className="text-gold">Worries · Fears</SmallCaps>
      </div>
      <div className="mt-8 grid grid-cols-12 gap-12 flex-1">
        <div className="col-span-5">
          <Col title="The Winds I See" items={worries} delay={0.2} />
        </div>
        <div className="col-span-2 flex flex-col items-center justify-center">
          <motion.div animate={{ skewX: [0, -2, 0, 2, 0] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}>
            <SailMark size={200} />
          </motion.div>
          <div className="mt-6 h-32 w-px bg-gradient-to-b from-transparent via-gold to-transparent" />
        </div>
        <div className="col-span-5">
          <Col title="The Winds I Fear" items={fears} delay={0.4} />
        </div>
      </div>
      <div className="mt-10 text-center font-serif italic text-foreground/70">
        Naming the wind is how I begin to set the sail.
      </div>
      <div className="absolute bottom-6 right-8 w-28 h-36 border border-gold/40 bg-paper p-1 rotate-[3deg] shadow-md opacity-70">
        <img src={sailboat} className="h-full w-full object-cover" alt="Sailboat" />
      </div>
    </div>
  </ChapterShell>
);
