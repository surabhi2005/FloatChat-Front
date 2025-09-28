import React, { useMemo } from 'react';
import floatsJSON from '../floatdetails.json';

const FloatStats = () => {
  const { total, projects, platformTypes, regions, activeCount, inactiveCount } = useMemo(() => {
    const total = floatsJSON.length;
    const projects = new Set();
    const platformTypes = new Set();
    const regions = new Set();
    let activeCount = 0;
    let inactiveCount = 0;

    for (const f of floatsJSON) {
      if (f?.PROJECT_NAME) projects.add(f.PROJECT_NAME);
      if (f?.PLATFORM_TYPE) platformTypes.add(f.PLATFORM_TYPE);
      if (f?.ocean_region) regions.add(f.ocean_region);

      // Heuristic activity based on QC flags if present, else default inactive
      const pres = f?.PROFILE_PRES_QC;
      const temp = f?.PROFILE_TEMP_QC;
      const psal = f?.PROFILE_PSAL_QC;
      const isActive = pres === 'A' || temp === 'A' || psal === 'A';
      if (isActive) activeCount += 1; else inactiveCount += 1;
    }

    return {
      total,
      projects: projects.size,
      platformTypes: platformTypes.size,
      regions: regions.size,
      activeCount,
      inactiveCount
    };
  }, []);

  const percentActive = total ? ((activeCount / total) * 100).toFixed(1) : '0.0';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-4 rounded-lg shadow-lg">
        <div className="text-2xl font-bold text-white">{total.toLocaleString()}</div>
        <div className="text-sm text-blue-200">Total Floats</div>
      </div>
      <div className="bg-gradient-to-r from-green-600 to-green-800 p-4 rounded-lg shadow-lg">
        <div className="text-2xl font-bold text-white">{activeCount.toLocaleString()}</div>
        <div className="text-sm text-green-200">Active (QC A)</div>
        <div className="text-xs text-green-300 mt-1">{percentActive}%</div>
      </div>
      <div className="bg-gradient-to-r from-yellow-600 to-yellow-800 p-4 rounded-lg shadow-lg">
        <div className="text-2xl font-bold text-white">{inactiveCount.toLocaleString()}</div>
        <div className="text-sm text-yellow-200">Inactive</div>
      </div>
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 p-4 rounded-lg shadow-lg">
        <div className="text-2xl font-bold text-white">{platformTypes}</div>
        <div className="text-sm text-purple-200">Platform Types</div>
      </div>
      <div className="bg-gradient-to-r from-orange-600 to-orange-800 p-4 rounded-lg shadow-lg">
        <div className="text-2xl font-bold text-white">{projects}</div>
        <div className="text-sm text-orange-200">Projects</div>
      </div>
      <div className="bg-gradient-to-r from-cyan-600 to-cyan-800 p-4 rounded-lg shadow-lg">
        <div className="text-2xl font-bold text-white">{regions}</div>
        <div className="text-sm text-cyan-200">Ocean Regions</div>
      </div>
    </div>
  );
};

export default FloatStats;


