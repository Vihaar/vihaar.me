export type Holding = { name: string; account: string; value: number; bucket: string; owner: string; liquid: boolean; geo: "US" | "India" };

export const holdings: Holding[] = [
  { name: "Usha Trust", account: "Fidelity", value: 2_500_000, bucket: "Public Liquid", owner: "Usha", liquid: true, geo: "US" },
  { name: "Usha Trust Custodian", account: "Fidelity", value: 800_000, bucket: "Public Liquid", owner: "Usha", liquid: true, geo: "US" },
  { name: "Usha Roth IRA", account: "Roth IRA", value: 8_000_000, bucket: "Public Liquid", owner: "Usha", liquid: true, geo: "US" },
  { name: "Deferred Annuity", account: "Fidelity Deferred Annuity", value: 700_000, bucket: "Annuity", owner: "Usha", liquid: false, geo: "US" },
  { name: "Prudential Annuity", account: "Hantz Group", value: 500_000, bucket: "Annuity", owner: "Usha", liquid: false, geo: "US" },
  { name: "Prudential Annuity II", account: "Hantz Group", value: 300_000, bucket: "Annuity", owner: "Usha", liquid: false, geo: "US" },
  { name: "Interactive Brokers", account: "Individual", value: 5_000_000, bucket: "Public Liquid", owner: "Usha", liquid: true, geo: "US" },
  // Private Equity
  { name: "Syon Capital — Palo Alto", account: "PE", value: 200_000, bucket: "Private Equity", owner: "Usha", liquid: false, geo: "US" },
  { name: "Singular Capital Pre-IPO", account: "PE", value: 750_000, bucket: "Private Equity", owner: "Usha", liquid: false, geo: "US" },
  { name: "Allocate Alpha Fund", account: "PE", value: 150_000, bucket: "Private Equity", owner: "Usha", liquid: false, geo: "US" },
  { name: "Allocate Premier Access", account: "PE", value: 250_000, bucket: "Private Equity", owner: "Usha", liquid: false, geo: "US" },
  { name: "Rohati", account: "PE", value: 250_000, bucket: "Private Equity", owner: "Usha", liquid: false, geo: "US" },
  { name: "Gamit", account: "PE", value: 10_000, bucket: "Private Equity", owner: "Usha", liquid: false, geo: "US" },
  { name: "Saronic", account: "PE", value: 100_000, bucket: "Private Equity", owner: "Usha", liquid: false, geo: "US" },
  { name: "General Catalyst Creation 3", account: "PE", value: 100_000, bucket: "Private Equity", owner: "Usha", liquid: false, geo: "US" },
  { name: "InvestX Fund", account: "PE", value: 250_000, bucket: "Private Equity", owner: "Usha", liquid: false, geo: "US" },
  { name: "Singular V-Tect Fund", account: "PE", value: 150_000, bucket: "Private Equity", owner: "Usha", liquid: false, geo: "US" },
  { name: "Eradium Real Estate", account: "PE", value: 100_000, bucket: "Private Equity", owner: "Usha", liquid: false, geo: "US" },
  { name: "OpenDoor (Anthropic)", account: "PE", value: 400_000, bucket: "Private Equity", owner: "Usha", liquid: false, geo: "US" },
  // Kids
  { name: "Vipul — Fidelity", account: "Fidelity", value: 2_500_000, bucket: "Next Generation", owner: "Vipul", liquid: true, geo: "US" },
  { name: "Vipul — Roth IRA", account: "Roth IRA", value: 30_000, bucket: "Next Generation", owner: "Vipul", liquid: true, geo: "US" },
  { name: "Vipul — Interactive Brokers", account: "IB", value: 500_000, bucket: "Next Generation", owner: "Vipul", liquid: true, geo: "US" },
  { name: "Vipul — Personal Capital", account: "PC", value: 500_000, bucket: "Next Generation", owner: "Vipul", liquid: true, geo: "US" },
  { name: "Vipul — Open Door Fund", account: "PE", value: 600_000, bucket: "Next Generation", owner: "Vipul", liquid: false, geo: "US" },
  { name: "Vihaar — Fidelity", account: "Fidelity", value: 2_700_000, bucket: "Next Generation", owner: "Vihaar", liquid: true, geo: "US" },
  { name: "Vihaar — Interactive Brokers", account: "IB", value: 300_000, bucket: "Next Generation", owner: "Vihaar", liquid: true, geo: "US" },
  { name: "Vihaar — OpenDoor (Anthropic)", account: "PE", value: 400_000, bucket: "Next Generation", owner: "Vihaar", liquid: false, geo: "US" },
  { name: "Vihaar — Roth IRA", account: "Roth IRA", value: 17_000, bucket: "Next Generation", owner: "Vihaar", liquid: true, geo: "US" },
  { name: "Vijval — Fidelity", account: "Fidelity", value: 2_500_000, bucket: "Next Generation", owner: "Vijval", liquid: true, geo: "US" },
  { name: "Vijval — Interactive Brokers", account: "IB", value: 200_000, bucket: "Next Generation", owner: "Vijval", liquid: true, geo: "US" },
  { name: "Vijval — OpenDoors", account: "PE", value: 250_000, bucket: "Next Generation", owner: "Vijval", liquid: false, geo: "US" },
  { name: "Vijval — Roth IRA", account: "Roth IRA", value: 5_000, bucket: "Next Generation", owner: "Vijval", liquid: true, geo: "US" },
  // Real estate
  { name: "House — Michigan", account: "Real Estate", value: 1_500_000, bucket: "Real Estate", owner: "Usha", liquid: false, geo: "US" },
  { name: "House — Tennessee", account: "Real Estate", value: 600_000, bucket: "Real Estate", owner: "Usha", liquid: false, geo: "US" },
  // India
  { name: "Flat — Ameerpet", account: "India RE", value: 80_000, bucket: "India", owner: "Usha", liquid: false, geo: "India" },
  { name: "Miyapur Land", account: "India RE", value: 650_000, bucket: "India", owner: "Usha", liquid: false, geo: "India" },
  { name: "Farm Land", account: "India RE", value: 60_000, bucket: "India", owner: "Usha", liquid: false, geo: "India" },
  { name: "Airport Land", account: "India RE", value: 400_000, bucket: "India", owner: "Usha", liquid: false, geo: "India" },
  { name: "Cash — India", account: "Cash", value: 500_000, bucket: "India", owner: "Usha", liquid: true, geo: "India" },
  { name: "Virchow Labs (3%)", account: "Direct", value: 5_000_000, bucket: "India", owner: "Usha", liquid: false, geo: "India" },
  { name: "Yubhas Renewables", account: "Direct", value: 100_000, bucket: "India", owner: "Usha", liquid: false, geo: "India" },
];

export const total = holdings.reduce((s, h) => s + h.value, 0);
export const goal = 100_000_000;

export const byBucket = () => {
  const m = new Map<string, number>();
  holdings.forEach(h => m.set(h.bucket, (m.get(h.bucket) ?? 0) + h.value));
  return Array.from(m, ([name, value]) => ({ name, value }));
};

export const liquidSplit = () => {
  let liquid = 0, illiquid = 0;
  holdings.forEach(h => h.liquid ? liquid += h.value : illiquid += h.value);
  return [{ name: "Liquid", value: liquid }, { name: "Illiquid", value: illiquid }];
};

export const byOwner = () => {
  const owners = ["Usha", "Vipul", "Vihaar", "Vijval"];
  return owners.map(o => ({ name: o, value: holdings.filter(h => h.owner === o).reduce((s, h) => s + h.value, 0) }));
};

export const fmt = (n: number) =>
  n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(2)}M` : `$${(n / 1_000).toFixed(0)}K`;
