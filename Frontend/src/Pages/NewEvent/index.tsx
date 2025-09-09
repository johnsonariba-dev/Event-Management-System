import { useEffect, useState } from "react";
import {
  FaCalendar,
  FaClock,
  FaMapMarkerAlt,
  FaCloudUploadAlt,
  FaTrash,
} from "react-icons/fa";
import SideBar from "../../components/sideBar";

interface EventFormData {
  title: string;
  location: string;
  date: string;
  from: string;
  to: string;
  reminder: string;
}

export default function NewEvent() {
  const [formData, setFormData] = useState<EventFormData>({
    title: "",
    location: "",
    date: "",
    from: "",
    to: "",
    reminder: "none",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const [flyerPreview, setFlyerPreview] = useState<string | null>(null);
  const [mediaPreviews, setMediaPreviews] = useState<string[]>([]);

  // Flyer

  const handleFlyerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFlyerPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleFlyerDelete = () => {
    setFlyerPreview(null);
  };

  // Media

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newPreviews: string[] = [];
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newPreviews.push(reader.result as string);
          // merge after reading each file
          setMediaPreviews((prev) => [...prev, ...newPreviews]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleMediaDelete = (index: number) => {
    setMediaPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // Notifications

  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  const scheduleReminder = () => {
    if (formData.reminder === "none") return;

    if (!formData.date || formData.from) return;
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
    const now = Date.now();
    const delay = reminderTime - now;

    if (delay > 0 && Notification.permission === "granted") {
      setTimeout(() => {
        new Notification(`Reminder: ${formData.title}`, {
          body: `Your event "${formData.title}" starts at ${formData.from}`,
        });
      }, delay);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.reminder !== "none") {
      if (Notification.permission !== "granted") {
        Notification.requestPermission().then((perm) => {
          if (perm === "granted") scheduleReminder();
        });
      } else {
        scheduleReminder();
      }
    }

    alert("Event created!");
  };

  return (
    <div className="flex h-full bg-violet-100 relative relative">
      {/* Secondary Sidebar (Desktop) */}

      <aside className="w-64 bg-white border-r shadow-md p-4 hidden md:block pt-20 fixed h-screen">
        <h2 className="text-lg font-semibold text-purple-700 mb-4">
          Event Preview
        </h2>
        <div className="bg-purple-50 rounded-xl shadow p-4 space-y-2">
          <p className="font-bold text-2xl">
            {formData.title || "Event Title"}
          </p>
          <div className = "flex flex-col">
                <div className="flex space-x-2 items-center text-sm">
                    <FaCalendar size={12} />
                    <p>{formData.date || "Date"}</p>

                <div className="flex space-x-2 items-center text-sm">
                    <FaClock size={12} />
                    <p>
                    {formData.from && formData.to
                        ? `${formData.from} - ${formData.to}`
                        : "Time"}
                    </p>
                </div>
                    <div className="flex space-x-2 items-center text-sm">
                    <FaMapMarkerAlt size={12} />
                    <p>{formData.location || "Location"}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex flex-col p-8 pt-20 pl-100 max-md:pl-0">
        <h1 className="text-2xl font-bold text-primary mb-6 pl-5">Create Event</h1>

        <div className="w-full max-w-4xl  px-10 space-y-10">
          {/* flyer upload */}

          <label
            htmlFor="flyer-upload"
            className="flex flex-col items-center justify-center border border-dashed border-purple-400 rounded-lg p-6 cursor-pointer bg-white hover:bg-purple-100 transition"
          >
            {flyerPreview ? (
              <>
                <div className="relative w-full h-full">
                  <img
                    src={flyerPreview}
                    alt="Flyer Preview"
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={handleFlyerDelete}
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-purple-200 bg-opacity-80 p-3 rounded-full shadow hover:bg-red-100 transition z-10"
                    title="Remove image"
                  >
                    <FaTrash className="text-red-500 w-4 h-4" />
                  </button>
                </div>
              </>
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

          <div className="bg-white rounded-lg p-4 w-full space-y-6">
            <form
              onSubmit={handleSubmit}
              className="space-y-4 max-w-lg items-center justify-center"
            >
              <div>
                <label className="block text-sm font-medium text-purple-700">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full p-2 border-2 border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-400 "
                  placeholder="Enter event title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-purple-700">
                  Category
                </label>
                <select name="categories" onChange={handleChange} className="w-full p-2 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-400 bg-purple-200">
                <option value="all categories">All Categories</option>
                <option value="art">Art</option>
                <option value="business">Business</option>
                <option value="music">Music</option>
                <option value="sport">Sport</option>
                <option value="tech">Tech</option>
              </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-purple-700">
                  Description
                </label>
                <textarea
                  name="description"
                  onChange={handleChange}
                  className="w-full p-2 border-2 border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-400"
                  placeholder="Enter event description"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-purple-700">
                    Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full p-2 border-2 border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-purple-700">
                    From
                  </label>
                  <input
                    type="time"
                    name="from"
                    value={formData.from}
                    onChange={handleChange}
                    className="w-full p-2 border-2 border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-purple-700">
                    To
                  </label>
                  <input
                    type="time"
                    name="to"
                    value={formData.to}
                    onChange={handleChange}
                    className="w-full p-2 border-2 border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-400"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-purple-700">
                  Location
                </label>
                <textarea
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full p-2 border-2 border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-400"
                  placeholder="Orthodoxe, Yaounde-Cameroon"
                />
                <label className="block text-sm font-medium text-primary">
                  Upload Images
                </label>
              </div>
              <div>
                <label
                  htmlFor="media-upload"
                  className="flex flex-col items-center justify-center border border-dashed border-purple-400 rounded-lg p-6 cursor-pointer bg-purple-50 hover:bg-purple-100 transition w-full"
                >
                  <FaCloudUploadAlt className="text-primary text-4xl mb-2" />
                  <span className="text-primary font-semibold">
                    Import Media (images/videos)
                  </span>
                  <span className="text-xs text-gray-500 mt-1">
                    Max size: 10MB
                  </span>
                  <input
                    id="media-upload"
                    type="file"
                    accept="image/*,video/*"
                    multiple
                    className="hidden"
                    onChange={handleMediaChange}
                  />
                </label>

                {/* Gallery Preview */}
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
              </div>

              <div className = "lg:flex md:flex space-x-2 items-center">
                <label className="block text-sm font-medium text-primary">
                  Number of Attendees
                </label>
                <input
                  type="number"
                  name="attendees"
                  onChange={handleChange}
                  className="w-half p-2 border-2 border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-400 "
                  placeholder="Send email invitation"
                />
                <label className="block text-sm font-medium text-primary">Ticket Price($)</label>
                <input type="number" name="price" className="w-half p-2 border-2 border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-400" placeholder="50"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-purple-700">
                  Reminder
                </label>
                <select
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
            </form>
            <div>
              <button
                type="submit"
                className="bg-secondary text-white font-bold p-2 rounded-lg items-center justify-center w-full hover:bg-orange-100 hover:text-secondary transition duration-300 "
              >
                Create Event
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
