import React from 'react';
import { ThemeToggle } from '../ThemeToggle';

export const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 w-full bg-background border-b border-border shadow-sm">
      <div className="flex h-16 items-center justify-between mx-auto px-[var(--spacing-6)] max-w-[1400px]">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xl bg-[#007bff] text-white">
            L
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground leading-none font-sans">
              Hanghae Company
            </h1>
            <p className="text-[11px] text-muted-foreground leading-none mt-0.5 font-sans">
              Design System Migration Project
            </p>
          </div>
        </div>

        {/* Right side: Theme Toggle + User Info */}
        <div className="flex items-center gap-4">
          <ThemeToggle />

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-sm font-semibold text-foreground">
                Demo User
              </div>
              <div className="text-xs text-muted-foreground">
                demo@example.com
              </div>
            </div>
            <div className="w-10 h-10 rounded-full flex items-center justify-center font-semibold text-base bg-[var(--blue-50)] text-[#007bff]">
              DU
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
