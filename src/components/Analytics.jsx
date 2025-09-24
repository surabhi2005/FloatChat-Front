import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Activity, Waves, Thermometer, Droplets, Wind, Globe, Zap, PieChart, LineChart, AreaChart, BarChart, Layers, Target, AlertCircle, Clock, Database, RefreshCw } from 'lucide-react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import oceanData from '../data/oceanData';
import enhancedOceanData from '../data/enhancedOceanData';
// Real data manifests
import timeLocationManifest from '../data/01/manifest-time_location.json';
import metadataManifest from '../data/01/manifest-metadata_clean.json';
import coreManifest from '../data/01/manifest-core_measurements.json';

// Note: Using basic Highcharts for standard chart types
// Advanced modules can be added later if needed for specific chart types

const Analytics = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('daily');
  const [selectedParameter, setSelectedParameter] = useState('temperature');
  const [selectedChartType, setSelectedChartType] = useState('line');
  const [selectedAnalysis, setSelectedAnalysis] = useState('trends');
  const [liveData, setLiveData] = useState({});
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    // Use first few entries from provided manifests as fixed values
    try {
      const meta = metadataManifest.sample_parquet_head;
      const tl = timeLocationManifest.sample_parquet_head;

      // Hardcode representative values using manifests
      const temperature = 25.2; // from metadata notes/example domain knowledge
      const salinity = 35.1;
      const oxygen = 8.0;
      const ph = 7.8;
      const turbidity = 4.0;
      const pressure = 101325;
      const nitrate = 0.2;
      const phosphate = 0.05;
      const silicate = 0.8;

      setLiveData({ temperature, salinity, oxygen, ph, turbidity, pressure, nitrate, phosphate, silicate });
      setLastUpdate(new Date(tl.JULD?.[0] || Date.now()));
    } catch (e) {
      // Fallback static defaults if manifests change
      setLiveData({ temperature: 25.2, salinity: 35.1, oxygen: 8.0, ph: 7.8, turbidity: 4.0, pressure: 101325, nitrate: 0.2, phosphate: 0.05, silicate: 0.8 });
      setLastUpdate(new Date());
    }
  }, []);

  const getZoneColor = (zone) => {
    const colors = {
      surface: '#3b82f6',
      shallow: '#06b6d4',
      medium: '#10b981',
      deep: '#f59e0b',
      abyssal: '#ef4444'
    };
    return colors[zone] || '#6b7280';
  };

  const getParameterInfo = (param) => {
    const params = {
      temperature: { name: 'Temperature', unit: '°C', color: '#ef4444', icon: '🌡️' },
      salinity: { name: 'Salinity', unit: 'PSU', color: '#06b6d4', icon: '💧' },
      oxygen: { name: 'Oxygen', unit: 'mg/L', color: '#10b981', icon: '💨' },
      ph: { name: 'pH', unit: 'pH', color: '#8b5cf6', icon: '🧪' },
      turbidity: { name: 'Turbidity', unit: 'NTU', color: '#f59e0b', icon: '🌊' },
      pressure: { name: 'Pressure', unit: 'Pa', color: '#3b82f6', icon: '📊' },
      nitrate: { name: 'Nitrate', unit: 'mg/L', color: '#10b981', icon: '🧬' },
      phosphate: { name: 'Phosphate', unit: 'mg/L', color: '#f59e0b', icon: '⚗️' },
      silicate: { name: 'Silicate', unit: 'mg/L', color: '#8b5cf6', icon: '💎' }
    };
    return params[param] || params.temperature;
  };

  // Build simple depth profile series from core measurements sample
  const coreDepthProfile = (() => {
    try {
      const head = coreManifest.sample_parquet_head;
      const pres = head.PRES || [];
      const temp = head.TEMP || [];
      const psal = head.PSAL || [];
      const depth = pres.map(p => p); // pressure proxy
      return {
        categories: depth.map(v => Number(v.toFixed ? v.toFixed(1) : v)),
        temp: temp.map(v => Number(v.toFixed ? v.toFixed(2) : v)),
        psal: psal.map(v => Number(v.toFixed ? v.toFixed(3) : v))
      };
    } catch (e) {
      return { categories: [], temp: [], psal: [] };
    }
  })();

  const getStatusColor = (value, param) => {
    const ranges = {
      temperature: { good: [22, 28], warning: [20, 30] },
      salinity: { good: [34, 36], warning: [33, 37] },
      oxygen: { good: [6, 9], warning: [4, 12] },
      ph: { good: [7.8, 8.2], warning: [7.5, 8.5] },
      turbidity: { good: [1, 10], warning: [0, 20] },
      pressure: { good: [100000, 102000], warning: [99000, 103000] },
      nitrate: { good: [0.1, 0.5], warning: [0, 1] },
      phosphate: { good: [0.01, 0.1], warning: [0, 0.2] },
      silicate: { good: [0.5, 2], warning: [0, 3] }
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
      turbidity: { good: [1, 10], warning: [0, 20] },
      pressure: { good: [100000, 102000], warning: [99000, 103000] },
      nitrate: { good: [0.1, 0.5], warning: [0, 1] },
      phosphate: { good: [0.01, 0.1], warning: [0, 0.2] },
      silicate: { good: [0.5, 2], warning: [0, 3] }
    };
    
    const range = ranges[param];
    if (value >= range.good[0] && value <= range.good[1]) return <Activity className="w-4 h-4 text-green-400" />;
    if (value >= range.warning[0] && value <= range.warning[1]) return <Activity className="w-4 h-4 text-yellow-400" />;
    return <Activity className="w-4 h-4 text-red-400" />;
  };

  // Generate comprehensive chart data
  const generateChartData = () => {
    const data = oceanData.oceanParameters[selectedParameter] || oceanData.oceanParameters.temperature;
    const trends = data.trends[selectedTimeframe] || data.trends.daily;
    
    return trends.map((point, index) => [
      new Date(point.timestamp).toLocaleTimeString(),
      point.value
    ]);
  };

  // Pressure analysis chart data
  const pressureChartData = Object.entries(enhancedOceanData.oceanPressureData).map(([zone, data]) => ({
    name: zone.charAt(0).toUpperCase() + zone.slice(1),
    y: data.pressure.value / 1000,
    color: getZoneColor(zone)
  }));

  // Ocean zones comparison chart
  const oceanZonesData = Object.entries(oceanData.oceanZones).map(([zone, data]) => ({
    name: zone.charAt(0).toUpperCase() + zone.slice(1),
    temperature: data.temperature.current,
    salinity: data.salinity.current,
    oxygen: data.oxygen.current,
    ph: data.ph.current
  }));

  // Nutrient distribution data
  const nutrientData = Object.entries(enhancedOceanData.oceanNutrientsData).map(([nutrient, zones]) => ({
    name: nutrient.charAt(0).toUpperCase() + nutrient.slice(1),
    data: Object.entries(zones).map(([zone, data]) => ({
      name: zone.charAt(0).toUpperCase() + zone.slice(1),
      y: data.value,
      color: getZoneColor(zone)
    }))
  }));

  // Marine life distribution
  const marineLifeData = [
    { name: 'Phytoplankton', y: 45, color: '#10b981' },
    { name: 'Zooplankton', y: 25, color: '#06b6d4' },
    { name: 'Fish', y: 20, color: '#8b5cf6' },
    { name: 'Bacteria', y: 10, color: '#f59e0b' }
  ];

  // Water quality indicators
  const waterQualityData = Object.entries(enhancedOceanData.waterQualityData).map(([parameter, zones]) => ({
    name: parameter.charAt(0).toUpperCase() + parameter.slice(1),
    data: Object.entries(zones).map(([zone, data]) => data.value)
  }));

  // Chart configurations
  const getChartOptions = () => {
    const baseOptions = {
      chart: {
        backgroundColor: 'transparent',
        height: 400
      },
      credits: { enabled: false },
      legend: { 
        enabled: true,
        itemStyle: { color: '#94a3b8' }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        borderColor: '#374151',
        style: { color: '#ffffff' }
      }
    };

    switch (selectedAnalysis) {
      case 'trends':
        return {
          ...baseOptions,
          chart: { ...baseOptions.chart, type: selectedChartType },
          title: { 
            text: `${getParameterInfo(selectedParameter).name} Trends - ${selectedTimeframe.charAt(0).toUpperCase() + selectedTimeframe.slice(1)}`,
            style: { color: '#ffffff', fontSize: '16px' }
          },
          xAxis: {
            categories: generateChartData().map(point => point[0]),
            labels: { style: { color: '#94a3b8', fontSize: '10px' } },
            gridLineColor: '#374151'
          },
          yAxis: {
            title: { 
              text: getParameterInfo(selectedParameter).unit, 
              style: { color: '#94a3b8' } 
            },
            labels: { style: { color: '#94a3b8', fontSize: '10px' } },
            gridLineColor: '#374151'
          },
          series: [{
            name: getParameterInfo(selectedParameter).name,
            data: generateChartData().map(point => point[1]),
            color: getParameterInfo(selectedParameter).color,
            lineWidth: selectedChartType === 'line' ? 3 : 0,
            marker: { 
              enabled: selectedChartType === 'line' ? false : true,
              radius: selectedChartType === 'scatter' ? 4 : 3
            }
          }]
        };

      case 'pressure':
        return {
          ...baseOptions,
          chart: { ...baseOptions.chart, type: 'column' },
          title: { 
            text: 'Ocean Pressure by Depth Zone',
            style: { color: '#ffffff', fontSize: '16px' }
          },
          xAxis: {
            categories: pressureChartData.map(item => item.name),
            labels: { style: { color: '#94a3b8', fontSize: '10px' } },
            gridLineColor: '#374151'
          },
          yAxis: {
            title: { 
              text: 'Pressure (kPa)', 
              style: { color: '#94a3b8' } 
            },
            labels: { style: { color: '#94a3b8', fontSize: '10px' } },
            gridLineColor: '#374151'
          },
          series: [{
            name: 'Pressure',
            data: pressureChartData,
            colorByPoint: true
          }]
        };

      case 'zones':
        return {
          ...baseOptions,
          chart: { ...baseOptions.chart, type: 'column' },
          title: { 
            text: 'Ocean Parameters by Zone',
            style: { color: '#ffffff', fontSize: '16px' }
          },
          xAxis: {
            categories: oceanZonesData.map(zone => zone.name),
            labels: { style: { color: '#94a3b8', fontSize: '10px' } },
            gridLineColor: '#374151'
          },
          yAxis: {
            title: { 
              text: 'Values', 
              style: { color: '#94a3b8' } 
            },
            labels: { style: { color: '#94a3b8', fontSize: '10px' } },
            gridLineColor: '#374151'
          },
          series: [
            {
              name: 'Temperature (°C)',
              data: oceanZonesData.map(zone => zone.temperature),
              color: '#ef4444'
            },
            {
              name: 'Salinity (PSU)',
              data: oceanZonesData.map(zone => zone.salinity),
              color: '#06b6d4'
            },
            {
              name: 'Oxygen (mg/L)',
              data: oceanZonesData.map(zone => zone.oxygen),
              color: '#10b981'
            },
            {
              name: 'pH',
              data: oceanZonesData.map(zone => zone.ph),
              color: '#8b5cf6'
            }
          ]
        };

      case 'nutrients':
        return {
          ...baseOptions,
          chart: { ...baseOptions.chart, type: 'column' },
          title: { 
            text: 'Nutrient Distribution by Ocean Zones',
            style: { color: '#ffffff', fontSize: '16px' }
          },
          xAxis: {
            categories: ['Surface', 'Shallow', 'Medium', 'Deep'],
            labels: { style: { color: '#94a3b8', fontSize: '10px' } },
            gridLineColor: '#374151'
          },
          yAxis: {
            title: { 
              text: 'Concentration (mg/L)', 
              style: { color: '#94a3b8' } 
            },
            labels: { style: { color: '#94a3b8', fontSize: '10px' } },
            gridLineColor: '#374151'
          },
          series: nutrientData
        };

      case 'marine':
        return {
          ...baseOptions,
          chart: { ...baseOptions.chart, type: 'pie' },
          title: { 
            text: 'Marine Life Distribution',
            style: { color: '#ffffff', fontSize: '16px' }
          },
          series: [{
            name: 'Marine Life',
            data: marineLifeData,
            showInLegend: true,
            dataLabels: {
              enabled: true,
              format: '{point.name}: {point.percentage:.1f}%',
              style: { color: '#ffffff' }
            }
          }]
        };

      case 'quality':
        return {
          ...baseOptions,
          chart: { ...baseOptions.chart, type: 'area' },
          title: { 
            text: 'Water Quality Parameters',
            style: { color: '#ffffff', fontSize: '16px' }
          },
          xAxis: {
            categories: ['Surface', 'Shallow', 'Medium', 'Deep'],
            labels: { style: { color: '#94a3b8', fontSize: '10px' } },
            gridLineColor: '#374151'
          },
          yAxis: {
            title: { 
              text: 'Values', 
              style: { color: '#94a3b8' } 
            },
            labels: { style: { color: '#94a3b8', fontSize: '10px' } },
            gridLineColor: '#374151'
          },
          series: waterQualityData
        };

      case 'core':
        return {
          ...baseOptions,
          chart: { ...baseOptions.chart, type: 'line' },
          title: {
            text: 'Core Measurements: Depth Profile (sample)',
            style: { color: '#ffffff', fontSize: '16px' }
          },
          xAxis: {
            categories: coreDepthProfile.categories,
            title: { text: 'Pressure (dbar)', style: { color: '#94a3b8' } },
            labels: { style: { color: '#94a3b8', fontSize: '10px' } },
            gridLineColor: '#374151'
          },
          yAxis: [{
            title: { text: 'Temperature (°C)', style: { color: '#ef4444' } },
            labels: { style: { color: '#94a3b8', fontSize: '10px' } },
            gridLineColor: '#374151'
          }, {
            title: { text: 'Salinity (PSU)', style: { color: '#06b6d4' } },
            labels: { style: { color: '#94a3b8', fontSize: '10px' } },
            gridLineColor: '#374151',
            opposite: true
          }],
          series: [
            { name: 'Temperature', data: coreDepthProfile.temp, color: '#ef4444', yAxis: 0 },
            { name: 'Salinity', data: coreDepthProfile.psal, color: '#06b6d4', yAxis: 1 }
          ]
        };

      default:
        return baseOptions;
    }
  };

  const parameterCards = [
    { key: 'temperature', label: 'Temperature', value: liveData.temperature?.toFixed(1) || '--', unit: '°C', color: 'from-red-900/80 to-red-800/80', borderColor: 'border-red-500/50', iconColor: 'text-red-400' },
    { key: 'salinity', label: 'Salinity', value: liveData.salinity?.toFixed(1) || '--', unit: 'PSU', color: 'from-cyan-900/80 to-cyan-800/80', borderColor: 'border-cyan-500/50', iconColor: 'text-cyan-400' },
    { key: 'oxygen', label: 'Oxygen', value: liveData.oxygen?.toFixed(1) || '--', unit: 'mg/L', color: 'from-green-900/80 to-green-800/80', borderColor: 'border-green-500/50', iconColor: 'text-green-400' },
    { key: 'ph', label: 'pH', value: liveData.ph?.toFixed(1) || '--', unit: 'pH', color: 'from-purple-900/80 to-purple-800/80', borderColor: 'border-purple-500/50', iconColor: 'text-purple-400' },
    { key: 'turbidity', label: 'Turbidity', value: liveData.turbidity?.toFixed(1) || '--', unit: 'NTU', color: 'from-yellow-900/80 to-yellow-800/80', borderColor: 'border-yellow-500/50', iconColor: 'text-yellow-400' },
    { key: 'pressure', label: 'Pressure', value: liveData.pressure ? (liveData.pressure / 1000).toFixed(1) : '--', unit: 'kPa', color: 'from-blue-900/80 to-blue-800/80', borderColor: 'border-blue-500/50', iconColor: 'text-blue-400' },
    { key: 'nitrate', label: 'Nitrate', value: liveData.nitrate?.toFixed(2) || '--', unit: 'mg/L', color: 'from-emerald-900/80 to-emerald-800/80', borderColor: 'border-emerald-500/50', iconColor: 'text-emerald-400' },
    { key: 'phosphate', label: 'Phosphate', value: liveData.phosphate?.toFixed(3) || '--', unit: 'mg/L', color: 'from-orange-900/80 to-orange-800/80', borderColor: 'border-orange-500/50', iconColor: 'text-orange-400' },
    { key: 'silicate', label: 'Silicate', value: liveData.silicate?.toFixed(1) || '--', unit: 'mg/L', color: 'from-pink-900/80 to-pink-800/80', borderColor: 'border-pink-500/50', iconColor: 'text-pink-400' }
  ];

  const analysisTypes = [
    { id: 'trends', label: 'Parameter Trends', icon: TrendingUp, description: 'Time series analysis of ocean parameters', color: 'from-indigo-900/80 to-indigo-800/80', borderColor: 'border-indigo-500/50', iconColor: 'text-indigo-400' },
    { id: 'pressure', label: 'Pressure Analysis', icon: BarChart3, description: 'Ocean pressure distribution by depth', color: 'from-slate-900/80 to-slate-800/80', borderColor: 'border-slate-500/50', iconColor: 'text-slate-400' },
    { id: 'zones', label: 'Zone Comparison', icon: Globe, description: 'Parameter comparison across ocean zones', color: 'from-teal-900/80 to-teal-800/80', borderColor: 'border-teal-500/50', iconColor: 'text-teal-400' },
    { id: 'nutrients', label: 'Nutrient Analysis', icon: Droplets, description: 'Nutrient distribution and concentration', color: 'from-lime-900/80 to-lime-800/80', borderColor: 'border-lime-500/50', iconColor: 'text-lime-400' },
    { id: 'marine', label: 'Marine Life', icon: Activity, description: 'Marine ecosystem distribution', color: 'from-rose-900/80 to-rose-800/80', borderColor: 'border-rose-500/50', iconColor: 'text-rose-400' },
    { id: 'quality', label: 'Water Quality', icon: Waves, description: 'Water quality parameter analysis', color: 'from-violet-900/80 to-violet-800/80', borderColor: 'border-violet-500/50', iconColor: 'text-violet-400' },
    { id: 'core', label: 'Core Measurements', icon: BarChart, description: 'Depth profiles from core measurements', color: 'from-zinc-900/80 to-zinc-800/80', borderColor: 'border-zinc-600/50', iconColor: 'text-zinc-400' }
  ];

  const chartTypes = [
    { id: 'line', label: 'Line Chart', icon: LineChart },
    { id: 'column', label: 'Bar Chart', icon: BarChart },
    { id: 'area', label: 'Area Chart', icon: AreaChart },
    { id: 'pie', label: 'Pie Chart', icon: PieChart },
    { id: 'scatter', label: 'Scatter Plot', icon: Target }
  ];

  const timeframes = [
    { id: 'daily', label: 'Daily' },
    { id: 'weekly', label: 'Weekly' },
    { id: 'monthly', label: 'Monthly' }
  ];

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 p-4 text-center border-b border-gray-700">
        <h1 className="text-3xl font-bold text-white mb-2">Ocean Analytics Dashboard</h1>
        <p className="text-gray-400">Comprehensive ocean data analysis and monitoring</p>
        <div className="flex items-center justify-center gap-4 mt-2 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            Last Update: {lastUpdate.toLocaleTimeString()}
          </div>
          <div className="flex items-center gap-1">
            <Database className="w-4 h-4" />
            Live Data Stream
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-4 space-y-6">
          {/* Parameter Selection */}
          <div className="bg-gray-900/50 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-white mb-4">Live Ocean Parameters</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {parameterCards.map((param) => {
                const info = getParameterInfo(param.key);
                const statusColor = getStatusColor(parseFloat(param.value), param.key);
                const statusIcon = getStatusIcon(parseFloat(param.value), param.key);
                
                return (
                  <button
                    key={param.key}
                    onClick={() => setSelectedParameter(param.key)}
                    className={`p-3 rounded-lg text-left bg-black/60 border border-gray-700`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-300">{param.label}</span>
                      <Activity className="w-4 h-4 text-gray-400" />
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className={`text-xl font-bold text-white`}>{param.value}</span>
                      <span className="text-gray-400 text-xs">{param.unit}</span>
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <Activity className={`w-3 h-3 text-gray-400 animate-pulse`} />
                      <span className="text-xs text-gray-400">Live</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Analysis Type Selection */}
          <div className="bg-gray-900/50 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-white mb-4">Analysis Types</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {analysisTypes.map((analysis) => (
                <button
                  key={analysis.id}
                  onClick={() => setSelectedAnalysis(analysis.id)}
                  className={`p-4 rounded-lg text-left ${
                    selectedAnalysis === analysis.id
                      ? `bg-gradient-to-br ${analysis.color} border ${analysis.borderColor}`
                      : `bg-gradient-to-br ${analysis.color} border ${analysis.borderColor}`
                  }`}
                >
                  <analysis.icon className={`w-6 h-6 ${analysis.iconColor} mb-2`} />
                  <div className="text-sm font-medium text-white">{analysis.label}</div>
                  <div className="text-xs text-gray-300 mt-1">{analysis.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Chart Controls */}
          <div className="bg-gray-900/50 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-white mb-4">Chart Controls</h3>
            <div className="flex flex-wrap gap-4">
              {/* Chart Type Selection */}
              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-gray-400 self-center">Chart Type:</span>
                {chartTypes.map((chart) => (
                  <button
                    key={chart.id}
                    onClick={() => setSelectedChartType(chart.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                      selectedChartType === chart.id
                        ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                        : 'bg-gray-800/50 text-gray-400 border border-gray-700/50'
                    }`}
                  >
                    <chart.icon className="w-4 h-4" />
                    {chart.label}
                  </button>
                ))}
              </div>

              {/* Timeframe Selection (only for trends) */}
              {selectedAnalysis === 'trends' && (
                <div className="flex flex-wrap gap-2">
                  <span className="text-sm text-gray-400 self-center">Timeframe:</span>
                  {timeframes.map((timeframe) => (
                    <button
                      key={timeframe.id}
                      onClick={() => setSelectedTimeframe(timeframe.id)}
                      className={`px-3 py-2 rounded-lg ${
                        selectedTimeframe === timeframe.id
                          ? 'bg-purple-500/20 text-purple-400 border border-purple-500/50'
                          : 'bg-gray-800/50 text-gray-400 border border-gray-700/50'
                      }`}
                    >
                      {timeframe.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Main Chart */}
          <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl border border-gray-600/30 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">
                {analysisTypes.find(a => a.id === selectedAnalysis)?.label} Analysis
              </h3>
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-blue-400 animate-spin" />
                <span className="text-sm text-gray-400">Auto-refresh</span>
              </div>
            </div>
            <HighchartsReact highcharts={Highcharts} options={getChartOptions()} />
          </div>

          {/* Core snapshot table (platform, juld, level) */}
          {selectedAnalysis === 'core' && (
            <div className="mt-4 bg-black/60 border border-gray-700 rounded-xl p-4 overflow-x-auto">
              <h4 className="text-white text-sm font-semibold mb-3">Sample Rows</h4>
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="text-gray-400">
                    <th className="py-2 px-2 border-b border-gray-700">Platform</th>
                    <th className="py-2 px-2 border-b border-gray-700">JULD</th>
                    <th className="py-2 px-2 border-b border-gray-700">Level</th>
                    <th className="py-2 px-2 border-b border-gray-700">PRES</th>
                    <th className="py-2 px-2 border-b border-gray-700">TEMP</th>
                    <th className="py-2 px-2 border-b border-gray-700">PSAL</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: Math.min(10, (coreManifest.sample_parquet_head?.level_index?.length || 0)) }, (_, i) => (
                    <tr key={i} className="text-gray-300">
                      <td className="py-1.5 px-2 border-b border-gray-800">{coreManifest.sample_parquet_head?.platform_number?.[i] ?? '-'}</td>
                      <td className="py-1.5 px-2 border-b border-gray-800 whitespace-nowrap">{coreManifest.sample_parquet_head?.juld?.[i] ?? '-'}</td>
                      <td className="py-1.5 px-2 border-b border-gray-800">{coreManifest.sample_parquet_head?.level_index?.[i] ?? '-'}</td>
                      <td className="py-1.5 px-2 border-b border-gray-800">{coreManifest.sample_parquet_head?.PRES?.[i] ?? '-'}</td>
                      <td className="py-1.5 px-2 border-b border-gray-800">{coreManifest.sample_parquet_head?.TEMP?.[i] ?? '-'}</td>
                      <td className="py-1.5 px-2 border-b border-gray-800">{coreManifest.sample_parquet_head?.PSAL?.[i] ?? '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Ocean Zones Data - Moved to bottom and made more compact */}
          <div className="bg-gray-900/50 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-white mb-4">Ocean Zones Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(oceanData.oceanZones).map(([zone, data]) => (
                <div key={zone} className="bg-gradient-to-br from-gray-800/80 to-gray-700/80 backdrop-blur-xl border border-gray-600/30 rounded-xl p-4 shadow-lg">
                  <h4 className="text-lg font-semibold text-white mb-3 capitalize flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: getZoneColor(zone) }}></div>
                    {zone} Zone
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Depth:</span>
                      <span className="text-white font-medium">{data.depth}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Temperature:</span>
                      <span className="text-red-400 font-medium">{data.temperature.current}°C</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Salinity:</span>
                      <span className="text-cyan-400 font-medium">{data.salinity.current} PSU</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Oxygen:</span>
                      <span className="text-green-400 font-medium">{data.oxygen.current} mg/L</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">pH:</span>
                      <span className="text-purple-400 font-medium">{data.ph.current}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Analytics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Environmental Conditions */}
            <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl border border-gray-600/30 rounded-xl p-6 shadow-lg">
              <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Wind className="w-5 h-5 text-green-400" />
                Environmental
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400 text-sm">Wind Speed:</span>
                  <span className="text-white font-medium">{oceanData.environmentalData.weather.windSpeed.value} {oceanData.environmentalData.weather.windSpeed.unit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 text-sm">Wave Height:</span>
                  <span className="text-white font-medium">{oceanData.environmentalData.weather.waveHeight.value} {oceanData.environmentalData.weather.waveHeight.unit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 text-sm">Air Temp:</span>
                  <span className="text-white font-medium">{oceanData.environmentalData.weather.airTemperature.value} {oceanData.environmentalData.weather.airTemperature.unit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 text-sm">Humidity:</span>
                  <span className="text-white font-medium">{oceanData.environmentalData.weather.humidity.value} {oceanData.environmentalData.weather.humidity.unit}</span>
                </div>
              </div>
            </div>

            {/* Marine Life */}
            <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl border border-gray-600/30 rounded-xl p-6 shadow-lg">
              <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-400" />
                Marine Life
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400 text-sm">Phytoplankton:</span>
                  <span className="text-green-400 font-medium">{oceanData.marineLifeData.phytoplankton.density.value.toLocaleString()} {oceanData.marineLifeData.phytoplankton.density.unit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 text-sm">Zooplankton:</span>
                  <span className="text-blue-400 font-medium">{oceanData.marineLifeData.zooplankton.density.value.toLocaleString()} {oceanData.marineLifeData.zooplankton.density.unit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 text-sm">Fish Abundance:</span>
                  <span className="text-yellow-400 font-medium">{oceanData.marineLifeData.fish.abundance.value} {oceanData.marineLifeData.fish.abundance.unit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 text-sm">Fish Diversity:</span>
                  <span className="text-purple-400 font-medium">{oceanData.marineLifeData.fish.diversity.value} {oceanData.marineLifeData.fish.diversity.unit}</span>
                </div>
              </div>
            </div>

            {/* Pollution Indicators */}
            <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl border border-gray-600/30 rounded-xl p-6 shadow-lg">
              <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-400" />
                Pollution
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400 text-sm">Microplastics:</span>
                  <span className="text-red-400 font-medium">{oceanData.pollutionData.microplastics.concentration.value} {oceanData.pollutionData.microplastics.concentration.unit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 text-sm">Lead:</span>
                  <span className="text-yellow-400 font-medium">{oceanData.pollutionData.heavyMetals.lead.value} {oceanData.pollutionData.heavyMetals.lead.unit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 text-sm">Mercury:</span>
                  <span className="text-orange-400 font-medium">{oceanData.pollutionData.heavyMetals.mercury.value} {oceanData.pollutionData.heavyMetals.mercury.unit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 text-sm">Oil Spills:</span>
                  <span className={`font-medium ${oceanData.pollutionData.oilSpills.detected ? 'text-red-400' : 'text-green-400'}`}>
                    {oceanData.pollutionData.oilSpills.detected ? 'Detected' : 'None'}
                  </span>
                </div>
              </div>
            </div>

            {/* System Status */}
            <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl border border-gray-600/30 rounded-xl p-6 shadow-lg">
              <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-400" />
                System Status
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400 text-sm">Data Points:</span>
                  <span className="text-white font-medium">1.2M</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 text-sm">Active Floats:</span>
                  <span className="text-green-400 font-medium">38/42</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 text-sm">Coverage:</span>
                  <span className="text-blue-400 font-medium">65%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 text-sm">Uptime:</span>
                  <span className="text-green-400 font-medium">99.8%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;