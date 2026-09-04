import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Book, Cpu, Compass, Play, Dice5 } from 'lucide-react';

interface DocModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DocModal: React.FC<DocModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-md">
        
        {/* Modal Container: Flex column with overflow-hidden */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-2xl bg-slate-950 border border-cyan-500/25 glow-cyan rounded-2xl text-left shadow-2xl flex flex-col max-h-[85vh] overflow-hidden"
        >
          {/* Permanent Non-scrolling Header */}
          <div className="flex justify-between items-center px-6 py-4 border-b border-white/10 bg-slate-900/90 shrink-0">
            <div className="flex items-center gap-2">
              <Book className="text-cyan-400" size={20} />
              <h2 className="text-lg font-extrabold font-heading text-slate-100">
                Quantum Concepts &amp; Reference
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/5 cursor-pointer transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Scrollable Body Content */}
          <div className="p-6 md:p-8 overflow-y-auto space-y-6 text-sm text-slate-300 leading-relaxed">
            
            {/* 1. What is a Qubit? */}
            <div className="space-y-2">
              <h3 className="font-heading font-extrabold text-slate-100 flex items-center gap-1.5 text-xs uppercase tracking-wider text-cyan-400">
                <Cpu size={14} />
                1. What is a Qubit?
              </h3>
              <p>
                In classical computers, a bit is strictly <code className="font-mono text-cyan-400">0</code> or <code className="font-mono text-cyan-400">1</code>. A quantum bit (qubit) can be in a <strong>superposition</strong>—a blend of both states at the same time.
              </p>
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 text-center font-mono text-slate-200 text-base">
                |ψ⟩ = α|0⟩ + β|1⟩
              </div>
              <p className="text-xs text-slate-400">
                The yellow badge <span className="font-bold text-amber-400">|ψ⟩</span> marks the qubit's current state. The values <code className="font-mono text-cyan-400">α</code> and <code className="font-mono text-cyan-400">β</code> determine the chances of measuring state <code className="font-mono">|0⟩</code> vs <code className="font-mono">|1⟩</code>.
              </p>
            </div>

            {/* 2. The Bloch Sphere */}
            <div className="space-y-2">
              <h3 className="font-heading font-extrabold text-slate-100 flex items-center gap-1.5 text-xs uppercase tracking-wider text-cyan-400">
                <Compass size={14} />
                2. The 3D Bloch Sphere
              </h3>
              <p>
                The Bloch Sphere is a 3D globe that visualizes the qubit's state as a point on its surface:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-mono text-xs text-center">
                <div className="p-3 rounded-lg bg-slate-900/50 border border-white/5">
                  <span className="text-sky-400 font-bold block mb-1">North Pole |0⟩</span>
                  <span className="text-slate-400 text-[11px]">100% chance of 0</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-900/50 border border-white/5">
                  <span className="text-amber-400 font-bold block mb-1">Equator |+⟩</span>
                  <span className="text-slate-400 text-[11px]">50% 0 / 50% 1 mix</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-900/50 border border-white/5">
                  <span className="text-coral-400 font-bold block mb-1">South Pole |1⟩</span>
                  <span className="text-slate-400 text-[11px]">100% chance of 1</span>
                </div>
              </div>
              <p className="text-xs text-slate-400">
                The orange arrow always points to the exact position of the qubit on the sphere.
              </p>
            </div>

            {/* 3. Quantum Gates */}
            <div className="space-y-2">
              <h3 className="font-heading font-extrabold text-slate-100 flex items-center gap-1.5 text-xs uppercase tracking-wider text-cyan-400">
                <Play size={14} />
                3. Quantum Gates (3D Rotations)
              </h3>
              <p>
                Quantum gates act like steering controls that rotate the arrow around the sphere:
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs text-slate-300">
                <div className="p-3 rounded-lg bg-slate-900/50 border border-white/5 space-y-1">
                  <span className="font-bold text-cyan-400 block">Hadamard (H)</span>
                  <span className="text-[11px] text-slate-300 block">The Superposition Gate: Rotates the arrow from the North Pole (|0⟩) down to the equator (50/50 mix).</span>
                </div>
                
                <div className="p-3 rounded-lg bg-slate-900/50 border border-white/5 space-y-1">
                  <span className="font-bold text-cyan-400 block">Pauli-X (Bit Flip)</span>
                  <span className="text-[11px] text-slate-300 block">The Quantum NOT Gate: Flips the arrow 180° between the North Pole (|0⟩) and South Pole (|1⟩).</span>
                </div>

                <div className="p-3 rounded-lg bg-slate-900/50 border border-white/5 space-y-1">
                  <span className="font-bold text-cyan-400 block">Pauli-Z (Phase Flip)</span>
                  <span className="text-[11px] text-slate-300 block">Rotates the arrow 180° around the vertical axis, changing the phase along the equator.</span>
                </div>

                <div className="p-3 rounded-lg bg-slate-900/50 border border-white/5 space-y-1">
                  <span className="font-bold text-cyan-400 block">Continuous Rotations (Rx, Ry, Rz)</span>
                  <span className="text-[11px] text-slate-300 block">Rotate the arrow smoothly by any custom angle using the rotation slider.</span>
                </div>
              </div>
            </div>

            {/* 4. Measurement */}
            <div className="space-y-2">
              <h3 className="font-heading font-extrabold text-slate-100 flex items-center gap-1.5 text-xs uppercase tracking-wider text-cyan-400">
                <Dice5 size={14} />
                4. Measurement (Wavefunction Collapse)
              </h3>
              <p>
                In quantum mechanics, observing a qubit forces it out of its blend. Pressing <strong>Measure</strong> rolls the dice:
              </p>
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 text-xs text-slate-300 space-y-1">
                <div>• If the arrow is 80% closer to the top, you have an <strong>80% chance</strong> of measuring <strong>0</strong> and a <strong>20% chance</strong> of <strong>1</strong>.</div>
                <div>• The moment measurement happens, the arrow snaps irreversibly to either <code className="font-mono text-sky-400">|0⟩</code> or <code className="font-mono text-coral-400">|1⟩</code>.</div>
              </div>
            </div>

          </div>

          {/* Permanent Non-scrolling Footer */}
          <div className="flex justify-between items-center px-6 py-3 border-t border-white/5 bg-slate-950 shrink-0 font-mono text-[10px] text-slate-500">
            <span>QubitScope Knowledge Base</span>
            <span>Interactive Quantum Guide</span>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
export default DocModal;
