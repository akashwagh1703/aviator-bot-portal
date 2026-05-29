"use client";

import { motion } from "framer-motion";

/** Three-dot typing indicator shown while the AI is thinking. */
export default function TypingIndicator({ accent = "#8b5cf6" }) {
  return (
    <div className="flex items-center gap-1.5 px-1 py-1" aria-label="Assistant is typing">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-2 w-2 rounded-full"
          style={{ background: accent }}
          animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </div>
  );
}
