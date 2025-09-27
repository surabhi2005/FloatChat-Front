// // import React, { useState, useEffect, useRef } from 'react';
// // import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet';
// // import L from 'leaflet';
// // import 'leaflet/dist/leaflet.css';

// // // Fix for default markers in react-leaflet
// // delete L.Icon.Default.prototype._getIconUrl;
// // L.Icon.Default.mergeOptions({
// //   iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
// //   iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
// //   shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
// // });

// // // Custom oceanographic float icon
// // const createFloatIcon = (color = '#3B82F6') => {
// //   return new L.Icon({
// //     iconUrl: `data:image/svg+xml;utf8,
// //       <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' fill='${color}'>
// //         <path d='M16 0c-5.523 0-10 4.477-10 10 0 10 10 22 10 22s10-12 10-22c0-5.523-4.477-10-10-10zm0 16c-3.314 0-6-2.686-6-6s2.686-6 6-6 6 2.686 6 6-2.686 6-6 6z'/>
// //       </svg>`,
// //     iconSize: [24, 24],
// //     iconAnchor: [12, 24],
// //     popupAnchor: [0, -24],
// //   });
// // };

// // const MapView = () => {
// //   const [data, setData] = useState([]);
// //   const [mapStyle, setMapStyle] = useState('satellite');
// //   const [selectedFloat, setSelectedFloat] = useState(null);
// //   const [mapLoaded, setMapLoaded] = useState(false);
// //   const [mapError, setMapError] = useState(false);
// //   const mapRef = useRef(null);

// //   useEffect(() => {
// //     const oceanographicData = [
// //       {
// //         id: 1,
// //         platform: "ARGO-7901",
// //         latitude: -15.9896,
// //         longitude: 90.3067,
// //         project: "Argo Australia",
// //         pi: "Peter OKE",
// //         region: "Indian Ocean",
// //         temperature: "29.4°C",
// //         salinity: "34.8 PSU",
// //         depth: "1000m",
// //         status: "Active",
// //         lastUpdate: "2 hours ago"
// //       },
// //       {
// //         id: 2,
// //         platform: "ARGO-7902",
// //         latitude: -43.037,
// //         longitude: 130.202,
// //         project: "UW Argo",
// //         pi: "STEPHEN RISER",
// //         region: "Southern Ocean",
// //         temperature: "2.1°C",
// //         salinity: "34.2 PSU",
// //         depth: "2000m",
// //         status: "Active",
// //         lastUpdate: "1 hour ago"
// //       },
// //       {
// //         id: 3,
// //         platform: "ARGO-7903",
// //         latitude: -41.3693,
// //         longitude: 142.6767,
// //         project: "Argo Australia",
// //         pi: "Christina SCHALLENBERG",
// //         region: "Tasman Sea",
// //         temperature: "18.7°C",
// //         salinity: "35.1 PSU",
// //         depth: "1500m",
// //         status: "Active",
// //         lastUpdate: "3 hours ago"
// //       },
// //       {
// //         id: 4,
// //         platform: "ARGO-7904",
// //         latitude: -54.2695,
// //         longitude: 47.7197,
// //         project: "GO-BGC WHOI",
// //         pi: "DAVID NICHOLSON",
// //         region: "South Atlantic",
// //         temperature: "4.2°C",
// //         salinity: "34.5 PSU",
// //         depth: "1800m",
// //         status: "Active",
// //         lastUpdate: "4 hours ago"
// //       },
// //       {
// //         id: 5,
// //         platform: "ARGO-7905",
// //         latitude: -18.7639,
// //         longitude: 85.0806,
// //         project: "Argo SIO",
// //         pi: "DEAN ROEMMICH",
// //         region: "Indian Ocean",
// //         temperature: "28.9°C",
// //         salinity: "35.3 PSU",
// //         depth: "1200m",
// //         status: "Active",
// //         lastUpdate: "1 hour ago"
// //       }
// //     ];
    
// //     setData(oceanographicData);
// //   }, []);

// //   useEffect(() => {
// //     const timer = setTimeout(() => {
// //       if (!mapLoaded) {
// //         setMapError(true);
// //       }
// //     }, 10000);

// //     return () => clearTimeout(timer);
// //   }, [mapLoaded]);

// //   const handleMapReady = () => {
// //     setMapLoaded(true);
// //     if (mapRef.current) {
// //       mapRef.current.invalidateSize();
// //     }
// //   };

