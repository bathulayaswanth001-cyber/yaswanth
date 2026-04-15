import { useState, useRef, useEffect, ChangeEvent } from 'react';
import { TRACKS } from '../constants';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleProgressChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newProgress = parseFloat(e.target.value);
    if (audioRef.current) {
      const duration = audioRef.current.duration;
      audioRef.current.currentTime = (newProgress / 100) * duration;
      setProgress(newProgress);
    }
  };

  return (
    <div className="w-full max-w-md bg-slate-900/40 backdrop-blur-2xl rounded-[2rem] border border-white/10 p-6 flex flex-col gap-6 shadow-2xl relative overflow-hidden group">
      {/* Background Glow */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-cyan-500/10 blur-[80px] rounded-full group-hover:bg-cyan-500/20 transition-colors duration-700" />
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-pink-500/10 blur-[80px] rounded-full group-hover:bg-pink-500/20 transition-colors duration-700" />

      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleNext}
      />

      <div className="flex items-center gap-6">
        <div className="relative w-24 h-24 flex-shrink-0">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentTrack.id}
              initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.8, rotate: 10 }}
              src={currentTrack.cover}
              alt={currentTrack.title}
              className="w-full h-full object-cover rounded-2xl shadow-lg border border-white/10"
              referrerPolicy="no-referrer"
            />
          </AnimatePresence>
          {isPlaying && (
            <div className="absolute -bottom-2 -right-2 bg-cyan-500 p-1.5 rounded-full shadow-lg">
              <Music2 className="w-3 h-3 text-slate-950 animate-pulse" />
            </div>
          )}
        </div>

        <div className="flex flex-col overflow-hidden">
          <motion.h3 
            key={currentTrack.title}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-xl font-bold text-white truncate tracking-tight"
          >
            {currentTrack.title}
          </motion.h3>
          <motion.p 
            key={currentTrack.artist}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-sm text-white/50 font-medium uppercase tracking-widest"
          >
            {currentTrack.artist}
          </motion.p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <input
          type="range"
          min="0"
          max="100"
          step="0.1"
          value={progress}
          onChange={handleProgressChange}
          className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-cyan-500 hover:accent-cyan-400 transition-all"
        />
        <div className="flex justify-between text-[10px] font-mono text-white/30 uppercase tracking-tighter">
          <span>{audioRef.current ? formatTime(audioRef.current.currentTime) : '0:00'}</span>
          <span>{audioRef.current ? formatTime(audioRef.current.duration) : '0:00'}</span>
        </div>
      </div>

      <div className="flex items-center justify-between px-4">
        <button 
          onClick={handlePrev}
          className="p-2 text-white/40 hover:text-white transition-colors"
        >
          <SkipBack className="w-6 h-6" />
        </button>

        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="w-16 h-16 flex items-center justify-center bg-white text-slate-950 rounded-full hover:scale-105 active:scale-95 transition-all shadow-xl shadow-white/10"
        >
          {isPlaying ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
        </button>

        <button 
          onClick={handleNext}
          className="p-2 text-white/40 hover:text-white transition-colors"
        >
          <SkipForward className="w-6 h-6" />
        </button>
      </div>

      <div className="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-2xl border border-white/5">
        <Volume2 className="w-4 h-4 text-white/40" />
        <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-white/20 w-3/4" />
        </div>
      </div>
    </div>
  );
}

function formatTime(seconds: number): string {
  if (isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
