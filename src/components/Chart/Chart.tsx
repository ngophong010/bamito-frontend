"use client";
import React from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { Box } from '@mui/material'; // Use MUI's Box for styling consistency

import "./Chart.scss";

// 1. Define the props interface for strong typing
interface ChartProps {
  // An array of numbers for the y-axis values
  chartData: number[];
  // An array of numbers or strings for the x-axis labels
  xLabels: (string | number)[];
  width?: number; // Make dimensions optional with defaults
  height?: number;
}

const Chart = ({
  chartData,
  xLabels,
  width = 1200, // Provide sensible defaults
  height = 550,
}: ChartProps) => {
  
  // Return null or a placeholder if there's no data to render
  if (!chartData || chartData.length === 0) {
    return (
        <Box sx={{ width, height, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p>No data available for this period.</p>
        </Box>
    );
  }

  return (
    // 2. The component is now just the BarChart itself.
    // The parent can wrap it in a div if needed.
    <BarChart
      width={width}
      height={height}
      series={[
        { 
          data: chartData,
          id: "revenueId",
          label: "Doanh thu (VND)" // Add a label for clarity
        }
      ]}
      xAxis={[{ 
        data: xLabels,
        scaleType: "band",
        label: "Tháng" // Add an axis label
      }]}
      // Add a y-axis for better readability
      yAxis={[{
          label: "Doanh thu (VND)"
      }]}
      sx={{
          // You can add styling directly to the chart component
          '.MuiChartsAxis-label': {
              fontSize: '1.4rem',
              fontWeight: '500'
          }
      }}
    />
  );
};

export default Chart;