// //   const mapStyles = {
// //     satellite: {
// //       url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
// //       attribution: '&copy; Esri, Maxar, Earthstar Geographics'
// //     },
// //     standard: {
// //       url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
// //       attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
// //     }
// //   };

// //   const getStatusColor = (status) => {
// //     return status === 'Active' ? '#10B981' : '#F59E0B';
// //   };

// //   const StatCard = ({ title, value, color = "text-white" }) => (
// //     <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
// //       <div className="text-blue-200 text-sm mb-1">{title}</div>
// //       <div className={`text-xl font-semibold ${color}`}>{value}</div>
// //     </div>
// //   );

// //   const InfoCard = ({ title, children, className = "" }) => (
// //     <div className={`bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 ${className}`}>
// //       <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
// //       {children}
// //     </div>
// //   );

// //   return (
// //     <div className="w-full h-full flex flex-col">
// //       {/* Header Section */}
// //       <div className="flex-shrink-0 p-6 text-center">
// //         <h1 className="text-3xl font-bold text-white mb-2">
// //           Oceanographic Data Map
// //         </h1>
// //         <p className="text-blue-200">
// //           Real-time monitoring of ARGO float deployments across global oceans
// //         </p>
        
// //         {/* Map Style Controls */}
// //         <div className="flex justify-center gap-3 mt-4">
// //           {Object.keys(mapStyles).map((style) => (
// //             <button 
// //               key={style}
// //               onClick={() => setMapStyle(style)}
// //               className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
// //                 mapStyle === style
// //                   ? 'bg-blue-500 text-white shadow-lg'
// //                   : 'bg-gray-600/30 text-gray-200 hover:bg-gray-500/40'
// //               }`}
// //             >
// //               {style.charAt(0).toUpperCase() + style.slice(1)}
// //             </button>
// //           ))}
// //         </div>
// //       </div>

// //       {/* Main Content */}
// //       <div className="flex-1 min-h-0 px-6 pb-6">
// //         <div className="max-w-7xl mx-auto h-full">
// //           <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
            
// //             {/* Left Sidebar */}
// //             <div className="lg:col-span-1 space-y-6">
// //               {/* Overview Stats */}
// //               <InfoCard title="System Overview">
// //                 <div className="grid grid-cols-2 gap-4">
// //                   <StatCard title="Total Floats" value={data.length} />
// //                   <StatCard 
// //                     title="Active" 
// //                     value={data.filter(f => f.status === 'Active').length} 
// //                     color="text-green-400"
// //                   />
// //                   <StatCard 
// //                     title="Maintenance" 
// //                     value={data.filter(f => f.status === 'Maintenance').length} 
// //                     color="text-yellow-400"
// //                   />
// //                   <StatCard 
// //                     title="Regions" 
// //                     value={new Set(data.map(f => f.region)).size} 
// //                   />
// //                 </div>
// //               </InfoCard>

// //               {/* Selected Float Details */}
// //               {selectedFloat && (
// //                 <InfoCard title="Float Details">
// //                   <div className="space-y-3">
// //                     <DetailItem label="Platform" value={selectedFloat.platform} />
// //                     <DetailItem label="Project" value={selectedFloat.project} />
// //                     <DetailItem label="Principal Investigator" value={selectedFloat.pi} />
// //                     <DetailItem label="Region" value={selectedFloat.region} />
// //                     <DetailItem 
// //                       label="Coordinates" 
// //                       value={`${selectedFloat.latitude.toFixed(4)}°, ${selectedFloat.longitude.toFixed(4)}°`} 
// //                     />
// //                     <DetailItem label="Temperature" value={selectedFloat.temperature} />
// //                     <DetailItem label="Salinity" value={selectedFloat.salinity} />
// //                     <DetailItem label="Depth" value={selectedFloat.depth} />
// //                     <div className="flex items-center justify-between pt-2">
// //                       <span className="text-blue-200 text-sm">Status:</span>
// //                       <span className={`px-2 py-1 rounded text-xs font-medium ${
// //                         selectedFloat.status === 'Active' 
// //                           ? 'bg-green-500/20 text-green-400' 
// //                           : 'bg-yellow-500/20 text-yellow-400'
// //                       }`}>
// //                         {selectedFloat.status}
// //                       </span>
// //                     </div>
// //                     <DetailItem label="Last Update" value={selectedFloat.lastUpdate} />
// //                   </div>
// //                 </InfoCard>
// //               )}

