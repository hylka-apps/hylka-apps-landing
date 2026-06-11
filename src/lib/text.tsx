import { Fragment } from "react";

// Platform names whose internal casing must survive an uppercased label.
// CSS `text-transform: uppercase` would otherwise render "iOS" as "IOS".
// Longer names first so the alternation matches them before shorter ones.
const PROTECTED = /(iPadOS|visionOS|watchOS|macOS|tvOS|iOS)/g;

// Splits a label so protected tokens render in their authored case while the
// surrounding text still picks up the label's uppercase transform.
// Safe on any string — text without a protected token comes back unchanged.
export function preserveCase(text: string) {
  return text.split(PROTECTED).map((part, i) =>
    i % 2 === 1 ? (
      <span key={i} className="keep-case">
        {part}
      </span>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    )
  );
}
