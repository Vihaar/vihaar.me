import { ChapterShell, SmallCaps, GoldRule } from "../ChapterShell";
import { steps } from "@/data/nextSteps";

const statusColor: Record<string, string> = {
  "Researching": "text-foreground/60 border-foreground/30",
  "In diligence": "text-gold-deep border-gold",
  "Engaged": "text-terracotta border-terracotta",
  "Live": "text-foreground bg-foreground !text-paper border-foreground",
};

export const NextSteps = () => (
  <ChapterShell>
    <div className="h-full w-full p-12 flex flex-col">
      <div className="flex items-baseline justify-between">
        <SmallCaps>Next Steps · In Motion</SmallCaps>
        <SmallCaps className="text-gold">Already moving</SmallCaps>
      </div>
      <h2 className="font-serif text-4xl mt-3">From road trips to a written plan.</h2>
      <GoldRule className="my-6 w-32" />
      <div className="grid grid-cols-3 gap-4 flex-1">
        {steps.map((s, i) => (
          <div key={s.title} className="border border-rule bg-paper/60 p-5 flex flex-col hover:border-gold transition-colors">
            <div className="flex items-start justify-between gap-3">
              <div className="font-serif text-xl leading-tight">{s.title}</div>
              <span className="tabular text-xs text-foreground/40">{String(i + 1).padStart(2, "0")}</span>
            </div>
            <div className="font-garamond text-sm text-foreground/75 mt-2 flex-1">{s.detail}</div>
            <div className={`mt-3 self-start smallcaps px-2 py-1 border ${statusColor[s.status]}`}>{s.status}</div>
          </div>
        ))}
      </div>
    </div>
  </ChapterShell>
);
