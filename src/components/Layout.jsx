import React, { useState, useEffect } from "react";
import { 
  Home,
  BarChart3,
  MessageCircle,
  Hexagon,
  Map,
  Globe,
  Mic,
  Settings,
  Check,
  Play,
  Pause,
  Volume2
} from "lucide-react";
import Beams from "./Beams";
import { previewVoice, stopSpeaking } from "../utils/voiceUtils";

export default function Layout({ children, currentPage = "dashboard" }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState("en-US-AriaNeural");
  const [isPlayingVoice, setIsPlayingVoice] = useState(null);
  const [showVoiceApplied, setShowVoiceApplied] = useState(false);

  const voiceOptions = [
    { id: "en-US-AriaNeural", name: "Aria (Female)", gender: "female", accent: "US" },
    { id: "en-US-JennyNeural", name: "Jenny (Female)", gender: "female", accent: "US" },
    { id: "en-US-GuyNeural", name: "Guy (Male)", gender: "male", accent: "US" },
    { id: "en-US-DavisNeural", name: "Davis (Male)", gender: "male", accent: "US" },
    { id: "en-GB-SoniaNeural", name: "Sonia (Female)", gender: "female", accent: "UK" },
    { id: "en-GB-RyanNeural", name: "Ryan (Male)", gender: "male", accent: "UK" },
    { id: "en-AU-NatashaNeural", name: "Natasha (Female)", gender: "female", accent: "AU" },
    { id: "en-AU-KenNeural", name: "Ken (Male)", gender: "male", accent: "AU" },
    { id: "en-CA-ClaraNeural", name: "Clara (Female)", gender: "female", accent: "CA" },
    { id: "en-CA-LiamNeural", name: "Liam (Male)", gender: "male", accent: "CA" }
  ];

  // Load saved voice preference on component mount
  useEffect(() => {
    const savedVoice = localStorage.getItem('selectedVoice');
    if (savedVoice && voiceOptions.find(v => v.id === savedVoice)) {
      setSelectedVoice(savedVoice);
    }
  }, []);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/dashboard' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, path: '/analytics' },
    { id: 'chat', label: 'FloatChat', icon: MessageCircle, path: '/chat' },
    { id: 'polygon', label: 'Polygon', icon: Hexagon, path: '/polygon' },
    { id: 'mapview', label: 'Map View', icon: Map, path: '/map-view' },
    { id: 'globe', label: 'Globe View', icon: Globe, path: '/globe' },
    { id: 'voice', label: 'Voice Settings', icon: Mic, path: '#', action: () => setShowVoiceSettings(true) }
  ];

  return (
    <div className="flex h-screen w-screen bg-black text-white font-sans overflow-hidden">
      {/* 3D Beam Background */}
      <div className="absolute inset-0 w-full h-full z-0">
        <Beams
          beamWidth={3}
          beamHeight={20}
          beamNumber={15}
          lightColor="#ffffff"
          speed={1.5}
          noiseIntensity={0.2}
          scale={0.03}
          rotation={0}
        />
      </div>

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

      {/* Voice Settings Modal */}
      {showVoiceSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-black/90 backdrop-blur-xl rounded-lg p-6 max-w-2xl w-full mx-4 border border-gray-600/30 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Volume2 size={24} className="text-blue-400" />
                <h2 className="text-xl font-bold text-white">Voice Settings</h2>
              </div>
                <button
                  onClick={() => setShowVoiceSettings(false)}
                  className="text-gray-400 hover:text-gray-200 transition-colors"
                >
                  ✕
                </button>
            </div>

            <div className="space-y-4">
              <div className="mb-6">
                <h3 className="text-white font-medium mb-3">Select Your Preferred Voice</h3>
                <p className="text-gray-300 text-sm mb-4">
                  Choose from our collection of natural-sounding voices. Click the play button to preview each voice.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {voiceOptions.map((voice) => (
                  <div
                    key={voice.id}
                    className={`p-4 rounded-lg border transition-all duration-200 cursor-pointer ${
                      selectedVoice === voice.id
                        ? 'border-gray-500 bg-gray-600/30'
                        : 'border-gray-600 bg-gray-800/50 hover:border-gray-500 hover:bg-gray-700/50'
                    }`}
                    onClick={() => setSelectedVoice(voice.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                          voice.gender === 'female' ? 'bg-pink-400' : 'bg-blue-400'
                        }`}></div>
                        <div>
                          <div className="text-white font-medium">{voice.name}</div>
                          <div className="text-gray-400 text-sm">{voice.accent} Accent</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {selectedVoice === voice.id && (
                          <Check size={16} className="text-gray-300" />
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (isPlayingVoice === voice.id) {
                              stopSpeaking();
                              setIsPlayingVoice(null);
                            } else {
                              stopSpeaking(); // Stop any current speech
                              setIsPlayingVoice(voice.id);
                              previewVoice(voice.id, "Hello, this is a preview of the selected voice. How does this sound?");
                              // Reset playing state after speech completes
                              setTimeout(() => setIsPlayingVoice(null), 3000);
                            }
                          }}
                          className="p-2 rounded-full bg-gray-600 hover:bg-gray-500 transition-colors"
                          title="Preview voice"
                        >
                          {isPlayingVoice === voice.id ? (
                            <Pause size={16} className="text-white" />
                          ) : (
                            <Play size={16} className="text-white" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-gray-800/50 rounded-lg border border-gray-600">
                <h4 className="text-white font-medium mb-2">Current Selection</h4>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    voiceOptions.find(v => v.id === selectedVoice)?.gender === 'female' ? 'bg-pink-400' : 'bg-blue-400'
                  }`}></div>
                  <span className="text-gray-300">
                    {voiceOptions.find(v => v.id === selectedVoice)?.name} - 
                    {voiceOptions.find(v => v.id === selectedVoice)?.accent} Accent
                  </span>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    // Save voice preference to localStorage
                    localStorage.setItem('selectedVoice', selectedVoice);
                    setShowVoiceApplied(true);
                    setTimeout(() => setShowVoiceApplied(false), 3000);
                    setShowVoiceSettings(false);
                  }}
                  className="flex-1 bg-gray-600 text-white rounded-lg px-4 py-2 transition ease-in-out hover:bg-gray-700 active:bg-gray-800 flex items-center justify-center gap-2"
                >
                  <Settings size={16} />
                  Apply Voice Settings
                </button>
                <button
                  onClick={() => setShowVoiceSettings(false)}
                  className="px-4 py-2 bg-gray-600 text-gray-200 rounded-lg transition ease-in-out hover:bg-gray-700 active:bg-gray-800"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Voice Settings Applied Notification */}
      {showVoiceApplied && (
        <div className="fixed top-4 right-4 bg-gray-800 text-gray-200 px-4 py-2 rounded-lg shadow-lg z-50 flex items-center gap-2 border border-gray-600">
          <Check size={16} />
          Voice settings applied successfully!
        </div>
      )}
    </div>
  );
}
