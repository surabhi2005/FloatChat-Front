import React, { useState, useEffect } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const LiveGraph = () => {
  const [data, setData] = useState([50]); // initial value at mid-range

  useEffect(() => {
    const interval = setInterval(() => {
      setData((prev) => [...prev.slice(-19), Math.random() * 100]); 
    }, 1000); // update every second
    return () => clearInterval(interval);
  }, []);

  const options = {
    chart: {
      type: "line",
      backgroundColor: "transparent",
      style: { fontFamily: "Inter, sans-serif" },
    },
    title: {
      text: "High Clarity Ocean Data Stream",
      style: { color: "#fff", fontSize: "18px" },
    },
    xAxis: {
      categories: data.map((_, i) => i),
      labels: { style: { color: "#aaa" } },
      gridLineColor: "#333",
    },
    yAxis: {
      title: { text: "Value", style: { color: "#aaa" } },
      labels: { style: { color: "#aaa" } },
      gridLineColor: "#333",
    },
    legend: {
      itemStyle: { color: "#fff", fontWeight: "bold" },
    },
    series: [
      {
        name: "Temperature (Red)",
        data: data.map((v) => v + 10),
        color: "red",
        lineWidth: 4, // thickness
      },
      {
        name: "Salinity (Green)",
        data: data.map((v) => 100 - v),
        color: "limegreen",
        lineWidth: 4,
      },
    ],
    credits: { enabled: false },
  };

  return (
    <div className="p-6 rounded-2xl shadow-xl bg-opacity-30 backdrop-blur-lg border border-gray-700">
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default LiveGraph;
