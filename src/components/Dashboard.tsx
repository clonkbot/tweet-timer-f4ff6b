import { useQuery, useMutation } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { api } from "../../convex/_generated/api";
import { Timer } from "./Timer";
import { TweetComposer } from "./TweetComposer";
import { TweetHistory } from "./TweetHistory";

export function Dashboard() {
  const { signOut } = useAuthActions();
  const stats = useQuery(api.tweets.getStats);
  const activeSession = useQuery(api.sessions.getActive);
  const startSession = useMutation(api.sessions.start);
  const stopSession = useMutation(api.sessions.stop);

  const handleStartSession = async () => {
    await startSession();
  };

  const handleStopSession = async () => {
    if (activeSession) {
      await stopSession({ id: activeSession._id });
    }
  };

  return (
    <div className="flex-1 p-4 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-10">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <svg className="w-5 h-5 md:w-6 md:h-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-white">Tweet Timer</h1>
              <p className="text-white/40 text-xs md:text-sm">Every 7 minutes 40 seconds</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Stats pills */}
            <div className="flex gap-2">
              <div className="px-3 py-1.5 md:px-4 md:py-2 bg-white/5 border border-white/10 rounded-full">
                <span className="text-amber-500 font-mono font-bold text-sm md:text-base">{stats?.todayTweets ?? 0}</span>
                <span className="text-white/40 text-xs md:text-sm ml-1.5">today</span>
              </div>
              <div className="px-3 py-1.5 md:px-4 md:py-2 bg-white/5 border border-white/10 rounded-full hidden sm:block">
                <span className="text-orange-500 font-mono font-bold text-sm md:text-base">{stats?.totalTweets ?? 0}</span>
                <span className="text-white/40 text-xs md:text-sm ml-1.5">total</span>
              </div>
            </div>

            <button
              onClick={() => signOut()}
              className="px-3 py-1.5 md:px-4 md:py-2 text-white/40 hover:text-white hover:bg-white/5 rounded-lg transition-all text-sm md:text-base"
            >
              Sign out
            </button>
          </div>
        </header>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
          {/* Left Column - Timer & Composer */}
          <div className="space-y-4 md:space-y-6">
            {/* Timer Card */}
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 rounded-3xl blur-xl opacity-50"></div>
              <div className="relative bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-8">
                <Timer
                  isActive={activeSession?.isActive ?? false}
                  sessionStart={activeSession?.startedAt}
                  currentCycle={activeSession?.currentCycle ?? 1}
                  sessionId={activeSession?._id}
                />

                <div className="mt-6 md:mt-8 flex gap-3">
                  {!activeSession?.isActive ? (
                    <button
                      onClick={handleStartSession}
                      className="flex-1 py-3 md:py-4 px-6 bg-gradient-to-r from-amber-500 to-orange-500 text-black font-semibold rounded-xl hover:from-amber-400 hover:to-orange-400 transition-all shadow-lg shadow-amber-500/20 text-sm md:text-base"
                    >
                      Start Session
                    </button>
                  ) : (
                    <button
                      onClick={handleStopSession}
                      className="flex-1 py-3 md:py-4 px-6 bg-white/5 border border-white/10 text-white/70 font-semibold rounded-xl hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400 transition-all text-sm md:text-base"
                    >
                      End Session
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Composer Card */}
            {activeSession?.isActive && (
              <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-8 animate-fade-in">
                <TweetComposer
                  currentCycle={activeSession.currentCycle}
                  sessionId={activeSession._id}
                />
              </div>
            )}
          </div>

          {/* Right Column - History */}
          <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-8">
            <h2 className="text-lg md:text-xl font-semibold mb-4 md:mb-6 flex items-center gap-3">
              <span className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <svg className="w-4 h-4 md:w-5 md:h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </span>
              Tweet History
            </h2>
            <TweetHistory />
          </div>
        </div>
      </div>
    </div>
  );
}
