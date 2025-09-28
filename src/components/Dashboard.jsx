import React, { useEffect, useRef, useState } from 'react';
import TemperatureCard from './TemperatureCard';
import SalinityCard from './SalinityCard';
import OxygenCard from './OxygenCard';
import FloatStats from './FloatStats';
import FloatRegionChart from './FloatRegionChart';
import CoreMeasurementsWidget from './CoreMeasurementsWidget';
import FloatTimeSeries from './FloatTimeSeries';
import FloatProfileScatter from './FloatProfileScatter';
import FloatList from './FloatList';
import FloatPlatformDonut from './FloatPlatformDonut';
import TopProjects from './TopProjects';
import timeLocationManifest from '../data/01/manifest-time_location.json';
import metadataManifest from '../data/01/manifest-metadata_clean.json';

const Dashboard = () => {
  const scrollRef = useRef(null);
  const lastScrollRef = useRef(0);
  const [headerHidden, setHeaderHidden] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const onScroll = () => {
      const y = el.scrollTop;
      const last = lastScrollRef.current;
      const delta = y - last;
      // Hide on scroll down, show on scroll up
      if (y > 10 && delta > 2) setHeaderHidden(true);
      else if (delta < -2 || y <= 10) setHeaderHidden(false);
      lastScrollRef.current = y;
    };

    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="w-full h-full flex flex-col">
      {/* Header - Responsive (hide/show on scroll) */}
      <div className={`flex-shrink-0 p-2 md:p-4 text-center sticky top-0 z-50 transition-transform duration-300 bg-black/20 backdrop-blur-sm ${headerHidden ? '-translate-y-full' : 'translate-y-0'}`}>
        <h1 className="text-xl md:text-3xl lg:text-4xl xl:text-5xl font-black text-white mb-3 md:mb-4 bg-gradient-to-r from-white via-blue-100 to-cyan-200 bg-clip-text text-transparent leading-tight">
          FloatChat Dashboard
        </h1>
        <div className="w-20 md:w-24 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 mx-auto mb-3 md:mb-4 rounded-full"></div>
        <p className="text-sm md:text-base lg:text-lg text-gray-300 leading-relaxed max-w-2xl mx-auto px-4">
          Real-time Ocean Data & Communication Platform
        </p>
      </div>

      {/* Three scrolling sections */}
      <div className="flex-1 min-h-0 px-0 md:px-0 pb-0 md:pb-0">
        <div ref={scrollRef} className="h-full w-full overflow-y-auto snap-y snap-mandatory">
          {/* Section 1: Stats & Region */}
          <section className="snap-start px-2 md:px-4 pb-8 md:pb-10">
            <div className="max-w-6xl xl:max-w-7xl mx-auto h-full flex flex-col">
          {/* Real Float Stats */}
          <div className="mb-4 md:mb-6">
            <FloatStats />
          </div>

          {/* Region Distribution */}
          <div className="mb-4 md:mb-6">
            <FloatRegionChart />
          </div>

          {/* Extra: Platform types & Top projects */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
            <FloatPlatformDonut />
            <TopProjects />
          </div>

          {/* Close Section 1 wrappers */}
          </div>
          </section>

          {/* Section 2: Interactive charts from parquet manifests */}
          <section className="snap-start px-2 md:px-4 pb-8 md:pb-10">
            <div className="max-w-6xl xl:max-w-7xl mx-auto h-full flex flex-col">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
                <FloatTimeSeries />
                <FloatProfileScatter />
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
            </div>
          </section>

          {/* Section 3: Full float list */}
          <section className="snap-start px-2 md:px-4 pb-8 md:pb-10">
            <div className="max-w-6xl xl:max-w-7xl mx-auto h-full flex flex-col">
              <FloatList />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;