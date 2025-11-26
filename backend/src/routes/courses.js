// routes/courses.js
import express from "express";
import fetch from "node-fetch";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const apiKey = process.env.GOLF_API_KEY;

    // List of search queries to increase Florida course coverage
    const searchQueries = ["Florida", "Miami", "Orlando", "Tampa", "Jacksonville"];
    let allCourses = [];

    for (const q of searchQueries) {
      const response = await fetch(
        `https://api.golfcourseapi.com/v1/search?search_query=${q}`,
        {
          headers: {
            "Authorization": `Key ${apiKey}`,
          },
        }
      );

      if (!response.ok) {
        const text = await response.text();
        return res
          .status(response.status)
          .json({ error: `API Error for query "${q}": ${text}` });
      }

      const data = await response.json();

      if (data.courses && data.courses.length > 0) {
        // Filter courses actually in Florida
        const flCourses = data.courses.filter(c => c.location.state === "FL");
        allCourses = [...allCourses, ...flCourses];
      }
    }

    // Remove duplicates by course id
    const uniqueCourses = Array.from(
      new Map(allCourses.map(c => [c.id, c])).values()
    );

    // Take only first 10 courses
    const courses = uniqueCourses.slice(0, 10).map(c => ({
      id: c.id,
      club_name: c.club_name,
      course_name: c.course_name,
      city: c.location.city,
      state: c.location.state,
    }));

    res.json(courses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;