import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const location = useLocation();
  
  // Function to check if a path is the current active route
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <aside className={`bg-gray-800 text-gray-100 w-64 p-4 shadow-lg z-10 transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static fixed inset-y-0 left-0 mt-16 lg:mt-0 overflow-y-auto`}>
      <nav className="space-y-2">
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 极0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Dashboard
          </h2>
          <ul className="space-y-2">
            <li>
              <Link 
                to="/" 
                className={`flex items-center p-2 rounded-lg transition-colors ${isActive('/') ? 'bg-gray-600 text-white' : 'hover:bg-gray-700 hover:text-gray-200'}`}
                onClick={() => setSidebarOpen(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 极7 7M5 10v10a1 1 0 001 1极h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Overview
              </Link>
            </li>
            <li>
              <Link 
                to="/analytics" 
                className={`flex items-center p-2 rounded-lg transition-colors ${isActive('/analytics') ? 'bg-gray-600 text-white' : 'hover:bg-gray-700 hover:text-gray-200'}`}
                onClick={() => setSidebarOpen(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Analytics
              </Link>
            </li>
            <li>
              <Link 
                to="/map-view" 
                className={`flex items-center p-2 rounded-lg transition-colors ${isActive('/map-view') ? 'bg-gray-600 text-white' : 'hover:bg-gray-700 hover:text-gray-200'}`}
                onClick={() => setSidebarOpen(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24极" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Map View
              </Link>
            </li>
            <li>
              <Link 
                to="/map-detailed" 
                className={`flex items-center p-2 rounded-lg transition-colors ${isActive('/map-detailed') ? 'bg-gray-600 text-white' : 'hover:bg-gray-700 hover:text-gray-200'}`}
                onClick={() => setSidebarOpen(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Detailed Map Analytics
              </Link>
            </li>
            <li>
              <Link 
                to="/reports" 
                className={`flex items-center p-2 rounded-lg transition-colors ${isActive('/reports') ? 'bg-gray-600 text-white' : 'hover:bg-gray-700 hover:text-gray-200'}`}
                onClick={() => setSidebarOpen(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Reports
              </Link>
            </li>
          </ul>
          <ul className="space-y-2">
            <li>
              <Link 
                to="/polygon" 
                className={`flex items-center p-2 rounded-lg transition-colors ${isActive('/polygon') ? 'bg-gray-600 text-white' : 'hover:bg-gray-700 hover:text-gray-200'}`}
                onClick={() => setSidebarOpen(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                Polygon
              </Link>
            </li>
            <li>
              <Link 
                to="/interact" 
                className={`flex items-center p-2 rounded-lg transition-colors ${isActive('/interact') ? 'bg-gray-600 text-white' : 'hover:bg-gray-700 hover:text-gray-200'}`}
                onClick={() => setSidebarOpen(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                Interactive Dashboard
              </Link>
            </li>
            <li>
              <Link 
                to="/globe" 
                className={`flex items-center p-2 rounded-lg transition-colors ${isActive('/globe') ? 'bg-gray-600 text-white' : 'hover:bg-gray-700 hover:text-gray-200'}`}
                onClick={() => setSidebarOpen(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Global View
              </Link>
            </li>
            <li>
              <Link 
                to="/float-trajectory" 
                className={`flex items-center p-2 rounded-lg transition-colors ${isActive('/float-trajectory') ? 'bg-gray-600 text-white' : 'hover:bg-gray-700 hover:text-gray-200'}`}
                onClick={() => setSidebarOpen(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                Float Trajectory
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </aside>
  );
}