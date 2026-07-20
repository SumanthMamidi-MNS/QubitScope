import React, { useState } from 'react';
import type { GateType } from '../../types/quantum';
import { Button } from '../ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Play, RotateCcw } from 'lucide-react';
import { HelpButton } from '../ui/HelpButton';

interface GateControlsProps {
  applyGate: (gateType: GateType, name: string, theta?: number) => void;
  measure: () => void;
  reset: () => void;
  isAdvanced?: boolean;
}

export const GateControls: React.FC<GateControlsProps> = ({
  applyGate,
  measure,
  reset,
  isAdvanced,
}) => {
  const [activeTab, setActiveTab] = useState<'standard' | 'rotations'>('standard');
  
  // Rotation gate angle states (in degrees)
  const [rxAngle, setRxAngle] = useState<number>(90);
  const [ryAngle, setRyAngle] = useState<number>(90);
  const [rzAngle, setRzAngle] = useState<number>(90);

  const handleApplyRotation = (gate: 'Rx' | 'Ry' | 'Rz', angleDeg: number) => {
    const angleRad = (angleDeg * Math.PI) / 180;
    applyGate(gate, gate, angleRad);
  };

  return (
    <Card hover={false} className="border-blue-500/10">
      <CardHeader className="pb-2 border-b border-white/5 mb-3 flex-col sm:flex-row gap-2">
        <div>
          <div className="flex items-center gap-1.5">
            <CardTitle>🎛️ Quantum Control Unit</CardTitle>
            <HelpButton
              title="Gate Controls"
              beginnerText="This panel allows you to manipulate the qubit using quantum gates. Standard gates apply instant rotations. Rotation sliders let you drag the state vector around the axes continuously."
              advancedText="Unitary operator controls. Apply Pauli-X, Y, Z (which rotate by π radians around their respective axes), Hadamard (which creates equal superposition), or continuous R_x, R_y, R_z rotations by custom angle θ."
              isAdvanced={!!isAdvanced}
            />
          </div>
          <CardDescription>Apply unitary transforms to the state</CardDescription>
        </div>
        <div className="flex bg-slate-950/40 p-0.5 rounded-lg border border-white/5 self-start sm:self-center">
          <button
            onClick={() => setActiveTab('standard')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              activeTab === 'standard'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Standard
          </button>
          <button
            onClick={() => setActiveTab('rotations')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              activeTab === 'rotations'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Rotations
          </button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {activeTab === 'standard' ? (
          /* STANDARD GATES TAB */
          <div className="grid grid-cols-2 gap-2.5">
            <div className="flex flex-col gap-1 p-2 rounded-lg bg-slate-950/20 border border-white/5 hover:border-slate-800 transition-all">
              <Button
                variant="primary"
                onClick={() => applyGate('X', 'X')}
                className="w-full font-bold text-xs"
              >
                Pauli-X (NOT)
              </Button>
              <span className="text-[9px] text-slate-500 text-center font-mono">Flips |0⟩ ↔ |1⟩</span>
            </div>

            <div className="flex flex-col gap-1 p-2 rounded-lg bg-slate-950/20 border border-white/5 hover:border-slate-800 transition-all">
              <Button
                variant="outline"
                onClick={() => applyGate('Y', 'Y')}
                className="w-full font-bold text-xs"
              >
                Pauli-Y
              </Button>
              <span className="text-[9px] text-slate-500 text-center font-mono">Rotates 180° on Y</span>
            </div>

            <div className="flex flex-col gap-1 p-2 rounded-lg bg-slate-950/20 border border-white/5 hover:border-slate-800 transition-all">
              <Button
                variant="outline"
                onClick={() => applyGate('Z', 'Z')}
                className="w-full font-bold text-xs"
              >
                Pauli-Z
              </Button>
              <span className="text-[9px] text-slate-500 text-center font-mono">Phase flip |1⟩ → -|1⟩</span>
            </div>

            <div className="flex flex-col gap-1 p-2 rounded-lg bg-slate-950/20 border border-white/5 hover:border-slate-800 transition-all">
              <Button
                variant="glow"
                onClick={() => applyGate('H', 'H')}
                className="w-full font-bold text-xs text-slate-950"
              >
                Hadamard (H)
              </Button>
              <span className="text-[9px] text-slate-400 text-center font-mono font-medium">Creates Superposition</span>
            </div>

            <div className="flex flex-col gap-1 p-2 rounded-lg bg-slate-950/20 border border-white/5 hover:border-slate-800 transition-all">
              <Button
                variant="outline"
                onClick={() => applyGate('S', 'S')}
                className="w-full font-bold text-xs"
              >
                S Gate (Z^1/2)
              </Button>
              <span className="text-[9px] text-slate-500 text-center font-mono">90° phase rotation</span>
            </div>

            <div className="flex flex-col gap-1 p-2 rounded-lg bg-slate-950/20 border border-white/5 hover:border-slate-800 transition-all">
              <Button
                variant="outline"
                onClick={() => applyGate('T', 'T')}
                className="w-full font-bold text-xs"
              >
                T Gate (Z^1/4)
              </Button>
              <span className="text-[9px] text-slate-500 text-center font-mono">45° phase rotation</span>
            </div>
          </div>
        ) : (
          /* ROTATIONS TAB */
          <div className="space-y-3.5">
            {/* Rx Rotation */}
            <div className="p-3 rounded-xl bg-slate-950/30 border border-white/5 space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-rose-400">Rx(θ) - Rotation around X</span>
                <span className="font-mono bg-rose-500/10 text-rose-400 px-1.5 py-0.5 rounded text-[10px]">
                  {rxAngle}° ({(rxAngle * Math.PI / 180).toFixed(2)} rad)
                </span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="-180"
                  max="180"
                  value={rxAngle}
                  onChange={(e) => setRxAngle(parseInt(e.target.value))}
                  className="flex-grow h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleApplyRotation('Rx', rxAngle)}
                  className="px-2.5 py-1 text-xs shrink-0"
                >
                  Apply
                </Button>
              </div>
            </div>

            {/* Ry Rotation */}
            <div className="p-3 rounded-xl bg-slate-950/30 border border-white/5 space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-emerald-400">Ry(θ) - Rotation around Y</span>
                <span className="font-mono bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded text-[10px]">
                  {ryAngle}° ({(ryAngle * Math.PI / 180).toFixed(2)} rad)
                </span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="-180"
                  max="180"
                  value={ryAngle}
                  onChange={(e) => setRyAngle(parseInt(e.target.value))}
                  className="flex-grow h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleApplyRotation('Ry', ryAngle)}
                  className="px-2.5 py-1 text-xs shrink-0"
                >
                  Apply
                </Button>
              </div>
            </div>

            {/* Rz Rotation */}
            <div className="p-3 rounded-xl bg-slate-950/30 border border-white/5 space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-blue-400">Rz(θ) - Rotation around Z</span>
                <span className="font-mono bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded text-[10px]">
                  {rzAngle}° ({(rzAngle * Math.PI / 180).toFixed(2)} rad)
                </span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="-180"
                  max="180"
                  value={rzAngle}
                  onChange={(e) => setRzAngle(parseInt(e.target.value))}
                  className="flex-grow h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleApplyRotation('Rz', rzAngle)}
                  className="px-2.5 py-1 text-xs shrink-0"
                >
                  Apply
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Global Operations: Reset and Measure */}
        <div className="grid grid-cols-2 gap-3 border-t border-white/5 pt-3.5 mt-2">
          <Button
            variant="danger"
            onClick={reset}
            className="flex items-center justify-center gap-1.5 text-xs font-semibold py-2.5"
          >
            <RotateCcw size={14} />
            Reset State
          </Button>

          <Button
            variant="glow"
            onClick={measure}
            className="flex items-center justify-center gap-1.5 text-xs font-bold py-2.5 text-slate-950 animate-pulse hover:animate-none"
          >
            <Play size={14} className="fill-current text-slate-950" />
            Measure Qubit
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
export default GateControls;
