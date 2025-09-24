// Ocean Data Mock Data for Analytics
export const oceanParameters = {
  temperature: {
    unit: "°C",
    range: { min: 15, max: 35 },
    normal: { min: 22, max: 28 },
    data: generateTimeSeriesData(20, 25, 3, 1000), // 20 data points, base 25°C, variation 3°C
    trends: {
      daily: generateTrendData(24, 0.5), // 24 hours of data
      weekly: generateTrendData(7, 2), // 7 days of data
      monthly: generateTrendData(30, 5) // 30 days of data
    }
  },
  salinity: {
    unit: "PSU",
    range: { min: 30, max: 40 },
    normal: { min: 34, max: 36 },
    data: generateTimeSeriesData(35, 35, 1.5, 1000),
    trends: {
      daily: generateTrendData(24, 0.3),
      weekly: generateTrendData(7, 1),
      monthly: generateTrendData(30, 2)
    }
  },
  oxygen: {
    unit: "mg/L",
    range: { min: 4, max: 12 },
    normal: { min: 6, max: 9 },
    data: generateTimeSeriesData(8, 8, 1, 1000),
    trends: {
      daily: generateTrendData(24, 0.5),
      weekly: generateTrendData(7, 1.5),
      monthly: generateTrendData(30, 3)
    }
  },
  ph: {
    unit: "pH",
    range: { min: 7.5, max: 8.5 },
    normal: { min: 7.8, max: 8.2 },
    data: generateTimeSeriesData(8, 8, 0.3, 1000),
    trends: {
      daily: generateTrendData(24, 0.1),
      weekly: generateTrendData(7, 0.3),
      monthly: generateTrendData(30, 0.5)
    }
  },
  turbidity: {
    unit: "NTU",
    range: { min: 0, max: 50 },
    normal: { min: 1, max: 10 },
    data: generateTimeSeriesData(5, 5, 2, 1000),
    trends: {
      daily: generateTrendData(24, 1),
      weekly: generateTrendData(7, 3),
      monthly: generateTrendData(30, 8)
    }
  },
  nutrients: {
    nitrate: {
      unit: "mg/L",
      range: { min: 0, max: 2 },
      normal: { min: 0.1, max: 0.5 },
      data: generateTimeSeriesData(0.3, 0.3, 0.1, 1000)
    },
    phosphate: {
      unit: "mg/L",
      range: { min: 0, max: 0.5 },
      normal: { min: 0.01, max: 0.1 },
      data: generateTimeSeriesData(0.05, 0.05, 0.02, 1000)
    },
    silicate: {
      unit: "mg/L",
      range: { min: 0, max: 5 },
      normal: { min: 0.5, max: 2 },
      data: generateTimeSeriesData(1.5, 1.5, 0.5, 1000)
    }
  }
};

// Generate time series data with realistic ocean patterns
function generateTimeSeriesData(baseValue, mean, variation, interval) {
  const data = [];
  const now = Date.now();
  
  for (let i = 0; i < 20; i++) {
    const time = now - (19 - i) * interval;
    const randomVariation = (Math.random() - 0.5) * variation;
    const seasonalVariation = Math.sin((time / (24 * 60 * 60 * 1000)) * Math.PI * 2) * 0.5;
    const value = baseValue + randomVariation + seasonalVariation;
    data.push({
      timestamp: time,
      value: Math.max(0, value),
      quality: Math.random() > 0.1 ? 'good' : 'poor'
    });
  }
  return data;
}

// Generate trend data for different time periods
function generateTrendData(points, variation) {
  const data = [];
  const now = Date.now();
  const interval = 24 * 60 * 60 * 1000 / points; // Daily data
  
  for (let i = 0; i < points; i++) {
    const time = now - (points - 1 - i) * interval;
    const trend = Math.sin((time / (24 * 60 * 60 * 1000)) * Math.PI * 2) * variation;
    data.push({
      timestamp: time,
      value: trend,
      confidence: Math.random() * 0.3 + 0.7
    });
  }
  return data;
}

