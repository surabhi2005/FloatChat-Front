import React, { useMemo, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import timeLocationManifest from '../data/01/manifest-time_location.json';
import coreManifest from '../data/01/manifest-core_measurements.json';

const FloatTimeSeries = () => {
  const [chartParam, setChartParam] = useState('TEMP');
  const [platformFilter, setPlatformFilter] = useState('All');

  const headTL = timeLocationManifest.sample_parquet_head || {};
  const headCore = coreManifest.sample_parquet_head || {};

  const platforms = useMemo(() => {
    const arr = headCore.platform_number || [];
    return ['All', ...Array.from(new Set(arr))];
  }, [headCore.platform_number]);

  const series = useMemo(() => {
    const juld = headCore.juld || headTL.juld || [];
    const platform = headCore.platform_number || [];
    const values = headCore[chartParam] || [];
    const points = [];
    for (let i = 0; i < Math.min(juld.length, values.length); i++) {
      if (platformFilter !== 'All' && platform[i] !== platformFilter) continue;
      const t = juld[i];
      const v = values[i];
      if (t != null && v != null) points.push({ x: i, y: Number(v) });
    }
    return [{ name: chartParam, data: points, color: '#22d3ee' }];
  }, [headCore, headTL, chartParam, platformFilter]);

  const options = {
    chart: { type: 'line', backgroundColor: 'transparent', height: 280 },
    title: { text: `Time Series (${chartParam})`, style: { color: '#fff', fontSize: '14px' } },
    credits: { enabled: false },
    xAxis: { title: { text: 'Index', style: { color: '#94a3b8' } }, labels: { style: { color: '#94a3b8', fontSize: '10px' } }, gridLineColor: '#374151' },
    yAxis: { title: { text: chartParam, style: { color: '#94a3b8' } }, labels: { style: { color: '#94a3b8', fontSize: '10px' } }, gridLineColor: '#374151' },
    legend: { itemStyle: { color: '#94a3b8' } },
    series,
    tooltip: { shared: true, backgroundColor: 'rgba(0,0,0,0.85)', style: { color: '#fff' } }
  };

  return (
    <div className="bg-black/60 border border-gray-700 rounded-xl p-4">
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <label className="text-xs text-gray-300">Parameter</label>
        <select className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm" value={chartParam} onChange={e => setChartParam(e.target.value)}>
          <option value="TEMP">TEMP</option>
          <option value="PSAL">PSAL</option>
          <option value="PRES">PRES</option>
        </select>
        <label className="text-xs text-gray-300 ml-3">Platform</label>
        <select className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm" value={platformFilter} onChange={e => setPlatformFilter(e.target.value)}>
          {platforms.map((p, i) => (
            <option key={i} value={p}>{p}</option>
          ))}
        </select>
      </div>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default FloatTimeSeries;


