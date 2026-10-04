import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { Droplets, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      // Allow automatic smooth progression or manual click
    }, 4000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      id="splash-screen-container"
      className="relative w-full h-full min-h-[640px] flex flex-col justify-between overflow-hidden bg-gradient-to-b from-slate-900 via-emerald-950 to-slate-950 text-white select-none"
    >
      {/* Background Graphic & Atmosphere */}
      <div className="absolute inset-0 z-0 opacity-25 mix-blend-overlay">
        <img
          src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=900&auto=format&fit=crop&q=80"
          alt="Agriculture Field"
          className="w-full h-full object-cover scale-105 filter blur-[1px]"
        />
      </div>
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />

      {/* Top Tagline */}
      <div className="relative z-10 pt-8 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-[11px] font-semibold text-emerald-300 uppercase tracking-wider"
        >
          <Sparkles className="w-3 h-3 text-emerald-400" />
          <span>Farmers Today • Stronger Tomorrow</span>
        </motion.div>
      </div>

      {/* Center Brand Identity with smooth animations */}
      <div className="relative z-10 flex flex-col items-center justify-center px-6 text-center my-auto">
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, type: 'spring', bounce: 0.4 }}
          className="relative mb-6"
        >
          {/* Animated Glow Rings */}
          <div className="absolute inset-0 rounded-full bg-emerald-500/30 blur-xl animate-pulse" />
          <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-emerald-400 p-[2px] shadow-2xl shadow-emerald-500/40">
            <div className="w-full h-full bg-slate-900 rounded-[22px] flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/10 to-transparent" />
              <Droplets className="w-12 h-12 text-emerald-400 drop-shadow-md" />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 border border-emerald-400/20 rounded-full scale-125"
              />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">
            FloodCrop <span className="text-emerald-400">Snap</span>
          </h1>
          <p className="text-sm font-medium text-emerald-100/90 max-w-xs mx-auto leading-relaxed">
            Capture Early. Verify Faster. Recover Sooner.
          </p>
        </motion.div>

        {/* Farmer Portrait Avatar Highlight */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-8 flex items-center gap-3 bg-slate-800/80 backdrop-blur-md border border-slate-700/80 px-4 py-2 rounded-2xl shadow-lg"
        >
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-emerald-400">
            <img
              src="https://images.unsplash.com/photo-1544717305-2782549b5136?w=120&auto=format&fit=crop&q=80"
              alt="Farmer Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="text-left">
            <p className="text-xs font-semibold text-white">Ramesh Kumar</p>
            <p className="text-[10px] text-emerald-400">Sitapur • Registered Kisan ID</p>
          </div>
        </motion.div>
      </div>

      {/* Bottom Action Section */}
      <div className="relative z-10 pb-8 px-6 space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="text-center"
        >
          <p className="text-[11px] text-slate-400 mb-3 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>PMFBY & State Disaster Survey Aligned</span>
          </p>

          <button
            id="splash-start-btn"
            onClick={onComplete}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-sm shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
          >
            <span>Building a resilient tomorrow...</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    </div>
  );
};
