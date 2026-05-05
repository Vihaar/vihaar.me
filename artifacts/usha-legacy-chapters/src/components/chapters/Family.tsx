import { ChapterShell, SmallCaps, GoldRule } from "../ChapterShell";
import walking from "@/assets/photos/family-sherwanis-lake.jpeg";
import yellowWedding from "@/assets/photos/family-yellow-wedding.jpeg";
import desertFive from "@/assets/photos/family-desert-five.jpeg";
import dadTwoBoys from "@/assets/photos/dad-two-boys-gifts.jpeg";
import sons from "@/assets/photos/three-sons-portrait.jpeg";
import grandmother from "@/assets/photos/grandmother-grandkids.jpeg";
import elders from "@/assets/photos/elders-group.jpeg";
import tenderBaby from "@/assets/photos/usha-baby-tender.jpeg";
import grandchildGreen from "@/assets/photos/grandchild-green.jpeg";
import lakeWading from "@/assets/photos/lake-wading.jpeg";

export const Family = () => (
  <ChapterShell tone="warm">
    <div className="h-full w-full p-8 grid grid-cols-12 gap-3">
      <div className="col-span-8 grid grid-rows-3 gap-3">
        <div className="row-span-2 relative vignette warm-overlay">
          <img src={walking} className="h-full w-full object-cover" alt="Family together" />
          <div className="absolute bottom-6 left-6 text-paper">
            <div className="smallcaps text-gold">Five together</div>
            <h3 className="font-serif text-3xl mt-1 italic">Career built income.<br/>Family built meaning.</h3>
          </div>
        </div>
        <div className="grid grid-cols-5 gap-2">
          {[desertFive, tenderBaby, dadTwoBoys, grandchildGreen, lakeWading].map((src, i) => (
            <div key={i} className="relative vignette"><img src={src} className="h-full w-full object-cover" alt="" /></div>
          ))}
        </div>
      </div>
      <div className="col-span-4 flex flex-col gap-3">
        <SmallCaps>Chapter IV · Family</SmallCaps>
        <GoldRule className="w-16" />
        <div className="grid grid-cols-3 gap-2">
          {[sons, yellowWedding, grandmother].map((s, i) => <div key={i} className="aspect-[3/4] relative vignette"><img src={s} className="h-full w-full object-cover" alt=""/></div>)}
        </div>
        <ul className="mt-1 font-garamond text-sm space-y-2 text-foreground/85">
          <li><span className="font-serif text-base">Vipul</span> · '97 · satellite engineering</li>
          <li><span className="font-serif text-base">Vihaar</span> · '02 · YC founder</li>
          <li><span className="font-serif text-base">Vijval</span> · '05 · physics</li>
        </ul>
        <div className="flex-1 relative vignette min-h-[120px]"><img src={elders} className="h-full w-full object-cover" alt="Elders" /></div>
      </div>
    </div>
  </ChapterShell>
);
