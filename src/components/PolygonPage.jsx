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
  const [showGrid, setShowGrid] = useState(true);
  
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

  // Undo last point while drawing
  const undoLastPoint = () => {
    if (!isDrawing || currentPolygon.length === 0) return;
    setCurrentPolygon(currentPolygon.slice(0, -1));
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
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setIsDrawing(!isDrawing)}
                    className="flex items-center gap-1 text-xs px-2.5 py-1 rounded bg-gray-900 border border-gray-700 text-gray-300 hover:bg-gray-800"
                    title={isDrawing ? 'Stop Drawing' : 'Start Drawing'}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 21l3.75-1.5L19 7.25a1.5 1.5 0 10-2.12-2.12L4.62 17.38 3 21z" stroke="#d1d5db" strokeWidth="1.5" fill="none"/>
                    </svg>
                    {isDrawing ? 'Stop' : 'Draw'}
                  </button>
                  <button
                    onClick={undoLastPoint}
                    className="flex items-center gap-1 text-xs px-2.5 py-1 rounded bg-gray-900 border border-gray-700 text-gray-300 hover:bg-gray-800 disabled:opacity-40"
                    disabled={!isDrawing || currentPolygon.length === 0}
                    title="Undo last point"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7 7l-4 4 4 4" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M20 17a7 7 0 00-7-7H3" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    Undo
                  </button>
                  <button 
                    onClick={finishDrawing}
                    className="flex items-center gap-1 text-xs px-2.5 py-1 rounded bg-gray-900 border border-gray-700 text-gray-300 hover:bg-gray-800 disabled:opacity-40"
                    disabled={!isDrawing || currentPolygon.length < 3}
                    title="Finish polygon"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 6L9 17l-5-5" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Finish
                  </button>
                  <button 
                    onClick={() => setPolygons([])}
                    className="flex items-center gap-1 text-xs px-2.5 py-1 rounded bg-gray-900 border border-gray-700 text-gray-300 hover:bg-gray-800"
                    title="Clear all polygons"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 6h18" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round"/>
                      <path d="M8 6v12a2 2 0 002 2h4a2 2 0 002-2V6" stroke="#d1d5db" strokeWidth="1.5"/>
                      <path d="M10 6V4h4v2" stroke="#d1d5db" strokeWidth="1.5"/>
                    </svg>
                    Clear
                  </button>
                  <button
                    onClick={() => setShowGrid(!showGrid)}
                    className="flex items-center gap-1 text-xs px-2.5 py-1 rounded bg-gray-900 border border-gray-700 text-gray-300 hover:bg-gray-800"
                    title="Toggle grid"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 9h18M3 15h18M9 3v18M15 3v18" stroke="#d1d5db" strokeWidth="1.5"/>
                    </svg>
                    Grid
                  </button>
                </div>
              </div>
              
              <div 
                ref={mapRef}
                className="relative rounded-lg overflow-hidden border border-gray-700 cursor-crosshair h-[60vh] lg:h-[70vh]"
                onClick={handleMapClick}
              >
                {/* Background grid + gradient for visual clarity */}
                {showGrid && (
                  <div
                    aria-hidden
                    className="absolute inset-0"
                    style={{
                      backgroundImage: `
                        radial-gradient(1200px 600px at 50% -10%, rgba(255,255,255,0.10), rgba(0,0,0,0) 60%),
                        linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)
                      `,
                      backgroundSize: '100% 100%, 60px 60px, 60px 60px',
                      backgroundPosition: 'center, 0 0, 0 0',
                      backgroundColor: 'rgba(0,0,0,0.4)'
                    }}
                  />
                )}

                {/* Axes labels for orientation */}
                <div className="absolute left-2 top-2 text-[10px] text-gray-300 bg-black/50 px-1.5 py-0.5 rounded border border-gray-700">Lat/Lon grid</div>
                <div className="pointer-events-none select-none absolute inset-x-0 top-0 text-center text-[10px] text-gray-400 mt-1">0° lon</div>
                <div className="pointer-events-none select-none absolute left-1/2 top-0 bottom-0 border-l border-white/10" style={{ transform: 'translateX(-50%)' }} />

                {/* Compass overlay */}
                <div className="absolute right-2 top-2 bg-black/50 border border-gray-700 rounded px-2 py-1 text-[10px] text-gray-200 flex items-center gap-1">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2v4M12 18v4M2 12h4M18 12h4" stroke="#d1d5db" strokeWidth="1.5"/>
                    <path d="M15.5 8.5l-3.5 7-3.5-7 7 3.5z" fill="#93c5fd" fillOpacity="0.6" stroke="#60a5fa" strokeWidth="1"/>
                  </svg>
                  N
                </div>

                {/* Legend overlay */}
                <div className="absolute right-2 bottom-2 bg-black/60 border border-gray-700 rounded p-2 text-[10px] text-gray-200 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="inline-block w-2.5 h-2.5 rounded-full bg-white" />
                    <span>Float</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-block w-3 h-3 border-2 border-blue-300" style={{ boxShadow: '0 0 6px rgba(96,165,250,0.3)' }} />
                    <span>Polygon</span>
                  </div>
                </div>

                {/* Mock map with float positions */}
                {floats.map(float => (
                  <div 
                    key={float.name}
                    className="absolute -translate-x-1/2 -translate-y-1/2"
                    style={{
                      left: `${((float.lon + 180) / 360) * 100}%`,
                      top: `${((90 - float.lat) / 180) * 100}%`
                    }}
                  >
                    <div className="w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.6)] will-change-transform" />
                    <div className="mt-1 text-[10px] text-gray-200 bg-black/60 px-1 py-0.5 rounded border border-gray-700 whitespace-nowrap">
                      {float.name}
                    </div>
                  </div>
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
                      fill={selectedPolygon?.id === polygon.id ? "rgba(59,130,246,0.18)" : "rgba(255,255,255,0.10)"}
                      stroke={selectedPolygon?.id === polygon.id ? "#60a5fa" : "#9ca3af"}
                      strokeWidth="2"
                      filter="drop-shadow(0 0 6px rgba(96,165,250,0.3))"
                      className="cursor-pointer"
                    />
                  </svg>
                ))}
                
                {/* Draw current polygon in progress */}
                {isDrawing && currentPolygon.length > 0 && (
                  <svg className="absolute top-0 left-0 w-full h-full">
                    <polygon
                      points={currentPolygon.map(p => `${p.x},${p.y}`).join(' ')}
                      fill="rgba(96,165,250,0.12)"
                      stroke="#93c5fd"
                      strokeWidth="2"
                      strokeDasharray="6,6"
                    />
                    {currentPolygon.map((point, i) => (
                      <circle
                        key={i}
                        cx={point.x}
                        cy={point.y}
                        r="3.5"
                        fill="#ffffff"
                        style={{ filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.6))' }}
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