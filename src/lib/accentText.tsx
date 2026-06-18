import React from "react";

/**
 * Render a headline where any part wrapped in *asterisks* becomes an italic
 * serif accent. Lets an editor accent ANY word(s) — not just a fixed last
 * word — from a single plain string field.
 *
 *   "Small apps, made with *care*."  →  care. rendered in serif
 */
export function renderAccent(
  text: string,
  serifClass = "serif"
): React.ReactNode {
  if (!text) return null;
  // Split on *...*; capture groups land on odd indices.
  const parts = text.split(/\*([^*]+)\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <span key={i} className={serifClass}>
        {part}
      </span>
    ) : (
      <React.Fragment key={i}>{part}</React.Fragment>
    )
  );
}