// //               {/* Legend */}
// //               <InfoCard title="Legend">
// //                 <div className="space-y-3">
// //                   <LegendItem color="bg-blue-500" text="ARGO Float" />
// //                   <LegendItem color="bg-green-500" text="Active Status" />
// //                   <LegendItem color="bg-yellow-500" text="Maintenance" />
// //                 </div>
// //               </InfoCard>
// //             </div>

// //             {/* Map Container */}
// //             <div className="lg:col-span-3">
// //               <InfoCard title="Global Ocean Monitoring Network" className="h-full">
// //                 <div className="relative bg-gray-200 rounded-lg overflow-hidden" style={{ height: '600px' }}>
// //                   {(!mapLoaded || mapError) && (
// //                     <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
// //                       <div className="text-center">
// //                         {mapError ? (
// //                           <>
// //                             <div className="text-lg font-semibold mb-2 text-red-600">Map Failed to Load</div>
// //                             <button 
// //                               onClick={() => window.location.reload()}
// //                               className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
// //                             >
// //                               Retry
// //                             </button>
// //                           </>
// //                         ) : (
// //                           <div className="text-lg font-semibold">Loading Map...</div>
// //                         )}
// //                       </div>
// //                     </div>
// //                   )}
// //                   <MapContainer
// //                     ref={mapRef}
// //                     key={mapStyle}
// //                     center={[0, 0]}
// //                     zoom={2}
// //                     style={{ height: '100%', width: '100%' }}
// //                     zoomControl={false}
// //                     className="rounded-lg"
// //                     whenReady={handleMapReady}
// //                   >
// //                     <TileLayer
// //                       attribution={mapStyles[mapStyle].attribution}
// //                       url={mapStyles[mapStyle].url}
// //                     />
// //                     <ZoomControl position="bottomright" />
                    
// //                     {data.map((float) => (
// //                       <Marker
// //                         key={float.id}
// //                         position={[float.latitude, float.longitude]}
// //                         icon={createFloatIcon(getStatusColor(float.status))}
// //                         eventHandlers={{
// //                           click: () => setSelectedFloat(float),
// //                         }}
// //                       >
// //                         <Popup>
// //                           <div className="p-3 min-w-[250px]">
// //                             <h3 className="font-bold text-lg text-gray-800 mb-2">{float.platform}</h3>
// //                             <div className="space-y-2 text-sm">
// //                               <PopupItem label="Project" value={float.project} />
// //                               <PopupItem label="Region" value={float.region} />
// //                               <PopupItem label="Temperature" value={float.temperature} />
// //                               <PopupItem label="Salinity" value={float.salinity} />
// //                               <PopupItem label="Depth" value={float.depth} />
// //                               <div className="flex justify-between items-center">
// //                                 <span className="text-gray-600 font-medium">Status:</span>
// //                                 <span className={`px-2 py-1 rounded text-xs font-medium ${
// //                                   float.status === 'Active' 
// //                                     ? 'bg-green-100 text-green-800' 
// //                                     : 'bg-yellow-100 text-yellow-800'
// //                                 }`}>
// //                                   {float.status}
// //                                 </span>
// //                               </div>
// //                             </div>
// //                           </div>
// //                         </Popup>
// //                       </Marker>
// //                     ))}
// //                   </MapContainer>
// //                 </div>
// //               </InfoCard>
// //             </div>

// //             {/* Description Section */}
// //             <div className="lg:col-span-4">
// //               <InfoCard title="About ARGO Float Network">
// //                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// //                   <DescriptionItem 
// //                     title="What are ARGO Floats?"
// //                     content="ARGO floats are autonomous oceanographic instruments that drift with ocean currents, collecting valuable data about temperature, salinity, and other ocean properties."
// //                   />
// //                   <DescriptionItem 
// //                     title="Global Coverage"
// //                     content="The ARGO network consists of thousands of floats deployed across all major ocean basins, providing comprehensive, real-time view of ocean conditions worldwide."
// //                   />
// //                   <DescriptionItem 
// //                     title="Data Applications"
// //                     content="ARGO data is used for weather forecasting, climate research, ocean modeling, and understanding marine biodiversity and ocean circulation patterns."
// //                   />
// //                   <DescriptionItem 
// //                     title="Real-time Monitoring"
// //                     content="This dashboard provides real-time access to ARGO float positions and measurements. Click on any float marker to view detailed information."
// //                   />
// //                 </div>
// //               </InfoCard>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // // Helper Components
// // const DetailItem = ({ label, value }) => (
// //   <div className="flex justify-between items-center">
// //     <span className="text-blue-200 text-sm">{label}:</span>
// //     <span className="text-white text-sm">{value}</span>
// //   </div>
// // );

