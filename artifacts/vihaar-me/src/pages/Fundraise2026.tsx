import { useMemo, useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { FundraiseDonate } from "@/components/FundraiseDonate";
import { DonorDetailsForm } from "@/components/DonorDetailsForm";
import { FUNDRAISE_DONORS, type FundraiseDonorRow } from "@/data/fundraiseDonors";

const baseUrl = () => (import.meta.env.BASE_URL || "/").replace(/\/$/, "");
const asset = (file: string) => `${import.meta.env.BASE_URL}images/${file}`;
const fi = (path: string) => `${baseUrl()}/feeding-india/${path}`;
const doc = (file: string) => `${baseUrl()}/documents/${file}`;

const HERO_MEALS = 322_530;

const GOAL_CENTS = 30_000_00; // $30,000.00 in cents for clean math
const RAISED_CENTS = 32_253_00; // $32,253.00
const COMPLETED_DATE = "March 15, 2026";

/** ~6k rows on the wall — amounts sum to $32,253 / 322,530 campaign meals (see `fundraiseDonors.ts`) */
const DONORS: readonly FundraiseDonorRow[] = FUNDRAISE_DONORS;
const GIFT_COUNT = 3_784; // Official gift count displayed

/** $1 = 10 meals — based on India school meal costs (₹5–10/meal; $1 ≈ ₹83 → ~8–16 meals). 10 is conservative. */
const MEALS_PER_DOLLAR = 10;

function formatUsd(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(cents / 100);
}

/** $1 = 10 meals; wall amounts in cents → meals = (cents/100) * 10 = cents/10 */
function mealsFromDonationCents(amountCents: number) {
  return Math.floor((amountCents / 100) * MEALS_PER_DOLLAR);
}

/** One line like the tree-wall cadence: "500 meals" */
function mealCountLine(n: number) {
  return `${n.toLocaleString("en-US")} meals`;
}

function formatDonorWallDate(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    timeZone: "America/New_York",
    month: "numeric",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
}

/** Animated counting number — eases from 0 to target over durationMs */
function useAnimatedNumber(target: number, durationMs = 2400, startOnMount = true) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!startOnMount) return;
    const start = performance.now();
    const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);
    function tick(now: number) {
      const elapsed = now - start;
      const t = Math.min(1, elapsed / durationMs);
      setValue(Math.round(easeOutQuart(t) * target));
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }, [target, durationMs, startOnMount]);
  return value;
}

/** Full-viewport hero with Feeding India video, animated meal count, tagline, scroll cue */
function FundraiseHero() {
  const count = useAnimatedNumber(HERO_MEALS, 2400);
  return (
    <section className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden">
      <video
        autoPlay
        muted
        loop
        playsInline
        poster={fi("hero/poster.webp")}
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src={fi("hero/video.mp4")} type="video/mp4" />
        <source src={fi("hero/video.webm")} type="video/webm" />
      </video>
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent"
        aria-hidden
      />
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-white tabular-nums drop-shadow-[0_2px_24px_rgba(0,0,0,0.6)] leading-none tracking-tight mb-4"
        >
          {count.toLocaleString("en-US")} meals
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="font-display text-lg sm:text-xl md:text-2xl text-amber-100/95 drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)]"
        >
          Feeding people is sacred work — <span className="text-[#fde68a]">annadaan</span>
        </motion.p>
      </div>
      <motion.a
        href="#donate"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-amber-100/90 hover:text-white transition-colors"
      >
        <span className="font-body text-sm tracking-wide">Scroll down to donate</span>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="opacity-80"
          style={{ animation: "scrollBounce 2s ease-in-out infinite" }}
        >
          <path d="M12 5v14M19 12l-7 7-7-7" />
        </svg>
      </motion.a>
    </section>
  );
}

/** Meal shape for nutrition card */
type MealItem = {
  meal: string;
  src: string;
  kcal: number;
  protein: number;
  fat: number;
  carbs: number;
  fibre: number;
};

/** Week menu — days only, multiple dishes per day */
const WEEK_MEALS: { day: string; meals: MealItem[] }[] = [
  { day: "Monday", meals: [{ meal: "Vegetable poha + milk", src: "meals/veg-poha-milk.webp", kcal: 320, protein: 8, fat: 9, carbs: 54, fibre: 3 }] },
  { day: "Tuesday", meals: [{ meal: "Rajma curry + jeera rice + salad", src: "meals/rajma-curry-rice-salad.webp", kcal: 380, protein: 12, fat: 10, carbs: 58, fibre: 5 }] },
  { day: "Wednesday", meals: [{ meal: "Black chana chaat", src: "meals/black-chana-chaat.webp", kcal: 290, protein: 10, fat: 8, carbs: 42, fibre: 6 }] },
  { day: "Thursday", meals: [{ meal: "Stuffed parantha + pickle + curd", src: "meals/stuffed-parantha-pickle-curd.webp", kcal: 350, protein: 9, fat: 12, carbs: 52, fibre: 4 }] },
  {
    day: "Friday",
    meals: [
      { meal: "Masoor dal + bhindi + roti + salad", src: "meals/masoor-dal-bhindi-roti.webp", kcal: 365, protein: 14, fat: 9, carbs: 56, fibre: 6 },
      { meal: "Dry fruit laddu + milk", src: "meals/dry-fruit-laddu-milk.webp", kcal: 335, protein: 8, fat: 10, carbs: 55, fibre: 3 },
    ],
  },
  {
    day: "Saturday",
    meals: [
      { meal: "Veg peas cutlet + mint chutney", src: "meals/veg-peas-cutlet-chutney.webp", kcal: 310, protein: 11, fat: 11, carbs: 38, fibre: 5 },
      { meal: "Vegetable vermicelli + milk", src: "meals/veg-vermicelli-milk.webp", kcal: 305, protein: 9, fat: 8, carbs: 50, fibre: 4 },
    ],
  },
  {
    day: "Sunday",
    meals: [
      { meal: "Sabudana khichdi + milk", src: "meals/sabudana-khichdi-milk.webp", kcal: 340, protein: 7, fat: 8, carbs: 62, fibre: 2 },
      { meal: "Vegetable soyabean pulao + raita", src: "meals/veg-soyabean-pulao-raita.webp", kcal: 370, protein: 13, fat: 10, carbs: 58, fibre: 5 },
      { meal: "Pav bhaji", src: "meals/pav-bhaji.webp", kcal: 355, protein: 10, fat: 12, carbs: 52, fibre: 5 },
    ],
  },
];

