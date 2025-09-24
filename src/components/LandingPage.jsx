import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Beams from './Beams';
import BlurText from './BlurText';
import './LandingPage.css';

const LandingPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                }
            });
        }, { threshold: 0.1 });

        const elements = document.querySelectorAll('.fade-in-element');
        elements.forEach(el => observer.observe(el));

        return () => elements.forEach(el => observer.unobserve(el));
    }, []);

    const handleGetStarted = () => {
        console.log('GET STARTED clicked - navigating to /dashboard');
        navigate('/dashboard');
    };

    const handleLearnMore = () => {
        const missionSection = document.getElementById('mission');
        if (missionSection) {
            missionSection.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }
    };

    return (
        <div className="landing-page">
            {/* Enhanced 3D Beams Background */}
            <div id="canvas-container">
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

            {/* Professional Branding */}
            <div className="brand-container">
                <img 
                    src="/Logo1.png" 
                    alt="FLOATCHAT Logo" 
                    className="brand-logo"
                />
                <div className="brand-text">FLOATCHAT</div>
            </div>

            <main>
                {/* Hero Section */}
                <section className="hero-section">
                    <div className="hero-content fade-in-element">
                        <div className="hero-badge">
                            <span className="badge-text">Ocean Intelligence Platform</span>
                        </div>
                        <h1 className="hero-title">
                            The Living Voice of Our Oceans
                        </h1>
                        <BlurText
                            text="FloatCat is a pioneering environmental intelligence platform that creates a real-time, interactive digital twin of Earth's oceans. Our global fleet of autonomous catamaran drones works with sophisticated AI to give the ocean a voice."
                            delay={80}
                            animateBy="words"
                            direction="top"
                            className="hero-description"
                        />
                        <div className="cta-buttons">
                            <button className="cta-button-primary" onClick={handleGetStarted}>GET STARTED</button>
                            <button className="cta-button-secondary" onClick={handleLearnMore}>LEARN MORE</button>
                        </div>
                    </div>
                </section>

                {/* Mission Statement */}
                <section id="mission" className="mission-section">
                    <div className="mission-content fade-in-element">
                        <BlurText
                            text="Mission: Democratizing Ocean Science"
                            delay={120}
                            animateBy="words"
                            direction="top"
                            className="mission-title"
                        />
                        <BlurText
                            text="Our oceans are vast, and traditional research methods are expensive, slow, and provide sparse data coverage. FloatCat bridges this gap with autonomous sensor platforms and conversational AI, making ocean data accessible to scientists, policymakers, and environmentalists worldwide."
                            delay={60}
                            animateBy="words"
                            direction="top"
                            className="mission-description"
                        />
                    </div>
                </section>

                {/* System Architecture */}
                <section id="architecture" className="architecture-section">
                    <div className="floating-content-right fade-in-element">
                        <BlurText
                            text="System Architecture"
                            delay={100}
                            animateBy="words"
                            direction="top"
                            className="section-title"
                        />
                        <div className="architecture-content">
                            <div className="architecture-item">
                                <BlurText
                                    text="Hardware Layer"
                                    delay={80}
                                    animateBy="words"
                                    direction="top"
                                    className="architecture-subtitle"
                                />
                                <BlurText
                                    text="The Catalyst Fleet"
                                    delay={60}
                                    animateBy="words"
                                    direction="top"
                                    className="architecture-label"
                                />
                                <BlurText
                                    text="Lightweight, durable catamaran design with solar-powered propulsion and modular scientific instruments. Satellite uplink ensures global coverage from any ocean location."
                                    delay={40}
                                    animateBy="words"
                                    direction="top"
                                    className="architecture-description"
                                />
                            </div>
                            <div className="architecture-item">
                                <BlurText
                                    text="Data Layer"
                                    delay={80}
                                    animateBy="words"
                                    direction="top"
                                    className="architecture-subtitle"
                                />
                                <BlurText
                                    text="The Pipeline"
                                    delay={60}
                                    animateBy="words"
                                    direction="top"
                                    className="architecture-label"
                                />
                                <BlurText
                                    text="Real-time data ingestion from fleet with advanced processing and calibration. Time-series database optimization enables rapid querying and geospatial metadata correlation."
                                    delay={40}
                                    animateBy="words"
                                    direction="top"
                                    className="architecture-description"
                                />
                            </div>
                            <div className="architecture-item">
                                <BlurText
                                    text="Intelligence Layer"
                                    delay={80}
                                    animateBy="words"
                                    direction="top"
                                    className="architecture-subtitle"
                                />
                                <BlurText
                                    text="The FloatCat AI"
                                    delay={60}
                                    animateBy="words"
                                    direction="top"
                                    className="architecture-label"
                                />
                                <BlurText
                                    text="Natural language processing interface with anomaly detection algorithms and predictive analytics engine. Conversational data insights make complex oceanographic data accessible."
                                    delay={40}
                                    animateBy="words"
                                    direction="top"
                                    className="architecture-description"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Oceanographic Parameters */}
                <section id="parameters" className="parameters-section">
                    <div className="floating-content-left fade-in-element">
                        <BlurText
                            text="Oceanographic Data Parameters"
                            delay={100}
                            animateBy="words"
                            direction="top"
                            className="section-title"
                        />
                        <div className="parameters-content">
                            <div className="parameter-item">
                                <BlurText
                                    text="Temperature"
                                    delay={80}
                                    animateBy="words"
                                    direction="top"
                                    className="parameter-title"
                                />
                                <BlurText
                                    text="Sea surface and depth profile measurements driving climate patterns, ocean currents, and marine life distribution."
                                    delay={60}
                                    animateBy="words"
                                    direction="top"
                                    className="parameter-description"
                                />
                                <div className="ai-example">
                                    <BlurText
                                        text="AI Insight: I've detected a persistent marine heatwave in grid A4 with temperatures 3.2°C above the 5-year average. This poses a high risk of coral bleaching."
                                        delay={40}
                                        animateBy="words"
                                        direction="top"
                                        className="ai-insight"
                                    />
                                </div>
                            </div>
                            <div className="parameter-item">
                                <BlurText
                                    text="Salinity"
                                    delay={80}
                                    animateBy="words"
                                    direction="top"
                                    className="parameter-title"
                                />
                                <BlurText
                                    text="Dissolved salt concentration measurements crucial for ocean circulation patterns and marine habitat definition."
                                    delay={60}
                                    animateBy="words"
                                    direction="top"
                                    className="parameter-description"
                                />
                                <div className="ai-example">
                                    <BlurText
                                        text="AI Insight: Alert: A significant low-salinity plume is extending from the Amazon River outflow, 20% farther than typical for this season."
                                        delay={40}
                                        animateBy="words"
                                        direction="top"
                                        className="ai-insight"
                                    />
                                </div>
                            </div>
                            <div className="parameter-item">
                                <BlurText
                                    text="Dissolved Oxygen"
                                    delay={80}
                                    animateBy="words"
                                    direction="top"
                                    className="parameter-title"
                                />
                                <BlurText
                                    text="Essential for marine life respiration, monitoring for hypoxic dead zones that threaten biodiversity."
                                    delay={60}
                                    animateBy="words"
                                    direction="top"
                                    className="parameter-description"
                                />
                                <div className="ai-example">
                                    <BlurText
                                        text="AI Insight: Vessel C-07 reports rapidly decreasing DO levels below 2 mg/L at 50m depth. Dispatching nearby vessels to map this hypoxic event."
                                        delay={40}
                                        animateBy="words"
                                        direction="top"
                                        className="ai-insight"
                                    />
                                </div>
                            </div>
                            <div className="parameter-item">
                                <BlurText
                                    text="pH Level"
                                    delay={80}
                                    animateBy="words"
                                    direction="top"
                                    className="parameter-title"
                                />
                                <BlurText
                                    text="Acidity measurements tracking ocean acidification from CO₂ absorption, threatening shell-forming organisms."
                                    delay={60}
                                    animateBy="words"
                                    direction="top"
                                    className="parameter-description"
                                />
                                <div className="ai-example">
                                    <BlurText
                                        text="AI Insight: Average pH across the fleet has dropped by 0.02 over 12 months, consistent with global ocean acidification trends."
                                        delay={40}
                                        animateBy="words"
                                        direction="top"
                                        className="ai-insight"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* AI Interface Examples */}
                <section id="interface" className="interface-section">
                    <div className="floating-content-right fade-in-element">
                        <BlurText
                            text="Interacting with FloatCat AI"
                            delay={100}
                            animateBy="words"
                            direction="top"
                            className="section-title"
                        />
                        <div className="interface-content">
                            <div className="interface-category">
                                <BlurText
                                    text="Direct Data Queries"
                                    delay={80}
                                    animateBy="words"
                                    direction="top"
                                    className="interface-subtitle"
                                />
                                <div className="query-list">
                                    <BlurText
                                        text="What is the current sea surface temperature at vessel C-12's location?"
                                        delay={60}
                                        animateBy="words"
                                        direction="top"
                                        className="query-item"
                                    />
                                    <BlurText
                                        text="Show me a chart of salinity vs. depth for the last 24 hours in the Mediterranean fleet."
                                        delay={60}
                                        animateBy="words"
                                        direction="top"
                                        className="query-item"
                                    />
                                    <BlurText
                                        text="Compare current dissolved oxygen levels in the Gulf of Mexico to this time last year."
                                        delay={60}
                                        animateBy="words"
                                        direction="top"
                                        className="query-item"
                                    />
                                </div>
                            </div>
                            <div className="interface-category">
                                <BlurText
                                    text="Proactive Monitoring"
                                    delay={80}
                                    animateBy="words"
                                    direction="top"
                                    className="interface-subtitle"
                                />
                                <div className="query-list">
                                    <BlurText
                                        text="Notify me if any vessel reports a pH level below 7.9."
                                        delay={60}
                                        animateBy="words"
                                        direction="top"
                                        className="query-item"
                                    />
                                    <BlurText
                                        text="Track the boundary of the low-salinity zone near the Mississippi Delta and update me every 6 hours."
                                        delay={60}
                                        animateBy="words"
                                        direction="top"
                                        className="query-item"
                                    />
                                </div>
                            </div>
                            <div className="interface-category">
                                <BlurText
                                    text="Insight Generation"
                                    delay={80}
                                    animateBy="words"
                                    direction="top"
                                    className="interface-subtitle"
                                />
                                <div className="query-list">
                                    <BlurText
                                        text="Are there correlations between recent temperature anomalies and chlorophyll levels in the Pacific fleet?"
                                        delay={60}
                                        animateBy="words"
                                        direction="top"
                                        className="query-item"
                                    />
                                    <BlurText
                                        text="Generate a summary report of all significant environmental events detected this week."
                                        delay={60}
                                        animateBy="words"
                                        direction="top"
                                        className="query-item"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Impact Section */}
                <section id="impact" className="impact-section">
                    <div className="impact-content fade-in-element">
                        <BlurText
                            text="Empowering Planetary Stewardship"
                            delay={100}
                            animateBy="words"
                            direction="top"
                            className="impact-title"
                        />
                        <BlurText
                            text="FloatCat transforms how we understand and protect our oceans. By making real-time, high-resolution ocean data accessible through natural conversation, we're empowering a new generation of environmental scientists and policymakers to make informed decisions about our planet's most vital ecosystem."
                            delay={60}
                            animateBy="words"
                            direction="top"
                            className="impact-description"
                        />
                        <div className="impact-stats">
                            <div className="stat-item">
                                <BlurText
                                    text="24/7"
                                    delay={80}
                                    animateBy="words"
                                    direction="top"
                                    className="stat-number"
                                />
                                <BlurText
                                    text="Continuous Monitoring"
                                    delay={60}
                                    animateBy="words"
                                    direction="top"
                                    className="stat-label"
                                />
                            </div>
                            <div className="stat-item">
                                <BlurText
                                    text="Global"
                                    delay={80}
                                    animateBy="words"
                                    direction="top"
                                    className="stat-number"
                                />
                                <BlurText
                                    text="Fleet Coverage"
                                    delay={60}
                                    animateBy="words"
                                    direction="top"
                                    className="stat-label"
                                />
                            </div>
                            <div className="stat-item">
                                <BlurText
                                    text="Real-time"
                                    delay={80}
                                    animateBy="words"
                                    direction="top"
                                    className="stat-number"
                                />
                                <BlurText
                                    text="Data Processing"
                                    delay={60}
                                    animateBy="words"
                                    direction="top"
                                    className="stat-label"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Final CTA Section */}
                <section className="final-cta-section">
                    <div className="final-cta-content fade-in-element">
                        <BlurText
                            text="Join the Ocean Intelligence Revolution"
                            delay={100}
                            animateBy="words"
                            direction="top"
                            className="final-cta-title"
                        />
                        <BlurText
                            text="Be part of the future where ocean data is accessible, actionable, and conversational. FloatCat is giving our oceans a voice — and we need your help to amplify it."
                            delay={60}
                            animateBy="words"
                            direction="top"
                            className="final-cta-description"
                        />
                        <div className="button-group">
                            <button className="cta-button-outline" onClick={handleLearnMore}>LEARN MORE</button>
                            <button className="cta-button" onClick={handleGetStarted}>LAUNCH FLOATCAT {'>'}</button>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="footer">
                <div className="footer-links">
                    <button className="footer-link">Research Papers</button>
                    <button className="footer-link">API Documentation</button>
                    <button className="footer-link">Contact</button>
                </div>
                <div className="footer-legal">
                    <span>© 2025 FLOATCAT</span>
                    <button className="footer-link">PRIVACY POLICY</button>
                    <button className="footer-link">TERMS OF SERVICE</button>
                </div>
                <div className="footer-credit">
                    Made with float for our oceans
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
