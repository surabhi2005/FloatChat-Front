// import React, { useState, useEffect } from "react";
// import {
//   MapContainer,
//   TileLayer,
//   Marker,
//   Polygon,
//   Polyline,
//   Popup,
//   useMapEvents,
// } from "react-leaflet";
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";

// // Red marker for vertices
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

// // Dummy floats
// const floats = [
//   { name: "Float 1", lat: 10, lon: 80, status: "Active", temp: 23, salinity: 35 },
//   { name: "Float 2", lat: -5, lon: 90, status: "Inactive", temp: 20, salinity: 33 },
// ];

// export default function PolygonPage() {
//   const [polygons, setPolygons] = useState([]);
//   const [currentPolygon, setCurrentPolygon] = useState([]);
//   const [isDrawing, setIsDrawing] = useState(false);
//   const [selectedPolygon, setSelectedPolygon] = useState(null);

//   const finishDrawing = () => {
//     if (currentPolygon.length > 2) {
//       const newPolygon = { id: Date.now(), points: currentPolygon };
//       setPolygons([...polygons, newPolygon]);
//     }
//     setIsDrawing(false);
//     setCurrentPolygon([]);
//   };

//   const toggleDrawing = () => {
//     if (isDrawing) finishDrawing();
//     else {
//       setCurrentPolygon([]);
//       setIsDrawing(true);
//     }
//   };

//   const selectPolygon = (poly) => setSelectedPolygon(poly);

//   const MapClickHandler = () => {
//     useMapEvents({
//       click: (e) => {
//         if (isDrawing) {
//           setCurrentPolygon([...currentPolygon, [e.latlng.lat, e.latlng.lng]]);
//         }
//       },
//     });
//     return null;
//   };

//   return (
//     <div className="min-h-screen bg-gray-900 p-6">
//       <div className="max-w-7xl mx-auto">
//       <h1 className="text-3xl font-extrabold tracking-wide text-white text-center bg-black/40 border border-gray-700 px-4 py-2 rounded">
//           POLYGON ANALYSIS
//         </h1>
//         {/* Summary cards */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//           <div className="bg-black/60 border border-gray-700 rounded-xl p-4">
//             <div className="text-gray-400 text-sm">Polygons</div>
//             <div className="text-white text-2xl font-bold">{polygons.length}</div>
//           </div>
//           <div className="bg-black/60 border border-gray-700 rounded-xl p-4">
//             <div className="text-gray-400 text-sm">Points (current)</div>
//             <div className="text-white text-2xl font-bold">{currentPolygon.length}</div>
//           </div>
//           <div className="bg-black/60 border border-gray-700 rounded-xl p-4">
//             <div className="text-gray-400 text-sm">Floats</div>
//             <div className="text-white text-2xl font-bold">{floats.length}</div>
//           </div>
//           <div className="bg-black/60 border border-gray-700 rounded-xl p-4">
//             <div className="text-gray-400 text-sm">Drawing</div>
//             <div className="text-white text-2xl font-bold">{isDrawing ? "Yes" : "No"}</div>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           {/* Map Section */}
//           <div className="lg:col-span-2 bg-black/60 rounded-xl p-4 border border-gray-700">
//             <div className="flex items-center justify-between mb-4">
//               <h3 className="text-lg font-semibold text-white">Draw Polygon</h3>
//               <div className="flex gap-2">
//                 <button
//                   onClick={toggleDrawing}
//                   className="px-3 py-1 rounded bg-gray-900 border border-gray-700 text-gray-300 hover:bg-gray-800"
//                 >
//                   {isDrawing ? "Finish" : "Draw"}
//                 </button>
//                 <button
//                   onClick={() => {
//                     setPolygons([]);
//                     setCurrentPolygon([]);
//                     setSelectedPolygon(null);
//                   }}
//                   className="px-3 py-1 rounded bg-gray-900 border border-gray-700 text-gray-300 hover:bg-gray-800"
//                 >
//                   Clear
//                 </button>
//               </div>
//             </div>

//             <div className="h-[500px] w-full rounded-lg overflow-hidden">
//               <MapContainer center={[0, 80]} zoom={3} className="h-full w-full">
//                 <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />

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
//                     fillColor={
//                       selectedPolygon?.id === p.id
//                         ? "rgba(96,165,250,0.2)"
//                         : "rgba(156,163,175,0.2)"
//                     }
//                     onClick={() => selectPolygon(p)}
//                   />
//                 ))}

//                 {/* Current drawing points */}
//                 {currentPolygon.map((pt, i) => (
//                   <Marker
//                     key={i}
//                     position={pt}
//                     icon={redIcon}
//                     eventHandlers={{
//                       click: () => {
//                         if (i === 0 && isDrawing) finishDrawing();
//                       },
//                     }}
//                   >
//                     <Popup>Point {i + 1}</Popup>
//                   </Marker>
//                 ))}

//                 {currentPolygon.length > 1 && (
//                   <Polyline positions={currentPolygon} color="#93c5fd" dashArray="5,5" />
//                 )}
//                 <MapClickHandler />
//               </MapContainer>
//             </div>
//           </div>

