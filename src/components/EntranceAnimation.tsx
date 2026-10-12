import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Film, Sparkles, Play, Zap } from 'lucide-react';

interface EntranceAnimationProps {
  onComplete: () => void;
}

export const EntranceAnimation: React.FC<EntranceAnimationProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    // Step progression sequence:
    // 0s: Prismatic beam ignites
    // 0.8s: Film reel & logo assemble
    // 2.0s: Equalizer frequency wave & glow flare
    // 3.2s: Iris shutter curtain opens to reveal website
    const timer1 = setTimeout(() => setStep(1), 700);
    const timer2 = setTimeout(() => setStep(2), 1700);
    const timer3 = setTimeout(() => {
      setStep(3);
      setTimeout(onComplete, 800);
    }, 3200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        key="entrance-overlay"
        initial={{ opacity: 1 }}
        animate={{ opacity: step === 3 ? 0 : 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-[#050608] overflow-hidden select-none"
      >
        {/* Dynamic Colorful Projector Beams & Aurora Glows */}
        <motion.div
          animate={{
            scale: [1, 1.35, 1.1],
            rotate: [0, 90, 180],
            opacity: [0.4, 0.75, 0.5],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-[20%] -left-[10%] w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-amber-500/30 via-rose-500/25 to-violet-600/30 blur-[120px] pointer-events-none"
        />

        <motion.div
          animate={{
            scale: [1.2, 1, 1.4],
            rotate: [180, 270, 360],
            opacity: [0.35, 0.65, 0.4],
          }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -bottom-[20%] -right-[10%] w-[650px] h-[650px] rounded-full bg-gradient-to-br from-cyan-500/30 via-blue-600/25 to-amber-400/25 blur-[130px] pointer-events-none"
        />

        {/* Central Prismatic Flare */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: [0, 1.5, 1], opacity: [0, 0.9, 0.6] }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="absolute h-[2px] w-[80vw] max-w-4xl bg-gradient-to-r from-transparent via-amber-300 via-rose-400 via-cyan-400 to-transparent blur-[1px] pointer-events-none"
        />

        {/* Floating cinematic particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(24)].map((_, i) => (
            <motion.div
              key={i}
              initial={{
                x: Math.random() * 1000 - 500,
                y: Math.random() * 600 - 300,
                opacity: 0,
                scale: 0.5,
              }}
              animate={{
                y: [Math.random() * 600 - 300, Math.random() * 600 - 450],
                opacity: [0, 0.8, 0],
                scale: [0.5, 1.2, 0.5],
              }}
              transition={{
                duration: 2.5 + Math.random() * 1.5,
                repeat: Infinity,
                delay: Math.random() * 1.5,
              }}
              className="absolute left-1/2 top-1/2 w-1.5 h-1.5 rounded-full"
              style={{
                backgroundColor: ['#F59E0B', '#06B6D4', '#EC4899', '#8B5CF6', '#10B981'][i % 5],
                boxShadow: `0 0 10px ${['#F59E0B', '#06B6D4', '#EC4899', '#8B5CF6', '#10B981'][i % 5]}`,
              }}
            />
          ))}
        </div>

        {/* Main Brand Assembly Core */}
        <div className="relative z-10 text-center px-6 max-w-lg mx-auto flex flex-col items-center">
          
          {/* Animated Film Reel & Aperture Emblem */}
          <motion.div
            initial={{ scale: 0, rotate: -180, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{ type: 'spring', damping: 14, stiffness: 100, delay: 0.2 }}
            className="relative mb-6"
          >
            {/* Pulsing Colorful Halo */}
            <motion.div
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.5, 0.9, 0.5],
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-amber-400 via-rose-500 to-cyan-400 blur-xl opacity-60"
            />

            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-[#0B0E17] border-2 border-amber-400/80 flex items-center justify-center shadow-2xl overflow-hidden group">
              {/* Spinning Reel Spokes */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 flex items-center justify-center text-amber-500/20"
              >
                <div className="w-16 h-16 border-2 border-dashed border-amber-400/40 rounded-full" />
              </motion.div>

              <Film className="w-10 h-10 sm:w-12 sm:h-12 text-amber-400 drop-shadow-[0_0_12px_rgba(245,158,11,0.6)]" />

              {/* Sparkle corner */}
              <Sparkles className="absolute top-2 right-2 w-4 h-4 text-cyan-400 animate-pulse" />
            </div>
          </motion.div>

          {/* Staggered Brand Typography */}
          <div className="space-y-3 overflow-hidden">
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <h1 className="text-5xl sm:text-7xl font-display font-extrabold tracking-tight">
                <span className="text-white drop-shadow-lg">Cine</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-rose-400 to-cyan-400 animate-pulse">
                  Vibe
                </span>
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="text-xs sm:text-sm font-mono tracking-widest uppercase text-slate-300 flex items-center justify-center gap-2"
            >
              <span className="w-6 h-[1px] bg-gradient-to-r from-transparent to-amber-400" />
              <span>Movie & TV Discovery Lounge</span>
              <span className="w-6 h-[1px] bg-gradient-to-l from-transparent to-cyan-400" />
            </motion.p>
          </div>

          {/* Animated Frequency Equalizer Bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="flex items-center gap-1.5 h-6 my-6"
          >
            {[40, 80, 60, 100, 70, 90, 50, 95, 65, 85, 45].map((height, idx) => (
              <motion.span
                key={idx}
                animate={{
                  scaleY: [0.3, 1, 0.4, 0.8, 0.3],
                }}
                transition={{
                  duration: 0.9 + (idx % 3) * 0.2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: idx * 0.08,
                }}
                className="w-1 rounded-full origin-bottom"
                style={{
                  height: `${height}%`,
                  background: `linear-gradient(to top, #F59E0B, ${['#EC4899', '#06B6D4', '#8B5CF6'][idx % 3]})`,
                }}
              />
            ))}
          </motion.div>

          {/* Calibrating status text / Enter button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
            className="flex items-center gap-3"
          >
            <button
              onClick={onComplete}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-400 via-rose-500 to-cyan-500 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg hover:shadow-amber-500/30 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Enter Lounge</span>
            </button>
          </motion.div>

        </div>

        {/* Projector Countdown Frame Ribbon */}
        <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-[11px] font-mono text-slate-500 border-t border-white/5 pt-3">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span>PROJECTOR INITIALIZED</span>
          </span>
          <button
            onClick={onComplete}
            className="hover:text-slate-300 transition-colors cursor-pointer"
          >
            Skip Intro →
          </button>
        </div>

      </motion.div>
    </AnimatePresence>
  );
};
