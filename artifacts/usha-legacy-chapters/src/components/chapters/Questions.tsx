import { ChapterShell, SmallCaps, GoldRule } from "../ChapterShell";

const cards = [
  { title: "Path to $100M", q: "What is the most capital-efficient route from $34M to $100M over 10–15 years — given my risk capacity, time horizon, and existing concentration?" },
  { title: "Allocation Strategy", q: "How should I balance public vs private, US vs India, and direct vs fund — without over-diversifying away returns?" },
  { title: "Family Independence vs Support", q: "How much should I support my sons financially, and where does support quietly become a ceiling on their own building?" },
  { title: "Ambition & Spirituality", q: "How do I hold a $100M ambition and a daily spiritual practice in the same hand without one diluting the other?" },
];

export const Questions = () => {
  return (
    <ChapterShell>
      <div className="h-full w-full px-14 py-12 flex flex-col">
        <div className="flex items-baseline justify-between gap-4">
          <SmallCaps>Questions · For the Room</SmallCaps>
          <SmallCaps className="text-gold">Ask plainly</SmallCaps>
        </div>
        <h2 className="font-serif text-4xl mt-3">Where I need your help.</h2>
        <GoldRule className="my-5 w-32" />
        <div className="grid grid-cols-2 gap-4 max-w-5xl flex-1 min-h-0">
          {cards.map((c, i) => (
            <article key={c.title} className="text-left border border-rule bg-paper/60 p-4 flex flex-col">
              <div className="flex items-baseline justify-between">
                <span className="tabular text-[0.65rem] text-foreground/40">0{i + 1}</span>
                <span className="smallcaps text-gold text-[0.6rem]">Question</span>
              </div>
              <div className="font-serif text-xl mt-1.5 leading-snug">{c.title}</div>
              <p className="font-garamond text-sm mt-2 text-foreground/85 leading-relaxed">{c.q}</p>
            </article>
          ))}
        </div>
      </div>
    </ChapterShell>
  );
};
