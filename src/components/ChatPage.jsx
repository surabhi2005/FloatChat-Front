import React, { useState, useRef, useEffect } from "react";
import { 
  Send, 
  Paperclip, 
  Mic, 
  MicOff, 
  Image, 
  FileText, 
  Download, 
  Trash2, 
  Bot,
  User,
  Loader2,
  Compass,
  Waves,
  Palette
} from "lucide-react";
import Canvas from "./Canvas";
import BeamsBackground from "./BeamsBackground";

export default function ChatPage() {
  const [chatSessions, setChatSessions] = useState([
    { id: `sess-${Date.now() - 20000}`, title: "ARGO Data Exploration", active: true, createdAt: new Date(Date.now() - 20000), updatedAt: new Date(Date.now() - 20000) },
    { id: `sess-${Date.now() - 15000}`, title: "Pacific Temperature Analysis", active: false, createdAt: new Date(Date.now() - 15000), updatedAt: new Date(Date.now() - 15000) },
    { id: `sess-${Date.now() - 10000}`, title: "Salinity Comparison", active: false, createdAt: new Date(Date.now() - 10000), updatedAt: new Date(Date.now() - 10000) },
  ]);
  
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "bot",
      text: "Hello! I'm your ARGO data assistant. How can I help you today?",
      timestamp: new Date(Date.now() - 300000),
      hasVisualization: false,
      attachments: [],
    },
  ]);
  
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [whisperApiKey, setWhisperApiKey] = useState("");
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);

  // Visual theme: "black" | "dark" | "white"
  const [theme, setTheme] = useState("black");

  const themeTokens = {
    black: {
      panel: "bg-black/40 border-gray-600/20",
      cardUser: "bg-gray-900 border border-gray-700",
      cardBot: "bg-gray-800/50 border border-gray-700/50",
      textMain: "text-white",
      textSoft: "text-gray-300",
      chip: "bg-gray-900/60 border border-gray-700",
      button: "bg-gray-900 border border-gray-700 text-gray-100 hover:border-cyan-400/60 hover:shadow-[0_0_0_1px_rgba(34,211,238,.35)]",
      input: "border border-gray-700 bg-black/60",
      accentGrad: "from-blue-500 via-cyan-500 to-purple-500",
      userText: "text-cyan-200"
    },
    dark: {
      panel: "bg-slate-900/50 border-slate-700/30",
      cardUser: "bg-slate-900 border border-slate-700",
      cardBot: "bg-slate-800/60 border border-slate-700/50",
      textMain: "text-slate-100",
      textSoft: "text-slate-300",
      chip: "bg-slate-900/60 border border-slate-700",
      button: "bg-slate-900 border border-slate-700 text-slate-100 hover:border-sky-400/60 hover:shadow-[0_0_0_1px_rgba(56,189,248,.35)]",
      input: "border border-slate-700 bg-slate-950/60",
      accentGrad: "from-sky-500 via-cyan-400 to-violet-500",
      userText: "text-sky-200"
    },
    white: {
      panel: "bg-white/70 backdrop-blur-xl border-gray-200",
      cardUser: "bg-white border border-gray-200",
      cardBot: "bg-gray-50 border border-gray-200",
      textMain: "text-gray-900",
      textSoft: "text-gray-700",
      chip: "bg-white border border-gray-200",
      button: "bg-white border border-gray-200 text-gray-900 hover:border-sky-400 hover:shadow-[0_0_0_2px_rgba(56,189,248,.25)]",
      input: "border border-gray-300 bg-white/80",
      accentGrad: "from-gray-900 via-gray-700 to-gray-900",
      userText: "text-gray-900"
    }
  };

  const t = themeTokens[theme];

  // Compact header when conversation starts or user is typing
  const isCompactHeader = messages.length > 1 || input.length > 0 || isLoading;

  const cycleTheme = () => {
    const order = ["black", "dark", "white"];
    const idx = order.indexOf(theme);
    const next = order[(idx + 1) % order.length];
    setTheme(next);
  };

  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // Scroll to bottom on new message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(scrollToBottom, [messages]);

  // Format timestamp
  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };
  const formatDate = (date) => {
    const d = new Date(date);
    return `${d.toLocaleDateString()} • ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };
  const getActiveSessionId = () => chatSessions.find((s) => s.active)?.id;

  // Handle file upload
  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    const newAttachments = files.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      type: file.type,
      size: file.size,
      file: file,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null
    }));
    setAttachments(prev => [...prev, ...newAttachments]);
  };

  // Remove attachment
  const removeAttachment = (id) => {
    setAttachments(prev => prev.filter(att => att.id !== id));
  };

  // Voice recording functions
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        await transcribeAudio(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Microphone access denied. Please allow microphone access to use voice input.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Transcribe audio using Whisper API
  const transcribeAudio = async (audioBlob) => {
    if (!whisperApiKey) {
      setShowApiKeyInput(true);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', audioBlob, 'audio.wav');
      formData.append('model', 'whisper-1');

      const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${whisperApiKey}`,
        },
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setInput(result.text);
      } else {
        throw new Error('Transcription failed');
      }
    } catch (error) {
      console.error('Transcription error:', error);
      alert('Voice transcription failed. Please check your API key and try again.');
    }
  };

  // Handle sending message
  const handleSend = () => {
    if (!input.trim() && attachments.length === 0) return;

    const userMessage = { 
      id: Date.now(),
      sender: "user", 
      text: input, 
      timestamp: new Date(), 
      hasVisualization: false,
      attachments: [...attachments]
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // Update active session meta (title/updatedAt)
    const activeId = getActiveSessionId();
    setChatSessions((prev) => prev.map((s) => {
      if (s.id !== activeId) return s;
      const newTitle = s.title === "New Conversation" || !s.title ? input.slice(0, 40) : s.title;
      return { ...s, title: newTitle, updatedAt: new Date() };
    }));

    // Clear input and attachments
    setInput("");
    setAttachments([]);

    setTimeout(() => {
      let botResponse;
      let visualizationData = null;

      const text = input.toLowerCase();

      if (text.includes("plot") || text.includes("graph") || text.includes("chart")) {
        visualizationData = {
          type: "chart",
          data: {
            chartType: "line",
            x: [0, 1, 2, 3, 4, 5],
            y: [5, 15, 10, 25, 15, 30],
            title: "Temperature Variation",
            xLabel: "Time (days)",
            yLabel: "Temperature (°C)",
          },
        };
        botResponse = {
          id: Date.now() + 1,
          sender: "bot",
          text: "Here's the chart for the data you requested.",
          timestamp: new Date(),
          hasVisualization: true,
          visualization: visualizationData,
          attachments: [],
        };
      } else if (text.includes("table") || text.includes("data table")) {
        visualizationData = {
          type: "table",
          data: {
            headers: ["Date", "Temperature (°C)", "Salinity (PSU)", "Depth (m)"],
            rows: [
              ["2023-01-15", 25.6, 35.2, 10],
              ["2023-01-16", 24.8, 35.4, 15],
              ["2023-01-17", 23.9, 35.1, 20],
              ["2023-01-18", 24.2, 35.3, 18],
              ["2023-01-19", 25.1, 35.0, 12],
            ],
            title: "ARGO Float Data Sample",
          },
        };
        botResponse = {
          id: Date.now() + 1,
          sender: "bot",
          text: "Here's the data table you requested.",
          timestamp: new Date(),
          hasVisualization: true,
          visualization: visualizationData,
          attachments: [],
        };
      } else if (text.includes("map") || text.includes("location")) {
        visualizationData = {
          type: "map",
          data: {
            locations: [
              { lat: 37.7749, lng: -122.4194, name: "Float #7901", temp: 15.6, salinity: 34.5 },
              { lat: 34.0522, lng: -118.2437, name: "Float #7902", temp: 18.2, salinity: 35.1 },
              { lat: 32.7157, lng: -117.1611, name: "Float #7903", temp: 19.8, salinity: 34.8 },
              { lat: 36.7783, lng: -119.4179, name: "Float #7904", temp: 17.4, salinity: 35.3 },
            ],
            center: { lat: 36.5, lng: -119.5 },
            zoom: 6,
            title: "ARGO Float Locations in Pacific Ocean",
          },
        };
        botResponse = {
          id: Date.now() + 1,
          sender: "bot",
          text: "Here's a map showing ARGO float locations.",
          timestamp: new Date(),
          hasVisualization: true,
          visualization: visualizationData,
          attachments: [],
        };
      } else if (text.includes("data") || text.includes("argo")) {
        botResponse = {
          id: Date.now() + 1,
          sender: "bot",
          text: "The ARGO float system has over 3,900 robotic floats measuring temperature, salinity, and other ocean properties. Ask me for a chart, table, or map!",
          timestamp: new Date(),
          hasVisualization: false,
          attachments: [],
        };
      } else if (text.includes("hello") || text.includes("hi")) {
        botResponse = {
          id: Date.now() + 1,
          sender: "bot",
          text: "Hello! I'm your ARGO data assistant. How can I help you today?",
          timestamp: new Date(),
          hasVisualization: false,
          attachments: [],
        };
      } else {
        botResponse = {
          id: Date.now() + 1,
          sender: "bot",
          text: "I'm processing your request. Try asking for a chart, table, or map.",
          timestamp: new Date(),
          hasVisualization: false,
          attachments: [],
        };
      }

      setMessages((prev) => [...prev, botResponse]);
      setIsLoading(false);

      // Update session updatedAt after bot response
      const activeIdAfter = getActiveSessionId();
      setChatSessions((prev) => prev.map((s) => s.id === activeIdAfter ? { ...s, updatedAt: new Date() } : s));
    }, 1000);
  };

  const handleNewChat = () => {
    const newSession = { 
      id: `sess-${Date.now()}`, 
      title: "New Conversation", 
      active: true, 
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const updatedSessions = chatSessions.map((s) => ({ ...s, active: false }));
    setChatSessions([...updatedSessions, newSession]);
    setMessages([
      {
        id: Date.now(),
        sender: "bot",
        text: "Hello! I'm your ARGO data assistant. How can I help you today?",
        timestamp: new Date(),
        hasVisualization: false,
        attachments: [],
      },
    ]);
  };

  const switchChatSession = (id) => {
    const updatedSessions = chatSessions.map((s) => ({ ...s, active: s.id === id }));
    setChatSessions(updatedSessions);
    setMessages([
      {
        id: Date.now(),
        sender: "bot",
        text: `Welcome back to "${chatSessions.find((s) => s.id === id)?.title}". How can I help you?`,
        timestamp: new Date(),
        hasVisualization: false,
        attachments: [],
      },
    ]);
  };

  const deleteChatSession = (id) => {
    setChatSessions(prev => prev.filter(s => s.id !== id));
    if (chatSessions.find(s => s.id === id)?.active) {
      handleNewChat();
    }
  };

  return (
    <div className="w-full h-full flex flex-col relative">
      {/* Animated Beams Background */}
      <div className="pointer-events-none fixed inset-0 -z-10 opacity-80">
        <BeamsBackground beamWidth={3} beamHeight={22} beamNumber={18} lightColor={theme === "white" ? "#66ccff" : "#ffffff"} speed={1.6} noiseIntensity={0.22} scale={0.05} rotation={2} />
      </div>
      {/* Enhanced Header (shrinks when chatting) */}
      <div className={`flex-shrink-0 text-center sticky top-0 z-10 backdrop-blur-sm ${isCompactHeader ? 'pt-2 pb-2' : 'p-2 md:p-4'}`}>
        <div className={`flex items-center justify-center gap-2 md:gap-3 ${isCompactHeader ? 'mb-1' : 'mb-3 md:mb-4'}`}>
          <Waves size={isCompactHeader ? 18 : 24} className="text-cyan-400 md:hidden" />
          <Waves size={isCompactHeader ? 26 : 32} className="text-cyan-400 hidden md:block" />
          <h1 className={`${isCompactHeader ? 'text-lg md:text-2xl' : 'text-xl md:text-3xl lg:text-4xl xl:text-5xl'} font-black text-white bg-gradient-to-r from-white via-blue-100 to-cyan-200 bg-clip-text text-transparent leading-tight`}>
            Living Voice of the Ocean
          </h1>
          <Compass size={isCompactHeader ? 18 : 24} className="text-blue-400 md:hidden" />
          <Compass size={isCompactHeader ? 26 : 32} className="text-blue-400 hidden md:block" />
        </div>
        {!isCompactHeader ? (
          <>
            <div className={`w-24 md:w-32 h-1 bg-gradient-to-r ${t.accentGrad} mx-auto mb-3 md:mb-4 rounded-full`}></div>
            <p className={`text-sm md:text-base lg:text-lg ${t.textSoft} leading-relaxed max-w-2xl mx-auto px-4`}>
              AI-Powered Ocean Data Communication Platform
            </p>
            <div className="mt-3 flex justify-center gap-2">
              {['black','dark','white'].map((mode) => (
                <button key={mode} onClick={() => setTheme(mode)} className={`${t.button} px-3 py-1 rounded-full text-xs capitalize ${theme===mode ? 'ring-2 ring-cyan-400/60' : 'opacity-80'}`}>{mode}</button>
              ))}
            </div>
          </>
        ) : (
          <div className="mt-1 flex justify-center">
            <button onClick={cycleTheme} className={`${t.button} rounded-full px-3 py-1`} title="Switch theme">
              <Palette size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Chat Interface Container */}
      <div className="flex-1 flex flex-col min-h-0 px-2 md:px-4 pb-2 md:pb-4">
        <div className="max-w-6xl xl:max-w-7xl mx-auto w-full h-full grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-4">
          {/* Chat Column */}
          <div className="flex flex-col h-full">

          {/* Messages Container - Flexible Height */}
          <div className="flex-1 min-h-0 mb-4">
            <div className={`h-full overflow-auto rounded-2xl ${t.panel} backdrop-blur-xl p-6 shadow-2xl space-y-4`}>
              {messages.map((m) => (
                <div key={m.id} className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] sm:max-w-[80%] md:max-w-md lg:max-w-lg xl:max-w-2xl 2xl:max-w-3xl rounded-xl p-4 flex flex-col ${
                    m.sender === "user" 
                      ? `${t.cardUser} ${t.textMain} rounded-br-none shadow-[0_0_0_1px_rgba(34,211,238,.15)]` 
                      : `${t.cardBot} ${t.textMain} rounded-bl-none`
                  }`}>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-1 rounded-full bg-white/10">
                        {m.sender === "user" ? <User size={14} /> : <Bot size={14} />}
                      </div>
                      <span className={`text-xs opacity-70 font-medium ${t.textSoft}`}>
                        {m.sender === "user" ? "You" : "Ocean Assistant"} • {formatTime(m.timestamp)}
                      </span>
                    </div>
                    <p className={`text-sm mb-2 leading-relaxed ${m.sender === "user" ? t.userText : t.textMain}`}>{m.text}</p>

                    {/* Attachments */}
                    {m.attachments && m.attachments.length > 0 && (
                      <div className="space-y-2 mb-2">
                        {m.attachments.map((att) => (
                          <div key={att.id} className={`flex items-center gap-2 p-2 ${t.chip} rounded-lg`}>
                            {att.type.startsWith('image/') ? (
                              <Image size={16} className="text-blue-400" />
                            ) : (
                              <FileText size={16} className="text-blue-400" />
                            )}
                            <span className="text-xs truncate">{att.name}</span>
                            <button className={`ml-auto ${t.button} rounded px-2 py-1`}>
                              <Download size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {m.hasVisualization && <Canvas visualization={m.visualization} />}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className={`flex items-center gap-2 ${t.textMain} text-sm`}>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Ocean Assistant is thinking...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Attachments Preview */}
          {attachments.length > 0 && (
            <div className={`flex-shrink-0 mb-4 p-3 ${t.panel} rounded-lg`}>
              <div className="flex flex-wrap gap-2">
                {attachments.map((att) => (
                  <div key={att.id} className={`flex items-center gap-2 p-2 ${t.chip} rounded`}>
                    {att.type.startsWith('image/') ? (
                      <Image size={16} className="text-blue-400" />
                    ) : (
                      <FileText size={16} className="text-blue-400" />
                    )}
                    <span className={`text-xs ${t.textMain}`}>{att.name}</span>
                    <button 
                      onClick={() => removeAttachment(att.id)}
                      className={`${t.button} rounded px-2 py-1`}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Fixed Input Area */}
          <div className="flex-shrink-0 flex gap-3">
            <button
              onClick={() => fileInputRef.current?.click()}
              className={`${t.button} rounded-lg px-4 py-2`}
              title="Attach file"
            >
              <Paperclip size={20} />
            </button>
            
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileUpload}
              className="hidden"
              accept="image/*,.pdf,.txt,.csv,.json"
            />

            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                rows={1}
                className={`w-full ${t.input} ${t.userText} rounded-2xl pl-5 pr-14 py-3 focus:outline-none placeholder-white/40 shadow-sm resize-none leading-6`}
                value={input}
                onChange={(e) => {
                  const el = e.target;
                  el.style.height = 'auto';
                  el.style.height = `${el.scrollHeight}px`;
                  setInput(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Ask about ARGO data..."
                disabled={isLoading}
              />
              <button
                onClick={isRecording ? stopRecording : startRecording}
                    className={`absolute right-4 top-1/2 transform -translate-y-1/2 p-1 rounded ${
                      isRecording 
                        ? "text-red-400 hover:text-red-300" 
                        : "text-gray-400 hover:text-gray-200"
                    }`}
                title={isRecording ? "Stop recording" : "Start voice input"}
              >
                {isRecording ? <MicOff size={16} /> : <Mic size={16} />}
              </button>
            </div>

            <button
              onClick={handleSend}
              disabled={isLoading || (!input.trim() && attachments.length === 0)}
              className={`${t.button} rounded-full px-6 py-2 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <Send size={20} />
            </button>
          </div>
          </div>

          {/* History Sidebar (styled like left sidebar) */}
          <aside className={`hidden lg:flex flex-col bg-gray-800 text-gray-100 rounded-2xl p-4 h-full min-h-0 shadow-lg`}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold">Chat History</h3>
              <button onClick={handleNewChat} className="rounded-lg px-3 py-1 text-xs bg-gray-700 hover:bg-gray-600 transition-colors">New</button>
            </div>
            <div className="flex-1 overflow-auto space-y-2">
              {chatSessions
                .slice()
                .sort((a,b)=> new Date(b.updatedAt)-new Date(a.updatedAt))
                .map((s) => (
                <div key={s.id} className={`p-3 rounded-lg cursor-pointer ${s.active ? 'bg-gray-700' : 'hover:bg-gray-700'} transition-colors`} onClick={() => switchChatSession(s.id)}>
                  <div className="text-xs text-gray-300">{formatDate(s.updatedAt ?? s.createdAt)}</div>
                  <div className="text-sm truncate text-gray-100">{s.title}</div>
                  <div className="text-[10px] mt-1 text-gray-400">{s.id}</div>
                  <div className="mt-2 flex gap-2">
                    <button onClick={(e)=>{e.stopPropagation(); switchChatSession(s.id);}} className="rounded px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 transition-colors">Open</button>
                    <button onClick={(e)=>{e.stopPropagation(); deleteChatSession(s.id);}} className="rounded px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 transition-colors">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>

      {/* API Key Input Modal */}
      {showApiKeyInput && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-black/90 backdrop-blur-xl rounded-lg p-6 max-w-md w-full mx-4 border border-gray-600/30">
            <h3 className="text-lg font-semibold mb-4 text-white">Enter OpenAI API Key</h3>
            <p className="text-sm text-gray-300 mb-4">
              Enter your OpenAI API key to use voice input with Whisper transcription.
            </p>
            <input
              type="password"
              value={whisperApiKey}
              onChange={(e) => setWhisperApiKey(e.target.value)}
              placeholder="sk-..."
              className="w-full p-3 border border-gray-500/20 bg-gray-600/30 text-white rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowApiKeyInput(false);
                  setWhisperApiKey("");
                }}
                className="bg-gray-600 text-gray-200 rounded-lg px-4 py-2 transition ease-in-out hover:bg-gray-700 active:bg-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowApiKeyInput(false)}
                className="bg-gray-600 text-gray-200 rounded-lg px-4 py-2 transition ease-in-out hover:bg-gray-700 active:bg-gray-800"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}