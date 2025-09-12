import axios from "axios";
import { useState } from "react";
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

  const [flyerPreview, setFlyerPreview] = useState<string | null>(null);
  const [mediaPreviews, setMediaPreviews] = useState<string[]>([]);

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
      const reader = new FileReader();
      reader.onloadend = () => setFlyerPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleFlyerDelete = () => setFlyerPreview(null);

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () =>
          setMediaPreviews((prev) => [...prev, reader.result as string]);
        reader.readAsDataURL(file);
      });
    }
  };

  const handleMediaDelete = (index: number) => {
    setMediaPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const scheduleReminder = () => {
    if (formData.reminder === "none") return;
    if (!formData.date || !formData.from) return;

    const eventDateTime = new Date(`${formData.date}T${formData.from}`);
    let reminderOffset = 0;

    switch (formData.reminder) {
      case "10m":
        reminderOffset = 10 * 60 * 1000;
        break;
      case "30m":
        reminderOffset = 30 * 60 * 1000;
        break;
      case "1h":
        reminderOffset = 60 * 60 * 1000;
        break;
      case "1d":
        reminderOffset = 24 * 60 * 60 * 1000;
        break;
    }

    const reminderTime = eventDateTime.getTime() - reminderOffset;
    const delay = reminderTime - Date.now();

    if (delay > 0) {
      setTimeout(() => {
        new Notification(`Reminder: ${formData.title}`, {
          body: `Your event "${formData.title}" starts at ${formData.from}`,
        });
      }, delay);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Create JSON payload to match FastAPI CreateEvent
    const payload = {
      title: formData.title,
      category: formData.category,
      description: formData.description,
      venue: formData.venue,
      date: `${formData.date}T${formData.from}:00`,
      ticket_price: Number(formData.ticket_price),
      image_url: flyerPreview || "",
      capacity_max: Number(formData.capacity_max),
    };

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/event_fake/events",
        payload,
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("Backend response:", response.data);

      alert(response.data.message || "Event created!");

      // Reset form
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
      setFlyerPreview(null);
      setMediaPreviews([]);
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        console.error("Error response:", err.response?.data);
        alert(`Failed: ${err.response?.data?.detail || "Unknown error"}`);
      } else {
        console.error(err);
        alert("Unexpected error");
      }
    }

    // Schedule reminder
    scheduleReminder();
  };

  return (
    <div className="flex h-full bg-violet-100 relative">
      {/* Sidebar */}
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

      {/* Main */}
      <div className="flex flex-col p-8 pt-20 pl-100 max-md:pl-0">
        <h1 className="text-2xl font-bold text-primary mb-6 pl-5">
          Create Event
        </h1>

        <div className="w-full max-w-4xl px-10 space-y-10">
          {/* Flyer upload */}
          <label
            htmlFor="flyer-upload"
            className="flex flex-col items-center justify-center border border-dashed border-purple-400 rounded-lg p-6 cursor-pointer bg-white hover:bg-purple-100 transition"
          >
            {flyerPreview ? (
              <div className="relative w-full h-70">
                <img
                  src={flyerPreview}
                  alt="Flyer Preview"
                  className="w-full h-full object-cover rounded-lg"
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
              <label htmlFor="title" className="block text-sm font-medium text-purple-700">
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

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-purple-700">
                Category
              </label>
              <select
                name="category"
                id="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full p-2 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-400 bg-purple-200"
              >
                <option value="">Select Category</option>
                <option value="art">Art</option>
                <option value="business">Business</option>
                <option value="music">Music</option>
                <option value="sport">Sport</option>
                <option value="tech">Tech</option>
              </select>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="desc" className="block text-sm font-medium text-purple-700">
                Description
              </label>
              <textarea
              id="desc"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full p-2 border-2 border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-400"
              />
            </div>

            {/* Date/Time/Location */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-purple-700">
                  Date
                </label>
                <input
                id="date"
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full p-2 border-2 border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-400"
                  required
                />
              </div>
              <div>
                <label htmlFor="time" className="block text-sm font-medium text-purple-700">
                  From
                </label>
                <input
                id="time"
                  type="time"
                  name="from"
                  value={formData.from}
                  onChange={handleChange}
                  className="w-full p-2 border-2 border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-400"
                  required
                />
              </div>
              <div>
                <label htmlFor="to" className="block text-sm font-medium text-purple-700">
                  To
                </label>
                <input
                id="to"
                  type="time"
                  name="to"
                  value={formData.to}
                  onChange={handleChange}
                  className="w-full p-2 border-2 border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-400"
                  required
                />
              </div>
            </div>

            {/* Venue */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-purple-700">
                Location
              </label>
              <textarea
              id="location"
                name="venue"
                value={formData.venue}
                onChange={handleChange}
                className="w-full p-2 border-2 border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-400"
              />
            </div>

            {/* Number of Attendees / Ticket Price / Reminder */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label htmlFor="cp" className="block text-sm font-medium text-primary">
                  Number of Attendees
                </label>
                <input
                id="cp"
                  type="number"
                  name="capacity_max"
                  value={formData.capacity_max}
                  onChange={handleChange}
                  className="w-full p-2 border-2 border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-400"
                />
              </div>
              <div>
                <label htmlFor="tp" className="block text-sm font-medium text-primary">
                  Ticket Price ($)
                </label>
                <input
                id="tp"
                  type="number"
                  name="ticket_price"
                  value={formData.ticket_price}
                  onChange={handleChange}
                  className="w-full p-2 border-2 border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-400"
                />
              </div>
              <div>
                <label htmlFor="reminder" className="block text-sm font-medium text-purple-700">
                  Reminder
                </label>
                <select
                id="reminder"
                  name="reminder"
                  value={formData.reminder}
                  onChange={handleChange}
                  className="w-full p-2 border-2 border-purple-200 bg-purple-200 rounded-lg focus:ring-2 focus:ring-purple-400"
                >
                  <option value="none">None</option>
                  <option value="10m">10 minutes before</option>
                  <option value="30m">30 minutes before</option>
                  <option value="1h">1 hour before</option>
                  <option value="1d">1 day before</option>
                </select>
              </div>
            </div>

            {/* Media previews */}
            {mediaPreviews.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mt-4">
                {mediaPreviews.map((src, index) => (
                  <div key={index} className="relative">
                    <img
                      src={src}
                      alt={`Media ${index + 1}`}
                      className="w-full h-24 object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => handleMediaDelete(index)}
                      className="absolute top-1 right-1 bg-purple-200 p-1 rounded-full shadow hover:bg-red-100"
                    >
                      <FaTrash className="text-red-500 w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              onClick={handleSubmit}
              className="bg-secondary text-white font-bold p-2 rounded-lg w-full hover:bg-orange-100 hover:text-secondary transition duration-300"
            >
              Create Event
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
