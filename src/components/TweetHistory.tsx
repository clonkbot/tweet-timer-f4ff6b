import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

export function TweetHistory() {
  const tweets = useQuery(api.tweets.list);
  const removeTweet = useMutation(api.tweets.remove);

  const handleCopy = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleDelete = async (id: Id<"tweets">) => {
    if (confirm("Delete this tweet?")) {
      await removeTweet({ id });
    }
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    if (diff < 60000) return "Just now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  if (tweets === undefined) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-amber-500/20 rounded-full animate-spin border-t-amber-500"></div>
      </div>
    );
  }

  if (tweets.length === 0) {
    return (
      <div className="text-center py-8 md:py-12">
        <div className="w-14 h-14 md:w-16 md:h-16 mx-auto mb-4 rounded-2xl bg-white/5 flex items-center justify-center">
          <svg className="w-7 h-7 md:w-8 md:h-8 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
          </svg>
        </div>
        <p className="text-white/40 text-sm md:text-base">No tweets yet</p>
        <p className="text-white/20 text-xs md:text-sm mt-1">Start a session and write your first tweet!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 max-h-[300px] md:max-h-[400px] lg:max-h-[500px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
      {tweets.map((tweet: { _id: Id<"tweets">; content: string; cycleNumber: number; createdAt: number }, index: number) => (
        <div
          key={tweet._id}
          className="group relative p-3 md:p-4 bg-white/[0.02] border border-white/5 rounded-xl hover:bg-white/[0.04] hover:border-white/10 transition-all animate-slide-in"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          {/* Cycle badge */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] md:text-xs font-medium px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500">
              Cycle #{tweet.cycleNumber}
            </span>
            <span className="text-[10px] md:text-xs text-white/30">{formatTime(tweet.createdAt)}</span>
          </div>

          {/* Tweet content */}
          <p className="text-white/80 text-sm md:text-base leading-relaxed whitespace-pre-wrap break-words">
            {tweet.content}
          </p>

          {/* Actions */}
          <div className="flex items-center gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => handleCopy(tweet.content)}
              className="flex items-center gap-1.5 px-2 py-1 text-white/40 hover:text-amber-500 hover:bg-amber-500/10 rounded-lg transition-all text-xs md:text-sm"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy
            </button>
            <button
              onClick={() => handleDelete(tweet._id)}
              className="flex items-center gap-1.5 px-2 py-1 text-white/40 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all text-xs md:text-sm"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
