import React, { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function Chart({ data }) {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    setChartData(data);
  }, [data]);

  useEffect(() => {
    ChartJS.register(
      {
        id: "valuePlugin",
        afterDraw: (chart) => {
          const ctx = chart.ctx;
          const xAxis = chart.scales.x;
          const yAxis = chart.scales.y;
          const datasets = chart.data.datasets;

          ctx.fillStyle = "white";
          ctx.textAlign = "center";
          ctx.textBaseline = "top";
          ctx.font = "bold 16px Arial bold";

          datasets.forEach((dataset, datasetIndex) => {
            const meta = chart.getDatasetMeta(datasetIndex);

            if (!meta.hidden) {
              meta.data.forEach((element, index) => {
                const value = dataset.data[index];
                const barX = element.x;
                const barY = element.y;
                const label = dataset.label;

                ctx.fillText(value, barX, barY + 5);
                ctx.fillText(label, barX, yAxis.bottom - 15); // Add label at the bottom
              });
            }
          });
        },
      },
      []
    );
  });

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
        text: "Paid and Owed",
      },
    },
    scales: {
      x: {
        display: false,
        grid: {
          display: false,
        },
      },
      y: {
        display: false,
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div
      style={{
        position: "relative",
        margin: "auto",
        height: "400px",
        width: "600px",
      }}
    >
      {chartData && <Bar data={chartData} options={options} />}
    </div>
  );
}

export default Chart;
