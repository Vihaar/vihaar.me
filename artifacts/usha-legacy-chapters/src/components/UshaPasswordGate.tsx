import { FormEvent, ReactNode, useEffect, useState } from "react";

const ACCESS_KEY = "usha-access-granted-v1";
const PASSWORD = "tiger21";

type UshaPasswordGateProps = {
  children: ReactNode;
};

const UshaPasswordGate = ({ children }: UshaPasswordGateProps) => {
  const [input, setInput] = useState("");
  const [isAuthed, setIsAuthed] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem(ACCESS_KEY);
    if (stored === "true") {
      setIsAuthed(true);
    }
  }, []);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (input.trim() !== PASSWORD) {
      setError("Not quite. Try again.");
      return;
    }
    localStorage.setItem(ACCESS_KEY, "true");
    setError("");
    setIsAuthed(true);
  };

  if (isAuthed) return <>{children}</>;

  return (
    <main className="min-h-screen relative overflow-hidden bg-[#2b1a12] text-paper">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(231,178,75,0.25),_transparent_45%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,153,51,0.12),transparent_40%,rgba(19,136,8,0.12))]" />
      <div className="absolute inset-0 paper-grain opacity-30" />

      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <section className="w-full max-w-lg border border-gold/40 bg-[#1d120d]/85 backdrop-blur-sm p-8 shadow-2xl">
          <div className="text-center mb-6">
            <div className="smallcaps text-gold text-[0.65rem] mb-2">Usha Legacy Access</div>
            <h1 className="font-serif text-4xl text-paper mb-2">Namaste</h1>
            <p className="text-paper/80 text-sm">
              Enter the password to continue into the TIGER 21 story.
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-3">
            <input
              type="password"
              value={input}
              onChange={(event) => {
                setInput(event.target.value);
                if (error) setError("");
              }}
              autoFocus
              placeholder="Enter password"
              className="w-full border border-gold/50 bg-black/25 px-4 py-3 text-paper placeholder:text-paper/45 focus:outline-none focus:ring-2 focus:ring-gold/60"
            />
            <button
              type="submit"
              className="w-full smallcaps border border-gold/60 bg-gold/10 px-4 py-3 text-paper hover:bg-gold/20 transition-colors"
            >
              Open /Usha
            </button>
            {error ? <p className="text-sm text-red-300 text-center">{error}</p> : null}
          </form>

          <div className="mt-6 text-center text-paper/60 text-xs">Protected route for family presentation materials</div>
        </section>
      </div>
    </main>
  );
};

export default UshaPasswordGate;
