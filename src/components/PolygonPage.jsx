// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import PageLayout from "./PageLayout";
// import {
//   MapContainer,
//   TileLayer,
//   Marker,
//   Popup,
//   Polygon,
//   Polyline,
//   useMapEvents,
// } from "react-leaflet";
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";

// // Custom red marker icon for polygon vertices
// const redIcon = new L.Icon({
//   iconUrl:
//     "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
//   shadowUrl:
//     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
//   popupAnchor: [1, -34],
//   shadowSize: [41, 41],
// });

// export default function PolygonPage() {
//   const navigate = useNavigate();
//   const [polygons, setPolygons] = useState([]);
//   const [selectedPolygon, setSelectedPolygon] = useState(null);
//   const [isDrawing, setIsDrawing] = useState(false);
//   const [currentPolygon, setCurrentPolygon] = useState([]);

//   // Mock float data
//   const floats = [
//     { lat: 0, lon: 80, name: "Float-1", status: "active", temp: 22.4, salinity: 35.2 },
//     { lat: 10, lon: 90, name: "Float-2", status: "active", temp: 24.1, salinity: 34.8 },
//     { lat: -5, lon: 85, name: "Float-3", status: "maintenance", temp: 21.8, salinity: 35.5 },
//     { lat: 15, lon: 75, name: "Float-4", status: "active", temp: 25.3, salinity: 34.9 },
//     { lat: -8, lon: 95, name: "Float-5", status: "inactive", temp: 20.7, salinity: 35.8 },
//   ];

//   // Finish drawing polygon
//   const finishDrawing = () => {
//     if (currentPolygon.length < 3) return;

//     // Auto-close polygon if not already closed
//     let closedPolygon = currentPolygon;
//     const first = currentPolygon[0];
//     const last = currentPolygon[currentPolygon.length - 1];
//     if (first[0] !== last[0] || first[1] !== last[1]) {
//       closedPolygon = [...currentPolygon, first];
//     }

//     const newPolygon = { points: closedPolygon, id: Date.now() };
//     setPolygons([...polygons, newPolygon]);
//     setCurrentPolygon([]);
//     setIsDrawing(false);

//     console.log("Polygon finished, sending to backend:", newPolygon.points);
//   };

//   // Map click handler for drawing polygons
//   function MapClickHandler() {
//     useMapEvents({
//       click(e) {
//         if (!isDrawing) return;

//         const { lat, lng } = e.latlng;

//         if (currentPolygon.length > 0) {
//           const [firstLat, firstLng] = currentPolygon[0];
//           // Distance check (approx)
//           const distance = Math.sqrt(
//             Math.pow(lat - firstLat, 2) + Math.pow(lng - firstLng, 2)
//           );
//           // If click is near the first point → finish polygon
//           if (distance < 0.05) {
//             finishDrawing();
//             return;
//           }
//         }

//         // Otherwise add new point
//         setCurrentPolygon((prev) => [...prev, [lat, lng]]);
//       },
//     });
//     return null;
//   }

//   const calculatePolygonStats = (polygon) => ({
//     floatCount: 3,
//     avgTemperature: 23.2,
//     avgSalinity: 35.1,
//     minDepth: "800m",
//     maxDepth: "2000m",
//   });

//   const selectPolygon = (polygon) => setSelectedPolygon(polygon);

//   useEffect(() => {
//     return () => {
//       setSelectedPolygon(null);
//       setCurrentPolygon([]);
//       setIsDrawing(false);
//     };
//   }, []);

//   return (
//     <PageLayout
//       showBranding={false}
//       showNavigation={false}
//       beamSettings={{
//         beamWidth: 3,
//         beamHeight: 20,
//         beamNumber: 15,
//         lightColor: "#ffffff",
//         speed: 1.5,
//         noiseIntensity: 0.2,
//         scale: 0.03,
//         rotation: 0,
//       }}
//     >
//       <div className="flex flex-col min-h-screen">
//         {/* Centered header text */}
//         <div className="py-6 flex justify-center relative z-10">
//           <h1 className="text-3xl font-extrabold tracking-wide text-white text-center bg-black/40 border border-gray-700 px-4 py-1 rounded">
//             POLYGON ANALYSIS
//           </h1>
//         </div>

