import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import CourseForm from "../components/CourseForm";
import api from "../utils/api";
import { toast } from "react-toastify";


const CreateCourse = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleCreateCourse = async (form) => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("category_id", form.category_id);
      formData.append("price", form.price);
      formData.append("thumbnail", form.thumbnail);

      // 1. The frontend sends the request
      const { data } = await api.post("/courses", formData, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "multipart/form-data"
        }
      });


      // 2. The backend sends back the JSON response
      //    (data = { success: true, message: "...", data: { course_id: 123, ... } })
      toast.success(data.message || "Course created successfully!");

     // 3. The frontend READS the response and navigates
      if (data.data && data.data.course_id) {
        // Use the correct path from your JSON: data.data.course_id
        navigate(`/lessons/${data.data.course_id}`);
      } else {
        // This is a fallback in case the API response is not as expected
        console.error("New course ID was not found in API response", data);
        toast.warn("Course created, but could not navigate to lessons page.");
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Failed to create course. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <CourseForm onSubmit={handleCreateCourse} loading={loading} />
    </div>
  );
};

export default CreateCourse;
