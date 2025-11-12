import React from 'react';

// Inline SVG for the trash icon for simplicity
const TrashIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12.54 0c-.265.006-.529.02-.793.042M4.772 5.79L2.75 3.772a3 3 0 00-4.242 4.242l2.02 2.02m15.02-4.242l-2.02-2.02a3 3 0 00-4.242-4.242l-2.02 2.02m7.287 4.242A48.09 48.09 0 0112 4.5c-2.291 0-4.545.16-6.75.472m13.5 0c-.376.02-.749.032-1.12.032h-1.5c-.371 0-.744-.012-1.12-.032"
    />
  </svg>
);

export default function LessonInput({
  lesson,
  index,
  onChange,
  onRemove,
  canRemove,
}) {
  // Create a unique ID for the file input to link with its label
  const fileInputId = `video-upload-${lesson.id}`;

  return (
    <div className="border border-gray-200 p-6 rounded-lg relative bg-gray-50/50">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Lesson {index + 1}
        </h3>
        {canRemove && (
          <button
            type="button"
            onClick={() => onRemove(lesson.id)}
            className="text-gray-400 hover:text-red-600"
          >
            <TrashIcon className="w-5 h-7 hover:cursor-pointer" />
          </button>
        )}
      </div>

      <div className="space-y-4">
        {/* Lesson Title */}
        <div>
          <label
            htmlFor={`lesson-title-${lesson.id}`}
            className="block text-sm font-medium text-gray-700"
          >
            Lesson Title
          </label>
          <div className="mt-1">
            <input
              type="text"
              id={`lesson-title-${lesson.id}`}
              name="title"
              value={lesson.title}
              onChange={(e) => onChange(lesson.id, e)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="e.g. Introduction to Tailwind CSS"
              required
            />
          </div>
        </div>

        {/* Video Description */}
        <div>
          <label
            htmlFor={`lesson-description-${lesson.id}`}
            className="block text-sm font-medium text-gray-700"
          >
            Video Description
          </label>
          <div className="mt-1">
            <textarea
              id={`lesson-description-${lesson.id}`}
              name="description"
              rows={4}
              value={lesson.description}
              onChange={(e) => onChange(lesson.id, e)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Add a short summary of what this lesson covers..."
              required
            />
          </div>
        </div>

        {/* Upload Video */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Upload Video
          </label>
          <div className="mt-1 flex items-center space-x-3">
            <label
              htmlFor={fileInputId}
              className="cursor-pointer px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Select Video File
            </label>
            <input
              id={fileInputId}
              name="videoFile"
              type="file"
              className="sr-only" // This hides the ugly default input
              onChange={(e) => onChange(lesson.id, e)}
              accept="video/*" // Optional: restrict to video files
              required
            />
            <span className="text-sm text-gray-500">
              {lesson.videoFile ? lesson.videoFile.name : 'No file chosen'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}