const MEALS_COUNT = WEEK_MEALS.flatMap((d) => d.meals).length;

/** Convert flat index (0..MEALS_COUNT-1) to day index, meal index, and meal. */
function flatIndexToDayAndMeal(flat: number) {
  let rem = ((flat % MEALS_COUNT) + MEALS_COUNT) % MEALS_COUNT;
  for (let d = 0; d < WEEK_MEALS.length; d++) {
    const len = WEEK_MEALS[d].meals.length;
    if (rem < len) return { dayIndex: d, mealIndex: rem, meal: WEEK_MEALS[d].meals[rem] };
    rem -= len;
  }
  const last = WEEK_MEALS[WEEK_MEALS.length - 1];
  return {
    dayIndex: WEEK_MEALS.length - 1,
    mealIndex: last.meals.length - 1,
    meal: last.meals[last.meals.length - 1],
  };
}

/** Flat index of first meal for a given day. */
function flatIndexForDay(dayIndex: number) {
  let idx = 0;
  for (let d = 0; d < dayIndex; d++) idx += WEEK_MEALS[d].meals.length;
  return idx;
}

function MealCarouselSection() {
  const [activeFlatIndex, setActiveFlatIndex] = useState(0);
  const { dayIndex: activeDayIndex, meal } = flatIndexToDayAndMeal(activeFlatIndex);

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mb-10 rounded-2xl border-2 border-dashed border-amber-600/50 bg-[#fffdf7] p-6 md:p-8 text-stone-900 shadow-md"
    >
      <h2 className="font-display text-2xl md:text-3xl text-[#7c2d12] mb-2">Fuelling kids with diverse, nutritious meals</h2>
      <p className="font-body text-stone-600 mb-4">
        The kinds of meals we serve through partner programs — balanced, region-specific, and made to fill
        bellies and fuel minds.
      </p>
      <p className="font-body text-stone-700 mb-6">
        <span className="font-display font-semibold text-[#14532d]">
          {mealsFromDonationCents(RAISED_CENTS).toLocaleString()} plates donated
        </span>
        {" "}— each one like a dish from this menu, served through{" "}
        <span className="font-display font-semibold">170 partners across India</span>.
      </p>

      {/* Day tabs — Mon–Sun only */}
      <div className="flex flex-wrap gap-2 mb-6">
        {WEEK_MEALS.map((d, i) => (
          <button
            key={d.day}
            type="button"
            onClick={() => setActiveFlatIndex(flatIndexForDay(i))}
            title={d.meals.map((m) => m.meal).join(" · ")}
            className={`font-display text-xs md:text-sm px-3 py-1.5 rounded-xl border-2 transition-colors ${
              activeDayIndex === i
                ? "border-[#b45309] bg-amber-100 text-[#7c2d12]"
                : "border-stone-300 bg-white/80 text-stone-600 hover:border-amber-400 hover:bg-amber-50/80"
            }`}
          >
            {d.day}
          </button>
        ))}
      </div>

      {/* Carousel: meal image + nutrition card — arrows cycle through all meals (day tabs auto-update) */}
      <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
        <div className="flex items-center gap-4 w-full md:w-auto justify-center">
          <button
            type="button"
            onClick={() => setActiveFlatIndex((i) => (i - 1 + MEALS_COUNT) % MEALS_COUNT)}
            className="flex-shrink-0 w-12 h-12 rounded-full border-2 border-amber-500/50 bg-white hover:bg-amber-50 flex items-center justify-center text-stone-700 transition-colors"
            aria-label="Previous meal"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <div className="w-40 h-40 md:w-52 md:h-52 rounded-full overflow-hidden border-2 border-amber-500/40 shadow-lg ring-2 ring-amber-100 flex-shrink-0">
            <img
              src={fi(meal.src)}
              alt={meal.meal}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <button
            type="button"
            onClick={() => setActiveFlatIndex((i) => (i + 1) % MEALS_COUNT)}
            className="flex-shrink-0 w-12 h-12 rounded-full border-2 border-amber-500/50 bg-white hover:bg-amber-50 flex items-center justify-center text-stone-700 transition-colors"
            aria-label="Next meal"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>

        {/* Nutrition card — "g" inline with numbers */}
        <div className="flex-1 w-full md:min-w-[260px] rounded-xl border-2 border-dashed border-[#f2d9a6] bg-[#fffdf5] p-6">
          <p className="font-body text-[#b59a7d] text-xs uppercase tracking-wider mb-1">Breakfast</p>
          <h3 className="font-display text-xl md:text-2xl text-[#4B2C20] mb-4 leading-tight">{meal.meal}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            <div>
              <p className="font-display text-2xl text-[#4B2C20] tabular-nums whitespace-nowrap">{meal.kcal}</p>
              <p className="font-body text-xs text-[#707070]">kcal</p>
            </div>
            <div>
              <p className="font-display text-2xl text-[#4B2C20] tabular-nums whitespace-nowrap">{meal.protein}&nbsp;g</p>
              <p className="font-body text-xs text-[#707070]">protein</p>
            </div>
            <div>
              <p className="font-display text-2xl text-[#4B2C20] tabular-nums whitespace-nowrap">{meal.fat}&nbsp;g</p>
              <p className="font-body text-xs text-[#707070]">fat</p>
            </div>
            <div>
              <p className="font-display text-2xl text-[#4B2C20] tabular-nums whitespace-nowrap">{meal.carbs}&nbsp;g</p>
              <p className="font-body text-xs text-[#707070]">carbs</p>
            </div>
            <div>
              <p className="font-display text-2xl text-[#4B2C20] tabular-nums whitespace-nowrap">{meal.fibre}&nbsp;g</p>
              <p className="font-body text-xs text-[#707070]">fibre</p>
            </div>
          </div>
          <p className="font-body text-xs text-[#707070] mt-4 italic">
            *Portion sizes range 200g–350g to support healthy development. Actual meals may differ by region.
          </p>
        </div>
      </div>
    </motion.section>
  );
}

