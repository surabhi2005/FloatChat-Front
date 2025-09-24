// Enhanced Ocean Data with Bar Graphs, Tables, and Pascal Values
export const oceanPressureData = {
  surface: {
    pressure: { value: 101325, unit: "Pa", description: "Atmospheric pressure at sea level" },
    depth: { value: 0, unit: "m" },
    temperature: { value: 25.2, unit: "°C" },
    salinity: { value: 35.1, unit: "PSU" }
  },
  shallow: {
    pressure: { value: 202650, unit: "Pa", description: "Pressure at 10m depth" },
    depth: { value: 10, unit: "m" },
    temperature: { value: 22.8, unit: "°C" },
    salinity: { value: 35.3, unit: "PSU" }
  },
  medium: {
    pressure: { value: 506625, unit: "Pa", description: "Pressure at 50m depth" },
    depth: { value: 50, unit: "m" },
    temperature: { value: 18.5, unit: "°C" },
    salinity: { value: 35.8, unit: "PSU" }
  },
  deep: {
    pressure: { value: 1013250, unit: "Pa", description: "Pressure at 100m depth" },
    depth: { value: 100, unit: "m" },
    temperature: { value: 12.3, unit: "°C" },
    salinity: { value: 36.2, unit: "PSU" }
  },
  abyssal: {
    pressure: { value: 2026500, unit: "Pa", description: "Pressure at 200m depth" },
    depth: { value: 200, unit: "m" },
    temperature: { value: 8.7, unit: "°C" },
    salinity: { value: 36.5, unit: "PSU" }
  }
};

export const oceanNutrientsData = {
  nitrate: {
    surface: { value: 0.2, unit: "mg/L", status: "normal" },
    shallow: { value: 0.5, unit: "mg/L", status: "elevated" },
    medium: { value: 0.8, unit: "mg/L", status: "high" },
    deep: { value: 1.2, unit: "mg/L", status: "very high" }
  },
  phosphate: {
    surface: { value: 0.02, unit: "mg/L", status: "normal" },
    shallow: { value: 0.05, unit: "mg/L", status: "elevated" },
    medium: { value: 0.08, unit: "mg/L", status: "high" },
    deep: { value: 0.12, unit: "mg/L", status: "very high" }
  },
  silicate: {
    surface: { value: 0.8, unit: "mg/L", status: "normal" },
    shallow: { value: 1.2, unit: "mg/L", status: "elevated" },
    medium: { value: 1.8, unit: "mg/L", status: "high" },
    deep: { value: 2.5, unit: "mg/L", status: "very high" }
  }
};

export const oceanCurrentsData = {
  surface: {
    speed: { value: 0.8, unit: "m/s", direction: "NW" },
    temperature: { value: 25.2, unit: "°C" },
    salinity: { value: 35.1, unit: "PSU" }
  },
  thermocline: {
    speed: { value: 0.3, unit: "m/s", direction: "SE" },
    temperature: { value: 18.5, unit: "°C" },
    salinity: { value: 35.8, unit: "PSU" }
  },
  deep: {
    speed: { value: 0.1, unit: "m/s", direction: "SW" },
    temperature: { value: 12.3, unit: "°C" },
    salinity: { value: 36.2, unit: "PSU" }
  }
};

export const marineLifeData = {
  phytoplankton: {
    density: { value: 45000, unit: "cells/mL", trend: "increasing" },
    biomass: { value: 2.3, unit: "mg/m³", trend: "stable" },
    diversity: { value: 12, unit: "species", trend: "increasing" }
  },
  zooplankton: {
    density: { value: 1200, unit: "individuals/m³", trend: "stable" },
    biomass: { value: 0.8, unit: "mg/m³", trend: "decreasing" },
    diversity: { value: 8, unit: "species", trend: "stable" }
  },
  fish: {
    abundance: { value: 85, unit: "%", trend: "stable" },
    diversity: { value: 23, unit: "species", trend: "increasing" },
    averageSize: { value: 15.2, unit: "cm", trend: "decreasing" }
  }
};

export const waterQualityData = {
  turbidity: {
    surface: { value: 2.3, unit: "NTU", status: "good" },
    shallow: { value: 4.1, unit: "NTU", status: "moderate" },
    medium: { value: 6.8, unit: "NTU", status: "poor" },
    deep: { value: 8.2, unit: "NTU", status: "very poor" }
  },
  dissolvedOxygen: {
    surface: { value: 8.3, unit: "mg/L", status: "excellent" },
    shallow: { value: 6.8, unit: "mg/L", status: "good" },
    medium: { value: 5.2, unit: "mg/L", status: "moderate" },
    deep: { value: 3.8, unit: "mg/L", status: "poor" }
  },
  pH: {
    surface: { value: 8.0, unit: "pH", status: "good" },
    shallow: { value: 7.9, unit: "pH", status: "good" },
    medium: { value: 7.8, unit: "pH", status: "moderate" },
    deep: { value: 7.7, unit: "pH", status: "moderate" }
  }
};

