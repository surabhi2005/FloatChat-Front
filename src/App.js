import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DashboardPage from "./components/DashboardPage";
import ChatPage from "./components/ChatPage";
import PolygonPage from "./components/PolygonPage";
import InterDash from "./components/InventoryDash";
import GlobeView from "./components/GlobeView";
import MapView from "./components/MapView";
import MapDetView from "./components/MapDetView";
import Analysis from "./components/Analysis";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/polygon" element={<PolygonPage/>}/>
        <Route path="/interact" element={<InterDash/>}/>
        <Route path="/globe" element={<GlobeView/>}/>
        <Route path="/map-view" element={<MapDetView/>}/>
        <Route path="/analytics" element={<Analysis/>}/>
      </Routes>
    </Router>
  );
}
