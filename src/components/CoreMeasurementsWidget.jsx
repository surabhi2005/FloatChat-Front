import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import coreManifest from '../data/01/manifest-core_measurements.json';

const CoreMeasurementsWidget = () => {
  const head = coreManifest.sample_parquet_head || {};
  const pres = head.PRES || [];
  const temp = head.TEMP || [];
  const psal = head.PSAL || [];

  const categories = pres.map(p => Number(p?.toFixed ? p.toFixed(1) : p));
  const tempSeries = temp.map(v => Number(v?.toFixed ? v.toFixed(2) : v));
  const psalSeries = psal.map(v => Number(v?.toFixed ? v.toFixed(3) : v));

  const options = {
    chart: { backgroundColor: 'transparent', height: 240 },
    credits: { enabled: false },
    title: { text: 'Core Profile (sample)', style: { color: '#fff', fontSize: '14px' } },
    legend: { itemStyle: { color: '#94a3b8' } },
    xAxis: {
      categories,
      title: { text: 'Pressure (dbar)', style: { color: '#94a3b8' } },
      labels: { style: { color: '#94a3b8', fontSize: '9px' } },
      gridLineColor: '#374151'
    },
    yAxis: [{
      title: { text: 'Temp (°C)', style: { color: '#ef4444' } },
      labels: { style: { color: '#94a3b8', fontSize: '9px' } },
      gridLineColor: '#374151'
    }, {
      title: { text: 'Salinity (PSU)', style: { color: '#06b6d4' } },
      labels: { style: { color: '#94a3b8', fontSize: '9px' } },
      gridLineColor: '#374151',
      opposite: true
    }],
    series: [
      { name: 'Temperature', data: tempSeries, color: '#ef4444', yAxis: 0 },
      { name: 'Salinity', data: psalSeries, color: '#06b6d4', yAxis: 1 }
    ],
    tooltip: { backgroundColor: 'rgba(0,0,0,0.85)', style: { color: '#fff' } }
  };

  const profilesCount = coreManifest.csv_total_rows || 0;
  const rowCount = Math.min(5, (head.level_index?.length) || 0);
  const rows = Array.from({ length: rowCount }, (_, i) => ({
    platform: head.platform_number?.[i],
    juld: head.juld?.[i],
    level: head.level_index?.[i],
    pres: head.PRES?.[i],
    temp: head.TEMP?.[i],
    psal: head.PSAL?.[i]
  }));

  return (
    <div className="bg-black/60 border border-gray-700 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white text-sm font-semibold">Core Measurements</h3>
        <span className="text-xs text-gray-400">Rows: {profilesCount.toLocaleString()}</span>
      </div>
      <HighchartsReact highcharts={Highcharts} options={options} />
      <div className="mt-3 grid grid-cols-3 gap-3 text-xs">
        <div className="bg-gray-900/70 border border-gray-700 rounded-lg p-2 text-gray-300">
          <div className="text-gray-400">First Platform</div>
          <div className="text-white font-medium">{(head.platform_number||[])[0] || '-'}</div>
        </div>
        <div className="bg-gray-900/70 border border-gray-700 rounded-lg p-2 text-gray-300">
          <div className="text-gray-400">First TEMP</div>
          <div className="text-white font-medium">{(tempSeries[0] ?? '-')}</div>
        </div>
        <div className="bg-gray-900/70 border border-gray-700 rounded-lg p-2 text-gray-300">
          <div className="text-gray-400">First PSAL</div>
          <div className="text-white font-medium">{(psalSeries[0] ?? '-')}</div>
        </div>
      </div>

      {/* Snapshot table */}
      <div className="mt-4 overflow-x-auto">
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
            {rows.map((r, idx) => (
              <tr key={idx} className="text-gray-300">
                <td className="py-1.5 px-2 border-b border-gray-800">{r.platform ?? '-'}</td>
                <td className="py-1.5 px-2 border-b border-gray-800 whitespace-nowrap">{r.juld ?? '-'}</td>
                <td className="py-1.5 px-2 border-b border-gray-800">{r.level ?? '-'}</td>
                <td className="py-1.5 px-2 border-b border-gray-800">{r.pres ?? '-'}</td>
                <td className="py-1.5 px-2 border-b border-gray-800">{r.temp ?? '-'}</td>
                <td className="py-1.5 px-2 border-b border-gray-800">{r.psal ?? '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CoreMeasurementsWidget;


