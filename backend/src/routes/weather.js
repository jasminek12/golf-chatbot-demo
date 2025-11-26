// backend/src/routes/weather.js
import express from "express";
import fetch from "node-fetch";

const router = express.Router();

// Default Florida coordinates (Orlando)
const DEFAULT_LAT = 28.5383;
const DEFAULT_LON = -81.3792;

router.get("/", async (req, res) => {
  try {
    const OPENWEATHER_KEY = process.env.OPENWEATHER_KEY;
    if (!OPENWEATHER_KEY) {
      return res.status(500).json({ error: "OpenWeather API key missing" });
    }

    const lat = req.query.lat || DEFAULT_LAT;
    const lon = req.query.lon || DEFAULT_LON;

    // Free 5-day / 3-hour forecast endpoint
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${OPENWEATHER_KEY}`;
    console.log("Weather API URL:", url);

    const response = await fetch(url);
    const data = await response.json();

    if (!data.list) {
      console.log("Weather API failed:", data);
      return res.status(500).json({ error: "Unable to fetch weather" });
    }

    // Aggregate data into daily summaries
    const dailyForecasts = {};
    data.list.forEach((entry) => {
      const date = entry.dt_txt.split(" ")[0]; // YYYY-MM-DD
      if (!dailyForecasts[date]) {
        dailyForecasts[date] = {
          date,
          temps: [],
          weatherDescriptions: [],
          windSpeeds: [],
          humidities: [],
        };
      }
      dailyForecasts[date].temps.push(entry.main.temp);
      dailyForecasts[date].weatherDescriptions.push(entry.weather[0].description);
      dailyForecasts[date].windSpeeds.push(entry.wind.speed);
      dailyForecasts[date].humidities.push(entry.main.humidity);
    });

    const forecastArray = Object.values(dailyForecasts).map((day) => ({
      date: day.date,
      temp_min: Math.min(...day.temps),
      temp_max: Math.max(...day.temps),
      weather: mostCommon(day.weatherDescriptions),
      wind_speed_avg: average(day.windSpeeds),
      humidity_avg: average(day.humidities),
    }));

    res.json(forecastArray);
  } catch (err) {
    console.error("Weather API request failed:", err);
    res.status(500).json({ error: "Weather API request failed" });
  }
});

// Helper functions
function average(arr) {
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function mostCommon(arr) {
  const counts = {};
  arr.forEach((x) => (counts[x] = (counts[x] || 0) + 1));
  return Object.keys(counts).reduce((a, b) => (counts[a] > counts[b] ? a : b));
}

export default router;
