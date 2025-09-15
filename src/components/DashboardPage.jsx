import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MapView from "./MapView";
import PlotView from "./PlotView";
import TableView from "./TableView";

export default function DashboardPage() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dateRange, setDateRange] = useState("7d");
  const [notifications, setNotifications] = useState([
    { id: 1, message: "New data available from Float-2", time: "2 mins ago", read: false },
    { id: 2, message: "Scheduled maintenance tomorrow", time: "1 hour ago", read: false },
  ]);

  // Example Data
  const floats = [
    { lat: 0, lon: 80, name: "Float-1", status: "active" },
    { lat: 10, lon: 90, name: "Float-2", status: "active" },
    { lat: -5, lon: 85, name: "Float-3", status: "maintenance" },
    { lat: 15, lon: 75, name: "Float-4", status: "active" },
    { lat: -8, lon: 95, name: "Float-5", status: "inactive" },
  ];
  
  const plotData = { 
    x: [0, 1, 2, 3, 4, 5, 6, 7], 
    y: [10, 20, 15, 25, 18, 30, 35, 28] 
  };
  
  const tableData = [
    { Name: "Float-1", Lat: 0, Lon: 80, Status: "Active", LastUpdate: "2023-05-15", Depth: "1000m" },
    { Name: "Float-2", Lat: 10, Lon: 90, Status: "Active", LastUpdate: "2023-05-14", Depth: "1500m" },
    { Name: "Float-3", Lat: -5, Lon: 85, Status: "Maintenance", LastUpdate: "2023-05-10", Depth: "2000m" },
    { Name: "Float-4", Lat: 15, Lon: 75, Status: "Active", LastUpdate: "2023-05-13", Depth: "1800m" },
    { Name: "Float-5", Lat: -8, Lon: 95, Status: "Inactive", LastUpdate: "2023-05-08", Depth: "1200m" },
  ];

  // Stats for the dashboard
  const stats = [
    { label: "Active Floats", value: "4", change: "+1", icon: "🌊" },
    { label: "Data Points", value: "12,247", change: "+142", icon: "📊" },
    { label: "Coverage Area", value: "5,200 km²", change: "+350", icon: "🗺️" },
    { label: "Data Quality", value: "98.2%", change: "+2.3%", icon: "✅" },
  ];

  const markNotificationAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? {...n, read: true} : n
    ));
  };

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
            <h1 className="text-2xl font-bold">🌊 Argo Data Dashboard</h1>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative group">
            <button className="p-2 rounded-lg bg-[#A6B1E1] hover:bg-[#DCD6F7] transition-colors relative">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {notifications.filter(n => !n.read).length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {notifications.filter(n => !n.read).length}
                </span>
              )}
            </button>
            
            {/* Notification dropdown */}
            <div className="absolute right-0 mt-2 w-80 bg-[#A6B1E1] rounded-lg shadow-xl z-10 hidden group-hover:block">
              <div className="p-4 border-b border-[#DCD6F7]">
                <h3 className="font-semibold text-[#424874]">Notifications</h3>
              </div>
              <div className="max-h-60 overflow-y-auto">
                {notifications.map(notification => (
                  <div 
                    key={notification.id} 
                    className={`p-4 border-b border-[#DCD6F7] ${notification.read ? 'opacity-70' : 'bg-[#424874] text-[#F4EEFF]'}`}
                  >
                    <p className="text-sm">{notification.message}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs opacity-75">{notification.time}</span>
                      {!notification.read && (
                        <button 
                          onClick={() => markNotificationAsRead(notification.id)}
                          className="text-xs text-[#DCD6F7] hover:text-[#F4EEFF]"
                        >
                          Mark as read
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <button
            onClick={() => navigate("/chat")}
            className="bg-[#A6B1E1] text-[#424874] px-4 py-2 rounded-lg hover:bg-[#DCD6F7] hover:text-[#424874] transition-all flex items-center space-x-2 shadow hover:shadow-md font-medium"
          >
            <span>Go to ChatBot</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className={`bg-[#424874] text-[#F4EEFF] w-64 p-4 shadow-lg z-10 transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static fixed inset-y-0 left-0 mt-16 lg:mt-0 overflow-y-auto`}>
          <nav className="space-y-2">
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Dashboard
              </h2>
              <ul className="space-y-2">
                <li className="flex items-center p-2 rounded-lg bg-[#A6B1E1] text-[#424874]">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Overview
                </li>
                <li className="flex items-center p-2 rounded-lg hover:bg-[#A6B1E1] hover:text-[#424874] transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Analytics
                </li>
                <li className="flex items-center p-2 rounded-lg hover:bg-[#A6B1E1] hover:text-[#424874] transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Map View
                </li>
                <li className="flex items-center p-2 rounded-lg hover:bg-[#A6B1E1] hover:text-[#424874] transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Reports
                </li>
              </ul>
            </div>
            
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Settings
              </h2>
              <ul className="space-y-2">
                <li className="flex items-center p-2 rounded-lg hover:bg-[#A6B1E1] hover:text-[#424874] transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                  </svg>
                  Preferences
                </li>
                <li className="flex items-center p-2 rounded-lg hover:bg-[#A6B1E1] hover:text-[#424874] transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  User Management
                </li>
              </ul>
            </div>
          </nav>
        </aside>

        {/* Main Content Container */}
        <main className="flex-1 overflow-auto p-4 md:p-6">
          {/* Date Range Selector */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-white">Dashboard Overview</h2>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-[#DCD6F7]">Time range:</span>
              <select 
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="bg-[#A6B1E1] text-[#424874] px-3 py-1 rounded-lg border border-[#DCD6F7]"
              >
                <option value="1d">Last 24 hours</option>
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
              </select>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="mb-6 md:mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="bg-[#A6B1E1] rounded-xl p-4 md:p-5 shadow-lg border border-[#DCD6F7] transition-transform hover:scale-[1.02]">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[#424874] text-sm font-medium opacity-90">{stat.label}</p>
                      <h3 className="text-2xl md:text-3xl font-bold text-[#424874] mt-1">{stat.value}</h3>
                    </div>
                    <div className="text-2xl">{stat.icon}</div>
                  </div>
                  <div className="flex items-center mt-4">
                    <span className="text-xs bg-[#DCD6F7] text-[#424874] px-2 py-1 rounded-full">{stat.change}</span>
                    <span className="text-xs text-[#424874] ml-2">since yesterday</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            {/* Map Section - Full Width */}
            <div className="lg:col-span-2 bg-[#A6B1E1] rounded-xl shadow-lg p-4 md:p-5 border border-[#DCD6F7]">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-[#424874]">Float Locations</h2>
                <div className="flex space-x-2">
                  <button className="text-xs bg-[#DCD6F7] text-[#424874] px-3 py-1 rounded-lg hover:bg-[#F4EEFF] transition">
                    Real-time
                  </button>
                  <button className="text-xs bg-[#DCD6F7] text-[#424874] px-3 py-1 rounded-lg hover:bg-[#F4EEFF] transition">
                    Filter
                  </button>
                  <button className="text-xs bg-[#DCD6F7] text-[#424874] px-3 py-1 rounded-lg hover:bg-[#F4EEFF] transition">
                    Export
                  </button>
                </div>
              </div>
              <div className="h-80 md:h-96 rounded-lg overflow-hidden">
                <MapView floats={floats} />
              </div>
            </div>

            {/* Plot Section */}
            <div className="bg-[#A6B1E1] rounded-xl shadow-lg p-4 md:p-5 border border-[#DCD6F7] flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-[#424874]">Data Trends</h2>
                <select className="text-xs bg-[#DCD6F7] text-[#424874] px-3 py-1 rounded-lg border-none">
                  <option>Temperature</option>
                  <option>Salinity</option>
                  <option>Pressure</option>
                  <option>Oxygen</option>
                  <option>Chlorophyll</option>
                </select>
              </div>
              <div className="h-64 md:h-72 flex-1">
                <PlotView data={plotData} />
              </div>
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-[#DCD6F7]">
                <span className="text-sm text-[#424874]">Average: 22.4°C</span>
                <span className="text-sm text-[#424874]">Max: 35.1°C</span>
                <span className="text-sm text-[#424874]">Min: 10.2°C</span>
              </div>
            </div>

            {/* Table Section */}
            <div className="bg-[#A6B1E1] rounded-xl shadow-lg p-4 md:p-5 border border-[#DCD6F7] flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-[#424874]">Float Details</h2>
                <div className="flex space-x-2">
                  <button className="text-xs bg-[#DCD6F7] text-[#424874] px-3 py-1 rounded-lg hover:bg-[#F4EEFF] transition">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                    </svg>
                  </button>
                  <button className="text-xs bg-[#DCD6F7] text-[#424874] px-3 py-1 rounded-lg hover:bg-[#F4EEFF] transition">
                    Export CSV
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto flex-1">
                <TableView tableData={tableData} />
              </div>
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-[#DCD6F7]">
                <span className="text-sm text-[#424874]">Showing 5 of 23 floats</span>
                <div className="flex space-x-2">
                  <button className="text-xs bg-[#DCD6F7] text-[#424874] px-3 py-1 rounded-lg hover:bg-[#F4EEFF] transition">
                    Previous
                  </button>
                  <button className="text-xs bg-[#DCD6F7] text-[#424874] px-3 py-1 rounded-lg hover:bg-[#F4EEFF] transition">
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-[#424874] text-[#DCD6F7] p-4 text-center text-sm border-t border-[#A6B1E1]">
        <p>Argo Data Dashboard • Updated: May 15, 2023 • v2.1.0</p>
      </footer>
    </div>
  );
}