import React from 'react';
import { useQuantumState } from '../hooks/useQuantumState';
import { BlochSphere } from '../components/bloch/BlochSphere';
import { GateControls } from '../components/simulator/GateControls';
import { DiracDisplay } from '../components/simulator/DiracDisplay';
import { MetricCard } from '../components/simulator/MetricCard';
import { HistoryTrack } from '../components/simulator/HistoryTrack';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { HelpButton } from '../components/ui/HelpButton';

export const SimulatorPage: React.FC<{ isAdvanced?: boolean; settings?: any }> = ({ isAdvanced, settings }) => {
  const {
    statevector,
    blochVector,
    prob0,
    prob1,
    history,
    applyGate,
    measure,
    reset,
  } = useQuantumState();

  return (
    <div className="py-4 space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Page Title Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-white/5 pb-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight font-heading m-0 text-slate-100">
            ⚛️ Qubit Workspace
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Real-time statevector visual simulator and laboratory sandbox
          </p>
        </div>
        
        {/* Statevector status badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-white/5 font-mono text-xs text-slate-300 shadow-md">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          <span>Simulation Active</span>
        </div>
      </div>

      {/* Simulator Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* =============================================================================
            LEFT COLUMN (3D visualization & Dirac coordinates)
            ============================================================================= */}
        <div className="lg:col-span-5 space-y-6">
          {/* Bloch Sphere Visualizer */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 pl-1">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider font-mono">
                3D Bloch Projection
              </h3>
              <HelpButton
                title="Bloch Sphere"
                beginnerText="A 3D representation where any point on the surface represents a qubit state. The orange arrow represents the current state vector. Drag to rotate the camera, scroll to zoom."
                advancedText="3D mapping of pure states in density space. The coordinates represent the expectation values of Pauli observables: (x, y, z) = (⟨X⟩, ⟨Y⟩, ⟨Z⟩). Pure states satisfy x² + y² + z² = 1."
                isAdvanced={!!isAdvanced}
              />
            </div>
            <BlochSphere blochVector={blochVector} settings={settings} />
          </div>

          {/* Coordinates HUD Card */}
          <Card hover={false} className="py-3 px-4 border-slate-800">
            <CardHeader className="m-0 p-0 flex-row justify-between items-center pb-2 border-b border-white/5 mb-3">
              <div className="flex items-center gap-1.5">
                <CardTitle className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
                  Bloch Vector Coordinates
                </CardTitle>
                <HelpButton
                  title="Coordinates"
                  beginnerText="These three values show the 3D position of the state vector. X points forward, Y points right, and Z points straight up."
                  advancedText="Expected values of the Pauli observables on the state vector. x = 2*Re(α*β), y = 2*Im(α*β), z = |α|² - |β|². Since it is a unit sphere, the vector length is always 1."
                  isAdvanced={!!isAdvanced}
                />
              </div>
              <span className="text-[10px] text-amber-400 font-bold bg-amber-950/40 border border-amber-800/20 px-1.5 py-0.5 rounded font-mono">
                r = 1.000
              </span>
            </CardHeader>
            <CardContent className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
              <div className="p-2 rounded bg-slate-950/40 border border-white/5">
                <span className="text-rose-400 font-bold">x: </span>
                <span className="text-slate-200">{blochVector.x.toFixed(3)}</span>
              </div>
              <div className="p-2 rounded bg-slate-950/40 border border-white/5">
                <span className="text-emerald-400 font-bold">y: </span>
                <span className="text-slate-200">{blochVector.y.toFixed(3)}</span>
              </div>
              <div className="p-2 rounded bg-slate-950/40 border border-white/5">
                <span className="text-blue-400 font-bold">z: </span>
                <span className="text-slate-200">{blochVector.z.toFixed(3)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Dirac notation Display */}
          <DiracDisplay statevector={statevector} isAdvanced={isAdvanced} />
        </div>

        {/* =============================================================================
            RIGHT COLUMN (Execution log, gate controls, metrics)
            ============================================================================= */}
        <div className="lg:col-span-7 space-y-6">
          {/* Operations History Timeline */}
          <HistoryTrack history={history} isAdvanced={isAdvanced} />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
            {/* Gate Controls Card */}
            <GateControls
              applyGate={applyGate}
              measure={measure}
              reset={reset}
              isAdvanced={isAdvanced}
            />

            {/* Probability Metrics Card */}
            <MetricCard prob0={prob0} prob1={prob1} isAdvanced={isAdvanced} />
          </div>
        </div>

      </div>
    </div>
  );
};
export default SimulatorPage;
