import React, { useState, useEffect } from "react";
import { Wind, TrendingUp, Activity } from "lucide-react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const OxygenCard = () => {
  const [oxygenData, setOxygenData] = useState([8.5]);
  const [currentOxygen, setCurrentOxygen] = useState(8.5);

  useEffect(() => {
    const interval = setInterval(() => {
      const newOxygen = 6 + Math.random() * 4; // Oxygen between 6-10 mg/L
      setOxygenData((prev) => [...prev.slice(-19), newOxygen]);
      setCurrentOxygen(newOxygen);
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
      categories: oxygenData.map((_, i) => i),
      labels: { style: { color: "#94a3b8", fontSize: "10px" } },
      gridLineColor: "#374151",
      lineColor: "#374151",
    },
    yAxis: {
      title: { text: "mg/L", style: { color: "#94a3b8", fontSize: "12px" } },
      labels: { style: { color: "#94a3b8", fontSize: "10px" } },
      gridLineColor: "#374151",
      min: 4,
      max: 12,
    },
    series: [{
      name: "Oxygen",
      data: oxygenData,
      color: "#10b981",
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

  const getOxygenStatus = (oxygen) => {
    if (oxygen < 6) return { status: "Low", color: "text-red-400", bg: "bg-red-500/20" };
    if (oxygen > 9) return { status: "High", color: "text-green-400", bg: "bg-green-500/20" };
    return { status: "Normal", color: "text-green-400", bg: "bg-green-500/20" };
  };

  const oxygenStatus = getOxygenStatus(currentOxygen);

  return (
    <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl border border-gray-600/30 rounded-2xl p-6 shadow-2xl hover:shadow-green-500/30 transition-all duration-300 hover:scale-[1.02] hover:border-green-500/20">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-500/20 rounded-lg">
            <Wind className="w-6 h-6 text-green-400" />
          </div>
          <div>
            <h3 className="text-white font-bold text-lg">Dissolved Oxygen</h3>
            <p className="text-gray-400 text-sm">Oxygen Levels</p>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full ${oxygenStatus.bg} ${oxygenStatus.color} text-sm font-medium`}>
          {oxygenStatus.status}
        </div>
      </div>

      {/* Current Value */}
      <div className="mb-4">
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold text-white">{currentOxygen.toFixed(1)}</span>
          <span className="text-gray-400 text-lg">mg/L</span>
          <TrendingUp className="w-5 h-5 text-green-400" />
        </div>
        <div className="flex items-center gap-2 mt-2">
          <Activity className="w-4 h-4 text-green-400 animate-pulse" />
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
          <div className="text-white font-semibold">{Math.min(...oxygenData).toFixed(1)} mg/L</div>
        </div>
        <div className="text-center">
          <div className="text-gray-400 text-xs">Max</div>
          <div className="text-white font-semibold">{Math.max(...oxygenData).toFixed(1)} mg/L</div>
        </div>
        <div className="text-center">
          <div className="text-gray-400 text-xs">Avg</div>
          <div className="text-white font-semibold">{(oxygenData.reduce((a, b) => a + b, 0) / oxygenData.length).toFixed(1)} mg/L</div>
        </div>
      </div>
    </div>
  );
};

export default OxygenCard;
