import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";

import { ThesisConsole } from "@/components/home/ThesisConsole";
import { CaseFiles } from "@/components/home/CaseFiles";
import { ProofStrip } from "@/components/home/ProofStrip";
import { SignalMap } from "@/components/home/SignalMap";

export const Route = createFileRoute("/")({
  component: Home,
});

const EASE = [0.22, 1, 0.36, 1] as const;

function Home() {
  return (
    <div className="flex flex-col gap-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE, delay: 0 }}
      >
        <ThesisConsole />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}
      >
        <CaseFiles />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE, delay: 0.18 }}
      >
        <ProofStrip />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE, delay: 0.26 }}
      >
        <SignalMap />
      </motion.div>
    </div>
  );
}
