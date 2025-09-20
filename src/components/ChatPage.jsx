import React, { useState, useRef, useEffect } from "react";
import Canvas from "./Canvas";

export default function ChatPage() {
  const [chatSessions, setChatSessions] = useState([
    { id: 1, title: "ARGO Data Exploration", active: true },
    { id: 2, title: "Pacific Temperature Analysis", active: false },
    { id: 3, title: "Salinity Comparison", active: false }
  ]);
  const [messages, setMessages] = useState([
    { 
      sender: "bot", 
      text: "Hello! I'm your ARGO data assistant. How can I help you today?", 
      timestamp: new Date(Date.now() - 300000),
      hasVisualization: false
    }
  ]);
  const [activeVisualization, setActiveVisualization] = useState(null);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    
    const userMessage = { 
      sender: "user", 
      text: input, 
      timestamp: new Date(),
      hasVisualization: false
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      let botResponse;
      let visualizationData = null;
      
      // Example responses based on user input
      if (input.toLowerCase().includes("plot") || input.toLowerCase().includes("graph")) {
        visualizationData = { 
          type: "chart",
          data: {
            x: [0, 1, 2, 3, 4, 5], 
            y: [5, 15, 10, 25, 15, 30],
            title: "Temperature Variation",
            xLabel: "Time (days)",
            yLabel: "Temperature (°C)"
          }
        };
        
        botResponse = { 
          sender: "bot", 
          text: "I've generated the plot you requested. Click the visualization button to view it.", 
          timestamp: new Date(),
          hasVisualization: true,
          visualization: visualizationData
        };
      } 
      else if (input.toLowerCase().includes("table") || input.toLowerCase().includes("data table")) {
        visualizationData = {
          type: "table",
          data: {
            headers: ["Date", "Temperature (°C)", "Salinity (PSU)", "Depth (m)"],
            rows: [
              ["2023-01-15", 25.6, 35.2, 10],
              ["2023-01-16", 24.8, 35.4, 15],
              ["2023-01-17", 23.9, 35.1, 20],
              ["2023-01-18", 24.2, 35.3, 18],
              ["2023-01-19", 25.1, 35.0, 12]
            ],
            title: "ARGO Float Data Sample"
          }
        };
        
        botResponse = { 
          sender: "bot", 
          text: "Here's the data table you requested. Click the visualization button to view it.", 
          timestamp: new Date(),
          hasVisualization: true,
          visualization: visualizationData
        };
      }
      else if (input.toLowerCase().includes("map") || input.toLowerCase().includes("location")) {
        visualizationData = {
          type: "map",
          data: {
            locations: [
              { lat: 37.7749, lng: -122.4194, name: "Float #7901", temp: 15.6, salinity: 34.5 },
              { lat: 34.0522, lng: -118.2437, name: "Float #7902", temp: 18.2, salinity: 35.1 },
              { lat: 32.7157, lng: -117.1611, name: "Float #7903", temp: 19.8, salinity: 34.8 },
              { lat: 36.7783, lng: -119.4179, name: "Float #7904", temp: 17.4, salinity: 35.3 }
            ],
            center: { lat: 36.5, lng: -119.5 },
            zoom: 6,
            title: "ARGO Float Locations in Pacific Ocean"
          }
        };
        
        botResponse = { 
          sender: "bot", 
          text: "I've created a map showing ARGO float locations. Click the visualization button to view it.", 
          timestamp: new Date(),
          hasVisualization: true,
          visualization: visualizationData
        };
      }
      else if (input.toLowerCase().includes("data") || input.toLowerCase().includes("argo")) {
        botResponse = { 
          sender: "bot", 
          text: "The ARGO float system consists of over 3,900 robotic floats that measure temperature, salinity, and other ocean properties. Would you like to see specific data from a particular region or time period?", 
          timestamp: new Date(),
          hasVisualization: false
        };
      }
      else if (input.toLowerCase().includes("hello") || input.toLowerCase().includes("hi")) {
        botResponse = { 
          sender: "bot", 
          text: "Hello! I'm here to help you explore and understand ARGO float data. What would you like to know?", 
          timestamp: new Date(),
          hasVisualization: false
        };
      }
      else {
        botResponse = { 
          sender: "bot", 
          text: "I'm processing your request. Is there specific ARGO data you're interested in exploring further?", 
          timestamp: new Date(),
          hasVisualization: false
        };
      }
      
      setMessages((prev) => [...prev, botResponse]);
      setIsLoading(false);
    }, 1000);
    
    setInput("");
  };

  const handleNewChat = () => {
    // Create a new chat session
    const newSession = {
      id: Date.now(),
      title: "New Conversation",
      active: true
    };
    
    // Update all sessions to inactive
    const updatedSessions = chatSessions.map(session => ({
      ...session,
      active: false
    }));
    
    setChatSessions([...updatedSessions, newSession]);
    setMessages([
      { 
        sender: "bot", 
        text: "Hello! I'm your ARGO data assistant. How can I help you today?", 
        timestamp: new Date(),
        hasVisualization: false
      }
    ]);
    setActiveVisualization(null);
  };

  const switchChatSession = (id) => {
    // Set all sessions to inactive except the selected one
    const updatedSessions = chatSessions.map(session => ({
      ...session,
      active: session.id === id
    }));
    
    setChatSessions(updatedSessions);
    
    // In a real app, you would load the messages for this session
    // For this example, we'll just reset to a default state
    setMessages([
      { 
        sender: "bot", 
        text: `Welcome back to "${chatSessions.find(s => s.id === id)?.title}". How can I help you?`, 
        timestamp: new Date(),
        hasVisualization: false
      }
    ]);
    setActiveVisualization(null);
  };

  const showVisualization = (visualizationData) => {
    setActiveVisualization(visualizationData);
  };

  const closeVisualization = () => {
    setActiveVisualization(null);
  };

  const suggestedQuestions = [
    "Show me temperature data from the Pacific",
    "Plot salinity variations over time",
    "Create a table with recent ARGO data",
    "Show ARGO float locations on a map"
  ];

  const handleSuggestionClick = (question) => {
    setInput(question);
    inputRef.current.focus();
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-[#424874] to-[#A6B1E1]">
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
          <h1 className="text-2xl font-bold">💬 ARGO Data Assistant</h1>
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
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>New Chat</span>
              </button>
            </div>
            
            <div className="flex-1 overflow-auto p-2">
              <h3 className="px-2 py-1 text-sm font-medium text-[#DCD6F7]">Recent Conversations</h3>
              <div className="space-y-1">
                {chatSessions.map(session => (
                  <button
                    key={session.id}
                    onClick={() => switchChatSession(session.id)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      session.active 
                        ? "bg-[#A6B1E1] text-[#F4EEFF]" 
                        : "hover:bg-[#A6B1E1] hover:text-[#F4EEFF] text-[#DCD6F7]"
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                      <span className="truncate">{session.title}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="p-4 border-t border-[#DCD6F7]">
              <button className="w-full flex items-center space-x-2 text-[#DCD6F7] hover:text-[#F4EEFF] p-2 rounded-lg transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Log out</span>
              </button>
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
                {suggestedQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(question)}
                    className="bg-[#A6B1E1] text-[#F4EEFF] text-xs px-3 py-1 rounded-full hover:bg-[#DCD6F7] hover:text-[#424874] transition-colors"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-auto rounded-lg bg-[#A6B1E1] p-4 shadow-inner">
              <div className="space-y-4">
                {messages.map((m, idx) => (
                  <div
                    key={idx}
                    className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-xs md:max-w-md lg:max-w-lg rounded-xl p-4 flex flex-col ${
                        m.sender === "user" 
                          ? "bg-[#DCD6F7] text-[#424874] rounded-br-none" 
                          : "bg-[#424874] text-[#F4EEFF] rounded-bl-none"
                      }`}
                    >
                      <div className="flex items-center space-x-2 mb-1">
                        {m.sender === "bot" && (
                          <div className="w-6 h-6 rounded-full bg-[#A6B1E1] flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-[#F4EEFF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                        <span className="text-xs opacity-70">
                          {m.sender === "user" ? "You" : "ARGO Assistant"} • {formatTime(m.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm mb-2">{m.text}</p>
                      
                      {m.hasVisualization && (
                        <button 
                          onClick={() => showVisualization(m.visualization)}
                          className="self-start flex items-center space-x-1 text-xs bg-[#A6B1E1] text-[#F4EEFF] px-2 py-1 rounded mt-1 hover:bg-opacity-80 transition"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                          <span>View Visualization</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-[#424874] text-[#F4EEFF] rounded-xl rounded-bl-none p-4 max-w-xs">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 rounded-full bg-[#A6B1E1] flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-[#F4EEFF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <span className="text-xs opacity-70">ARGO Assistant • Typing...</span>
                      </div>
                      <div className="flex space-x-1 mt-2">
                        <div className="w-2 h-2 bg-[#DCD6F7] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-[#DCD6F7] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-[#DCD6F7] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input Area */}
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
                className="bg-[#424874] text-[#F4EEFF] px-4 rounded-lg hover:bg-[#DCD6F7] hover:text-[#424874] transition-colors disabled:opacity-50 flex items-center justify-center"
              >
                {isLoading ? (
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Visualization Popup */}
      {activeVisualization && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#A6B1E1] rounded-xl w-full max-w-4xl h-5/6 flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-[#DCD6F7]">
              <h2 className="text-xl font-semibold text-[#424874]">
                {activeVisualization.data.title || "Data Visualization"}
              </h2>
              <button 
                onClick={closeVisualization}
                className="text-[#424874] hover:text-[#F4EEFF] p-1 rounded-full hover:bg-[#424874] transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 p-4 overflow-auto">
              <Canvas visualization={activeVisualization} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}