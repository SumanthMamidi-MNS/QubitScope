import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { HelpButton } from '../ui/HelpButton';

interface MetricCardProps {
  prob0: number;
  prob1: number;
  isAdvanced?: boolean;
}

export const MetricCard: React.FC<MetricCardProps> = ({ prob0, prob1, isAdvanced }) => {
  const percentage0 = (prob0 * 100).toFixed(1);
  const percentage1 = (prob1 * 100).toFixed(1);

  return (
    <Card hover={false} className="border-indigo-500/10">
      <CardHeader className="pb-2">
        <div>
          <div className="flex items-center gap-1.5">
            <CardTitle>📊 Measurement Probabilities</CardTitle>
            <HelpButton
              title="Probabilities"
              beginnerText="This shows the chance of measuring 0 or 1. A 50/50 state means a coin-flip. Measuring collapses the qubit."
              advancedText="Born's rule probabilities. The likelihood of collapse is given by P(0) = |α|² and P(1) = |β|². The bars display this density. Measuring collapses the statevector to a basis state."
              isAdvanced={!!isAdvanced}
            />
          </div>
          <CardDescription>Likelihood of state collapse upon observation</CardDescription>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Metric panels grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* |0⟩ Probability card */}
          <div className="p-4 rounded-xl bg-slate-950/45 border border-white/5 space-y-1 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-cyan-500" />
            <div className="text-[10px] text-slate-400 font-mono tracking-wider">PROBABILITY OF |0⟩</div>
            <div className="text-2xl md:text-3xl font-bold font-heading text-cyan-400">
              {percentage0}%
            </div>
            <div className="text-[9px] text-slate-500 font-mono leading-none">
              P(|0⟩) = |α|²
            </div>
          </div>

          {/* |1⟩ Probability card */}
          <div className="p-4 rounded-xl bg-slate-950/45 border border-white/5 space-y-1 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-rose-500" />
            <div className="text-[10px] text-slate-400 font-mono tracking-wider">PROBABILITY OF |1⟩</div>
            <div className="text-2xl md:text-3xl font-bold font-heading text-rose-400">
              {percentage1}%
            </div>
            <div className="text-[9px] text-slate-500 font-mono leading-none">
              P(|1⟩) = |β|²
            </div>
          </div>
        </div>

        {/* Visual Progress Tracks */}
        <div className="space-y-3 pt-1">
          {/* State |0⟩ track */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-cyan-400 font-semibold">State |0⟩ (Ground)</span>
              <span className="text-slate-400">{percentage0}%</span>
            </div>
            <div className="h-2 w-full bg-slate-950/60 rounded-full overflow-hidden border border-white/5">
              <div
                className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${percentage0}%` }}
              />
            </div>
          </div>

          {/* State |1⟩ track */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-rose-400 font-semibold">State |1⟩ (Excited)</span>
              <span className="text-slate-400">{percentage1}%</span>
            </div>
            <div className="h-2 w-full bg-slate-950/60 rounded-full overflow-hidden border border-white/5">
              <div
                className="h-full bg-gradient-to-r from-rose-600 to-rose-400 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${percentage1}%` }}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
export default MetricCard;
