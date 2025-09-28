import React, { useMemo } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import floatsJSON from '../floatdetails.json';

const FloatRegionChart = () => {
  const { categories, counts } = useMemo(() => {
    const map = new Map();
    for (const f of floatsJSON) {
      const region = (f?.ocean_region || 'Unknown');
      map.set(region, (map.get(region) || 0) + 1);
    }
    const entries = Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
    const categories = entries.map(e => e[0]);
    const counts = entries.map(e => e[1]);
    return { categories, counts };
  }, []);

  const options = {
    chart: { type: 'column', backgroundColor: 'transparent', height: 260 },
    title: { text: 'Floats by Ocean Region', style: { color: '#fff', fontSize: '14px' } },
    credits: { enabled: false },
    xAxis: {
      categories,
      labels: { style: { color: '#94a3b8', fontSize: '10px' } },
      gridLineColor: '#374151'
    },
    yAxis: {
      title: { text: 'Count', style: { color: '#94a3b8' } },
      labels: { style: { color: '#94a3b8', fontSize: '10px' } },
      gridLineColor: '#374151'
    },
    legend: { enabled: false },
    series: [{ name: 'Floats', data: counts, color: '#60a5fa' }],
    tooltip: { backgroundColor: 'rgba(0,0,0,0.85)', style: { color: '#fff' } }
  };

  return (
    <div className="bg-black/60 border border-gray-700 rounded-xl p-4">
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default FloatRegionChart;


