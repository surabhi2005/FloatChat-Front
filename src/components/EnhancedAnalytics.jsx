import React, { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, Activity, AlertTriangle, CheckCircle, BarChart3, PieChart, LineChart } from "lucide-react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import oceanData from "../data/oceanData";

const EnhancedAnalytics = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('daily');
  const [selectedParameter, setSelectedParameter] = useState('temperature');
  const [liveData, setLiveData] = useState({});

  useEffect(() => {
    // Simulate live data updates
    const interval = setInterval(() => {
      setLiveData({
        temperature: 20 + Math.random() * 10,
        salinity: 33 + Math.random() * 4,
        oxygen: 6 + Math.random() * 4,
        ph: 7.5 + Math.random() * 1,
        turbidity: Math.random() * 20
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getParameterInfo = (param) => {
    const params = {
      temperature: { name: 'Temperature', unit: '°C', color: '#ef4444', icon: '🌡️' },
      salinity: { name: 'Salinity', unit: 'PSU', color: '#06b6d4', icon: '💧' },
      oxygen: { name: 'Oxygen', unit: 'mg/L', color: '#10b981', icon: '💨' },
      ph: { name: 'pH', unit: 'pH', color: '#8b5cf6', icon: '🧪' },
      turbidity: { name: 'Turbidity', unit: 'NTU', color: '#f59e0b', icon: '🌊' }
    };
    return params[param] || params.temperature;
  };

  const getStatusColor = (value, param) => {
    const ranges = {
      temperature: { good: [22, 28], warning: [20, 30] },
      salinity: { good: [34, 36], warning: [33, 37] },
      oxygen: { good: [6, 9], warning: [4, 12] },
      ph: { good: [7.8, 8.2], warning: [7.5, 8.5] },
      turbidity: { good: [1, 10], warning: [0, 20] }
    };
    
    const range = ranges[param];
    if (value >= range.good[0] && value <= range.good[1]) return 'text-green-400';
    if (value >= range.warning[0] && value <= range.warning[1]) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getStatusIcon = (value, param) => {
    const ranges = {
      temperature: { good: [22, 28], warning: [20, 30] },
      salinity: { good: [34, 36], warning: [33, 37] },
      oxygen: { good: [6, 9], warning: [4, 12] },
      ph: { good: [7.8, 8.2], warning: [7.5, 8.5] },
      turbidity: { good: [1, 10], warning: [0, 20] }
    };
    
    const range = ranges[param];
    if (value >= range.good[0] && value <= range.good[1]) return <CheckCircle className="w-4 h-4 text-green-400" />;
    if (value >= range.warning[0] && value <= range.warning[1]) return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
    return <AlertTriangle className="w-4 h-4 text-red-400" />;
  };

  const chartOptions = {
    chart: {
      type: 'line',
      backgroundColor: 'transparent',
      height: 300
    },
    title: { text: null },
    xAxis: {
      categories: Array.from({ length: 20 }, (_, i) => i),
      labels: { style: { color: '#94a3b8', fontSize: '10px' } },
      gridLineColor: '#374151'
    },
    yAxis: {
      title: { text: getParameterInfo(selectedParameter).unit, style: { color: '#94a3b8' } },
      labels: { style: { color: '#94a3b8', fontSize: '10px' } },
      gridLineColor: '#374151'
    },
    series: [{
      name: getParameterInfo(selectedParameter).name,
      data: Array.from({ length: 20 }, () => liveData[selectedParameter] || 0),
      color: getParameterInfo(selectedParameter).color,
      lineWidth: 3,
      marker: { enabled: false }
    }],
    credits: { enabled: false },
    legend: { enabled: false }
  };

  const parameterCards = [
    { key: 'temperature', label: 'Temperature', value: liveData.temperature?.toFixed(1) || '--', unit: '°C' },
    { key: 'salinity', label: 'Salinity', value: liveData.salinity?.toFixed(1) || '--', unit: 'PSU' },
    { key: 'oxygen', label: 'Oxygen', value: liveData.oxygen?.toFixed(1) || '--', unit: 'mg/L' },
    { key: 'ph', label: 'pH', value: liveData.ph?.toFixed(1) || '--', unit: 'pH' },
    { key: 'turbidity', label: 'Turbidity', value: liveData.turbidity?.toFixed(1) || '--', unit: 'NTU' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Ocean Analytics Dashboard</h2>
        <p className="text-gray-400">Comprehensive ocean data analysis and monitoring</p>
      </div>

      {/* Parameter Selection */}
      <div className="flex flex-wrap gap-4 justify-center mb-6">
        {parameterCards.map((param) => (
          <button
            key={param.key}
            onClick={() => setSelectedParameter(param.key)}
            className={`px-4 py-2 rounded-lg transition-all duration-300 ${
              selectedParameter === param.key
                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50'
                : 'bg-gray-800/50 text-gray-400 border border-gray-700/50 hover:bg-gray-700/50'
            }`}
          >
            {getParameterInfo(param.key).icon} {param.label}
          </button>
        ))}
      </div>

      {/* Live Parameter Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {parameterCards.map((param) => {
          const info = getParameterInfo(param.key);
          const statusColor = getStatusColor(parseFloat(param.value), param.key);
          const statusIcon = getStatusIcon(parseFloat(param.value), param.key);
          
          return (
            <div key={param.key} className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl border border-gray-600/30 rounded-xl p-4 hover:scale-[1.02] hover:border-blue-500/20 transition-all duration-300 shadow-lg hover:shadow-blue-500/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">{param.label}</span>
                {statusIcon}
              </div>
              <div className="flex items-baseline gap-1">
                <span className={`text-2xl font-bold ${statusColor}`}>{param.value}</span>
                <span className="text-gray-500 text-sm">{param.unit}</span>
              </div>
              <div className="flex items-center gap-1 mt-2">
                <Activity className="w-3 h-3 text-blue-400 animate-pulse" />
                <span className="text-xs text-gray-500">Live</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Chart */}
      <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl border border-gray-600/30 rounded-2xl p-6 mb-8 shadow-2xl hover:shadow-blue-500/20 transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-white">
            {getParameterInfo(selectedParameter).name} Trends
          </h3>
          <div className="flex items-center gap-2">
            <LineChart className="w-5 h-5 text-blue-400" />
            <span className="text-sm text-gray-400">Real-time Data</span>
          </div>
        </div>
        <HighchartsReact highcharts={Highcharts} options={chartOptions} />
      </div>

      {/* Ocean Zones Data */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {Object.entries(oceanData.oceanZones).map(([zone, data]) => (
          <div key={zone} className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl border border-gray-600/30 rounded-xl p-6 shadow-lg hover:shadow-cyan-500/20 transition-all duration-300 hover:scale-[1.01]">
            <h4 className="text-lg font-semibold text-white mb-4 capitalize">{zone} Zone</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Depth:</span>
                <span className="text-white">{data.depth}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Temperature:</span>
                <span className="text-red-400">{data.temperature.current}°C</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Salinity:</span>
                <span className="text-cyan-400">{data.salinity.current} PSU</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Oxygen:</span>
                <span className="text-green-400">{data.oxygen.current} mg/L</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">pH:</span>
                <span className="text-purple-400">{data.ph.current}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Environmental Data */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl border border-gray-600/30 rounded-xl p-6 shadow-lg hover:shadow-green-500/20 transition-all duration-300 hover:scale-[1.01]">
          <h4 className="text-lg font-semibold text-white mb-4">Weather Conditions</h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Wind Speed:</span>
              <span className="text-white">{oceanData.environmentalData.weather.windSpeed.value} {oceanData.environmentalData.weather.windSpeed.unit}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Wave Height:</span>
              <span className="text-white">{oceanData.environmentalData.weather.waveHeight.value} {oceanData.environmentalData.weather.waveHeight.unit}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Air Temperature:</span>
              <span className="text-white">{oceanData.environmentalData.weather.airTemperature.value} {oceanData.environmentalData.weather.airTemperature.unit}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Humidity:</span>
              <span className="text-white">{oceanData.environmentalData.weather.humidity.value} {oceanData.environmentalData.weather.humidity.unit}</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl border border-gray-600/30 rounded-xl p-6 shadow-lg hover:shadow-purple-500/20 transition-all duration-300 hover:scale-[1.01]">
          <h4 className="text-lg font-semibold text-white mb-4">Marine Life</h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Phytoplankton:</span>
              <span className="text-green-400">{oceanData.marineLifeData.phytoplankton.density.value.toLocaleString()} {oceanData.marineLifeData.phytoplankton.density.unit}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Zooplankton:</span>
              <span className="text-blue-400">{oceanData.marineLifeData.zooplankton.density.value.toLocaleString()} {oceanData.marineLifeData.zooplankton.density.unit}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Fish Abundance:</span>
              <span className="text-yellow-400">{oceanData.marineLifeData.fish.abundance.value} {oceanData.marineLifeData.fish.abundance.unit}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Fish Diversity:</span>
              <span className="text-purple-400">{oceanData.marineLifeData.fish.diversity.value} {oceanData.marineLifeData.fish.diversity.unit}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedAnalytics;
