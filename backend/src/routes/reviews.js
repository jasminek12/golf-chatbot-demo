// backend/src/routes/reviews.js
import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// File to store reviews
const reviewsFile = path.join(__dirname, "../../data/reviews.json");

// Helper to read reviews
const readReviews = () => {
  if (!fs.existsSync(reviewsFile)) return [];
  const data = fs.readFileSync(reviewsFile);
  return JSON.parse(data);
};

// Helper to save reviews
const saveReviews = (reviews) => {
  fs.writeFileSync(reviewsFile, JSON.stringify(reviews, null, 2));
};

// POST /api/reviews - add a review
router.post("/", (req, res) => {
  const { course_id, course_name, rating, review } = req.body;

  if (!course_id || !course_name || !rating || !review) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const reviews = readReviews();

  reviews.push({
    course_id,
    course_name,
    rating,
    review,
  });

  saveReviews(reviews);

  res.json({ message: "Review saved successfully" });
});

// GET /api/reviews/:courseId - get reviews for a course
router.get("/:courseId", (req, res) => {
  const courseId = parseInt(req.params.courseId);
  const reviews = readReviews();

  const courseReviews = reviews.filter((r) => r.course_id === courseId);
  res.json(courseReviews);
});

export default router;