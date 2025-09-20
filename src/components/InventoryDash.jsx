import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { Line, Scatter } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

const InterDash = () => {
  // State for data and UI controls
  const [argoData, setArgoData] = useState([]);
  const [selectedFloats, setSelectedFloats] = useState([]);
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000), // 1 year ago
    end: new Date()
  });
  const [activeTab, setActiveTab] = useState('map');
  const [isLoading, setIsLoading] = useState(true);
  const [comparisonProfiles, setComparisonProfiles] = useState({ profile1: null, profile2: null });
  const [selectedParameter, setSelectedParameter] = useState('temperature');

  // Generate sample data (in a real app, this would come from an API)
  useEffect(() => {
    const generateSampleData = () => {
      const floats = [];
      const nFloats = 8;
      
      for (let i = 0; i < nFloats; i++) {
        const floatId = `ARGO_${7900000 + i}`;
        const baseLat = 20 + Math.random() * 40; // Between 20-60°N
        const baseLon = -160 + Math.random() * 60; // Between 160-100°W
        
        const profiles = [];
        const nProfiles = 15 + Math.floor(Math.random() * 10);
        
        for (let j = 0; j < nProfiles; j++) {
          const daysAgo = nProfiles - j;
          const date = new Date(Date.now() - daysAgo * 2 * 24 * 60 * 60 * 1000);
          
          // Simulate drift
          const lat = baseLat + (Math.random() - 0.5) * 2;
          const lon = baseLon + (Math.random() - 0.5) * 3;
          
          // Generate profile data
          const profile = {
            date,
            lat,
            lon,
            depth: [],
            temperature: [],
            salinity: []
          };
          
          // Generate data points at different depths
          for (let depth = 0; depth <= 2000; depth += 100) {
            const temp = 25 * Math.exp(-depth/500) + (Math.random() - 0.5) * 0.5;
            const sal = 35 + 0.01 * depth/100 + (Math.random() - 0.5) * 0.1;
            
            profile.depth.push(depth);
            profile.temperature.push(temp);
            profile.salinity.push(sal);
          }
          
          profiles.push(profile);
        }
        
        floats.push({
          id: floatId,
          name: `Float ${7900000 + i}`,
          profiles
        });
      }
      
      setArgoData(floats);
      setSelectedFloats([floats[0].id, floats[1].id]);
      setIsLoading(false);
    };
    
    generateSampleData();
  }, []);

  // Filter data based on selected floats and date range
  const filteredData = argoData.filter(float => 
    selectedFloats.includes(float.id)
  ).map(float => ({
    ...float,
    profiles: float.profiles.filter(profile => 
      profile.date >= dateRange.start && profile.date <= dateRange.end
    )
  }));

  // Prepare data for the map
  const mapData = filteredData.map(float => ({
    ...float,
    latestPosition: float.profiles.length > 0 ? float.profiles[float.profiles.length - 1] : null,
    path: float.profiles.map(profile => [profile.lat, profile.lon])
  }));

  // Prepare data for depth-time plots
  const prepareDepthTimeData = (floatId, parameter) => {
    const float = argoData.find(f => f.id === floatId);
    if (!float) return null;
    
    const data = [];
    
    float.profiles.forEach(profile => {
      profile[parameter].forEach((value, index) => {
        data.push({
          x: profile.date.getTime(),
          y: profile.depth[index],
          z: value
        });
      });
    });
    
    return data;
  };

  // Prepare data for profile comparisons
  const prepareProfileData = (profile, parameter) => {
    if (!profile) return null;
    
    return {
      labels: profile.depth,
      datasets: [
        {
          label: `${parameter} Profile`,
          data: profile[parameter],
          borderColor: '#424874',
          backgroundColor: '#A6B1E1',
          tension: 0.1
        }
      ]
    };
  };

  // Chart options
  const depthTimeOptions = {
    responsive: true,
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'month'
        },
        title: {
          display: true,
          text: 'Date'
        },
        reverse: true,
        grid: {
          color: '#DCD6F7'
        },
        ticks: {
          color: '#F4EEFF'
        }
      },
      y: {
        reverse: true,
        title: {
          display: true,
          text: 'Depth (m)'
        },
        grid: {
          color: '#DCD6F7'
        },
        ticks: {
          color: '#F4EEFF'
        }
      }
    },
    plugins: {
      title: {
        display: true,
        text: 'Depth-Time Plot',
        color: '#F4EEFF'
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            return `Depth: ${context.parsed.y}m, Value: ${context.raw.z}`;
          }
        }
      },
      legend: {
        labels: {
          color: '#F4EEFF'
        }
      }
    }
  };

  const profileOptions = {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Value',
          color: '#F4EEFF'
        },
        grid: {
          color: '#DCD6F7'
        },
        ticks: {
          color: '#F4EEFF'
        }
      },
      y: {
        reverse: true,
        title: {
          display: true,
          text: 'Depth (m)',
          color: '#F4EEFF'
        },
        grid: {
          color: '#DCD6F7'
        },
        ticks: {
          color: '#F4EEFF'
        }
      }
    },
    plugins: {
      legend: {
        labels: {
          color: '#F4EEFF'
        }
      }
    }
  };

  // Handle float selection
  const handleFloatSelection = (floatId) => {
    if (selectedFloats.includes(floatId)) {
      setSelectedFloats(selectedFloats.filter(id => id !== floatId));
    } else {
      setSelectedFloats([...selectedFloats, floatId]);
    }
  };

  // Handle profile selection for comparison
  const handleProfileSelection = (profile, slot) => {
    setComparisonProfiles({
      ...comparisonProfiles,
      [slot]: profile
    });
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64 text-[#A6B1E1]">Loading ARGO data...</div>;
  }

  return (
    <div className="min-h-screen bg-[#424874] text-[#F4EEFF] p-6">
      <header className="text-center py-6 mb-8 border-b border-[#A6B1E1]">
        <h1 className="text-3xl md:text-4xl font-bold text-[#F4EEFF] mb-2">ARGO Profiling Dashboard</h1>
        <p className="text-[#DCD6F7]">Interactive visualization of ARGO float trajectories and oceanographic data</p>
      </header>
      
      <div className="bg-[#A6B1E1] p-4 rounded-lg mb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="float-selection">
          <h3 className="text-lg font-semibold text-[#424874] mb-2">Select Floats:</h3>
          <div className="flex flex-wrap gap-3">
            {argoData.map(float => (
              <label key={float.id} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedFloats.includes(float.id)}
                  onChange={() => handleFloatSelection(float.id)}
                  className="w-4 h-4 text-[#424874] bg-[#DCD6F7] border-[#424874] rounded focus:ring-[#424874]"
                />
                <span className="text-sm text-[#424874]">{float.name}</span>
              </label>
            ))}
          </div>
        </div>
        
        <div className="date-selection">
          <h3 className="text-lg font-semibold text-[#424874] mb-2">Date Range:</h3>
          <div className="flex flex-col sm:flex-row gap-4">
            <label className="flex flex-col">
              <span className="text-sm mb-1 text-[#424874]">Start:</span>
              <input
                type="date"
                value={dateRange.start.toISOString().split('T')[0]}
                onChange={e => setDateRange({...dateRange, start: new Date(e.target.value)})}
                className="px-3 py-2 bg-[#DCD6F7] border border-[#424874] rounded-md text-[#424874]"
              />
            </label>
            <label className="flex flex-col">
              <span className="text-sm mb-1 text-[#424874]">End:</span>
              <input
                type="date"
                value={dateRange.end.toISOString().split('T')[0]}
                onChange={e => setDateRange({...dateRange, end: new Date(e.target.value)})}
                className="px-3 py-2 bg-[#DCD6F7] border border-[#424874] rounded-md text-[#424874]"
              />
            </label>
          </div>
        </div>
      </div>
      
      <div className="flex border-b border-[#A6B1E1] mb-6">
        <button 
          className={`px-4 py-2 font-medium ${activeTab === 'map' ? 'text-[#F4EEFF] border-b-2 border-[#F4EEFF]' : 'text-[#DCD6F7] hover:text-[#F4EEFF]'}`}
          onClick={() => setActiveTab('map')}
        >
          Map View
        </button>
        <button 
          className={`px-4 py-2 font-medium ${activeTab === 'depthTime' ? 'text-[#F4EEFF] border-b-2 border-[#F4EEFF]' : 'text-[#DCD6F7] hover:text-[#F4EEFF]'}`}
          onClick={() => setActiveTab('depthTime')}
        >
          Depth-Time Plots
        </button>
        <button 
          className={`px-4 py-2 font-medium ${activeTab === 'comparison' ? 'text-[#F4EEFF] border-b-2 border-[#F4EEFF]' : 'text-[#DCD6F7] hover:text-[#F4EEFF]'}`}
          onClick={() => setActiveTab('comparison')}
        >
          Profile Comparison
        </button>
      </div>
      
      <div className="bg-[#A6B1E1] p-6 rounded-lg min-h-[500px]">
        {activeTab === 'map' && (
          <div className="map-container">
            <h2 className="text-xl font-semibold text-[#424874] mb-4">ARGO Float Trajectories</h2>
            <MapContainer
              center={[40, -160]}
              zoom={3}
              className="h-96 w-full rounded-lg"
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {mapData.map(float => (
                float.latestPosition && (
                  <React.Fragment key={float.id}>
                    <Marker position={[float.latestPosition.lat, float.latestPosition.lon]}>
                      <Popup>
                        <div className="text-[#424874]">
                          <h3 className="font-bold">{float.name}</h3>
                          <p>Last position: {float.latestPosition.date.toLocaleDateString()}</p>
                          <p>Lat: {float.latestPosition.lat.toFixed(2)}°N</p>
                          <p>Lon: {float.latestPosition.lon.toFixed(2)}°E</p>
                        </div>
                      </Popup>
                    </Marker>
                    <Polyline
                      positions={float.path.map(([lat, lon]) => [lat, lon])}
                      color={float.id === selectedFloats[0] ? '#424874' : '#F4EEFF'}
                    />
                  </React.Fragment>
                )
              ))}
            </MapContainer>
          </div>
        )}
        
        {activeTab === 'depthTime' && (
          <div className="depth-time-plots">
            <h2 className="text-xl font-semibold text-[#424874] mb-4">Depth-Time Plots</h2>
            <div className="parameter-selector flex space-x-4 mb-6">
              <button 
                className={`px-4 py-2 rounded ${selectedParameter === 'temperature' ? 'bg-[#424874] text-[#F4EEFF]' : 'bg-[#DCD6F7] text-[#424874]'}`}
                onClick={() => setSelectedParameter('temperature')}
              >
                Temperature
              </button>
              <button 
                className={`px-4 py-2 rounded ${selectedParameter === 'salinity' ? 'bg-[#424874] text-[#F4EEFF]' : 'bg-[#DCD6F7] text-[#424874]'}`}
                onClick={() => setSelectedParameter('salinity')}
              >
                Salinity
              </button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {selectedFloats.map(floatId => {
                const data = prepareDepthTimeData(floatId, selectedParameter);
                const float = argoData.find(f => f.id === floatId);
                
                return (
                  <div key={floatId} className="bg-[#424874] p-4 rounded-lg">
                    <h3 className="text-lg font-medium text-[#F4EEFF] mb-4">{float.name} - {selectedParameter.charAt(0).toUpperCase() + selectedParameter.slice(1)}</h3>
                    <div className="h-80">
                      <Scatter
                        data={{
                          datasets: [{
                            label: `${selectedParameter} (°${selectedParameter === 'temperature' ? 'C' : 'PSU'})`,
                            data: data,
                            backgroundColor: 'rgba(166, 177, 225, 0.6)',
                            borderColor: 'rgba(244, 238, 255, 1)',
                            pointRadius: 3,
                          }]
                        }}
                        options={depthTimeOptions}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        {activeTab === 'comparison' && (
          <div className="profile-comparison">
            <h2 className="text-xl font-semibold text-[#424874] mb-4">Profile Comparison</h2>
            <div className="comparison-controls grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="profile-selector bg-[#424874] p-4 rounded-lg">
                <h3 className="text-lg font-medium text-[#F4EEFF] mb-2">Select Profile 1:</h3>
                <select
                  onChange={e => handleProfileSelection(JSON.parse(e.target.value), 'profile1')}
                  className="w-full px-3 py-2 bg-[#DCD6F7] border border-[#424874] rounded-md text-[#424874]"
                >
                  <option value="">Select a profile</option>
                  {filteredData.flatMap(float => 
                    float.profiles.map(profile => (
                      <option key={`${float.id}-${profile.date}`} value={JSON.stringify(profile)}>
                        {float.name} - {profile.date.toLocaleDateString()}
                      </option>
                    ))
                  )}
                </select>
              </div>
              
              <div className="profile-selector bg-[#424874] p-4 rounded-lg">
                <h3 className="text-lg font-medium text-[#F4EEFF] mb-2">Select Profile 2:</h3>
                <select
                  onChange={e => handleProfileSelection(JSON.parse(e.target.value), 'profile2')}
                  className="w-full px-3 py-2 bg-[#DCD6F7] border border-[#424874] rounded-md text-[#424874]"
                >
                  <option value="">Select a profile</option>
                  {filteredData.flatMap(float => 
                    float.profiles.map(profile => (
                      <option key={`${float.id}-${profile.date}`} value={JSON.stringify(profile)}>
                        {float.name} - {profile.date.toLocaleDateString()}
                      </option>
                    ))
                  )}
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-[#424874] p-4 rounded-lg">
                <h3 className="text-lg font-medium text-[#F4EEFF] mb-4">Temperature Profile Comparison</h3>
                <div className="h-80">
                  {comparisonProfiles.profile1 && comparisonProfiles.profile2 ? (
                    <Line
                      data={{
                        labels: comparisonProfiles.profile1.depth,
                        datasets: [
                          {
                            label: `Profile 1 - ${new Date(comparisonProfiles.profile1.date).toLocaleDateString()}`,
                            data: comparisonProfiles.profile1.temperature,
                            borderColor: '#A6B1E1',
                            backgroundColor: 'rgba(166, 177, 225, 0.2)',
                            tension: 0.1
                          },
                          {
                            label: `Profile 2 - ${new Date(comparisonProfiles.profile2.date).toLocaleDateString()}`,
                            data: comparisonProfiles.profile2.temperature,
                            borderColor: '#F4EEFF',
                            backgroundColor: 'rgba(244, 238, 255, 0.2)',
                            tension: 0.1
                          }
                        ]
                      }}
                      options={profileOptions}
                    />
                  ) : (
                    <div className="flex justify-center items-center h-full text-[#F4EEFF]">
                      Select two profiles to compare
                    </div>
                  )}
                </div>
              </div>
              
              <div className="bg-[#424874] p-4 rounded-lg">
                <h3 className="text-lg font-medium text-[#F4EEFF] mb-4">Salinity Profile Comparison</h3>
                <div className="h-80">
                  {comparisonProfiles.profile1 && comparisonProfiles.profile2 ? (
                    <Line
                      data={{
                        labels: comparisonProfiles.profile1.depth,
                        datasets: [
                          {
                            label: `Profile 1 - ${new Date(comparisonProfiles.profile1.date).toLocaleDateString()}`,
                            data: comparisonProfiles.profile1.salinity,
                            borderColor: '#A6B1E1',
                            backgroundColor: 'rgba(166, 177, 225, 0.2)',
                            tension: 0.1
                          },
                          {
                            label: `Profile 2 - ${new Date(comparisonProfiles.profile2.date).toLocaleDateString()}`,
                            data: comparisonProfiles.profile2.salinity,
                            borderColor: '#F4EEFF',
                            backgroundColor: 'rgba(244, 238, 255, 0.2)',
                            tension: 0.1
                          }
                        ]
                      }}
                      options={profileOptions}
                    />
                  ) : (
                    <div className="flex justify-center items-center h-full text-[#F4EEFF]">
                      Select two profiles to compare
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InterDash;