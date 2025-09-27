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
    let currentStep = step;

    intervalRef.current = setInterval(() => {
      currentStep = (currentStep + 1) % 101;
      setStep(currentStep);
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

  const filteredFloats = floatsData.filter((float) =>
    float.float_id.toString().toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        backgroundColor: "#0f1419",
        color: "#ffffff",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      {/* Sidebar */}
      <div
        style={{
          width: "320px",
          overflowY: "auto",
          borderRight: "1px solid #2d3748",
          padding: "20px",
          backgroundColor: "#1a202c",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <div>
          <h2
            style={{
              margin: "0 0 20px 0",
              fontSize: "24px",
              fontWeight: "600",
              color: "#63b3ed",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            Float Trajectories
          </h2>

          {/* Search Box */}
          <div style={{ position: "relative", marginBottom: "20px" }}>
            <input
              type="text"
              placeholder="Search floats..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 40px 12px 16px",
                borderRadius: "8px",
                border: "1px solid #4a5568",
                backgroundColor: "#2d3748",
                color: "#ffffff",
                fontSize: "14px",
                outline: "none",
                transition: "all 0.3s ease",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#63b3ed")}
              onBlur={(e) => (e.target.style.borderColor = "#4a5568")}
            />
            <span
              style={{
                position: "absolute",
                right: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#a0aec0",
              }}
            >
              🔍
            </span>
          </div>

          {/* Controls */}
          {selectedFloat && (
            <div
              style={{
                backgroundColor: "#2d3748",
                padding: "15px",
                borderRadius: "8px",
                marginBottom: "15px",
                border: "1px solid #4a5568",
              }}
            >
              <h4 style={{ margin: "0 0 10px 0", color: "#cbd5e0" }}>Controls</h4>
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  onClick={toggleAnimation}
                  style={{
                    flex: 1,
                    padding: "8px 12px",
                    borderRadius: "6px",
                    border: "none",
                    backgroundColor: isPlaying ? "#e53e3e" : "#38a169",
                    color: "white",
                    cursor: "pointer",
                    fontSize: "12px",
                    fontWeight: "500",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => (e.target.style.opacity = "0.8")}
                  onMouseLeave={(e) => (e.target.style.opacity = "1")}
                >
                  {isPlaying ? "⏸ Pause" : "▶ Play"}
                </button>
                <button
                  onClick={resetAnimation}
                  style={{
                    flex: 1,
                    padding: "8px 12px",
                    borderRadius: "6px",
                    border: "none",
                    backgroundColor: "#d69e2e",
                    color: "white",
                    cursor: "pointer",
                    fontSize: "12px",
                    fontWeight: "500",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => (e.target.style.opacity = "0.8")}
                  onMouseLeave={(e) => (e.target.style.opacity = "1")}
                >
                  🔄 Reset
                </button>
              </div>
              <div
                style={{
                  marginTop: "10px",
                  fontSize: "12px",
                  color: "#a0aec0",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span>Progress:</span>
                <span>{step}%</span>
              </div>
              <div
                style={{
                  width: "100%",
                  height: "4px",
                  backgroundColor: "#4a5568",
                  borderRadius: "2px",
                  marginTop: "5px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${step}%`,
                    height: "100%",
                    backgroundColor: "#63b3ed",
                    transition: "width 0.1s ease",
                    borderRadius: "2px",
                  }}
                ></div>
              </div>
            </div>
          )}
        </div>

        {/* Float List */}
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "15px",
            }}
          >
            <h3 style={{ margin: 0, fontSize: "16px", color: "#cbd5e0" }}>
              Floats ({filteredFloats.length})
            </h3>
            <span
              style={{
                fontSize: "12px",
                color: "#a0aec0",
                backgroundColor: "#2d3748",
                padding: "2px 8px",
                borderRadius: "12px",
              }}
            >
              {filteredFloats.length} items
            </span>
          </div>

          <div style={{ maxHeight: "calc(100vh - 300px)", overflowY: "auto" }}>
            {filteredFloats.map((float) => (
              <div
                key={float.float_id}
                onClick={() => handleSelectFloat(float)}
                style={{
                  padding: "12px 16px",
                  marginBottom: "8px",
                  cursor: "pointer",
                  borderRadius: "8px",
                  background:
                    selectedFloat?.float_id === float.float_id
                      ? "linear-gradient(135deg, #63b3ed, #4299e1)"
                      : "#2d3748",
                  color:
                    selectedFloat?.float_id === float.float_id ? "#1a202c" : "#e2e8f0",
                  border:
                    selectedFloat?.float_id === float.float_id
                      ? "1px solid #63b3ed"
                      : "1px solid #4a5568",
                  transition: "all 0.3s ease",
                  transform:
                    selectedFloat?.float_id === float.float_id ? "scale(1.02)" : "scale(1)",
                  boxShadow:
                    selectedFloat?.float_id === float.float_id
                      ? "0 4px 12px rgba(99, 179, 237, 0.3)"
                      : "none",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
                onMouseEnter={(e) => {
                  if (selectedFloat?.float_id !== float.float_id) {
                    e.target.style.backgroundColor = "#4a5568";
                    e.target.style.transform = "scale(1.02)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedFloat?.float_id !== float.float_id) {
                    e.target.style.backgroundColor = "#2d3748";
                    e.target.style.transform = "scale(1)";
                  }
                }}
              >
                <div
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    backgroundColor:
                      selectedFloat?.float_id === float.float_id ? "#1a202c" : "#63b3ed",
                    flexShrink: 0,
                  }}
                ></div>
                <span
                  style={{
                    fontWeight:
                      selectedFloat?.float_id === float.float_id ? "600" : "400",
                    fontSize: "14px",
                  }}
                >
                  Float {float.float_id}
                </span>
                {selectedFloat?.float_id === float.float_id && (
                  <span
                    style={{
                      marginLeft: "auto",
                      fontSize: "12px",
                      opacity: 0.8,
                    }}
                  >
                    ● Playing
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Map */}
      <div style={{ flex: 1, position: "relative" }}>
        <MapContainer
          center={[0, 80]}
          zoom={3}
          style={{ height: "100%", width: "100%" }}
          scrollWheelZoom={true}
        >
          {/* Dark theme tile layer */}
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {selectedFloat && <MovingFloat float={selectedFloat} step={step} isPlaying={isPlaying} />}
        </MapContainer>

        {/* Map overlay info */}
        {selectedFloat && (
          <div
            style={{
              position: "absolute",
              top: "20px",
              right: "20px",
              backgroundColor: "rgba(26, 32, 44, 0.9)",
              padding: "15px",
              borderRadius: "8px",
              border: "1px solid #4a5568",
              backdropFilter: "blur(10px)",
              zIndex: 1000,
              minWidth: "200px",
            }}
          >
            <h4 style={{ margin: "0 0 10px 0", color: "#63b3ed" }}>Selected Float</h4>
            <div style={{ fontSize: "14px", color: "#cbd5e0" }}>
              <div>
                <strong>ID:</strong> {selectedFloat.float_id}
              </div>
              <div>
                <strong>Start:</strong>{" "}
                {selectedFloat.min_latitude.toFixed(2)}°,{" "}
                {selectedFloat.min_longitude.toFixed(2)}°
              </div>
              <div>
                <strong>End:</strong>{" "}
                {selectedFloat.max_latitude.toFixed(2)}°,{" "}
                {selectedFloat.max_longitude.toFixed(2)}°
              </div>
              <div>
                <strong>Status:</strong>{" "}
                <span style={{ color: isPlaying ? "#38a169" : "#e53e3e" }}>
                  {isPlaying ? "Playing" : "Paused"}
                </span>
              </div>
            </div>
          </div>
        )}
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
      <Polyline positions={completePath} color="#4a5568" weight={2} opacity={0.3} />

      {/* Traveled path */}
      <Polyline positions={traveledPath} color="#63b3ed" weight={4} opacity={0.8} />

      {/* Moving marker */}
      <CircleMarker
        center={[lat, lng]}
        radius={12}
        color={isPlaying ? "#f56565" : "#d69e2e"}
        fillColor={isPlaying ? "#f56565" : "#d69e2e"}
        fillOpacity={0.9}
        weight={2}
      >
        <Tooltip direction="top" offset={[0, -10]} opacity={0.9} permanent>
          <div
            style={{
              backgroundColor: "#1a202c",
              color: "#ffffff",
              padding: "8px",
              borderRadius: "4px",
              fontSize: "12px",
              border: "1px solid #4a5568",
            }}
          >
            <strong>Float {float_id}</strong>
            <br />
            Position: {lat.toFixed(2)}°, {lng.toFixed(2)}°
            <br />
            Progress: {step}%
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