// // const LegendItem = ({ color, text }) => (
// //   <div className="flex items-center space-x-3">
// //     <div className={`w-4 h-4 ${color} rounded-full`}></div>
// //     <span className="text-blue-200 text-sm">{text}</span>
// //   </div>
// // );

// // const PopupItem = ({ label, value }) => (
// //   <div className="flex justify-between">
// //     <span className="text-gray-600 font-medium">{label}:</span>
// //     <span className="text-gray-800">{value}</span>
// //   </div>
// // );

// // const DescriptionItem = ({ title, content }) => (
// //   <div>
// //     <h4 className="text-blue-300 font-semibold mb-2">{title}</h4>
// //     <p className="text-blue-200 text-sm leading-relaxed">{content}</p>
// //   </div>
// // );

// // export default MapView;
// import React, { useState, useEffect, useRef } from 'react';
// import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet';
// import L from 'leaflet';
// import 'leaflet/dist/leaflet.css';
// import floatData from "../floatdetails.json";  // Import your JSON file

// // Fix for default markers in react-leaflet
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
//   iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
//   shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
// });

// // Custom ARGO float icon (blue/green)
// const createFloatIcon = (color = '#3B82F6') => {
//   return new L.Icon({
//     iconUrl: `data:image/svg+xml;utf8,
//       <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' fill='${color}'>
//         <path d='M16 0c-5.523 0-10 4.477-10 10 0 10 10 22 10 22s10-12 10-22c0-5.523-4.477-10-10-10zm0 16c-3.314 0-6-2.686-6-6s2.686-6 6-6 6 2.686 6 6-2.686 6-6 6z'/>
//       </svg>`,
//     iconSize: [24, 24],
//     iconAnchor: [12, 24],
//     popupAnchor: [0, -24],
//   });
// };

// // Custom red icon for imported floats
// const redFloatIcon = new L.Icon({
//   iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
//   shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
//   popupAnchor: [1, -34],
//   shadowSize: [41, 41],
// });

// const MapView = () => {
//   const [data, setData] = useState([]);
//   const [mapStyle, setMapStyle] = useState('satellite');
//   const [selectedFloat, setSelectedFloat] = useState(null);
//   const mapRef = useRef(null);

//   // Load data from JSON
//   useEffect(() => {
//     if (floatData && floatData.length > 0) {
//       // Map floats: if year < 2025 => Inactive, else Active
//       const processedData = floatData.map((f, index) => {
//         const year = new Date(f.JULD_datetime).getFullYear();
//         return {
//           id: index,
//           name: f.FLOAT_SERIAL_NO,
//           latitude: f.LATITUDE,
//           longitude: f.LONGITUDE,
//           project: f.PROJECT_NAME,
//           pi: f.PI_NAME,
//           region: "Unknown",
//           temperature: f.PARAMETER[0].includes("TEMP") ? "N/A" : "N/A",
//           salinity: f.PARAMETER[0].includes("PSAL") ? "N/A" : "N/A",
//           depth: f.PARAMETER[0].includes("PRES") ? "N/A" : "N/A",
//           status: year < 2025 ? "Inactive" : "Active",
//           lastUpdate: f.JULD_date
//         };
//       });
//       setData(processedData);
//     }
//   }, []);

//   const mapStyles = {
//     satellite: {
//       url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
//       attribution: '&copy; Esri, Maxar, Earthstar Geographics'
//     },
//     standard: {
//       url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
//       attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//     }
//   };

//   const getStatusColor = (status) => (status === 'Active' ? '#10B981' : '#F59E0B');

//   const StatCard = ({ title, value, color = "text-white" }) => (
//     <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
//       <div className="text-blue-200 text-sm mb-1">{title}</div>
//       <div className={`text-xl font-semibold ${color}`}>{value}</div>
//     </div>
//   );

//   const InfoCard = ({ title, children, className = "" }) => (
//     <div className={`bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 ${className}`}>
//       <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
//       {children}
//     </div>
//   );

