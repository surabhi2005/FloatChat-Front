import React, { useState, useRef, useEffect } from "react";
import { MessageCircle } from "lucide-react";
import Canvas from "./Canvas";


export default function ChatPage() {
  const [chatSessions, setChatSessions] = useState([
    { id: 1, title: "ARGO Data Exploration", active: true },
    { id: 2, title: "Pacific Temperature Analysis", active: false },
    { id: 3, title: "Salinity Comparison", active: false },
  ]);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hello! I'm your ARGO data assistant. How can I help you today?",
      timestamp: new Date(Date.now() - 300000),
      hasVisualization: false,
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Scroll to bottom on new message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(scrollToBottom, [messages]);

  // Format timestamp
  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Handle sending message
  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input, timestamp: new Date(), hasVisualization: false };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    setTimeout(() => {
      let botResponse;
      let visualizationData = null;

      const text = input.toLowerCase();

      if (text.includes("plot") || text.includes("graph")|| text.includes("chart")) {
  visualizationData = {
    type: "chart",
    data: {
      chartType: "line",  // "line" or "bar"
      x: [0, 1, 2, 3, 4, 5],
      y: [5, 15, 10, 25, 15, 30],
      title: "Temperature Variation",
      xLabel: "Time (days)",
      yLabel: "Temperature (°C)",
    },
  };
  botResponse = {
    sender: "bot",
    text: "Here's the chart for the data you requested.",
    timestamp: new Date(),
    hasVisualization: true,
    visualization: visualizationData,
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
          sender: "bot",
          text: "Here's the data table you requested.",
          timestamp: new Date(),
          hasVisualization: true,
          visualization: visualizationData,
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
          sender: "bot",
          text: "Here's a map showing ARGO float locations.",
          timestamp: new Date(),
          hasVisualization: true,
          visualization: visualizationData,
        };
      } else if (text.includes("data") || text.includes("argo")) {
        botResponse = {
          sender: "bot",
          text: "The ARGO float system has over 3,900 robotic floats measuring temperature, salinity, and other ocean properties. Ask me for a chart, table, or map!",
          timestamp: new Date(),
          hasVisualization: false,
        };
      } else if (text.includes("hello") || text.includes("hi")) {
        botResponse = {
          sender: "bot",
          text: "Hello! I'm your ARGO data assistant. How can I help you today?",
          timestamp: new Date(),
          hasVisualization: false,
        };
      } else {
        botResponse = {
          sender: "bot",
          text: "I'm processing your request. Try asking for a chart, table, or map.",
          timestamp: new Date(),
          hasVisualization: false,
        };
      }

      setMessages((prev) => [...prev, botResponse]);
      setIsLoading(false);
    }, 1000);

    setInput("");
  };

  const handleNewChat = () => {
    const newSession = { id: Date.now(), title: "New Conversation", active: true };
    const updatedSessions = chatSessions.map((s) => ({ ...s, active: false }));
    setChatSessions([...updatedSessions, newSession]);
    setMessages([
      {
        sender: "bot",
        text: "Hello! I'm your ARGO data assistant. How can I help you today?",
        timestamp: new Date(),
        hasVisualization: false,
      },
    ]);
  };

  const switchChatSession = (id) => {
    const updatedSessions = chatSessions.map((s) => ({ ...s, active: s.id === id }));
    setChatSessions(updatedSessions);
    setMessages([
      {
        sender: "bot",
        text: `Welcome back to "${chatSessions.find((s) => s.id === id)?.title}". How can I help you?`,
        timestamp: new Date(),
        hasVisualization: false,
      },
    ]);
  };

  const suggestedQuestions = [
    "Show me temperature data from the Pacific",
    "Plot salinity variations over time",
    "Create a table with recent ARGO data",
    "Show ARGO float locations on a map",
  ];

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-[#424874] to-[#A6B1E1]">
      {/* Header */}
      <header className="bg-[#424874] text-[#F4EEFF] p-4 flex justify-between items-center shadow-lg border-b border-[#DCD6F7]">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="p-2 rounded-lg bg-[#A6B1E1] hover:bg-[#DCD6F7] transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <MessageCircle size={24} />
            ARGO Data Assistant
          </h1>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* History Sidebar */}
        {showHistory && (
          <div className="w-64 bg-[#424874] text-[#F4EEFF] flex flex-col border-r border-[#DCD6F7]">
            <div className="p-4">
              <button
                onClick={handleNewChat}
                className="w-full bg-[#A6B1E1] hover:bg-[#DCD6F7] text-[#F4EEFF] hover:text-[#424874] py-2 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors"
              >
                New Chat
              </button>
            </div>
            <div className="flex-1 overflow-auto p-2">
              <h3 className="px-2 py-1 text-sm font-medium text-[#DCD6F7]">Recent Conversations</h3>
              <div className="space-y-1">
                {chatSessions.map((session) => (
                  <button
                    key={session.id}
                    onClick={() => switchChatSession(session.id)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      session.active ? "bg-[#A6B1E1] text-[#F4EEFF]" : "hover:bg-[#A6B1E1] hover:text-[#F4EEFF] text-[#DCD6F7]"
                    }`}
                  >
                    {session.title}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Chat Column */}
        <div className="flex flex-col w-full transition-all duration-300">
          <div className="flex-1 overflow-hidden flex flex-col p-4">
            {/* Suggested Questions */}
            <div className="mb-4">
              <h3 className="text-[#DCD6F7] text-sm font-medium mb-2">Try asking:</h3>
              <div className="flex flex-wrap gap-2">
                {suggestedQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => setInput(q)}
                    className="bg-[#A6B1E1] text-[#F4EEFF] text-xs px-3 py-1 rounded-full hover:bg-[#DCD6F7] hover:text-[#424874] transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-auto rounded-lg bg-[#A6B1E1] p-4 shadow-inner space-y-4">
              {messages.map((m, idx) => (
                <div key={idx} className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-xs md:max-w-md lg:max-w-lg rounded-xl p-4 flex flex-col ${
                      m.sender === "user" ? "bg-[#DCD6F7] text-[#424874] rounded-br-none" : "bg-[#424874] text-[#F4EEFF] rounded-bl-none"
                    }`}
                  >
                    <span className="text-xs opacity-70 mb-1">
                      {m.sender === "user" ? "You" : "ARGO Assistant"} • {formatTime(m.timestamp)}
                    </span>
                    <p className="text-sm mb-2">{m.text}</p>

                    {m.hasVisualization && <Canvas visualization={m.visualization} />}
                  </div>
                </div>
              ))}
              {isLoading && <div className="text-[#F4EEFF] text-sm">ARGO Assistant is typing...</div>}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="mt-4 flex gap-2">
              <input
                ref={inputRef}
                type="text"
                className="flex-1 border-2 border-[#DCD6F7] bg-[#A6B1E1] text-[#F4EEFF] rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#DCD6F7] placeholder-[#DCD6F7]"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask about ARGO data..."
                disabled={isLoading}
              />
              <button
                onClick={handleSend}
                disabled={isLoading}
                className="bg-[#424874] text-[#F4EEFF] px-4 rounded-lg hover:bg-[#DCD6F7] hover:text-[#424874] transition-colors flex items-center justify-center"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}