//         {/* Main Content */}
//         <main className="flex-1 p-4 md:p-6">
//           {/* Summary cards */}
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//             <div className="bg-black/60 border border-gray-700 rounded-xl p-4">
//               <div className="text-gray-400 text-sm">Polygons</div>
//               <div className="text-white text-2xl font-bold">{polygons.length}</div>
//             </div>
//             <div className="bg-black/60 border border-gray-700 rounded-xl p-4">
//               <div className="text-gray-400 text-sm">Points (current)</div>
//               <div className="text-white text-2xl font-bold">{currentPolygon.length}</div>
//             </div>
//             <div className="bg-black/60 border border-gray-700 rounded-xl p-4">
//               <div className="text-gray-400 text-sm">Floats (mock)</div>
//               <div className="text-white text-2xl font-bold">{floats.length}</div>
//             </div>
//             <div className="bg-black/60 border border-gray-700 rounded-xl p-4">
//               <div className="text-gray-400 text-sm">Drawing</div>
//               <div className="text-white text-2xl font-bold">{isDrawing ? "Yes" : "No"}</div>
//             </div>
//           </div>

//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//             {/* Map Section */}
//             <div className="lg:col-span-2 bg-black/60 rounded-xl p-4 border border-gray-700">
//               <div className="flex items-center justify-between mb-4">
//                 <h3 className="text-lg font-semibold text-white">Draw Polygon</h3>
//                 <div className="flex flex-wrap gap-2">
//                   <button
//                     onClick={() => setIsDrawing(!isDrawing)}
//                     className="flex items-center gap-1 text-xs px-2.5 py-1 rounded bg-gray-900 border border-gray-700 text-gray-300 hover:bg-gray-800"
//                     title={isDrawing ? "Stop Drawing" : "Start Drawing"}
//                   >
//                     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//                       <path d="M3 21l3.75-1.5L19 7.25a1.5 1.5 0 10-2.12-2.12L4.62 17.38 3 21z" stroke="#d1d5db" strokeWidth="1.5" fill="none" />
//                     </svg>
//                     {isDrawing ? "Stop" : "Draw"}
//                   </button>
//                   {isDrawing && currentPolygon.length > 0 && (
//                     <button
//                       onClick={finishDrawing}
//                       className="flex items-center gap-1 text-xs px-2.5 py-1 rounded bg-gray-900 border border-gray-700 text-gray-300 hover:bg-gray-800"
//                       title="Finish polygon"
//                     >
//                       <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//                         <path d="M20 6L9 17l-5-5" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
//                       </svg>
//                       Finish
//                     </button>
//                   )}
//                   <button
//                     onClick={() => {
//                       setPolygons([]);
//                       setCurrentPolygon([]);
//                       setSelectedPolygon(null);
//                     }}
//                     className="flex items-center gap-1 text-xs px-2.5 py-1 rounded bg-gray-900 border border-gray-700 text-gray-300 hover:bg-gray-800"
//                     title="Clear all polygons"
//                   >
//                     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//                       <path d="M3 6h18" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round" />
//                       <path d="M8 6v12a2 2 0 002 2h4a2 2 0 002-2V6" stroke="#d1d5db" strokeWidth="1.5" />
//                       <path d="M10 6V4h4v2" stroke="#d1d5db" strokeWidth="1.5" />
//                     </svg>
//                     Clear
//                   </button>
//                 </div>
//               </div>

//               {/* Map */}
//               <MapContainer
//                 center={[0, 80]}
//                 zoom={3}
//                 className="h-96 w-full rounded-lg border border-gray-700"
//               >
//                 <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

