import React, { useState, useContext } from 'react';
import api from '../utils/api.js';
import { toast } from 'react-toastify';
import AuthContext from '../context/AuthContext';

// --- SVG Icons for the buttons ---

// Trash Can Icon
const TrashIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-5 h-7"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12.54 0c.04.05.077.1.114.15l3.75 3.75a.75.75 0 001.06 0l3.75-3.75a.75.75 0 00.114-.15m-15 0H3l2.25 2.25M5.25 5.79v.003l.004.005L7.5 10.5M18.75 5.79v.003l-.004.005L16.5 10.5m-11.25 0v.003"
    />
  </svg>
);

// Plus Icon
const PlusIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 4.5v15m7.5-7.5h-15"
    />
  </svg>
);

// --- The Main Component ---

export default function QuizForm() {
  const [quizTitle, setQuizTitle] = useState('');
  
  const { user } = useContext(AuthContext);

  const [questions, setQuestions] = useState([
    {
      id: 1,
      questionText: '',
      options: ['', '', '', ''],
      correctAnswerIndex: 1, // Option B is selected for Q1
    }
  ]);

  // --- State Handler Functions ---

  // Add a new blank question
  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: Date.now(), // Simple unique ID
        questionText: '',
        options: ['', '', '', ''],
        correctAnswerIndex: null,
      },
    ]);
  };

  // Delete a question by its ID
  const deleteQuestion = (id) => {
    // Prevent deleting the last question
    if (questions.length <= 1) return;
    setQuestions(questions.filter((q) => q.id !== id));
  };

  // Update a question's text
  const handleQuestionTextChange = (id, newText) => {
    setQuestions(
      questions.map((q) =>
        q.id === id ? { ...q, questionText: newText } : q
      )
    );
  };

  // Update an option's text
  const handleOptionChange = (qId, optionIndex, newText) => {
    setQuestions(
      questions.map((q) =>
        q.id === qId
          ? {
              ...q,
              options: q.options.map((opt, i) =>
                i === optionIndex ? newText : opt
              ),
            }
          : q
      )
    );
  };

  // Update the correct answer for a question
  const handleCorrectAnswerChange = (qId, optionIndex) => {
    setQuestions(
      questions.map((q) =>
        q.id === qId ? { ...q, correctAnswerIndex: optionIndex } : q
      )
    );
  };

  // Handle the final form submission
  const handleSubmit = async (e) => {
  e.preventDefault();

  const payload = questions.map(q => ({
    quiz_title: quizTitle, // or quiz_id if you already have IDs
    question_text: q.questionText,
    option_a: q.options[0],
    option_b: q.options[1],
    option_c: q.options[2],
    option_d: q.options[3],
    correct_option: String.fromCharCode(65 + q.correctAnswerIndex) // A, B, C, or D
  }));

  console.log("Payload sent to backend:", payload);

  try {
    const res = await api.post(
        "/quizzes/create-quiz", 
        payload,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          }
        }
      );
    toast.success(res.data.message || "Quiz created successfully!");
  } catch (err) {
    console.error("Error creating quiz:", err);
    toast.error(err.response?.data?.message || "Failed to create quiz");
  }
};

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
        <h1 className="text-2xl font-bold text-primary mb-2 ">
          Create a New Quiz
        </h1>
        <p className="text-gray-600 mb-6">
          Fill in the details to create a new quiz for your course.
        </p>

        <form onSubmit={handleSubmit}>
          {/* --- Quiz Title Section --- */}
          <div className="mb-6">
            <label
              htmlFor="quizTitle"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Quiz Title
            </label>
            <input
              type="text"
              id="quizTitle"
              value={quizTitle}
              onChange={(e) => setQuizTitle(e.target.value)}
              placeholder="e.g., Introduction to Calculus Quiz"
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* --- Dynamic Questions Section --- */}
          {questions.map((question, qIndex) => (
            <div
              key={question.id}
              className="mb-8 p-6 border border-gray-200 rounded-lg"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-700">
                  Question {qIndex + 1}
                </h3>
                {questions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => deleteQuestion(question.id)}
                    className="text-red-500 hover:text-red-700 cursor-pointer"
                  >
                    <TrashIcon />
                  </button>
                )}
              </div>

              {/* Question Text Input */}
              <div className="mb-4">
                <label
                  htmlFor={`question-${question.id}`}
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Question
                </label>
                <input
                  type="text"
                  id={`question-${question.id}`}
                  value={question.questionText}
                  onChange={(e) =>
                    handleQuestionTextChange(question.id, e.target.value)
                  }
                  placeholder="e.g., What is the derivative of x^2?"
                  className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Options Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {question.options.map((option, oIndex) => (
                  <div key={oIndex} className="flex items-center">
                    <input
                      type="text"
                      value={option}
                      onChange={(e) =>
                        handleOptionChange(question.id, oIndex, e.target.value)
                      }
                      placeholder={`Option ${String.fromCharCode(65 + oIndex)}`} // A, B, C, D
                      className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                    {/* Radio button to select the correct answer */}
                    <input
                      type="radio"
                      name={`correct-answer-${question.id}`}
                      checked={question.correctAnswerIndex === oIndex}
                      onChange={() =>
                        handleCorrectAnswerChange(question.id, oIndex)
                      }
                      className="ml-3 h-5 w-5 text-blue-600 border-gray-300 focus:ring-blue-500 cursor-pointer"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* --- Form Footer Buttons --- */}
          <div className="flex justify-between items-center mt-8">
            <button
              type="button"
              onClick={addQuestion}
              className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 font-medium rounded-md hover:bg-green-200 cursor-pointer"
            >
              <PlusIcon />
              Add Question
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-primary text-white font-semibold rounded-md shadow-sm hover:bg-green-700 cursor-pointer"
            >
              Save Quiz
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}