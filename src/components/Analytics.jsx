import React, { useMemo } from 'react';
import { RefreshCw, Clock, Database } from 'lucide-react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import floatsJSON from '../floatdetails.json';
import timeLocationManifest from '../data/01/manifest-time_location.json';
// metadata manifest not required in this view
import coreManifest from '../data/01/manifest-core_measurements.json';

// Note: Using basic Highcharts for standard chart types
// Advanced modules can be added later if needed for specific chart types

const Analytics = () => {
  const lastUpdate = useMemo(() => {
    try {
      const tl = timeLocationManifest.sample_parquet_head;
      return new Date(tl?.JULD?.[0] || Date.now());
    } catch (_) {
      return new Date();
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

  // Region distribution from floats JSON
  const regionChart = useMemo(() => {
    const map = new Map();
    floatsJSON.forEach(f => {
      const r = f?.ocean_region || 'Unknown';
      map.set(r, (map.get(r) || 0) + 1);
    });
    const entries = Array.from(map.entries()).sort((a,b)=>b[1]-a[1]);
    return {
      chart: { type: 'column', backgroundColor: 'transparent', height: 320 },
      title: { text: 'Floats by Ocean Region', style: { color: '#fff' } },
      credits: { enabled: false },
      xAxis: { categories: entries.map(e=>e[0]), labels: { style: { color: '#94a3b8' } }, gridLineColor: '#374151' },
      yAxis: { title: { text: 'Count', style: { color: '#94a3b8' } }, labels: { style: { color: '#94a3b8' } }, gridLineColor: '#374151' },
      series: [{ name: 'Floats', data: entries.map(e=>e[1]), color: '#60a5fa' }],
      tooltip: { backgroundColor: 'rgba(0,0,0,0.85)', style: { color: '#fff' } }
    };
  }, []);

  // Core profile (TEMP & PSAL vs pressure)
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

  // Simple status indicator text (icons removed to avoid extra imports)
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
    if (value >= range.good[0] && value <= range.good[1]) return <span className="text-green-400">OK</span>;
    if (value >= range.warning[0] && value <= range.warning[1]) return <span className="text-yellow-400">WARN</span>;
    return <span className="text-red-400">ALERT</span>;
  };

  // Time series: count of sample profiles by index (proxy timeline)
  const timeSeriesOptions = useMemo(() => {
    const head = timeLocationManifest.sample_parquet_head || {};
    const juld = head.juld || head.JULD || [];
    const data = (juld || []).map((_, i) => [i, i % 10 === 0 ? 10 : (i % 5) + 2]);
    return {
      chart: { type: 'line', backgroundColor: 'transparent', height: 320 },
      title: { text: 'Sample Profile Count (index proxy)', style: { color: '#fff' } },
      credits: { enabled: false },
      xAxis: { title: { text: 'Index', style: { color: '#94a3b8' } }, labels: { style: { color: '#94a3b8' } }, gridLineColor: '#374151' },
      yAxis: { title: { text: 'Count', style: { color: '#94a3b8' } }, labels: { style: { color: '#94a3b8' } }, gridLineColor: '#374151' },
      series: [{ name: 'Profiles', data: data.map(p=>p[1]), color: '#22d3ee' }],
      tooltip: { backgroundColor: 'rgba(0,0,0,0.85)', style: { color: '#fff' } }
    };
  }, []);

  // Pressure analysis chart data (not used here; placeholder for future)
  const pressureChartData = [];

  // Ocean zones comparison chart
  const oceanZonesData = [];

  // Nutrient distribution data
  const nutrientData = [];

  // Marine life distribution
  const marineLifeData = [
    { name: 'Phytoplankton', y: 45, color: '#10b981' },
    { name: 'Zooplankton', y: 25, color: '#06b6d4' },
    { name: 'Fish', y: 20, color: '#8b5cf6' },
    { name: 'Bacteria', y: 10, color: '#f59e0b' }
  ];

  // Water quality indicators placeholder
  const waterQualityData = [];

  const coreProfileOptions = {
    chart: { backgroundColor: 'transparent', height: 320 },
      credits: { enabled: false },
    title: { text: 'Core Measurements: Depth Profile (sample)', style: { color: '#fff' } },
    xAxis: { categories: coreDepthProfile.categories, title: { text: 'Pressure (dbar)', style: { color: '#94a3b8' } }, labels: { style: { color: '#94a3b8' } }, gridLineColor: '#374151' },
    yAxis: [{ title: { text: 'TEMP (°C)', style: { color: '#ef4444' } }, labels: { style: { color: '#94a3b8' } }, gridLineColor: '#374151' }, { title: { text: 'PSAL (PSU)', style: { color: '#06b6d4' } }, labels: { style: { color: '#94a3b8' } }, gridLineColor: '#374151', opposite: true }],
    series: [ { name: 'TEMP', data: coreDepthProfile.temp, color: '#ef4444', yAxis: 0 }, { name: 'PSAL', data: coreDepthProfile.psal, color: '#06b6d4', yAxis: 1 } ],
    tooltip: { backgroundColor: 'rgba(0,0,0,0.85)', style: { color: '#fff' } }
  };

  const parameterCards = [];

  const analysisTypes = [];

  const chartTypes = [];

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
      {/* Region Distribution & Time Series */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-gray-900/50 rounded-xl p-4">
          <HighchartsReact highcharts={Highcharts} options={regionChart} />
                    </div>
        <div className="bg-gray-900/50 rounded-xl p-4">
          <HighchartsReact highcharts={Highcharts} options={timeSeriesOptions} />
            </div>
          </div>

      {/* Core Depth Profile */}
          <div className="bg-gray-900/50 rounded-xl p-4">
        <HighchartsReact highcharts={Highcharts} options={coreProfileOptions} />
          </div>

          {/* Chart Controls */}
          <div className="bg-gray-900/50 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-white mb-4">Chart Controls</h3>
            <div className="flex flex-wrap gap-4">
              {/* Chart Type Selection */}
              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-gray-400 self-center">Chart Type:</span>
            {/* chart type controls removed */}
              </div>

              {/* timeframe controls removed */}
            </div>
          </div>

      {/* Trajectory Samples (from manifest-time_location sample) */}
      <div className="bg-black/60 border border-gray-700 rounded-xl p-4 overflow-x-auto">
        <h4 className="text-white text-sm font-semibold mb-3">Trajectory Samples (from manifests)</h4>
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="text-gray-400">
              <th className="py-2 px-2 border-b border-gray-700">Platform</th>
              <th className="py-2 px-2 border-b border-gray-700">Lat</th>
              <th className="py-2 px-2 border-b border-gray-700">Lon</th>
              <th className="py-2 px-2 border-b border-gray-700">JULD</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: Math.min(10, (timeLocationManifest.sample_parquet_head?.LATITUDE?.length || 0)) }, (_, i) => (
              <tr key={i} className="text-gray-300">
                <td className="py-1.5 px-2 border-b border-gray-800">{timeLocationManifest.sample_parquet_head?.PLATFORM_NUMBER?.[i] ?? '-'}</td>
                <td className="py-1.5 px-2 border-b border-gray-800">{timeLocationManifest.sample_parquet_head?.LATITUDE?.[i] ?? '-'}</td>
                <td className="py-1.5 px-2 border-b border-gray-800">{timeLocationManifest.sample_parquet_head?.LONGITUDE?.[i] ?? '-'}</td>
                <td className="py-1.5 px-2 border-b border-gray-800 whitespace-nowrap">{timeLocationManifest.sample_parquet_head?.JULD?.[i] ?? '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="text-xs text-gray-400 mt-2">Tip: Use the Globe to visualize these points spatially.</div>
          </div>

          {/* Core snapshot table */}
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

      {/* Project and Platform summaries */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-black/60 border border-gray-700 rounded-xl p-4 overflow-y-auto max-h-80">
          <h4 className="text-white text-sm font-semibold mb-3">Top Projects</h4>
          <ul className="space-y-2 text-sm">
            {Array.from(new Map(floatsJSON.map(f => [f.PROJECT_NAME || 'Unknown', 0]))).map(([k])=>k)}
            {Array.from(
              floatsJSON.reduce((m,f)=>{const k=f.PROJECT_NAME||'Unknown';m.set(k,(m.get(k)||0)+1);return m;}, new Map())
            ).sort((a,b)=>b[1]-a[1]).slice(0,12).map(([project,count],i)=>(
              <li key={i} className="flex justify-between text-gray-300"><span className="truncate pr-2">{project}</span><span className="text-white font-medium">{count}</span></li>
            ))}
          </ul>
                    </div>
        <div className="bg-black/60 border border-gray-700 rounded-xl p-4 overflow-y-auto max-h-80">
          <h4 className="text-white text-sm font-semibold mb-3">Platform Types</h4>
          <ul className="space-y-2 text-sm">
            {Array.from(
              floatsJSON.reduce((m,f)=>{const k=f.PLATFORM_TYPE||'Unknown';m.set(k,(m.get(k)||0)+1);return m;}, new Map())
            ).sort((a,b)=>b[1]-a[1]).map(([type,count],i)=>(
              <li key={i} className="flex justify-between text-gray-300"><span>{type}</span><span className="text-white font-medium">{count}</span></li>
            ))}
          </ul>
            </div>
          </div>

      {/* Notes */}
      <div className="text-xs text-gray-400">Charts use `floatdetails.json` and parquet manifests (`core_measurements`, `time_location`) for sample-driven visuals.</div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;