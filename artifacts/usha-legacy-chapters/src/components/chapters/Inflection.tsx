import { motion } from "framer-motion";
import { ChapterShell, SmallCaps } from "../ChapterShell";
import tribute from "@/assets/photos/anniversary-tribute.jpg";
import frozen from "@/assets/photos/frozen-lake-solo.jpeg";
import youngSons from "@/assets/photos/narasimha-young-sons.jpeg";
import coupleFormal from "@/assets/photos/couple-formal-saree.jpeg";
import coupleTable from "@/assets/photos/couple-table-candid.jpeg";
import youngFamily from "@/assets/photos/young-family-toddler.jpeg";

export const Inflection = () => (
  <ChapterShell tone="ink">
    <div className="absolute inset-0 opacity-20">
      <img src={frozen} className="h-full w-full object-cover" alt="" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/70 to-ink/40" />
    </div>
    <div className="relative h-full w-full grid grid-cols-12 gap-10 px-14 py-14">
      <div className="col-span-5 flex flex-col justify-center">
        <SmallCaps className="text-gold">Chapter V · Inflection</SmallCaps>
        <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2 }}
          className="font-serif italic text-6xl mt-8 leading-[1.05] text-paper">
          October 2024.
        </motion.h2>
        <ul className="mt-10 font-garamond text-lg text-paper/80 space-y-2">
          <li>· 6.5 years caregiver</li>
          <li>· Loss of Narasimha</li>
          <li>· Partner · intellect · standard-bearer</li>
          <li>· Pause → perspective shift</li>
        </ul>
      </div>
      <div className="col-span-7 flex flex-col items-center justify-center gap-3">
        <div className="bg-paper p-3 shadow-2xl">
          <img src={tribute} className="max-h-[55vh] w-auto object-contain" alt="Anniversary tribute" />
        </div>
        <div className="flex gap-3 flex-wrap justify-center">
          {[coupleFormal, youngSons, youngFamily, coupleTable].map((src, i) => (
            <div key={i} className={`bg-paper p-1.5 shadow-xl w-28 h-28 ${i%2 ? "rotate-[2deg]" : "rotate-[-2deg]"}`}>
              <img src={src} className="h-full w-full object-cover" alt="" />
            </div>
          ))}
        </div>
      </div>
    </div>
  </ChapterShell>
);
