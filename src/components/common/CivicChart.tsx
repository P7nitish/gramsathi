import React, { useState } from 'react';

// Bar Chart
export interface BarChartItem {
  label: string;
  value: number;
  color?: string;
}

export const CivicBarChart: React.FC<{
  data: BarChartItem[];
  title?: string;
  unit?: string;
  height?: number;
}> = ({ data, title, unit = "issues", height = 240 }) => {
  const [activeItem, setActiveItem] = useState<BarChartItem | null>(null);
  const maxValue = Math.max(...data.map(d => d.value), 1);

  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs">
      {title && (
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-bold text-[#0B1B2B]">{title}</h4>
          {activeItem && (
            <span className="text-xs font-semibold text-[#1B5E3A] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
              {activeItem.label}: {activeItem.value} {unit}
            </span>
          )}
        </div>
      )}

      <div className="flex items-end gap-3 pt-6 pb-2" style={{ height: `${height}px` }}>
        {data.map((item, idx) => {
          const heightPercent = Math.round((item.value / maxValue) * 100);
          const color = item.color || "#1B5E3A";

          return (
            <div
              key={idx}
              className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer"
              onMouseEnter={() => setActiveItem(item)}
              onMouseLeave={() => setActiveItem(null)}
              tabIndex={0}
              role="button"
              aria-label={`${item.label}: ${item.value} ${unit}`}
            >
              <span className="text-[11px] font-bold text-slate-600 mb-1 opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity">
                {item.value}
              </span>
              <div className="w-full bg-slate-100 rounded-t-md relative flex items-end h-[180px]">
                <div
                  style={{
                    height: `${heightPercent}%`,
                    backgroundColor: color
                  }}
                  className="w-full rounded-t-md transition-all duration-300 group-hover:opacity-90 shadow-xs"
                />
              </div>
              <span className="text-[11px] text-[#5A6B7B] mt-2 font-medium truncate w-full text-center">
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Donut Chart
export interface DonutItem {
  label: string;
  value: number;
  color: string;
}

export const CivicDonutChart: React.FC<{
  data: DonutItem[];
  title?: string;
  centerLabel?: string;
  centerSub?: string;
}> = ({ data, title, centerLabel, centerSub }) => {
  const [activeItem, setActiveItem] = useState<DonutItem | null>(null);
  const total = data.reduce((acc, cur) => acc + cur.value, 0) || 1;

  // SVG calculations
  const size = 200;
  const strokeWidth = 28;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPercent = 0;

  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs">
      {title && <h4 className="text-sm font-bold text-[#0B1B2B] mb-4">{title}</h4>}

      <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
        <div className="relative w-[180px] h-[180px] shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox={`0 0 ${size} ${size}`}>
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="transparent"
              stroke="#F1F5F9"
              strokeWidth={strokeWidth}
            />
            {data.map((item, idx) => {
              const percent = item.value / total;
              const strokeDasharray = `${percent * circumference} ${circumference}`;
              const strokeDashoffset = -(accumulatedPercent * circumference);
              accumulatedPercent += percent;

              return (
                <circle
                  key={idx}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="transparent"
                  stroke={item.color}
                  strokeWidth={strokeWidth}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-300 hover:opacity-80 cursor-pointer"
                  onMouseEnter={() => setActiveItem(item)}
                  onMouseLeave={() => setActiveItem(null)}
                />
              );
            })}
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-4">
            <span className="text-xl font-bold font-heading text-[#0B1B2B]">
              {activeItem ? activeItem.value : (centerLabel || total)}
            </span>
            <span className="text-[10px] text-[#5A6B7B] uppercase tracking-wider font-semibold">
              {activeItem ? activeItem.label : (centerSub || "Total")}
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-col gap-2 w-full max-w-[180px]">
          {data.map((item, idx) => {
            const pct = Math.round((item.value / total) * 100);
            return (
              <div
                key={idx}
                onMouseEnter={() => setActiveItem(item)}
                onMouseLeave={() => setActiveItem(null)}
                className={`flex items-center justify-between p-1.5 rounded-md cursor-pointer transition-colors ${activeItem?.label === item.label ? 'bg-slate-100' : ''}`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-sm shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-xs text-[#0B1B2B] font-medium">{item.label}</span>
                </div>
                <span className="text-xs font-semibold text-slate-500">{pct}%</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Line / Trend Chart
export interface TrendPoint {
  month: string;
  reported: number;
  resolved: number;
}

export const CivicTrendChart: React.FC<{
  data: TrendPoint[];
  title?: string;
  height?: number;
}> = ({ data, title, height = 220 }) => {
  const maxVal = Math.max(...data.map(d => Math.max(d.reported, d.resolved)), 10);
  const width = 500;
  const paddingX = 40;
  const paddingY = 25;
  const graphWidth = width - paddingX * 2;
  const graphHeight = height - paddingY * 2;

  const pointsReported = data.map((d, i) => {
    const x = paddingX + (i / (data.length - 1)) * graphWidth;
    const y = height - paddingY - (d.reported / maxVal) * graphHeight;
    return `${x},${y}`;
  }).join(' ');

  const pointsResolved = data.map((d, i) => {
    const x = paddingX + (i / (data.length - 1)) * graphWidth;
    const y = height - paddingY - (d.resolved / maxVal) * graphHeight;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs">
      {title && (
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-bold text-[#0B1B2B]">{title}</h4>
          <div className="flex items-center gap-4 text-xs font-medium text-slate-600">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-1 bg-[#1565C0] rounded" />
              <span>Reported</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-1 bg-[#1E8E5A] rounded" />
              <span>Resolved</span>
            </div>
          </div>
        </div>
      )}

      <div className="w-full overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full min-w-[320px] h-auto">
          {/* Horizontal grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct, idx) => {
            const y = height - paddingY - pct * graphHeight;
            return (
              <g key={idx}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={width - paddingX}
                  y2={y}
                  stroke="#E2E8F0"
                  strokeDasharray="3 3"
                />
                <text
                  x={paddingX - 8}
                  y={y + 4}
                  fill="#94A3B8"
                  fontSize="10"
                  textAnchor="end"
                >
                  {Math.round(pct * maxVal)}
                </text>
              </g>
            );
          })}

          {/* Polyline for Reported */}
          <polyline
            fill="none"
            stroke="#1565C0"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={pointsReported}
          />

          {/* Polyline for Resolved */}
          <polyline
            fill="none"
            stroke="#1E8E5A"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={pointsResolved}
          />

          {/* Dots & Labels */}
          {data.map((d, i) => {
            const x = paddingX + (i / (data.length - 1)) * graphWidth;
            const yRep = height - paddingY - (d.reported / maxVal) * graphHeight;
            const yRes = height - paddingY - (d.resolved / maxVal) * graphHeight;

            return (
              <g key={i}>
                <circle cx={x} cy={yRep} r="4" fill="#1565C0" />
                <circle cx={x} cy={yRes} r="4" fill="#1E8E5A" />
                <text
                  x={x}
                  y={height - 6}
                  fill="#64748B"
                  fontSize="10"
                  textAnchor="middle"
                >
                  {d.month}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};
