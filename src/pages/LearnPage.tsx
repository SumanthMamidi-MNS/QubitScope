import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, HelpCircle, Layers, CheckCircle2, ChevronRight, Play, RotateCcw, Search, Compass, GraduationCap } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { BlochSphere } from '../components/bloch/BlochSphere';
import type { StateVector, GateType } from '../types/quantum';
import {
  complex,
  applyGateToState,
  getBlochVector,
  getProbabilities,
  normalizeStateVector,
} from '../engine/quantumEngine';
import { LEARN_CHAPTERS, GATE_ENCYCLOPEDIA, GLOSSARY } from '../data/educationData';

interface LearnPageProps {
  isAdvanced: boolean;
  onNavigate?: (page: 'home' | 'simulator' | 'learn' | 'about') => void;
}

export const LearnPage: React.FC<LearnPageProps> = ({ isAdvanced, onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'chapters' | 'gates' | 'glossary'>('chapters');
  const [activeChapterId, setActiveChapterId] = useState<number>(1);
  const [completedChapters, setCompletedChapters] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedGate, setExpandedGate] = useState<string | null>(null);

  // Local Qubit state for the interactive mini-playground inside chapters
  const [localQubitState, setLocalQubitState] = useState<StateVector>([complex(1, 0), complex(0, 0)]);

  const activeChapter = LEARN_CHAPTERS.find(c => c.id === activeChapterId) || LEARN_CHAPTERS[0];

  // Load progress from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('qubitscope_progress');
    if (saved) {
      try {
        setCompletedChapters(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Update local playground statevector whenever the active chapter changes
  useEffect(() => {
    // Reset local qubit state
    setLocalQubitState([complex(1, 0), complex(0, 0)]);
  }, [activeChapterId]);

  const handleMarkCompleted = (id: number) => {
    setCompletedChapters(prev => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      localStorage.setItem('qubitscope_progress', JSON.stringify(next));
      return next;
    });

    // Automatically transition to the next chapter if available
    if (id < LEARN_CHAPTERS.length) {
      setActiveChapterId(id + 1);
    }
  };

  const handleResetProgress = () => {
    setCompletedChapters([]);
    localStorage.removeItem('qubitscope_progress');
    setActiveChapterId(1);
  };

  // Local playground operations
  const handleApplyLocalGate = (gateType: GateType, theta?: number) => {
    setLocalQubitState(prev => {
      const next = applyGateToState(prev, gateType, theta);
      return normalizeStateVector(next);
    });
  };

  const handleResetLocalQubit = () => {
    setLocalQubitState([complex(1, 0), complex(0, 0)]);
  };

  const localBlochVector = getBlochVector(localQubitState);
  const { p0: localP0, p1: localP1 } = getProbabilities(localQubitState);

  // Glossary filter logic
  const filteredGlossary = GLOSSARY.filter(item =>
    item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.beginner.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.advanced.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="py-4 space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
      
      {/* =============================================================================
          PAGE HEADER & TABS SELECTOR
          ============================================================================= */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight font-heading m-0 text-slate-100 flex items-center gap-2">
            <GraduationCap className="text-cyan-400" /> Learn Quantum Computing
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Visual lessons, terminology glossaries, and the quantum gate encyclopedia
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex bg-slate-950/40 p-0.5 rounded-lg border border-white/5">
          <button
            onClick={() => setActiveTab('chapters')}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              activeTab === 'chapters'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen size={14} />
            Chapters
          </button>
          <button
            onClick={() => setActiveTab('gates')}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              activeTab === 'gates'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers size={14} />
            Gate Encyclopedia
          </button>
          <button
            onClick={() => setActiveTab('glossary')}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              activeTab === 'glossary'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <HelpCircle size={14} />
            Glossary
          </button>
        </div>
      </div>

      {/* =============================================================================
          TAB CONTENT: CHAPTERS
          ============================================================================= */}
      {activeTab === 'chapters' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Visual Roadmap (Roadmap Path) */}
          <div className="lg:col-span-4 space-y-6">
            <Card hover={false} className="border-slate-800">
              <CardHeader className="pb-2 flex-row justify-between items-center border-b border-white/5 mb-3">
                <CardTitle className="text-sm font-semibold text-slate-400 uppercase tracking-wider font-mono">
                  Study Roadmap
                </CardTitle>
                {completedChapters.length > 0 && (
                  <button
                    onClick={handleResetProgress}
                    className="text-[10px] text-rose-400 hover:text-rose-300 font-semibold cursor-pointer"
                  >
                    Reset Progress
                  </button>
                )}
              </CardHeader>
              <CardContent className="relative py-2">
                
                {/* Connecting visual timeline bar line */}
                <div className="absolute left-[27px] top-[24px] bottom-[24px] w-0.5 bg-slate-800" />
                <div 
                  className="absolute left-[27px] top-[24px] w-0.5 bg-gradient-to-b from-cyan-500 to-indigo-500 transition-all duration-500" 
                  style={{
                    height: `${(completedChapters.length / LEARN_CHAPTERS.length) * 80}%`
                  }}
                />

                <div className="space-y-4 relative">
                  {LEARN_CHAPTERS.map((chapter) => {
                    const isCompleted = completedChapters.includes(chapter.id);
                    const isActive = activeChapterId === chapter.id;

                    return (
                      <div
                        key={chapter.id}
                        onClick={() => setActiveChapterId(chapter.id)}
                        className={`flex items-center gap-4 p-2 rounded-xl transition-all cursor-pointer select-none group border ${
                          isActive
                            ? 'bg-slate-900 border-cyan-500/20'
                            : 'border-transparent hover:bg-slate-900/40'
                        }`}
                      >
                        {/* Chapter Node Circle */}
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-mono font-bold text-xs shrink-0 z-10 transition-all ${
                            isCompleted
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                              : isActive
                              ? 'bg-cyan-500 text-slate-950 shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                              : 'bg-slate-900 text-slate-500 border border-slate-800 group-hover:border-slate-700'
                          }`}
                        >
                          {isCompleted ? <CheckCircle2 size={16} /> : chapter.id}
                        </div>

                        {/* Title descriptions */}
                        <div className="text-left">
                          <span className={`block text-xs font-semibold transition-colors ${
                            isActive ? 'text-slate-100' : 'text-slate-400 group-hover:text-slate-200'
                          }`}>
                            {chapter.title.substring(3)}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {isCompleted ? 'Completed' : isActive ? 'Active Now' : 'Pending'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Quick Tips */}
            <div className="p-4 rounded-xl bg-slate-950/20 border border-white/5 space-y-2">
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block font-bold">
                💡 Learning Tip
              </span>
              <p className="text-xs text-slate-400 leading-normal">
                Try completing all chapters to build full conceptual model alignment. Switch to **Advanced Mode** in the navbar to unlock the underlying linear algebra and quantum transformations matrices.
              </p>
            </div>
          </div>

          {/* Right Column: Chapter Reader */}
          <div className="lg:col-span-8 space-y-6">
            <Card hover={false} className="border-cyan-500/10">
              <CardHeader className="pb-3 border-b border-white/5 mb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-bold">
                      Learning Chapter {activeChapter.id}
                    </span>
                    <CardTitle className="text-2xl mt-1">{activeChapter.title}</CardTitle>
                  </div>
                  {completedChapters.includes(activeChapter.id) && (
                    <span className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-800/20 px-2.5 py-1 rounded-full font-semibold">
                      <CheckCircle2 size={12} />
                      Completed
                    </span>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Paragraph Content */}
                <div className="space-y-4 text-slate-300 text-sm leading-relaxed">
                  {(isAdvanced ? activeChapter.advancedContent : activeChapter.beginnerContent).map((p, idx) => (
                    <p key={idx}>{p}</p>
                  ))}
                </div>

                {/* =============================================================================
                    INTERACTIVE VISUALIZATION / PLAYGROUND
                    ============================================================================= */}
                {activeChapter.id !== 6 && (
                  <div className="border-t border-b border-white/5 py-6 my-6 space-y-4">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider pl-1 font-mono block">
                      🔬 Chapter Sandbox Playground
                    </span>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                      
                      {/* Left: Mini Bloch Sphere Visualizer */}
                      <div className="relative">
                        <BlochSphere blochVector={localBlochVector} />
                        
                        {/* Overlay Coordinates */}
                        <div className="absolute top-4 left-4 px-2.5 py-1 rounded bg-slate-900/90 border border-white/5 text-[9px] text-slate-400 font-mono shadow-md backdrop-blur flex gap-3">
                          <span>X: {localBlochVector.x.toFixed(2)}</span>
                          <span>Y: {localBlochVector.y.toFixed(2)}</span>
                          <span>Z: {localBlochVector.z.toFixed(2)}</span>
                        </div>
                      </div>

                      {/* Right: Sandbox HUD & controls */}
                      <div className="space-y-4">
                        <div className="p-3 rounded-lg bg-slate-900/50 border border-white/5 text-xs font-mono space-y-2">
                          <div className="flex justify-between border-b border-white/5 pb-1 text-[10px] text-slate-500 uppercase tracking-wider">
                            <span>Quantum State</span>
                            <span>Probabilities</span>
                          </div>
                          
                          <div className="text-sm font-bold text-slate-200">
                            |ψ⟩ = ({complex(localQubitState[0].re, localQubitState[0].im).re.toFixed(2)})|0⟩ + ({complex(localQubitState[1].re, localQubitState[1].im).re.toFixed(2)})|1⟩
                          </div>

                          <div className="space-y-1 pt-1.5">
                            <div className="flex justify-between text-[10px]">
                              <span className="text-cyan-400">P(|0⟩): {(localP0 * 100).toFixed(0)}%</span>
                              <span className="text-rose-400">P(|1⟩): {(localP1 * 100).toFixed(0)}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden flex">
                              <div className="h-full bg-cyan-500" style={{ width: `${localP0 * 100}%` }} />
                              <div className="h-full bg-rose-500" style={{ width: `${localP1 * 100}%` }} />
                            </div>
                          </div>
                        </div>

                        {/* Guided exercise box */}
                        {activeChapter.interactivePreset && (
                          <div className="p-3 rounded-lg bg-slate-950/40 border border-cyan-500/10 text-xs space-y-1">
                            <span className="font-bold text-cyan-400 block">{activeChapter.interactivePreset.label}</span>
                            <p className="text-slate-400 text-[11px] leading-snug">{activeChapter.interactivePreset.description}</p>
                            
                            {/* Preset applier button */}
                            {activeChapter.interactivePreset.gates.length > 0 && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  handleResetLocalQubit();
                                  activeChapter.interactivePreset?.gates.forEach(gate => {
                                    handleApplyLocalGate(gate.type as GateType, gate.theta);
                                  });
                                }}
                                className="mt-2 py-1 px-2.5 text-[10px] flex items-center gap-1 font-bold border-cyan-500/20 text-cyan-400 bg-cyan-950/10 hover:bg-cyan-950/20"
                              >
                                <Play size={10} />
                                Run Preset Sequence
                              </Button>
                            )}
                          </div>
                        )}

                        {/* Playground buttons */}
                        <div className="flex flex-wrap gap-2 pt-1">
                          <Button variant="primary" size="sm" onClick={() => handleApplyLocalGate('X')} className="text-xs py-1 px-3">
                            X
                          </Button>
                          <Button variant="glow" size="sm" onClick={() => handleApplyLocalGate('H')} className="text-xs py-1 px-3 text-slate-950">
                            H
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleApplyLocalGate('Z')} className="text-xs py-1 px-3">
                            Z
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleApplyLocalGate('S')} className="text-xs py-1 px-3">
                            S
                          </Button>
                          <Button variant="danger" size="sm" onClick={handleResetLocalQubit} className="text-xs py-1 px-2 flex items-center gap-1 shrink-0 ml-auto">
                            <RotateCcw size={12} />
                            Reset
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Chapter 6 CTA link to Simulator page */}
                {activeChapter.id === 6 && (
                  <div className="p-6 rounded-2xl bg-gradient-to-b from-cyan-950/30 to-slate-900/60 border border-cyan-500/20 text-center space-y-4 my-6 shadow-xl">
                    <Compass className="w-12 h-12 text-cyan-400 mx-auto animate-pulse" />
                    <div className="space-y-1.5 max-w-md mx-auto">
                      <h4 className="font-heading font-extrabold text-base text-slate-100">
                        {completedChapters.includes(6)
                          ? '🎉 Course Completed! 100% Mastered'
                          : 'Ready to enter the full laboratory?'}
                      </h4>
                      <p className="text-xs text-slate-400 leading-normal">
                        {completedChapters.includes(6)
                          ? 'You have finished all 6 foundational chapters. Head into the interactive Simulator Workspace to experiment with continuous rotations and custom circuits!'
                          : 'Switch to the main Simulator Workspace to apply gates continuously, check state collapses, and view complete trace history pipelines.'}
                      </p>
                    </div>
                    {onNavigate && (
                      <Button
                        variant="glow"
                        size="md"
                        onClick={() => onNavigate('simulator')}
                        className="font-bold text-slate-950 px-6 py-2 shadow-lg"
                      >
                        Enter Workspace Simulator
                      </Button>
                    )}
                  </div>
                )}

                {/* Key Takeaways */}
                <div className="p-4 rounded-xl bg-slate-900/40 border border-white/5 space-y-2">
                  <span className="text-xs font-bold text-slate-200 block">📌 Key Takeaways</span>
                  <ul className="list-disc pl-5 space-y-1 text-slate-400 text-xs">
                    {activeChapter.takeaways.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>

                {/* Footer Controls */}
                <div className="flex justify-between items-center pt-4 border-t border-white/5 mt-6">
                  <span className="text-xs text-slate-500 font-mono">
                    Chapter {activeChapter.id} of {LEARN_CHAPTERS.length}
                  </span>
                  
                  <Button
                    variant={completedChapters.includes(activeChapter.id) ? 'outline' : 'glow'}
                    onClick={() => {
                      if (activeChapter.id === LEARN_CHAPTERS.length && completedChapters.includes(6)) {
                        if (onNavigate) onNavigate('simulator');
                      } else {
                        handleMarkCompleted(activeChapter.id);
                      }
                    }}
                    className={`font-bold text-xs flex items-center gap-1.5 ${
                      activeChapter.id === LEARN_CHAPTERS.length && completedChapters.includes(6)
                        ? 'border-emerald-500/40 text-emerald-400 bg-emerald-950/20 hover:bg-emerald-950/30'
                        : ''
                    }`}
                  >
                    {activeChapter.id === LEARN_CHAPTERS.length
                      ? (completedChapters.includes(6) ? '✓ Course Completed (Launch Lab)' : 'Finish Course 🎓')
                      : 'Mark Completed & Next'}
                    <ChevronRight size={14} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* =============================================================================
          TAB CONTENT: GATE ENCYCLOPEDIA
          ============================================================================= */}
      {activeTab === 'gates' && (
        <div className="space-y-6">
          <div className="max-w-2xl text-left space-y-2">
            <h2 className="text-2xl font-bold font-heading">The Quantum Gate Encyclopedia</h2>
            <p className="text-xs text-slate-400 leading-normal">
              A comprehensive directory of unitary operators. Click on any gate to expand details, inspect mathematical formulations, and examine real-world use-cases.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {GATE_ENCYCLOPEDIA.map((gate) => {
              const isExpanded = expandedGate === gate.type;
              
              const diffColors = {
                Beginner: 'bg-emerald-950/50 text-emerald-400 border-emerald-500/20',
                Intermediate: 'bg-amber-950/50 text-amber-400 border-amber-500/20',
                Advanced: 'bg-rose-950/50 text-rose-400 border-rose-500/20'
              };

              return (
                <Card
                  key={gate.type}
                  hover={!isExpanded}
                  className={`border transition-all flex flex-col justify-between ${
                    isExpanded ? 'border-cyan-500/20 shadow-[0_0_20px_rgba(6,182,212,0.05)] md:col-span-2 lg:col-span-3' : 'border-slate-800'
                  }`}
                >
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex justify-between items-start border-b border-white/5 pb-3">
                      <div>
                        <span className="font-mono text-cyan-400 font-bold bg-cyan-950/40 border border-cyan-800/20 px-2 py-0.5 rounded text-[10px] select-none uppercase">
                          Gate: {gate.type}
                        </span>
                        <h3 className="text-lg font-bold text-slate-100 font-heading mt-1.5">{gate.name}</h3>
                      </div>
                      
                      {/* Difficulty badge */}
                      <div className="flex flex-col items-end gap-1 font-mono text-[9px]">
                        <span className={`px-2 py-0.5 rounded border font-semibold ${diffColors[gate.difficulty]}`}>
                          {gate.difficulty}
                        </span>
                        <span className="text-slate-500">{gate.readingTime} read</span>
                      </div>
                    </div>

                    {/* Explanations */}
                    <div className="text-xs leading-relaxed text-slate-300 space-y-2">
                      <div className="font-bold text-slate-400 uppercase text-[9px] font-mono tracking-wider">Purpose</div>
                      <p className="text-slate-100 font-semibold">{gate.purpose}</p>

                      <div className="font-bold text-slate-400 uppercase text-[9px] font-mono tracking-wider pt-1.5">Description</div>
                      <p>{isAdvanced ? gate.advancedExplanation : gate.simpleExplanation}</p>
                    </div>

                    {/* Advanced Math Box & usage details (Expanded view only) */}
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="border-t border-white/5 pt-4 space-y-4 text-xs"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          
                          {/* Left: Matrix block */}
                          <div className="space-y-1.5">
                            <span className="font-bold text-slate-400 uppercase text-[9px] font-mono tracking-wider block">
                              Unitary Matrix Operator
                            </span>
                            <div className="p-4 rounded-xl bg-slate-950 font-mono text-sm text-cyan-400 flex items-center justify-center border border-white/5 min-h-[80px]">
                              {gate.matrix}
                            </div>
                          </div>

                          {/* Right: Visual description */}
                          <div className="space-y-1.5">
                            <span className="font-bold text-slate-400 uppercase text-[9px] font-mono tracking-wider block">
                              Sphere Rotation Mechanics
                            </span>
                            <div className="p-3 rounded-xl bg-slate-900/30 border border-white/5 text-slate-300 leading-normal min-h-[80px]">
                              {gate.visualEffect}
                            </div>
                          </div>

                        </div>

                        {/* Real world use */}
                        <div className="p-3.5 rounded-xl bg-slate-950/40 border border-white/5 space-y-1">
                          <span className="font-bold text-slate-400 uppercase text-[9px] font-mono tracking-wider block">
                            Real-World Application
                          </span>
                          <p className="text-slate-300 leading-normal">{gate.realWorldUse}</p>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Toggle button */}
                  <div className="border-t border-white/5 pt-3 mt-4 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setExpandedGate(isExpanded ? null : gate.type)}
                      className="text-[10px] font-bold text-cyan-400 hover:text-cyan-300"
                    >
                      {isExpanded ? 'Collapse Details' : 'Expand Math & Matrix'}
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* =============================================================================
          TAB CONTENT: GLOSSARY
          ============================================================================= */}
      {activeTab === 'glossary' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-4">
            <div className="max-w-md text-left space-y-1">
              <h2 className="text-2xl font-bold font-heading">Quantum Dictionary</h2>
              <p className="text-xs text-slate-400 leading-normal">
                concise definitions of common terms. Search definitions on the fly.
              </p>
            </div>
            
            {/* Search Input bar */}
            <div className="relative w-full sm:w-64 max-w-xs">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 w-4 h-4" />
              <input
                type="text"
                placeholder="Search terms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-800 bg-slate-950/60 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/30"
              />
            </div>
          </div>

          {/* Dictionary Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredGlossary.map((item) => (
              <div
                key={item.term}
                className="p-4 rounded-xl border border-slate-800/80 bg-slate-900/10 hover:border-slate-800 transition-all space-y-1.5 text-xs text-left"
              >
                <div className="flex items-center gap-1.5">
                  <span className="font-heading font-extrabold text-sm text-cyan-400">{item.term}</span>
                  <span className="text-[9px] font-mono text-slate-600 bg-slate-900/60 px-1.5 py-0.5 rounded border border-white/5">
                    {isAdvanced ? 'Advanced' : 'Conceptual'}
                  </span>
                </div>
                
                <p className="text-slate-300 leading-relaxed">
                  {isAdvanced ? item.advanced : item.beginner}
                </p>
              </div>
            ))}

            {filteredGlossary.length === 0 && (
              <div className="col-span-1 md:col-span-2 text-center py-12 rounded-xl bg-slate-950/20 border border-slate-900 border-dashed">
                <Search className="w-8 h-8 text-slate-700 mx-auto mb-2" />
                <span className="text-xs text-slate-500 font-mono">No glossary definitions found for "{searchTerm}"</span>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
export default LearnPage;
