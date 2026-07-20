import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Book, Cpu, Compass, Info } from 'lucide-react';

interface DocModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DocModal: React.FC<DocModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
        
        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-2xl glass-panel border border-cyan-500/20 glow-cyan p-6 bg-slate-950/90 text-left space-y-6 max-h-[85vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex justify-between items-center pb-3 border-b border-white/5 sticky top-0 bg-slate-950/20 backdrop-blur pb-4 z-10">
            <div className="flex items-center gap-2">
              <Book className="text-cyan-400" size={20} />
              <h2 className="text-lg font-extrabold font-heading text-slate-100">
                Quantum Documentation & Reference
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/5 cursor-pointer transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Doc Content sections */}
          <div className="space-y-6 text-sm text-slate-300 leading-relaxed pr-2">
            
            {/* 1. Qubit State */}
            <div className="space-y-2">
              <h3 className="font-heading font-extrabold text-slate-100 flex items-center gap-1.5 text-xs uppercase tracking-wider text-cyan-400">
                <Cpu size={14} />
                1. Single-Qubit State Representation
              </h3>
              <p>
                A quantum bit (qubit) state vector <code className="font-mono text-cyan-400 text-xs">|ψ⟩</code> is represented mathematically as a linear combination of two orthonormal basis states <code className="font-mono text-xs">|0⟩</code> and <code className="font-mono text-xs">|1⟩</code>:
              </p>
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 text-center font-mono text-slate-200 text-base">
                |ψ⟩ = α|0⟩ + β|1⟩
              </div>
              <p className="text-xs text-slate-400">
                Where <code className="font-mono text-cyan-500">α</code> and <code className="font-mono text-cyan-500">β</code> are complex numbers representing probability amplitudes. Normalization guarantees that the sum of probabilities equals 1: <code className="font-mono text-slate-300">|α|² + |β|² = 1</code>.
              </p>
            </div>

            {/* 2. Bloch Sphere */}
            <div className="space-y-2">
              <h3 className="font-heading font-extrabold text-slate-100 flex items-center gap-1.5 text-xs uppercase tracking-wider text-cyan-400">
                <Compass size={14} />
                2. Bloch Sphere Coordinates
              </h3>
              <p>
                Any pure state vector can be mapped to Cartesian coordinates <code className="font-mono text-xs">(x, y, z)</code> on the surface of a unit sphere using the polar angle <code className="font-mono text-xs">θ</code> and azimuthal angle <code className="font-mono text-xs">φ</code>:
              </p>
              <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 font-mono text-slate-200 space-y-1 text-xs">
                <div>x = sin(θ) · cos(φ)  [Expectation value of Pauli-X]</div>
                <div>y = sin(θ) · sin(φ)  [Expectation value of Pauli-Y]</div>
                <div>z = cos(θ)          [Expectation value of Pauli-Z]</div>
              </div>
              <p className="text-xs text-slate-400">
                The North Pole represents state <code className="font-mono">|0⟩</code> (z = 1) and the South Pole represents state <code className="font-mono">|1⟩</code> (z = -1). Points along the equator represent equal superposition states with varying relative phases.
              </p>
            </div>

            {/* 3. Gate Operators */}
            <div className="space-y-2">
              <h3 className="font-heading font-extrabold text-slate-100 flex items-center gap-1.5 text-xs uppercase tracking-wider text-cyan-400">
                <Info size={14} />
                3. Quantum Operators & Matrices
              </h3>
              <p>
                Quantum gates are unitary transformations represented as 2×2 matrices. Common operations include:
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs text-slate-300">
                <div className="p-3 rounded-lg bg-slate-900/50 border border-white/5 space-y-1.5">
                  <span className="font-bold text-cyan-400 block">Hadamard (H)</span>
                  <div className="text-[11px] leading-tight">
                    H = 1/√2 · [ [1, 1], [1, -1] ]
                  </div>
                  <span className="text-[10px] text-slate-500 block">Creates equal superposition.</span>
                </div>
                
                <div className="p-3 rounded-lg bg-slate-900/50 border border-white/5 space-y-1.5">
                  <span className="font-bold text-cyan-400 block">Pauli-X (Bit Flip)</span>
                  <div className="text-[11px] leading-tight">
                    X = [ [0, 1], [1, 0] ]
                  </div>
                  <span className="text-[10px] text-slate-500 block">Rotates the state vector 180° around X axis.</span>
                </div>

                <div className="p-3 rounded-lg bg-slate-900/50 border border-white/5 space-y-1.5">
                  <span className="font-bold text-cyan-400 block">Pauli-Z (Phase Flip)</span>
                  <div className="text-[11px] leading-tight">
                    Z = [ [1, 0], [0, -1] ]
                  </div>
                  <span className="text-[10px] text-slate-500 block">Inverts phase of state |1⟩.</span>
                </div>

                <div className="p-3 rounded-lg bg-slate-900/50 border border-white/5 space-y-1.5">
                  <span className="font-bold text-cyan-400 block">Phase (S / T)</span>
                  <div className="text-[11px] leading-tight">
                    S = [ [1, 0], [0, i] ] <br />
                    T = [ [1, 0], [0, e^(iπ/4)] ]
                  </div>
                  <span className="text-[10px] text-slate-500 block">Rotates phase around Z axis by 90° / 45°.</span>
                </div>
              </div>
            </div>

          </div>

          {/* Footer */}
          <div className="flex justify-between items-center pt-4 border-t border-white/5 mt-6 font-mono text-[10px] text-slate-500">
            <span>Version 1.0.0 Reference</span>
            <span>QubitScope Developer Library</span>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
export default DocModal;
