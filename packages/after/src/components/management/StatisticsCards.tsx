import React from "react";

interface StatisticsCardsProps {
  stats: {
    total: number;
    stat1: { label: string; value: number };
    stat2: { label: string; value: number };
    stat3: { label: string; value: number };
    stat4: { label: string; value: number };
  };
}

export const StatisticsCards: React.FC<StatisticsCardsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(130px,1fr))] gap-2.5 mb-4">
      <div className="p-3 rounded bg-primary-light border border-primary-light-border">
        <div className="text-xs mb-1 text-muted-foreground">전체</div>
        <div className="text-2xl font-bold text-primary">{stats.total}</div>
      </div>

      <div className="p-3 rounded bg-success-light border border-success-light-border">
        <div className="text-xs mb-1 text-muted-foreground">
          {stats.stat1.label}
        </div>
        <div className="text-2xl font-bold text-success">
          {stats.stat1.value}
        </div>
      </div>

      <div className="p-3 rounded bg-warning-light border border-warning-light-border">
        <div className="text-xs mb-1 text-muted-foreground">
          {stats.stat2.label}
        </div>
        <div className="text-2xl font-bold text-warning">
          {stats.stat2.value}
        </div>
      </div>

      <div className="p-3 rounded bg-destructive-light border border-destructive-light-border">
        <div className="text-xs mb-1 text-muted-foreground">
          {stats.stat3.label}
        </div>
        <div className="text-2xl font-bold text-destructive">
          {stats.stat3.value}
        </div>
      </div>

      <div className="p-3 rounded bg-muted border border-border">
        <div className="text-xs mb-1 text-muted-foreground">
          {stats.stat4.label}
        </div>
        <div className="text-2xl font-bold text-foreground">
          {stats.stat4.value}
        </div>
      </div>
    </div>
  );
};
