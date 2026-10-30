import { Fragment } from "react";

interface SplitWordsProps {
  text: string;
  // Words (exact match, punctuation included) rendered in italic brass.
  accent?: string[];
}

// Server-side word split for GSAP reveals: each word sits in an overflow-hidden mask
// so it can slide up into view. Splitting on the server means no DOM rewriting in the browser,
// and the text is complete and readable even if JavaScript never runs.
export function SplitWords({ text, accent = [] }: SplitWordsProps) {
  const words = text.split(" ");
  return (
    <>
      {/* The space goes after the mask, not inside it: trailing spaces inside an inline-block collapse. */}
      {words.map((word, index) => (
        <Fragment key={`${word}-${index}`}>
          <span className="word-mask">
            <span className={`word ${accent.includes(word) ? "italic text-brass" : ""}`}>{word}</span>
          </span>
          {index < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </>
  );
}
