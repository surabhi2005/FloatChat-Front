import React from "react";
import BeamsBackground from "./BeamsBackground";

export default function ChatPage() {
  return (
    <div className="w-full h-full flex flex-col relative">
      {/* Background effect stays */}
      <BeamsBackground />

      {/* Streamlit iframe container */}
      <div className="flex-1 w-full relative z-10">
        <iframe
          src="http://localhost:8501/"
          title="Streamlit RAG App"
          className="w-full h-full border-0 rounded-lg shadow-lg"
          allow="clipboard-read; clipboard-write"
        />
      </div>
    </div>
  );
}
