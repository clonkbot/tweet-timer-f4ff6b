import { useConvexAuth } from "convex/react";
import { AuthScreen } from "./components/AuthScreen";
import { Dashboard } from "./components/Dashboard";

export default function App() {
  const { isAuthenticated, isLoading } = useConvexAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 md:w-20 md:h-20 border-4 border-amber-500/20 rounded-full animate-spin border-t-amber-500"></div>
          <div className="absolute inset-0 w-16 h-16 md:w-20 md:h-20 border-4 border-transparent rounded-full animate-ping border-t-amber-400/30"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white overflow-x-hidden">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-amber-500/5 rounded-full blur-[100px] md:blur-[150px] animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-[250px] h-[250px] md:w-[500px] md:h-[500px] bg-orange-600/5 rounded-full blur-[100px] md:blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] md:w-[800px] md:h-[800px] bg-yellow-500/3 rounded-full blur-[150px] md:blur-[200px]"></div>
      </div>

      {/* Grid overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}
      ></div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {isAuthenticated ? <Dashboard /> : <AuthScreen />}

        {/* Footer */}
        <footer className="mt-auto py-4 md:py-6 text-center">
          <p className="text-[10px] md:text-xs text-white/20 tracking-wider font-light">
            Requested by <span className="text-amber-500/40">@stringer_kade</span> · Built by <span className="text-amber-500/40">@clonkbot</span>
          </p>
        </footer>
      </div>
    </div>
  );
}
