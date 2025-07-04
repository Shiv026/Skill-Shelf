import { db } from "../database/db.js";

export const newEnrollment = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const { courseId, paymentId } = req.body;

    // Check for missing data
    if (!courseId || !paymentId) {
      return res.status(400).json({ message: 'Course ID and Payment ID are required.' });
    }

    // Validate if user is already enrolled in the course
    const [user] = await db.query(
      'SELECT user_id FROM enrollments WHERE user_id = ? AND course_id = ?',
      [userId, courseId]
    );

    if (user.length > 0) {
      return res.status(409).json({ message: 'User already registered to the course.' });
    }

    // Check whether user made payment for the corresponding course
    const [paymentStatus] = await db.query(
      'SELECT status FROM payments WHERE payment_id = ? AND user_id = ? AND status = ?',
      [paymentId, userId, 'completed']
    );

    if (paymentStatus.length === 0) {
      return res.status(404).json({ message: 'No successful transaction history found for the course.' });
    }

    // Create new enrollment
    const [results] = await db.query(
      'INSERT INTO enrollments (user_id, course_id, payment_id) VALUES (?, ?, ?)',
      [userId, courseId, paymentId]
    );

    return res.status(201).json({
      message: 'User enrolled to the course successfully.',
      data: results.insertId
    });

  } catch (error) {
    console.error('Enrollment error:', error.message);
    next(error);
  }
};



export const userEnrollments = async (req, res, next) => {
  try {
    const userId = req.user.user_id;

    

    // List all course enrollments for the user
    const [results] = await db.query(
      'SELECT course_id FROM enrollments WHERE user_id = ?',
      [userId]
    );

    if (results.length === 0) {
      return res.status(200).json({ message: 'User is not enrolled in any course.' });
    }

    // Extract course IDs
    const courseIds = results.map(result => result.course_id);

    // Get course details for all enrolled courses
    const [courses] = await db.query(
      'SELECT course_id, title, description FROM courses WHERE course_id IN (?)',
      [courseIds]
    );

    // Format courses for better API response structure
    const formattedCourses = courses.map(course => ({
      courseId: course.course_id,
      title: course.title,
      description: course.description
    }));

    return res.status(200).json({
      message: 'User enrollments found.',
      data: formattedCourses
    });

  } catch (error) {
    console.error('Error fetching user enrollments:', error.message);
    next(error);
  }
};

