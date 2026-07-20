import React, { useRef, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { ChevronRight, Clock, RefreshCw } from 'lucide-react';
import { HelpButton } from '../ui/HelpButton';

interface HistoryTrackProps {
  history: string[];
  isAdvanced?: boolean;
}

export const HistoryTrack: React.FC<HistoryTrackProps> = ({ history, isAdvanced }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the end of the history whenever a new gate is added
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollLeft = containerRef.current.scrollWidth;
    }
  }, [history]);

  return (
    <Card hover={false} className="border-indigo-500/10">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-indigo-400" />
          <div>
            <div className="flex items-center gap-1.5">
              <CardTitle>🕐 Execution Timeline</CardTitle>
              <HelpButton
                title="Timeline"
                beginnerText="This is a chronological log of every gate you have applied during the current experiment. It reads from left to right."
                advancedText="The gate history logs computational operator applications in time order: |0⟩ → U1 → U2 ... → Collapse. It shows how the initial state was evolved sequentially."
                isAdvanced={!!isAdvanced}
              />
            </div>
            <CardDescription>Chronological log of quantum operations</CardDescription>
          </div>
        </div>
        <span className="text-[10px] bg-slate-900 px-2 py-0.5 rounded border border-white/5 font-semibold text-indigo-400">
          Length: {history.length}
        </span>
      </CardHeader>

      <CardContent>
        {history.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-6 text-center rounded-xl bg-slate-950/20 border border-white/5 border-dashed">
            <RefreshCw size={24} className="text-slate-600 animate-spin-slow mb-2" />
            <span className="text-xs text-slate-500 font-mono">No operations executed yet</span>
            <span className="text-[9px] text-slate-600">Apply a quantum gate to start the history track</span>
          </div>
        ) : (
          /* Scrollable Gate sequence */
          <div
            ref={containerRef}
            className="flex items-center gap-2 overflow-x-auto py-3 px-1 scrollbar-thin select-none"
          >
            <div className="flex items-center shrink-0">
              <span className="px-2.5 py-1 rounded bg-slate-950 text-slate-400 border border-white/10 font-bold font-mono text-xs shadow-md">
                |0⟩
              </span>
            </div>

            {history.map((gate, index) => (
              <React.Fragment key={index}>
                <ChevronRight size={14} className="text-slate-600 shrink-0" />
                <div className="flex items-center shrink-0 relative group">
                  {/* Gate bubble */}
                  <span className={`px-3 py-1.5 rounded-lg border font-bold font-mono text-xs shadow-md transition-all ${
                    gate.startsWith('Measure')
                      ? 'bg-emerald-950/90 text-emerald-400 border-emerald-500/20'
                      : gate === 'X'
                      ? 'bg-rose-950/90 text-rose-400 border-rose-500/20'
                      : gate === 'H'
                      ? 'bg-cyan-950/90 text-cyan-400 border-cyan-500/20 shadow-[0_0_10px_rgba(6,182,212,0.1)]'
                      : 'bg-indigo-950/90 text-indigo-400 border-indigo-500/20'
                  }`}>
                    {gate}
                  </span>
                  
                  {/* Index step tooltip badge */}
                  <span className="absolute -top-2 -right-1 text-[8px] bg-slate-950 text-slate-500 border border-white/5 px-1 rounded-full leading-tight select-none pointer-events-none">
                    {index + 1}
                  </span>
                </div>
              </React.Fragment>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
export default HistoryTrack;
