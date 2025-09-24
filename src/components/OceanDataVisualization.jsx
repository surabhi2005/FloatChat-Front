import React, { useState, useEffect } from "react";
import { 
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell, FunnelChart, Funnel, LabelList,
  Treemap, RadialBarChart, RadialBar
} from "recharts";
import { 
  Thermometer, Droplets, Activity, Waves, Wind, AlertTriangle,
  TrendingUp, TrendingDown, Minus, BarChart3, PieChart as PieChartIcon,
  TreePine, Gauge, Target, CheckCircle
} from "lucide-react";

const OceanDataVisualization = () => {
  const [selectedDepth, setSelectedDepth] = useState("surface");
  const [animationKey, setAnimationKey] = useState(0);

  // Enhanced depth profile data
  const depthProfiles = {
    surface: {
      name: "Surface Layer (0-50m)",
      data: Array.from({ length: 12 }, (_, i) => ({
        month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
        temperature: 28.5 + Math.sin(i * 0.5) * 3 + Math.random() * 1,
        salinity: 35.2 + Math.cos(i * 0.3) * 0.5 + Math.random() * 0.2,
        oxygen: 6.8 + Math.sin(i * 0.4) * 1.2 + Math.random() * 0.3,
        ph: 8.1 + Math.cos(i * 0.2) * 0.2 + Math.random() * 0.1
      }))
    },
    mixed: {
      name: "Mixed Layer (50-200m)",
      data: Array.from({ length: 12 }, (_, i) => ({
        month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
        temperature: 26.8 + Math.sin(i * 0.4) * 2.5 + Math.random() * 0.8,
        salinity: 35.5 + Math.cos(i * 0.25) * 0.3 + Math.random() * 0.15,
        oxygen: 6.2 + Math.sin(i * 0.35) * 1.0 + Math.random() * 0.25,
        ph: 8.0 + Math.cos(i * 0.15) * 0.15 + Math.random() * 0.08
      }))
    },
    thermocline: {
      name: "Thermocline (200-1000m)",
      data: Array.from({ length: 12 }, (_, i) => ({
        month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
        temperature: 22.3 + Math.sin(i * 0.3) * 1.8 + Math.random() * 0.6,
        salinity: 35.8 + Math.cos(i * 0.2) * 0.2 + Math.random() * 0.1,
        oxygen: 5.5 + Math.sin(i * 0.3) * 0.8 + Math.random() * 0.2,
        ph: 7.9 + Math.cos(i * 0.1) * 0.1 + Math.random() * 0.05
      }))
    }
  };

  // Ocean current data for treemap
  const currentData = [
    { name: "North Equatorial Current", value: 45, color: "#ff6b6b" },
    { name: "South Equatorial Current", value: 38, color: "#4ecdc4" },
    { name: "Equatorial Counter Current", value: 32, color: "#45b7d1" },
    { name: "Somali Current", value: 28, color: "#96ceb4" },
    { name: "Agulhas Current", value: 25, color: "#feca57" },
    { name: "Leeuwin Current", value: 22, color: "#ff9ff3" },
    { name: "West Australian Current", value: 18, color: "#54a0ff" },
    { name: "East Australian Current", value: 15, color: "#5f27cd" }
  ];

  // Marine ecosystem data for funnel chart
  const ecosystemData = [
    { name: "Phytoplankton", value: 100, fill: "#2ecc71" },
    { name: "Zooplankton", value: 75, fill: "#3498db" },
    { name: "Small Fish", value: 50, fill: "#f39c12" },
    { name: "Large Fish", value: 25, fill: "#e74c3c" },
    { name: "Marine Mammals", value: 10, fill: "#9b59b6" }
  ];

  // Water quality indicators
  const waterQualityData = [
    { name: "Excellent", value: 35, color: "#2ecc71" },
    { name: "Good", value: 40, color: "#3498db" },
    { name: "Fair", value: 20, color: "#f39c12" },
    { name: "Poor", value: 5, color: "#e74c3c" }
  ];

  // Real-time sensor data
  const sensorData = [
    { name: "Temperature Sensors", value: 95, status: "online" },
    { name: "Salinity Sensors", value: 92, status: "online" },
    { name: "Oxygen Sensors", value: 88, status: "online" },
    { name: "pH Sensors", value: 85, status: "warning" },
    { name: "Current Meters", value: 90, status: "online" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationKey(prev => prev + 1);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const currentProfile = depthProfiles[selectedDepth];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Ocean Data Visualization</h2>
          <p className="text-gray-300">Comprehensive oceanographic data analysis and ecosystem monitoring</p>
        </div>
        
        <div className="flex gap-3">
          <select 
            value={selectedDepth}
            onChange={(e) => setSelectedDepth(e.target.value)}
            className="px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
          >
            <option value="surface">Surface Layer</option>
            <option value="mixed">Mixed Layer</option>
            <option value="thermocline">Thermocline</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Active Sensors", value: "47", icon: Activity, color: "text-green-400", trend: "+5%" },
          { label: "Data Points", value: "2.4M", icon: BarChart3, color: "text-blue-400", trend: "+12%" },
          { label: "Coverage Area", value: "1.2M km²", icon: Target, color: "text-yellow-400", trend: "+8%" },
          { label: "Uptime", value: "99.2%", icon: Gauge, color: "text-purple-400", trend: "+0.3%" }
        ].map((metric, index) => (
          <div key={index} className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl border border-gray-600/30 rounded-xl p-4 hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">{metric.label}</p>
                <p className="text-2xl font-bold text-white">{metric.value}</p>
                <p className="text-xs text-green-400 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  {metric.trend}
                </p>
              </div>
              <metric.icon className={`w-8 h-8 ${metric.color}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Main Visualization Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Composed Chart - Multi-parameter Analysis */}
        <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl border border-gray-600/30 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-cyan-400" />
            {currentProfile.name} - Multi-Parameter Analysis
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={currentProfile.data} key={animationKey}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9CA3AF" />
                <YAxis yAxisId="left" stroke="#9CA3AF" />
                <YAxis yAxisId="right" orientation="right" stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff'
                  }} 
                />
                <Legend />
                <Bar yAxisId="left" dataKey="temperature" fill="#ff6b6b" name="Temperature (°C)" />
                <Bar yAxisId="left" dataKey="salinity" fill="#4ecdc4" name="Salinity (PSU)" />
                <Line yAxisId="right" type="monotone" dataKey="oxygen" stroke="#45b7d1" strokeWidth={3} name="Oxygen (mg/L)" />
                <Line yAxisId="right" type="monotone" dataKey="ph" stroke="#96ceb4" strokeWidth={3} name="pH" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Area Chart - Temporal Trends */}
        <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl border border-gray-600/30 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white flex items-center gap-2 mb-4">
            <Waves className="w-5 h-5 text-cyan-400" />
            Temperature Trends Over Time
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={currentProfile.data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff'
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="temperature" 
                  stroke="#ff6b6b" 
                  fill="#ff6b6b" 
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Ocean Currents Treemap */}
        <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl border border-gray-600/30 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white flex items-center gap-2 mb-4">
            <TreePine className="w-5 h-5 text-cyan-400" />
            Ocean Currents Strength
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <Treemap
                data={currentData}
                dataKey="value"
                aspectRatio={4/3}
                stroke="#374151"
                fill="#8884d8"
              >
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff'
                  }} 
                />
              </Treemap>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Marine Ecosystem Funnel */}
        <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl border border-gray-600/30 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-cyan-400" />
            Marine Ecosystem Pyramid
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <FunnelChart>
                <Funnel
                  dataKey="value"
                  data={ecosystemData}
                  isAnimationActive={true}
                >
                  <LabelList position="center" fill="#fff" stroke="none" />
                </Funnel>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff'
                  }} 
                />
              </FunnelChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Water Quality and Sensor Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Water Quality Distribution */}
        <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl border border-gray-600/30 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white flex items-center gap-2 mb-4">
            <PieChartIcon className="w-5 h-5 text-cyan-400" />
            Water Quality Distribution
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={waterQualityData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {waterQualityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sensor Status Radial Chart */}
        <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl border border-gray-600/30 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white flex items-center gap-2 mb-4">
            <Gauge className="w-5 h-5 text-cyan-400" />
            Sensor Network Status
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="80%" data={sensorData}>
                <RadialBar dataKey="value" cornerRadius={10} fill="#4ecdc4">
                  <LabelList dataKey="name" position="insideStart" fill="#fff" />
                </RadialBar>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff'
                  }} 
                />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Real-time Alerts */}
      <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl border border-gray-600/30 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white flex items-center gap-2 mb-4">
          <AlertTriangle className="w-5 h-5 text-yellow-400" />
          Real-time Alerts & Notifications
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {[
            { 
              type: "warning", 
              message: "Temperature anomaly detected in Bay of Bengal", 
              time: "2 minutes ago",
              icon: Thermometer,
              color: "text-yellow-400",
              bgColor: "bg-yellow-500/20"
            },
            { 
              type: "info", 
              message: "New data batch received from 12 sensors", 
              time: "5 minutes ago",
              icon: Activity,
              color: "text-blue-400",
              bgColor: "bg-blue-500/20"
            },
            { 
              type: "success", 
              message: "All systems operating normally", 
              time: "10 minutes ago",
              icon: CheckCircle,
              color: "text-green-400",
              bgColor: "bg-green-500/20"
            }
          ].map((alert, index) => (
            <div key={index} className={`p-4 rounded-lg border ${alert.bgColor} border-gray-600/30`}>
              <div className="flex items-start gap-3">
                <alert.icon className={`w-5 h-5 mt-0.5 ${alert.color}`} />
                <div className="flex-1">
                  <p className="text-white text-sm">{alert.message}</p>
                  <p className="text-gray-400 text-xs mt-1">{alert.time}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OceanDataVisualization;
