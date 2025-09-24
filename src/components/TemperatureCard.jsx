import React, { useState, useEffect } from "react";
import { Thermometer, TrendingUp, Activity } from "lucide-react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const TemperatureCard = () => {
  const [temperatureData, setTemperatureData] = useState([22.5]);
  const [currentTemp, setCurrentTemp] = useState(22.5);

  useEffect(() => {
    const interval = setInterval(() => {
      const newTemp = 20 + Math.random() * 10; // Temperature between 20-30°C
      setTemperatureData((prev) => [...prev.slice(-19), newTemp]);
      setCurrentTemp(newTemp);
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
      categories: temperatureData.map((_, i) => i),
      labels: { style: { color: "#94a3b8", fontSize: "10px" } },
      gridLineColor: "#374151",
      lineColor: "#374151",
    },
    yAxis: {
      title: { text: "°C", style: { color: "#94a3b8", fontSize: "12px" } },
      labels: { style: { color: "#94a3b8", fontSize: "10px" } },
      gridLineColor: "#374151",
      min: 15,
      max: 35,
    },
    series: [{
      name: "Temperature",
      data: temperatureData,
      color: "#ef4444",
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

  const getTempStatus = (temp) => {
    if (temp < 22) return { status: "Cold", color: "text-blue-400", bg: "bg-blue-500/20" };
    if (temp > 28) return { status: "Hot", color: "text-red-400", bg: "bg-red-500/20" };
    return { status: "Normal", color: "text-green-400", bg: "bg-green-500/20" };
  };

  const tempStatus = getTempStatus(currentTemp);

  return (
    <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl border border-gray-600/30 rounded-2xl p-6 shadow-2xl hover:shadow-red-500/30 transition-all duration-300 hover:scale-[1.02] hover:border-red-500/20">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-500/20 rounded-lg">
            <Thermometer className="w-6 h-6 text-red-400" />
          </div>
          <div>
            <h3 className="text-white font-bold text-lg">Temperature</h3>
            <p className="text-gray-400 text-sm">Ocean Surface</p>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full ${tempStatus.bg} ${tempStatus.color} text-sm font-medium`}>
          {tempStatus.status}
        </div>
      </div>

      {/* Current Value */}
      <div className="mb-4">
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold text-white">{currentTemp.toFixed(1)}</span>
          <span className="text-gray-400 text-lg">°C</span>
          <TrendingUp className="w-5 h-5 text-green-400" />
        </div>
        <div className="flex items-center gap-2 mt-2">
          <Activity className="w-4 h-4 text-red-400 animate-pulse" />
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
          <div className="text-white font-semibold">{Math.min(...temperatureData).toFixed(1)}°C</div>
        </div>
        <div className="text-center">
          <div className="text-gray-400 text-xs">Max</div>
          <div className="text-white font-semibold">{Math.max(...temperatureData).toFixed(1)}°C</div>
        </div>
        <div className="text-center">
          <div className="text-gray-400 text-xs">Avg</div>
          <div className="text-white font-semibold">{(temperatureData.reduce((a, b) => a + b, 0) / temperatureData.length).toFixed(1)}°C</div>
        </div>
      </div>
    </div>
  );
};

export default TemperatureCard;
