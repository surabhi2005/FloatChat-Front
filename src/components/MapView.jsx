import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom oceanographic float icon
const createFloatIcon = (color = '#3B82F6') => {
  return new L.Icon({
    iconUrl: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' fill='${color}'%3E%3Cpath d='M16 0c-5.523 0-10 4.477-10 10 0 10 10 22 10 22s10-12 10-22c0-5.523-4.477-10-10-10zm0 16c-3.314 0-6-2.686-6-6s2.686-6 6-6 6 2.686 6 6-2.686 6-6 6z'/%3E%3C/svg%3E`,
    iconSize: [24, 24],
    iconAnchor: [12, 24],
    popupAnchor: [0, -24],
  });
};

const MapView = () => {
  const [data, setData] = useState([]);
  const [mapStyle, setMapStyle] = useState('satellite');
  const [selectedFloat, setSelectedFloat] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);
  const mapRef = useRef(null);

  useEffect(() => {
    // Enhanced oceanographic data with more realistic information
    const oceanographicData = [
      {
        id: 1,
        platform: "ARGO-7901",
        latitude: -15.9896,
        longitude: 90.3067,
        project: "Argo Australia",
        pi: "Peter OKE",
        region: "Indian Ocean",
        temperature: "29.4°C",
        salinity: "34.8 PSU",
        depth: "1000m",
        status: "Active",
        lastUpdate: "2 hours ago"
      },
      {
        id: 2,
        platform: "ARGO-7902",
        latitude: -43.037,
        longitude: 130.202,
        project: "UW Argo",
        pi: "STEPHEN RISER",
        region: "Southern Ocean",
        temperature: "2.1°C",
        salinity: "34.2 PSU",
        depth: "2000m",
        status: "Active",
        lastUpdate: "1 hour ago"
      },
      {
        id: 3,
        platform: "ARGO-7903",
        latitude: -41.3693,
        longitude: 142.6767,
        project: "Argo Australia",
        pi: "Christina SCHALLENBERG",
        region: "Tasman Sea",
        temperature: "18.7°C",
        salinity: "35.1 PSU",
        depth: "1500m",
        status: "Active",
        lastUpdate: "3 hours ago"
      },
      {
        id: 4,
        platform: "ARGO-7904",
        latitude: -54.2695,
        longitude: 47.7197,
        project: "GO-BGC WHOI",
        pi: "DAVID NICHOLSON",
        region: "South Atlantic",
        temperature: "4.2°C",
        salinity: "34.5 PSU",
        depth: "1800m",
        status: "Active",
        lastUpdate: "4 hours ago"
      },
      {
        id: 5,
        platform: "ARGO-7905",
        latitude: -18.7639,
        longitude: 85.0806,
        project: "Argo SIO",
        pi: "DEAN ROEMMICH",
        region: "Indian Ocean",
        temperature: "28.9°C",
        salinity: "35.3 PSU",
        depth: "1200m",
        status: "Active",
        lastUpdate: "1 hour ago"
      },
      {
        id: 6,
        platform: "ARGO-7906",
        latitude: -2.4811,
        longitude: 99.3107,
        project: "Argo SIO",
        pi: "SARAH PURKEY",
        region: "Indian Ocean",
        temperature: "30.1°C",
        salinity: "34.9 PSU",
        depth: "800m",
        status: "Active",
        lastUpdate: "2 hours ago"
      },
      {
        id: 7,
        platform: "ARGO-7907",
        latitude: -33.8688,
        longitude: 151.2093,
        project: "Argo Australia",
        pi: "Bob MARTIN",
        region: "Tasman Sea",
        temperature: "22.3°C",
        salinity: "35.4 PSU",
        depth: "1400m",
        status: "Maintenance",
        lastUpdate: "1 day ago"
      },
      {
        id: 8,
        platform: "ARGO-7908",
        latitude: -10.5,
        longitude: 55.3,
        project: "Argo Indian Ocean",
        pi: "Test PI 1",
        region: "Indian Ocean",
        temperature: "27.8°C",
        salinity: "35.0 PSU",
        depth: "1100m",
        status: "Active",
        lastUpdate: "3 hours ago"
      },
      {
        id: 9,
        platform: "ARGO-7909",
        latitude: -25.2,
        longitude: 60.7,
        project: "Argo Indian Ocean",
        pi: "Test PI 2",
        region: "Indian Ocean",
        temperature: "26.5°C",
        salinity: "35.2 PSU",
        depth: "1300m",
        status: "Active",
        lastUpdate: "2 hours ago"
      },
      {
        id: 10,
        platform: "ARGO-7910",
        latitude: 5.6,
        longitude: 75.0,
        project: "Argo Indian Ocean",
        pi: "Test PI 3",
        region: "Indian Ocean",
        temperature: "29.2°C",
        salinity: "34.7 PSU",
        depth: "900m",
        status: "Active",
        lastUpdate: "1 hour ago"
      }
    ];
    
    setData(oceanographicData);
  }, []);

  // Set timeout for map loading
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!mapLoaded) {
        setMapError(true);
      }
    }, 10000); // 10 seconds timeout

    return () => clearTimeout(timer);
  }, [mapLoaded]);

  // Handle map initialization
  const handleMapReady = () => {
    console.log('Map is ready!');
    setMapLoaded(true);
    if (mapRef.current) {
      mapRef.current.invalidateSize();
    }
  };


  const mapStyles = {
    satellite: {
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    },
    standard: {
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    },
    dark: {
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }
  };

  const getStatusColor = (status) => {
    return status === 'Active' ? '#10B981' : '#F59E0B';
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* Header Section */}
      <div className="flex-shrink-0 p-2 md:p-4 text-center">
        <h1 className="text-xl md:text-3xl font-bold text-white mb-2">
          Oceanographic Data Map
        </h1>
        <p className="text-sm md:text-base text-blue-200">
          Real-time monitoring of ARGO float deployments across global oceans
        </p>
        
        {/* Map Style Controls */}
        <div className="flex flex-wrap justify-center gap-2 mt-4">
          {Object.keys(mapStyles).map((style) => (
          <button 
              key={style}
              onClick={() => setMapStyle(style)}
              className={`px-3 py-2 rounded-lg font-medium transition-all duration-200 text-xs md:text-sm ${
                mapStyle === style
                  ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                  : 'bg-gray-600/30 text-gray-200 hover:bg-gray-500/40'
              }`}
            >
              {style.charAt(0).toUpperCase() + style.slice(1)}
                </button>
              ))}
            </div>
          </div>

      {/* Main Content */}
      <div className="flex-1 min-h-0 px-2 md:px-4 pb-2 md:pb-4">
        <div className="max-w-6xl xl:max-w-7xl mx-auto h-full">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6 h-full">
          {/* Information Panel */}
          <div className="lg:col-span-1 space-y-6">
            {/* Overview Stats */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-semibold text-white mb-4">System Overview</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-blue-200">Total Floats:</span>
                  <span className="text-white font-semibold">{data.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-200">Active:</span>
                  <span className="text-green-400 font-semibold">
                    {data.filter(f => f.status === 'Active').length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-200">Maintenance:</span>
                  <span className="text-yellow-400 font-semibold">
                    {data.filter(f => f.status === 'Maintenance').length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-200">Regions:</span>
                  <span className="text-white font-semibold">
                    {new Set(data.map(f => f.region)).size}
                  </span>
          </div>
              </div>
            </div>

            {/* Selected Float Details */}
            {selectedFloat && (
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <h3 className="text-xl font-semibold text-white mb-4">Float Details</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-blue-200 text-sm">Platform:</span>
                    <p className="text-white font-medium">{selectedFloat.platform}</p>
                  </div>
                  <div>
                    <span className="text-blue-200 text-sm">Project:</span>
                    <p className="text-white">{selectedFloat.project}</p>
                  </div>
                  <div>
                    <span className="text-blue-200 text-sm">Principal Investigator:</span>
                    <p className="text-white">{selectedFloat.pi}</p>
                  </div>
                  <div>
                    <span className="text-blue-200 text-sm">Region:</span>
                    <p className="text-white">{selectedFloat.region}</p>
                  </div>
                  <div>
                    <span className="text-blue-200 text-sm">Coordinates:</span>
                    <p className="text-white">{selectedFloat.latitude.toFixed(4)}°, {selectedFloat.longitude.toFixed(4)}°</p>
                  </div>
                  <div>
                    <span className="text-blue-200 text-sm">Temperature:</span>
                    <p className="text-white">{selectedFloat.temperature}</p>
                  </div>
                  <div>
                    <span className="text-blue-200 text-sm">Salinity:</span>
                    <p className="text-white">{selectedFloat.salinity}</p>
                  </div>
                  <div>
                    <span className="text-blue-200 text-sm">Depth:</span>
                    <p className="text-white">{selectedFloat.depth}</p>
                  </div>
                  <div>
                    <span className="text-blue-200 text-sm">Status:</span>
                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                      selectedFloat.status === 'Active' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {selectedFloat.status}
                    </span>
                  </div>
                  <div>
                    <span className="text-blue-200 text-sm">Last Update:</span>
                    <p className="text-white">{selectedFloat.lastUpdate}</p>
                  </div>
          </div>
        </div>
            )}

            {/* Legend */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-semibold text-white mb-4">Legend</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                  <span className="text-blue-200">ARGO Float</span>
                    </div>
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  <span className="text-blue-200">Active Status</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                  <span className="text-blue-200">Maintenance</span>
                </div>
              </div>
            </div>
              </div>
              
          {/* Map Container */}
          <div className="lg:col-span-3">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-semibold text-white mb-4">Global Ocean Monitoring Network</h3>
              <div className="relative bg-gray-200 rounded-lg overflow-hidden" style={{ height: '600px', width: '100%' }}>
                {(!mapLoaded || mapError) && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-600 z-10">
                    <div className="text-center">
                      {mapError ? (
                        <>
                          <div className="text-lg font-semibold mb-2 text-red-600">Map Failed to Load</div>
                          <div className="text-sm mb-4">Please check your internet connection</div>
                <button 
                  onClick={() => {
                              setMapError(false);
                              setMapLoaded(false);
                              window.location.reload();
                  }}
                            className="px-4 py-2 bg-gray-600 text-gray-200 rounded hover:bg-gray-700"
                >
                            Retry
                </button>
                        </>
                      ) : (
                        <>
                          <div className="text-lg font-semibold mb-2">Loading Map...</div>
                          <div className="text-sm">Please wait while the map loads</div>
                        </>
                      )}
                    </div>
                  </div>
                )}
                <MapContainer
                  ref={mapRef}
                  key={mapStyle}
                  center={[0, 0]}
                  zoom={2}
                  style={{ height: '600px', width: '100%', minHeight: '600px' }}
                  zoomControl={false}
                  className="rounded-lg"
                  whenReady={handleMapReady}
                >
                  <TileLayer
                    attribution='&copy; OpenStreetMap contributors'
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                  />
                  <ZoomControl position="bottomright" />
                  
                  {data.map((float) => (
                    <Marker
                      key={float.id}
                      position={[float.latitude, float.longitude]}
                      icon={createFloatIcon(getStatusColor(float.status))}
                      eventHandlers={{
                        click: () => setSelectedFloat(float),
                      }}
                    >
                      <Popup>
                        <div className="p-2 min-w-[250px]">
                          <h3 className="font-bold text-lg text-gray-800 mb-2">{float.platform}</h3>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600 font-medium">Project:</span>
                              <span className="text-gray-800">{float.project}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600 font-medium">Region:</span>
                              <span className="text-gray-800">{float.region}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600 font-medium">Temperature:</span>
                              <span className="text-gray-800">{float.temperature}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600 font-medium">Salinity:</span>
                              <span className="text-gray-800">{float.salinity}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600 font-medium">Depth:</span>
                              <span className="text-gray-800">{float.depth}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600 font-medium">Status:</span>
                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                float.status === 'Active' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {float.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>
            </div>
          </div>
            {/* Description Section */}
            <div className="lg:col-span-4 mt-4 md:mt-6 bg-white/10 backdrop-blur-md rounded-xl p-4 md:p-8 border border-white/20">
              <h2 className="text-lg md:text-2xl font-bold text-white mb-4 md:mb-6">About ARGO Float Network</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                <div>
                  <h3 className="text-lg md:text-xl font-semibold text-blue-300 mb-2 md:mb-3">What are ARGO Floats?</h3>
                  <p className="text-sm md:text-base text-blue-200 leading-relaxed">
                    ARGO floats are autonomous oceanographic instruments that drift with ocean currents, 
                    collecting valuable data about temperature, salinity, and other ocean properties. 
                    These floats provide crucial information for understanding climate change, ocean circulation, 
                    and marine ecosystems.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-semibold text-blue-300 mb-2 md:mb-3">Global Coverage</h3>
                  <p className="text-sm md:text-base text-blue-200 leading-relaxed">
                    The ARGO network consists of thousands of floats deployed across all major ocean basins. 
                    Each float operates autonomously for several years, surfacing periodically to transmit 
                    data via satellite. This creates a comprehensive, real-time view of ocean conditions worldwide.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-semibold text-blue-300 mb-2 md:mb-3">Data Applications</h3>
                  <p className="text-sm md:text-base text-blue-200 leading-relaxed">
                    ARGO data is used for weather forecasting, climate research, ocean modeling, and 
                    understanding marine biodiversity. The information helps scientists track ocean warming, 
                    sea level rise, and changes in ocean circulation patterns.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-semibold text-blue-300 mb-2 md:mb-3">Real-time Monitoring</h3>
                  <p className="text-sm md:text-base text-blue-200 leading-relaxed">
                    This dashboard provides real-time access to ARGO float positions and measurements. 
                    Click on any float marker to view detailed information about its current status, 
                    measurements, and operational history.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapView;