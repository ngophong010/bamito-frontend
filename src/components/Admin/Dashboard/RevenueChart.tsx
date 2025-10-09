"use client";
import Chart from "@/components/Chart/Chart";

interface RevenueChartProps {
    chartData: number[];
    xLabels: number[];
}

// This is a "dumb" component. It just receives data and renders the chart.
const RevenueChart = ({ chartData, xLabels }: RevenueChartProps) => {
    return (
        <div className="chart-container">
            <h1 className="text">THỐNG KÊ DOANH THU</h1>
            <Chart chartData={chartData} xLabels={xLabels} />
        </div>
    );
};

export default RevenueChart;
