import { db } from "../database/db.js";

export const createCourse = async (req, res, next) => {
  try {
    const { title, description, category_id, price } = req.body;
    const created_by = req.user.user_id;

    if (!title || !description || !category_id || !req.file) {
      return res.status(400).json({ message: "All fields are required including thumbnail" });
    }

    // check if course already exists
    const [prevCourse] = await db.query(
      "SELECT course_id FROM courses WHERE title = ? AND created_by = ?",
      [title, created_by]
    );

    if (prevCourse.length > 0) {
      return res.status(409).json({ message: "Course already exists" });
    }

    // check if category exists
    const [rows] = await db.query(
      "SELECT category_id FROM categories WHERE category_id = ?",
      [category_id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Category not found" });
    }

    console.log("Uploading file to Cloudinary...");
    // Cloudinary gives you a `secure_url`
    const thumbnailUrl = req.file.path;
    console.log("File uploaded, path:", thumbnailUrl);
    // handle default price safely
    const coursePrice = parseFloat(price) || 0.0;

    // insert new course
    const [insertResult] = await db.query(
      "INSERT INTO courses (title, description, thumbnail, price, category_id, created_by) VALUES (?, ?, ?, ?, ?, ?)",
      [title, description, thumbnailUrl, coursePrice, category_id, created_by]
    );

    // fetch inserted course details
    const newCourseId = insertResult.insertId;
    const [courseRows] = await db.query(
      `SELECT c.course_id, c.title, c.description, c.price, 
              cat.category_name, c.created_by, c.created_at, c.thumbnail
       FROM courses c 
       JOIN categories cat ON c.category_id = cat.category_id 
       WHERE c.course_id = ?`,
      [newCourseId]
    );

    return res.status(201).json({
      success: true,
      message: "Course created successfully",
      data: courseRows[0],
    });
  } catch (error) {
    next(error);
  }
};

export const viewCourse = async (req, res, next) => {
  try {
    const id = req.params.id;

    const [result] = await db.query(
      `
      SELECT c.course_id, c.title, c.description, c.price, c.created_by, c.created_at, cat.category_id, cat.category_name     
      FROM courses c JOIN 
      categories cat ON c.category_id = cat.category_id
      where c.course_id = ?`,
      [id]
    );

    if (result.length === 0)
      return res.status(404).json({ message: "Course Not Found" });

    return res
      .status(200)
      .json({ message: "Course found successfully", data: result[0] });
  } catch (error) {
    next(error);
  }
};
export const viewAllCourse = async (req, res, next) => {
  try {
    const [result] = await db.query(`
      SELECT c.course_id, c.title, c.description, c.thumbnail, c.price, c.created_by, c.created_at, cat.category_id, cat.category_name     
      FROM courses c JOIN 
      categories cat ON c.category_id = cat.category_id
    `);

    if (result.length === 0)
      return res.status(200).json({ message: "No Courses Available" });

    return res
      .status(200)
      .json({ message: "Course found successfully", result });
  } catch (error) {
    next(error);
  }
};
export const editCourse = async (req, res, next) => {
  try {
    const courseId = req.params.id;
    const userId = req.user.user_id;
    const { title, description, category_id, price } = req.body;

    // 1) Fetch existing course to check existence, owner & current values
    const [courseRows] = await db.query(
      `SELECT title, description, price, category_id, created_by
       FROM courses
       WHERE course_id = ?`,
      [courseId]
    );
    if (courseRows.length === 0) {
      return res.status(404).json({ message: "Course not found" });
    }
    const course = courseRows[0];

    // 2) Permission: only admin or the creator may edit
    const [userRoles] = await db.query(
      `SELECT r.role_name
       FROM roles r
       JOIN user_roles ur ON ur.role_id = r.role_id
       WHERE ur.user_id = ?`,
      [userId]
    );
    const isAdmin = userRoles.some((r) => r.role_name === "admin");
    if (course.created_by !== userId && !isAdmin) {
      return res.status(403).json({ message: "Access denied" });
    }

    // 3) Build dynamic SET clause for only the fields provided
    const fields = [];
    const values = [];

    if (title && title !== course.title) {
      // Optional: Prevent duplicate title by same creator
      const [dup] = await db.query(
        `SELECT course_id
         FROM courses
         WHERE title = ? AND created_by = ? AND course_id <> ?`,
        [title, userId, courseId]
      );
      if (dup.length) {
        return res
          .status(409)
          .json({ message: "You already have a course with that title." });
      }
      fields.push("title = ?");
      values.push(title);
    }

    if (description && description !== course.description) {
      fields.push("description = ?");
      values.push(description);
    }

    if (price !== undefined && price !== course.price) {
      fields.push("price = ?");
      values.push(price);
    }

    if (category_id && category_id !== course.category_id) {
      // Verify new category exists
      const [catRows] = await db.query(
        `SELECT category_id FROM categories WHERE category_id = ?`,
        [category_id]
      );
      if (catRows.length === 0) {
        return res.status(400).json({ message: "Category not found" });
      }
      fields.push("category_id = ?");
      values.push(category_id);
    }

    // 4) If no updatable field was provided, bail out
    if (fields.length === 0) {
      return res.status(400).json({ message: "No valid fields to update." });
    }

    // 5) Perform the update
    values.push(courseId);
    const [updateResult] = await db.query(
      `UPDATE courses
       SET ${fields.join(", ")}
       WHERE course_id = ?`,
      values
    );

    // 6) Fetch the fresh row
    const [updatedRows] = await db.query(
      `SELECT
         c.course_id,
         c.title,
         c.description,
         c.price,
         c.created_by,
         c.created_at,
         cat.category_id,
         cat.category_name
       FROM courses c
       JOIN categories cat ON c.category_id = cat.category_id
       WHERE c.course_id = ?`,
      [courseId]
    );

    return res.status(200).json({
      success: true,
      message: "Course updated successfully",
      data: updatedRows[0],
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCourse = async (req, res, next) => {
  try {
    const courseId = req.params.id;
    const userId = req.user.user_id;

    //check whether that course exists or not
    const [courseRows] = await db.query(
      `
      SELECT created_by
      FROM courses 
      where course_id = ?`,
      [courseId]
    );
    if (courseRows.length === 0)
      return res.status(404).json({ message: "Course not found" });

    const creator = courseRows[0].created_by;

    const [userRoles] = await db.query(
      `SELECT r.role_name 
      FROM roles r 
      JOIN user_roles ur ON ur.role_id = r.role_id 
      where ur.user_id = ?`,
      [userId]
    );

    const userRoleNames = userRoles.map((role) => role.role_name);
    const isAdmin = userRoleNames.includes("admin");

    //verify only creator or admin should delete
    if (userId !== creator && !isAdmin)
      return res.status(403).json({ message: "Access denied" });

    //Delete the course
    const [deleteResult] = await db.query(
      `DELETE FROM courses where course_id = ?`,
      [courseId]
    );

    return res.status(200).json({ message: "Course Deleted Successfully" });
  } catch (error) {
    next(error);
  }
};

export const getCourseEnrollments = async (req, res, next) => {
  try {
    const courseId = req.params.id;
    const userId = req.user.user_id;

    // Check if the course exists or not
    const [results] = await db.query(
      'SELECT title FROM courses WHERE course_id = ?',
      [courseId]
    );

    if (results.length === 0) {
      return res.status(404).json({ message: 'Course Not Found' });
    }

    /* Validate the user:
       1. User should be admin
       2. Or user should be the creator of the course
    */
    const [courseCreatorRows] = await db.query(
      'SELECT created_by FROM courses WHERE course_id = ?',
      [courseId]
    );

    const isCreator = courseCreatorRows[0].created_by === userId;

    // Check the roles assigned to the user
    const [roleRows] = await db.query(
      'SELECT r.role_name FROM roles r JOIN user_roles ur ON ur.role_id = r.role_id WHERE ur.user_id = ?',
      [userId]
    );

    const userRoles = roleRows.map(role => role.role_name);
    const isAdmin = userRoles.includes('admin');

    if (!isAdmin && !isCreator) {
      return res.status(403).json({ message: 'Unauthorized Access' });
    }
    // Get enrolled students
    const [enrollments] = await db.query(
      'SELECT u.user_id, u.name, u.email FROM enrollments e JOIN users u ON e.user_id = u.user_id WHERE e.course_id = ?',
      [courseId]
    );

    const formattedEnrollments = enrollments.map(student => ({
      userId: student.user_id,
      name: student.name,
      email: student.email
    }));

    return res.status(200).json({
      message: 'Fetched Enrollments Successfully',
      data: formattedEnrollments
    });

  } catch (error) {
    next(error);
  }
};