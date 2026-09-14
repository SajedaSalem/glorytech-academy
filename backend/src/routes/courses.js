const express = require("express");
const courses = require("../data/courses");

const router = express.Router();

// GET /api/courses
router.get("/", (req, res) => {
  let results = courses;

  const { vendor, category, level, search } = req.query;

  if (vendor) {
    results = results.filter(
      course => course.vendor.toLowerCase() === vendor.toLowerCase()
    );
  }

  if (category) {
    results = results.filter(
      course => course.category.toLowerCase() === category.toLowerCase()
    );
  }

  if (level) {
    results = results.filter(
      course => course.level.toLowerCase() === level.toLowerCase()
    );
  }

  if (search) {
    const searchTerm = search.toLowerCase();

    results = results.filter(course =>
      course.title.toLowerCase().includes(searchTerm) ||
      course.vendor.toLowerCase().includes(searchTerm) ||
      course.examCode.toLowerCase().includes(searchTerm)
    );
  }

  res.json({
    count: results.length,
    courses: results
  });
});

// GET /api/courses/:id
router.get("/:id", (req, res) => {
  const courseId = Number(req.params.id);

  const course = courses.find(course => course.id === courseId);

  if (!course) {
    return res.status(404).json({
      error: "Course not found"
    });
  }

  res.json(course);
});

module.exports = router;