//   return (
//     <div className="w-full h-full flex flex-col">
//       <div className="flex-shrink-0 p-6 text-center">
//         <h1 className="text-3xl font-bold text-white mb-2">
//           Oceanographic Data Map
//         </h1>
//         <p className="text-blue-200">
//           Real-time monitoring of ARGO float deployments across global oceans
//         </p>
//         <div className="flex justify-center gap-3 mt-4">
//           {Object.keys(mapStyles).map((style) => (
//             <button
//               key={style}
//               onClick={() => setMapStyle(style)}
//               className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
//                 mapStyle === style
//                   ? 'bg-blue-500 text-white shadow-lg'
//                   : 'bg-gray-600/30 text-gray-200 hover:bg-gray-500/40'
//               }`}
//             >
//               {style.charAt(0).toUpperCase() + style.slice(1)}
//             </button>
//           ))}
//         </div>
//       </div>

//       <div className="flex-1 min-h-0 px-6 pb-6">
//         <div className="max-w-7xl mx-auto h-full">
//           <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
//             {/* Left Sidebar */}
//             <div className="lg:col-span-1 space-y-6">
//               <InfoCard title="System Overview">
//                 <div className="grid grid-cols-2 gap-4">
//                   <StatCard title="Total Floats" value={data.length} />
//                   <StatCard title="Active" value={data.filter(f => f.status === 'Active').length} color="text-green-400" />
//                   <StatCard title="Inactive" value={data.filter(f => f.status === 'Inactive').length} color="text-yellow-400" />
//                 </div>
//               </InfoCard>

//               {selectedFloat && (
//                 <InfoCard title="Float Details">
//                   <div className="space-y-3">
//                     <DetailItem label="Platform" value={selectedFloat.name} />
//                     <DetailItem label="Project" value={selectedFloat.project} />
//                     <DetailItem label="Principal Investigator" value={selectedFloat.pi} />
//                     <DetailItem label="Coordinates" value={`${selectedFloat.latitude.toFixed(4)}°, ${selectedFloat.longitude.toFixed(4)}°`} />
//                     <DetailItem label="Status" value={selectedFloat.status} />
//                     <DetailItem label="Last Update" value={selectedFloat.lastUpdate} />
//                   </div>
//                 </InfoCard>
//               )}
//             </div>

//             {/* Map Container */}
//             <div className="lg:col-span-3">
//               <InfoCard title="Global Ocean Monitoring Network" className="h-full">
//                 <div className="relative bg-gray-200 rounded-lg overflow-hidden" style={{ height: '600px' }}>
//                   <MapContainer
//                     ref={mapRef}
//                     key={mapStyle}
//                     center={[0, 0]}
//                     zoom={2}
//                     style={{ height: '100%', width: '100%' }}
//                     zoomControl={false}
//                     className="rounded-lg"
//                   >
//                     <TileLayer
//                       attribution={mapStyles[mapStyle].attribution}
//                       url={mapStyles[mapStyle].url}
//                     />
//                     <ZoomControl position="bottomright" />

//                     {/* Map Markers */}
//                     {data.map((float) => (
//                       <Marker
//                         key={float.id}
//                         position={[float.latitude, float.longitude]}
//                         icon={float.status === 'Active' ? createFloatIcon(getStatusColor(float.status)) : redFloatIcon}
//                         eventHandlers={{ click: () => setSelectedFloat(float) }}
//                       >
//                         <Popup>
//                           <div className="p-3 min-w-[250px]">
//                             <h3 className={`font-bold text-lg mb-2 ${float.status === 'Active' ? 'text-gray-800' : 'text-red-600'}`}>
//                               {float.name}
//                             </h3>
//                             <div className="space-y-2 text-sm">
//                               <PopupItem label="Project" value={float.project} />
//                               <PopupItem label="PI" value={float.pi} />
//                               <PopupItem label="Status" value={float.status} />
//                             </div>
//                           </div>
//                         </Popup>
//                       </Marker>
//                     ))}
//                   </MapContainer>
//                 </div>
//               </InfoCard>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Helper Components
// const DetailItem = ({ label, value }) => (
//   <div className="flex justify-between items-center">
//     <span className="text-blue-200 text-sm">{label}:</span>
//     <span className="text-white text-sm">{value}</span>
//   </div>
// );

// const PopupItem = ({ label, value }) => (
//   <div className="flex justify-between">
//     <span className="text-gray-600 font-medium">{label}:</span>
//     <span className="text-gray-800">{value}</span>
//   </div>
// );

