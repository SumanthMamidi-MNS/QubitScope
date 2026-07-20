import React from 'react';
import type { StateVector } from '../../types/quantum';
import { formatComplex, c_mag, c_phase } from '../../engine/quantumEngine';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { HelpButton } from '../ui/HelpButton';

interface DiracDisplayProps {
  statevector: StateVector;
  isAdvanced?: boolean;
}

export const DiracDisplay: React.FC<DiracDisplayProps> = ({ statevector, isAdvanced }) => {
  const [alpha, beta] = statevector;

  const magA = c_mag(alpha);
  const magB = c_mag(beta);

  const phaseA = c_phase(alpha) * (180 / Math.PI);
  const phaseB = c_phase(beta) * (180 / Math.PI);
  
  // Relative phase: phase(beta) - phase(alpha)
  const relativePhase = ((phaseB - phaseA + 360) % 360);

  const alphaStr = formatComplex(alpha, 3);
  const betaStr = formatComplex(beta, 3);

  // Helper to format phase
  const formatPhase = (phaseDeg: number) => {
    return `${phaseDeg.toFixed(1)}°`;
  };

  return (
    <Card hover={false} className="border-cyan-500/10">
      <CardHeader className="pb-2">
        <div>
          <div className="flex items-center gap-1.5">
            <CardTitle>Quantum State Vector</CardTitle>
            <HelpButton
              title="State Vector"
              beginnerText="This displays the mathematical formula of the qubit state. The coefficients in front of |0⟩ and |1⟩ show the blend of states. As you apply gates, these numbers update instantly."
              advancedText="The statevector |ψ⟩ is represented in Dirac notation: |ψ⟩ = α|0⟩ + β|1⟩. α and β are complex amplitudes whose squares (|α|² and |β|²) represent measurement probabilities. Global phase is ignored, but relative phase shifts are captured here."
              isAdvanced={!!isAdvanced}
            />
          </div>
          <CardDescription>Dirac notation and state amplitudes</CardDescription>
        </div>
        <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 text-[10px] font-mono">
          Single Qubit
        </span>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Dirac Equation Box */}
        <div className="p-4 rounded-xl bg-slate-950/40 border border-white/5 font-mono text-center flex flex-col justify-center items-center gap-1">
          <div className="text-xl md:text-2xl text-slate-100 flex items-center justify-center flex-wrap gap-1 leading-snug">
            <span>|ψ⟩ = </span>
            <span className="text-cyan-400 font-bold">({alphaStr})</span>
            <span className="text-slate-500">|0⟩</span>
            <span className="text-slate-400 font-medium"> + </span>
            <span className="text-rose-400 font-bold">({betaStr})</span>
            <span className="text-slate-500">|1⟩</span>
          </div>
          <span className="text-[10px] text-slate-500 mt-1">Normalized State Representation</span>
        </div>

        {/* Amplitude Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
          
          {/* Ground State Amplitude α */}
          <div className="p-3 rounded-lg bg-slate-900/30 border border-white/5 space-y-1.5">
            <div className="flex justify-between text-cyan-400 font-bold border-b border-white/5 pb-1">
              <span>Amplitudes (α)</span>
              <span>State |0⟩</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Value:</span>
              <span className="text-slate-200">{alphaStr}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Magnitude:</span>
              <span className="text-slate-200">{magA.toFixed(3)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Phase:</span>
              <span className="text-slate-200">{formatPhase(phaseA)}</span>
            </div>
          </div>

          {/* Excited State Amplitude β */}
          <div className="p-3 rounded-lg bg-slate-900/30 border border-white/5 space-y-1.5">
            <div className="flex justify-between text-rose-400 font-bold border-b border-white/5 pb-1">
              <span>Amplitudes (β)</span>
              <span>State |1⟩</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Value:</span>
              <span className="text-slate-200">{betaStr}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Magnitude:</span>
              <span className="text-slate-200">{magB.toFixed(3)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Phase:</span>
              <span className="text-slate-200">{formatPhase(phaseB)}</span>
            </div>
          </div>

        </div>

        {/* Phase Details Footer */}
        <div className="flex justify-between items-center px-4 py-2.5 rounded-lg bg-slate-950/20 border border-white/5 text-xs">
          <span className="text-slate-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
            Relative Phase (Δφ):
          </span>
          <span className="font-mono font-semibold text-indigo-300">
            {relativePhase.toFixed(1)}°
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
export default DiracDisplay;
