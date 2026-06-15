import { getQuoteOfTheDay } from "../lib/quotes";

/**
 * Displays the Quote of the Day above the main heading.
 * Deterministic — same quote all day, changes at midnight.
 */
export default function QuoteOfDay() {
  const quote = getQuoteOfTheDay();

  return (
    <div className="text-center py-4 px-4 md:px-8 mb-2">
      <blockquote className="relative max-w-2xl mx-auto">
        {/* Decorative quote mark */}
        <span className="absolute -top-3 -left-2 text-4xl text-green-500/15 font-serif select-none">
          &ldquo;
        </span>
        <p className="text-sm md:text-base text-slate-400 italic leading-relaxed font-light">
          {quote.text}
        </p>
        <footer className="mt-2 text-xs font-mono text-slate-600 tracking-wider">
          — {quote.author}
        </footer>
      </blockquote>
    </div>
  );
}
