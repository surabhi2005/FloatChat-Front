import React, { useState, useEffect } from "react";
import { BarChart3, Table, TrendingUp, Activity, Waves, Thermometer, Droplets, Wind } from "lucide-react";
import OceanBarChart from "./OceanBarChart";
import OceanDataTable from "./OceanDataTable";
import enhancedOceanData from "../data/enhancedOceanData";

const ComprehensiveOceanAnalytics = () => {
  const [selectedTab, setSelectedTab] = useState('pressure');
  const [liveData, setLiveData] = useState({});

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveData({
        pressure: 101325 + Math.random() * 1000,
        temperature: 25 + Math.random() * 5,
        salinity: 35 + Math.random() * 2,
        oxygen: 8 + Math.random() * 2
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const pressureData = Object.entries(enhancedOceanData.oceanPressureData).map(([zone, data]) => ({
    name: zone.charAt(0).toUpperCase() + zone.slice(1),
    value: data.pressure.value / 1000, // Convert to kPa
    depth: data.depth.value,
    temperature: data.temperature.value,
    salinity: data.salinity.value
  }));

  const nutrientsData = Object.entries(enhancedOceanData.oceanNutrientsData.nitrate).map(([zone, data]) => ({
    name: zone.charAt(0).toUpperCase() + zone.slice(1),
    value: data.value,
    status: data.status
  }));

  const waterQualityData = Object.entries(enhancedOceanData.waterQualityData.turbidity).map(([zone, data]) => ({
    name: zone.charAt(0).toUpperCase() + zone.slice(1),
    value: data.value,
    status: data.status
  }));

  const marineLifeData = Object.entries(enhancedOceanData.marineLifeData.phytoplankton).map(([metric, data]) => ({
    name: metric.charAt(0).toUpperCase() + metric.slice(1),
    value: metric === 'density' ? data.value / 1000 : data.value,
    unit: metric === 'density' ? 'K cells/mL' : data.unit,
    trend: data.trend
  }));

  const tabs = [
    { id: 'pressure', label: 'Pressure Analysis', icon: BarChart3, color: 'text-blue-400' },
    { id: 'nutrients', label: 'Nutrients', icon: Droplets, color: 'text-green-400' },
    { id: 'quality', label: 'Water Quality', icon: Waves, color: 'text-cyan-400' },
    { id: 'marine', label: 'Marine Life', icon: Activity, color: 'text-purple-400' },
    { id: 'tables', label: 'Data Tables', icon: Table, color: 'text-yellow-400' }
  ];

  const renderContent = () => {
    switch (selectedTab) {
      case 'pressure':
        return (
          <div className="space-y-6">
            <OceanBarChart
              data={pressureData}
              title="Ocean Pressure by Depth"
              color="#3b82f6"
              unit="kPa"
              description="Pressure measurements across different ocean depths"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(enhancedOceanData.oceanPressureData).map(([zone, data]) => (
                <div key={zone} className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl border border-gray-600/30 rounded-xl p-4 shadow-lg hover:shadow-blue-500/20 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                      <Thermometer className="w-5 h-5 text-blue-400" />
                    </div>
                    <h4 className="text-white font-semibold capitalize">{zone} Zone</h4>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400 text-sm">Pressure:</span>
                      <span className="text-white font-medium">{(data.pressure.value / 1000).toFixed(1)} kPa</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400 text-sm">Depth:</span>
                      <span className="text-white font-medium">{data.depth.value} m</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400 text-sm">Temp:</span>
                      <span className="text-white font-medium">{data.temperature.value}°C</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'nutrients':
        return (
          <div className="space-y-6">
            <OceanBarChart
              data={nutrientsData}
              title="Nutrient Concentrations by Depth"
              color="#10b981"
              unit="mg/L"
              description="Nitrate concentrations across ocean depth zones"
            />
            <OceanDataTable
              data={enhancedOceanData.nutrientConcentrationTable}
              title="Nutrient Concentration Table"
              columns={[
                { key: 'nutrient', label: 'Nutrient' },
                { key: 'surface', label: 'Surface' },
                { key: 'shallow', label: 'Shallow' },
                { key: 'medium', label: 'Medium' },
                { key: 'deep', label: 'Deep' },
                { key: 'status', label: 'Status' }
              ]}
              description="Comprehensive nutrient analysis across ocean zones"
            />
          </div>
        );

      case 'quality':
        return (
          <div className="space-y-6">
            <OceanBarChart
              data={waterQualityData}
              title="Water Quality Parameters"
              color="#06b6d4"
              unit="NTU"
              description="Turbidity measurements across ocean depth zones"
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Object.entries(enhancedOceanData.waterQualityData).map(([parameter, data]) => (
                <div key={parameter} className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl border border-gray-600/30 rounded-xl p-6 shadow-lg hover:shadow-cyan-500/20 transition-all duration-300">
                  <h4 className="text-white font-semibold mb-4 capitalize">{parameter.replace(/([A-Z])/g, ' $1').trim()}</h4>
                  <div className="space-y-3">
                    {Object.entries(data).map(([zone, values]) => (
                      <div key={zone} className="flex justify-between items-center">
                        <span className="text-gray-400 text-sm capitalize">{zone}:</span>
                        <div className="flex items-center gap-2">
                          <span className="text-white font-medium">{values.value} {values.unit}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            values.status === 'excellent' ? 'bg-green-500/20 text-green-400' :
                            values.status === 'good' ? 'bg-blue-500/20 text-blue-400' :
                            values.status === 'moderate' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {values.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'marine':
        return (
          <div className="space-y-6">
            <OceanBarChart
              data={marineLifeData}
              title="Marine Life Biomass"
              color="#8b5cf6"
              unit="mg/m³"
              description="Phytoplankton biomass and density measurements"
            />
            <OceanDataTable
              data={enhancedOceanData.marineLifeTable}
              title="Marine Life Data Table"
              columns={[
                { key: 'organism', label: 'Organism' },
                { key: 'density', label: 'Density' },
                { key: 'biomass', label: 'Biomass' },
                { key: 'diversity', label: 'Diversity' },
                { key: 'trend', label: 'Trend' }
              ]}
              description="Comprehensive marine life analysis and biodiversity data"
            />
          </div>
        );

      case 'tables':
        return (
          <div className="space-y-6">
            <OceanDataTable
              data={enhancedOceanData.oceanZonesTable}
              title="Ocean Zones Data Table"
              columns={[
                { key: 'zone', label: 'Zone' },
                { key: 'depth', label: 'Depth' },
                { key: 'pressure', label: 'Pressure' },
                { key: 'temperature', label: 'Temperature' },
                { key: 'salinity', label: 'Salinity' },
                { key: 'oxygen', label: 'Oxygen' }
              ]}
              description="Complete ocean zones data with pressure, temperature, and chemical properties"
            />
            <OceanDataTable
              data={enhancedOceanData.marineLifeTable}
              title="Marine Life Biodiversity"
              columns={[
                { key: 'organism', label: 'Organism' },
                { key: 'density', label: 'Density' },
                { key: 'biomass', label: 'Biomass' },
                { key: 'diversity', label: 'Diversity' },
                { key: 'trend', label: 'Trend' }
              ]}
              description="Marine life biodiversity and population data"
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Comprehensive Ocean Analytics</h2>
        <p className="text-gray-400">Advanced ocean data analysis with bar charts, tables, and Pascal values</p>
      </div>

      {/* Live Data Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl border border-gray-600/30 rounded-xl p-4 shadow-lg hover:shadow-blue-500/20 transition-all duration-300">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <BarChart3 className="w-5 h-5 text-blue-400" />
            </div>
            <span className="text-gray-400 text-sm">Pressure</span>
          </div>
          <div className="text-2xl font-bold text-white">{(liveData.pressure / 1000).toFixed(1)} kPa</div>
          <div className="text-xs text-gray-500">Atmospheric</div>
        </div>
        <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl border border-gray-600/30 rounded-xl p-4 shadow-lg hover:shadow-red-500/20 transition-all duration-300">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-red-500/20 rounded-lg">
              <Thermometer className="w-5 h-5 text-red-400" />
            </div>
            <span className="text-gray-400 text-sm">Temperature</span>
          </div>
          <div className="text-2xl font-bold text-white">{liveData.temperature?.toFixed(1)}°C</div>
          <div className="text-xs text-gray-500">Surface</div>
        </div>
        <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl border border-gray-600/30 rounded-xl p-4 shadow-lg hover:shadow-cyan-500/20 transition-all duration-300">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-cyan-500/20 rounded-lg">
              <Droplets className="w-5 h-5 text-cyan-400" />
            </div>
            <span className="text-gray-400 text-sm">Salinity</span>
          </div>
          <div className="text-2xl font-bold text-white">{liveData.salinity?.toFixed(1)} PSU</div>
          <div className="text-xs text-gray-500">Surface</div>
        </div>
        <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl border border-gray-600/30 rounded-xl p-4 shadow-lg hover:shadow-green-500/20 transition-all duration-300">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <Wind className="w-5 h-5 text-green-400" />
            </div>
            <span className="text-gray-400 text-sm">Oxygen</span>
          </div>
          <div className="text-2xl font-bold text-white">{liveData.oxygen?.toFixed(1)} mg/L</div>
          <div className="text-xs text-gray-500">Dissolved</div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
              selectedTab === tab.id
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
                : 'bg-gray-800/50 text-gray-400 border border-gray-700/50 hover:bg-gray-700/50'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {renderContent()}
    </div>
  );
};

export default ComprehensiveOceanAnalytics;
