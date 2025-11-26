// Load environment variables first
import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve('./backend/.env') });  // MUST be first, before anything else that uses process.env

// Import other modules
import express from "express";
import cors from "cors";

// Import routes AFTER dotenv
import coursesRouter from "./routes/courses.js";
import weatherRouter from "./routes/weather.js";
import reviewsRouter from "./routes/reviews.js";
import chatbotRouter from "./routes/chatbot.js";

// Initialize app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/courses", coursesRouter);
app.use("/api/reviews", reviewsRouter);
app.use("/api/weather", weatherRouter);
app.use("/api/chatbot", chatbotRouter);
// Future: app.use("/api/book", bookingRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log("OpenWeather API key loaded:", process.env.OPENWEATHER_KEY);
});