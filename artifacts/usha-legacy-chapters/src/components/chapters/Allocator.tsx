import { ChapterShell, SmallCaps, GoldRule } from "../ChapterShell";
import { SailMark } from "../marks/SailMark";
import helm from "@/assets/photos/boat-helm-dad.jpeg";

const Col = ({ title, lines }: { title: string; lines: string[] }) => (
  <div>
    <SmallCaps>{title}</SmallCaps>
    <GoldRule className="mt-3 w-12" />
    <ul className="mt-4 space-y-2 font-garamond text-base text-foreground/85">
      {lines.map(l => <li key={l}>· {l}</li>)}
    </ul>
  </div>
);

export const Allocator = () => (
  <ChapterShell>
    <div className="absolute inset-0 opacity-30">
      <img src={helm} className="h-full w-full object-cover" alt="" />
      <div className="absolute inset-0 bg-gradient-to-r from-paper via-paper/70 to-paper/30" />
    </div>
    <div className="relative h-full w-full px-14 py-14 flex flex-col">
      <div className="flex items-baseline justify-between">
        <SmallCaps>Chapter VI · The Allocator</SmallCaps>
        <SailMark tilt={8} size={80} />
      </div>
      <h2 className="font-serif text-5xl mt-6 max-w-3xl leading-tight">
        From <em className="text-gold-deep">building</em> → <em className="text-gold-deep">allocating</em>.
      </h2>
      <GoldRule className="my-8 w-full max-w-3xl" />
      <div className="grid grid-cols-3 gap-10 max-w-6xl">
        <Col title="Operator → Allocator" lines={[
          "Single-system → portfolio",
          "Earned → compounded",
          "Speed → patience",
        ]} />
        <Col title="Principles" lines={[
          "Volatility = opportunity",
          "Public + private barbell",
          "Direct where I have edge",
          "Concentration with conviction",
        ]} />
        <Col title="Anchors" lines={[
          "Living Isha · daily practice",
          "Family as long enterprise",
          "Stewardship > accumulation",
        ]} />
      </div>
    </div>
  </ChapterShell>
);
