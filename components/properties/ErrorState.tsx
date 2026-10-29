"use client";

import { AlertCircle, RefreshCw } from "lucide-react";

interface ErrorStateProps {
  message?: string;
  onRetry: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="py-20 px-6 text-center max-w-xl mx-auto rounded-3xl bg-[#141d2b]/40 border border-red-500/20 my-8">
      <div className="w-16 h-16 rounded-2xl bg-[#1f1418] border border-red-500/30 flex items-center justify-center mx-auto mb-6 text-red-400">
        <AlertCircle className="w-8 h-8" />
      </div>

      <span className="text-[11px] font-mono tracking-widest text-red-400 uppercase block mb-2">
        Connection Interrupted
      </span>

      <h3 className="font-display text-2xl sm:text-3xl font-light text-[#f4eee5] mb-3">
        Unable to retrieve residences
      </h3>

      <p className="text-sm text-[#8f9ba8] font-sans font-light leading-relaxed mb-8">
        {message || "An error occurred while fetching properties from the server. Please check your connection and try again."}
      </p>

      <button
        onClick={onRetry}
        className="btn-outline-brass px-7 py-3 rounded-xl text-xs uppercase tracking-widest font-semibold inline-flex items-center gap-2 cursor-pointer hover:bg-[#c9a36a] hover:text-[#0a0f18] transition-colors"
      >
        <RefreshCw className="w-4 h-4" />
        <span>Retry Request</span>
      </button>
    </div>
  );
}
