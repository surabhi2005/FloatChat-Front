import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./SideBar";

export default function PolygonPage() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [polygons, setPolygons] = useState([]);
  const [selectedPolygon, setSelectedPolygon] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPolygon, setCurrentPolygon] = useState([]);
  const mapRef = useRef(null);

  // Mock float data
  const floats = [
    { lat: 0, lon: 80, name: "Float-1", status: "active", temp: 22.4, salinity: 35.2 },
    { lat: 10, lon: 90, name: "Float-2", status: "active", temp: 24.1, salinity: 34.8 },
    { lat: -5, lon: 85, name: "Float-3", status: "maintenance", temp: 21.8, salinity: 35.5 },
    { lat: 15, lon: 75, name: "Float-4", status: "active", temp: 25.3, salinity: 34.9 },
    { lat: -8, lon: 95, name: "Float-5", status: "inactive", temp: 20.7, salinity: 35.8 },
  ];

  // Handle click on map to draw polygon
  const handleMapClick = (e) => {
    if (!isDrawing || !mapRef.current) return;
    
    const rect = mapRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setCurrentPolygon([...currentPolygon, { x, y }]);
  };

  // Finish drawing polygon
  const finishDrawing = () => {
    if (currentPolygon.length < 3) return;
    
    setPolygons([...polygons, { points: currentPolygon, id: Date.now() }]);
    setCurrentPolygon([]);
    setIsDrawing(false);
  };

  // Calculate statistics for selected polygon
  const calculatePolygonStats = (polygon) => {
    // In a real app, you would check which floats are inside the polygon
    // For this example, we'll just return mock data
    return {
      floatCount: 3,
      avgTemperature: 23.2,
      avgSalinity: 35.1,
      minDepth: "800m",
      maxDepth: "2000m"
    };
  };

  // Select a polygon
  const selectPolygon = (polygon) => {
    setSelectedPolygon(polygon);
  };

  // Add cleanup for any potential event listeners
  useEffect(() => {
    return () => {
      // Cleanup any event listeners here if needed
      setSelectedPolygon(null);
      setCurrentPolygon([]);
      setIsDrawing(false);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#424874] to-[#A6B1E1]">
      {/* Header */}
      <header className="bg-[#424874] text-[#F4EEFF] p-4 flex justify-between items-center shadow-lg sticky top-0 z-20 border-b border-[#DCD6F7]">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 rounded-lg bg-[#A6B1E1] hover:bg-[#DCD6F7] transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex items-center space-x-3">
            <div className="bg-[#A6B1E1] p-2 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7l4-4m0 0l4 4m-4-4v18" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold">🌊 Polygon Analysis</h1>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-[#A6B1E1] text-[#424874] px-4 py-2 rounded-lg hover:bg-[#DCD6F7] hover:text-[#424874] transition-all flex items-center space-x-2 shadow hover:shadow-md font-medium"
          >
            <span>Back to Dashboard</span>
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        
        {/* Main Content */}
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-white">Polygon Analysis Tool</h2>
            <p className="text-[#DCD6F7]">Draw polygons on the map to analyze data within specific regions</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Map Section */}
            <div className="lg:col-span-2 bg-[#A6B1E1] rounded-xl shadow-lg p-4 border border-[#DCD6F7]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[#424874]">Draw Polygon</h3>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => setIsDrawing(!isDrawing)}
                    className={`text-xs px-3 py-1 rounded-lg transition ${isDrawing ? 'bg-red-500 text-white' : 'bg-[#DCD6F7] text-[#424874] hover:bg-[#F4EEFF]'}`}
                  >
                    {isDrawing ? 'Stop Drawing' : 'Start Drawing'}
                  </button>
                  {isDrawing && currentPolygon.length > 0 && (
                    <button 
                      onClick={finishDrawing}
                      className="text-xs bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 transition"
                    >
                      Finish Polygon
                    </button>
                  )}
                  <button 
                    onClick={() => setPolygons([])}
                    className="text-xs bg-[#DCD6F7] text-[#424874] px-3 py-1 rounded-lg hover:bg-[#F4EEFF] transition"
                  >
                    Clear All
                  </button>
                </div>
              </div>
              
              <div 
                ref={mapRef}
                className="h-96 rounded-lg overflow-hidden relative bg-[#DCD6F7] border border-[#424874] cursor-crosshair"
                onClick={handleMapClick}
              >
                {/* Mock map with float positions */}
                {floats.map(float => (
                  <div 
                    key={float.name}
                    className="absolute w-3 h-3 rounded-full bg-blue-500 transform -translate-x-1/2 -translate-y-1/2"
                    style={{
                      left: `${((float.lon + 180) / 360) * 100}%`,
                      top: `${((90 - float.lat) / 180) * 100}%`
                    }}
                    title={float.name}
                  />
                ))}
                
                {/* Draw existing polygons */}
                {polygons.map(polygon => (
                  <svg 
                    key={polygon.id} 
                    className="absolute top-0 left-0 w-full h-full"
                    onClick={() => selectPolygon(polygon)}
                  >
                    <polygon
                      points={polygon.points.map(p => `${p.x},${p.y}`).join(' ')}
                      fill={selectedPolygon?.id === polygon.id ? "rgba(66, 72, 116, 0.5)" : "rgba(166, 177, 225, 0.3)"}
                      stroke="#424874"
                      strokeWidth="2"
                      className="cursor-pointer"
                    />
                  </svg>
                ))}
                
                {/* Draw current polygon in progress */}
                {isDrawing && currentPolygon.length > 0 && (
                  <svg className="absolute top-0 left-0 w-full h-full">
                    <polygon
                      points={currentPolygon.map(p => `${p.x},${p.y}`).join(' ')}
                      fill="rgba(166, 177, 225, 0.3)"
                      stroke="#424874"
                      strokeWidth="2"
                      strokeDasharray="5,5"
                    />
                    {currentPolygon.map((point, i) => (
                      <circle
                        key={i}
                        cx={point.x}
                        cy={point.y}
                        r="4"
                        fill="#424874"
                      />
                    ))}
                  </svg>
                )}
                
                <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs p-1 rounded">
                  {isDrawing ? "Click to add polygon points" : "Click 'Start Drawing' to begin"}
                </div>
              </div>
            </div>
            
            {/* Polygon Info Section */}
            <div className="bg-[#A6B1E1] rounded-xl shadow-lg p-4 border border-[#DCD6F7]">
              <h3 className="text-lg font-semibold text-[#424874] mb-4">Polygon Information</h3>
              
              {selectedPolygon ? (
                <div>
                  <div className="mb-4 p-3 bg-[#DCD6F7] rounded-lg">
                    <h4 className="font-medium text-[#424874]">Selected Polygon</h4>
                    <p className="text-sm text-[#424874]">Points: {selectedPolygon.points.length}</p>
                    <p className="text-sm text-[#424874]">ID: {selectedPolygon.id}</p>
                  </div>
                  
                  <div className="bg-[#DCD6F7] rounded-lg p-3">
                    <h4 className="font-medium text-[#424874] mb-2">Statistics</h4>
                    {(() => {
                      const stats = calculatePolygonStats(selectedPolygon);
                      return (
                        <div className="space-y-2">
                          <p className="text-sm text-[#424874]">Floats in area: {stats.floatCount}</p>
                          <p className="text-sm text-[#424874]">Avg Temperature: {stats.avgTemperature}°C</p>
                          <p className="text-sm text-[#424874]">Avg Salinity: {stats.avgSalinity}</p>
                          <p className="text-sm text-[#424874]">Depth Range: {stats.minDepth} - {stats.maxDepth}</p>
                        </div>
                      );
                    })()}
                  </div>
                  
                  <button 
                    onClick={() => setSelectedPolygon(null)}
                    className="mt-4 w-full bg-[#424874] text-[#F4EEFF] py-2 rounded-lg hover:bg-[#5a608a] transition"
                  >
                    Clear Selection
                  </button>
                </div>
              ) : polygons.length > 0 ? (
                <div>
                  <p className="text-[#424874] mb-4">Select a polygon on the map to view details</p>
                  <div className="space-y-2">
                    {polygons.map(polygon => (
                      <div 
                        key={polygon.id}
                        className="p-2 bg-[#DCD6F7] rounded-lg cursor-pointer hover:bg-[#F4EEFF] transition"
                        onClick={() => selectPolygon(polygon)}
                      >
                        <p className="text-sm text-[#424874]">Polygon {polygon.id}</p>
                        <p className="text-xs text-[#424874]">{polygon.points.length} points</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-[#424874]">No polygons created yet. Draw a polygon on the map to get started.</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}