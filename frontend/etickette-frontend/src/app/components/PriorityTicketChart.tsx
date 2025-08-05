"use client";

import { ResponsiveBar } from "@nivo/bar";

const data = [
  {
    priority: "Low",
    total: 20,
    resolved: 15,
  },
  {
    priority: "Medium",
    total: 35,
    resolved: 30,
  },
  {
    priority: "High",
    total: 25,
    resolved: 20,
  },
  {
    priority: "Critical",
    total: 10,
    resolved: 5,
  },
];

const keys = ["resolved", "total"];

export default function PriorityTicketChart() {
  return (
    <div className="bg-slate-700 p-6 rounded-xl text-white h-[400px]">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Tickets by Priority</h3>
      </div>

      <ResponsiveBar
        data={data}
        keys={keys}
        indexBy="priority"
        margin={{ top: 50, right: 30, bottom: 100, left: 50 }}
        padding={0.4}
        groupMode="stacked"
        colors={["#10b981", "#3b82f6"]} // resolved, total
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor="#ffffff"
        theme={{
          axis: {
            ticks: {
              text: {
                fill: "#cbd5e1",
                fontSize: 12,
              },
            },
            legend: {
              text: {
                fill: "#cbd5e1",
              },
            },
          },
          legends: {
            text: {
              fill: "#f1f5f9",
            },
          },
          tooltip: {
            container: {
              background: "#1e293b",
              color: "#f8fafc",
              fontSize: 12,
            },
          },
        }}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "Priority",
          legendPosition: "middle",
          legendOffset: 36,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "Tickets",
          legendPosition: "middle",
          legendOffset: -40,
        }}
        legends={[
          {
            dataFrom: "keys",
            anchor: "top",
            direction: "row",
            justify: false,
            translateY: -20,
            itemsSpacing: 16,
            itemWidth: 80,
            itemHeight: 18,
            itemDirection: "left-to-right",
            symbolSize: 12,
            effects: [
              {
                on: "hover",
                style: {
                  itemTextColor: "#fff",
                },
              },
            ],
          },
        ]}
        role="application"
        ariaLabel="Stacked bar chart showing ticket stats"
        barAriaLabel={function (e) {
          return `${e.id}: ${e.formattedValue} in priority ${e.indexValue}`;
        }}
      />
    </div>
  );
}
