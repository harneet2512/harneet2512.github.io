import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

const BOOT_LINES = [
  "initializing workbench",
  "pinning project context",
  "indexing proof artifacts",
  "preparing paper windows",
  "workbench ready",
];

const ASCII_WORDMARK = String.raw`
██╗  ██╗ █████╗ ██████╗ ███╗   ██╗███████╗███████╗████████╗
██║  ██║██╔══██╗██╔══██╗████╗  ██║██╔════╝██╔════╝╚══██╔══╝
███████║███████║██████╔╝██╔██╗ ██║█████╗  █████╗     ██║
██╔══██║██╔══██║██╔══██╗██║╚██╗██║██╔══╝  ██╔══╝     ██║
██║  ██║██║  ██║██║  ██║██║ ╚████║███████╗███████╗   ██║
╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝╚══════╝╚══════╝   ╚═╝
`.trim();

const SESSION_KEY = "harneet-boot-seen";

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(media.matches);
    const handler = (event: MediaQueryListEvent) => setReduced(event.matches);
    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, []);

  return reduced;
}

export function BootSequence({ onDone }: { onDone: () => void }) {
  const reduced = usePrefersReducedMotion();
  const returning = useMemo(() => {
    if (typeof window === "undefined") return false;
    return sessionStorage.getItem(SESSION_KEY) === "1";
  }, []);

  const lineInterval = reduced ? 0 : returning ? 80 : 370;
  const wordmarkDelay = reduced ? 0 : returning ? 120 : 600;
  const dockDelay = reduced ? 0 : returning ? 200 : 550;

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
    BOOT_LINES.forEach((_, index) => {
      timers.push(
        setTimeout(() => setStep(index + 1), start + index * lineInterval + (returning ? 0 : 150)),
      );
    });

    const after = start + BOOT_LINES.length * lineInterval + (returning ? 80 : 250);
    timers.push(setTimeout(() => setDocking(true), after));
    timers.push(setTimeout(finish, after + dockDelay + 250));

    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function finish() {
    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      // Session storage can be unavailable in hardened browser contexts.
    }
    setGone(true);
    setTimeout(onDone, 280);
  }

  return (
    <AnimatePresence>
      {!gone && (
        <motion.div
          className="boot-felt fixed inset-0 z-[100] flex items-center justify-center"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
        >
          <button type="button" onClick={finish} className="boot-skip">
            Skip intro -&gt;
          </button>

          <motion.div
            className="boot-stack"
            animate={docking ? { opacity: 0, y: 40 } : { opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              className="boot-wordmark-paper"
              initial={{ opacity: 0, y: 14, rotate: -2.2, clipPath: "inset(0 100% 0 0)" }}
              animate={{ opacity: 1, y: 0, rotate: -1.2, clipPath: "inset(0 0% 0 0)" }}
              transition={{
                delay: returning ? 0.05 : 0.18,
                duration: returning ? 0.35 : 0.85,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <pre aria-label="HARNEET">{ASCII_WORDMARK}</pre>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: wordmarkDelay / 1000, duration: 0.4 }}
              className="boot-subtitle"
            >
              Harneet Bali <span>AI Engineer + Product Builder</span>
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={
                docking ? { opacity: 0, y: 120, scale: 0.88 } : { opacity: 1, y: 0, scale: 1 }
              }
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="boot-console"
            >
              {BOOT_LINES.map((line, index) => (
                <div
                  key={line}
                  className={index < step ? "visible" : ""}
                  style={{ transition: "opacity 180ms ease-out" }}
                >
                  <span>{">"}</span>
                  {line}
                  {index === step - 1 && <i />}
                </div>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
