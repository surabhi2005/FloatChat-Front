import React from 'react';
import { useNavigate } from 'react-router-dom';
import BeamsBackground from './BeamsBackground';
import './GlobalDarkTheme.css';

const PageLayout = ({ 
    children, 
    showBranding = true,
    showNavigation = true,
    beamSettings = {}
}) => {
    const navigate = useNavigate();

    const handleLogoClick = () => {
        navigate('/');
    };

    return (
        <div className="page-container">
            {/* Beams Background */}
            <BeamsBackground {...beamSettings} />
            
            {/* Professional Branding */}
            {showBranding && (
                <div className="brand-container" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
                    <img 
                        src="/Logo1.png" 
                        alt="FLOATCHAT Logo" 
                        className="brand-logo"
                    />
                    <div className="brand-text">FLOATCHAT</div>
                </div>
            )}

            {/* Navigation */}
            {showNavigation && (
                <nav className="nav-container">
                    <div className="nav-content">
                        <div className="nav-logo" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
                            <img 
                                src="/Logo1.png" 
                                alt="FLOATCHAT Logo" 
                                style={{ height: '30px', width: 'auto' }}
                            />
                            FLOATCHAT
                        </div>
                        <ul className="nav-links">
                            <li><a href="/" className="nav-link">Home</a></li>
                            <li><a href="/dashboard" className="nav-link">Dashboard</a></li>
                            <li><a href="/interact" className="nav-link">Interactive</a></li>
                            <li><a href="/analytics" className="nav-link">Analytics</a></li>
                        </ul>
                    </div>
                </nav>
            )}

            {/* Main Content */}
            <main className="main-content">
                {children}
            </main>
        </div>
    );
};

export default PageLayout;
