import React, { useRef, useEffect, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import AnimatedContent from './AnimatedContent';
import './LiveGraphs.css';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const LiveGraphs = () => {
  const temperatureRef = useRef(null);
  const salinityRef = useRef(null);
  const oxygenRef = useRef(null);
  const [temperatureData, setTemperatureData] = useState([]);
  const [salinityData, setSalinityData] = useState([]);
  const [oxygenData, setOxygenData] = useState([]);

  // Generate mock data
  const generateData = (baseValue, variation, color) => {
    const data = [];
    const labels = [];
    const now = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 60000); // Every minute
      labels.push(time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
      data.push(baseValue + (Math.random() - 0.5) * variation);
    }
    
    return { data, labels };
  };

  useEffect(() => {
    // Initialize data
    const tempData = generateData(22.5, 2, '#ff4444');
    const salData = generateData(35.2, 1, '#44ff44');
    const oxyData = generateData(8.5, 0.5, '#4444ff');
    
    setTemperatureData(tempData);
    setSalinityData(salData);
    setOxygenData(oxyData);

    // Update data every 2 seconds
    const interval = setInterval(() => {
      const tempData = generateData(22.5, 2, '#ff4444');
      const salData = generateData(35.2, 1, '#44ff44');
      const oxyData = generateData(8.5, 0.5, '#4444ff');
      
      setTemperatureData(tempData);
      setSalinityData(salData);
      setOxygenData(oxyData);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!temperatureRef.current || !salinityRef.current || !oxygenRef.current) return;

    // Temperature Chart
    const tempChart = new ChartJS(temperatureRef.current, {
      type: 'line',
      data: {
        labels: temperatureData.labels,
        datasets: [{
          label: 'Temperature (°C)',
          data: temperatureData.data,
          borderColor: '#ff4444',
          backgroundColor: 'rgba(255, 68, 68, 0.1)',
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#ff4444',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          x: {
            grid: {
              color: 'rgba(255, 255, 255, 0.1)',
              drawBorder: false
            },
            ticks: {
              color: '#fff',
              font: {
                size: 10
              }
            }
          },
          y: {
            grid: {
              color: 'rgba(255, 255, 255, 0.1)',
              drawBorder: false
            },
            ticks: {
              color: '#fff',
              font: {
                size: 10
              }
            }
          }
        },
        animation: {
          duration: 1000,
          easing: 'easeInOutQuart'
        }
      }
    });

    // Salinity Chart
    const salChart = new ChartJS(salinityRef.current, {
      type: 'bar',
      data: {
        labels: salinityData.labels,
        datasets: [{
          label: 'Salinity (ppt)',
          data: salinityData.data,
          backgroundColor: 'rgba(68, 255, 68, 0.8)',
          borderColor: '#44ff44',
          borderWidth: 2,
          borderRadius: 4,
          borderSkipped: false
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          x: {
            grid: {
              color: 'rgba(255, 255, 255, 0.1)',
              drawBorder: false
            },
            ticks: {
              color: '#fff',
              font: {
                size: 10
              }
            }
          },
          y: {
            grid: {
              color: 'rgba(255, 255, 255, 0.1)',
              drawBorder: false
            },
            ticks: {
              color: '#fff',
              font: {
                size: 10
              }
            }
          }
        },
        animation: {
          duration: 1000,
          easing: 'easeInOutQuart'
        }
      }
    });

    // Oxygen Chart
    const oxyChart = new ChartJS(oxygenRef.current, {
      type: 'line',
      data: {
        labels: oxygenData.labels,
        datasets: [{
          label: 'Oxygen (mg/L)',
          data: oxygenData.data,
          borderColor: '#4444ff',
          backgroundColor: 'rgba(68, 68, 255, 0.1)',
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#4444ff',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          x: {
            grid: {
              color: 'rgba(255, 255, 255, 0.1)',
              drawBorder: false
            },
            ticks: {
              color: '#fff',
              font: {
                size: 10
              }
            }
          },
          y: {
            grid: {
              color: 'rgba(255, 255, 255, 0.1)',
              drawBorder: false
            },
            ticks: {
              color: '#fff',
              font: {
                size: 10
              }
            }
          }
        },
        animation: {
          duration: 1000,
          easing: 'easeInOutQuart'
        }
      }
    });

    return () => {
      tempChart.destroy();
      salChart.destroy();
      oxyChart.destroy();
    };
  }, [temperatureData, salinityData, oxygenData]);

  return (
    <div className="live-graphs-container">
      <AnimatedContent
        distance={100}
        direction="vertical"
        duration={1.0}
        ease="power2.out"
        initialOpacity={0}
        delay={0.2}
      >
        <div className="graphs-header">
          <h2>FloatChat Live Data Stream</h2>
          <div className="live-indicator">
            <div className="pulse-dot"></div>
            <span>LIVE</span>
          </div>
        </div>
      </AnimatedContent>

      <div className="graphs-grid">
        <AnimatedContent
          distance={150}
          direction="horizontal"
          reverse={true}
          duration={0.8}
          ease="back.out(1.7)"
          initialOpacity={0}
          delay={0.4}
          scale={0.9}
        >
          <div className="graph-card temperature-card">
            <div className="graph-header">
              <h3>Temperature</h3>
              <div className="current-value">22.5°C</div>
            </div>
            <div className="graph-container">
              <canvas ref={temperatureRef}></canvas>
            </div>
          </div>
        </AnimatedContent>

        <AnimatedContent
          distance={150}
          direction="horizontal"
          reverse={false}
          duration={0.8}
          ease="back.out(1.7)"
          initialOpacity={0}
          delay={0.6}
          scale={0.9}
        >
          <div className="graph-card salinity-card">
            <div className="graph-header">
              <h3>Salinity</h3>
              <div className="current-value">35.2 ppt</div>
            </div>
            <div className="graph-container">
              <canvas ref={salinityRef}></canvas>
            </div>
          </div>
        </AnimatedContent>

        <AnimatedContent
          distance={150}
          direction="horizontal"
          reverse={true}
          duration={0.8}
          ease="back.out(1.7)"
          initialOpacity={0}
          delay={0.8}
          scale={0.9}
        >
          <div className="graph-card oxygen-card">
            <div className="graph-header">
              <h3>Oxygen</h3>
              <div className="current-value">8.5 mg/L</div>
            </div>
            <div className="graph-container">
              <canvas ref={oxygenRef}></canvas>
            </div>
          </div>
        </AnimatedContent>
      </div>
    </div>
  );
};

export default LiveGraphs;
