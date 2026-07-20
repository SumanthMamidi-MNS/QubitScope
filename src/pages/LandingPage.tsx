import React from 'react';
import { motion } from 'framer-motion';
import { Play, BookOpen, Cpu, Orbit, Layers, TrendingUp } from 'lucide-react';
import { FaGithub } from 'react-icons/fa6';
import { BlochSphere } from '../components/bloch/BlochSphere';
import { Button } from '../components/ui/Button';

interface LandingPageProps {
  onNavigate: (page: 'home' | 'simulator' | 'learn' | 'about') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  // Preset static statevector for the landing page rotating sphere
  const landingBlochVector = { x: 0.6, y: 0.5, z: 0.62 };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  } as const;

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' as const },
    },
  } as const;

  return (
    <div className="space-y-20 py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* =============================================================================
          HERO SECTION
          ============================================================================= */}
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center min-h-[70vh]"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Left side text column */}
        <div className="lg:col-span-7 space-y-6 text-left">
          <motion.div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-400 text-xs font-semibold select-none" variants={itemVariants}>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping"></span>
            <span>Interactive Simulator v1.0.0</span>
          </motion.div>

          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight font-heading leading-tight"
            variants={itemVariants}
          >
            Explore Quantum States on the{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-400 bg-clip-text text-transparent glow-cyan-sm">
              Bloch Sphere
            </span>
          </motion.h1>

          <motion.p
            className="text-slate-400 text-base sm:text-lg max-w-xl leading-relaxed"
            variants={itemVariants}
          >
            QubitScope is an interactive single-qubit simulator designed to teach quantum state evolution, superposition, and measurement mechanics through gorgeous 3D visualization.
          </motion.p>

          <motion.div className="flex flex-wrap gap-4 pt-2" variants={itemVariants}>
            <Button
              variant="glow"
              size="lg"
              onClick={() => onNavigate('simulator')}
              className="flex items-center gap-2 text-slate-950 font-bold group"
            >
              <Play size={16} className="group-hover:translate-x-0.5 transition-transform" />
              Launch Simulator
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              onClick={() => onNavigate('learn')}
              className="flex items-center gap-2 group"
            >
              <BookOpen size={16} className="text-slate-400 group-hover:text-white transition-colors" />
              Learn Quantum
            </Button>

            <a
              href="https://github.com/SumanthMamidi-MNS/QubitScope"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center p-3 rounded-lg border border-slate-800 bg-slate-950/20 text-slate-400 hover:text-white hover:border-slate-700 transition-all shadow-md"
            >
              <FaGithub size={20} />
            </a>
          </motion.div>
        </div>

        {/* Right side Bloch sphere rendering */}
        <motion.div className="lg:col-span-5 w-full relative" variants={itemVariants}>
          <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/10 to-indigo-500/10 rounded-2xl filter blur-3xl opacity-50 animate-pulse" />
          <div className="relative">
            <BlochSphere blochVector={landingBlochVector} />
            {/* Overlay badge */}
            <div className="absolute top-4 right-4 px-3 py-1.5 rounded-lg bg-slate-950/80 border border-white/5 text-[10px] text-slate-300 backdrop-blur font-mono shadow-lg pointer-events-none select-none">
              |ψ⟩ = cos(θ/2)|0⟩ + e^(iφ)sin(θ/2)|1⟩
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* =============================================================================
          CORE FEATURES SECTION
          ============================================================================= */}
      <div className="space-y-10 border-t border-white/5 pt-20">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <h2 className="text-3xl font-bold font-heading">High-Fidelity Simulation Features</h2>
          <p className="text-slate-400 text-sm">
            Engineered with visual precision to bridge the gap between quantum mathematics and intuitive physical models.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 */}
          <div className="glass-panel p-6 glass-panel-hover flex flex-col items-start gap-4">
            <div className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <Orbit size={20} />
            </div>
            <h3 className="text-base font-bold text-slate-100 font-heading">Interactive 3D Sphere</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Rotate, zoom, and inspect the Bloch sphere representation. Click-to-drag camera controls render smoothly at 60 FPS in WebGL.
            </p>
          </div>

          {/* Card 2 */}
          <div className="glass-panel p-6 glass-panel-hover flex flex-col items-start gap-4">
            <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <Cpu size={20} />
            </div>
            <h3 className="text-base font-bold text-slate-100 font-heading">Unitary Transform Gates</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Apply Pauli-X, Y, Z, Hadamard, Phase shift, or parameterize arbitrary rotation angles ($R_x, R_y, R_z$) using linear sliders.
            </p>
          </div>

          {/* Card 3 */}
          <div className="glass-panel p-6 glass-panel-hover flex flex-col items-start gap-4">
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400">
              <Layers size={20} />
            </div>
            <h3 className="text-base font-bold text-slate-100 font-heading">State Evolution Physics</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Observe vector traces moving along geodesics when operators evolve states, preventing sudden "teleportation" jumps.
            </p>
          </div>

          {/* Card 4 */}
          <div className="glass-panel p-6 glass-panel-hover flex flex-col items-start gap-4">
            <div className="p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <TrendingUp size={20} />
            </div>
            <h3 className="text-base font-bold text-slate-100 font-heading">Accurate Probabilities</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Real-time calculations of collapse likelihoods. Simulate measurement clicks to collapse the superposition state vector instantly.
            </p>
          </div>
        </div>
      </div>

      {/* =============================================================================
          TECH STACK SECTION
          ============================================================================= */}
      <div className="border-t border-white/5 pt-20 pb-10 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-2xl font-bold font-heading">Engineered with Modern Tech Stack</h2>
          <p className="text-slate-400 text-xs font-mono">
            Optimized, modular, client-side execution framework
          </p>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-6 max-w-4xl mx-auto">
          {/* React */}
          <div className="px-4 py-2 rounded-xl bg-slate-900/40 border border-white/5 flex items-center gap-2 select-none shadow-sm hover:border-sky-500/20 transition-colors">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400"></span>
            <span className="text-xs font-mono text-slate-300 font-bold">React 19</span>
          </div>

          {/* TypeScript */}
          <div className="px-4 py-2 rounded-xl bg-slate-900/40 border border-white/5 flex items-center gap-2 select-none shadow-sm hover:border-blue-500/20 transition-colors">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
            <span className="text-xs font-mono text-slate-300 font-bold">TypeScript 5</span>
          </div>

          {/* Three.js */}
          <div className="px-4 py-2 rounded-xl bg-slate-900/40 border border-white/5 flex items-center gap-2 select-none shadow-sm hover:border-indigo-500/20 transition-colors">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
            <span className="text-xs font-mono text-slate-300 font-bold">Three.js / Fiber</span>
          </div>

          {/* Tailwind CSS */}
          <div className="px-4 py-2 rounded-xl bg-slate-900/40 border border-white/5 flex items-center gap-2 select-none shadow-sm hover:border-teal-500/20 transition-colors">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-400"></span>
            <span className="text-xs font-mono text-slate-300 font-bold">Tailwind v4</span>
          </div>

          {/* Framer Motion */}
          <div className="px-4 py-2 rounded-xl bg-slate-900/40 border border-white/5 flex items-center gap-2 select-none shadow-sm hover:border-rose-500/20 transition-colors">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
            <span className="text-xs font-mono text-slate-300 font-bold">Framer Motion</span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default LandingPage;
