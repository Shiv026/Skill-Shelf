import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Courses from './pages/Courses';
import Dashboard from './pages/Dashboard';
import CreateCourse from './pages/createCourse';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Error from './pages/Error';
import NotFound from './pages/NotFound';
import { ToastContainer } from 'react-toastify';
import AddLessonsForm from './components/AddLessonsForm';
import QuizForm from './components/QuizForm';

function App() {
  return (
    <>
      <Routes>

        <Route path="/" element={<MainLayout />} >
          <Route index element={<Home />} />
          <Route path="/courses" element={<Courses />} />

          <Route path="/courses/:courseId/lessons" element={<Lessons />} />
          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route element={<ProtectedRoute roles={['instructor']} />}>
          <Route path="/create-course" element={<CreateCourse />} />
          <Route path="/lessons/:courseId" element={<AddLessonsForm />} />
          <Route path="/quizzes/create-quiz" element={<QuizForm />} />
        </Route>
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </>
  )
}

export default App