//                 {/* Floats */}
//                 {floats.map((f) => (
//                   <Marker key={f.name} position={[f.lat, f.lon]}>
//                     <Popup>
//                       <div className="text-black">
//                         <strong>{f.name}</strong>
//                         <p>Status: {f.status}</p>
//                         <p>Temp: {f.temp}°C</p>
//                         <p>Salinity: {f.salinity}</p>
//                       </div>
//                     </Popup>
//                   </Marker>
//                 ))}

//                 {/* Finished polygons */}
//                 {polygons.map((p) => (
//                   <Polygon
//                     key={p.id}
//                     positions={p.points}
//                     color={selectedPolygon?.id === p.id ? "#60a5fa" : "#9ca3af"}
//                     fillColor={selectedPolygon?.id === p.id ? "rgba(96,165,250,0.2)" : "rgba(156,163,175,0.2)"}
//                     onClick={() => selectPolygon(p)}
//                   />
//                 ))}

//                 {/* Current drawing points with red icon */}
//                 {currentPolygon.map((pt, i) => (
//                   <Marker
//                     key={i}
//                     position={pt}
//                     icon={redIcon}
//                     eventHandlers={{
//                       click: () => {
//                         if (i === 0 && isDrawing) {
//                           finishDrawing();
//                         }
//                       },
//                     }}
//                   >
//                     <Popup>Point {i + 1}</Popup>
//                   </Marker>
//                 ))}

//                 {/* Connect current points with polyline */}
//                 {currentPolygon.length > 1 && (
//                   <Polyline positions={currentPolygon} color="#93c5fd" dashArray="5,5" />
//                 )}

//                 <MapClickHandler />
//               </MapContainer>
//             </div>

//             {/* Polygon Info Section */}
//             <div className="bg-black/60 rounded-xl p-4 border border-gray-700">
//               <h3 className="text-lg font-semibold text-white mb-4">Polygon Information</h3>

//               {selectedPolygon ? (
//                 <div>
//                   <div className="mb-4 p-3 bg-black/70 rounded-lg border border-gray-700">
//                     <h4 className="font-medium text-white">Selected Polygon</h4>
//                     <p className="text-sm text-gray-300">Points: {selectedPolygon.points.length}</p>
//                     <p className="text-sm text-gray-300">ID: {selectedPolygon.id}</p>
//                   </div>

//                   <div className="bg-black/70 rounded-lg p-3 border border-gray-700">
//                     <h4 className="font-medium text-white mb-2">Statistics</h4>
//                     {(() => {
//                       const stats = calculatePolygonStats(selectedPolygon);
//                       return (
//                         <div className="space-y-2">
//                           <p className="text-sm text-gray-300">Floats in area: {stats.floatCount}</p>
//                           <p className="text-sm text-gray-300">Avg Temperature: {stats.avgTemperature}°C</p>
//                           <p className="text-sm text-gray-300">Avg Salinity: {stats.avgSalinity}</p>
//                           <p className="text-sm text-gray-300">
//                             Depth Range: {stats.minDepth} - {stats.maxDepth}
//                           </p>

//                           {/* Coordinates list */}
//                           <div className="mt-2">
//                             <h5 className="font-medium text-white mb-1">Coordinates:</h5>
//                             <ul className="text-xs text-gray-300 list-disc list-inside max-h-32 overflow-auto">
//                               {selectedPolygon.points.map((point, index) => (
//                                 <li key={index}>
//                                   Lat: {point[0].toFixed(4)}, Lng: {point[1].toFixed(4)}
//                                 </li>
//                               ))}
//                             </ul>
//                           </div>
//                         </div>
//                       );
//                     })()}
//                   </div>

