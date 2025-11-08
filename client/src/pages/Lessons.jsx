import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../utils/api.js";
import Loader from '../components/Loader';

const Lessons = () => {
  const { courseId } = useParams();
  const [loading, setLoading] = useState(true);
  const [lessons, setLessons] = useState([]);
  const [selectedLessonId, setSelectedLessonId] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);

  const handleLessonClick = (id) => {
    setSelectedLessonId(id);
  };

  // Fetch all lessons for a course
  useEffect(() => {
    const fetchLessons = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/lessons/${courseId}`);
        setLessons(data);
        if (data.length > 0) {
          setSelectedLessonId(data[0].lesson_id);
        }
      } catch (err) {
        console.error("Failed to load lessons:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLessons();
  }, [courseId]);

  // Fetch selected lesson details
  useEffect(() => {
    const fetchLessonDetails = async () => {
      if (!selectedLessonId) return;
      try {
        const { data } = await api.get(`/lessons/${courseId}/${selectedLessonId}`);
        setSelectedLesson(data.result[0]);
      } catch (err) {
        console.error("Failed to load lesson:", err);
      }
    };
    fetchLessonDetails();
  }, [selectedLessonId, courseId]);

  if (loading) return <Loader />;

  return (
    <div className="pt-16 font-display pb-8">

      {selectedLesson && (
        <video
          className="w-full h-64 sm:h-80 md:h-96 lg:h-112 xl:h-150 object-cover mx-auto"
          src={selectedLesson.video_url}
          controls
          autoPlay
          muted
        />
      )}

      <div className='flex pl-12 gap-6 w-full border-b border-rounded border-muted mb-8'>
        <p className="text-lg font-bold pt-4 pb-4 text-muted underline font-sans text-center">Course Content</p>
        <p className="text-lg font-bold pt-4 pb-4 text-muted underline font-sans text-center">Overview</p>
      </div>

      <div className="max-w-3xl mx-auto space-y-4">
        {lessons.map((lesson) => (
          <div
            key={lesson.lesson_id}
            onClick={() => handleLessonClick(lesson.lesson_id)}
            className={`p-6 border rounded-lg cursor-pointer transition-shadow duration-300 
              ${lesson.lesson_id === selectedLessonId ? "border-accent shadow-md" : "border-gray-300 hover:shadow-md"}`}
          >
            <h2 className="text-lg text-neutral-500 font-semibold hover:text-accent">
              {lesson.title}
            </h2>
          </div>
        ))}
      </div>

    </div>
  );
};

export default Lessons;
