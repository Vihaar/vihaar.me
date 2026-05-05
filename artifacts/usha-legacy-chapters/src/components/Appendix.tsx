import { useState } from "react";
import { holdings, fmt, total } from "@/data/portfolio";

export const Appendix = ({ onClose }: { onClose: () => void }) => {
  const [sort, setSort] = useState<"value" | "name" | "bucket">("value");
  const rows = [...holdings].sort((a, b) => sort === "value" ? b.value - a.value : a[sort].localeCompare(b[sort]));
  return (
    <div className="fixed inset-0 z-50 bg-background paper-grain overflow-y-auto">
      <div className="max-w-6xl mx-auto p-12">
        <div className="flex items-baseline justify-between">
          <div>
            <div className="smallcaps text-gold-deep">Appendix · Full Ledger</div>
            <h2 className="font-serif text-4xl mt-2">Every account, every dollar.</h2>
          </div>
          <button onClick={onClose} className="smallcaps border border-rule px-4 py-2 hover:border-gold">Close · A</button>
        </div>
        <div className="mt-4 flex gap-2 smallcaps">Sort by:
          {(["value","name","bucket"] as const).map(k => (
            <button key={k} onClick={() => setSort(k)} className={`px-2 py-1 border ${sort === k ? "border-foreground bg-foreground text-paper" : "border-rule"}`}>{k}</button>
          ))}
        </div>
        <table className="w-full mt-6 text-sm">
          <thead className="border-b border-foreground">
            <tr className="smallcaps text-left">
              <th className="py-2">Position</th><th>Account</th><th>Bucket</th><th>Owner</th><th>Geo</th><th className="text-right">Value</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(h => (
              <tr key={h.name} className="border-b border-rule/50">
                <td className="py-2 font-garamond">{h.name}</td>
                <td className="text-foreground/70">{h.account}</td>
                <td className="text-foreground/70">{h.bucket}</td>
                <td className="text-foreground/70">{h.owner}</td>
                <td className="text-foreground/70">{h.geo}</td>
                <td className="text-right tabular">{fmt(h.value)}</td>
              </tr>
            ))}
            <tr className="border-t-2 border-foreground font-serif text-lg">
              <td className="py-3">Total</td><td/><td/><td/><td/><td className="text-right tabular">{fmt(total)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
