import React from 'react';

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
    <div className="grid grid-cols-[repeat(auto-fit,minmax(130px,1fr))] gap-2.5 mb-[15px]">
      {/* 전체 - 파란색 */}
      <div className="p-[12px_15px] bg-[#e3f2fd] dark:bg-blue-900/20 border-[1px] border-solid border-[#90caf9] dark:border-blue-800 rounded-[3px]">
        <div className="text-xs text-[#666] dark:text-muted-foreground mb-1">
          전체
        </div>
        <div className="text-2xl font-bold text-[#1976d2] dark:text-blue-400">
          {stats.total}
        </div>
      </div>

      {/* Stat1 - 초록색 */}
      <div className="p-[12px_15px] bg-[#e8f5e9] dark:bg-green-900/20 border-[1px] border-solid border-[#81c784] dark:border-green-800 rounded-[3px]">
        <div className="text-xs text-[#666] dark:text-muted-foreground mb-1">
          {stats.stat1.label}
        </div>
        <div className="text-2xl font-bold text-[#388e3c] dark:text-green-400">
          {stats.stat1.value}
        </div>
      </div>

      {/* Stat2 - 주황색 */}
      <div className="p-[12px_15px] bg-[#fff3e0] dark:bg-orange-900/20 border-[1px] border-solid border-[#ffb74d] dark:border-orange-800 rounded-[3px]">
        <div className="text-xs text-[#666] dark:text-muted-foreground mb-1">
          {stats.stat2.label}
        </div>
        <div className="text-2xl font-bold text-[#f57c00] dark:text-orange-400">
          {stats.stat2.value}
        </div>
      </div>

      {/* Stat3 - 빨간색 */}
      <div className="p-[12px_15px] bg-[#ffebee] dark:bg-red-900/20 border-[1px] border-solid border-[#e57373] dark:border-red-800 rounded-[3px]">
        <div className="text-xs text-[#666] dark:text-muted-foreground mb-1">
          {stats.stat3.label}
        </div>
        <div className="text-2xl font-bold text-[#d32f2f] dark:text-red-400">
          {stats.stat3.value}
        </div>
      </div>

      {/* Stat4 - 회색 */}
      <div className="p-[12px_15px] bg-[#f5f5f5] dark:bg-gray-800 border-[1px] border-solid border-[#bdbdbd] dark:border-gray-600 rounded-[3px]">
        <div className="text-xs text-[#666] dark:text-muted-foreground mb-1">
          {stats.stat4.label}
        </div>
        <div className="text-2xl font-bold text-[#424242] dark:text-gray-200">
          {stats.stat4.value}
        </div>
      </div>
    </div>
  );
};
