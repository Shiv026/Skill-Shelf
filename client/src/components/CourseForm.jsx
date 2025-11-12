import { FiUploadCloud } from "react-icons/fi"
import { useState } from "react";

const CourseForm = ({ onSubmit, loading }) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category_id: "",
    price: "",
    thumbnail: null,
  });

  const categories = [
    { id: 1, name: "Web Development" },
    { id: 2, name: "Machine Learning" },
    { id: 3, name: "Data Science" },
    { id: 4, name: "Cybersecurity" },
    { id: 5, name: "Cloud Computing" },
    { id: 6, name: "Game Development" },
    { id: 7, name: "UI/UX Design" },
    { id: 8, name: "Graphic Design" },
    { id: 9, name: "Business" },
  ];

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="min-h-screen flex items-center">
      <form
        onSubmit={handleSubmit}
        className="max-w-lg mx-auto bg-secondary shadow-lg rounded-2xl p-6 space-y-4 border border-border text-text"
      >
        <h2 className="text-2xl font-semibold text-center text-primary font-display">Create a New Course</h2>

        {/* Title */}
        <input
          type="text"
          name="title"
          placeholder="Course Title"
          className="w-full p-2 border border-border rounded bg-secondary text-text focus:border-primary focus:ring-primary"
          value={form.title}
          onChange={handleChange}
          required
        />

        {/* Description */}
        <textarea
          name="description"
          placeholder="Course Description"
          className="w-full p-2 border border-border rounded bg-secondary text-text focus:border-primary focus:ring-primary"
          value={form.description}
          onChange={handleChange}
          rows="4"
          required
        />

        {/* Category */}
        <select
          name="category_id"
          className="w-full p-2 border border-border rounded bg-secondary text-text focus:border-primary focus:ring-primary"
          value={form.category_id}
          onChange={handleChange}
          required
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        {/* Price */}
        <input
          type="number"
          name="price"
          placeholder="Price (₹)"
          className="w-full p-2 border border-border rounded bg-secondary text-text focus:border-primary focus:ring-primary"
          value={form.price}
          onChange={handleChange}
          min="0"
          required
        />

        {/* Thumbnail */}
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-accent transition">
          <FiUploadCloud className="w-10 h-10 text-primary mb-2" />

          <p className="text-gray-700 text-sm text-center">
            <label
              htmlFor="thumbnail"
              className="text-primary-600 cursor-pointer hover:underline font-medium"
            >
              Upload a file
            </label>
          </p>

          <p className="text-xs text-gray-500 mt-1">PNG, JPG, JPEG</p>

          <input
            type="file"
            id="thumbnail"
            name="thumbnail"
            accept="image/*"
            // className="hidden"
            onChange={handleChange}
            required
          />

          {form.thumbnail && (
            <p className="mt-2 text-sm text-green-600">
              Selected: {form.thumbnail.name}
            </p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded text-white font-semibold transition ${loading
            ? "bg-muted  cursor-not-allowed"
            : "bg-primary hover:bg-accent"
            }`}
        >
          {loading ? "Creating..." : "Create Course"}
        </button>
      </form>
    </div>
  );
};

export default CourseForm;
