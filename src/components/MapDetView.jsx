
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Beams from './Beams'; // Assuming Beams component is in the same directory

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icon for markers
const createCustomIcon = (color) => {
  return new L.Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
        <circle cx="16" cy="16" r="14" fill="${color}" stroke="#7F7F7F" stroke-width="2"/>
        <circle cx="16" cy="12" r="4" fill="#FFFFFF"/>
      </svg>
    `)}`,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
};

const MapDetView = () => {
  const [data, setData] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [filter, setFilter] = useState('');
  const [timeFilter, setTimeFilter] = useState('all');
  const [systemFilter, setSystemFilter] = useState('all');
  const [mapView, setMapView] = useState('satellite'); // Changed default to satellite
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [showStatistics, setShowStatistics] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [isBeamVisible, setIsBeamVisible] = useState(true);

  useEffect(() => {
    // Parse the provided JSON data with more spread out locations
    const jsonData = [
  {"profile_index": 0, "LATITUDE": -15.9896, "LONGITUDE": 90.3067, "JULD": 1756770920000, "JULD_LOCATION": 1756771895000, "POSITIONING_SYSTEM": "GPS", "DIRECTION": "A", "PLATFORM_NUMBER": 5905529, "PROJECT_NAME": "Argo Australia", "PI_NAME": "Peter OKE"},
  {"profile_index": 1, "LATITUDE": -43.037, "LONGITUDE": 130.202, "JULD": 1756769479000, "JULD_LOCATION": 1756773668000, "POSITIONING_SYSTEM": "IRIDIUM", "DIRECTION": "A", "PLATFORM_NUMBER": 5906256, "PROJECT_NAME": "UW, Argo", "PI_NAME": "STEPHEN RISER"},
  {"profile_index": 2, "LATITUDE": -41.3693, "LONGITUDE": 142.6767, "JULD": 1756769160000, "JULD_LOCATION": 1756769813000, "POSITIONING_SYSTEM": "GPS", "DIRECTION": "A", "PLATFORM_NUMBER": 5905553, "PROJECT_NAME": "Argo Australia", "PI_NAME": "Christina SCHALLENBERG"},
  {"profile_index": 3, "LATITUDE": -54.2695, "LONGITUDE": 47.7197, "JULD": 1756768920000, "JULD_LOCATION": 1756769850000, "POSITIONING_SYSTEM": "GPS", "DIRECTION": "A", "PLATFORM_NUMBER": 1902491, "PROJECT_NAME": "GO-BGC, WHOI", "PI_NAME": "DAVID NICHOLSON, SUSAN WIJFFELS"},
  {"profile_index": 4, "LATITUDE": -18.7639, "LONGITUDE": 85.0806, "JULD": 1756768740000, "JULD_LOCATION": 1756768740000, "POSITIONING_SYSTEM": "GPS", "DIRECTION": "A", "PLATFORM_NUMBER": 5902490, "PROJECT_NAME": "Argo SIO", "PI_NAME": "DEAN ROEMMICH"},
  {"profile_index": 77, "LATITUDE": -2.4811, "LONGITUDE": 99.3107, "JULD": 1756771798000, "JULD_LOCATION": 1756772040000, "POSITIONING_SYSTEM": "GPS", "DIRECTION": "A", "PLATFORM_NUMBER": 7901117, "PROJECT_NAME": "Argo SIO", "PI_NAME": "SARAH PURKEY, DEAN ROEMMICH, NATHALIE ZILBERMAN, JOHN GILSON"},
  {"profile_index": 8, "LATITUDE": -33.8688, "LONGITUDE": 151.2093, "JULD": 1756772300000, "JULD_LOCATION": 1756773300000, "POSITIONING_SYSTEM": "IRIDIUM", "DIRECTION": "A", "PLATFORM_NUMBER": 5905557, "PROJECT_NAME": "Argo Australia", "PI_NAME": "Bob MARTIN"},
  {"profile_index": 100, "LATITUDE": -10.5, "LONGITUDE": 55.3, "JULD": 1756774000000, "JULD_LOCATION": 1756775000000, "POSITIONING_SYSTEM": "GPS", "DIRECTION": "A", "PLATFORM_NUMBER": 7902001, "PROJECT_NAME": "Argo Indian Ocean", "PI_NAME": "Test PI 1"},
  {"profile_index": 101, "LATITUDE": -25.2, "LONGITUDE": 60.7, "JULD": 1756774100000, "JULD_LOCATION": 1756775100000, "POSITIONING_SYSTEM": "IRIDIUM", "DIRECTION": "A", "PLATFORM_NUMBER": 7902002, "PROJECT_NAME": "Argo Indian Ocean", "PI_NAME": "Test PI 2"},
  {"profile_index": 102, "LATITUDE": 5.6, "LONGITUDE": 75.0, "JULD": 1756774200000, "JULD_LOCATION": 1756775200000, "POSITIONING_SYSTEM": "GPS", "DIRECTION": "A", "PLATFORM_NUMBER": 7902003, "PROJECT_NAME": "Argo  Indian Ocean", "PI_NAME": "Test PI 3"},
  {"profile_index": 103, "LATITUDE": -15.0, "LONGITUDE": 80.5, "JULD": 1756774300000, "JULD_LOCATION": 1756775300000, "POSITIONING_SYSTEM": "IRIDIUM", "DIRECTION": "A", "PLATFORM_NUMBER": 7902004, "PROJECT_NAME": "Argo Indian Ocean", "PI_NAME": "Test PI 4"},
  {"profile_index": 104, "LATITUDE": -30.8, "LONGITUDE": 90.2, "JULD": 1756774400000, "JULD_LOCATION": 1756775400000, "POSITIONING_SYSTEM": "GPS", "DIRECTION": "A", "PLATFORM_NUMBER": 7902005, "PROJECT_NAME": "Argo Indian Ocean", "PI_NAME": "Test PI 5"}
];

    
    setData(jsonData);
  }, []);

  // Filter data based on search input and filters
  const filteredData = useMemo(() => {
    const now = Date.now();
    const sevenDaysAgo = now - (7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = now - (30 * 24 * 60 * 60 * 1000);
    
    return data.filter(item => {
      // Text filter
      const textMatch = 
        item.PROJECT_NAME.toLowerCase().includes(filter.toLowerCase()) ||
        item.PI_NAME.toLowerCase().includes(filter.toLowerCase()) ||
        item.PLATFORM_NUMBER.toString().includes(filter);
      
      // Time filter
      let timeMatch = true;
      if (timeFilter === 'week') {
        timeMatch = item.JULD >= sevenDaysAgo;
      } else if (timeFilter === 'month') {
        timeMatch = item.JULD >= thirtyDaysAgo;
      }
      
      // System filter
      const systemMatch = systemFilter === 'all' || item.POSITIONING_SYSTEM === systemFilter;
      
      return textMatch && timeMatch && systemMatch;
    });
  }, [data, filter, timeFilter, systemFilter]);

  // Get unique positioning systems for filter
  const positioningSystems = useMemo(() => {
    const systems = new Set(data.map(item => item.POSITIONING_SYSTEM));
    return Array.from(systems);
  }, [data]);

  // Statistics calculations
  const stats = useMemo(() => {
    const total = filteredData.length;
    const bySystem = filteredData.reduce((acc, item) => {
      acc[item.POSITIONING_SYSTEM] = (acc[item.POSITIONING_SYSTEM] || 0) + 1;
      return acc;
    }, {});
    
    const byProject = filteredData.reduce((acc, item) => {
      acc[item.PROJECT_NAME] = (acc[item.PROJECT_NAME] || 0) + 1;
      return acc;
    }, {});
    
    return { total, bySystem, byProject };
  }, [filteredData]);

  // Format timestamp to readable date
  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  // Calculate time since measurement
  const timeSince = (timestamp) => {
    const now = new Date();
    const then = new Date(timestamp);
    const diffInHours = Math.floor((now - then) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else {
      return `${Math.floor(diffInHours / 24)} days ago`;
    }
  };

  // Export data as CSV
  const exportData = () => {
    const headers = Object.keys(data[0]).join(',');
    const csvData = data.map(item => Object.values(item).join(','));
    const csv = [headers, ...csvData].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'oceanographic_data.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Get color based on time
  const getTimeColor = (timestamp) => {
    const now = Date.now();
    const sevenDaysAgo = now - (7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = now - (30 * 24 * 60 * 60 * 1000);
    
    if (timestamp >= sevenDaysAgo) return '#7F7F7F'; // Recent (ash)
    if (timestamp >= thirtyDaysAgo) return '#9E9E9E'; // Within month (light grey)
    return '#616161'; // Older (dark grey)
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 p-2 md:p-4 text-center">
        <h1 className="text-xl md:text-2xl font-bold text-white mb-2">
          Oceanographic Data Visualization
        </h1>
        <p className="text-sm md:text-base text-gray-300">
          Argo Float Profiles
        </p>
        <div className="flex flex-wrap justify-center gap-2 mt-4">
          <button 
            className="px-3 py-1 rounded transition-colors bg-gray-600 text-white hover:bg-gray-500 text-xs md:text-sm"
            onClick={() => setIsBeamVisible(!isBeamVisible)}
          >
            {isBeamVisible ? 'Hide Beams' : 'Show Beams'}
          </button>
          <button 
            className="px-3 py-1 rounded transition-colors bg-gray-600 text-white hover:bg-gray-500 text-xs md:text-sm"
            onClick={exportData}
          >
            Export Data
          </button>
          <button 
            className="px-3 py-1 rounded transition-colors bg-gray-600 text-white hover:bg-gray-500 text-xs md:text-sm"
            onClick={() => setShowStatistics(!showStatistics)}
          >
            {showStatistics ? 'Hide Stats' : 'Show Stats'}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 min-h-0 px-2 md:px-4 pb-2 md:pb-4">
        <div className="max-w-6xl xl:max-w-7xl mx-auto h-full">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6 h-full">
            {/* Sidebar */}
            <div className="lg:col-span-1 bg-gray-800/80 rounded-lg p-3 md:p-4 overflow-y-auto">
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search by project, PI, or platform..."
              className="w-full p-2 rounded focus:outline-none focus:ring-2"
              style={{ backgroundColor: 'rgba(66, 66, 66, 0.5)', color: '#E0E0E0', border: '1px solid #7F7F7F' }}
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>

          <div className="mb-4 grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium mb-1">Time Range</label>
              <select 
                className="w-full p-2 rounded focus:outline-none focus:ring-2"
                style={{ backgroundColor: 'rgba(66, 66, 66, 0.5)', color: '#E0E0E0', border: '1px solid #7F7F7F' }}
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
              >
                <option value="all">All Time</option>
                <option value="month">Last 30 Days</option>
                <option value="week">Last 7 Days</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Positioning System</label>
              <select 
                className="w-full p-2 rounded focus:outline-none focus:ring-2"
                style={{ backgroundColor: 'rgba(66, 66, 66, 0.5)', color: '#E0E0E0', border: '1px solid #7F7F7F' }}
                value={systemFilter}
                onChange={(e) => setSystemFilter(e.target.value)}
              >
                <option value="all">All Systems</option>
                {positioningSystems.map(system => (
                  <option key={system} value={system}>{system}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Map View</label>
            <div className="flex space-x-2">
              {['dark', 'satellite', 'standard'].map(view => (
                <button
                  key={view}
                  className={`flex-1 py-1 rounded transition-colors ${mapView === view ? 'font-bold' : ''}`}
                  style={{ 
                    backgroundColor: mapView === view ? '#7F7F7F' : 'rgba(127, 127, 127, 0.3)',
                    color: mapView === view ? '#121212' : '#E0E0E0'
                  }}
                  onMouseOver={(e) => {
                    if (mapView !== view) e.target.style.backgroundColor = 'rgba(127, 127, 127, 0.5)';
                  }}
                  onMouseOut={(e) => {
                    if (mapView !== view) e.target.style.backgroundColor = 'rgba(127, 127, 127, 0.3)';
                  }}
                  onClick={() => setMapView(view)}
                >
                  {view.charAt(0).toUpperCase() + view.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={showHeatmap}
                onChange={(e) => setShowHeatmap(e.target.checked)}
                className="mr-2"
                style={{ accentColor: '#7F7F7F' }}
              />
              Show Density Heatmap
            </label>
          </div>

          <h2 className="text-lg font-semibold mb-2">Profiles ({filteredData.length})</h2>
          
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredData.map((item) => (
              <div 
                key={`${item.PLATFORM_NUMBER}-${item.profile_index}`}
                className={`p-3 rounded cursor-pointer transition-colors ${
                  selectedProfile === item ? 'text-white' : 'hover:bg-gray-600 hover:bg-opacity-30'
                }`}
                style={{ 
                  backgroundColor: selectedProfile === item ? 'rgba(127, 127, 127, 0.2)' : 'rgba(224, 224, 224, 0.05)',
                  borderLeft: `4px solid ${getTimeColor(item.JULD)}`
                }}
                onClick={() => setSelectedProfile(item)}
              >
                <div className="font-medium">Platform: {item.PLATFORM_NUMBER}</div>
                <div className="text-sm opacity-70">Project: {item.PROJECT_NAME}</div>
                <div className="text-xs opacity-60">PI: {item.PI_NAME}</div>
                <div className="text-xs opacity-50 mt-1">{timeSince(item.JULD)}</div>
              </div>
              ))}
            </div>
          </div>

          {/* Map Container */}
            <div className="lg:col-span-3 bg-gray-800/50 rounded-lg overflow-hidden">
            <MapContainer 
                center={[0, 0]}
                zoom={2}
              className="h-full w-full"
              >
            {mapView === 'dark' ? (
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              />
            ) : mapView === 'satellite' ? (
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              />
            ) : (
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
            )}

            {filteredData.map((item) => (
                <Marker
                key={`${item.PLATFORM_NUMBER}-${item.profile_index}`}
                position={[item.LATITUDE, item.LONGITUDE]}
                icon={createCustomIcon(getTimeColor(item.JULD))}
                  eventHandlers={{
                  click: () => setSelectedProfile(item),
                }}
              >
                <Popup>
                  <div style={{ color: '#2A2A2A' }}>
                    <h3 className="font-bold">Platform: {item.PLATFORM_NUMBER}</h3>
                    <p>Project: {item.PROJECT_NAME}</p>
                    <p>PI: {item.PI_NAME}</p>
                    <p>Positioning: {item.POSITIONING_SYSTEM}</p>
                    <p>Date: {formatDate(item.JULD)}</p>
                    <p className="text-sm opacity-70">{timeSince(item.JULD)}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            
            {/* Heatmap circles */}
            {showHeatmap && filteredData.map((item) => (
              <Circle
                key={`heat-${item.PLATFORM_NUMBER}-${item.profile_index}`}
                center={[item.LATITUDE, item.LONGITUDE]}
                radius={200000} // 200km radius
                pathOptions={{
                  color: '#7F7F7F',
                  fillColor: '#9E9E9E',
                  fillOpacity: 0.2,
                  weight: 1
                }}
              >
                <Tooltip permanent direction="center">
                  {item.PLATFORM_NUMBER}
                </Tooltip>
              </Circle>
              ))}
            </MapContainer>
          </div>
          </div>
        </div>
      </div>

      {/* Statistics panel */}
      {showStatistics && (
        <div className="fixed top-4 left-4 p-4 rounded shadow-lg max-w-md bg-gray-800/90 text-white z-50 border border-gray-600">
          <button 
            className="absolute top-2 right-2 opacity-70 hover:opacity-100"
            onClick={() => setShowStatistics(false)}
          >
            ✕
          </button>
          
          <h2 className="text-xl font-bold mb-2">Data Statistics</h2>
          <div className="space-y-3">
            <p><span className="font-semibold">Total Profiles:</span> {stats.total}</p>
            
            <div>
              <p className="font-semibold mb-1">By Positioning System:</p>
              {Object.entries(stats.bySystem).map(([system, count]) => (
                <div key={system} className="flex justify-between text-sm">
                  <span>{system}:</span>
                  <span>{count} ({Math.round((count / stats.total) * 100)}%)</span>
                </div>
              ))}
          </div>

            <div>
              <p className="font-semibold mb-1">Top Projects:</p>
              {Object.entries(stats.byProject)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5)
                .map(([project, count]) => (
                  <div key={project} className="flex justify-between text-sm">
                    <span className="truncate max-w-xs">{project}:</span>
                    <span>{count}</span>
                  </div>
                ))}
            </div>
              </div>
            </div>
          )}

      {/* Details panel */}
      {selectedProfile && (
        <div className="fixed top-4 right-4 p-4 rounded shadow-lg max-w-md bg-gray-800/90 text-white z-50 border border-gray-600">
          <button 
            className="absolute top-2 right-2 opacity-70 hover:opacity-100"
            onClick={() => setSelectedProfile(null)}
          >
            ✕
          </button>
          
          <h2 className="text-xl font-bold mb-2">Profile Details</h2>
          <div className="space-y-2">
            <p><span className="font-semibold">Platform Number:</span> {selectedProfile.PLATFORM_NUMBER}</p>
            <p><span className="font-semibold">Profile Index:</span> {selectedProfile.profile_index}</p>
            <p><span className="font-semibold">Coordinates:</span> {selectedProfile.LATITUDE.toFixed(4)}, {selectedProfile.LONGITUDE.toFixed(4)}</p>
            <p><span className="font-semibold">Date:</span> {formatDate(selectedProfile.JULD)}</p>
            <p><span className="font-semibold">Positioning System:</span> {selectedProfile.POSITIONING_SYSTEM}</p>
            <p><span className="font-semibold">Project:</span> {selectedProfile.PROJECT_NAME}</p>
            <p><span className="font-semibold">Principal Investigator:</span> {selectedProfile.PI_NAME}</p>
            <p><span className="font-semibold">Direction:</span> {selectedProfile.DIRECTION}</p>
            <p><span className="font-semibold">Time Since Measurement:</span> {timeSince(selectedProfile.JULD)}</p>
          </div>

          <div className="mt-4 flex space-x-2">
            <button 
              className="flex-1 py-1 rounded transition-colors bg-gray-600 text-white hover:bg-gray-500"
              onClick={() => {
                setSelectedPlatform(selectedProfile.PLATFORM_NUMBER);
                setFilter(selectedProfile.PLATFORM_NUMBER.toString());
              }}
            >
              Show Only This Platform
            </button>
            <button 
              className="flex-1 py-1 rounded transition-colors bg-gray-600 text-white hover:bg-gray-500"
              onClick={() => setSelectedProfile(null)}
            >
              Close
            </button>
              </div>
            </div>
      )}
    </div>
  );
};

export default MapDetView;