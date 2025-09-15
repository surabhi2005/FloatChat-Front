import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from "react-leaflet";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";

// Custom marker icons
const floatIcon = new Icon({
  iconUrl: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDIyQzE3LjUyMjggMjIgMjIgMTcuNTIyOCAyMiAxMkMyMiA2LjQ3NzE1IDE3LjUyMjggMiAxMiAyQzYuNDc3MTUgMiAyIDYuNDc3MTUgMiAxMkMyIDE3LjUyMjggNi40NzcxNSAyMiAxMiAyMloiIGZpbGw9IiM4NkI2RjYiLz4KPHBhdGggZD0iTTEyIDE2QzE0LjIwOTEgMTYgMTYgMTQuMjA5MSAxNiAxMkMxNiA5Ljc5MDg2IDE0LjIwOTEgOCAxMiA4QzkuNzkwODYgOCA4IDkuNzkwODYgOCAxMkM4IDE0LjIwOTEgOS43OTA4NiAxNiAxMiAxNloiIGZpbGw9IiNCNEQ0RkYiLz4KPHBhdGggZD0iTTEyIDEzQzEyLjU1MjMgMTMgMTMgMTIuNTUyMyAxMyAxMkMxMyAxMS40NDc3IDEyLjU1MjMgMTEgMTIgMTFDMTEuNDQ3NyAxMSAxMSAxMS40NDc3IDExIDEyQzExIDEyLjU1MjMgMTEuNDQ3NyAxMyAxMiAxM1oiIGZpbGw9IiMxNzZCODciLz4KPC9zdmc+Cg==",
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  popupAnchor: [0, -12]
});

const activeFloatIcon = new Icon({
  iconUrl: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iMTYiIGZpbGw9IiNCNEQ0RkYiLz4KPGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iOCIgZmlsbD0iIzE3NkI4NyIvPgo8Y2lyY2xlIGN4PSIxNiIgY3k9IjE2IiByPSI0IiBmaWxsPSIjRUVGNUVGIi8+Cjwvc3ZnPgo=",
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16]
});

export default function MapView({ floats }) {
  const [selectedFloat, setSelectedFloat] = useState(null);
  const [mapStyle, setMapStyle] = useState("standard"); // standard, satellite, dark

  // Default floats if none provided
  const defaultFloats = [
    { id: 1, name: "ARGO Float #7901", lat: 20, lon: -120, active: true, temperature: "12.4°C", salinity: "34.5 PSU", depth: "1000m" },
    { id: 2, name: "ARGO Float #7902", lat: 10, lon: -100, active: true, temperature: "25.1°C", salinity: "35.2 PSU", depth: "500m" },
    { id: 3, name: "ARGO Float #7903", lat: -15, lon: -80, active: false, temperature: "8.7°C", salinity: "34.1 PSU", depth: "2000m" },
    { id: 4, name: "ARGO Float #7904", lat: 35, lon: 150, active: true, temperature: "18.3°C", salinity: "34.8 PSU", depth: "800m" },
    { id: 5, name: "ARGO Float #7905", lat: -30, lon: 50, active: true, temperature: "14.2°C", salinity: "35.0 PSU", depth: "1200m" }
  ];

  const displayFloats = floats && floats.length > 0 ? floats : defaultFloats;

  // Tile layers for different map styles
  const tileLayers = {
    standard: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    satellite: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    dark: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
  };

  const attributions = {
    standard: "&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors",
    satellite: "&copy; <a href='https://www.esri.com/'>Esri</a>",
    dark: "&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors, &copy; <a href='https://carto.com/attributions'>CARTO</a>"
  };

  return (
    <div className="w-full h-full rounded-xl overflow-hidden shadow-xl border border-[#DCD6F7] bg-gradient-to-br from-[#424874] to-[#A6B1E1] p-4">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-[#F4EEFF] flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            ARGO Float Locations
          </h2>
          
          <div className="flex space-x-2">
            <button 
              onClick={() => setMapStyle("standard")}
              className={`px-3 py-1 rounded-lg text-xs flex items-center transition ${
                mapStyle === "standard" 
                  ? "bg-[#DCD6F7] text-[#424874]" 
                  : "bg-[#424874] text-[#DCD6F7] hover:bg-[#A6B1E1] hover:text-[#F4EEFF]"
              }`}
            >
              Standard
            </button>
            <button 
              onClick={() => setMapStyle("satellite")}
              className={`px-3 py-1 rounded-lg text-xs flex items-center transition ${
                mapStyle === "satellite" 
                  ? "bg-[#DCD6F7] text-[#424874]" 
                  : "bg-[#424874] text-[#DCD6F7] hover:bg-[#A6B1E1] hover:text-[#F4EEFF]"
              }`}
            >
              Satellite
            </button>
            <button 
              onClick={() => setMapStyle("dark")}
              className={`px-3 py-1 rounded-lg text-xs flex items-center transition ${
                mapStyle === "dark" 
                  ? "bg-[#DCD6F7] text-[#424874]" 
                  : "bg-[#424874] text-[#DCD6F7] hover:bg-[#A6B1E1] hover:text-[#F4EEFF]"
              }`}
            >
              Dark
            </button>
          </div>
        </div>

        {/* Map Container */}
        <div className="flex-1 rounded-lg overflow-hidden relative">
          <MapContainer 
            center={[0, 80]} 
            zoom={3} 
            className="h-full w-full"
            zoomControl={false}
          >
            <TileLayer
              url={tileLayers[mapStyle]}
              attribution={attributions[mapStyle]}
            />
            <ZoomControl position="bottomright" />
            
            {displayFloats.map((f) => (
              <Marker 
                key={f.id} 
                position={[f.lat, f.lon]} 
                icon={f.active ? activeFloatIcon : floatIcon}
                eventHandlers={{
                  click: () => setSelectedFloat(f)
                }}
              >
                <Popup>
                  <div className="p-2">
                    <h3 className="font-semibold text-[#424874]">{f.name}</h3>
                    <div className="mt-2 space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Status:</span>
                        <span className={f.active ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                          {f.active ? "Active" : "Inactive"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Temperature:</span>
                        <span>{f.temperature}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Salinity:</span>
                        <span>{f.salinity}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Depth:</span>
                        <span>{f.depth}</span>
                      </div>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* Legend */}
        <div className="mt-3 flex items-center justify-between text-xs text-[#DCD6F7]">
          <div className="flex items-center space-x-4">
            <span className="font-medium">Legend:</span>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded-full bg-[#A6B1E1]"></div>
              <span>Standard Float</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-4 h-4 rounded-full bg-[#DCD6F7]"></div>
              <span>Active Float</span>
            </div>
          </div>
          
          <div className="text-right">
            <span>{displayFloats.length} floats displayed</span>
          </div>
        </div>
      </div>
    </div>
  );
}