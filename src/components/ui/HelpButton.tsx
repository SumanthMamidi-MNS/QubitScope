import React, { useState, useRef, useEffect } from 'react';
import { HelpCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface HelpButtonProps {
  title: string;
  beginnerText: string;
  advancedText: string;
  isAdvanced: boolean;
}

export const HelpButton: React.FC<HelpButtonProps> = ({
  title,
  beginnerText,
  advancedText,
  isAdvanced,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close the popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative inline-block z-30" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1 rounded-full text-slate-500 hover:text-cyan-400 hover:bg-white/5 transition-all cursor-pointer select-none"
        title="Show context help"
      >
        <HelpCircle size={14} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className="absolute left-1/2 md:left-auto md:right-0 transform -translate-x-1/2 md:translate-x-0 mt-2 w-72 p-4 rounded-xl border border-cyan-500/20 bg-slate-950 shadow-2xl text-left pointer-events-auto backdrop-blur-md"
          >
            {/* Header */}
            <div className="flex justify-between items-center pb-1.5 border-b border-white/5 mb-2">
              <span className="text-xs font-heading font-extrabold text-cyan-400 uppercase tracking-wider">
                {title} Help
              </span>
              <button
                onClick={() => setIsOpen(false)}
                className="p-0.5 rounded hover:bg-white/5 text-slate-400 hover:text-white cursor-pointer"
              >
                <X size={12} />
              </button>
            </div>

            {/* Explanation Content */}
            <div className="space-y-2 text-xs leading-normal">
              <div>
                <span className="text-[10px] font-mono text-slate-500 block mb-0.5 uppercase tracking-wide">
                  {isAdvanced ? 'Advanced Explanation' : 'Conceptual Idea'}
                </span>
                <p className="text-slate-200">
                  {isAdvanced ? advancedText : beginnerText}
                </p>
              </div>

              {/* Explaining how to switch */}
              <div className="text-[9px] text-slate-500 font-mono border-t border-white/5 pt-1.5 mt-2">
                Toggle {isAdvanced ? 'Beginner' : 'Advanced'} mode in the navbar to change details.
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
export default HelpButton;
