import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, CircleMarker, Polyline, Tooltip } from "react-leaflet";
import Papa from "papaparse";
import floatsCSV from "../float_index.csv";
import "leaflet/dist/leaflet.css";

const FloatTrajectories = () => {
  const [floatsData, setFloatsData] = useState([]);
  const [selectedFloat, setSelectedFloat] = useState(null);
  const [step, setStep] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    Papa.parse(floatsCSV, {
      download: true,
      header: true,
      dynamicTyping: true,
      complete: (results) => {
        const data = results.data.filter(
          (d) =>
            d.min_latitude != null &&
            d.max_latitude != null &&
            d.min_longitude != null &&
            d.max_longitude != null
        );
        setFloatsData(data);
      },
    });

    return () => clearInterval(intervalRef.current);
  }, []);

  // Animate only the selected float
  useEffect(() => {
    if (!selectedFloat || !isPlaying) {
      clearInterval(intervalRef.current);
      return;
    }

    if (intervalRef.current) clearInterval(intervalRef.current);
    let currentStep = 0;

    intervalRef.current = setInterval(() => {
      currentStep++;
      setStep(currentStep);
      if (currentStep >= 100) {
        currentStep = 0;
        setStep(0);
      }
    }, 100);

    return () => clearInterval(intervalRef.current);
  }, [selectedFloat, isPlaying]);

  const handleSelectFloat = (float) => {
    setSelectedFloat(float);
    setStep(0);
    setIsPlaying(true);
  };

  const toggleAnimation = () => {
    setIsPlaying(!isPlaying);
  };

  const resetAnimation = () => {
    setStep(0);
    setIsPlaying(false);
  };

  const filteredFloats = floatsData.filter(float =>
    float.float_id.toString().toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-black text-white font-sans">
      {/* Map - Left side */}
      <div className="flex-1 relative">
        <MapContainer
          center={[0, 80]}
          zoom={3}
          className="h-full w-full"
          scrollWheelZoom={true}
        >
          {/* Light theme tile layer */}
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {selectedFloat && (
            <MovingFloat float={selectedFloat} step={step} isPlaying={isPlaying} />
          )}
        </MapContainer>
        
        {/* Map overlay info */}
        {selectedFloat && (
          <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm p-4 rounded-lg border border-gray-300 z-50 min-w-64 shadow-lg">
            <h4 className="text-blue-600 font-semibold mb-3 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              Selected Float
            </h4>
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex justify-between">
                <span className="text-gray-500">ID:</span>
                <span className="text-gray-900 font-medium">{selectedFloat.float_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Start:</span>
                <span className="text-gray-900">{selectedFloat.min_latitude.toFixed(2)}°, {selectedFloat.min_longitude.toFixed(2)}°</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">End:</span>
                <span className="text-gray-900">{selectedFloat.max_latitude.toFixed(2)}°, {selectedFloat.max_longitude.toFixed(2)}°</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Status:</span>
                <span className={`font-medium ${isPlaying ? 'text-green-600' : 'text-red-600'}`}>
                  {isPlaying ? 'Playing' : 'Paused'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sidebar - Right side, full height */}
      <div className="w-80 bg-gray-900 border-l border-gray-700 h-full flex flex-col">
        <div className="p-6 space-y-6 flex-1 overflow-y-auto">
          <div>
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <div className="w-8 h-8 bg-blue-500 rounded-lg mr-3 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/>
                </svg>
              </div>
              Float Trajectories
            </h2>
            
            {/* Search Box */}
            <div className="relative mb-6">
              <input
                type="text"
                placeholder="Search floats..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pl-10 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="m21 21-4.35-4.35"/>
                </svg>
              </div>
            </div>

            {/* Controls */}
            {selectedFloat && (
              <div className="bg-gray-800 p-4 rounded-lg border border-gray-600 mb-6">
                <h4 className="text-white font-semibold mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  Controls
                </h4>
                <div className="flex gap-2 mb-4">
                  <button
                    onClick={toggleAnimation}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center ${
                      isPlaying 
                        ? 'bg-red-600 hover:bg-red-700 text-white' 
                        : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                  >
                    {isPlaying ? (
                      <>
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                        </svg>
                        Pause
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                        Play
                      </>
                    )}
                  </button>
                  <button
                    onClick={resetAnimation}
                    className="flex-1 px-3 py-2 rounded-lg text-sm font-medium bg-yellow-600 hover:bg-yellow-700 text-white transition-all duration-200 flex items-center justify-center"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                    </svg>
                    Reset
                  </button>
                </div>
                <div className="flex justify-between items-center text-sm text-gray-300 mb-2">
                  <span>Progress:</span>
                  <span className="font-medium">{step}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-blue-500 h-full rounded-full transition-all duration-100 ease-out"
                    style={{ width: `${step}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          {/* Float List */}
          <div className="px-6 pb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">
                Floats ({filteredFloats.length})
              </h3>
              <span className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded-full">
                {filteredFloats.length} items
              </span>
            </div>
            
            <div className="max-h-96 overflow-y-auto space-y-2">
              {filteredFloats.map((float) => (
                <div
                  key={float.float_id}
                  onClick={() => handleSelectFloat(float)}
                  className={`p-3 rounded-lg cursor-pointer transition-all duration-200 flex items-center gap-3 ${
                    selectedFloat?.float_id === float.float_id
                      ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/25 scale-105'
                      : 'bg-gray-800 hover:bg-gray-700 text-gray-200 hover:scale-102'
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    selectedFloat?.float_id === float.float_id ? 'bg-white' : 'bg-blue-400'
                  }`}></div>
                  <span className={`text-sm ${
                    selectedFloat?.float_id === float.float_id ? 'font-semibold' : 'font-normal'
                  }`}>
                    Float {float.float_id}
                  </span>
                  {selectedFloat?.float_id === float.float_id && (
                    <div className="ml-auto flex items-center text-xs opacity-80">
                      <div className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse"></div>
                      Playing
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Separate component for moving float
const MovingFloat = ({ float, step, isPlaying }) => {
  const { min_latitude, max_latitude, min_longitude, max_longitude, float_id } = float;

  const lat = min_latitude + ((max_latitude - min_latitude) * step) / 100;
  const lng = min_longitude + ((max_longitude - min_longitude) * step) / 100;

  const traveledPath = [
    [min_latitude, min_longitude],
    [lat, lng],
  ];

  const completePath = [
    [min_latitude, min_longitude],
    [max_latitude, max_longitude],
  ];

  return (
    <>
      {/* Complete path (faint) */}
      <Polyline 
        positions={completePath} 
        color="#4a5568" 
        weight={2} 
        opacity={0.3}
      />
      
      {/* Traveled path */}
      <Polyline 
        positions={traveledPath} 
        color="#63b3ed" 
        weight={4} 
        opacity={0.8}
      />
      
      {/* Moving marker */}
      <CircleMarker 
        center={[lat, lng]} 
        radius={12} 
        color={isPlaying ? "#f56565" : "#d69e2e"}
        fillColor={isPlaying ? "#f56565" : "#d69e2e"}
        fillOpacity={0.9}
        weight={2}
      >
        <Tooltip 
          direction="top" 
          offset={[0, -10]} 
          opacity={0.9}
          permanent
        >
          <div className="bg-white text-gray-900 p-2 rounded text-xs border border-gray-300 shadow-lg">
            <div className="font-semibold">Float {float_id}</div>
            <div>Position: {lat.toFixed(2)}°, {lng.toFixed(2)}°</div>
            <div>Progress: {step}%</div>
          </div>
        </Tooltip>
      </CircleMarker>
      
      {/* Start and end markers */}
      <CircleMarker 
        center={[min_latitude, min_longitude]} 
        radius={6} 
        color="#38a169"
        fillColor="#38a169"
        fillOpacity={0.7}
      >
        <Tooltip permanent>Start</Tooltip>
      </CircleMarker>
      
      <CircleMarker 
        center={[max_latitude, max_longitude]} 
        radius={6} 
        color="#e53e3e"
        fillColor="#e53e3e"
        fillOpacity={0.7}
      >
        <Tooltip permanent>End</Tooltip>
      </CircleMarker>
    </>
  );
};

export default FloatTrajectories;