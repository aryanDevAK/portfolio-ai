import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Button } from './ShadcnUI';
import { PaletteIcon } from './IconComponents';
import { motion, AnimatePresence } from 'framer-motion';

const themeOptions = [
  { value: 'light', label: 'Light' },
  { value: 'paper', label: 'Paper' },
  { value: 'romantic', label: 'Romantic' },
  { value: 'night-blue', label: 'Night Blue' },
  { value: 'dark-forest', label: 'Dark Forest' },
  { value: 'matrix', label: 'Matrix' },
  { value: 'rose-pine', label: 'Rosé Pine' },
  { value: 'github-dark', label: 'GitHub Dark' },
];

const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle theme"
      >
        <PaletteIcon className="h-5 w-5" />
      </Button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute right-0 mt-2 w-48 origin-top-right rounded-md border bg-popover p-1 shadow-lg z-50 max-h-60 overflow-y-auto"
          >
            {themeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  setTheme(option.value as any);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-1.5 text-sm rounded-sm transition-colors ${
                  theme === option.value
                    ? 'bg-accent text-accent-foreground'
                    : 'hover:bg-accent/50'
                }`}
              >
                {option.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ThemeSwitcher;