function ImpactMapSection() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mb-10 rounded-2xl border-2 border-dashed border-[#166534]/50 bg-[#faf6f0] p-6 md:p-8 text-stone-900 shadow-md"
    >
      <h2 className="font-display text-2xl md:text-3xl text-[#14532d] mb-2">Where we&apos;re making an impact</h2>
      <p className="font-body text-stone-600 mb-6">
        Partner schools across South India — Andhra Pradesh (Guntur, Vijayawada), Karnataka, Tamil Nadu, Kerala — with{" "}
        <a href="https://www.zomato.com/" target="_blank" rel="noopener noreferrer" className="text-[#9a3412] font-semibold underline decoration-dotted hover:decoration-solid">Zomato</a>
        ,{" "}
        <a href="https://www.akshayapatra.org/" target="_blank" rel="noopener noreferrer" className="text-[#9a3412] font-semibold underline decoration-dotted hover:decoration-solid">Akshaya Patra Foundation</a>
        ,{" "}
        <a href="https://kmcefoundation.com/" target="_blank" rel="noopener noreferrer" className="text-[#9a3412] font-semibold underline decoration-dotted hover:decoration-solid">KMCE Foundation</a>
        , and{" "}
        <a href="https://healcharity.org/what-we-do/heal-projects/childrens-village" target="_blank" rel="noopener noreferrer" className="text-[#9a3412] font-semibold underline decoration-dotted hover:decoration-solid">HEAL Charity</a>.
      </p>

      {/* Feeding India style: left data panel + right map */}
      <div className="flex flex-col md:flex-row gap-6 items-stretch">
        {/* Left panel — South stats */}
        <div className="md:w-56 shrink-0 bg-white rounded-xl border-2 border-stone-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 bg-[#fce8e4] border-b-2 border-[#EF4F5F]">
            <span className="font-display font-semibold text-stone-800">South</span>
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#EF4F5F]" />
              <span className="font-body text-sm text-stone-600">71 cities</span>
            </span>
          </div>
          <div className="px-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-body text-xs text-stone-500 uppercase tracking-wide">Children</p>
                <p className="font-display text-xl font-bold text-stone-900">28,576</p>
              </div>
              <div>
                <p className="font-body text-xs text-stone-500 uppercase tracking-wide">Partners</p>
                <p className="font-display text-xl font-bold text-stone-900">170</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right — map */}
        <div className="flex-1 min-w-0">
          <div className="relative w-full aspect-[1.98] max-w-2xl mx-auto rounded-xl overflow-hidden bg-[#faf6f0] border-2 border-[#EF4F5F]/30">
            <img
              src={fi("map/india-regions.svg")}
              alt="India map — partner centres in South India"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </div>

      {/* Kids we serve — Feeding India style story cards */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl overflow-hidden border-2 border-dashed border-[#EF4F5F]/30 bg-white shadow-sm">
          <img src={fi("stories/smiling-girl.png")} alt="Young woman smiling at feeding program — positive impact of the campaign" className="w-full aspect-[4/3] object-cover" loading="lazy" />
          <div className="p-3">
            <p className="font-body text-xs text-stone-500 italic">&ldquo;Full bellies, bright futures.&rdquo;</p>
          </div>
        </div>
        <div className="rounded-xl overflow-hidden border-2 border-dashed border-[#EF4F5F]/30 bg-white shadow-sm">
          <img src={fi("programs/daily-feeding-program.webp")} alt="Children at school meal" className="w-full aspect-[4/3] object-cover" loading="lazy" />
          <div className="p-3">
            <p className="font-body text-xs text-stone-500 italic">Daily feeding program — nutritious meals, every day.</p>
          </div>
        </div>
        <div className="rounded-xl overflow-hidden border-2 border-dashed border-[#EF4F5F]/30 bg-white shadow-sm">
          <img src={fi("programs/anganwadi-program.webp")} alt="Young children at anganwadi" className="w-full aspect-[4/3] object-cover" loading="lazy" />
          <div className="p-3">
            <p className="font-body text-xs text-stone-500 italic">Anganwadi centres — nurturing young minds.</p>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

/**
 * Food-oriented motes — rice grains, lentils (dal), leafy accents.
 * Symbolic of annadaan: rice, dal, and the harvest that feeds.
 */
function SevaWarmthField({ count = 96 }: { count?: number }) {
  const dots = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: `${(Math.sin(i * 1.63) * 0.5 + 0.5) * 92 + 4}%`,
      top: `${(Math.cos(i * 1.27) * 0.5 + 0.5) * 88 + 4}%`,
      delay: (i * 0.09) % 3.8,
      scale: 0.55 + (i % 6) * 0.11,
      kind: i % 6,
    }));
  }, [count]);

  return (
    <div className="pointer-events-none absolute inset-0 z-[2] overflow-hidden" aria-hidden>
      {dots.map((d) => {
        const isRice = d.kind === 0 || d.kind === 1;
        const isDal = d.kind === 2 || d.kind === 3;
        const isLeaf = d.kind === 4 || d.kind === 5;
        const anim = isDal ? "dalDrift" : isLeaf ? "leafSway" : "riceGlow";
        const base = isRice
          ? "rounded-[50%] bg-amber-100/80 shadow-[0_0_12px_rgba(254,243,199,0.7)]"
          : isDal
            ? "rounded-full bg-amber-500/60 shadow-[0_0_8px_rgba(245,158,11,0.5)]"
            : "rounded-full bg-emerald-400/50 shadow-[0_0_8px_rgba(52,211,153,0.4)]";
        const w = isRice ? 8 * d.scale : isLeaf ? 6 * d.scale : 4 * d.scale;
        const h = isRice ? 3 * d.scale : isLeaf ? 5 * d.scale : 4 * d.scale;
        return (
          <span
            key={d.id}
            className="absolute"
            style={{
              left: d.left,
              top: d.top,
              transform: isRice ? `rotate(${d.id * 12}deg)` : isLeaf ? `rotate(${d.id * 7}deg)` : undefined,
            }}
          >
            <span
              className={`block ${base}`}
              style={{
                width: w,
                height: h,
                animation: `${anim} ${3.2 + (d.id % 3) * 0.35}s ease-in-out infinite`,
                animationDelay: `${d.delay}s`,
                opacity: 0.85,
              }}
            />
          </span>
        );
      })}
    </div>
  );
}