// export default MapView;z
import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import floatData from "../floatdetails.json";  // Import your JSON

// Fix default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Active Float Icon (SVG)
const createFloatIcon = (color = '#3B82F6') => {
  const svg = encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="${color}">
      <path d="M16 0c-5.523 0-10 4.477-10 10 0 10 10 22 10 22s10-12 10-22c0-5.523-4.477-10-10-10zm0 16c-3.314 0-6-2.686-6-6s2.686-6 6-6 6 2.686 6 6-2.686 6-6 6z"/>
    </svg>
  `);
  return new L.Icon({
    iconUrl: `data:image/svg+xml;utf8,${svg}`,
    iconSize: [24, 24],
    iconAnchor: [12, 24],
    popupAnchor: [0, -24],
  });
};
const redFloatIcon  = (color = '#3B82F6') => {
  const svg = encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="${color}">
      <path d="M16 0c-5.523 0-10 4.477-10 10 0 10 10 22 10 22s10-12 10-22c0-5.523-4.477-10-10-10zm0 16c-3.314 0-6-2.686-6-6s2.686-6 6-6 6 2.686 6 6-2.686 6-6 6z"/>
    </svg>
  `);
  return new L.Icon({
    iconUrl: `data:image/svg+xml;utf8,${svg}`,
    iconSize: [24, 24],
    iconAnchor: [12, 24],
    popupAnchor: [0, -24],
  });
};


