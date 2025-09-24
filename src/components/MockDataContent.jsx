import React, { useState, useEffect } from 'react';
import { MessageCircle, Mail, Zap, CheckCircle, Wifi, HardDrive } from 'lucide-react';
import AnimatedContent from './AnimatedContent';
import './MockDataContent.css';

const MockDataContent = () => {
  const [oceanMetrics, setOceanMetrics] = useState({
    temperature: 22.5,
    salinity: 35.2,
    oxygen: 8.5,
    ph: 8.1,
    turbidity: 2.3,
    depth: 150
  });

  const [recentData, setRecentData] = useState([]);

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setOceanMetrics(prev => ({
        temperature: prev.temperature + (Math.random() - 0.5) * 0.5,
        salinity: prev.salinity + (Math.random() - 0.5) * 0.2,
        oxygen: prev.oxygen + (Math.random() - 0.5) * 0.1,
        ph: prev.ph + (Math.random() - 0.5) * 0.05,
        turbidity: prev.turbidity + (Math.random() - 0.5) * 0.1,
        depth: prev.depth + (Math.random() - 0.5) * 2
      }));

      // Add new data point to recent data
      const newDataPoint = {
        id: Date.now(),
        timestamp: new Date().toLocaleTimeString(),
        temperature: oceanMetrics.temperature + (Math.random() - 0.5) * 0.5,
        salinity: oceanMetrics.salinity + (Math.random() - 0.5) * 0.2,
        oxygen: oceanMetrics.oxygen + (Math.random() - 0.5) * 0.1
      };

      setRecentData(prev => [newDataPoint, ...prev.slice(0, 9)]);
    }, 3000);

    return () => clearInterval(interval);
  }, [oceanMetrics]);

  const metricCards = [
    {
      title: 'Active Chat Sessions',
      value: `${Math.floor(oceanMetrics.temperature * 2)}`,
      unit: 'Concurrent users',
      color: '#00c8ff',
      icon: MessageCircle,
      trend: '+12'
    },
    {
      title: 'Message Throughput',
      value: `${Math.floor(oceanMetrics.salinity * 100)}/min`,
      unit: 'Messages per minute',
      color: '#44ff44',
      icon: Mail,
      trend: '+8.5%'
    },
    {
      title: 'Data Processing Rate',
      value: `${Math.floor(oceanMetrics.oxygen * 1000)}/s`,
      unit: 'Data points per second',
      color: '#4444ff',
      icon: Zap,
      trend: '+15.2%'
    },
    {
      title: 'System Uptime',
      value: `${(oceanMetrics.ph * 10).toFixed(1)}%`,
      unit: 'Availability',
      color: '#ffaa44',
      icon: CheckCircle,
      trend: '+0.1%'
    },
    {
      title: 'Network Latency',
      value: `${oceanMetrics.turbidity.toFixed(1)}ms`,
      unit: 'Milliseconds',
      color: '#ff44aa',
      icon: Wifi,
      trend: '-2.3ms'
    },
    {
      title: 'Storage Usage',
      value: `${oceanMetrics.depth.toFixed(0)}GB`,
      unit: 'Gigabytes',
      color: '#44aaff',
      icon: HardDrive,
      trend: '+1.2GB'
    }
  ];

  return (
    <div className="mock-data-container">
      <AnimatedContent
        distance={100}
        direction="vertical"
        duration={1.0}
        ease="power2.out"
        initialOpacity={0}
        delay={0.3}
      >
        <div className="data-header">
          <h2>FloatChat Data Analytics</h2>
          <div className="last-updated">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </AnimatedContent>

      <div className="metrics-grid">
        {metricCards.map((metric, index) => (
          <AnimatedContent
            key={metric.title}
            distance={120}
            direction="horizontal"
            reverse={index % 2 === 0}
            duration={0.8}
            ease="back.out(1.7)"
            initialOpacity={0}
            delay={0.5 + (index * 0.1)}
            scale={0.9}
          >
            <div className="metric-card" style={{ borderLeftColor: metric.color }}>
              <div className="metric-header">
                <div className="metric-icon">
                  <metric.icon size={24} />
                </div>
                <div className="metric-trend" style={{ color: metric.color }}>
                  {metric.trend}
                </div>
              </div>
              <div className="metric-content">
                <h3>{metric.title}</h3>
                <div className="metric-value" style={{ color: metric.color }}>
                  {metric.value}
                </div>
                <div className="metric-unit">{metric.unit}</div>
              </div>
            </div>
          </AnimatedContent>
        ))}
      </div>

      <AnimatedContent
        distance={100}
        direction="vertical"
        duration={1.0}
        ease="power2.out"
        initialOpacity={0}
        delay={1.2}
      >
        <div className="recent-data-section">
          <h3>Recent Data Points</h3>
          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Chat Sessions</th>
                  <th>Messages</th>
                  <th>Data Points</th>
                </tr>
              </thead>
              <tbody>
                {recentData.map((dataPoint) => (
                  <tr key={dataPoint.id}>
                    <td>{dataPoint.timestamp}</td>
                    <td style={{ color: '#00c8ff' }}>
                      {Math.floor(dataPoint.temperature * 2)}
                    </td>
                    <td style={{ color: '#44ff44' }}>
                      {Math.floor(dataPoint.salinity * 100)}
                    </td>
                    <td style={{ color: '#4444ff' }}>
                      {Math.floor(dataPoint.oxygen * 1000)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </AnimatedContent>

      <AnimatedContent
        distance={100}
        direction="vertical"
        duration={1.0}
        ease="power2.out"
        initialOpacity={0}
        delay={1.4}
      >
        <div className="ocean-status-section">
          <h3>FloatChat System Status</h3>
          <div className="status-cards">
            <div className="status-card healthy">
              <div className="status-icon">✅</div>
              <div className="status-content">
                <h4>Chat Service</h4>
                <p>Operational</p>
              </div>
            </div>
            <div className="status-card healthy">
              <div className="status-icon">✅</div>
              <div className="status-content">
                <h4>Data Pipeline</h4>
                <p>Running</p>
              </div>
            </div>
            <div className="status-card warning">
              <div className="status-icon">⚠️</div>
              <div className="status-content">
                <h4>Server Load</h4>
                <p>High</p>
              </div>
            </div>
            <div className="status-card healthy">
              <div className="status-icon">✅</div>
              <div className="status-content">
                <h4>Database</h4>
                <p>Connected</p>
              </div>
            </div>
          </div>
        </div>
      </AnimatedContent>
    </div>
  );
};

export default MockDataContent;
