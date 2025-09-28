import React, { useMemo, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import coreManifest from '../data/01/manifest-core_measurements.json';

const FloatProfileScatter = () => {
  const [maxPoints, setMaxPoints] = useState(500);
  const [levelMin, setLevelMin] = useState(0);
  const [levelMax, setLevelMax] = useState(1000);

  const head = coreManifest.sample_parquet_head || {};

  const data = useMemo(() => {
    const temp = head.TEMP || [];
    const psal = head.PSAL || [];
    const level = head.level_index || [];
    const pts = [];
    for (let i = 0; i < Math.min(temp.length, psal.length, level.length); i++) {
      const lv = Number(level[i]);
      if (isNaN(lv)) continue;
      if (lv < levelMin || lv > levelMax) continue;
      const t = Number(temp[i]);
      const s = Number(psal[i]);
      if (isNaN(t) || isNaN(s)) continue;
      pts.push([s, t]);
      if (pts.length >= maxPoints) break;
    }
    return pts;
  }, [head, maxPoints, levelMin, levelMax]);

  const options = {
    chart: { type: 'scatter', backgroundColor: 'transparent', height: 280 },
    title: { text: 'TEMP vs PSAL Scatter', style: { color: '#fff', fontSize: '14px' } },
    credits: { enabled: false },
    xAxis: { title: { text: 'PSAL (PSU)', style: { color: '#94a3b8' } }, labels: { style: { color: '#94a3b8', fontSize: '10px' } }, gridLineColor: '#374151' },
    yAxis: { title: { text: 'TEMP (°C)', style: { color: '#94a3b8' } }, labels: { style: { color: '#94a3b8', fontSize: '10px' } }, gridLineColor: '#374151' },
    legend: { enabled: false },
    series: [{ name: 'Points', data, color: '#f59e0b' }],
    tooltip: { pointFormat: '<b>PSAL</b>: {point.x:.2f}<br/><b>TEMP</b>: {point.y:.2f}', backgroundColor: 'rgba(0,0,0,0.85)', style: { color: '#fff' } }
  };

  return (
    <div className="bg-black/60 border border-gray-700 rounded-xl p-4">
      <div className="flex flex-wrap items-center gap-3 mb-3">
        <label className="text-xs text-gray-300">Max Points</label>
        <input type="number" min={50} max={5000} step={50} value={maxPoints} onChange={e => setMaxPoints(Number(e.target.value))} className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm w-24" />
        <label className="text-xs text-gray-300 ml-2">Level Min</label>
        <input type="number" value={levelMin} onChange={e => setLevelMin(Number(e.target.value))} className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm w-24" />
        <label className="text-xs text-gray-300 ml-2">Level Max</label>
        <input type="number" value={levelMax} onChange={e => setLevelMax(Number(e.target.value))} className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm w-24" />
      </div>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default FloatProfileScatter;


