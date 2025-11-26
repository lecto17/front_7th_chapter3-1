import React from "react";
import { ThemeToggle } from "../ThemeToggle";

export const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between max-w-7xl mx-auto px-6">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold text-xl">
            L
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground leading-none">
              Hanghae Company
            </h1>
            <p className="text-[11px] text-muted-foreground leading-none mt-0.5">
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
            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-semibold text-base">
              DU
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
