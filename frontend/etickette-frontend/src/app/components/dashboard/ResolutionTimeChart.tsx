"use client";

import { ResponsiveLine } from '@nivo/line';
import { useEffect, useState } from 'react';

type ResolutionDataPoint = {
  x: string; // "Aug 1", "Aug 2", ...
  y: number; // resolution time in hours
};

type LineChartData = {
  id: string;
  color?: string;
  data: ResolutionDataPoint[];
};

const generateDummyData = (): LineChartData[] => {
  const data: ResolutionDataPoint[] = [];

  for (let day = 1; day <= 30; day++) {
    const baseTime = 4 + Math.sin(day / 5) * 1.5;
    const randomVariation = (Math.random() - 0.5) * 2;
    const resolutionTime = Math.max(1, Math.round((baseTime + randomVariation) * 10) / 10);

    data.push({
      x: `Aug ${day}`,
      y: resolutionTime,
    });
  }

  return [
    {
      id: 'Resolution Time',
      data,
    },
  ];
};

export default function ResolutionTimeChart() {
  const [data, setData] = useState<LineChartData[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setData(generateDummyData());
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="bg-slate-700 p-6 rounded-xl text-white">
        <h3 className="text-lg font-semibold mb-4">Average Resolution Time</h3>
        <div className="h-64 flex items-center justify-center text-slate-400">
          Loading chart...
        </div>
      </div>
    );
  }

  const allValues = data[0].data.map(d => d.y);
  const average = (allValues.reduce((sum, val) => sum + val, 0) / allValues.length).toFixed(1);
  const min = Math.min(...allValues).toFixed(1);
  const max = Math.max(...allValues).toFixed(1);

  return (
    <div className="bg-slate-700 p-6 rounded-xl text-white">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Average Resolution Time</h3>
        <span className="text-sm text-slate-300">August 1-30, 2025</span>
      </div>

      <div className="h-64">
        <ResponsiveLine
          data={data}
          margin={{ top: 20, right: 20, bottom: 50, left: 50 }}
          xScale={{ type: 'point' }}
          yScale={{
            type: 'linear',
            min: 'auto',
            max: 'auto',
            stacked: false,
            reverse: false,
          }}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: -45,
            legend: 'Day',
            legendOffset: 36,
            legendPosition: 'middle',
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            legend: 'Hours',
            legendOffset: -40,
            legendPosition: 'middle',
          }}
          colors={{ scheme: 'category10' }}
          pointSize={6}
          pointColor={{ theme: 'background' }}
          pointBorderWidth={2}
          pointBorderColor={{ from: 'serieColor' }}
          pointLabelYOffset={-12}
          useMesh={true}
          enableGridX={false}
          theme={{
            text: {
              fill: '#ffffff',
            },
            axis: {
              ticks: {
                text: {
                  fill: '#94a3b8',
                  fontSize: 7,
                },
              },
              legend: {
                text: {
                  fill: '#94a3b8',
                },
              },
            },
            grid: {
              line: {
                stroke: '#475569',
                strokeWidth: 1,
              },
            },
            tooltip: {
              container: {
                background: '#1e293b',
                color: '#f8fafc',
                fontSize: 12,
              },
            },
          }}
        />
      </div>

      {/* Summary */}
      <div className="mt-4 flex justify-between text-sm">
        <div className="text-center">
          <div className="text-green-400 font-semibold">{min}h</div>
          <div className="text-slate-400">Best</div>
        </div>
        <div className="text-center">
          <div className="text-blue-400 font-semibold">{average}h</div>
          <div className="text-slate-400">Average</div>
        </div>
        <div className="text-center">
          <div className="text-red-400 font-semibold">{max}h</div>
          <div className="text-slate-400">Worst</div>
        </div>
      </div>
    </div>
  );
}