//                   <button
//                     onClick={() => setSelectedPolygon(null)}
//                     className="mt-4 w-full bg-gray-900 border border-gray-700 text-gray-300 py-2 rounded hover:bg-gray-800 transition"
//                   >
//                     Clear Selection
//                   </button>
//                 </div>
//               ) : polygons.length > 0 ? (
//                 <div>
//                   <p className="text-gray-300 mb-4">Select a polygon on the map to view details</p>
//                   <div className="space-y-2">
//                     {polygons.map((p) => (
//                       <div
//                         key={p.id}
//                         className="p-2 bg-black/70 border border-gray-700 rounded-lg cursor-pointer hover:bg-gray-800 transition"
//                         onClick={() => selectPolygon(p)}
//                       >
//                         <p className="text-sm text-white">Polygon {p.id}</p>
//                         <p className="text-xs text-gray-300">{p.points.length} points</p>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               ) : (
//                 <div>
//                   <p className="text-gray-300">
//                     No polygons created yet. Draw a polygon on the map to get started.
//                   </p>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Recent polygons table */}
//           {polygons.length > 0 && (
//             <div className="mt-6 bg-black/60 border border-gray-700 rounded-xl">
//               <div className="px-4 py-3 border-b border-gray-700">
//                 <h3 className="text-white text-lg font-semibold">Recent Polygons</h3>
//               </div>
//               <div className="overflow-x-auto">
//                 <table className="min-w-full text-xs text-left">
//                   <thead>
//                     <tr className="text-gray-300">
//                       <th className="px-3 py-2 border-b border-gray-700">ID</th>
//                       <th className="px-3 py-2 border-b border-gray-700">Points</th>
//                       <th className="px-3 py-2 border-b border-gray-700">Action</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {polygons
//                       .slice(-5)
//                       .reverse()
//                       .map((p) => (
//                         <tr key={p.id} className="text-gray-200">
//                           <td className="px-3 py-2 border-b border-gray-800">{p.id}</td>
//                           <td className="px-3 py-2 border-b border-gray-800">{p.points.length}</td>
//                           <td className="px-3 py-2 border-b border-gray-800">
//                             <button
//                               className="px-2 py-1 rounded bg-gray-900 border border-gray-700 text-gray-300"
//                               onClick={() => selectPolygon(p)}
//                             >
//                               View
//                             </button>
//                           </td>
//                         </tr>
//                       ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           )}
//         </main>
//       </div>
//     </PageLayout>
//   );
// }

import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polygon,
  Polyline,
  Popup,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Red marker for vertices
const redIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Dummy floats
const floats = [
  { name: "Float 1", lat: 10, lon: 80, status: "Active", temp: 23, salinity: 35 },
  { name: "Float 2", lat: -5, lon: 90, status: "Inactive", temp: 20, salinity: 33 },
];

