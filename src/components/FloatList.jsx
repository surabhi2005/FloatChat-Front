import React, { useMemo, useState } from 'react';
import floatsJSON from '../floatdetails.json';

const FloatList = () => {
  const [search, setSearch] = useState('');
  const [platformType, setPlatformType] = useState('All');
  const [region, setRegion] = useState('All');

  const platformTypes = useMemo(() => ['All', ...Array.from(new Set(floatsJSON.map(f => f.PLATFORM_TYPE).filter(Boolean)))], []);
  const regions = useMemo(() => ['All', ...Array.from(new Set(floatsJSON.map(f => f.ocean_region).filter(Boolean)))], []);

  const filtered = useMemo(() => {
    const s = (search || '').toLowerCase();
    return floatsJSON.filter(f => {
      const matchesSearch = String(f.PLATFORM_NUMBER || '').includes(search) ||
        (f.PROJECT_NAME || '').toLowerCase().includes(s) ||
        (f.PI_NAME || '').toLowerCase().includes(s);
      const matchesType = platformType === 'All' || f.PLATFORM_TYPE === platformType;
      const matchesRegion = region === 'All' || f.ocean_region === region;
      return matchesSearch && matchesType && matchesRegion;
    });
  }, [search, platformType, region]);

  return (
    <div className="bg-black/60 border border-gray-700 rounded-xl p-4">
      <div className="flex flex-wrap gap-3 items-end mb-4">
        <div>
          <label className="block text-xs text-gray-400 mb-1">Search</label>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Platform #, project, PI"
            className="bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm w-64 text-white"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">Platform Type</label>
          <select value={platformType} onChange={e => setPlatformType(e.target.value)} className="bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm text-white">
            {platformTypes.map((t, i) => (<option key={i} value={t}>{t}</option>))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">Ocean Region</label>
          <select value={region} onChange={e => setRegion(e.target.value)} className="bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm text-white">
            {regions.map((r, i) => (<option key={i} value={r}>{r}</option>))}
          </select>
        </div>
        <div>
          <button onClick={() => { setSearch(''); setPlatformType('All'); setRegion('All'); }} className="px-3 py-2 bg-red-600 hover:bg-red-700 rounded text-white text-sm">Clear</button>
        </div>
      </div>

      <div className="overflow-x-auto max-h-[60vh] overflow-y-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="text-gray-400">
              <th className="py-2 px-2 border-b border-gray-700">Platform #</th>
              <th className="py-2 px-2 border-b border-gray-700">Type</th>
              <th className="py-2 px-2 border-b border-gray-700">Project</th>
              <th className="py-2 px-2 border-b border-gray-700">PI</th>
              <th className="py-2 px-2 border-b border-gray-700">Region</th>
              <th className="py-2 px-2 border-b border-gray-700">Lat</th>
              <th className="py-2 px-2 border-b border-gray-700">Lon</th>
              <th className="py-2 px-2 border-b border-gray-700">PRES QC</th>
              <th className="py-2 px-2 border-b border-gray-700">TEMP QC</th>
              <th className="py-2 px-2 border-b border-gray-700">PSAL QC</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((f, idx) => (
              <tr key={idx} className="text-gray-200 hover:bg-gray-800/60">
                <td className="py-2 px-2 border-b border-gray-800">{f.PLATFORM_NUMBER}</td>
                <td className="py-2 px-2 border-b border-gray-800 whitespace-nowrap">{f.PLATFORM_TYPE}</td>
                <td className="py-2 px-2 border-b border-gray-800 whitespace-nowrap">{f.PROJECT_NAME}</td>
                <td className="py-2 px-2 border-b border-gray-800 whitespace-nowrap">{f.PI_NAME}</td>
                <td className="py-2 px-2 border-b border-gray-800 whitespace-nowrap">{f.ocean_region || '-'}</td>
                <td className="py-2 px-2 border-b border-gray-800">{(Number(f.LATITUDE)).toFixed?.(2) ?? f.LATITUDE}</td>
                <td className="py-2 px-2 border-b border-gray-800">{(Number(f.LONGITUDE)).toFixed?.(2) ?? f.LONGITUDE}</td>
                <td className="py-2 px-2 border-b border-gray-800">{f.PROFILE_PRES_QC}</td>
                <td className="py-2 px-2 border-b border-gray-800">{f.PROFILE_TEMP_QC}</td>
                <td className="py-2 px-2 border-b border-gray-800">{f.PROFILE_PSAL_QC}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FloatList;


