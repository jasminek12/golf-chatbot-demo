// backend/src/routes/chatbot.js
import express from "express";
import fetch from "node-fetch";

const router = express.Router();

// Predefined list of 10 Florida golf courses with coordinates
const courses = [
  { name: "The Florida Club, Orlando", lat: 28.5383, lon: -81.3792 },
  { name: "TPC Sawgrass, Ponte Vedra Beach", lat: 30.1000, lon: -81.6540 },
  { name: "Streamsong Resort, Bowling Green", lat: 27.8628, lon: -81.3588 },
  { name: "Bay Hill Club & Lodge, Orlando", lat: 28.5010, lon: -81.4670 },
  { name: "Innisbrook Resort, Palm Harbor", lat: 28.1362, lon: -82.7195 },
  { name: "Grand Cypress Golf Club, Orlando", lat: 28.5058, lon: -81.3945 },
  { name: "World Woods Golf Club, Brooksville", lat: 28.5650, lon: -82.3790 },
  { name: "Streamsong Red Course, Bowling Green", lat: 27.8550, lon: -81.3720 },
  { name: "ChampionsGate Golf Resort, Davenport", lat: 28.1746, lon: -81.7640 },
  { name: "Ritz-Carlton Golf Club, Orlando", lat: 28.4417, lon: -81.4786 },
];

// Return list of courses
router.get("/courses", (req, res) => {
  const courseList = courses.map((c, i) => `${i + 1}. ${c.name}`);
  res.json({ courses: courseList });
});

// Return 5-day weather forecast for selected course
router.get("/weather", async (req, res) => {
  try {
    const courseNum = parseInt(req.query.course);
    if (!courseNum || courseNum < 1 || courseNum > courses.length) {
      return res.status(400).json({ error: "Invalid course number" });
    }

    const selectedCourse = courses[courseNum - 1];
    const { lat, lon } = selectedCourse;

    const OPENWEATHER_KEY = process.env.OPENWEATHER_KEY;
    if (!OPENWEATHER_KEY) {
      return res.status(500).json({ error: "OpenWeather API key missing" });
    }

    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${OPENWEATHER_KEY}`;
    const response = await fetch(url);
    const data = await response.json();

    if (!data.list) {
      console.log("Weather API failed:", data);
      return res.status(500).json({ error: "Unable to fetch weather" });
    }

    // Aggregate 5-day forecast
    const dailyForecasts = {};
    data.list.forEach((entry) => {
      const date = entry.dt_txt.split(" ")[0];
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

    res.json({
      course: selectedCourse.name,
      forecast: forecastArray,
    });
  } catch (err) {
    console.error("Weather API request failed:", err);
    res.status(500).json({ error: "Unable to fetch weather" });
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