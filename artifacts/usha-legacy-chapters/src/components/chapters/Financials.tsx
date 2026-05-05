import { ChapterShell, SmallCaps, GoldRule } from "../ChapterShell";
import { holdings, fmt, total, goal, byBucket, byOwner, liquidSplit } from "@/data/portfolio";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

const palette = ["#C6A769", "#1C1C1C", "#8C6F3F", "#B8541F", "#5E6F7A", "#3F4A50"];

// ===== LEDGER OVERVIEW =====
export const LedgerOverview = () => {
  const buckets = byBucket().sort((a,b) => b.value - a.value);
  return (
    <ChapterShell>
      <div className="h-full w-full p-12 flex flex-col">
        <div className="flex items-baseline justify-between">
          <SmallCaps>Ledger · Net Worth</SmallCaps>
          <SmallCaps className="text-gold">Honestly stated</SmallCaps>
        </div>
        <div className="mt-6 grid grid-cols-12 gap-8 flex-1">
          <div className="col-span-5 flex flex-col justify-center">
            <div className="smallcaps text-foreground/60">Today</div>
            <div className="font-serif text-7xl tabular mt-2">{fmt(total)}</div>
            <GoldRule className="my-6 w-32" />
            <div className="smallcaps text-foreground/60">Goal · 10–15 yrs</div>
            <div className="font-serif text-5xl tabular text-gold-deep">{fmt(goal)}</div>
            <div className="mt-3 font-garamond text-base text-foreground/70">Gap · {fmt(goal - total)} · ~3x</div>
          </div>
          <div className="col-span-7">
            <SmallCaps>By Bucket</SmallCaps>
            <table className="w-full mt-4 text-sm">
              <tbody>
                {buckets.map((b, i) => (
                  <tr key={b.name} className="border-b border-rule/50">
                    <td className="py-2 font-garamond text-lg">
                      <span className="inline-block w-3 h-3 mr-3" style={{ background: palette[i % palette.length] }} />
                      {b.name}
                    </td>
                    <td className="py-2 text-right tabular text-lg">{fmt(b.value)}</td>
                    <td className="py-2 text-right tabular text-foreground/60 w-20">{((b.value/total)*100).toFixed(1)}%</td>
                  </tr>
                ))}
                <tr className="font-serif text-xl border-t-2 border-foreground">
                  <td className="py-3">Total</td>
                  <td className="text-right tabular">{fmt(total)}</td>
                  <td className="text-right tabular">100%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ChapterShell>
  );
};

// ===== PRIVATE EQUITY BOOK =====
export const PrivateEquityBook = () => {
  const pe = holdings.filter(h => h.bucket === "Private Equity");
  const peTotal = pe.reduce((s,h) => s+h.value, 0);
  return (
    <ChapterShell>
      <div className="h-full w-full p-12 flex flex-col">
        <div className="flex items-baseline justify-between">
          <SmallCaps>Private Equity Book</SmallCaps>
          <div className="font-serif text-2xl tabular">{fmt(peTotal)} · {pe.length} positions</div>
        </div>
        <GoldRule className="my-6 w-32" />
        <div className="grid grid-cols-3 gap-3 flex-1">
          {pe.sort((a,b) => b.value - a.value).map(h => (
            <div key={h.name} className="border border-rule bg-paper/60 p-4 flex flex-col hover:border-gold transition-colors">
              <div className="font-serif text-xl">{h.name}</div>
              <div className="smallcaps text-foreground/50 mt-1 text-[0.6rem]">{h.account}</div>
              <div className="mt-auto pt-3 font-serif tabular text-2xl text-gold-deep">{fmt(h.value)}</div>
            </div>
          ))}
        </div>
      </div>
    </ChapterShell>
  );
};

