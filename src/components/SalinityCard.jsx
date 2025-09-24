import React, { useState, useEffect } from "react";
import { Droplets, TrendingUp, Activity } from "lucide-react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const SalinityCard = () => {
  const [salinityData, setSalinityData] = useState([35.2]);
  const [currentSalinity, setCurrentSalinity] = useState(35.2);

  useEffect(() => {
    const interval = setInterval(() => {
      const newSalinity = 33 + Math.random() * 4; // Salinity between 33-37 PSU
      setSalinityData((prev) => [...prev.slice(-19), newSalinity]);
      setCurrentSalinity(newSalinity);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const options = {
    chart: {
      type: "line",
      backgroundColor: "transparent",
      height: 200,
    },
    title: { text: null },
    xAxis: {
      categories: salinityData.map((_, i) => i),
      labels: { style: { color: "#94a3b8", fontSize: "10px" } },
      gridLineColor: "#374151",
      lineColor: "#374151",
    },
    yAxis: {
      title: { text: "PSU", style: { color: "#94a3b8", fontSize: "12px" } },
      labels: { style: { color: "#94a3b8", fontSize: "10px" } },
      gridLineColor: "#374151",
      min: 30,
      max: 40,
    },
    series: [{
      name: "Salinity",
      data: salinityData,
      color: "#06b6d4",
      lineWidth: 3,
      marker: { enabled: false },
    }],
    credits: { enabled: false },
    legend: { enabled: false },
    plotOptions: {
      line: {
        animation: { duration: 500 }
      }
    }
  };

  const getSalinityStatus = (salinity) => {
    if (salinity < 34) return { status: "Low", color: "text-blue-400", bg: "bg-blue-500/20" };
    if (salinity > 36) return { status: "High", color: "text-cyan-400", bg: "bg-cyan-500/20" };
    return { status: "Normal", color: "text-green-400", bg: "bg-green-500/20" };
  };

  const salinityStatus = getSalinityStatus(currentSalinity);

  return (
    <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl border border-gray-600/30 rounded-2xl p-6 shadow-2xl hover:shadow-cyan-500/30 transition-all duration-300 hover:scale-[1.02] hover:border-cyan-500/20">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-500/20 rounded-lg">
            <Droplets className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-white font-bold text-lg">Salinity</h3>
            <p className="text-gray-400 text-sm">Salt Concentration</p>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full ${salinityStatus.bg} ${salinityStatus.color} text-sm font-medium`}>
          {salinityStatus.status}
        </div>
      </div>

      {/* Current Value */}
      <div className="mb-4">
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold text-white">{currentSalinity.toFixed(1)}</span>
          <span className="text-gray-400 text-lg">PSU</span>
          <TrendingUp className="w-5 h-5 text-green-400" />
        </div>
        <div className="flex items-center gap-2 mt-2">
          <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span className="text-gray-400 text-sm">Live Data Stream</span>
        </div>
      </div>

      {/* Chart */}
      <div className="h-48">
        <HighchartsReact highcharts={Highcharts} options={options} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-700">
        <div className="text-center">
          <div className="text-gray-400 text-xs">Min</div>
          <div className="text-white font-semibold">{Math.min(...salinityData).toFixed(1)} PSU</div>
        </div>
        <div className="text-center">
          <div className="text-gray-400 text-xs">Max</div>
          <div className="text-white font-semibold">{Math.max(...salinityData).toFixed(1)} PSU</div>
        </div>
        <div className="text-center">
          <div className="text-gray-400 text-xs">Avg</div>
          <div className="text-white font-semibold">{(salinityData.reduce((a, b) => a + b, 0) / salinityData.length).toFixed(1)} PSU</div>
        </div>
      </div>
    </div>
  );
};

export default SalinityCard;
