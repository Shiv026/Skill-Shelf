// import Loader from '../components/Loader';
// const Lessons = () => {
//   const obj = [
//     {
//       id: 1,
//       title: "Lesson 1: Introduction to React",
//     },
//     {
//       id: 2,
//       title: "Lesson 2: Components and Props",
//     },
//     {
//       id: 3,
//       title: "Lesson 3: State and Lifecycle",
//     },
//     {
//       id: 4,
//       title: "Lesson 4: Events and Forms",
//     },
//     {
//       id: 5,
//       title: "Lesson 5: Conditional Rendering",
//     },
//   ]

//   return (
//     <div className="pt-16 font-display pb-8">
//       <video
//         className="w-full h-64 sm:h-80 md:h-96 lg:h-112 xl:h-128 object-cover mx-auto"
//         src="null"

//         loop
//         muted
//       >Video goes here</video>
//       <div className='flex pl-12 gap-6 w-full border-b border-rounded border-muted mb-8'>
//         <p className="text-lg font-bold pt-4 pb-4 text-muted underline font-sans text-center ">Course Content</p>
//         <p className="text-lg font-bold pt-4 pb-4 text-muted underline font-sans text-center ">Overview</p>
//       </div>

//       <div className="max-w-3xl mx-auto space-y-4">
//         {obj.map((lesson) => (
//           <div
//             key={lesson.id}
//             className="p-6 border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
//           >
//             <h2 className="text-lg text-neutral-500 font-semibold hover:text-accent hover:cursor-pointer">{lesson.title}</h2>
//           </div>
//         ))}
//       </div>

//     </div>
//   )
// }
// export default Lessons;

//when the user clicks on the course card
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../utils/api.js";
import Loader from '../components/Loader.jsx';
const Lessons = () => {
  // Handle if courseId is NULL 
  const { courseId } = useParams();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [selectedLessonId, setSelectedLessonId] = useState();
  const [selectedLesson, setSelectedLesson] = useState(null);

  // flow user clicked a course navigate to lessons page 
  // extract all the lessons from the course_Id and display them
  // once done select the first lesson and render it
  const handleLessonClick = (id) => {
    setSelectedLessonId(id);
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/lessons/${courseId}`);
        setData(response.data);
        console.log(response.data);
        const lessonId = response.data[0]?.lesson_id;
        setSelectedLessonId(lessonId);
      } catch (error) {
        console.error(error.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [courseId]);

  useEffect(() => {
    const fetchLessonDetails = async () => {
      if (!selectedLessonId) return;
      try {
        const response = await api.get(`/lessons/${courseId}/${selectedLessonId}`);
        setSelectedLesson(response.data.result[0]);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchLessonDetails();
  }, [selectedLessonId, courseId]);


  if (loading) return (<Loader />);

  return (
    <div className="pt-16 font-display pb-8">
      <video
        className="w-full h-64 sm:h-80 md:h-96 lg:h-112 xl:h-150 object-cover mx-auto"
        src={selectedLesson?.video_url}
        controls
        autoPlay
        loop
        muted
      >Video goes here</video>
      <div className='flex pl-12 gap-6 w-full border-b border-rounded border-muted mb-8'>
        <p className="text-lg font-bold pt-4 pb-4 text-muted underline font-sans text-center ">Course Content</p>
        <p className="text-lg font-bold pt-4 pb-4 text-muted underline font-sans text-center ">Overview</p>
      </div>

      <div className="max-w-3xl mx-auto space-y-4">
        {data.map((lesson) => (
          <div
            key={lesson.lesson_id}
            onClick={() => handleLessonClick(lesson.lesson_id)}
            className="p-6 border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
          >
            <h2 className="text-lg text-neutral-500 font-semibold hover:text-accent hover:cursor-pointer">{lesson.title}</h2>
          </div>
        ))}
      </div>

    </div>
  )
}
export default Lessons;