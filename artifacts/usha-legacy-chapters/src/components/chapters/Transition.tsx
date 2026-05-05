import { ChapterShell, SmallCaps, GoldRule } from "../ChapterShell";
import wedding from "@/assets/photos/wedding-garland.jpeg";
import ring from "@/assets/photos/wedding-ring-ceremony.jpeg";
import heritage from "@/assets/photos/family-indian-attire.jpeg";
import highway from "@/assets/photos/couple-highway.jpeg";

export const Transition = () => (
  <ChapterShell tone="warm">
    <div className="h-full w-full grid grid-cols-12 gap-4 p-6">
      <div className="col-span-3 flex flex-col justify-center">
        <SmallCaps>Chapter III · Transition</SmallCaps>
        <h2 className="font-serif text-3xl mt-3 leading-tight">Dec 1993<br/><span className="italic text-gold-deep">→ Michigan</span></h2>
        <GoldRule className="my-4 w-20" />
        <ul className="font-garamond text-sm space-y-1.5 text-foreground/85">
          <li>· New country, new marriage</li>
          <li>· Wayne State · Master's</li>
          <li>· GM 1995 · Chief Architect by 28</li>
          <li>· 17 yrs enterprise architecture</li>
        </ul>
        <blockquote className="mt-4 font-serif italic text-sm border-l-2 border-gold pl-3 text-foreground/90">
          First salary $40K. Ambition $200K.
          <span className="not-italic text-gold-deep text-xs mt-1 block">Had not yet learned to think at scale.</span>
        </blockquote>
      </div>
      <div className="col-span-9 grid grid-cols-3 grid-rows-2 gap-3">
        <div className="row-span-2 col-span-2 relative vignette warm-overlay">
          <img src={highway} className="absolute inset-0 h-full w-full object-cover" alt="Young couple, early US years" />
        </div>
        <div className="relative vignette">
          <img src={wedding} className="absolute inset-0 h-full w-full object-cover" alt="Wedding garland ceremony" />
        </div>
        <div className="relative vignette">
          <img src={ring} className="absolute inset-0 h-full w-full object-cover" alt="Wedding ring ceremony" />
        </div>
      </div>
    </div>
    <div className="absolute bottom-0 left-0 right-0 h-20 opacity-30 pointer-events-none">
      <img src={heritage} className="h-full w-full object-cover object-top" alt="" />
    </div>
  </ChapterShell>
);
