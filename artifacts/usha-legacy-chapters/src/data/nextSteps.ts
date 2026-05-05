export type Status = "Researching" | "In diligence" | "Engaged" | "Live";
export type Step = { title: string; detail: string; status: Status };

export const steps: Step[] = [
  { title: "Alternative Investments", detail: "AIx Fund · Fusion Fund · Georgian Fund — sourced via informed-investor network", status: "In diligence" },
  { title: "Hedge Fund Diligence", detail: "AQR Delphi · Brooklyn · NewPoint (UHTC) · Radcliffe · Nuveen · Gotham", status: "In diligence" },
  { title: "Wealth Manager Search", detail: "SteelPeak · Morgan Stanley", status: "Researching" },
  { title: "New Hedge Fund Allocation", detail: "Targeted commitment", status: "Researching" },
  { title: "Life Insurance Structures", detail: "PPLI & PPUL", status: "Researching" },
  { title: "Trust & Estate", detail: "India CA + US attorney, coordinated", status: "Engaged" },
  { title: "India Operations", detail: "Wealth manager + assistant on the ground", status: "Live" },
  { title: "India Property → Startups", detail: "Selling properties, redeploying into startup capital", status: "In diligence" },
  { title: "Private Credit", detail: "18% lending opportunity — Ride River deal", status: "Engaged" },
];
