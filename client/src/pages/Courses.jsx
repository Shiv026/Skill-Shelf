import { useEffect, useState } from "react";
import api from "../utils/api.js";
import Loader from "../components/Loader.jsx";


const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/courses")
      .then(res => setCourses(res.data.result || []))
      .catch(() => setCourses([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="pt-20 px-4 max-w-7xl mx-auto mb-5">
      <h1 className="text-3xl text-center font-bold text-primary mb-8 font-display">All Courses</h1>

      {courses.length === 0 ? (
        <div className="text-muted text-center">No Courses Available</div>
      ) : (
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 
        lg:grid-cols-3 xl:grid-cols-4">
          {courses.map(course => (
            <div key={course.course_id} className="bg-secondary border border-border rounded-xl shadow p-5 flex flex-col max-w-sm mx-auto">
              <img
                src={course.thumbnail}
                alt={course.title}
                className=" object-cover rounded mb-4"
              />
              <h2 className="text-xl font-semibold text-primary mb-1">{course.title}</h2>
              <div className="text-muted text-sm mb-2">{course.category_name}</div>
              <div className="text-text mb-2 line-clamp-3">{course.description}</div>
              <div className="flex items-center justify-between mt-auto pt-4">
                <span className="text-lg font-bold text-primary">₹{course.price}</span>
                <span className="text-xs text-muted">Created: {new Date(course.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}


    </div>
  );
};
export default Courses;