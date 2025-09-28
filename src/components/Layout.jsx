import React, { useState } from "react";
import { 
  Home,
  BarChart3,
  MessageCircle,
  Hexagon,
  Map,
  Globe
} from "lucide-react";
import Beams from "./Beams";

export default function Layout({ children, currentPage = "dashboard" }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/dashboard' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, path: '/analytics' },
    { id: 'chat', label: 'FloatChat', icon: MessageCircle, path: '/chat' },
    { id: 'polygon', label: 'Polygon', icon: Hexagon, path: '/polygon' },
    { id: 'mapview', label: 'Map View', icon: Map, path: '/map-view' },
    { id: 'globe', label: 'Globe View', icon: Globe, path: '/globe' },
    { id: 'float-trajectory', label: 'Float Trajectory', icon: Globe, path: '/float-trajectory' }
  ];

  return (
    <div className="flex h-screen w-screen bg-black text-white font-sans overflow-hidden">
      {/* 3D Beam Background */}
     

      {/* Brand Container - Responsive Position */}
      <div className={`fixed top-4 left-4 md:top-6 md:left-6 z-50 flex items-center gap-2 md:gap-3 pointer-events-none transition-all duration-300 ${
        sidebarOpen ? 'ml-0' : 'ml-0'
      }`}>
        <img 
          src="/Logo1.png" 
          alt="FLOATCHAT Logo" 
          className="h-6 w-auto max-w-24 md:h-8 md:max-w-32 lg:h-12 lg:max-w-44 filter-none image-rendering-crisp-edges backface-hidden transform-gpu"
        />
        <div className="font-black tracking-wider text-lg md:text-xl lg:text-3xl text-white font-inter filter-none">
          FLOATCHAT
        </div>
      </div>

      {/* Left Sidebar - Dashboard Style */}
      <div className={`fixed top-16 left-2 md:top-20 md:left-4 ${sidebarOpen ? 'w-64 md:w-72 lg:w-80' : 'w-16 md:w-20 lg:w-24'} h-[calc(100vh-4rem)] md:h-[calc(100vh-6rem)] bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-lg z-40 transition-all duration-500 ease-in-out overflow-y-auto overflow-x-hidden flex flex-col shadow-2xl`}>
        {/* Sidebar Header */}
        <div className={`flex items-center ${sidebarOpen ? 'justify-between' : 'justify-center'} p-2 md:p-3 border-b border-gray-600/30 bg-black/50 rounded-t-lg`}>
          <div className={`transition-all duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0'}`}>
            <h2 className="text-white font-semibold text-xs md:text-sm">Navigation</h2>
          </div>
          <button 
            className={`flex items-center justify-center rounded-lg ${sidebarOpen ? 'w-6 h-6 md:w-7 md:h-7' : 'w-6 h-6 md:w-7 md:h-7'}`}
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <div className="relative w-4 h-4 md:w-5 md:h-5">
              <span className={`absolute top-1 left-0 w-4 h-0.5 md:w-5 md:h-0.5 bg-white transition-all duration-300 ${sidebarOpen ? 'rotate-45 top-2' : ''}`}></span>
              <span className={`absolute top-2 left-0 w-4 h-0.5 md:w-5 md:h-0.5 bg-white transition-all duration-300 ${sidebarOpen ? 'opacity-0' : ''}`}></span>
              <span className={`absolute top-3 left-0 w-4 h-0.5 md:w-5 md:h-0.5 bg-white transition-all duration-300 ${sidebarOpen ? '-rotate-45 top-2' : ''}`}></span>
            </div>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2 md:p-3 space-y-1 md:space-y-2">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <div
                key={item.id}
                className=""
                onClick={() => item.action ? item.action() : (window.location.href = item.path)}
              >
                <div className={`flex items-center ${sidebarOpen ? 'gap-3 md:gap-4' : 'justify-center'} p-2 md:p-3 rounded-xl cursor-pointer relative overflow-hidden border ${item.id === currentPage ? 'bg-gray-700/40 border-gray-600/40' : 'bg-gray-800/40 border-gray-700/50'}`}>
                  {/* Icon */}
                  <div className="relative z-10 flex items-center justify-center w-6 h-6 md:w-7 md:h-7 text-white">
                    <IconComponent size={22} className="md:hidden text-white drop-shadow-sm" />
                    <IconComponent size={24} className="hidden md:block text-white drop-shadow-sm" />
                  </div>
                  
                  {/* Label */}
                  {sidebarOpen && (
                  <span className={`relative z-10 text-white font-medium text-xs md:text-sm`}>
                    {item.label}
                  </span>
                  )}
                </div>
              </div>
            );
          })}
        </nav>

        {/* User Info */}
        <div className="p-2 md:p-3 border-t border-gray-600/30 bg-black/60 rounded-b-lg">
          <div className={`flex items-center ${sidebarOpen ? 'gap-3 md:gap-4' : 'justify-center'}`}>
            <div className="relative">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-xs md:text-sm shadow-lg">
                U
              </div>
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 md:w-3 md:h-3 bg-green-500 rounded-full border-2 border-black"></div>
            </div>
            <div className={`transition-all duration-300 ${sidebarOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 pointer-events-none'}`}>
              <div className="text-white font-medium text-xs md:text-sm">Ocean User</div>
              <div className="text-white/70 text-xs">Data Analyst</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className={`flex-1 transition-all duration-500 ease-in-out ${sidebarOpen ? 'ml-64 md:ml-72 lg:ml-80' : 'ml-24 md:ml-28 lg:ml-32'} relative z-10 min-h-screen overflow-x-hidden`}>
        <div className="w-full h-full p-2 md:p-4">
          {children}
        </div>
      </div>

    </div>
  );
}