export const historicalTrendsData = {
  temperature: {
    last24Hours: generateHistoricalData(24, 25, 2, 'hours'),
    last7Days: generateHistoricalData(7, 25, 3, 'days'),
    last30Days: generateHistoricalData(30, 25, 5, 'days'),
    lastYear: generateHistoricalData(365, 25, 8, 'days')
  },
  salinity: {
    last24Hours: generateHistoricalData(24, 35, 1, 'hours'),
    last7Days: generateHistoricalData(7, 35, 2, 'days'),
    last30Days: generateHistoricalData(30, 35, 3, 'days'),
    lastYear: generateHistoricalData(365, 35, 5, 'days')
  },
  pressure: {
    last24Hours: generateHistoricalData(24, 101325, 1000, 'hours'),
    last7Days: generateHistoricalData(7, 101325, 2000, 'days'),
    last30Days: generateHistoricalData(30, 101325, 5000, 'days'),
    lastYear: generateHistoricalData(365, 101325, 10000, 'days')
  }
};

function generateHistoricalData(points, baseValue, variation, unit) {
  const data = [];
  const now = Date.now();
  const interval = unit === 'hours' ? 60 * 60 * 1000 : 24 * 60 * 60 * 1000;
  
  for (let i = 0; i < points; i++) {
    const time = now - (points - 1 - i) * interval;
    const randomVariation = (Math.random() - 0.5) * variation;
    const seasonalVariation = Math.sin((time / (365 * 24 * 60 * 60 * 1000)) * Math.PI * 2) * variation * 0.3;
    const value = baseValue + randomVariation + seasonalVariation;
    
    data.push({
      timestamp: time,
      value: Math.max(0, value),
      quality: Math.random() > 0.05 ? 'good' : 'poor'
    });
  }
  return data;
}

export const oceanZonesTable = [
  { zone: 'Surface', depth: '0-10m', pressure: '101-202 kPa', temperature: '25.2°C', salinity: '35.1 PSU', oxygen: '8.3 mg/L' },
  { zone: 'Shallow', depth: '10-50m', pressure: '202-506 kPa', temperature: '22.8°C', salinity: '35.3 PSU', oxygen: '6.8 mg/L' },
  { zone: 'Thermocline', depth: '50-100m', pressure: '506-1013 kPa', temperature: '18.5°C', salinity: '35.8 PSU', oxygen: '5.2 mg/L' },
  { zone: 'Deep', depth: '100-200m', pressure: '1013-2026 kPa', temperature: '12.3°C', salinity: '36.2 PSU', oxygen: '3.8 mg/L' },
  { zone: 'Abyssal', depth: '200-500m', pressure: '2026-5066 kPa', temperature: '8.7°C', salinity: '36.5 PSU', oxygen: '2.1 mg/L' }
];

export const nutrientConcentrationTable = [
  { nutrient: 'Nitrate', surface: '0.2 mg/L', shallow: '0.5 mg/L', medium: '0.8 mg/L', deep: '1.2 mg/L', status: 'High' },
  { nutrient: 'Phosphate', surface: '0.02 mg/L', shallow: '0.05 mg/L', medium: '0.08 mg/L', deep: '0.12 mg/L', status: 'Normal' },
  { nutrient: 'Silicate', surface: '0.8 mg/L', shallow: '1.2 mg/L', medium: '1.8 mg/L', deep: '2.5 mg/L', status: 'High' },
  { nutrient: 'Ammonium', surface: '0.01 mg/L', shallow: '0.03 mg/L', medium: '0.05 mg/L', deep: '0.08 mg/L', status: 'Low' },
  { nutrient: 'Urea', surface: '0.05 mg/L', shallow: '0.08 mg/L', medium: '0.12 mg/L', deep: '0.15 mg/L', status: 'Normal' }
];

export const marineLifeTable = [
  { organism: 'Phytoplankton', density: '45,000 cells/mL', biomass: '2.3 mg/m³', diversity: '12 species', trend: 'Increasing' },
  { organism: 'Zooplankton', density: '1,200 ind/m³', biomass: '0.8 mg/m³', diversity: '8 species', trend: 'Stable' },
  { organism: 'Copepods', density: '800 ind/m³', biomass: '0.5 mg/m³', diversity: '6 species', trend: 'Decreasing' },
  { organism: 'Fish Larvae', density: '50 ind/m³', biomass: '0.1 mg/m³', diversity: '15 species', trend: 'Increasing' },
  { organism: 'Jellyfish', density: '20 ind/m³', biomass: '0.3 mg/m³', diversity: '4 species', trend: 'Stable' }
];

export default {
  oceanPressureData,
  oceanNutrientsData,
  oceanCurrentsData,
  marineLifeData,
  waterQualityData,
  historicalTrendsData,
  oceanZonesTable,
  nutrientConcentrationTable,
  marineLifeTable
};
