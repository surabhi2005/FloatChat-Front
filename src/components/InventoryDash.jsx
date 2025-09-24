import React, { useState } from 'react';
import { 
  Database, Download, Eye, BarChart3, MapPin, Clock, 
  Battery, Wifi, AlertTriangle, CheckCircle, Filter,
  Search, Grid, List, Settings, Share2, ExternalLink,
  Thermometer, Droplets, Activity, Waves, Wind, Target,
  ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Beams from './Beams';

const InventoryDash = () => {
  const navigate = useNavigate();
  const [selectedDataset, setSelectedDataset] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  // Comprehensive dataset inventory
  const datasets = [
    {
      id: 1,
      name: "ARGO Float Indian Ocean – 2023",
      dataSource: "Argo Global Repository",
      type: "Temperature, Salinity, Pressure, Oxygen",
      format: "NetCDF",
      size: "2.4 GB",
      updateFrequency: "Daily",
      coverage: "Indian Ocean",
      floatId: "ARGO-7901",
      deploymentDate: "2023-01-15",
      deploymentLocation: "15.5°N, 87.2°E",
      status: "Active",
      lastTransmission: "2024-01-20 14:30:00",
      batteryLife: "85%",
      health: "Excellent",
      visualizations: ["Depth-Time Plot", "Profile Comparison", "Map Trajectory", "Polygon Plots"],
      accessLevel: "Public",
      downloadOptions: ["CSV", "NetCDF", "ASCII", "JSON"],
      recordCount: "1.2M",
      dataQuality: "Validated",
      lastAccessed: "Dr. Sarah Chen - Oceanographer",
      description: "Comprehensive oceanographic data from ARGO float network in the Indian Ocean region, providing real-time temperature, salinity, and pressure measurements."
    },
    {
      id: 2,
      name: "INCOIS Arabian Sea BGC Parameters",
      dataSource: "INCOIS - Indian National Centre for Ocean Information Services",
      type: "Biogeochemical, Chlorophyll, Nutrients",
      format: "CSV",
      size: "850 MB",
      updateFrequency: "Weekly",
      coverage: "Arabian Sea",
      floatId: "INCOIS-BGC-001",
      deploymentDate: "2023-03-22",
      deploymentLocation: "18.3°N, 68.2°E",
      status: "Active",
      lastTransmission: "2024-01-19 09:15:00",
      batteryLife: "92%",
      health: "Excellent",
      visualizations: ["Chlorophyll Maps", "Nutrient Profiles", "BGC Time Series"],
      accessLevel: "Restricted",
      downloadOptions: ["CSV", "JSON"],
      recordCount: "450K",
      dataQuality: "Pending QC",
      lastAccessed: "Prof. Rajesh Kumar - Marine Biologist",
      description: "Biogeochemical parameters including chlorophyll-a, nutrients, and dissolved oxygen from the Arabian Sea monitoring network."
    },
    {
      id: 3,
      name: "Global ARGO Temperature Profiles",
      dataSource: "Argo Global Repository",
      type: "Temperature, Salinity, Pressure",
      format: "NetCDF",
      size: "5.8 GB",
      updateFrequency: "Daily",
      coverage: "Global",
      floatId: "ARGO-GLOBAL-2023",
      deploymentDate: "2023-01-01",
      deploymentLocation: "Multiple",
      status: "Active",
      lastTransmission: "2024-01-20 12:00:00",
      batteryLife: "78%",
      health: "Good",
      visualizations: ["Global Maps", "Depth Profiles", "Time Series", "3D Visualization"],
      accessLevel: "Public",
      downloadOptions: ["NetCDF", "CSV", "ASCII"],
      recordCount: "3.2M",
      dataQuality: "Validated",
      lastAccessed: "Dr. Michael Torres - Climate Scientist",
      description: "Global ocean temperature and salinity profiles from the international ARGO float network, essential for climate monitoring and ocean modeling."
    },
    {
      id: 4,
      name: "Bay of Bengal Coastal Monitoring",
      dataSource: "INCOIS Coastal Monitoring Network",
      type: "Temperature, Salinity, Currents, Waves",
      format: "SQL Database",
      size: "1.1 GB",
      updateFrequency: "Hourly",
      coverage: "Bay of Bengal",
      floatId: "INCOIS-COASTAL-001",
      deploymentDate: "2023-06-10",
      deploymentLocation: "12.8°N, 84.5°E",
      status: "Active",
      lastTransmission: "2024-01-20 15:45:00",
      batteryLife: "88%",
      health: "Excellent",
      visualizations: ["Current Maps", "Wave Heights", "Coastal Profiles", "Real-time Dashboard"],
      accessLevel: "Admin Only",
      downloadOptions: ["SQL Export", "CSV", "JSON"],
      recordCount: "2.8M",
      dataQuality: "Validated",
      lastAccessed: "Admin - System Administrator",
      description: "High-frequency coastal monitoring data from the Bay of Bengal, including current measurements, wave data, and coastal water quality parameters."
    },
    {
      id: 5,
      name: "Deep Ocean Pressure Sensors",
      dataSource: "Deep Ocean Research Institute",
      type: "Pressure, Temperature, Depth",
      format: "Parquet",
      size: "3.2 GB",
      updateFrequency: "Monthly",
      coverage: "Indian Ocean Deep",
      floatId: "DEEP-OCEAN-001",
      deploymentDate: "2023-09-15",
      deploymentLocation: "5.2°N, 85.7°E",
      status: "Inactive",
      lastTransmission: "2023-12-15 08:30:00",
      batteryLife: "15%",
      health: "Critical",
      visualizations: ["Depth Profiles", "Pressure Time Series", "Deep Ocean Maps"],
      accessLevel: "Restricted",
      downloadOptions: ["Parquet", "CSV", "NetCDF"],
      recordCount: "890K",
      dataQuality: "Validated",
      lastAccessed: "Dr. Elena Rodriguez - Deep Ocean Researcher",
      description: "Deep ocean pressure and temperature measurements from specialized deep-sea sensors, providing insights into deep ocean circulation patterns."
    },
    {
      id: 6,
      name: "Marine Weather Station Network",
      dataSource: "Marine Weather Service",
      type: "Wind, Humidity, Atmospheric Pressure, Sea State",
      format: "JSON",
      size: "650 MB",
      updateFrequency: "Every 6 hours",
      coverage: "Indian Ocean",
      floatId: "WEATHER-NET-001",
      deploymentDate: "2023-04-20",
      deploymentLocation: "10.2°N, 79.4°E",
      status: "Active",
      lastTransmission: "2024-01-20 18:00:00",
      batteryLife: "95%",
      health: "Excellent",
      visualizations: ["Weather Maps", "Wind Patterns", "Atmospheric Profiles", "Storm Tracking"],
      accessLevel: "Public",
      downloadOptions: ["JSON", "CSV", "XML"],
      recordCount: "1.8M",
      dataQuality: "Validated",
      lastAccessed: "Weather Service - Meteorologist",
      description: "Comprehensive marine weather data including wind patterns, atmospheric pressure, humidity, and sea state conditions across the Indian Ocean region."
    }
  ];

  const filteredDatasets = datasets.filter(dataset => {
    const matchesSearch = dataset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dataset.dataSource.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dataset.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || 
                         (filterType === 'active' && dataset.status === 'Active') ||
                         (filterType === 'inactive' && dataset.status === 'Inactive') ||
                         (filterType === 'public' && dataset.accessLevel === 'Public') ||
                         (filterType === 'restricted' && dataset.accessLevel === 'Restricted');
    return matchesSearch && matchesFilter;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Active': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'Inactive': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getHealthColor = (health) => {
    switch (health) {
      case 'Excellent': return 'text-green-500';
      case 'Good': return 'text-blue-500';
      case 'Critical': return 'text-red-500';
      default: return 'text-yellow-500';
    }
  };

  const getAccessLevelColor = (level) => {
    switch (level) {
      case 'Public': return 'bg-green-100 text-green-800';
      case 'Restricted': return 'bg-yellow-100 text-yellow-800';
      case 'Admin Only': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black font-sans">
      {/* 3D Beam Background */}
      <div className="absolute inset-0 w-full h-full z-0">
        <Beams
          beamWidth={3}
          beamHeight={20}
          beamNumber={15}
          lightColor="#ffffff"
          speed={1.5}
          noiseIntensity={0.2}
          scale={0.03}
          rotation={0}
        />
      </div>

      {/* Back Button - Top Left */}
      <div className="absolute top-6 left-6 z-20">
        <button
          onClick={() => navigate(-1)}
          className="text-white text-lg font-bold hover:text-cyan-400 transition-all duration-300 hover:scale-110 drop-shadow-lg hover:drop-shadow-cyan-400/50"
        >
          ← Back
        </button>
      </div>

      {/* Main Content */}
      <div className="relative z-10 p-6 h-full overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">
              Ocean Data Inventory
            </h1>
            <p className="text-xl text-gray-300">
              Comprehensive repository of oceanographic datasets from ARGO floats, 
              coastal monitoring networks, and marine research stations
            </p>
          </div>

          {/* Search and Filters */}
          <div className="mb-6 flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search datasets, sources, or parameters..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              >
                <option value="all">All Datasets</option>
                <option value="active">Active Only</option>
                <option value="inactive">Inactive</option>
                <option value="public">Public Access</option>
                <option value="restricted">Restricted</option>
              </select>
              <div className="flex bg-gray-800/50 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-cyan-600 text-white' : 'text-gray-400 hover:text-gray-200'}`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-cyan-600 text-white' : 'text-gray-400 hover:text-gray-200'}`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Dataset Grid/List */}
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6' : 'space-y-4'}>
            {filteredDatasets.map((dataset) => (
              <div
                key={dataset.id}
                className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl border border-gray-600/30 rounded-xl p-6 hover:scale-[1.02] hover:border-cyan-500/20 transition-all duration-300 shadow-lg hover:shadow-cyan-500/20"
              >
                {/* Dataset Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-2">{dataset.name}</h3>
                    <div className="flex items-center gap-2 mb-2">
                      {getStatusIcon(dataset.status)}
                      <span className="text-sm text-gray-300">{dataset.status}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAccessLevelColor(dataset.accessLevel)}`}>
                        {dataset.accessLevel}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedDataset(dataset)}
                    className="p-2 text-gray-400 hover:text-gray-200 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <Settings className="w-5 h-5" />
                  </button>
                </div>

                {/* Dataset Details */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Database className="w-4 h-4 text-cyan-400" />
                    <span className="text-gray-300">Source:</span>
                    <span className="text-white">{dataset.dataSource}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <Target className="w-4 h-4 text-green-400" />
                    <span className="text-gray-300">Type:</span>
                    <span className="text-white">{dataset.type}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-blue-400" />
                    <span className="text-gray-300">Coverage:</span>
                    <span className="text-white">{dataset.coverage}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-yellow-400" />
                    <span className="text-gray-300">Updated:</span>
                    <span className="text-white">{dataset.updateFrequency}</span>
                  </div>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-800/50 rounded-lg p-3">
                    <div className="text-2xl font-bold text-white">{dataset.recordCount}</div>
                    <div className="text-xs text-gray-400">Records</div>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-3">
                    <div className="text-2xl font-bold text-white">{dataset.size}</div>
                    <div className="text-xs text-gray-400">Size</div>
                  </div>
                </div>

                {/* Float/Sensor Info */}
                <div className="border-t border-gray-700 pt-4 mb-4">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-400">Float ID:</span>
                      <div className="text-white font-mono">{dataset.floatId}</div>
                    </div>
                    <div>
                      <span className="text-gray-400">Battery:</span>
                      <div className={`font-semibold ${getHealthColor(dataset.health)}`}>
                        {dataset.batteryLife}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-400">Health:</span>
                      <div className={`font-semibold ${getHealthColor(dataset.health)}`}>
                        {dataset.health}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-400">Last TX:</span>
                      <div className="text-white text-xs">{dataset.lastTransmission}</div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
                    <Eye className="w-4 h-4" />
                    Preview
                  </button>
                  <button className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
                    <BarChart3 className="w-4 h-4" />
                    Dashboard
                  </button>
                  <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
                    <Download className="w-4 h-4" />
                    Export
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Dataset Detail Modal */}
          {selectedDataset && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-gray-900 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-2">{selectedDataset.name}</h2>
                      <p className="text-gray-300">{selectedDataset.description}</p>
                    </div>
                    <button
                      onClick={() => setSelectedDataset(null)}
                      className="text-gray-400 hover:text-gray-200"
                    >
                      <ExternalLink className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Dataset Details */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-white">Dataset Information</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Data Source:</span>
                          <span className="text-white">{selectedDataset.dataSource}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Format:</span>
                          <span className="text-white">{selectedDataset.format}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Size:</span>
                          <span className="text-white">{selectedDataset.size}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Update Frequency:</span>
                          <span className="text-white">{selectedDataset.updateFrequency}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Coverage:</span>
                          <span className="text-white">{selectedDataset.coverage}</span>
                        </div>
                      </div>
                    </div>

                    {/* Float/Sensor Details */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-white">Sensor Information</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Float ID:</span>
                          <span className="text-white font-mono">{selectedDataset.floatId}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Deployment Date:</span>
                          <span className="text-white">{selectedDataset.deploymentDate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Location:</span>
                          <span className="text-white">{selectedDataset.deploymentLocation}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Status:</span>
                          <span className="text-white">{selectedDataset.status}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Battery Life:</span>
                          <span className={`font-semibold ${getHealthColor(selectedDataset.health)}`}>
                            {selectedDataset.batteryLife}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Visualizations and Access */}
                  <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Available Visualizations</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedDataset.visualizations.map((viz, index) => (
                          <span key={index} className="bg-cyan-600/20 text-cyan-300 px-3 py-1 rounded-full text-sm">
                            {viz}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Download Options</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedDataset.downloadOptions.map((format, index) => (
                          <span key={index} className="bg-green-600/20 text-green-300 px-3 py-1 rounded-full text-sm">
                            {format}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-6 flex gap-3">
                    <button className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2">
                      <Eye className="w-5 h-5" />
                      Preview Data
                    </button>
                    <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      Add to Dashboard
                    </button>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2">
                      <Download className="w-5 h-5" />
                      Export Dataset
                    </button>
                    <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2">
                      <Share2 className="w-5 h-5" />
                      Compare
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InventoryDash;