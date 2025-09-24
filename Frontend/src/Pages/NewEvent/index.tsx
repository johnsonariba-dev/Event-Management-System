import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaCalendar,
  FaClock,
  FaMapMarkerAlt,
  FaCloudUploadAlt,
  FaTrash,
} from "react-icons/fa";

interface EventFormData {
  title: string;
  category: string;
  description: string;
  venue: string;
  date: string;
  from: string;
  to: string;
  reminder: string;
  capacity_max: string;
  ticket_price: string;
}

interface MediaFile {
  id: string;
  file: File;
  preview: string;
}

export default function NewEvent() {
  const [formData, setFormData] = useState<EventFormData>({
    title: "",
    category: "",
    description: "",
    venue: "",
    date: "",
    from: "",
    to: "",
    reminder: "none",
    capacity_max: "",
    ticket_price: "",
  });

  const [flyer, setFlyer] = useState<MediaFile | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFlyerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFlyer({
        id: crypto.randomUUID(),
        file,
        preview: URL.createObjectURL(file),
      });
    }
  };

  const handleFlyerDelete = () => setFlyer(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem("token");

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("category", formData.category);
      data.append("description", formData.description);
      data.append("venue", formData.venue);
      data.append("date", `${formData.date}T${formData.from}:00`);
      data.append("ticket_price", formData.ticket_price);
      data.append("capacity_max", formData.capacity_max);

      if (flyer?.file) data.append("image", flyer.file);

      const response = await axios.post("http://127.0.0.1:8000/events", data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Backend response:", response.data);

      alert("Event created successfully!");
      navigate("/CreateEvent");

      // reset form
      setFormData({
        title: "",
        category: "",
        description: "",
        venue: "",
        date: "",
        from: "",
        to: "",
        reminder: "none",
        capacity_max: "",
        ticket_price: "",
      });
      setFlyer(null);
    } catch (err: any) {
      console.error("Error response:", err.response?.data || err);
      alert("Failed to create event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full bg-violet-100 relative">
      {/* Sidebar Preview */}
      <aside className="w-64 bg-white border-r shadow-md p-4 hidden md:block pt-20 fixed h-screen">
        <h2 className="text-lg font-semibold text-purple-700 mb-4">
          Event Preview
        </h2>
        <div className="bg-purple-50 rounded-xl shadow p-4 space-y-2">
          <p className="font-bold text-2xl">
            {formData.title || "Event Title"}
          </p>
          <div className="flex flex-col space-y-1 text-sm">
            <div className="flex items-center space-x-2">
              <FaCalendar size={12} />
              <p>{formData.date || "Date"}</p>
            </div>
            <div className="flex items-center space-x-2">
              <FaClock size={12} />
              <p>
                {formData.from && formData.to
                  ? `${formData.from} - ${formData.to}`
                  : "Time"}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <FaMapMarkerAlt size={12} />
              <p>{formData.venue || "Location"}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-col p-8 pt-20 pl-100 max-md:pl-0">
        <h1 className="text-2xl font-bold text-primary mb-6 pl-5">
          Create Event
        </h1>

        <div className="w-full max-w-4xl px-10 space-y-10">
          {/* Flyer Upload */}
          <label
            htmlFor="flyer-upload"
            className="flex flex-col items-center justify-center border border-dashed border-purple-400 rounded-lg p-6 cursor-pointer bg-white hover:bg-purple-100 transition"
          >
            {flyer ? (
              <div className="relative w-full h-full">
                <img
                  src={flyer.preview}
                  alt="Flyer Preview"
                  className="w-full h-70 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={handleFlyerDelete}
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-purple-200 bg-opacity-80 p-3 rounded-full shadow hover:bg-red-100 z-10"
                  title="Remove image"
                >
                  <FaTrash className="text-red-500 w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <FaCloudUploadAlt className="text-purple-700 text-4xl mb-2" />
                <span className="text-primary font-semibold">
                  Import Event Flyer
                </span>
                <span className="text-xs text-gray-500 mt-1">
                  Max size: 10MB
                </span>
              </div>
            )}
            <input
              id="flyer-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFlyerChange}
            />
          </label>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-lg p-4 w-full space-y-6"
          >
            {/* Title */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-purple-700"
              >
                Title
              </label>
              <input
                id="title"
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full p-2 border-2 border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-400"
                required
              />
            </div>
            {/* Category */}{" "}
            <div>
              {" "}
              <label
                htmlFor="category"
                className="block text-sm font-medium text-purple-700"
              >
                {" "}
                Category{" "}
              </label>{" "}
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full p-2 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-400 bg-purple-200"
              >
                {" "}
                <option value="">Select Category</option>{" "}
                <option value="art">Art</option>{" "}
                <option value="business">Business</option>{" "}
                <option value="music">Music</option>{" "}
                <option value="sport">Sport</option>{" "}
                <option value="tech">Tech</option>{" "}
              </select>{" "}
            </div>{" "}
            {/* Description */}{" "}
            <div>
              {" "}
              <label
                htmlFor="desc"
                className="block text-sm font-medium text-purple-700"
              >
                {" "}
                Description{" "}
              </label>{" "}
              <textarea
                id="desc"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full p-2 border-2 border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-400"
              />{" "}
            </div>{" "}
            {/* Date/Time */}{" "}
            <div className="grid grid-cols-3 gap-4">
              {" "}
              <div>
                {" "}
                <label
                  htmlFor="date"
                  className="block text-sm font-medium text-purple-700"
                >
                  {" "}
                  Date{" "}
                </label>{" "}
                <input
                  id="date"
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full p-2 border-2 border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-400"
                  required
                />{" "}
              </div>{" "}
              <div>
                {" "}
                <label
                  htmlFor="time"
                  className="block text-sm font-medium text-purple-700"
                >
                  {" "}
                  From{" "}
                </label>{" "}
                <input
                  id="time"
                  type="time"
                  name="from"
                  value={formData.from}
                  onChange={handleChange}
                  className="w-full p-2 border-2 border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-400"
                  required
                />{" "}
              </div>{" "}
              <div>
                {" "}
                <label
                  htmlFor="to"
                  className="block text-sm font-medium text-purple-700"
                >
                  {" "}
                  To{" "}
                </label>{" "}
                <input
                  id="to"
                  type="time"
                  name="to"
                  value={formData.to}
                  onChange={handleChange}
                  className="w-full p-2 border-2 border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-400"
                  required
                />{" "}
              </div>{" "}
            </div>{" "}
            {/* Venue */}{" "}
            <div>
              {" "}
              <label
                htmlFor="venue"
                className="block text-sm font-medium text-purple-700"
              >
                {" "}
                Location{" "}
              </label>{" "}
              <textarea
                id="venue"
                name="venue"
                value={formData.venue}
                onChange={handleChange}
                className="w-full p-2 border-2 border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-400"
              />{" "}
            </div>{" "}
            {/* Attendees / Ticket / Reminder */}{" "}
            <div className="grid grid-cols-3 gap-4">
              {" "}
              <div>
                {" "}
                <label
                  htmlFor="capacity_max"
                  className="block text-sm font-medium text-primary"
                >
                  {" "}
                  Number of Attendees{" "}
                </label>{" "}
                <input
                  id="capacity_max"
                  type="number"
                  name="capacity_max"
                  value={formData.capacity_max}
                  onChange={handleChange}
                  className="w-full p-2 border-2 border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-400"
                />{" "}
              </div>{" "}
              <div>
                {" "}
                <label
                  htmlFor="ticket_price"
                  className="block text-sm font-medium text-primary"
                >
                  {" "}
                  Ticket Price ($){" "}
                </label>{" "}
                <input
                  id="ticket_price"
                  type="number"
                  name="ticket_price"
                  value={formData.ticket_price}
                  onChange={handleChange}
                  className="w-full p-2 border-2 border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-400"
                />{" "}
              </div>{" "}
              <div>
                {" "}
                <label
                  htmlFor="reminder"
                  className="block text-sm font-medium text-purple-700"
                >
                  {" "}
                  Reminder{" "}
                </label>{" "}
                <select
                  id="reminder"
                  name="reminder"
                  value={formData.reminder}
                  onChange={handleChange}
                  className="w-full p-2 border-2 border-purple-200 bg-purple-200 rounded-lg focus:ring-2 focus:ring-purple-400"
                >
                  {" "}
                  <option value="none">None</option>{" "}
                  <option value="10m">10 minutes before</option>{" "}
                  <option value="30m">30 minutes before</option>{" "}
                  <option value="1h">1 hour before</option>{" "}
                  <option value="1d">1 day before</option>{" "}
                </select>{" "}
              </div>{" "}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-secondary text-white font-bold p-2 rounded-lg w-full hover:bg-orange-100 hover:text-secondary transition duration-300 flex justify-center items-center"
            >
              {loading ? (
                <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></span>
              ) : null}
              {loading ? "Creating..." : "Create Event"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
