import { useState } from "react";
import Button from "./button";

interface SecurityData {
  password: string;
  twoFactorEnabled: boolean;
  lastLogin: string;
  devices: string[];
}

const Security: React.FC = () => {
  const [security, setSecurity] = useState<SecurityData>({
    password: "********",
    twoFactorEnabled: true,
    lastLogin: "Sept 10, 2025 - 14:23",
    devices: ["Chrome on Windows", "Safari on iPhone"],
  });

  const [editMode, setEditMode] = useState(false);

  const handleChange = (field: keyof SecurityData, value: any) => {
    setSecurity((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-primary">Security Settings</h1>
        <Button
          title={editMode ? "Save Changes" : "Edit Security"}
          className="bg-secondary text-white px-5 py-2 rounded-lg shadow hover:bg-secondary/90 transition"
          onClick={() => setEditMode(!editMode)}
        />
      </div>

      {/* Password Section */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-primary mb-3">Password</h2>
        {editMode ? (
          <input
            type="password"
            className="p-3 border border-primary/30 rounded-lg w-full sm:w-1/2 focus:outline-none focus:ring-2 focus:ring-primary/50"
            placeholder="Enter new password"
            onChange={(e) => handleChange("password", e.target.value)}
          />
        ) : (
          <p className="font-medium tracking-widest">{security.password}</p>
        )}
      </section>

      {/* Two-Factor Authentication */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-primary mb-3">
          Two-Factor Authentication
        </h2>
        {editMode ? (
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={security.twoFactorEnabled}
              onChange={(e) =>
                handleChange("twoFactorEnabled", e.target.checked)
              }
              className="w-5 h-5 accent-primary"
            />
            <span className="text-gray-700">Enable 2FA</span>
          </label>
        ) : (
          <span
            className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
              security.twoFactorEnabled
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {security.twoFactorEnabled ? "Enabled" : "Disabled"}
          </span>
        )}
      </section>

      {/* Login History */}
      <section>
        <h2 className="text-lg font-semibold text-primary mb-4">
          Login Activity
        </h2>
        <div className="space-y-4">
          <div className="p-4 rounded-xl border border-primary/20 bg-white shadow-sm hover:shadow-md transition">
            <p className="text-sm text-gray-500">Last Login</p>
            <p className="font-medium text-gray-800">{security.lastLogin}</p>
          </div>

          <div className="p-4 rounded-xl border border-primary/20 bg-white shadow-sm hover:shadow-md transition">
            <p className="text-sm text-gray-500 mb-2">Active Devices</p>
            <ul className="list-disc pl-5 space-y-1 text-gray-700">
              {security.devices.map((device, idx) => (
                <li
                  key={idx}
                  className="hover:text-primary transition cursor-pointer"
                >
                  {device}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Security;
