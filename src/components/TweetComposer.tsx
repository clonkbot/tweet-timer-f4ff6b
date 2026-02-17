import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

interface TweetComposerProps {
  currentCycle: number;
  sessionId: Id<"sessions">;
}

export function TweetComposer({ currentCycle }: TweetComposerProps) {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const createTweet = useMutation(api.tweets.create);

  const charCount = content.length;
  const maxChars = 280;
  const isOverLimit = charCount > maxChars;
  const charPercentage = Math.min((charCount / maxChars) * 100, 100);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || isOverLimit || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await createTweet({ content: content.trim(), cycleNumber: currentCycle });
      setContent("");
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (err) {
      console.error("Failed to save tweet:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3 md:mb-4">
        <h3 className="text-base md:text-lg font-semibold text-white">Compose Tweet</h3>
        <span className="text-xs md:text-sm text-white/30">Cycle #{currentCycle}</span>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="relative">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's happening? Write your tweet..."
            className="w-full h-28 md:h-32 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-amber-500/50 focus:bg-white/[0.07] transition-all resize-none text-base"
          />

          {/* Character count indicator */}
          <div className="absolute bottom-3 right-3 flex items-center gap-3">
            {/* Circular progress */}
            <div className="relative w-6 h-6 md:w-7 md:h-7">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 24 24">
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  fill="none"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="2"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  fill="none"
                  stroke={isOverLimit ? "#ef4444" : charPercentage > 90 ? "#f59e0b" : "#22c55e"}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 10}`}
                  strokeDashoffset={`${2 * Math.PI * 10 * (1 - charPercentage / 100)}`}
                  className="transition-all"
                />
              </svg>
            </div>
            <span className={`font-mono text-xs md:text-sm ${isOverLimit ? "text-red-400" : charPercentage > 90 ? "text-amber-400" : "text-white/40"}`}>
              {maxChars - charCount}
            </span>
          </div>
        </div>

        <div className="mt-3 md:mt-4 flex items-center justify-between">
          {/* Tweet tips */}
          <div className="text-white/20 text-xs hidden sm:block">
            Pro tip: Be authentic and engaging
          </div>

          <button
            type="submit"
            disabled={!content.trim() || isOverLimit || isSubmitting}
            className={`px-4 md:px-6 py-2 md:py-2.5 rounded-xl font-semibold text-sm md:text-base transition-all ${
              showSuccess
                ? "bg-green-500 text-white"
                : "bg-gradient-to-r from-amber-500 to-orange-500 text-black hover:from-amber-400 hover:to-orange-400 shadow-lg shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
            }`}
          >
            {showSuccess ? (
              <span className="inline-flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Saved!
              </span>
            ) : isSubmitting ? (
              <span className="inline-flex items-center gap-2">
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                Saving...
              </span>
            ) : (
              "Save Tweet"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
