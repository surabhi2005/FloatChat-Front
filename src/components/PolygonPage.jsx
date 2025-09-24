import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "./PageLayout";

export default function PolygonPage() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [polygons, setPolygons] = useState([]);
  const [selectedPolygon, setSelectedPolygon] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPolygon, setCurrentPolygon] = useState([]);
  const mapRef = useRef(null);
  
  // Project lat/lon to pixel coords in the simple mock map
  const projectToPixel = (lat, lon, width, height) => {
    const x = ((lon + 180) / 360) * width;
    const y = ((90 - lat) / 180) * height;
    return { x, y };
  };

  // Point-in-polygon (ray casting) on pixel coordinates
  const isPointInPolygon = (point, polygonPoints) => {
    let inside = false;
    for (let i = 0, j = polygonPoints.length - 1; i < polygonPoints.length; j = i++) {
      const xi = polygonPoints[i].x, yi = polygonPoints[i].y;
      const xj = polygonPoints[j].x, yj = polygonPoints[j].y;
      const intersect = ((yi > point.y) !== (yj > point.y)) &&
        (point.x < (xj - xi) * (point.y - yi) / ((yj - yi) || 1e-9) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  };

  // Compute floats within selected polygon (mock map geometry)
  const floatsInSelected = (() => {
    if (!selectedPolygon || !mapRef.current) return [];
    const { clientWidth: w, clientHeight: h } = mapRef.current;
    const poly = selectedPolygon.points;
    return floats.filter(f => {
      const p = projectToPixel(f.lat, f.lon, w, h);
      return isPointInPolygon(p, poly);
    });
  })();

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
    <PageLayout 
      showBranding={false} 
      showNavigation={false}
      beamSettings={{
        beamWidth: 3,
        beamHeight: 20,
        beamNumber: 15,
        lightColor: '#ffffff',
        speed: 1.5,
        noiseIntensity: 0.2,
        scale: 0.03,
        rotation: 0
      }}
    >
      <div className="flex flex-col min-h-screen">
        {/* Centered header text only */}
        <div className="py-6 flex justify-center relative z-10">
          <h1 className="text-3xl font-extrabold tracking-wide text-white text-center bg-black/40 border border-gray-700 px-4 py-1 rounded">
            POLYGON SEARCH
          </h1>
        </div>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6">
          {/* Summary cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-black/60 border border-gray-700 rounded-xl p-4">
              <div className="text-gray-400 text-sm">Polygons</div>
              <div className="text-white text-2xl font-bold">{polygons.length}</div>
            </div>
            <div className="bg-black/60 border border-gray-700 rounded-xl p-4">
              <div className="text-gray-400 text-sm">Points (current)</div>
              <div className="text-white text-2xl font-bold">{currentPolygon.length}</div>
            </div>
            <div className="bg-black/60 border border-gray-700 rounded-xl p-4">
              <div className="text-gray-400 text-sm">Floats (mock)</div>
              <div className="text-white text-2xl font-bold">{floats.length}</div>
            </div>
            <div className="bg-black/60 border border-gray-700 rounded-xl p-4">
              <div className="text-gray-400 text-sm">Drawing</div>
              <div className="text-white text-2xl font-bold">{isDrawing ? 'Yes' : 'No'}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Map Section */}
            <div className="lg:col-span-2 bg-black/60 rounded-xl p-4 border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Draw Polygon</h3>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => setIsDrawing(!isDrawing)}
                    className={`text-xs px-3 py-1 rounded bg-gray-900 border border-gray-700 text-gray-300`}
                  >
                    {isDrawing ? 'Stop Drawing' : 'Start Drawing'}
                  </button>
                  {isDrawing && currentPolygon.length > 0 && (
                    <button 
                      onClick={finishDrawing}
                      className="text-xs bg-gray-900 border border-gray-700 text-gray-300 px-3 py-1 rounded"
                    >
                      Finish Polygon
                    </button>
                  )}
                  <button 
                    onClick={() => setPolygons([])}
                    className="text-xs bg-gray-900 border border-gray-700 text-gray-300 px-3 py-1 rounded"
                  >
                    Clear All
                  </button>
                </div>
              </div>
              
              <div 
                ref={mapRef}
                className="h-96 rounded-lg overflow-hidden relative bg-black/70 border border-gray-700 cursor-crosshair"
                onClick={handleMapClick}
              >
                {/* Mock map with float positions */}
                {floats.map(float => (
                  <div 
                    key={float.name}
                    className="absolute w-2.5 h-2.5 rounded-full bg-white transform -translate-x-1/2 -translate-y-1/2"
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
                      fill={selectedPolygon?.id === polygon.id ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.1)"}
                      stroke="#9ca3af"
                      strokeWidth="1.5"
                      className="cursor-pointer"
                    />
                  </svg>
                ))}
                
                {/* Draw current polygon in progress */}
                {isDrawing && currentPolygon.length > 0 && (
                  <svg className="absolute top-0 left-0 w-full h-full">
                    <polygon
                      points={currentPolygon.map(p => `${p.x},${p.y}`).join(' ')}
                      fill="rgba(255,255,255,0.1)"
                      stroke="#9ca3af"
                      strokeWidth="1.5"
                      strokeDasharray="4,4"
                    />
                    {currentPolygon.map((point, i) => (
                      <circle
                        key={i}
                        cx={point.x}
                        cy={point.y}
                        r="3"
                        fill="#e5e7eb"
                      />
                    ))}
                  </svg>
                )}
                
                <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs p-1 rounded border border-gray-700">
                  {isDrawing ? "Click to add polygon points" : "Click 'Start Drawing' to begin"}
                </div>
              </div>
            </div>
            
            {/* Polygon Info Section */}
            <div className="bg-black/60 rounded-xl p-4 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">Polygon Information</h3>
              
              {selectedPolygon ? (
                <div>
                  <div className="mb-4 p-3 bg-black/70 rounded-lg border border-gray-700">
                    <h4 className="font-medium text-white">Selected Polygon</h4>
                    <p className="text-sm text-gray-300">Points: {selectedPolygon.points.length}</p>
                    <p className="text-sm text-gray-300">ID: {selectedPolygon.id}</p>
                  </div>
                  
                  <div className="bg-black/70 rounded-lg p-3 border border-gray-700">
                    <h4 className="font-medium text-white mb-2">Statistics</h4>
                    {(() => {
                      const stats = calculatePolygonStats(selectedPolygon);
                      return (
                        <div className="space-y-2">
                          <p className="text-sm text-gray-300">Floats in area: {stats.floatCount}</p>
                          <p className="text-sm text-gray-300">Avg Temperature: {stats.avgTemperature}°C</p>
                          <p className="text-sm text-gray-300">Avg Salinity: {stats.avgSalinity}</p>
                          <p className="text-sm text-gray-300">Depth Range: {stats.minDepth} - {stats.maxDepth}</p>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Results table for floats within polygon (mocked by pixel geometry) */}
                  <div className="mt-4 bg-black/70 rounded-lg p-3 border border-gray-700">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-white">Floats in Polygon (mock)</h4>
                      <button
                        className="text-xs bg-gray-900 border border-gray-700 text-gray-300 px-2 py-1 rounded"
                        onClick={() => {
                          const headers = ['name','lat','lon','status','temp','salinity'];
                          const lines = [headers.join(',')];
                          floatsInSelected.forEach(f => {
                            lines.push([f.name, f.lat, f.lon, f.status, f.temp, f.salinity].join(','));
                          });
                          const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = 'polygon_floats.csv';
                          a.click();
                          URL.revokeObjectURL(url);
                        }}
                      >
                        Export CSV
                      </button>
                    </div>
                    {floatsInSelected.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="min-w-full text-xs text-left">
                          <thead>
                            <tr className="text-gray-300">
                              <th className="px-2 py-1 border-b border-gray-700">Name</th>
                              <th className="px-2 py-1 border-b border-gray-700">Lat</th>
                              <th className="px-2 py-1 border-b border-gray-700">Lon</th>
                              <th className="px-2 py-1 border-b border-gray-700">Status</th>
                              <th className="px-2 py-1 border-b border-gray-700">Temp (°C)</th>
                              <th className="px-2 py-1 border-b border-gray-700">Salinity</th>
                            </tr>
                          </thead>
                          <tbody>
                            {floatsInSelected.map(f => (
                              <tr key={f.name} className="text-gray-200">
                                <td className="px-2 py-1 border-b border-gray-800">{f.name}</td>
                                <td className="px-2 py-1 border-b border-gray-800">{f.lat}</td>
                                <td className="px-2 py-1 border-b border-gray-800">{f.lon}</td>
                                <td className="px-2 py-1 border-b border-gray-800">{f.status}</td>
                                <td className="px-2 py-1 border-b border-gray-800">{f.temp}</td>
                                <td className="px-2 py-1 border-b border-gray-800">{f.salinity}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-xs text-gray-400">No floats detected within the drawn polygon in this mock view.</div>
                    )}
                  </div>
                  
                  <button 
                    onClick={() => setSelectedPolygon(null)}
                    className="mt-4 w-full bg-gray-900 border border-gray-700 text-gray-300 py-2 rounded"
                  >
                    Clear Selection
                  </button>
                </div>
              ) : polygons.length > 0 ? (
                <div>
                  <p className="text-gray-300 mb-4">Select a polygon on the map to view details</p>
                  <div className="space-y-2">
                    {polygons.map(polygon => (
                      <div 
                        key={polygon.id}
                        className="p-2 bg-black/70 border border-gray-700 rounded-lg cursor-pointer"
                        onClick={() => selectPolygon(polygon)}
                      >
                        <p className="text-sm text-white">Polygon {polygon.id}</p>
                        <p className="text-xs text-gray-300">{polygon.points.length} points</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-gray-300">No polygons created yet. Draw a polygon on the map to get started.</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent polygons table */}
          {polygons.length > 0 && (
            <div className="mt-6 bg-black/60 border border-gray-700 rounded-xl">
              <div className="px-4 py-3 border-b border-gray-700">
                <h3 className="text-white text-lg font-semibold">Recent Polygons</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-xs text-left">
                  <thead>
                    <tr className="text-gray-300">
                      <th className="px-3 py-2 border-b border-gray-700">ID</th>
                      <th className="px-3 py-2 border-b border-gray-700">Points</th>
                      <th className="px-3 py-2 border-b border-gray-700">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {polygons.slice(-5).reverse().map(p => (
                      <tr key={p.id} className="text-gray-200">
                        <td className="px-3 py-2 border-b border-gray-800">{p.id}</td>
                        <td className="px-3 py-2 border-b border-gray-800">{p.points.length}</td>
                        <td className="px-3 py-2 border-b border-gray-800">
                          <button className="px-2 py-1 rounded bg-gray-900 border border-gray-700 text-gray-300" onClick={() => selectPolygon(p)}>View</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </PageLayout>
  );
}