export default function PolygonPage() {
  const [polygons, setPolygons] = useState([]);
  const [currentPolygon, setCurrentPolygon] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedPolygon, setSelectedPolygon] = useState(null);

  const finishDrawing = () => {
    if (currentPolygon.length > 2) {
      const newPolygon = { id: Date.now(), points: currentPolygon };
      setPolygons([...polygons, newPolygon]);
    }
    setIsDrawing(false);
    setCurrentPolygon([]);
  };

  const toggleDrawing = () => {
    if (isDrawing) finishDrawing();
    else {
      setCurrentPolygon([]);
      setIsDrawing(true);
    }
  };

  const selectPolygon = (poly) => setSelectedPolygon(poly);

  const MapClickHandler = () => {
    useMapEvents({
      click: (e) => {
        if (isDrawing) {
          setCurrentPolygon([...currentPolygon, [e.latlng.lat, e.latlng.lng]]);
        }
      },
    });
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-extrabold tracking-wide text-white text-center bg-black/40 border border-gray-700 px-4 py-2 rounded">
          POLYGON ANALYSIS
        </h1>
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
            <div className="text-gray-400 text-sm">Floats</div>
            <div className="text-white text-2xl font-bold">{floats.length}</div>
          </div>
          <div className="bg-black/60 border border-gray-700 rounded-xl p-4">
            <div className="text-gray-400 text-sm">Drawing</div>
            <div className="text-white text-2xl font-bold">{isDrawing ? "Yes" : "No"}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map Section */}
          <div className="lg:col-span-2 bg-black/60 rounded-xl p-4 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Draw Polygon</h3>
              <div className="flex gap-2">
                <button
                  onClick={toggleDrawing}
                  className="px-3 py-1 rounded bg-gray-900 border border-gray-700 text-gray-300 hover:bg-gray-800"
                >
                  {isDrawing ? "Finish" : "Draw"}
                </button>
                <button
                  onClick={() => {
                    setPolygons([]);
                    setCurrentPolygon([]);
                    setSelectedPolygon(null);
                  }}
                  className="px-3 py-1 rounded bg-gray-900 border border-gray-700 text-gray-300 hover:bg-gray-800"
                >
                  Clear
                </button>
              </div>
            </div>

            <div className="h-[500px] w-full rounded-lg overflow-hidden">
              <MapContainer center={[0, 80]} zoom={3} className="h-full w-full">
                <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />

                {/* Floats */}
                {floats.map((f) => (
                  <Marker key={f.name} position={[f.lat, f.lon]}>
                    <Popup>
                      <div className="text-black">
                        <strong>{f.name}</strong>
                        <p>Status: {f.status}</p>
                        <p>Temp: {f.temp}°C</p>
                        <p>Salinity: {f.salinity}</p>
                      </div>
                    </Popup>
                  </Marker>
                ))}

                {/* Finished polygons */}
                {polygons.map((p) => (
                  <Polygon
                    key={p.id}
                    positions={p.points}
                    color={selectedPolygon?.id === p.id ? "#60a5fa" : "#9ca3af"}
                    fillColor={
                      selectedPolygon?.id === p.id
                        ? "rgba(96,165,250,0.2)"
                        : "rgba(156,163,175,0.2)"
                    }
                    onClick={() => selectPolygon(p)}
                  />
                ))}

                {/* Current drawing points */}
                {currentPolygon.map((pt, i) => (
                  <Marker
                    key={i}
                    position={pt}
                    icon={redIcon}
                    eventHandlers={{
                      click: () => {
                        if (i === 0 && isDrawing) finishDrawing();
                      },
                    }}
                  >
                    <Popup>Point {i + 1}</Popup>
                  </Marker>
                ))}

                {currentPolygon.length > 1 && (
                  <Polyline positions={currentPolygon} color="#93c5fd" dashArray="5,5" />
                )}
                <MapClickHandler />
              </MapContainer>
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
                <div className="bg-black/70 rounded-lg p-3 border border-gray-700 max-h-64 overflow-auto">
                  <h4 className="font-medium text-white mb-2">Coordinates</h4>
                  <ul className="text-xs text-gray-300 list-disc list-inside">
                    {selectedPolygon.points.map((point, index) => (
                      <li key={index}>
                        Lat: {point[0].toFixed(4)}, Lng: {point[1].toFixed(4)}
                      </li>
                    ))}
                  </ul>
                </div>
                <button
                  onClick={() => setSelectedPolygon(null)}
                  className="mt-4 w-full bg-gray-900 border border-gray-700 text-gray-300 py-2 rounded hover:bg-gray-800"
                >
                  Clear Selection
                </button>
              </div>
            ) : polygons.length > 0 ? (
              <div>
                <p className="text-gray-300 mb-4">
                  Select a polygon on the map to view details
                </p>
                <div className="space-y-2">
                  {polygons.map((p) => (
                    <div
                      key={p.id}
                      className="p-2 bg-black/70 border border-gray-700 rounded-lg cursor-pointer hover:bg-gray-800"
                      onClick={() => selectPolygon(p)}
                    >
                      <p className="text-sm text-white">Polygon {p.id}</p>
                      <p className="text-xs text-gray-300">{p.points.length} points</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-gray-300">No polygons created yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}