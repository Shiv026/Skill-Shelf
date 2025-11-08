// components/InstructorDashboard.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

const InstructorDashboard = ({ userToken }) => {
  const navigate = useNavigate();
  const [instructorCourses, setInstructorCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api
      .get("/dashboard/instructor", { headers: { Authorization: `Bearer ${userToken}` } })
      .then((res) => {
        setInstructorCourses(res.data.result || []);
      })
      .finally(() => setLoading(false));
  }, [userToken]);

  const totalRevenue = instructorCourses.reduce(
    (sum, c) => sum + Number(c.revenue || 0),
    0
  );
  const totalStudents = instructorCourses.reduce(
    (sum, c) => sum + Number(c.total_students || 0),
    0
  );

  if (loading) {
    return <div className="text-center py-10 text-muted">Loading...</div>;
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        <div className="bg-secondary border border-border rounded-xl shadow p-6 flex flex-col items-center">
          <span className="text-muted mb-2">Total Revenue Generated</span>
          <span className="text-2xl font-bold text-primary font-display">
            ₹{totalRevenue}
          </span>
        </div>
        <div className="bg-secondary border border-border rounded-xl shadow p-6 flex flex-col items-center">
          <span className="text-muted mb-2">Total Students Enrolled</span>
          <span className="text-2xl font-bold text-primary font-display">
            {totalStudents}
          </span>
        </div>
      </div>
      <div className="flex justify-end mb-6">
        <button
          className="bg-primary text-white font-semibold px-6 py-2 rounded-lg shadow hover:bg-accent transition"
          onClick={() => navigate("/create-course")}
        >
          + Create New Course
        </button>
      </div>
      <h2 className="text-xl font-semibold text-primary mb-4">Your Courses</h2>
      {instructorCourses.length === 0 ? (
        <div className="text-muted text-center">You have not created any courses yet.</div>
      ) : (
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {instructorCourses.map((course) => (
            <div
              key={course.course_id}
              className="bg-secondary border border-border rounded-xl shadow p-5 flex flex-col"
            >
              <h3 className="text-lg font-bold text-primary mb-1">{course.title}</h3>
              <div className="text-muted text-sm mb-2">
                Created: {new Date(course.created_at).toLocaleDateString()}
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-base font-bold text-primary">
                  ₹{course.price}
                </span>
                <span className="text-xs text-muted">
                  Students: {course.total_students}
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between gap-2">
                <span className="text-muted text-xs">Revenue:</span>
                <span className="text-primary font-bold text-base">
                  ₹{course.revenue}
                </span>
                <button
                  onClick={() => navigate(`/lessons/${course.course_id}`)}
                  className="bg-white text-teal-700 font-semibold py-2 px-4 border border-gray-300 rounded-lg shadow-sm transition-colors duration-150 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 hover:cursor-pointer"
                >
                  Add <span className="text-muted">More</span> Lessons
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InstructorDashboard; 