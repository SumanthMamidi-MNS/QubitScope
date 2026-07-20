import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronLeft, HelpCircle, Rotate3d, Play, Sparkles, AlertCircle } from 'lucide-react';
import { Button } from './Button';

interface Step {
  title: string;
  description: string;
  highlightTarget?: string; // Optional indicator of what is being explained
  icon: React.ReactNode;
}

interface OnboardingGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OnboardingGuide: React.FC<OnboardingGuideProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps: Step[] = [
    {
      title: 'Welcome to QubitScope! ⚛️',
      description: 'Welcome to your interactive quantum laboratory. QubitScope simulates single-qubit quantum mechanics. This guide will walk you through the workspace elements to build your quantum intuition.',
      icon: <Sparkles className="w-8 h-8 text-cyan-400" />
    },
    {
      title: 'The 3D Bloch Sphere 🌐',
      description: 'The core visualization representing your qubit\'s state. Click and drag the sphere to rotate it in 3D, and scroll to zoom. The orange vector points to the qubit\'s exact coordinates on the unit sphere surface. North pole is |0⟩, South pole is |1⟩, and the equator represents superposition.',
      icon: <Rotate3d className="w-8 h-8 text-indigo-400" />
    },
    {
      title: 'The Quantum Control Unit 🎛️',
      description: 'Here you apply gates to transform the qubit. Standard gates (like X, H, Z) trigger instant rotations on the sphere. Switch to "Rotations" tab to slide continuous parameters ($Rx, Ry, Rz$) to drag the vector up, down, or around the sphere.',
      icon: <Play className="w-8 h-8 text-blue-400" />
    },
    {
      title: 'State amplitudes & Dirac Notation 🧮',
      description: 'Displays the mathematical equation of the qubit state: |ψ⟩ = α|0⟩ + β|1⟩. Watch the complex values, magnitude, and relative phase angles adjust dynamically. Toggle Advanced Mode in the navbar to inspect complete complex variables.',
      icon: <HelpCircle className="w-8 h-8 text-rose-400" />
    },
    {
      title: 'Measurement & Probabilities 📊',
      description: 'Shows Born\'s probability rule: P(0) = |α|² and P(1) = |β|². Since quantum states are superpositions, pressing "Measure Qubit" collapses the qubit, forcing it to randomly snap to either |0⟩ or |1⟩ based on these likelihoods.',
      icon: <AlertCircle className="w-8 h-8 text-emerald-400" />
    },
    {
      title: 'Timeline & Resets 🕐',
      description: 'The horizontal execution log tracks every gate you apply in sequence. If you want to start a new experiment, press "Reset State" to revert back to ground state |0⟩ and wipe the history. Now, launch your experiments!',
      icon: <Sparkles className="w-8 h-8 text-amber-400" />
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onClose();
      setCurrentStep(0);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
        
        {/* Modal container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg glass-panel border border-cyan-500/20 glow-cyan p-6 md:p-8 bg-slate-950/90 text-left space-y-6"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/5 cursor-pointer transition-colors"
          >
            <X size={18} />
          </button>

          {/* Step header */}
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-slate-900 border border-white/5 shadow-md">
              {steps[currentStep].icon}
            </div>
            <div>
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block mb-0.5">
                Guide Step {currentStep + 1} of {steps.length}
              </span>
              <h2 className="text-xl font-extrabold font-heading text-slate-100 leading-tight">
                {steps[currentStep].title}
              </h2>
            </div>
          </div>

          {/* Step content */}
          <div className="text-sm text-slate-300 leading-relaxed font-sans min-h-[90px]">
            {steps[currentStep].description}
          </div>

          {/* Step progress dots */}
          <div className="flex items-center justify-between pt-4 border-t border-white/5">
            <div className="flex gap-1">
              {steps.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === currentStep ? 'w-6 bg-cyan-400' : 'w-2 bg-slate-800'
                  }`}
                />
              ))}
            </div>

            {/* Stepper buttons */}
            <div className="flex items-center gap-2">
              {currentStep > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBack}
                  className="flex items-center gap-1 text-xs"
                >
                  <ChevronLeft size={14} />
                  Back
                </Button>
              )}

              {currentStep < steps.length - 1 ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onClose}
                  className="text-xs text-slate-400 hover:text-slate-200"
                >
                  Skip
                </Button>
              ) : null}

              <Button
                variant={currentStep === steps.length - 1 ? 'glow' : 'primary'}
                size="sm"
                onClick={handleNext}
                className="flex items-center gap-1 text-xs font-bold text-slate-950"
              >
                {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
                {currentStep < steps.length - 1 && <ChevronRight size={14} />}
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
export default OnboardingGuide;
