import React from 'react';
import { ThemeToggle } from '@/components/ThemeToggle';

export const Header: React.FC = () => {
  return (
    <header className="border-b border-border bg-card">
      <div className="max-w-[1200px] mx-auto px-5 h-16 flex items-center justify-between">
        <h1 className="text-xl font-bold">Admin</h1>
        <ThemeToggle />
      </div>
    </header>
  );
};
