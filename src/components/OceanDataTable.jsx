import React, { useState } from "react";
import { ChevronDown, ChevronUp, Search, Filter } from "lucide-react";

const OceanDataTable = ({ data, title, columns, description, color = "cyan" }) => {
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState(data);

  const handleSort = (field) => {
    const direction = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortDirection(direction);
    
    const sorted = [...filteredData].sort((a, b) => {
      if (direction === 'asc') {
        return a[field] > b[field] ? 1 : -1;
      } else {
        return a[field] < b[field] ? 1 : -1;
      }
    });
    setFilteredData(sorted);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    const filtered = data.filter(item =>
      Object.values(item).some(value =>
        value.toString().toLowerCase().includes(term.toLowerCase())
      )
    );
    setFilteredData(filtered);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'high': return 'text-red-400';
      case 'normal': return 'text-green-400';
      case 'low': return 'text-yellow-400';
      case 'excellent': return 'text-green-400';
      case 'good': return 'text-blue-400';
      case 'moderate': return 'text-yellow-400';
      case 'poor': return 'text-red-400';
      case 'increasing': return 'text-green-400';
      case 'decreasing': return 'text-red-400';
      case 'stable': return 'text-blue-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl border border-gray-600/30 rounded-2xl p-6 shadow-2xl hover:shadow-cyan-500/20 transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
          <p className="text-gray-400 text-sm">{description}</p>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-cyan-400" />
          <span className="text-sm text-gray-400">Data Table</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search data..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-600/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-600/30">
              {columns.map((column, index) => (
                <th
                  key={index}
                  className="text-left py-3 px-4 text-sm font-semibold text-gray-300 cursor-pointer hover:text-cyan-400 transition-colors duration-200"
                  onClick={() => handleSort(column.key)}
                >
                  <div className="flex items-center gap-2">
                    {column.label}
                    {sortField === column.key && (
                      sortDirection === 'asc' ? 
                        <ChevronUp className="w-4 h-4" /> : 
                        <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-b border-gray-700/30 hover:bg-gray-800/30 transition-colors duration-200">
                {columns.map((column, colIndex) => (
                  <td key={colIndex} className="py-3 px-4 text-sm">
                    {column.key === 'status' || column.key === 'trend' ? (
                      <span className={`font-medium ${getStatusColor(row[column.key])}`}>
                        {row[column.key]}
                      </span>
                    ) : (
                      <span className="text-gray-300">{row[column.key]}</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      <div className="mt-4 flex items-center justify-between text-sm text-gray-400">
        <span>Showing {filteredData.length} of {data.length} records</span>
        <div className="flex items-center gap-4">
          <span>Sort by: {sortField || 'None'}</span>
          <span>Order: {sortDirection}</span>
        </div>
      </div>
    </div>
  );
};

export default OceanDataTable;
