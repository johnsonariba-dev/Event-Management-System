import { useState } from "react";
import Button from "./button";
import { FaUpload } from "react-icons/fa";

interface User {
  name: string;
  email: string;
  phone: string;
  location: string;
  categories: string[];
  purchasedTickets: number;
  upcomingEvents: number;
  activities: string[];
}

const Personal: React.FC = () => {
  const [user, setUser] = useState<User>({
    name: "John Doe",
    email: "john@example.com",
    phone: "+237 600 000 000",
    location: "Douala, Cameroon",
    categories: ["Music", "Tech"],
    purchasedTickets: 5,
    upcomingEvents: 2,
    activities: [
      "Bought a ticket for Music Fest 2025",
      "Reviewed Tech Expo 2024",
      "Updated profile picture",
    ],
  });

  const [editMode, setEditMode] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [profilePic, setProfilePic] = useState(
    "https://i.pravatar.cc/150?img=5"
  );

  const handleChange = (field: keyof User, value: string) => {
    setUser((prev) => ({ ...prev, [field]: value }));
  };

  const handleCategoryAdd = () => {
    if (newCategory.trim() && !user.categories.includes(newCategory)) {
      setUser((prev) => ({
        ...prev,
        categories: [...prev.categories, newCategory],
      }));
      setNewCategory("");
    }
  };

  const handleCategoryRemove = (cat: string) => {
    setUser((prev) => ({
      ...prev,
      categories: prev.categories.filter((c) => c !== cat),
    }));
  };

  const handleProfilePicUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) setProfilePic(reader.result.toString());
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <label className="relative group cursor-pointer">
            <img
              src={profilePic}
              alt="Profile"
              className="w-24 h-24 rounded-full border-4 border-primary-500 object-cover shadow-md"
            />
            {editMode && (
              <>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePicUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                 <FaUpload/>
                </div>
              </>
            )}
          </label>
          <div>
            <h1 className="text-2xl font-bold text-primary-600">{user.name}</h1>
            <p className="text-secondary-500">Attendee</p>
          </div>
        </div>
        <Button
          title={editMode ? "Save Profile" : "Edit Profile"}
          className="bg-primary-600 text-white px-5 py-2 rounded-lg shadow hover:bg-primary-700 transition"
          onClick={() => setEditMode(!editMode)}
        />
      </div>

      {/* Personal Info */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-4 text-primary-700">
          Personal Info
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {editMode ? (
            <>
              <input
                aria-label="Name"
                className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={user.name}
                onChange={(e) => handleChange("name", e.target.value)}
              />
              <input
                aria-label="Email"
                className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={user.email}
                onChange={(e) => handleChange("email", e.target.value)}
              />
              <input
                aria-label="Phone"
                className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={user.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
              />
              <input
                aria-label="Location"
                className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={user.location}
                onChange={(e) => handleChange("location", e.target.value)}
              />
            </>
          ) : (
            <>
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium">{user.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">{user.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-medium">{user.location}</p>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Preferences */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-4 text-primary-700">
          Preferences
        </h2>
        <div className="flex flex-wrap gap-2 mb-3">
          {user.categories.map((cat, idx) => (
            <span
              key={idx}
              className="px-3 py-1 bg-secondary-100 text-secondary-700 rounded-full flex items-center gap-2 shadow-sm"
            >
              {cat}
              {editMode && (
                <button
                  onClick={() => handleCategoryRemove(cat)}
                  className="text-secondary-500 hover:text-secondary-700"
                >
                  ✕
                </button>
              )}
            </span>
          ))}
        </div>
        {editMode && (
          <div className="flex gap-2">
            <input
              placeholder="Add preference"
              className="p-2 border rounded-lg flex-1 focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
            <Button
              title="Add"
              className="bg-primary-600 text-white px-4 rounded-lg hover:bg-primary-700 shadow"
              onClick={handleCategoryAdd}
            />
          </div>
        )}
      </section>

      {/* Activity */}
      <section>
        <h2 className="text-lg font-semibold mb-4 text-primary-700">
          Activity
        </h2>
        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          <div className="p-4 border rounded-lg shadow-sm bg-white">
            <p className="text-sm text-gray-500">Purchased Tickets</p>
            <p className="text-2xl font-bold text-primary-600">
              {user.purchasedTickets}
            </p>
          </div>
          <div className="p-4 border rounded-lg shadow-sm bg-white">
            <p className="text-sm text-gray-500">Upcoming Events</p>
            <p className="text-2xl font-bold text-primary-600">
              {user.upcomingEvents}
            </p>
          </div>
        </div>

        {/* Recent Activities */}
        <div>
          <h3 className="text-md font-semibold mb-4 text-primary-700">
            Recent Activities
          </h3>
          <ul className="space-y-3">
            {user.activities.map((act, idx) => (
              <li
                key={idx}
                className="bg-gray-50 rounded-lg p-4 shadow-sm hover:shadow-md transition"
              >
                <p className="text-gray-700 text-sm">{act}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
};

export default Personal;
