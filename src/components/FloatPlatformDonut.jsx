import React, { useMemo } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import floatsJSON from '../floatdetails.json';

const FloatPlatformDonut = () => {
  const data = useMemo(() => {
    const map = new Map();
    for (const f of floatsJSON) {
      if (!f?.PLATFORM_TYPE) continue;
      map.set(f.PLATFORM_TYPE, (map.get(f.PLATFORM_TYPE) || 0) + 1);
    }
    return Array.from(map.entries()).map(([name, y]) => ({ name, y }));
  }, []);

  const options = {
    chart: { type: 'pie', backgroundColor: 'transparent', height: 260 },
    title: { text: 'Platform Types', style: { color: '#fff', fontSize: '14px' } },
    credits: { enabled: false },
    plotOptions: {
      pie: {
        innerSize: '60%',
        dataLabels: { enabled: true, format: '{point.name}: {point.y}', style: { color: '#e5e7eb', textOutline: 'none', fontSize: '10px' } }
      }
    },
    series: [{ name: 'Count', data, colors: ['#60a5fa', '#f472b6', '#34d399', '#f59e0b', '#a78bfa', '#22d3ee'] }],
    tooltip: { backgroundColor: 'rgba(0,0,0,0.85)', style: { color: '#fff' } }
  };

  return (
    <div className="bg-black/60 border border-gray-700 rounded-xl p-4">
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default FloatPlatformDonut;


