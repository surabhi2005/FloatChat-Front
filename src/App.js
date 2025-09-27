import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./global-theme.css"; // Import global theme
import "./theme-override.css"; // Import theme overrides for existing pages
import Layout from "./components/Layout";
import LandingPage from "./components/LandingPage";
import Dashboard from "./components/Dashboard";
import ChatPage from "./components/ChatPage";
import PolygonPage from "./components/PolygonPage";
import InterDash from "./components/InventoryDash";
import GlobeView from "./components/GlobeView";
import MapView from "./components/MapView";
import MapDetView from "./components/MapDetView";
import Analytics from "./components/Analytics";
import BackgroundBeam from "./components/BeamsBackground";
import FloatTrajectories from "./components/FloatTrajectory";

export default function App() {
  return (
    <>
    <BackgroundBeam/>
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Layout currentPage="dashboard"><Dashboard /></Layout>} />
        <Route path="/chat" element={<Layout currentPage="chat"><ChatPage /></Layout>} />
        <Route path="/polygon" element={<Layout currentPage="polygon"><PolygonPage /></Layout>}/>
        <Route path="/interact" element={<Layout currentPage="interact"><InterDash /></Layout>}/>
        <Route path="/globe" element={<Layout currentPage="globe"><GlobeView /></Layout>}/>
        <Route path="/map-view" element={<Layout currentPage="mapview"><MapView /></Layout>}/>
        <Route path="/map-detailed" element={<Layout currentPage="analytics"><MapDetView /></Layout>}/>
        <Route path="/analytics" element={<Layout currentPage="analytics"><Analytics /></Layout>}/>
        <Route path="/float-trajectory" element={<Layout currentPage="float-trajectory"><FloatTrajectories /></Layout>}/>

      </Routes>
    </Router>
    </>
  );
}
