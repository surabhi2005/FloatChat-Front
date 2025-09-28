import React, { useMemo } from 'react';
import floatsJSON from '../floatdetails.json';

const TopProjects = () => {
  const items = useMemo(() => {
    const map = new Map();
    for (const f of floatsJSON) {
      const key = f?.PROJECT_NAME || 'Unknown';
      map.set(key, (map.get(key) || 0) + 1);
    }
    return Array.from(map.entries())
      .map(([project, count]) => ({ project, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, []);

  return (
    <div className="bg-black/60 border border-gray-700 rounded-xl p-4">
      <h3 className="text-white text-sm font-semibold mb-3">Top Projects</h3>
      <ul className="space-y-2 text-sm">
        {items.map((it, i) => (
          <li key={i} className="flex justify-between text-gray-300">
            <span className="truncate pr-2">{it.project}</span>
            <span className="text-white font-medium">{it.count}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TopProjects;


