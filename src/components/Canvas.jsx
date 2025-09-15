import React from "react";
import PlotView from "./PlotView";

export default function Canvas({ plotData }) {
  return (
    <div className="w-full h-full rounded-xl shadow-xl border border-[#DCD6F7] p-4 bg-gradient-to-br from-[#424874] to-[#A6B1E1]">
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-[#F4EEFF]">Data Visualization</h2>
          <div className="flex space-x-2">
            <button className="text-xs bg-[#DCD6F7] text-[#424874] px-3 py-1 rounded-lg hover:bg-[#F4EEFF] transition flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
            <button className="text-xs bg-[#DCD6F7] text-[#424874] px-3 py-1 rounded-lg hover:bg-[#F4EEFF] transition flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export
            </button>
          </div>
        </div>
        
        {plotData ? (
          <div className="flex-1 rounded-lg bg-[#F4EEFF] p-4 shadow-inner overflow-auto">
            <PlotView data={plotData} title={plotData.title || "ARGO Data Visualization"} />
          </div>
        ) : (
          <div className="flex-1 rounded-lg bg-[#F4EEFF] bg-opacity-10 p-6 flex flex-col items-center justify-center text-center">
            <div className="mb-4 p-4 rounded-full bg-[#DCD6F7] bg-opacity-20">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-[#DCD6F7]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-[#F4EEFF] mb-2">No Visualization Yet</h3>
            <p className="text-[#DCD6F7] max-w-md">
              Ask me to create a plot or graph using ARGO data. Try something like "Show me temperature data from the Pacific Ocean" or "Plot salinity variations over time".
            </p>
          </div>
        )}
        
        {plotData && (
          <div className="mt-4 p-3 rounded-lg bg-[#424874] bg-opacity-50 text-xs text-[#DCD6F7]">
            <div className="flex justify-between">
              <span>Data Source: ARGO Float Network</span>
              <span>Generated: {new Date().toLocaleTimeString()}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}