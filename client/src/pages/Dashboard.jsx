// pages/Dashboard.jsx
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import StudentDashboard from "../components/StudentDashboard";
import InstructorDashboard from "../components/InstructorDashboard";

const Dashboard = () => {
  const { user, becomeInstructor, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [view, setView] = useState("student");
  const [becoming, setBecoming] = useState(false);

  if (!user) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center">
        <div className="pt-20 text-center text-muted text-xl">
          Please sign in to view your dashboard.
        </div>
        <button
          className="mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-accent transition duration-300 hover:cursor-pointer"
          onClick={() => navigate("/signin")}
        >
          Sign In
        </button>
      </div>

    );
  }

  const isInstructor = user.roles?.includes("instructor");

  // Handler for Become Instructor button
  const handleBecomeInstructor = async () => {
    setBecoming(true);
    await becomeInstructor();
    setBecoming(false);
  };

  return (
    <div className="pt-20 px-4 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold text-primary font-display">Dashboard</h1>
        {isInstructor ? (
          <div className="flex items-center gap-4">
            <span className="font-medium text-muted">View:</span>
            <div className="flex items-center gap-2">
              <button
                className={`px-4 py-2 rounded-lg font-semibold transition ${view === "student"
                  ? "bg-primary text-white"
                  : "bg-secondary text-text border border-border"
                  }`}
                onClick={() => setView("student")}
              >
                My Dashboard
              </button>
              <button
                className={`px-4 py-2 rounded-lg font-semibold transition ${view === "instructor"
                  ? "bg-primary text-white"
                  : "bg-secondary text-text border border-border"
                  }`}
                onClick={() => setView("instructor")}
              >
                Instructor Dashboard
              </button>
            </div>
          </div>
        ) : (
          <button
            className="bg-accent text-white font-semibold px-5 py-2 rounded-3xl shadow hover:bg-primary transition"
            onClick={handleBecomeInstructor}
            disabled={becoming || loading}
          >
            {becoming ? "Processing..." : "Become an Instructor"}
          </button>
        )}
      </div>

      {view === "student" && <StudentDashboard userToken={user.token} />}

      {view === "instructor" && isInstructor && (
        <InstructorDashboard userToken={user.token} />
      )}
    </div>
  );
};

export default Dashboard;