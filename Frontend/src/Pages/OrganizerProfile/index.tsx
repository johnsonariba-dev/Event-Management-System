import { useState, useEffect } from "react";
import axios from "axios";
import { FaUpload } from "react-icons/fa";
import { useAuth } from "../Context/UseAuth";
import Button from "../../components/button";
import { BsFillQuestionCircleFill } from "react-icons/bs";


interface User {
  id: number;
  username: string;
  email: string;
  phone?: string;
  location?: string;
  profile_pic?: string;
  role: string;
}

const Personal: React.FC = () => {
  const { token } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [profilePic, setProfilePic] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) return;
      try {
        const res = await axios.get("http://127.0.0.1:8000/user/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
        setProfilePic(
          res.data.profile_pic ||
           BsFillQuestionCircleFill
        );
      } catch (err) {
        console.error("Failed to fetch user:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [token]);

  if (loading) return <p>Loading profile...</p>;
  if (!user) return <p>User not found</p>;

  const handleChange = (field: keyof User, value: string) => {
    setUser((prev) => prev && { ...prev, [field]: value });
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

  const handleSaveProfile = async () => {
    if (!user) return;

    if (!user.username || !user.email) {
      alert("Username and email are required.");
      return;
    }

    try {
      const payload = {
        username: user.username,
        email: user.email,
        phone: user.phone,
        location: user.location,
        profile_pic: profilePic,
      };

      await axios.put(`http://127.0.0.1:8000/user/${user.id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setEditMode(false);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update profile.");
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pt-40">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8">
        <div className="flex items-center gap-6">
          <label className="relative group cursor-pointer w-28 h-28 sm:w-32 sm:h-32">
            <img
              src={profilePic}
              alt="Profile"
              className="w-full h-full rounded-full border-4 border-primary-500 object-cover shadow-lg bg-gray-100 flex items-center justify-center"
            />
            {editMode && (
              <>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePicUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer rounded-full"
                />
                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                  <FaUpload className="text-white text-xl sm:text-2xl" />
                </div>
              </>
            )}
          </label>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-primary-700">
              {user.username}
            </h1>
            <p className="text-secondary-600 capitalize">{user.role}</p>
          </div>
        </div>
        <Button
          title={editMode ? "Save Profile" : "Edit Profile"}
          className="bg-primary-600 text-white px-6 py-3 rounded-lg shadow hover:bg-primary-700 transition"
          onClick={editMode ? handleSaveProfile : () => setEditMode(true)}
        />
      </div>

      {/* Personal Info */}
      <section className="mb-12 bg-white shadow rounded-xl p-6">
        <h2 className="text-lg sm:text-xl font-semibold mb-6 text-primary-700">
          Personal Info
        </h2>
        <div className="grid gap-6 sm:grid-cols-2">
          {editMode ? (
            <>
              <input
                value={user.username}
                onChange={(e) => handleChange("username", e.target.value)}
                placeholder="Username"
                className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <input
                value={user.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="Email"
                className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <input
                value={user.phone || ""}
                onChange={(e) => handleChange("phone", e.target.value)}
                placeholder="Phone"
                className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <input
                value={user.location || ""}
                onChange={(e) => handleChange("location", e.target.value)}
                placeholder="Location"
                className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </>
          ) : (
            <>
              <div>
                <p className="text-sm text-gray-500">Username</p>
                <p className="font-medium text-gray-800">{user.username}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium text-gray-800">{user.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium text-gray-800">
                  {user.phone || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-medium text-gray-800">
                  {user.location || "N/A"}
                </p>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default Personal;
