import { useState, useEffect } from 'react';
import { OnboardingGuide } from './components/ui/OnboardingGuide';
import { LandingPage } from './pages/LandingPage';
import { SimulatorPage } from './pages/SimulatorPage';
import { LearnPage } from './pages/LearnPage';
import { AboutPage } from './pages/AboutPage';
import { Menu, X, Atom, BookOpen, Layers, Info, HelpCircle, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SettingsPanel } from './components/ui/SettingsPanel';
import { DocModal } from './components/ui/DocModal';

type Page = 'home' | 'simulator' | 'learn' | 'about';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [docsOpen, setDocsOpen] = useState(false);

  // Educational level mode selection (Beginner vs. Advanced)
  const [isAdvanced, setIsAdvanced] = useState<boolean>(() => {
    return localStorage.getItem('qubitscope_is_advanced') === 'true';
  });

  // Onboarding tutorial overlay guide state
  const [guideOpen, setGuideOpen] = useState(false);

  // User settings configuration (Animation speed, pole labels, grid lines)
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('qubitscope_settings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return {
      animationSpeed: 1.0,
      showLabels: true,
      showGrid: true,
    };
  });

  const handleUpdateSettings = (newSettings: typeof settings) => {
    setSettings(newSettings);
    localStorage.setItem('qubitscope_settings', JSON.stringify(newSettings));
  };

  const [settingsOpen, setSettingsOpen] = useState(false);

  // Trigger onboarding automatically on first visit
  useEffect(() => {
    const onboarded = localStorage.getItem('qubitscope_onboarded');
    if (!onboarded) {
      setGuideOpen(true);
      localStorage.setItem('qubitscope_onboarded', 'true');
    }
  }, []);

  const navigateTo = (page: Page) => {
    setCurrentPage(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDocClick = () => {
    setDocsOpen(true);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <LandingPage onNavigate={navigateTo} />;
      case 'simulator':
        return <SimulatorPage isAdvanced={isAdvanced} settings={settings} />;
      case 'learn':
        return <LearnPage isAdvanced={isAdvanced} onNavigate={navigateTo} />;
      case 'about':
        return <AboutPage />;
      default:
        return <LandingPage onNavigate={navigateTo} />;
    }
  };

  return (
    <div className="min-h-screen bg-quantum-bg flex flex-col relative text-slate-300 antialiased selection:bg-cyan-500/20 selection:text-cyan-400">
      
      {/* Background abstract glowing shapes */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/5 rounded-full filter blur-3xl pointer-events-none select-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-indigo-500/5 rounded-full filter blur-3xl pointer-events-none select-none" />

      {/* =============================================================================
          NAVIGATION / HEADER
          ============================================================================= */}
      <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-quantum-bg/85 backdrop-blur-md transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo brand */}
          <div
            onClick={() => navigateTo('home')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="p-2 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-slate-950 font-bold shadow-md shadow-cyan-500/10 group-hover:scale-105 transition-all">
              <Atom size={20} className="animate-spin-slow" />
            </div>
            <div className="flex flex-col text-left">
              <span className="font-heading font-extrabold text-sm tracking-wide text-slate-100 uppercase leading-none">
                QubitScope
              </span>
              <span className="text-[9px] font-mono text-cyan-400 tracking-widest mt-0.5 leading-none">
                SIMULATOR
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 font-heading text-xs">
            <button
              onClick={() => navigateTo('home')}
              className={`px-3 py-2 rounded-md font-semibold cursor-pointer transition-colors ${
                currentPage === 'home'
                  ? 'text-cyan-400 bg-white/5'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/2'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => navigateTo('simulator')}
              className={`px-3 py-2 rounded-md font-semibold cursor-pointer transition-colors ${
                currentPage === 'simulator'
                  ? 'text-cyan-400 bg-white/5'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/2'
              }`}
            >
              Simulator
            </button>
            <button
              onClick={() => navigateTo('learn')}
              className={`px-3 py-2 rounded-md font-semibold cursor-pointer transition-colors ${
                currentPage === 'learn'
                  ? 'text-cyan-400 bg-white/5'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/2'
              }`}
            >
              Learn
            </button>
            <button
              onClick={handleDocClick}
              className="px-3 py-2 rounded-md font-semibold text-slate-400 hover:text-slate-200 hover:bg-white/2 transition-colors cursor-pointer"
            >
              Docs
            </button>
            <button
              onClick={() => navigateTo('about')}
              className={`px-3 py-2 rounded-md font-semibold cursor-pointer transition-colors ${
                currentPage === 'about'
                  ? 'text-cyan-400 bg-white/5'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/2'
              }`}
            >
              About
            </button>
          </nav>

          {/* Mode Switcher & Guide Launcher */}
          <div className="hidden md:flex items-center">
            {/* Beginner/Advanced Level Switcher */}
            <div className="flex bg-slate-950/60 p-0.5 rounded-lg border border-white/5 ml-4 font-mono text-[9px] items-center shrink-0">
              <button
                onClick={() => {
                  setIsAdvanced(false);
                  localStorage.setItem('qubitscope_is_advanced', 'false');
                }}
                className={`px-2 py-1 rounded font-bold cursor-pointer transition-all ${
                  !isAdvanced
                    ? 'bg-blue-600 text-slate-100 shadow-sm'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                Beginner
              </button>
              <button
                onClick={() => {
                  setIsAdvanced(true);
                  localStorage.setItem('qubitscope_is_advanced', 'true');
                }}
                className={`px-2 py-1 rounded font-bold cursor-pointer transition-all ${
                  isAdvanced
                    ? 'bg-blue-600 text-slate-100 shadow-sm'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                Advanced
              </button>
            </div>

            {/* Quick Tutorial Trigger */}
            <button
              onClick={() => setGuideOpen(true)}
              className="flex items-center gap-1.5 ml-3 px-3 py-1.5 rounded-lg border border-cyan-500/25 text-cyan-400 bg-cyan-950/15 hover:bg-cyan-950/30 text-[10px] font-mono font-bold cursor-pointer transition-all shadow"
              title="Restart tutorial onboarding guide"
            >
              <HelpCircle size={12} />
              Guide
            </button>

            {/* Settings cog Button */}
            <button
              onClick={() => setSettingsOpen(true)}
              className="flex items-center justify-center ml-2 p-2 rounded-lg border border-slate-800 bg-slate-950/20 text-slate-400 hover:text-white hover:border-slate-700 transition-all shadow cursor-pointer select-none"
              title="Open settings panel"
            >
              <Settings size={14} className="hover:rotate-45 transition-transform" />
            </button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/5 cursor-pointer"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Menu overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-b border-white/5 bg-quantum-bg-light/95 backdrop-blur-md absolute top-16 left-0 w-full z-45 overflow-hidden shadow-2xl"
          >
            <nav className="flex flex-col p-4 gap-1.5 font-heading text-sm">
              <button
                onClick={() => navigateTo('home')}
                className={`flex items-center gap-2.5 px-4 py-3 rounded-lg text-left font-semibold cursor-pointer ${
                  currentPage === 'home' ? 'bg-cyan-500/10 text-cyan-400' : 'text-slate-400'
                }`}
              >
                <Atom size={16} /> Home
              </button>
              <button
                onClick={() => navigateTo('simulator')}
                className={`flex items-center gap-2.5 px-4 py-3 rounded-lg text-left font-semibold cursor-pointer ${
                  currentPage === 'simulator' ? 'bg-cyan-500/10 text-cyan-400' : 'text-slate-400'
                }`}
              >
                <Layers size={16} /> Simulator
              </button>
              <button
                onClick={() => navigateTo('learn')}
                className={`flex items-center gap-2.5 px-4 py-3 rounded-lg text-left font-semibold cursor-pointer ${
                  currentPage === 'learn' ? 'bg-cyan-500/10 text-cyan-400' : 'text-slate-400'
                }`}
              >
                <BookOpen size={16} /> Learn
              </button>
              <button
                onClick={handleDocClick}
                className="flex items-center gap-2.5 px-4 py-3 rounded-lg text-slate-400 text-left font-semibold cursor-pointer hover:bg-white/5"
              >
                <HelpCircle size={16} /> Docs
              </button>
              <button
                onClick={() => navigateTo('about')}
                className={`flex items-center gap-2.5 px-4 py-3 rounded-lg text-left font-semibold cursor-pointer ${
                  currentPage === 'about' ? 'bg-cyan-500/10 text-cyan-400' : 'text-slate-400'
                }`}
              >
                <Info size={16} /> About
              </button>
              
              {/* Mobile Mode Switcher & Guide triggers */}
              <div className="border-t border-white/5 pt-3 mt-1.5 px-4 flex flex-col gap-3 font-mono text-[10px]">
                <div className="flex justify-between items-center text-slate-400">
                  <span>EDUCATIONAL LEVEL:</span>
                  <div className="flex bg-slate-950 p-0.5 rounded-lg border border-white/5">
                    <button
                      onClick={() => {
                        setIsAdvanced(false);
                        localStorage.setItem('qubitscope_is_advanced', 'false');
                      }}
                      className={`px-2.5 py-1 rounded font-bold transition-all ${
                        !isAdvanced ? 'bg-blue-600 text-slate-100' : 'text-slate-500'
                      }`}
                    >
                      Beginner
                    </button>
                    <button
                      onClick={() => {
                        setIsAdvanced(true);
                        localStorage.setItem('qubitscope_is_advanced', 'true');
                      }}
                      className={`px-2.5 py-1 rounded font-bold transition-all ${
                        isAdvanced ? 'bg-blue-600 text-slate-100' : 'text-slate-500'
                      }`}
                    >
                      Advanced
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setGuideOpen(true);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 rounded-lg border border-cyan-500/20 text-cyan-400 bg-cyan-950/10 font-bold flex items-center justify-center gap-1.5 hover:bg-cyan-950/20 cursor-pointer"
                >
                  <HelpCircle size={14} />
                  Launch Onboarding Guide
                </button>

                <button
                  onClick={() => {
                    setSettingsOpen(true);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 rounded-lg border border-slate-800 bg-slate-950/20 text-slate-400 hover:text-white hover:border-slate-700 transition-all font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Settings size={14} />
                  Settings Panel
                </button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Doc Notice Toast removed since DocModal is integrated */}

      {/* =============================================================================
          MAIN CONTENT VIEW
          ============================================================================= */}
      <main className="flex-grow">
        {renderPage()}
      </main>

      {/* =============================================================================
          FOOTER
          ============================================================================= */}
      <footer className="w-full border-t border-white/5 bg-slate-950/20 py-6 text-[11px] text-slate-500 font-mono select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Atom size={14} className="text-cyan-500" />
            <span>QubitScope v1.0.0</span>
          </div>
          <div>
            <span>© {new Date().getFullYear()} QubitScope. All rights reserved.</span>
          </div>
        </div>
      </footer>

      {/* Onboarding Stepper Guide Overlay */}
      <OnboardingGuide isOpen={guideOpen} onClose={() => setGuideOpen(false)} />

      {/* Settings Configuration Modal Panel */}
      <SettingsPanel
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        onReplayGuide={() => setGuideOpen(true)}
      />

      {/* Reference & Documentation Modal Sheet */}
      <DocModal
        isOpen={docsOpen}
        onClose={() => setDocsOpen(false)}
      />
    </div>
  );
}

export default App;