//           {/* Polygon Info Section */}
//           <div className="bg-black/60 rounded-xl p-4 border border-gray-700">
//             <h3 className="text-lg font-semibold text-white mb-4">Polygon Information</h3>
//             {selectedPolygon ? (
//               <div>
//                 <div className="mb-4 p-3 bg-black/70 rounded-lg border border-gray-700">
//                   <h4 className="font-medium text-white">Selected Polygon</h4>
//                   <p className="text-sm text-gray-300">Points: {selectedPolygon.points.length}</p>
//                   <p className="text-sm text-gray-300">ID: {selectedPolygon.id}</p>
//                 </div>
//                 <div className="bg-black/70 rounded-lg p-3 border border-gray-700 max-h-64 overflow-auto">
//                   <h4 className="font-medium text-white mb-2">Coordinates</h4>
//                   <ul className="text-xs text-gray-300 list-disc list-inside">
//                     {selectedPolygon.points.map((point, index) => (
//                       <li key={index}>
//                         Lat: {point[0].toFixed(4)}, Lng: {point[1].toFixed(4)}
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//                 <button
//                   onClick={() => setSelectedPolygon(null)}
//                   className="mt-4 w-full bg-gray-900 border border-gray-700 text-gray-300 py-2 rounded hover:bg-gray-800"
//                 >
//                   Clear Selection
//                 </button>
//               </div>
//             ) : polygons.length > 0 ? (
//               <div>
//                 <p className="text-gray-300 mb-4">
//                   Select a polygon on the map to view details
//                 </p>
//                 <div className="space-y-2">
//                   {polygons.map((p) => (
//                     <div
//                       key={p.id}
//                       className="p-2 bg-black/70 border border-gray-700 rounded-lg cursor-pointer hover:bg-gray-800"
//                       onClick={() => selectPolygon(p)}
//                     >
//                       <p className="text-sm text-white">Polygon {p.id}</p>
//                       <p className="text-xs text-gray-300">{p.points.length} points</p>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             ) : (
//               <p className="text-gray-300">No polygons created yet.</p>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
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
import floatData from "../floatdetails.json"; // import your float JSON file
import { CircleMarker, Tooltip } from "react-leaflet";


// Helper: point-in-polygon
const isPointInPolygon = (point, polygon) => {
  const x = point[0],
    y = point[1];
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][0],
      yi = polygon[i][1];
    const xj = polygon[j][0],
      yj = polygon[j][1];
    const intersect =
      yi > y !== yj > y &&
      x < ((xj - xi) * (y - yi)) / (yj - yi + 0.00000001) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
};

// Determine float status by year
const getStatus = (juld) => {
  const year = new Date(juld).getFullYear();
  return year < 2025 ? "Inactive" : "Active";
};

export default function PolygonPage() {
  const [polygons, setPolygons] = useState([]);
  const [currentPolygon, setCurrentPolygon] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedPolygon, setSelectedPolygon] = useState(null);
  const [floats, setFloats] = useState([]);

  useEffect(() => {
    setFloats(floatData); // load floats from JSON
  }, []);

  const finishDrawing = () => {
    if (currentPolygon.length > 2) {
      setPolygons([...polygons, { id: Date.now(), points: currentPolygon }]);
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

  // Filter floats inside selected polygon
  const floatsInSelectedPolygon = selectedPolygon
    ? floats.filter((f) =>
        isPointInPolygon([f.LATITUDE, f.LONGITUDE], selectedPolygon.points)
      )
    : [];

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
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>

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
  <CircleMarker
    key={i}
    center={pt}
    radius={6}           // size of the dot
    color="#ff0000"       // border color
    fillColor="#ff0000"   // fill color
    fillOpacity={1}       // solid fill
    eventHandlers={{
      click: () => {
        if (i === 0 && isDrawing) finishDrawing();
      },
    }}
  >
    <Popup>Point {i + 1}</Popup>
  </CircleMarker>
))}


                {currentPolygon.length > 1 && (
                  <Polyline positions={currentPolygon} color="#93c5fd" dashArray="5,5" />
                )}

                {/* Floats inside polygon */}
                {selectedPolygon &&
                  floatsInSelectedPolygon.map((f) => (
                    <Marker
                      key={f.PLATFORM_NUMBER}
                      position={[f.LATITUDE, f.LONGITUDE]}
                    >
                      <Popup>
                        <div className="bg-white text-black p-3 rounded-lg border shadow-md w-48">
                          <h4 className="font-bold text-blue-600">{f.PLATFORM_NUMBER}</h4>
                          <p>Project: {f.PROJECT_NAME}</p>
                          <p>PI: {f.PI_NAME}</p>
                          <p>Lat: {f.LATITUDE.toFixed(4)}</p>
                          <p>Lon: {f.LONGITUDE.toFixed(4)}</p>
                          <p>Cycle: {f.CYCLE_NUMBER}</p>
                          <p>
                            Status:{" "}
                            <span
                              className={
                                getStatus(f.JULD_date) === "Active"
                                  ? "text-green-600 font-semibold"
                                  : "text-red-600 font-semibold"
                              }
                            >
                              {getStatus(f.JULD_date)}
                            </span>
                          </p>
                        </div>
                      </Popup>
                    </Marker>
                  ))}

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
                  <p className="text-sm text-gray-300">
                    Floats inside: {floatsInSelectedPolygon.length}
                  </p>
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
                <p className="text-gray-300 mb-4">Select a polygon on the map to view details</p>
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
