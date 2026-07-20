import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Cpu, Code } from 'lucide-react';
export const AboutPage: React.FC = () => {
  return (
    <div className="py-4 space-y-8 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
      {/* Header */}
      <div className="border-b border-white/5 pb-4 space-y-1">
        <h1 className="text-3xl font-extrabold tracking-tight font-heading m-0 text-slate-100">
          ⚛️ About QubitScope
        </h1>
        <p className="text-slate-400 text-xs">
          Origins, engineering design, and technological framework
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Core Vision */}
        <div className="md:col-span-2 space-y-6">
          <Card hover={false} className="border-slate-800">
            <CardHeader>
              <CardTitle>Project Philosophy</CardTitle>
              <CardDescription>Bridging abstraction and physical model visualization</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-slate-300 leading-relaxed">
              <p>
                Quantum computing is notoriously difficult to learn due to its reliance on abstract linear algebra and complex vector spaces. Operators are represented as matrices, and states are vectors that cannot be directly seen.
              </p>
              <p>
                <strong>QubitScope</strong> was created to demystify these abstractions. By projecting 2D complex state vectors onto a 3D unit sphere, learners can interactively apply gates and watch the state travel across the globe in real time.
              </p>
              <p>
                Originally built as a Python prototype utilizing Streamlit and Qiskit, QubitScope has been completely re-architected into a high-performance, responsive React SPA to deliver a lag-free 60 FPS learning environment suitable for a professional portfolio.
              </p>
            </CardContent>
          </Card>

          {/* Engine Separation */}
          <Card hover={false} className="border-slate-800">
            <CardHeader>
              <CardTitle>Architectural Separation of Concerns</CardTitle>
              <CardDescription>Decoupling mathematical simulation from visual render rendering</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-slate-300 leading-relaxed">
              <div className="flex gap-3">
                <div className="p-2 rounded bg-indigo-500/10 text-indigo-400 shrink-0 self-start mt-0.5">
                  <Code size={18} />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-xs text-slate-200">Mathematical Engine</h4>
                  <p className="text-xs text-slate-400">
                    A self-contained TypeScript engine (`src/engine/quantumEngine.ts`) implements pure complex number operations and 2x2 matrix multiplications. It performs statevector evolutions and measurements without any dependencies on the UI.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <div className="p-2 rounded bg-cyan-500/10 text-cyan-400 shrink-0 self-start mt-0.5">
                  <Cpu size={18} />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-xs text-slate-200">High-Performance Visualizer</h4>
                  <p className="text-xs text-slate-400">
                    React Three Fiber and Three.js draw the 3D projection canvas. A custom animation loop interpolates the coordinates on each frame and normalizes them back to the sphere surface, illustrating physical geodetic movements.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tech Stack Specs */}
        <div className="space-y-6">
          <Card hover={false} className="border-slate-800">
            <CardHeader>
              <CardTitle className="text-sm font-semibold text-slate-400 uppercase tracking-wider pl-1 font-mono">
                Technical Stack
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 font-mono text-[10px] text-slate-400">
              <div className="pb-2 border-b border-white/5 space-y-1">
                <span className="text-slate-200 font-bold block text-xs">Framework</span>
                <span>React 19 (Hooks, Context)</span>
              </div>
              <div className="pb-2 border-b border-white/5 space-y-1">
                <span className="text-slate-200 font-bold block text-xs">Bundler / Tooling</span>
                <span>Vite + TypeScript 5.0</span>
              </div>
              <div className="pb-2 border-b border-white/5 space-y-1">
                <span className="text-slate-200 font-bold block text-xs">3D Rendering</span>
                <span>Three.js + React Three Fiber</span>
              </div>
              <div className="pb-2 border-b border-white/5 space-y-1">
                <span className="text-slate-200 font-bold block text-xs">Styles</span>
                <span>Tailwind CSS v4</span>
              </div>
              <div className="pb-2 border-b border-white/5 space-y-1">
                <span className="text-slate-200 font-bold block text-xs">Animations</span>
                <span>Framer Motion 11</span>
              </div>
            </CardContent>
          </Card>

          {/* Credits */}
          <Card hover={false} className="border-slate-800">
            <CardContent className="py-6 text-center space-y-1">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest font-mono font-bold">Developed By</div>
              <div className="font-heading font-extrabold text-base bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent pt-1">
                Sumanth Mamidi
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
};
export default AboutPage;
