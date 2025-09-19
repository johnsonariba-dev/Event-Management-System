import { useState } from "react";
import Button from "./button";

interface SettingsData {
  theme: "light" | "dark";
  language: string;
  notifications: boolean;
  timezone: string;
}

const UserSettings: React.FC = () => {
  const [settings, setSettings] = useState<SettingsData>({
    theme: "light",
    language: "English",
    notifications: true,
    timezone: "GMT+1 (West Africa Time)",
  });

  const [editMode, setEditMode] = useState(false);

  const handleChange = (field: keyof SettingsData, value: any) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-primary">App Settings</h1>
        <Button
          title={editMode ? "Save Changes" : "Edit Settings"}
          className="bg-secondary text-white px-5 py-2 rounded-lg shadow hover:bg-secondary/90 transition"
          onClick={() => setEditMode(!editMode)}
        />
      </div>

      {/* Theme Selection */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-primary mb-3">Theme</h2>
        {editMode ? (
          <select
            value={settings.theme}
            onChange={(e) =>
              handleChange("theme", e.target.value as "light" | "dark")
            }
            className="p-3 border border-primary/30 rounded-lg w-full sm:w-1/2 focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        ) : (
          <p className="font-medium capitalize">{settings.theme}</p>
        )}
      </section>

      {/* Language */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-primary mb-3">Language</h2>
        {editMode ? (
          <select
            value={settings.language}
            onChange={(e) => handleChange("language", e.target.value)}
            className="p-3 border border-primary/30 rounded-lg w-full sm:w-1/2 focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option>English</option>
            <option>French</option>
            <option>Spanish</option>
          </select>
        ) : (
          <p className="font-medium">{settings.language}</p>
        )}
      </section>

      {/* Notifications */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-primary mb-3">
          Notifications
        </h2>
        {editMode ? (
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.notifications}
              onChange={(e) => handleChange("notifications", e.target.checked)}
              className="w-5 h-5 accent-primary"
            />
            <span className="text-gray-700">Enable Notifications</span>
          </label>
        ) : (
          <span
            className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
              settings.notifications
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {settings.notifications ? "Enabled" : "Disabled"}
          </span>
        )}
      </section>

      {/* Timezone */}
      <section>
        <h2 className="text-lg font-semibold text-primary mb-3">Timezone</h2>
        {editMode ? (
          <input
            type="text"
            value={settings.timezone}
            onChange={(e) => handleChange("timezone", e.target.value)}
            className="p-3 border border-primary/30 rounded-lg w-full sm:w-1/2 focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        ) : (
          <p className="font-medium">{settings.timezone}</p>
        )}
      </section>
    </div>
  );
};

export default UserSettings;