const MapView = () => {
  const [data, setData] = useState([]);
  const [mapStyle, setMapStyle] = useState('standard');
  const [selectedFloat, setSelectedFloat] = useState(null);
  const mapRef = useRef(null);

  // Load float data from JSON
  useEffect(() => {
    if (floatData && floatData.length > 0) {
      const processedData = floatData.map((f, index) => {
        const year = new Date(f.JULD_datetime).getFullYear();
        return {
          id: index,
          name: f.FLOAT_SERIAL_NO,
          latitude: f.LATITUDE,
          longitude: f.LONGITUDE,
          project: f.PROJECT_NAME,
          pi: f.PI_NAME,
          region: "Unknown",
          temperature: "N/A",
          salinity: "N/A",
          depth: "N/A",
          status: year < 2025 ? "Inactive" : "Active",
          lastUpdate: f.JULD_date
        };
      });
      setData(processedData);
    }
  }, []);

  const mapStyles = {
    satellite: {
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      attribution: '&copy; Esri, Maxar, Earthstar Geographics'
    },
    standard: {
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }
  };

  const getStatusColor = (status) => (status === 'Active' ? '#10B981' : '#F59E0B');

  // UI Components
  const StatCard = ({ title, value, color = "text-white" }) => (
    <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
      <div className="text-blue-200 text-sm mb-1">{title}</div>
      <div className={`text-xl font-semibold ${color}`}>{value}</div>
    </div>
  );

  const InfoCard = ({ title, children, className = "" }) => (
    <div className={`bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 ${className}`}>
      <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
      {children}
    </div>
  );

  return (
    <div className="w-full h-full flex flex-col">
      {/* Header Section */}
      <div className="flex-shrink-0 p-6 text-center">
        <h1 className="text-3xl font-bold text-white mb-2">Oceanographic Data Map</h1>
        <p className="text-blue-200">Real-time monitoring of ARGO float deployments across global oceans</p>

        {/* Map Style Controls */}
        <div className="flex justify-center gap-3 mt-4">
          {Object.keys(mapStyles).map((style) => (
            <button
              key={style}
              onClick={() => setMapStyle(style)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                mapStyle === style ? 'bg-blue-500 text-white shadow-lg' : 'bg-gray-600/30 text-gray-200 hover:bg-gray-500/40'
              }`}
            >
              {style.charAt(0).toUpperCase() + style.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 min-h-0 px-6 pb-6">
        <div className="max-w-7xl mx-auto h-full">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">

            {/* Left Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              <InfoCard title="System Overview">
                <div className="grid grid-cols-2 gap-4">
                  <StatCard title="Total Floats" value={data.length} />
                  <StatCard title="Active" value={data.filter(f => f.status === 'Active').length} color="text-green-400" />
                  <StatCard title="Inactive" value={data.filter(f => f.status === 'Inactive').length} color="text-yellow-400" />
                </div>
              </InfoCard>

              {selectedFloat && (
                <InfoCard title="Float Details">
                  <div className="space-y-3">
                    <DetailItem label="Platform" value={selectedFloat.name} />
                    <DetailItem label="Project" value={selectedFloat.project} />
                    <DetailItem label="Principal Investigator" value={selectedFloat.pi} />
                    <DetailItem label="Coordinates" value={`${selectedFloat.latitude.toFixed(4)}°, ${selectedFloat.longitude.toFixed(4)}°`} />
                    <DetailItem label="Status" value={selectedFloat.status} />
                    <DetailItem label="Last Update" value={selectedFloat.lastUpdate} />
                  </div>
                </InfoCard>
              )}

              <InfoCard title="Legend">
                <div className="space-y-3">
                  <LegendItem color="bg-blue-500" text="Active Float" />
                  <LegendItem color="bg-red-500" text="Inactive Float" />
                </div>
              </InfoCard>
            </div>

            {/* Map */}
            <div className="lg:col-span-3">
              <InfoCard title="Global Ocean Monitoring Network" className="h-full">
                <div className="relative bg-gray-200 rounded-lg overflow-hidden" style={{ height: '600px' }}>
                  <MapContainer
                    ref={mapRef}
                    key={mapStyle}
                    center={[20.5937, 78.9629]} // Center near India
                    zoom={4}
                    minZoom={3}
                    zoomControl={false}
                    style={{ height: '100%', width: '100%' }}
                    className="rounded-lg"
                  >
                    <TileLayer
                      attribution={mapStyles[mapStyle].attribution}
                      url={mapStyles[mapStyle].url}
                    />
                    <ZoomControl position="bottomright" />

                    {data.filter(f => f.latitude && f.longitude).map(float => (
                      <Marker
                        key={float.id}
                        position={[float.latitude, float.longitude]}
                        icon={float.status === 'Active' 
                          ? createFloatIcon(getStatusColor(float.status)) 
                          : redFloatIcon('#F87171') // pass red color or any you like
                        } 
                        

                        eventHandlers={{ click: () => setSelectedFloat(float) }}
                      >
                        <Popup>
                          <div className="p-3 min-w-[250px]">
                            <h3 className={`font-bold text-lg mb-2 ${float.status === 'Active' ? 'text-gray-800' : 'text-red-600'}`}>
                              {float.name}
                            </h3>
                            <div className="space-y-2 text-sm">
                              <PopupItem label="Project" value={float.project} />
                              <PopupItem label="PI" value={float.pi} />
                              <PopupItem label="Status" value={float.status} />
                            </div>
                          </div>
                        </Popup>
                      </Marker>
                    ))}

                  </MapContainer>
                </div>
              </InfoCard>
            </div>

            {/* Description Section */}
            <div className="lg:col-span-4">
              <InfoCard title="About ARGO Float Network">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <DescriptionItem title="What are ARGO Floats?" content="ARGO floats are autonomous oceanographic instruments that drift with ocean currents, collecting valuable data about temperature, salinity, and other ocean properties." />
                  <DescriptionItem title="Global Coverage" content="The ARGO network consists of thousands of floats deployed across all major ocean basins, providing comprehensive, real-time view of ocean conditions worldwide." />
                  <DescriptionItem title="Data Applications" content="ARGO data is used for weather forecasting, climate research, ocean modeling, and understanding marine biodiversity and ocean circulation patterns." />
                  <DescriptionItem title="Real-time Monitoring" content="This dashboard provides real-time access to ARGO float positions and measurements. Click on any float marker to view detailed information." />
                </div>
              </InfoCard>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

// Helper Components
const DetailItem = ({ label, value }) => (
  <div className="flex justify-between items-center">
    <span className="text-blue-200 text-sm">{label}:</span>
    <span className="text-white text-sm">{value}</span>
  </div>
);

const PopupItem = ({ label, value }) => (
  <div className="flex justify-between">
    <span className="text-gray-600 font-medium">{label}:</span>
    <span className="text-gray-800">{value}</span>
  </div>
);

const LegendItem = ({ color, text }) => (
  <div className="flex items-center space-x-3">
    <div className={`w-4 h-4 ${color} rounded-full`}></div>
    <span className="text-blue-200 text-sm">{text}</span>
  </div>
);

const DescriptionItem = ({ title, content }) => (
  <div>
    <h4 className="text-blue-300 font-semibold mb-2">{title}</h4>
    <p className="text-blue-200 text-sm leading-relaxed">{content}</p>
  </div>
);

export default MapView;
