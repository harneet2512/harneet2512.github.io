import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

const BOOT_LINES = [
  "initializing workspace",
  "loading project context",
  "indexing proof artifacts",
  "preparing command layer",
  "portfolio ready",
];

const SESSION_KEY = "harneet-boot-seen";

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(m.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    m.addEventListener("change", handler);
    return () => m.removeEventListener("change", handler);
  }, []);
  return reduced;
}

export function BootSequence({ onDone }: { onDone: () => void }) {
  const reduced = usePrefersReducedMotion();
  const returning = useMemo(() => {
    if (typeof window === "undefined") return false;
    return sessionStorage.getItem(SESSION_KEY) === "1";
  }, []);

  const lineInterval = reduced ? 0 : returning ? 90 : 280;
  const wordmarkDelay = reduced ? 0 : returning ? 150 : 650;
  const dockDelay = reduced ? 0 : returning ? 250 : 600;

  const [step, setStep] = useState(0);
  const [docking, setDocking] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    if (reduced) {
      finish();
      return;
    }
    const timers: ReturnType<typeof setTimeout>[] = [];
    const start = wordmarkDelay;
    BOOT_LINES.forEach((_, i) => {
      timers.push(
        setTimeout(
          () => setStep(i + 1),
          start + i * lineInterval + (returning ? 0 : 350),
        ),
      );
    });
    const after = start + BOOT_LINES.length * lineInterval + (returning ? 100 : 500);
    timers.push(setTimeout(() => setDocking(true), after));
    timers.push(setTimeout(finish, after + dockDelay + 250));
    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function finish() {
    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {}
    setGone(true);
    setTimeout(onDone, 280);
  }

  // HARNEET wordmark — letters assemble from fragments
  const letters = "HARNEET".split("");

  return (
    <AnimatePresence>
      {!gone && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background/95 backdrop-blur-md"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
        >
          {/* Skip intro */}
          <button
            type="button"
            onClick={finish}
            className="absolute right-6 top-6 font-mono text-[11px] uppercase tracking-[0.14em] text-subtle hover:text-foreground transition-colors"
          >
            Skip intro →
          </button>

          {/* Center stack */}
          <motion.div
            className="flex flex-col items-center px-6"
            animate={docking ? { opacity: 0, y: 40 } : { opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* HARNEET wordmark */}
            <div
              className="flex items-baseline"
              style={{ letterSpacing: "0.04em" }}
            >
              {letters.map((ch, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 12, clipPath: "inset(0 0 100% 0)" }}
                  animate={{ opacity: 1, y: 0, clipPath: "inset(0 0 0% 0)" }}
                  transition={{
                    delay: returning ? 0.05 * i : 0.08 * i,
                    duration: returning ? 0.25 : 0.55,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="font-sans text-foreground"
                  style={{
                    fontWeight: 800,
                    fontSize: "clamp(56px, 9vw, 112px)",
                    lineHeight: 1,
                  }}
                >
                  {ch}
                </motion.span>
              ))}
            </div>

            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: wordmarkDelay / 1000, duration: 0.4 }}
              className="mt-5 text-[17px] text-muted-foreground"
            >
              Harneet Bali · <span className="text-foreground/80">AI Engineer + Product Builder</span>
            </motion.p>

            {/* Boot console */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={
                docking
                  ? { opacity: 0, y: 120, scale: 0.88 }
                  : { opacity: 1, y: 0, scale: 1 }
              }
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="mt-10 w-[min(440px,90vw)] rounded-md border bg-surface-raised/80 p-4 font-mono text-[12.5px] leading-[1.7]"
            >
              {BOOT_LINES.map((line, i) => (
                <div
                  key={line}
                  className={
                    i < step
                      ? "text-foreground/85"
                      : "text-foreground/0"
                  }
                  style={{ transition: "color 180ms ease-out" }}
                >
                  <span className="mr-2 text-sage/80">{">"}</span>
                  {line}
                  {i === step - 1 && (
                    <span className="ml-1 inline-block h-[10px] w-[6px] translate-y-[1px] bg-sage/80 align-middle" />
                  )}
                </div>
              ))}
            </motion.div>
          </motion.div>

        </motion.div>
      )}
    </AnimatePresence>
  );
}