// ===== HEDGE FUND PIPELINE =====
const hedgeFunds = [
  { name: "AQR Delphi", focus: "Quant equity · long/short", status: "Diligence" },
  { name: "Brooklyn", focus: "Multi-strategy", status: "Diligence" },
  { name: "NewPoint (UHTC)", focus: "Healthcare specialist", status: "Diligence" },
  { name: "Radcliffe", focus: "Credit · convert arb", status: "Diligence" },
  { name: "Nuveen", focus: "Diversified institutional", status: "Diligence" },
  { name: "Gotham", focus: "Long/short value", status: "Diligence" },
];
export const HedgeFundPipeline = () => (
  <ChapterShell>
    <div className="h-full w-full p-12 flex flex-col">
      <div className="flex items-baseline justify-between">
        <SmallCaps>Hedge Fund Pipeline</SmallCaps>
        <SmallCaps className="text-gold">Targeted commitment Q3 2026</SmallCaps>
      </div>
      <h2 className="font-serif text-4xl mt-3">Six funds · narrowing to two.</h2>
      <GoldRule className="my-6 w-32" />
      <div className="grid grid-cols-3 gap-4 flex-1">
        {hedgeFunds.map((f, i) => (
          <div key={f.name} className="border border-rule bg-paper/60 p-6 flex flex-col hover:border-gold transition-colors">
            <div className="tabular text-xs text-foreground/40">0{i+1}</div>
            <div className="font-serif text-3xl mt-2">{f.name}</div>
            <div className="font-garamond text-base text-foreground/75 mt-3">{f.focus}</div>
            <div className="mt-auto pt-4 smallcaps text-gold-deep border-t border-rule">{f.status}</div>
          </div>
        ))}
      </div>
    </div>
  </ChapterShell>
);

// ===== ALT INVESTMENTS =====
const alts = [
  { name: "AIx Fund", note: "Sourced via informed-investor network" },
  { name: "Fusion Fund", note: "Frontier tech · early growth" },
  { name: "Georgian Fund", note: "Applied AI / SaaS growth" },
];
export const AltInvestments = () => (
  <ChapterShell>
    <div className="h-full w-full p-14 flex flex-col">
      <SmallCaps>Alternative Investments</SmallCaps>
      <h2 className="font-serif text-5xl mt-3">Three funds in diligence.</h2>
      <GoldRule className="my-8 w-32" />
      <div className="grid grid-cols-3 gap-6 flex-1">
        {alts.map(a => (
          <div key={a.name} className="border border-rule bg-paper/60 p-8 flex flex-col">
            <div className="font-serif text-4xl">{a.name}</div>
            <GoldRule className="my-4 w-12" />
            <div className="font-garamond text-lg text-foreground/75">{a.note}</div>
            <div className="mt-auto smallcaps text-gold-deep">In diligence</div>
          </div>
        ))}
      </div>
    </div>
  </ChapterShell>
);

// ===== WEALTH MANAGERS =====
export const WealthManagers = () => (
  <ChapterShell>
    <div className="h-full w-full p-14 flex flex-col">
      <SmallCaps>Wealth Manager Search</SmallCaps>
      <h2 className="font-serif text-5xl mt-3">Two short-listed.</h2>
      <GoldRule className="my-8 w-32" />
      <div className="grid grid-cols-2 gap-8 flex-1">
        <div className="border border-rule bg-paper/60 p-10 flex flex-col">
          <div className="font-serif text-5xl">SteelPeak</div>
          <ul className="mt-6 font-garamond text-lg space-y-2 text-foreground/80">
            <li>· Boutique · multi-family</li>
            <li>· Private market access</li>
            <li>· India coordination?</li>
          </ul>
          <div className="mt-auto smallcaps text-gold-deep">Researching</div>
        </div>
        <div className="border border-rule bg-paper/60 p-10 flex flex-col">
          <div className="font-serif text-5xl">Morgan Stanley</div>
          <ul className="mt-6 font-garamond text-lg space-y-2 text-foreground/80">
            <li>· Institutional scale</li>
            <li>· PWM · structured products</li>
            <li>· Lending lines</li>
          </ul>
          <div className="mt-auto smallcaps text-gold-deep">Researching</div>
        </div>
      </div>
    </div>
  </ChapterShell>
);

