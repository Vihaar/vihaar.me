import { AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useChapterNav, useToggleKey } from "@/hooks/useChapterNav";
import { Roots } from "@/components/chapters/Roots";
import { Winds } from "@/components/chapters/Winds";
import { Transition } from "@/components/chapters/Transition";
import { Family } from "@/components/chapters/Family";
import { Inflection } from "@/components/chapters/Inflection";
import { Allocator } from "@/components/chapters/Allocator";
import { Portfolio } from "@/components/chapters/Portfolio";
import { NextSteps } from "@/components/chapters/NextSteps";
import { Questions } from "@/components/chapters/Questions";
import {
  LedgerOverview, AllocationCharts, PrivateEquityBook, HedgeFundPipeline,
  AltInvestments, WealthManagers, AnnuityBook, RealEstateBook, IndiaBook,
  NextGenBook, PrivateCredit, FullLedger, PathTo100M
} from "@/components/chapters/Financials";
import { Appendix } from "@/components/Appendix";

const chapters = [
  { name: "Roots", el: <Roots /> },
  { name: "Winds", el: <Winds /> },
  { name: "Transition", el: <Transition /> },
  { name: "Family", el: <Family /> },
  { name: "Inflection", el: <Inflection /> },
  { name: "Allocator", el: <Allocator /> },
  { name: "Net Worth", el: <LedgerOverview /> },
  { name: "Allocation", el: <AllocationCharts /> },
  { name: "Portfolio", el: <Portfolio /> },
  { name: "Private Equity", el: <PrivateEquityBook /> },
  { name: "India", el: <IndiaBook /> },
  { name: "Real Estate", el: <RealEstateBook /> },
  { name: "Annuities", el: <AnnuityBook /> },
  { name: "Next Gen", el: <NextGenBook /> },
  { name: "Hedge Funds", el: <HedgeFundPipeline /> },
  { name: "Alt Funds", el: <AltInvestments /> },
  { name: "Wealth Mgrs", el: <WealthManagers /> },
  { name: "Private Credit", el: <PrivateCredit /> },
  { name: "Full Ledger", el: <FullLedger /> },
  { name: "Path to $100M", el: <PathTo100M /> },
  { name: "Next Steps", el: <NextSteps /> },
  { name: "Questions", el: <Questions /> },
];

const Index = () => {
  const navigate = useNavigate();
  const { i, go } = useChapterNav(chapters.length);
  const [focus] = useToggleKey("f");
  const [appendix, setAppendix] = useToggleKey("a");
  const [notes] = useToggleKey("n");
  const darkChapters = ["Inflection", "Path to $100M"];
  const dark = darkChapters.includes(chapters[i].name);

  return (
    <main className="fixed inset-0 overflow-hidden">
      {!focus && (
        <header className={`absolute top-0 left-0 right-0 z-30 px-6 py-3 flex items-center justify-between ${dark ? "text-paper/80" : "text-foreground/70"}`}>
          <div className="flex items-center gap-4">
            <div className="smallcaps text-[0.65rem]">Usha Nandigala · Portfolio Defense · TIGER 21</div>
            <button
              type="button"
              onClick={() => navigate("/pictures")}
              className={`smallcaps text-[0.65rem] border px-2 py-1 transition-colors ${dark ? "border-paper/40 hover:bg-paper/15" : "border-foreground/30 hover:bg-foreground/10"}`}
            >
              Pictures
            </button>
          </div>
          <div className="smallcaps text-[0.65rem] hidden md:block">{String(i + 1).padStart(2, "0")} · {chapters[i].name}</div>
        </header>
      )}

      <div className="absolute inset-0">
        <AnimatePresence mode="wait">
          <div key={i} className="h-full w-full">{chapters[i].el}</div>
        </AnimatePresence>
      </div>

      {!focus && (
        <>
          <button
            onClick={() => go(i - 1)}
            disabled={i === 0}
            aria-label="Previous chapter"
            className={`fixed left-3 md:left-6 bottom-16 md:top-1/2 md:-translate-y-1/2 z-40 h-12 w-12 rounded-full border flex items-center justify-center backdrop-blur-sm transition-all disabled:opacity-20 disabled:cursor-not-allowed ${dark ? "border-paper/40 bg-paper/10 text-paper hover:bg-paper/20" : "border-foreground/30 bg-background/40 text-foreground hover:bg-background/70"}`}
          >
            <span className="text-xl leading-none">‹</span>
          </button>
          <button
            onClick={() => go(i + 1)}
            disabled={i === chapters.length - 1}
            aria-label="Next chapter"
            className={`fixed right-3 md:right-6 bottom-16 md:top-1/2 md:-translate-y-1/2 z-40 h-12 w-12 rounded-full border flex items-center justify-center backdrop-blur-sm transition-all disabled:opacity-20 disabled:cursor-not-allowed ${dark ? "border-paper/40 bg-paper/10 text-paper hover:bg-paper/20" : "border-foreground/30 bg-background/40 text-foreground hover:bg-background/70"}`}
          >
            <span className="text-xl leading-none">›</span>
          </button>
        </>
      )}

      {!focus && (
        <footer className={`absolute bottom-0 left-0 right-0 z-30 px-6 py-3 flex items-center justify-between ${dark ? "text-paper/70" : "text-foreground/60"}`}>
          <div className="smallcaps text-[0.65rem]">{String(i + 1).padStart(2, "0")} / {String(chapters.length).padStart(2, "0")}</div>
          <div className="flex-1 mx-6 h-px bg-current opacity-20 relative">
            <div className="absolute left-0 top-0 h-px bg-gold transition-all" style={{ width: `${((i + 1) / chapters.length) * 100}%` }} />
          </div>
          <div className="smallcaps text-[0.65rem] hidden md:block">F · A · N · ←/→</div>
        </footer>
      )}

      {notes && (
        <div className="absolute right-6 top-20 z-40 w-80 bg-paper border border-gold p-5 shadow-2xl">
          <div className="smallcaps text-gold-deep mb-2">Speaker Notes · {chapters[i].name}</div>
          <div className="font-garamond text-sm text-foreground/80 leading-relaxed">
            Pause. Let the room sit with the image before reading the line aloud.
          </div>
        </div>
      )}

      {appendix && <Appendix onClose={() => setAppendix(false)} />}
    </main>
  );
};

export default Index;
