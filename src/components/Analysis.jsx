import React, { useState, useEffect } from 'react';
import { Line, Bar, Doughnut, Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Analysis = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [activeMetric, setActiveMetric] = useState('temperature');
  const [stats, setStats] = useState({
    totalFloats: 42,
    activeFloats: 38,
    dataPoints: '1.2M',
    coverage: '65%'
  });

  // Sample data for charts
  const [chartData, setChartData] = useState({
    temperature: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [
        {
          label: 'Surface Temperature (°C)',
          data: [18, 19, 21, 23, 25, 27],
          borderColor: '#F4EEFF',
          backgroundColor: 'rgba(244, 238, 255, 0.2)',
          tension: 0.4,
          fill: true
        },
        {
          label: 'Deep Water Temperature (°C)',
          data: [4, 4.2, 4.5, 4.8, 5.1, 5.3],
          borderColor: '#A6B1E1',
          backgroundColor: 'rgba(166, 177, 225, 0.2)',
          tension: 0.4,
          fill: true
        }
      ]
    },
    salinity: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [
        {
          label: 'Salinity (PSU)',
          data: [35.2, 35.3, 35.1, 34.9, 34.8, 34.7],
          borderColor: '#DCD6F7',
          backgroundColor: 'rgba(220, 214, 247, 0.2)',
          tension: 0.4,
          fill: true
        }
      ]
    },
    oxygen: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [
        {
          label: 'Oxygen (ml/l)',
          data: [5.8, 5.7, 5.9, 6.1, 6.2, 6.0],
          borderColor: '#A6B1E1',
          backgroundColor: 'rgba(166, 177, 225, 0.2)',
          tension: 0.4,
          fill: true
        }
      ]
    }
  });

  const regionData = {
    labels: ['Pacific', 'Atlantic', 'Indian', 'Southern', 'Arctic'],
    datasets: [
      {
        label: 'Floats Deployed',
        data: [18, 12, 7, 3, 2],
        backgroundColor: [
          '#424874',
          '#A6B1E1',
          '#DCD6F7',
          '#F4EEFF',
          '#7B88C7'
        ]
      }
    ]
  };

  const depthProfileData = {
    labels: ['0-200m', '200-500m', '500-1000m', '1000-2000m', '2000m+'],
    datasets: [
      {
        label: 'Data Collection',
        data: [45, 25, 15, 10, 5],
        backgroundColor: [
          '#424874',
          '#A6B1E1',
          '#DCD6F7',
          '#F4EEFF',
          '#7B88C7'
        ],
        borderWidth: 0
      }
    ]
  };

  const radarData = {
    labels: ['Temperature', 'Salinity', 'Oxygen', 'Chlorophyll', 'Pressure', 'pH'],
    datasets: [
      {
        label: 'Data Quality Score',
        data: [95, 88, 92, 85, 96, 80],
        backgroundColor: 'rgba(166, 177, 225, 0.2)',
        borderColor: '#A6B1E1',
        pointBackgroundColor: '#F4EEFF',
        pointBorderColor: '#424874',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#424874'
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: '#F4EEFF'
        }
      },
      title: {
        display: true,
        color: '#F4EEFF'
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(220, 214, 247, 0.1)'
        },
        ticks: {
          color: '#DCD6F7'
        }
      },
      y: {
        grid: {
          color: 'rgba(220, 214, 247, 0.1)'
        },
        ticks: {
          color: '#DCD6F7'
        }
      }
    }
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#F4EEFF',
          padding: 20
        }
      }
    }
  };

  const radarOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: '#F4EEFF'
        }
      }
    },
    scales: {
      r: {
        angleLines: {
          color: 'rgba(220, 214, 247, 0.2)'
        },
        grid: {
          color: 'rgba(220, 214, 247, 0.2)'
        },
        pointLabels: {
          color: '#F4EEFF'
        },
        ticks: {
          backdropColor: 'transparent',
          color: '#DCD6F7'
        }
      }
    }
  };

  // Simulate data loading
  useEffect(() => {
    // This would typically be an API call in a real application
    const timer = setTimeout(() => {
      // Update stats based on selected time range and region
      const updatedStats = {
        totalFloats: 42 + Math.floor(Math.random() * 10),
        activeFloats: 38 + Math.floor(Math.random() * 8),
        dataPoints: `${1.2 + Math.random() * 0.3}M`,
        coverage: `${65 + Math.floor(Math.random() * 10)}%`
      };
      setStats(updatedStats);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeRange, selectedRegion]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#424874] to-[#2A2F4F] text-[#F4EEFF] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Advanced Data Analysis</h1>
          <p className="text-[#DCD6F7]">Comprehensive insights from ARGO float network</p>
        </header>

        {/* Controls */}
        <div className="bg-[#A6B1E1] p-4 rounded-lg mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-[#424874] text-sm font-medium mb-2">Time Range</label>
            <select 
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="w-full bg-[#DCD6F7] text-[#424874] px-3 py-2 rounded-lg border border-[#424874] focus:ring-2 focus:ring-[#F4EEFF]"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
          </div>
          
          <div>
            <label className="block text-[#424874] text-sm font-medium mb-2">Ocean Region</label>
            <select 
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full bg-[#DCD6F7] text-[#424874] px-3 py-2 rounded-lg border border-[#424874] focus:ring-2 focus:ring-[#F4EEFF]"
            >
              <option value="all">All Regions</option>
              <option value="pacific">Pacific Ocean</option>
              <option value="atlantic">Atlantic Ocean</option>
              <option value="indian">Indian Ocean</option>
              <option value="southern">Southern Ocean</option>
              <option value="arctic">Arctic Ocean</option>
            </select>
          </div>
          
          <div>
            <label className="block text-[#424874] text-sm font-medium mb-2">Primary Metric</label>
            <div className="flex space-x-2">
              {['temperature', 'salinity', 'oxygen'].map(metric => (
                <button
                  key={metric}
                  onClick={() => setActiveMetric(metric)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeMetric === metric
                      ? 'bg-[#424874] text-[#F4EEFF]'
                      : 'bg-[#DCD6F7] text-[#424874] hover:bg-[#F4EEFF]'
                  }`}
                >
                  {metric.charAt(0).toUpperCase() + metric.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Floats', value: stats.totalFloats, icon: '🌊', change: '+3' },
            { label: 'Active Floats', value: stats.activeFloats, icon: '📡', change: '+2' },
            { label: 'Data Points', value: stats.dataPoints, icon: '📊', change: '+142K' },
            { label: 'Coverage', value: stats.coverage, icon: '🗺️', change: '+5%' }
          ].map((stat, index) => (
            <div key={index} className="bg-[#A6B1E1] p-4 rounded-lg text-center transform hover:scale-105 transition-transform">
              <div className="text-2xl mb-2">{stat.icon}</div>
              <div className="text-[#424874] text-sm font-medium">{stat.label}</div>
              <div className="text-2xl font-bold text-[#424874]">{stat.value}</div>
              <div className="text-xs bg-[#424874] text-[#F4EEFF] px-2 py-1 rounded-full inline-block mt-2">
                {stat.change}
              </div>
            </div>
          ))}
        </div>

        {/* Main Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Primary Chart */}
          <div className="lg:col-span-2 bg-[#A6B1E1] p-6 rounded-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-[#424874]">
                {activeMetric.charAt(0).toUpperCase() + activeMetric.slice(1)} Trends
              </h2>
              <div className="flex space-x-2">
                <button className="text-xs bg-[#DCD6F7] text-[#424874] px-3 py-1 rounded-lg hover:bg-[#F4EEFF] transition">
                  Export Data
                </button>
                <button className="text-xs bg-[#DCD6F7] text-[#424874] px-3 py-1 rounded-lg hover:bg-[#F4EEFF] transition">
                  Compare
                </button>
              </div>
            </div>
            <div className="h-80">
              <Line data={chartData[activeMetric]} options={chartOptions} />
            </div>
          </div>

          {/* Regional Distribution */}
          <div className="bg-[#A6B1E1] p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-[#424874] mb-6">Regional Distribution</h2>
            <div className="h-64">
              <Doughnut data={regionData} options={doughnutOptions} />
            </div>
          </div>

          {/* Depth Profile */}
          <div className="bg-[#A6B1E1] p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-[#424874] mb-6">Depth Profile Analysis</h2>
            <div className="h-64">
              <Bar data={depthProfileData} options={chartOptions} />
            </div>
          </div>
        </div>

        {/* Bottom Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Data Quality Radar */}
          <div className="lg:col-span-2 bg-[#A6B1E1] p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-[#424874] mb-6">Data Quality Assessment</h2>
            <div className="h-64">
              <Radar data={radarData} options={radarOptions} />
            </div>
          </div>

          {/* Anomaly Detection */}
          <div className="bg-[#A6B1E1] p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-[#424874] mb-6">Anomaly Detection</h2>
            <div className="text-center py-8">
              <div className="text-4xl mb-2">🎯</div>
              <div className="text-[#424874] font-bold text-2xl mb-2">98.3%</div>
              <div className="text-[#424874] text-sm">Accuracy in anomaly detection</div>
              <div className="mt-4 bg-[#424874] text-[#F4EEFF] px-3 py-1 rounded-full text-xs inline-block">
                +2.1% from last month
              </div>
            </div>
          </div>
        </div>

        {/* Insights Section */}
        <div className="bg-[#A6B1E1] p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-[#424874] mb-6">Key Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#DCD6F7] p-4 rounded-lg">
              <div className="flex items-start mb-3">
                <div className="text-[#424874] text-lg mr-3">📈</div>
                <div>
                  <h3 className="font-semibold text-[#424874]">Temperature Rise</h3>
                  <p className="text-[#424874] text-sm">Surface temperatures increased by 0.8°C compared to last year</p>
                </div>
              </div>
            </div>
            
            <div className="bg-[#DCD6F7] p-4 rounded-lg">
              <div className="flex items-start mb-3">
                <div className="text-[#424874] text-lg mr-3">🔍</div>
                <div>
                  <h3 className="font-semibold text-[#424874]">New Patterns</h3>
                  <p className="text-[#424874] text-sm">Unusual salinity patterns detected in North Atlantic region</p>
                </div>
              </div>
            </div>
            
            <div className="bg-[#DCD6F7] p-4 rounded-lg">
              <div className="flex items-start mb-3">
                <div className="text-[#424874] text-lg mr-3">⚡</div>
                <div>
                  <h3 className="font-semibold text-[#424874]">Data Quality</h3>
                  <p className="text-[#424874] text-sm">98.7% of sensors reporting optimal data quality this month</p>
                </div>
              </div>
            </div>
            
            <div className="bg-[#DCD6F7] p-4 rounded-lg">
              <div className="flex items-start mb-3">
                <div className="text-[#424874] text-lg mr-3">🌡️</div>
                <div>
                  <h3 className="font-semibold text-[#424874]">Deep Water Changes</h3>
                  <p className="text-[#424874] text-sm">Deep water temperatures stable with minimal fluctuations</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analysis;