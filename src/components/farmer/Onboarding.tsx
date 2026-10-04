import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Camera, Satellite, ShieldCheck, Check } from 'lucide-react';

interface OnboardingProps {
  onComplete: () => void;
}

const ONBOARDING_SLIDES = [
  {
    title: 'Capture Damage Early',
    description: 'Document crop damage immediately after flooding or extreme weather before floodwaters recede.',
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&auto=format&fit=crop&q=80',
    icon: Camera,
    highlight: 'Offline Geo-Tagged Evidence',
  },
  {
    title: 'Instant Satellite & AI Check',
    description: 'Our backend cross-checks your field coordinates with Sentinel-1 radar and meteorological rainfall data.',
    image: 'https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?w=600&auto=format&fit=crop&q=80',
    icon: Satellite,
    highlight: 'Tamper-Evident SHA-256 Packaging',
  },
  {
    title: 'Fast-Track Relief Payouts',
    description: 'Officers receive claim-ready dossiers to approve preliminary assessments without waiting weeks for dry soil.',
    image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=600&auto=format&fit=crop&q=80',
    icon: ShieldCheck,
    highlight: 'Official Survey Aligned',
  },
];

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (currentIndex < ONBOARDING_SLIDES.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  const slide = ONBOARDING_SLIDES[currentIndex];
  const IconComponent = slide.icon;

  return (
    <div
      id="onboarding-container"
      className="relative w-full h-full min-h-[640px] flex flex-col justify-between bg-white text-slate-900 overflow-hidden"
    >
      {/* Top Header with Skip */}
      <div className="pt-5 px-6 flex items-center justify-between z-10">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
          Step {currentIndex + 1} of {ONBOARDING_SLIDES.length}
        </span>
        <button
          id="onboarding-skip-btn"
          onClick={onComplete}
          className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors py-1 px-2"
        >
          Skip
        </button>
      </div>

      {/* Slide Content */}
      <div className="my-auto px-6 flex flex-col items-center text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.35 }}
            className="flex flex-col items-center w-full"
          >
            {/* Visual Graphic with Rounded Container */}
            <div className="relative w-64 h-64 mb-6 rounded-3xl overflow-hidden shadow-xl border-4 border-white ring-1 ring-slate-200">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-900/10 to-transparent flex items-end p-4">
                <div className="bg-emerald-500/90 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-md">
                  <IconComponent className="w-3.5 h-3.5" />
                  <span>{slide.highlight}</span>
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 mb-3">
              {slide.title}
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed max-w-xs mb-4">
              {slide.description}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Indicator Dots */}
        <div className="flex items-center gap-2 mt-2">
          {ONBOARDING_SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === currentIndex
                  ? 'w-6 bg-emerald-600'
                  : 'w-2 bg-slate-200 hover:bg-slate-300'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="p-6 pt-2">
        <button
          id="onboarding-next-btn"
          onClick={handleNext}
          className="w-full py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
        >
          {currentIndex === ONBOARDING_SLIDES.length - 1 ? (
            <>
              <span>Get Started</span>
              <Check className="w-4 h-4" />
            </>
          ) : (
            <>
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
