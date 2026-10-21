"use client";

import { AnimatePresence, motion } from "framer-motion";

interface SpeechBubbleProps {
  phrase: string | null;
}

/** Small white bubble that pops above the mascot and fades out. */
export function SpeechBubble({ phrase }: SpeechBubbleProps) {
  return (
    <div className="pointer-events-none flex min-h-[44px] justify-end pr-2" role="status" aria-live="polite">
      <AnimatePresence mode="wait">
        {phrase ? (
          <motion.div
            key={phrase}
            initial={{ opacity: 0, y: 8, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 320, damping: 22 }}
            className="relative max-w-[220px] rounded-2xl border border-orange-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-lg"
            style={{ transformOrigin: "85% 100%" }}
          >
            {phrase}
            <span
              aria-hidden
              className="absolute -bottom-[7px] right-8 h-3.5 w-3.5 rotate-45 border-b border-r border-orange-200 bg-white"
            />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