export default function Fundraise2026() {
  const [location, setLocation] = useLocation();
  const params = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
  const showDonorForm = params?.get("donated") === "1";
  const amountParam = params?.get("amount");
  const amountCents = amountParam ? parseInt(amountParam, 10) : undefined;
  const [donorFormDismissed, setDonorFormDismissed] = useState(false);

  const displayDonorForm = showDonorForm && !donorFormDismissed;

  function dismissDonorForm() {
    setDonorFormDismissed(true);
    const u = new URL(window.location.href);
    u.searchParams.delete("donated");
    u.searchParams.delete("amount");
    setLocation(u.pathname + u.search, { replace: true });
  }

  const raisedDollars = RAISED_CENTS / 100;
  const pct = Math.min(100, (RAISED_CENTS / GOAL_CENTS) * 100);
  const overPct = ((RAISED_CENTS / GOAL_CENTS) * 100).toFixed(1);
  const deliveryRunsCommitted = Math.floor(raisedDollars / 1000);

  return (
    <div className="fundraise-seva-page min-h-screen relative overflow-x-hidden text-stone-100">
      <style>{`
        @keyframes riceGlow {
          0%, 100% { opacity: 0.4; filter: blur(0px); transform: translate(0, 0) scale(1); }
          50% { opacity: 0.92; filter: blur(0.2px); transform: translate(1px, -2px) scale(1.08); }
        }
        @keyframes dalDrift {
          0%, 100% { opacity: 0.35; transform: translate(0, 0) rotate(0deg); }
          50% { opacity: 0.85; transform: translate(-2px, 3px) rotate(5deg); }
        }
        @keyframes leafSway {
          0%, 100% { opacity: 0.3; transform: translate(0, 0) skew(0deg); }
          50% { opacity: 0.75; transform: translate(1px, 2px) skew(3deg); }
        }
        @keyframes scrollBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(6px); }
        }
      `}</style>


      <AnimatePresence>
        {displayDonorForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 backdrop-blur-sm py-16 px-4"
            onClick={(e) => e.target === e.currentTarget && dismissDonorForm()}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              onClick={(e) => e.stopPropagation()}
            >
              <DonorDetailsForm
                amountCents={Number.isFinite(amountCents) ? amountCents : undefined}
                onSuccess={dismissDonorForm}
                onDismiss={dismissDonorForm}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero: full-viewport video + overlay */}
      <FundraiseHero />

      {/* Content below hero: gradient bg + sections */}
      <div className="relative">
        <div
          className="absolute inset-0 z-[1] opacity-[0.55]"
          style={{
            background:
              "radial-gradient(ellipse 100% 70% at 50% 100%, rgba(180, 83, 9, 0.4) 0%, transparent 55%), radial-gradient(ellipse 80% 50% at 50% 0%, rgba(30, 64, 27, 0.45) 0%, transparent 60%)",
          }}
        />
        <SevaWarmthField count={96} />
        <div className="relative z-10 mx-auto max-w-3xl px-4 pb-24 pt-12 md:pt-16">
        {/* 1) Donate — scroll target */}
        <section id="donate" className="scroll-mt-24">
          <FundraiseDonate />
        </section>

        {/* 2) Donor wall — leaderboard + scrollable list */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="mb-10 rounded-2xl border-2 border-dashed border-[#166534]/45 bg-[#faf6f0] p-6 md:p-8 text-stone-900 pantry-card-texture shadow-[0_4px_20px_rgba(22,101,52,0.08)]"
        >
          <h2 className="font-display text-3xl mb-2 text-[#14532d]">Wall of generosity</h2>
          <p className="font-body text-stone-600 mb-6">
            {GIFT_COUNT.toLocaleString()} gifts, newest first — same cadence as a public donor wall: who, sometimes a second
            line or a note, then meals in our campaign count. Gift sizes vary;
            they still add up to{" "}
            <span className="font-display font-bold text-[#9a3412]">
              {mealCountLine(mealsFromDonationCents(RAISED_CENTS))}
            </span>
            .
          </p>

          {/* Leaderboard — top 3 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {DONORS.slice(0, 3).map((d, i) => (
              <div
                key={i}
                className="rounded-xl border-2 border-dashed border-amber-500/50 bg-[#fffbeb] p-4 text-center"
              >
                <div className="font-display text-lg font-semibold text-stone-900">{d.primary}</div>
                {d.note ? (
                  <div className="font-body text-sm text-stone-600 mt-1 line-clamp-2">{d.note}</div>
                ) : null}
                <div className="font-display text-xl text-[#9a3412] tabular-nums mt-2">
                  {mealCountLine(mealsFromDonationCents(d.amountCents))}
                </div>
              </div>
            ))}
          </div>

          <ul className="divide-y divide-[#d6d3d1] border-2 border-[#a8a29e] rounded-xl overflow-y-auto overscroll-contain max-h-[min(75vh,640px)] [scrollbar-gutter:stable] bg-[#fffdfb]/90">
            {DONORS.slice(3).map((d, i) => (
              <li
                key={i}
                className="group px-4 py-4 font-body text-stone-800 [content-visibility:auto] [contain-intrinsic-size:auto_5.5rem]"
              >
                <div className="font-display text-base font-semibold text-stone-900 leading-snug">
                  {d.primary}
                </div>
                {d.secondary ? (
                  <div className="font-body text-sm text-stone-700 leading-snug mt-0.5">{d.secondary}</div>
                ) : null}
                {d.note ? (
                  <div className="font-body text-sm text-stone-600 leading-snug mt-1">{d.note}</div>
                ) : null}
                <div className="flex items-baseline justify-between gap-4 mt-2">
                  <div className="font-display text-base text-[#9a3412] tabular-nums">
                    {mealCountLine(mealsFromDonationCents(d.amountCents))}
                  </div>
                  <time
                    dateTime={d.donatedAt}
                    className="font-body text-[10px] text-stone-400 tabular-nums shrink-0 opacity-0 group-hover:opacity-70 transition-opacity"
                    title={formatDonorWallDate(d.donatedAt)}
                  >
                    {formatDonorWallDate(d.donatedAt)}
                  </time>
                </div>
              </li>
            ))}
            <li className="px-4 py-5 bg-[#ecfccb]/90 border-t-2 border-dashed border-[#65a30d]/50">
              <div className="font-display text-lg font-semibold text-[#14532d]">Total</div>
              <div className="font-display text-xl text-[#422006] tabular-nums mt-1">
                {mealCountLine(mealsFromDonationCents(RAISED_CENTS))}
              </div>
            </li>
          </ul>
        </motion.section>

        {/* 3) Impact map — Andhra Pradesh / Guntur schools */}
        <ImpactMapSection />

        {/* 4) More information */}
        <h2 className="font-display text-2xl md:text-3xl text-[#fffbeb] mb-6">More information</h2>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8 rounded-2xl border-2 border-dashed border-amber-600/70 bg-[#fffdf7] text-stone-800 p-6 md:p-8 shadow-[0_8px_32px_rgba(127,29,29,0.18)] relative overflow-hidden pantry-card-texture ring-1 ring-amber-900/10"
        >
          <div className="absolute top-3 right-3 font-display text-[#b45309] text-sm rotate-3 drop-shadow-sm">
            जय हो · we did it!
          </div>
          <p className="font-display text-xl md:text-2xl text-[#7c2d12] mb-1">Campaign completed</p>
          <p className="font-body text-stone-700 text-sm md:text-base mb-6">
            Closed <span className="font-semibold">{COMPLETED_DATE}</span> — you blew past the goal.
          </p>

          <div className="text-center border-y-2 border-dashed border-[#ca8a04]/35 py-6 mb-6">
            <p className="font-display text-4xl sm:text-5xl md:text-6xl text-[#422006] leading-none tracking-tight tabular-nums">
              {mealCountLine(mealsFromDonationCents(RAISED_CENTS))}
            </p>
            <p className="font-body text-stone-600 mt-3 text-base md:text-lg">
              <span className="font-display font-semibold text-stone-800">
                {formatUsd(RAISED_CENTS)}
              </span>{" "}
              raised · $1 converts to 10 meals donated (India school meal programs)
            </p>
          </div>

          <div className="mb-4">
            <div className="flex justify-between font-display text-sm text-stone-600 mb-1">
              <span>Progress</span>
              <span>
                {formatUsd(RAISED_CENTS)} / {formatUsd(GOAL_CENTS)}
              </span>
            </div>
            <div className="h-4 rounded-full border-2 border-[#78716c] bg-stone-200 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#ea580c] via-[#f59e0b] to-[#16a34a] transition-all"
                style={{ width: `${pct}%` }}
              />
            </div>
            <p className="mt-2 text-sm text-stone-600 font-body text-center">
              <span className="font-display font-bold text-[#9a3412]">{overPct}%</span> of the goal
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-3 text-center">
            <div className="rounded-xl border-2 border-dashed border-[#166534]/40 bg-[#f0fdf4]/90 py-3 px-1">
              <p className="font-display text-xl sm:text-2xl text-[#14532d] tabular-nums">
                {mealsFromDonationCents(RAISED_CENTS).toLocaleString()}
              </p>
              <p className="font-body text-[10px] sm:text-xs text-stone-600 leading-tight">
                plates · see menu below ↓
              </p>
            </div>
            <div className="rounded-xl border-2 border-dashed border-stone-400 bg-white/90 py-3 px-1">
              <p className="font-display text-xl sm:text-2xl text-[#422006] tabular-nums">
                {(RAISED_CENTS / 100).toLocaleString()}
              </p>
              <p className="font-body text-[10px] sm:text-xs text-stone-600 leading-tight">dollars raised</p>
            </div>
            <div className="rounded-xl border-2 border-dashed border-[#9a3412]/35 bg-white/90 py-3 px-1">
              <p className="font-display text-xl sm:text-2xl text-[#7c2d12] tabular-nums">
                {deliveryRunsCommitted}
              </p>
              <p className="font-body text-[10px] sm:text-xs text-stone-600 leading-tight">miles Vihaar has to run!</p>
            </div>
          </div>
        </motion.div>

        {/* Story */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10 rounded-2xl border-2 border-dashed border-[#b45309]/55 bg-[#fffdf5] p-6 md:p-8 text-stone-800 shadow-md pantry-card-texture ring-1 ring-rose-900/5"
        >
          <h2 className="font-display text-3xl text-[#7f1d1d] mb-4">Why this mattered</h2>
          <div className="font-body text-lg leading-relaxed space-y-4">
            <p>
              Food is the basis of life. Without it, education doesn&apos;t matter. Health doesn&apos;t matter.
              Nothing else holds. I ran for every dollar donated because that&apos;s the deal — and because
              getting meals to kids who need them is the foundation everything else builds on.
            </p>
            <p>
              Our food system is chronically broken. The long-term fix is politics — more grants, better policy, real structural change. Until that
              happens, direct donations bridge the gap. They keep school kitchens running, weekend bags full,
              and kids fed so they can show up to learn.
            </p>
            <p>
              In a world full of noise, it&apos;s easy not to care. Thank you so much for caring.
            </p>
          </div>
        </motion.section>

        {/* Serving food — annadaan illustration + kids images */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10 rounded-2xl border-2 border-dashed border-[#166534]/45 bg-gradient-to-br from-[#f7fee7]/90 to-[#fff7ed]/90 p-4 md:p-6 text-stone-900 shadow-sm overflow-hidden"
        >
          <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center">
            <div className="w-full md:w-[46%] shrink-0 space-y-4">
              <img
                src={asset("fundraise-annadaan-serving.png")}
                alt="Serving food to children — annadaan, the sacred work of feeding people. Young man with a ladle serving rice from a pot to children at a community meal."
                className="w-full rounded-xl border-2 border-dashed border-amber-600/45 object-cover aspect-square ring-2 ring-green-800/10"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="flex-1 font-body text-lg leading-relaxed space-y-3">
              <h2 className="font-display text-3xl text-[#14532d] mb-2">Hands in the pot, kids fed first</h2>
              <p>
                Annadaan — feeding people is sacred work. Every dollar from this campaign goes to India-based
                nonprofits: school lunch programs (Akshaya Patra), weekend feeding, and community kitchens
                run by partners like KMCE and HEAL.
              </p>
              <p className="text-stone-600 text-base">
                The money reaches kids in Andhra Pradesh and beyond — hot meals in classrooms, weekend bags
                for families, and the kind of food that lets children show up to learn, not hungry.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Food carousel — day tabs + meal + macros (like Feeding India) */}
        <MealCarouselSection />

        {/* Mechanics — night kitchen chalkboard, marigold + cream type */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10 rounded-2xl border-2 border-dashed border-amber-500/50 bg-gradient-to-br from-[#3f0d1f] via-[#1c1917] to-[#14532d]/90 p-6 md:p-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_12px_40px_rgba(0,0,0,0.25)]"
        >
          <h2 className="font-display text-3xl text-[#fde68a] mb-4 drop-shadow-sm">The deal (the fun part)</h2>
          <ul className="font-body text-lg text-[#fef3c7]/95 space-y-3 list-none">
            <li className="flex gap-3">
              <span className="font-display text-amber-400 shrink-0">१.</span>
              <span>
                Every <span className="font-semibold text-white">$1</span> converts to{" "}
                <span className="font-semibold text-white">10 meals donated</span> — based on India school meal
                programs (Akshaya Patra, etc. run at ~₹5–10/meal).
              </span>
            </li>
            <li className="flex gap-3">
              <span className="font-display text-amber-400 shrink-0">२.</span>
              <span>
                Each <span className="font-semibold text-white">whole dollar</span> converts to{" "}
                <span className="font-semibold text-white">10 meals donated</span> on the donor wall ($5 → 50 meals,
                $100 → 1,000).
              </span>
            </li>
            <li className="flex gap-3">
              <span className="font-display text-amber-400 shrink-0">३.</span>
              <span>
                Every <span className="font-semibold text-white">$1</span> forces Vihaar to lift{" "}
                <span className="font-semibold text-white">1 pound</span>; every{" "}
                <span className="font-semibold text-white">$1,000</span> forces Vihaar to run{" "}
                <span className="font-semibold text-white">1 mile</span>.
              </span>
            </li>
          </ul>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-xl border-2 border-dashed border-[#166534] bg-[#faf6f0] text-stone-900 p-4 text-center">
              <p className="font-display text-3xl text-[#14532d] tabular-nums">
                {mealsFromDonationCents(RAISED_CENTS).toLocaleString()}
              </p>
              <p className="font-body text-sm">
                plates · 170 partners across India
              </p>
            </div>
            <div className="rounded-xl border-2 border-dashed border-[#ca8a04]/60 bg-[#fffbeb] text-stone-900 p-4 text-center">
              <p className="font-display text-3xl text-[#422006] tabular-nums">
                {(RAISED_CENTS / 100).toLocaleString()}
              </p>
              <p className="font-body text-sm">dollars raised</p>
            </div>
            <div className="rounded-xl border-2 border-dashed border-[#9a3412]/50 bg-[#faf6f0] text-stone-900 p-4 text-center">
              <p className="font-display text-3xl text-[#7c2d12]">{deliveryRunsCommitted}</p>
              <p className="font-body text-sm">miles Vihaar has to run!</p>
            </div>
          </div>
        </motion.section>

        {/* Proof — how raised funds were allocated */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10 rounded-2xl border-2 border-dashed border-[#b45309]/55 bg-[#fff7ed] p-6 md:p-7 text-stone-800 shadow-sm"
        >
          <h2 className="font-display text-2xl md:text-3xl text-[#7c2d12] mb-2">
            How {formatUsd(RAISED_CENTS)} was put to work
          </h2>
          <p className="font-body leading-relaxed text-stone-700 mb-4">
            Donors got Stripe receipts. This is how the campaign total —{" "}
            <span className="font-semibold text-[#422006]">{formatUsd(RAISED_CENTS)}</span> — maps to program
            costs. For the signed statement, download the PDF below.
          </p>
          <div className="rounded-xl border-2 border-dashed border-[#ca8a04]/50 bg-white/90 p-4 md:p-5 mb-5">
            <a
              href={doc("final_statement.pdf")}
              download="final_statement.pdf"
              className="font-display text-lg text-[#9a3412] underline decoration-dotted underline-offset-4 hover:decoration-solid"
            >
              Download final statement (PDF)
            </a>
            <p className="font-body text-sm text-stone-600 mt-2 m-0">
              Full reconciliation and line-item context in one document.
            </p>
          </div>

          <ul className="space-y-3 font-body text-stone-800 list-none m-0 p-0 mb-2">
            <li className="rounded-lg border border-[#d6d3d1] bg-white/80 px-4 py-3">
              <span className="font-display font-semibold text-[#422006]">$26,792 (83%)</span>
              <span className="text-stone-600"> — Meal production</span>
            </li>
            <li className="rounded-lg border border-[#d6d3d1] bg-white/80 px-4 py-3">
              <span className="font-display font-semibold text-[#422006]">$2,903 (9%)</span>
              <span className="text-stone-600"> — Kitchen operations</span>
            </li>
            <li className="rounded-lg border border-[#d6d3d1] bg-white/80 px-4 py-3">
              <span className="font-display font-semibold text-[#422006]">$1,613 (5%)</span>
              <span className="text-stone-600"> — Distribution &amp; last-mile delivery</span>
            </li>
            <li className="rounded-lg border border-[#d6d3d1] bg-white/80 px-4 py-3">
              <span className="font-display font-semibold text-[#422006]">$645 (2%)</span>
              <span className="text-stone-600"> — Payment processing</span>
            </li>
            <li className="rounded-lg border border-[#d6d3d1] bg-white/80 px-4 py-3">
              <span className="font-display font-semibold text-[#422006]">$300 (1%)</span>
              <span className="text-stone-600"> — Reporting &amp; transparency</span>
            </li>
          </ul>

          <details className="rounded-xl border-2 border-dashed border-[#166534]/45 bg-[#faf6f0] overflow-hidden group">
            <summary className="font-display text-lg md:text-xl text-[#14532d] px-4 py-4 cursor-pointer list-none flex items-center justify-between gap-3 select-none hover:bg-[#f0fdf4]/80 [&::-webkit-details-marker]:hidden">
              <span>Full cost breakdown</span>
              <span className="text-stone-500 text-sm font-body shrink-0 transition-transform group-open:rotate-180" aria-hidden>
                ▼
              </span>
            </summary>
            <div className="px-4 pb-5 pt-0 space-y-5 border-t border-[#d6d3d1]/80 font-body text-stone-700 text-sm md:text-base leading-relaxed">
              <div>
                <p className="font-display font-semibold text-stone-900 m-0 mb-1">
                  $26,792 (83%) — Meal production
                </p>
                <p className="m-0">
                  Bulk purchase of staple grains like rice, protein sources such as toor dal and other lentils,
                  seasonal vegetables, cooking oil, salt, turmeric, chili powder, and other kitchen essentials
                  used in high-volume daily meal preparation. This also covers washing, sorting, prepping,
                  cooking, and portioning meals at scale through partner feeding programs.
                </p>
              </div>
              <div>
                <p className="font-display font-semibold text-stone-900 m-0 mb-1">
                  $2,903 (9%) — Kitchen operations
                </p>
                <p className="m-0">
                  Day-to-day running costs of the kitchens, including cook and helper wages, LPG fuel for
                  large-batch cooking, clean water access, water purification, dishwashing, sanitation supplies,
                  gloves, hairnets, aprons, cleaning materials, and routine upkeep of stoves, vessels, burners,
                  and industrial kitchen equipment.
                </p>
              </div>
              <div>
                <p className="font-display font-semibold text-stone-900 m-0 mb-1">
                  $1,613 (5%) — Distribution &amp; last-mile delivery
                </p>
                <p className="m-0">
                  Fuel, vehicle usage, route-based transport, loading and unloading, insulated food containers,
                  and safe daily delivery of prepared meals from kitchens to schools, community feeding points,
                  and Anganwadi childcare centers in and around Guntur.
                </p>
              </div>
              <div>
                <p className="font-display font-semibold text-stone-900 m-0 mb-1">
                  $645 (2%) — Payment processing
                </p>
                <p className="m-0">
                  Payment gateway charges, card processing fees, currency conversion from USD to INR,
                  cross-border transfer costs where applicable, and transaction-related banking fees required to
                  move funds to implementation partners.
                </p>
              </div>
              <div>
                <p className="font-display font-semibold text-stone-900 m-0 mb-1">
                  $300 (1%) — Reporting &amp; transparency
                </p>
                <p className="m-0">
                  Donor receipts, campaign reconciliation, payout records, internal tracking, basic auditing
                  support, impact documentation, and public-facing updates to keep the campaign accountable and
                  transparent.
                </p>
              </div>
            </div>
          </details>
        </motion.section>

        {/* Transparent routing */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10 rounded-2xl border-2 border-dashed border-[#166534]/50 bg-[#faf6f0] p-6 md:p-8 text-stone-800 shadow-sm pantry-card-texture"
        >
          <h2 className="font-display text-2xl md:text-3xl text-[#14532d] mb-4">Where the money went</h2>

          <div className="space-y-4 font-body leading-relaxed text-stone-800 mb-8">
            <p>
              Practically, that meant pooling proceeds and sending{" "}
              <span className="font-semibold text-[#422006]">charitable contributions</span> to vetted
              nonprofits (plus any small, documented line items if they showed up in the budget). Donors got
              receipts and a short note on{" "}
              <span className="font-semibold text-[#422006]">which organizations received what</span>. Donors receive
              a quick timelapse of me running all 32 miles in pure pain!
            </p>
          </div>

          <p className="font-body text-stone-700 mb-4 text-sm md:text-base">
            <strong>In partnership with</strong>{" "}
            <a href="https://www.zomato.com/" target="_blank" rel="noopener noreferrer" className="text-[#9a3412] underline decoration-dotted hover:decoration-solid">
              Zomato
            </a>
            , this campaign supports India-based nonprofits in hunger relief and school meals.
          </p>
          <h3 className="font-display text-xl text-[#7c2d12] mb-3">
            Partner organizations — links to all
          </h3>
          <p className="font-body text-stone-700 mb-5 text-sm md:text-base leading-relaxed">
            These are established India-based nonprofits. Summaries are short; follow the links for full
            programs and financials.
          </p>

          <ul className="space-y-5 list-none m-0 p-0">
            <li className="rounded-xl border-2 border-dashed border-[#ca8a04]/45 bg-[#fffbeb] p-4 md:p-5">
              <p className="font-display text-lg text-stone-900 m-0 mb-2">
                <a
                  href="https://www.akshayapatra.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#9a3412] underline decoration-dotted underline-offset-4 hover:decoration-solid"
                >
                  Akshaya Patra Foundation
                </a>
              </p>
              <p className="font-body text-stone-700 text-sm md:text-base leading-relaxed m-0">
                The world&apos;s largest NGO-run school lunch program — serves millions of children daily
                across India. Mid-day meals, anganwadi feeding, and scholarships. ~₹5–10 per meal; ~92% of
                donations go to program costs.
              </p>
            </li>
            <li className="rounded-xl border-2 border-dashed border-[#166534]/40 bg-[#f0fdf4]/80 p-4 md:p-5">
              <p className="font-display text-lg text-stone-900 m-0 mb-2">
                <a
                  href="https://kmcefoundation.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#14532d] underline decoration-dotted underline-offset-4 hover:decoration-solid"
                >
                  KMCE Foundation
                </a>
              </p>
              <p className="font-body text-stone-700 text-sm md:text-base leading-relaxed m-0">
                Khawaja Mohinuddin Chisty Eye Foundation — founded 2007 in Guntur, Andhra Pradesh. Educational,
                medical, women empowerment, and <strong>free food</strong> programs. NGO Darpan registered, CSR
                certified, FCRA account.
              </p>
            </li>
            <li className="rounded-xl border-2 border-dashed border-[#166534]/40 bg-[#f0fdf4]/80 p-4 md:p-5">
              <p className="font-display text-lg text-stone-900 m-0 mb-2">
                <a
                  href="https://healcharity.org/what-we-do/heal-projects/childrens-village"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#14532d] underline decoration-dotted underline-offset-4 hover:decoration-solid"
                >
                  HEAL Charity — Children&apos;s Village
                </a>
              </p>
              <p className="font-body text-stone-700 text-sm md:text-base leading-relaxed m-0">
                HEAL projects including Children&apos;s Village — holistic care and support for children in need
                across India.
              </p>
            </li>
            <li className="rounded-xl border-2 border-dashed border-stone-400 bg-white/90 p-4 md:p-5">
              <p className="font-display text-lg text-stone-900 m-0 mb-2">
                <a
                  href="https://annapoorna.org.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#7c2d12] underline decoration-dotted underline-offset-4 hover:decoration-solid"
                >
                  Annapoorna Trust
                </a>
              </p>
              <p className="font-body text-stone-700 text-sm md:text-base leading-relaxed m-0">
                Provides free breakfast for school children in rural India — ensuring no child starts the day
                hungry. Focus on nutrition and education in underserved communities.
              </p>
            </li>
          </ul>

          <p className="font-body text-sm text-stone-600 mt-6 leading-relaxed">
            The meals / Vihaar running miles tally was the hook; the outcome is India-based organizations
            that show up for kids and school kitchens. Thank you so much to all who donated!
          </p>
        </motion.section>
        </div>
      </div>
    </div>
  );
}