// Ocean zones data
export const oceanZones = {
  surface: {
    depth: "0-10m",
    temperature: { min: 20, max: 30, current: 25.2 },
    salinity: { min: 33, max: 37, current: 35.1 },
    oxygen: { min: 6, max: 10, current: 8.3 },
    ph: { min: 7.8, max: 8.2, current: 8.0 }
  },
  thermocline: {
    depth: "10-50m",
    temperature: { min: 15, max: 25, current: 18.5 },
    salinity: { min: 34, max: 36, current: 35.3 },
    oxygen: { min: 5, max: 8, current: 6.8 },
    ph: { min: 7.7, max: 8.1, current: 7.9 }
  },
  deep: {
    depth: "50-200m",
    temperature: { min: 10, max: 20, current: 12.3 },
    salinity: { min: 34.5, max: 36.5, current: 35.8 },
    oxygen: { min: 4, max: 7, current: 5.2 },
    ph: { min: 7.6, max: 8.0, current: 7.8 }
  }
};

// Weather and environmental data
export const environmentalData = {
  weather: {
    windSpeed: { value: 12.5, unit: "m/s", direction: "NE" },
    waveHeight: { value: 2.3, unit: "m" },
    airTemperature: { value: 28.5, unit: "°C" },
    humidity: { value: 75, unit: "%" },
    pressure: { value: 1013.2, unit: "hPa" }
  },
  currents: {
    surface: { speed: 0.8, direction: "NW", unit: "m/s" },
    deep: { speed: 0.3, direction: "SE", unit: "m/s" }
  },
  tides: {
    high: { time: "06:30", height: 2.1 },
    low: { time: "12:45", height: 0.8 },
    next: { time: "18:20", height: 1.9 }
  }
};

// Marine life data
export const marineLifeData = {
  phytoplankton: {
    density: { value: 45000, unit: "cells/mL" },
    diversity: { value: 12, unit: "species" },
    chlorophyll: { value: 2.3, unit: "μg/L" }
  },
  zooplankton: {
    density: { value: 1200, unit: "individuals/m³" },
    biomass: { value: 0.8, unit: "mg/m³" }
  },
  fish: {
    abundance: { value: 85, unit: "%" },
    diversity: { value: 23, unit: "species" },
    size: { average: 15.2, unit: "cm" }
  }
};

// Pollution and quality indicators
export const pollutionData = {
  microplastics: {
    concentration: { value: 0.8, unit: "particles/L" },
    trend: "increasing",
    impact: "moderate"
  },
  heavyMetals: {
    lead: { value: 0.02, unit: "mg/L", limit: 0.05 },
    mercury: { value: 0.001, unit: "mg/L", limit: 0.002 },
    cadmium: { value: 0.005, unit: "mg/L", limit: 0.01 }
  },
  oilSpills: {
    detected: false,
    lastIncident: "2023-08-15",
    riskLevel: "low"
  }
};

// Historical data for trends
export const historicalData = {
  temperature: {
    lastYear: generateHistoricalData(365, 25, 5),
    lastMonth: generateHistoricalData(30, 25, 3),
    lastWeek: generateHistoricalData(7, 25, 2)
  },
  salinity: {
    lastYear: generateHistoricalData(365, 35, 2),
    lastMonth: generateHistoricalData(30, 35, 1),
    lastWeek: generateHistoricalData(7, 35, 0.5)
  },
  oxygen: {
    lastYear: generateHistoricalData(365, 8, 2),
    lastMonth: generateHistoricalData(30, 8, 1),
    lastWeek: generateHistoricalData(7, 8, 0.5)
  }
};

function generateHistoricalData(days, baseValue, variation) {
  const data = [];
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;
  
  for (let i = 0; i < days; i++) {
    const date = now - (days - 1 - i) * dayMs;
    const seasonalVariation = Math.sin((date / (365 * dayMs)) * Math.PI * 2) * variation;
    const randomVariation = (Math.random() - 0.5) * variation * 0.5;
    const value = baseValue + seasonalVariation + randomVariation;
    
    data.push({
      date: new Date(date).toISOString().split('T')[0],
      value: Math.max(0, value),
      quality: Math.random() > 0.05 ? 'good' : 'poor'
    });
  }
  return data;
}

// Export all data
export default {
  oceanParameters,
  oceanZones,
  environmentalData,
  marineLifeData,
  pollutionData,
  historicalData
};
