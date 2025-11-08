import cloudinary from "../config/cloudinary.js";
import { db } from "../database/db.js";

// Create a new lesson after video upload
export const createLessons = async (req, res) => {
  try {
    const { courseId } = req.body;
    const [course] = await db.execute("SELECT created_by from courses where course_id = ?", [courseId]);

    if (!course.length) {
      return res.status(404).json({ message: "Course not found" });
    }
    if (req.user.user_id !== course[0].created_by) {
      return res.status(403).json({ message: "Unauthorized: Not your course" });
    }

    const titles = Array.isArray(req.body.title) ? req.body.title : [req.body.title];
    const descriptions = Array.isArray(req.body.description) ? req.body.description : [req.body.description];

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "At least one video is required" });
    }

    for (let i = 0; i < req.files.length; i++) {
      const file = req.files[i];
      const videoUrl = file.path;
      const publicId = file.filename;

      const [result] = await db.execute(
        `INSERT INTO lessons (course_id, title, description, video_url, public_id)
         VALUES (?, ?, ?, ?, ?)`,
        [courseId, titles[i], descriptions[i], videoUrl, publicId]
      );
    }

    res.status(201).json({
      message: "Lessons created successfully"
    });

  } catch (error) {
    console.log("Error creating lessons: ", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};


// Get all lessons for a specific course
export const getLessonsByCourse = async (req, res) => {
  const { courseId } = req.params;

  try {
    const [rows] = await db.query(
      "SELECT lesson_id, title FROM lessons WHERE course_id = ? ORDER BY created_at ASC",
      [courseId]
    );

    res.json(rows);
  } catch (err) {
    console.error("DB Fetch Error:", err);
    res.status(500).json({ message: "Database fetch failed" });
  }
};

// Get details about a particular lesson
export const getLessonByLessonId = async (req, res) => {
  const { lessonId } = req.params;
  if (!lessonId) {
    return res.status(400).json({ message: "Click A Valid Lesson" });
  }
  try {
    const [result] = await db.query(
      "SELECT description, video_url, created_at from lessons where lesson_id = ?", [lessonId]
    );
    if (result.length === 0) {
      return res.status(404).json({ message: "Lesson not found" });
    }
    res.status(200).json({ message: "Success", result });
  } catch (err) {
    console.error("DB Fetch Error:", err);
    res.status(500).json({ message: "Database fetch failed" });
  }
}