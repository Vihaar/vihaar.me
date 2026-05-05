import { motion } from "framer-motion";
import { ChapterShell, SmallCaps, GoldRule } from "../ChapterShell";
import { SailMark, CompassMark } from "../marks/SailMark";
import village from "@/assets/photos/village-house.jpg";
import album1976 from "@/assets/photos/album-1976.jpeg";
import ushaGirl from "@/assets/photos/usha-girl-bw-dress.jpeg";
import karate from "@/assets/photos/karate-kick.jpeg";
import fatherNarasimha from "@/assets/photos/father-narasimha-kurta.jpeg";
import friends from "@/assets/photos/usha-friend-rooftop.jpeg";
import gardenVintage from "@/assets/photos/family-garden-vintage.jpeg";
import sistersSarees from "@/assets/photos/three-sisters-sarees.jpeg";

export const Roots = () => (
  <ChapterShell tone="warm">
    <div className="absolute inset-0 grid grid-cols-12 gap-8 p-12 md:p-16">
      <div className="col-span-5 flex flex-col justify-center relative z-10">
        <SmallCaps>Chapter I · Roots</SmallCaps>
        <h1 className="font-serif italic text-5xl md:text-7xl leading-[1.05] mt-6 text-foreground">
          Set your<br/><span className="not-italic">sails.</span>
        </h1>
        <div className="mt-4 text-sm tracking-widest text-gold-deep">— Seneca</div>
        <GoldRule className="my-8 w-40" />
        <ul className="font-garamond text-xl leading-relaxed text-foreground/85 space-y-2">
          <li>· Born — rural Ongole, India</li>
          <li>· Farming family · 10 acres</li>
          <li>· Jamshedpur → Hyderabad</li>
          <li>· Father: paralyzed at 5 · quiet drive</li>
          <li>· Holy Mary High · elected leader</li>
          <li>· Rank 933 · top 1%</li>
        </ul>
      </div>
      <div className="col-span-7 relative">
        <motion.div initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.4 }}
          className="relative h-full w-full vignette warm-overlay">
          <img src={village} className="absolute inset-0 h-full w-full object-cover" alt="Village house in India" />
        </motion.div>
        <div className="absolute -bottom-4 -left-4 w-40 h-52 border border-gold/60 bg-paper p-1 rotate-[-3deg] shadow-md">
          <img src={karate} className="h-full w-full object-cover" alt="Karate competition, youth" />
        </div>
        <div className="absolute -top-2 -right-2 w-36 h-44 border border-gold/60 bg-paper p-1 rotate-[2deg] shadow-md">
          <img src={fatherNarasimha} className="h-full w-full object-cover" alt="Father and Narasimha" />
        </div>
        <div className="absolute top-24 -left-6 w-32 h-40 border border-gold/60 bg-paper p-1 rotate-[6deg] shadow-md">
          <img src={friends} className="h-full w-full object-cover" alt="Usha with a friend" />
        </div>
        <div className="absolute top-1/2 -right-6 w-40 h-48 border border-gold/60 bg-paper p-1 rotate-[5deg] shadow-md">
          <img src={gardenVintage} className="h-full w-full object-cover" alt="Family in the garden" />
        </div>
        <div className="absolute -bottom-6 right-12 w-36 h-44 border border-gold/60 bg-paper p-1 rotate-[-4deg] shadow-md">
          <img src={ushaGirl} className="h-full w-full object-cover" alt="Usha as a child" />
        </div>
        <div className="absolute bottom-20 -right-10 w-32 h-40 border border-gold/60 bg-paper p-1 rotate-[8deg] shadow-md">
          <img src={sistersSarees} className="h-full w-full object-cover" alt="Three sisters in sarees" />
        </div>
        <div className="absolute top-2 left-1/3 w-28 h-36 border border-gold/60 bg-paper p-1 rotate-[-6deg] shadow-md">
          <img src={album1976} className="h-full w-full object-cover" alt="Family album 1976" />
        </div>
      </div>
    </div>
    <div className="absolute top-10 right-12"><SailMark size={140} /></div>
    <div className="absolute bottom-10 left-12 opacity-60"><CompassMark size={70} /></div>
  </ChapterShell>
);
