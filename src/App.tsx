import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { motion } from 'motion/react';

export default function App() {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex flex-col items-center justify-center p-4 md:p-8 overflow-hidden relative">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-pink-500/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.05)_0%,transparent_70%)]" />
      </div>

      <header className="relative z-10 mb-12 text-center">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex flex-col items-center"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-1 bg-cyan-500 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
            <span className="text-xs font-mono uppercase tracking-[0.5em] text-cyan-500/80">Arcade Experience</span>
            <div className="w-12 h-1 bg-cyan-500 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter italic uppercase text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20 drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]">
            Neon Beats
          </h1>
          <p className="text-sm font-mono text-cyan-500/40 mt-2 uppercase tracking-widest">System v1.0.4 // Pulse Synchronized</p>
        </motion.div>
      </header>

      <main className="relative z-10 flex flex-col lg:flex-row items-center justify-center gap-12 w-full max-w-7xl">
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="w-full lg:w-auto order-2 lg:order-1"
        >
          <MusicPlayer />
        </motion.div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="order-1 lg:order-2"
        >
          <SnakeGame />
        </motion.div>

        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="hidden xl:flex flex-col gap-6 order-3"
        >
          <div className="p-6 bg-slate-900/40 backdrop-blur-xl rounded-3xl border border-white/5 w-64">
            <h3 className="text-xs font-mono uppercase tracking-widest text-white/40 mb-4">System Status</h3>
            <div className="space-y-4">
              <StatusItem label="CPU Core" value="Optimal" color="text-cyan-400" />
              <StatusItem label="Sync Rate" value="120Hz" color="text-cyan-400" />
              <StatusItem label="Audio Latency" value="4ms" color="text-cyan-400" />
              <StatusItem label="Neural Link" value="Active" color="text-pink-400" />
            </div>
          </div>
          
          <div className="p-6 bg-slate-900/40 backdrop-blur-xl rounded-3xl border border-white/5 w-64">
            <h3 className="text-xs font-mono uppercase tracking-widest text-white/40 mb-4">Instructions</h3>
            <p className="text-[10px] leading-relaxed text-white/30 font-mono uppercase">
              Navigate the grid using directional inputs. Consume energy nodes to expand. Avoid perimeter breach and self-collision. Audio feedback is synchronized with movement patterns.
            </p>
          </div>
        </motion.div>
      </main>

      <footer className="relative z-10 mt-16 text-[10px] font-mono text-white/20 uppercase tracking-[0.3em]">
        &copy; 2026 Neon Beats & Bites // All Systems Operational
      </footer>
    </div>
  );
}

function StatusItem({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-[10px] uppercase text-white/30">{label}</span>
      <span className={`text-[10px] font-bold uppercase ${color}`}>{value}</span>
    </div>
  );
}
