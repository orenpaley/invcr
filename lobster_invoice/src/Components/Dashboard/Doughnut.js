import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement } from "chart.js/auto"; // Import the Chart class

function DoughnutChart({ statusToAmount }) {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    Chart.register(ArcElement); // Register the ArcElement before rendering

    const dataForRender = {
      labels: ["Paid", "Sent", "Created", "Overdue"],
      datasets: [
        {
          data: Object.values(statusToAmount),
          backgroundColor: ["lightgreen", "lightyellow", "lightblue", "tomato"],
          borderColor: ["lightgreen", "lightyellow", "lightblue", "tomato"],
          borderWidth: 1,
        },
      ],
    };
    setChartData(dataForRender);
  }, [statusToAmount]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false, // Hide the legend
      },
      title: {
        display: false,
        text: "",
      },
      tooltip: {
        enabled: true, // Enable tooltips to display data labels on hover
      },
      doughnut: {
        cutout: "80%", // Reduce the cutout size to create the donut hole
        text: "", // Set the center text to an empty string to hide the labels
      },
    },
    scales: {
      y: {
        display: false,
      },
    },
    onElementsClick: () => {}, // Disable creating multiple chart instances
  };

  return (
    <div
      style={{
        position: "relative",
        margin: "auto",
        height: "250px",
        width: "250px",
      }}
    >
      {chartData && <Doughnut data={chartData} options={options} />}
    </div>
  );
}

export default DoughnutChart;
