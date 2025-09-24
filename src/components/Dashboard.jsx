import React from 'react';
import TemperatureCard from './TemperatureCard';
import SalinityCard from './SalinityCard';
import OxygenCard from './OxygenCard';
import LiveGraph from './LiveGraph';
import EnhancedAnalytics from './EnhancedAnalytics';
import ComprehensiveOceanAnalytics from './ComprehensiveOceanAnalytics';
import CoreMeasurementsWidget from './CoreMeasurementsWidget';
import timeLocationManifest from '../data/01/manifest-time_location.json';
import metadataManifest from '../data/01/manifest-metadata_clean.json';

const Dashboard = () => {
  return (
    <div className="w-full h-full flex flex-col">
      {/* Header - Responsive */}
      <div className="flex-shrink-0 p-2 md:p-4 text-center">
        <h1 className="text-xl md:text-3xl lg:text-4xl xl:text-5xl font-black text-white mb-3 md:mb-4 bg-gradient-to-r from-white via-blue-100 to-cyan-200 bg-clip-text text-transparent leading-tight">
          FloatChat Dashboard
        </h1>
        <div className="w-20 md:w-24 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 mx-auto mb-3 md:mb-4 rounded-full"></div>
        <p className="text-sm md:text-base lg:text-lg text-gray-300 leading-relaxed max-w-2xl mx-auto px-4">
          Real-time Ocean Data & Communication Platform
        </p>
      </div>

      {/* Live Data Cards - Responsive Grid */}
      <div className="flex-1 min-h-0 px-2 md:px-4 pb-2 md:pb-4">
        <div className="max-w-6xl xl:max-w-7xl mx-auto h-full flex flex-col">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-4 md:mb-6 justify-items-center">
            <div className="w-full max-w-sm">
              <TemperatureCard />
            </div>
            <div className="w-full max-w-sm">
              <SalinityCard />
            </div>
            <div className="w-full max-w-sm">
              <OxygenCard />
            </div>
          </div>

          {/* Combined Live Graph - Responsive */}
          <div className="flex-1 min-h-0 mb-4 md:mb-6">
            <div className="bg-gradient-to-br from-black via-gray-900 to-blue-950 rounded-xl md:rounded-2xl p-3 md:p-6 shadow-2xl border border-gray-700/50 h-full">
              <LiveGraph />
            </div>
          </div>

          {/* Enhanced Analytics Section */}
          <div className="flex-shrink-0 mb-4 md:mb-6">
            <EnhancedAnalytics />
          </div>

          {/* Core Measurements + Summary (from real data) */}
          <div className="flex-shrink-0 mb-4 md:mb-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2">
                <CoreMeasurementsWidget />
              </div>
              <div className="bg-black/60 border border-gray-700 rounded-xl p-4">
                <h3 className="text-white text-sm font-semibold mb-3">Data Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-300">
                    <span>Profiles (month)</span>
                    <span className="text-white font-medium">{timeLocationManifest.parquet_rows?.toLocaleString?.() || timeLocationManifest.parquet_rows}</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Platforms (sample)</span>
                    <span className="text-white font-medium">{(metadataManifest.sample_parquet_head?.PLATFORM_NUMBER?.length) || '-'}</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>First JULD</span>
                    <span className="text-white font-medium">{(timeLocationManifest.sample_parquet_head?.JULD?.[0]) || '-'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Comprehensive Ocean Analytics Section */}
          <div className="flex-shrink-0">
            <ComprehensiveOceanAnalytics />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;