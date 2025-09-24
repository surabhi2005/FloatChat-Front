import React, { useState, useEffect } from "react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, ScatterChart, Scatter,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from "recharts";
import { 
  TrendingUp, TrendingDown, Activity, Thermometer, Droplets, 
  Wind, Waves, AlertTriangle, CheckCircle, Clock, MapPin,
  BarChart3, LineChart as LineChartIcon, PieChart as PieChartIcon
} from "lucide-react";

const AdvancedAnalytics = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState("24h");
  const [selectedParameter, setSelectedParameter] = useState("temperature");
  const [realTimeData, setRealTimeData] = useState([]);

  // Enhanced mock data with more realistic ocean parameters
  const oceanParameters = {
    temperature: {
      name: "Temperature",
      unit: "°C",
      color: "#ff6b6b",
      icon: Thermometer,
      data: Array.from({ length: 24 }, (_, i) => ({
        time: `${i}:00`,
        value: 28.5 + Math.sin(i * 0.3) * 2 + Math.random() * 0.5,
        trend: i > 12 ? "rising" : "falling"
      }))
    },
    salinity: {
      name: "Salinity",
      unit: "PSU",
      color: "#4ecdc4",
      icon: Droplets,
      data: Array.from({ length: 24 }, (_, i) => ({
        time: `${i}:00`,
        value: 35.2 + Math.cos(i * 0.2) * 0.8 + Math.random() * 0.2,
        trend: i > 8 ? "stable" : "rising"
      }))
    },
    oxygen: {
      name: "Dissolved Oxygen",
      unit: "mg/L",
      color: "#45b7d1",
      icon: Activity,
      data: Array.from({ length: 24 }, (_, i) => ({
        time: `${i}:00`,
        value: 6.8 + Math.sin(i * 0.4) * 1.2 + Math.random() * 0.3,
        trend: i > 16 ? "falling" : "rising"
      }))
    },
    ph: {
      name: "pH Level",
      unit: "pH",
      color: "#96ceb4",
      icon: Waves,
      data: Array.from({ length: 24 }, (_, i) => ({
        time: `${i}:00`,
        value: 8.1 + Math.cos(i * 0.25) * 0.3 + Math.random() * 0.1,
        trend: "stable"
      }))
    },
    turbidity: {
      name: "Turbidity",
      unit: "NTU",
      color: "#feca57",
      icon: Wind,
      data: Array.from({ length: 24 }, (_, i) => ({
        time: `${i}:00`,
        value: 2.1 + Math.sin(i * 0.35) * 0.8 + Math.random() * 0.4,
        trend: i > 14 ? "rising" : "falling"
      }))
    }
  };

  // Ocean zones data for radar chart
  const oceanZonesData = [
    { parameter: "Surface Layer", value: 95, fullMark: 100 },
    { parameter: "Mixed Layer", value: 88, fullMark: 100 },
    { parameter: "Thermocline", value: 76, fullMark: 100 },
    { parameter: "Deep Ocean", value: 45, fullMark: 100 },
    { parameter: "Benthic Zone", value: 32, fullMark: 100 }
  ];

  // Correlation data for scatter plot
  const correlationData = Array.from({ length: 50 }, (_, i) => ({
    temperature: 25 + Math.random() * 10,
    salinity: 34 + Math.random() * 2,
    oxygen: 5 + Math.random() * 4,
    depth: Math.random() * 1000
  }));

  // Statistical summary
  const statsSummary = {
    totalReadings: 1247,
    activeFloats: 12,
    avgTemperature: 28.7,
    avgSalinity: 35.1,
    avgOxygen: 6.9,
    dataQuality: 94.2
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeData(prev => [...prev.slice(-19), {
        time: new Date().toLocaleTimeString(),
        value: Math.random() * 10 + 20,
        parameter: selectedParameter
      }]);
    }, 2000);

    return () => clearInterval(interval);
  }, [selectedParameter]);

  const currentData = oceanParameters[selectedParameter];
  const IconComponent = currentData.icon;

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Advanced Ocean Analytics</h2>
          <p className="text-gray-300">Real-time oceanographic data analysis and visualization</p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          {/* Timeframe Selector */}
          <select 
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value)}
            className="px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
          >
            <option value="1h">Last Hour</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>

          {/* Parameter Selector */}
          <select 
            value={selectedParameter}
            onChange={(e) => setSelectedParameter(e.target.value)}
            className="px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
          >
            {Object.entries(oceanParameters).map(([key, param]) => (
              <option key={key} value={key}>{param.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Statistics Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Readings", value: statsSummary.totalReadings.toLocaleString(), icon: BarChart3, color: "text-blue-400" },
          { label: "Active Floats", value: statsSummary.activeFloats, icon: MapPin, color: "text-green-400" },
          { label: "Data Quality", value: `${statsSummary.dataQuality}%`, icon: CheckCircle, color: "text-yellow-400" },
          { label: "Avg Temperature", value: `${statsSummary.avgTemperature}°C`, icon: Thermometer, color: "text-red-400" }
        ].map((stat, index) => (
          <div key={index} className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl border border-gray-600/30 rounded-xl p-4 hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">{stat.label}</p>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
              </div>
              <stat.icon className={`w-8 h-8 ${stat.color}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line Chart - Time Series */}
        <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl border border-gray-600/30 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-white flex items-center gap-2">
              <LineChartIcon className="w-5 h-5 text-cyan-400" />
              {currentData.name} Trends
            </h3>
            <div className="flex items-center gap-2">
              <IconComponent className="w-4 h-4" style={{ color: currentData.color }} />
              <span className="text-sm text-gray-400">{currentData.unit}</span>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={currentData.data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="time" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff'
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke={currentData.color} 
                  strokeWidth={3}
                  dot={{ fill: currentData.color, strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: currentData.color, strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart - Comparative Analysis */}
        <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl border border-gray-600/30 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-cyan-400" />
            Parameter Comparison
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={Object.values(oceanParameters).map(param => ({
                name: param.name,
                avg: param.data.reduce((sum, d) => sum + d.value, 0) / param.data.length,
                max: Math.max(...param.data.map(d => d.value)),
                min: Math.min(...param.data.map(d => d.value))
              }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff'
                  }} 
                />
                <Legend />
                <Bar dataKey="avg" fill="#4ecdc4" name="Average" />
                <Bar dataKey="max" fill="#ff6b6b" name="Maximum" />
                <Bar dataKey="min" fill="#96ceb4" name="Minimum" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Radar Chart - Ocean Zones */}
        <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl border border-gray-600/30 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white flex items-center gap-2 mb-4">
            <Waves className="w-5 h-5 text-cyan-400" />
            Ocean Zone Analysis
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={oceanZonesData}>
                <PolarGrid stroke="#374151" />
                <PolarAngleAxis dataKey="parameter" stroke="#9CA3AF" />
                <PolarRadiusAxis stroke="#9CA3AF" />
                <Radar 
                  name="Data Coverage" 
                  dataKey="value" 
                  stroke="#4ecdc4" 
                  fill="#4ecdc4" 
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Scatter Plot - Correlation Analysis */}
        <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl border border-gray-600/30 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-cyan-400" />
            Temperature vs Salinity Correlation
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart data={correlationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  type="number" 
                  dataKey="temperature" 
                  name="Temperature (°C)" 
                  stroke="#9CA3AF"
                />
                <YAxis 
                  type="number" 
                  dataKey="salinity" 
                  name="Salinity (PSU)" 
                  stroke="#9CA3AF"
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff'
                  }} 
                />
                <Scatter 
                  dataKey="salinity" 
                  fill="#4ecdc4" 
                  fillOpacity={0.6}
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Real-time Data Stream */}
      <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl border border-gray-600/30 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-cyan-400" />
          Real-time Data Stream
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {realTimeData.slice(-6).map((data, index) => (
            <div key={index} className="bg-gray-800/50 rounded-lg p-4 border border-gray-600/30">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">{data.time}</span>
                <span className="text-cyan-400 font-mono">{data.value.toFixed(2)}</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">{data.parameter}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Data Quality Indicators */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {[
          { 
            title: "Data Completeness", 
            value: 94.2, 
            status: "excellent", 
            color: "text-green-400",
            bgColor: "bg-green-500/20"
          },
          { 
            title: "Sensor Health", 
            value: 87.5, 
            status: "good", 
            color: "text-yellow-400",
            bgColor: "bg-yellow-500/20"
          },
          { 
            title: "Transmission Rate", 
            value: 98.1, 
            status: "excellent", 
            color: "text-green-400",
            bgColor: "bg-green-500/20"
          }
        ].map((indicator, index) => (
          <div key={index} className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl border border-gray-600/30 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-white">{indicator.title}</h4>
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${indicator.bgColor} ${indicator.color}`}>
                {indicator.status}
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Progress</span>
                <span className="text-white font-medium">{indicator.value}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${
                    indicator.value > 90 ? 'bg-green-500' : 
                    indicator.value > 80 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${indicator.value}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdvancedAnalytics;
