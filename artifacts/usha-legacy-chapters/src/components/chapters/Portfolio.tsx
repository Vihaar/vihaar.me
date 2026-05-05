import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { ChapterShell, SmallCaps, GoldRule } from "../ChapterShell";
import { byBucket, byOwner, liquidSplit, total, goal, holdings } from "@/data/portfolio";

const palette = ["#C6A769", "#1C1C1C", "#8C6F3F", "#B8541F", "#5E6F7A", "#3F4A50"];
const dollar = (n: number) => `$${n.toLocaleString("en-US")}`;

const Stat = ({ label, value, sub }: { label: string; value: string; sub?: string }) => (
  <div className="border border-rule bg-paper/60 px-5 py-4">
    <div className="smallcaps">{label}</div>
    <div className="font-serif text-2xl mt-2 tabular">{value}</div>
    {sub && <div className="text-xs text-foreground/60 mt-1">{sub}</div>}
  </div>
);

export const Portfolio = () => {
  const buckets = byBucket().sort((a,b) => b.value - a.value);
  const usTotal = holdings.filter(h => h.geo === "US").reduce((s,h) => s+h.value, 0);
  const inTotal = holdings.filter(h => h.geo === "India").reduce((s,h) => s+h.value, 0);
  const virchow = holdings.find(h => h.name === "Virchow Labs (3%)")?.value ?? 0;

  return (
    <ChapterShell>
      <div className="h-full w-full p-10 overflow-y-auto scrollbar-none">
        <div className="flex items-baseline justify-between">
          <SmallCaps>Portfolio · The Ledger</SmallCaps>
          <div className="smallcaps text-foreground/50">Press <kbd className="font-sans">A</kbd> for full appendix</div>
        </div>
        <h2 className="font-serif text-4xl mt-3">Honestly stated.</h2>
        <GoldRule className="my-6" />

        <div className="grid grid-cols-4 gap-4 mb-8">
          <Stat label="Net Worth" value={dollar(total)} sub="US + India combined" />
          <Stat label="US Assets" value={dollar(usTotal)} />
          <Stat label="India Assets" value={dollar(inTotal)} sub="Incl. 3% Virchow Labs" />
          <Stat label="Goal" value={dollar(goal)} sub={`Gap ${dollar(goal - total)}`} />
        </div>

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-7 border border-rule bg-paper/40 p-5 flex">
            <div className="w-1/2 flex flex-col">
              <div className="smallcaps mb-3">Allocation by Bucket</div>
              <div className="flex-1 min-h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={buckets} dataKey="value" nameKey="name" innerRadius="55%" outerRadius="92%" paddingAngle={2} stroke="none">
                      {buckets.map((_, i) => <Cell key={i} fill={palette[i % palette.length]} />)}
                    </Pie>
                    <Tooltip formatter={(v: number) => dollar(v)} contentStyle={{ background: "#F7F3ED", border: "1px solid #C6A769", borderRadius: 0, fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="w-1/2 pl-5 flex flex-col justify-center text-sm">
              {buckets.map((b, i) => (
                <div key={b.name} className="flex items-center justify-between border-b border-rule/40 py-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-3 h-3 flex-shrink-0" style={{ background: palette[i % palette.length] }} />
                    <span className="font-garamond truncate">{b.name}</span>
                  </div>
                  <div className="flex items-baseline gap-3 flex-shrink-0">
                    <span className="tabular">{dollar(b.value)}</span>
                    <span className="tabular text-foreground/50 w-12 text-right">{((b.value/total)*100).toFixed(1)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="col-span-5 border border-rule bg-paper/40 p-5 flex flex-col">
            <div className="smallcaps mb-3">Concentration</div>
            <div className="font-serif text-3xl">Virchow Labs</div>
            <div className="text-sm text-foreground/70">3% direct stake</div>
            <div className="font-serif tabular text-4xl text-gold-deep mt-3">{dollar(virchow)}</div>
            <GoldRule className="my-4" />
            <div className="text-sm text-foreground/80 leading-relaxed font-garamond">
              Largest single position by far. Source of upside and asymmetry — and the largest single concentration risk in the book.
            </div>
            <div className="mt-auto pt-4 grid grid-cols-2 gap-3 text-xs">
              <div>
                <div className="smallcaps text-gold-deep">By Owner</div>
                {byOwner().map(o => (
                  <div key={o.name} className="flex justify-between border-b border-rule/30 py-1">
                    <span className="font-garamond">{o.name}</span><span className="tabular">{dollar(o.value)}</span>
                  </div>
                ))}
              </div>
              <div>
                <div className="smallcaps text-gold-deep">Liquidity</div>
                {liquidSplit().map(l => (
                  <div key={l.name} className="flex justify-between border-b border-rule/30 py-1">
                    <span className="font-garamond">{l.name}</span><span className="tabular">{dollar(l.value)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ChapterShell>
  );
};
