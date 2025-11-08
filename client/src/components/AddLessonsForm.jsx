import { useState } from 'react';
import { useParams } from 'react-router-dom'; // To get the course-id from URL
import api from "../utils/api";
import LessonInput from './LessonInput';

export default function AddLessonsForm() {
  // Get the courseId from the URL (e.g., /upload-lessons/123)
  const { courseId } = useParams();

  // State to hold an array of lesson objects
  const [lessons, setLessons] = useState([
    {
      id: Date.now(), // Unique key for React
      title: '',
      description: '',
      videoFile: null,
    },
  ]);

  // Handle changes to any field in a specific lesson
  const handleLessonChange = (id, e) => {
    const { name, value, files } = e.target;
    setLessons((prevLessons) =>
      prevLessons.map((lesson) =>
        lesson.id === id
          ? { ...lesson, [name]: files ? files[0] : value }
          : lesson
      )
    );
  };

  // Add a new, empty lesson card to the form
  const handleAddLesson = () => {
    setLessons([
      ...lessons,
      {
        id: Date.now(),
        title: '',
        description: '',
        videoFile: null,
      },
    ]);
  };

  // Remove a lesson card by its ID
  const handleRemoveLesson = (id) => {
    // Prevent removing the last lesson
    if (lessons.length <= 1) return;
    setLessons((prevLessons) => prevLessons.filter((lesson) => lesson.id !== id));
  };

  // Handle the final form submission
const handleSubmit = async (e) => {
  e.preventDefault();

  const formData = new FormData();

  lessons.forEach((lesson) => {
    formData.append("title", lesson.title);
    formData.append("description", lesson.description);
    if (lesson.videoFile) {
      formData.append("videos", lesson.videoFile);
    }
  });

  try {
    const token = localStorage.getItem("token");

    const response = await api.post(
      `/lessons/${courseId}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ REQUIRED
        },
      }
    );

    console.log("LESSONS CREATED ✅", response.data);
  } catch (err) {
    console.error("Upload error ❌", err);
  }
};



  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              Upload Course Lessons
            </h2>

            {/* fetch already uploaded lessons and display*/}
            <p className="mt-2 text-sm text-gray-600">
              Add lessons to your course, each with a title and video file.
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-6">
              {lessons.map((lesson, index) => (
                <LessonInput
                  key={lesson.id}
                  lesson={lesson}
                  index={index}
                  onChange={handleLessonChange}
                  onRemove={handleRemoveLesson}
                  canRemove={lessons.length > 1}
                />
              ))}
            </div>

            <div className="flex justify-between items-center mt-8">
              <button
                type="button"
                onClick={handleAddLesson}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Add More Lessons
              </button>
              <button
                type="submit"
                className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Upload Course
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}