// ===== ANNUITY & INSURANCE =====
export const AnnuityBook = () => {
  const annuities = holdings.filter(h => h.bucket === "Annuity");
  return (
    <ChapterShell>
      <div className="h-full w-full p-12 flex flex-col">
        <SmallCaps>Annuities & Insurance Structures</SmallCaps>
        <GoldRule className="my-6 w-32" />
        <div className="grid grid-cols-12 gap-6 flex-1">
          <div className="col-span-6">
            <div className="smallcaps mb-3">Current annuities</div>
            <div className="space-y-3">
              {annuities.map(a => (
                <div key={a.name} className="border border-rule bg-paper/60 p-4 flex items-baseline justify-between">
                  <div>
                    <div className="font-serif text-xl">{a.name}</div>
                    <div className="text-xs text-foreground/60">{a.account}</div>
                  </div>
                  <div className="tabular text-xl">{fmt(a.value)}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="col-span-6">
            <div className="smallcaps mb-3">Researching</div>
            <div className="border border-gold bg-paper p-6">
              <div className="font-serif text-3xl">PPLI</div>
              <div className="font-garamond text-base text-foreground/75 mt-2">Private Placement Life Insurance — tax-efficient wrapper for private investments.</div>
            </div>
            <div className="border border-gold bg-paper p-6 mt-4">
              <div className="font-serif text-3xl">PPUL</div>
              <div className="font-garamond text-base text-foreground/75 mt-2">Private Placement Universal Life — generational planning structure.</div>
            </div>
          </div>
        </div>
      </div>
    </ChapterShell>
  );
};

// ===== REAL ESTATE =====
export const RealEstateBook = () => {
  const re = holdings.filter(h => h.bucket === "Real Estate" || h.account === "India RE");
  return (
    <ChapterShell tone="warm">
      <div className="h-full w-full p-12 flex flex-col">
        <div className="flex items-baseline justify-between">
          <SmallCaps>Real Estate · US + India</SmallCaps>
          <div className="font-serif text-2xl tabular">{fmt(re.reduce((s,h)=>s+h.value,0))}</div>
        </div>
        <GoldRule className="my-6 w-32" />
        <div className="grid grid-cols-2 gap-8 flex-1">
          <div>
            <div className="smallcaps text-gold-deep">United States</div>
            {re.filter(h => h.geo === "US").map(h => (
              <div key={h.name} className="border-b border-rule py-3 flex items-baseline justify-between">
                <span className="font-serif text-xl">{h.name}</span>
                <span className="tabular text-lg">{fmt(h.value)}</span>
              </div>
            ))}
          </div>
          <div>
            <div className="smallcaps text-gold-deep">India</div>
            {re.filter(h => h.geo === "India").map(h => (
              <div key={h.name} className="border-b border-rule py-3 flex items-baseline justify-between">
                <span className="font-serif text-xl">{h.name}</span>
                <span className="tabular text-lg">{fmt(h.value)}</span>
              </div>
            ))}
            <div className="mt-6 italic font-garamond text-foreground/75">Selling India properties → redeploying into startup capital.</div>
          </div>
        </div>
      </div>
    </ChapterShell>
  );
};

// ===== INDIA BOOK =====
export const IndiaBook = () => {
  const india = holdings.filter(h => h.geo === "India");
  const indTotal = india.reduce((s,h) => s+h.value, 0);
  return (
    <ChapterShell>
      <div className="h-full w-full p-12 flex flex-col">
        <div className="flex items-baseline justify-between">
          <SmallCaps>India Book</SmallCaps>
          <div className="font-serif text-2xl tabular">{fmt(indTotal)}</div>
        </div>
        <GoldRule className="my-6 w-32" />
        <div className="grid grid-cols-12 gap-6 flex-1">
          <div className="col-span-7">
            <div className="border-2 border-gold bg-paper/80 p-8">
              <div className="smallcaps text-gold-deep">Concentration</div>
              <div className="font-serif text-5xl mt-2">Virchow Labs</div>
              <div className="text-foreground/70 mt-1">3% direct stake</div>
              <div className="font-serif tabular text-4xl mt-4 text-gold-deep">$5.0M</div>
              <div className="font-garamond text-base text-foreground/80 mt-4">Largest single position. Source of upside — and concentration risk.</div>
            </div>
          </div>
          <div className="col-span-5">
            <div className="smallcaps mb-3">Other India positions</div>
            {india.filter(h => h.name !== "Virchow Labs (3%)").map(h => (
              <div key={h.name} className="border-b border-rule py-2 flex items-baseline justify-between text-sm">
                <span className="font-garamond text-base">{h.name}</span>
                <span className="tabular">{fmt(h.value)}</span>
              </div>
            ))}
            <div className="mt-6 smallcaps text-gold">On the ground</div>
            <div className="font-garamond mt-2 text-foreground/80">Wealth manager + assistant · live operations</div>
          </div>
        </div>
      </div>
    </ChapterShell>
  );
};

// ===== NEXT GENERATION =====
export const NextGenBook = () => {
  const owners = ["Vipul", "Vihaar", "Vijval"] as const;
  return (
    <ChapterShell tone="warm">
      <div className="h-full w-full p-12 flex flex-col">
        <SmallCaps>Next Generation · Accounts</SmallCaps>
        <h2 className="font-serif text-4xl mt-3">Three sons · three books.</h2>
        <GoldRule className="my-6 w-32" />
        <div className="grid grid-cols-3 gap-5 flex-1">
          {owners.map(o => {
            const pos = holdings.filter(h => h.owner === o);
            const t = pos.reduce((s,h) => s+h.value, 0);
            return (
              <div key={o} className="border border-rule bg-paper/70 p-6 flex flex-col">
                <div className="font-serif text-3xl">{o}</div>
                <div className="font-serif tabular text-2xl text-gold-deep mt-1">{fmt(t)}</div>
                <GoldRule className="my-4 w-12" />
                {pos.map(p => (
                  <div key={p.name} className="border-b border-rule/50 py-2 flex items-baseline justify-between text-sm">
                    <span className="font-garamond">{p.name.replace(`${o} — `, "")}</span>
                    <span className="tabular">{fmt(p.value)}</span>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </ChapterShell>
  );
};

// ===== PRIVATE CREDIT & DEALS =====
export const PrivateCredit = () => (
  <ChapterShell>
    <div className="h-full w-full p-14 flex flex-col">
      <SmallCaps>Private Credit & Direct Deals</SmallCaps>
      <GoldRule className="my-6 w-32" />
      <div className="grid grid-cols-2 gap-8 flex-1">
        <div className="border-2 border-gold bg-paper p-10 flex flex-col">
          <div className="smallcaps text-gold-deep">Engaged</div>
          <div className="font-serif text-5xl mt-2">Ride River</div>
          <div className="font-garamond text-lg text-foreground/80 mt-3">Private credit lending opportunity</div>
          <div className="font-serif text-7xl text-gold-deep mt-auto tabular">18%</div>
          <div className="smallcaps text-foreground/60">target yield</div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="border border-rule bg-paper/60 p-6">
            <div className="font-serif text-2xl">India Property → Startups</div>
            <div className="font-garamond text-base text-foreground/75 mt-2">Selling India real estate; redeploying into early-stage Indian startup capital.</div>
            <div className="mt-3 smallcaps text-gold-deep">In diligence</div>
          </div>
          <div className="border border-rule bg-paper/60 p-6">
            <div className="font-serif text-2xl">Trust & Estate</div>
            <div className="font-garamond text-base text-foreground/75 mt-2">India CA + US attorney · coordinated cross-border restructure.</div>
            <div className="mt-3 smallcaps text-gold-deep">Engaged</div>
          </div>
        </div>
      </div>
    </div>
  </ChapterShell>
);

// ===== ALLOCATION CHARTS =====
const dollar = (n: number) => `$${n.toLocaleString("en-US")}`;

export const AllocationCharts = () => {
  const buckets = byBucket().sort((a,b) => b.value - a.value);
  const liq = liquidSplit();
  const owners = byOwner();
  const liqTotal = liq.reduce((s,x) => s+x.value, 0);
  const ownerTotal = owners.reduce((s,x) => s+x.value, 0);
  const bucketTotal = buckets.reduce((s,x) => s+x.value, 0);
  return (
    <ChapterShell>
      <div className="h-full w-full p-10 flex flex-col">
        <div className="flex items-baseline justify-between">
          <SmallCaps>Allocation · One Page</SmallCaps>
          <div className="font-serif tabular text-2xl">{dollar(bucketTotal)}</div>
        </div>
        <GoldRule className="my-5 w-32" />
        <div className="grid grid-cols-12 gap-5 flex-1">
          {/* Bucket: pie + legend with real $ */}
          <div className="col-span-6 border border-rule bg-paper/40 p-5 flex">
            <div className="w-1/2 flex flex-col">
              <div className="smallcaps mb-2">By Bucket</div>
              <div className="flex-1 min-h-0">
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
            <div className="w-1/2 pl-4 flex flex-col justify-center text-xs">
              {buckets.map((b, i) => (
                <div key={b.name} className="flex items-center justify-between border-b border-rule/40 py-1.5">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-2.5 h-2.5 flex-shrink-0" style={{ background: palette[i % palette.length] }} />
                    <span className="font-garamond text-sm truncate">{b.name}</span>
                  </div>
                  <div className="flex items-baseline gap-2 flex-shrink-0">
                    <span className="tabular text-sm">{dollar(b.value)}</span>
                    <span className="tabular text-foreground/50 w-10 text-right">{((b.value/bucketTotal)*100).toFixed(1)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Liquid vs Illiquid */}
          <div className="col-span-3 border border-rule bg-paper/40 p-5 flex flex-col">
            <div className="smallcaps mb-3">Liquid vs Illiquid</div>
            {liq.map((row, i) => (
              <div key={row.name} className="mb-4">
                <div className="flex items-baseline justify-between text-sm">
                  <span className="font-garamond">{row.name}</span>
                  <span className="tabular">{dollar(row.value)}</span>
                </div>
                <div className="h-2 bg-rule/30 mt-1.5 relative">
                  <div className="absolute inset-y-0 left-0" style={{ width: `${(row.value/liqTotal)*100}%`, background: i === 0 ? "#C6A769" : "#1C1C1C" }} />
                </div>
                <div className="text-xs text-foreground/60 tabular mt-1">{((row.value/liqTotal)*100).toFixed(1)}%</div>
              </div>
            ))}
            <div className="mt-auto pt-3 border-t border-rule text-xs flex justify-between">
              <span className="smallcaps">Total</span>
              <span className="tabular">{dollar(liqTotal)}</span>
            </div>
          </div>

          {/* By Owner */}
          <div className="col-span-3 border border-rule bg-paper/40 p-5 flex flex-col">
            <div className="smallcaps mb-3">By Owner</div>
            {owners.map(o => (
              <div key={o.name} className="mb-3">
                <div className="flex items-baseline justify-between text-sm">
                  <span className="font-garamond">{o.name}</span>
                  <span className="tabular">{dollar(o.value)}</span>
                </div>
                <div className="h-2 bg-rule/30 mt-1.5 relative">
                  <div className="absolute inset-y-0 left-0 bg-foreground" style={{ width: `${(o.value/ownerTotal)*100}%` }} />
                </div>
              </div>
            ))}
            <div className="mt-auto pt-3 border-t border-rule text-xs flex justify-between">
              <span className="smallcaps">Total</span>
              <span className="tabular">{dollar(ownerTotal)}</span>
            </div>
          </div>
        </div>
      </div>
    </ChapterShell>
  );
};

// ===== FULL LEDGER =====
export const FullLedger = () => {
  const us = holdings.filter(h => h.geo === "US").sort((a,b) => b.value - a.value);
  const india = holdings.filter(h => h.geo === "India").sort((a,b) => b.value - a.value);
  const usT = us.reduce((s,h) => s+h.value, 0);
  const inT = india.reduce((s,h) => s+h.value, 0);

  const Section = ({ title, rows, sub }: { title: string; rows: typeof holdings; sub: number }) => (
    <div className="flex-1 min-h-0 flex flex-col">
      <div className="flex items-baseline justify-between border-b-2 border-foreground py-2">
        <div className="smallcaps text-gold-deep">{title} · {rows.length} positions</div>
        <div className="font-serif tabular text-xl">{dollar(sub)}</div>
      </div>
      <div className="flex-1 overflow-y-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-background border-b border-rule">
            <tr className="smallcaps text-left text-[0.6rem]">
              <th className="py-1.5">Position</th><th>Bucket</th><th>Owner</th><th className="text-right">Value</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(h => (
              <tr key={h.name} className="border-b border-rule/40">
                <td className="py-1 font-garamond">{h.name}</td>
                <td className="text-foreground/70 text-xs">{h.bucket}</td>
                <td className="text-foreground/70 text-xs">{h.owner}</td>
                <td className="text-right tabular">{dollar(h.value)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <ChapterShell>
      <div className="h-full w-full p-8 flex flex-col">
        <div className="flex items-baseline justify-between">
          <SmallCaps>Full Ledger · Every Position</SmallCaps>
          <div className="font-serif tabular text-2xl">{dollar(total)}</div>
        </div>
        <GoldRule className="my-3 w-32" />
        <div className="grid grid-cols-2 gap-8 flex-1 min-h-0">
          <Section title="United States" rows={us} sub={usT} />
          <Section title="India" rows={india} sub={inT} />
        </div>
      </div>
    </ChapterShell>
  );
};

// ===== PATH TO 100M =====
export const PathTo100M = () => (
  <ChapterShell tone="ink">
    <div className="h-full w-full p-14 flex flex-col items-center justify-center text-paper">
      <SmallCaps className="text-gold">Path to $100M</SmallCaps>
      <div className="mt-8 flex items-baseline gap-8">
        <div>
          <div className="smallcaps text-paper/60">Today</div>
          <div className="font-serif text-7xl tabular">{fmt(total)}</div>
        </div>
        <div className="text-5xl text-gold">→</div>
        <div>
          <div className="smallcaps text-paper/60">10–15 yrs</div>
          <div className="font-serif text-7xl tabular text-gold">{fmt(goal)}</div>
        </div>
      </div>
      <GoldRule className="my-10 w-64" />
      <div className="grid grid-cols-3 gap-10 max-w-5xl text-center">
        <div>
          <div className="smallcaps text-gold">Compounding</div>
          <div className="font-serif text-2xl mt-2">~7% real</div>
          <div className="font-garamond text-paper/70 mt-1">across the public book</div>
        </div>
        <div>
          <div className="smallcaps text-gold">Concentration</div>
          <div className="font-serif text-2xl mt-2">Virchow + PE</div>
          <div className="font-garamond text-paper/70 mt-1">asymmetric upside</div>
        </div>
        <div>
          <div className="smallcaps text-gold">Discipline</div>
          <div className="font-serif text-2xl mt-2">Stay invested</div>
          <div className="font-garamond text-paper/70 mt-1">through cycles</div>
        </div>
      </div>
    </div>
  </ChapterShell>
);
