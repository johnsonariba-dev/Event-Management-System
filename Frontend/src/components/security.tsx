import { useState, useEffect } from "react";
import axios from "axios";
import Button from "./button";
import { useAuth } from "../Pages/Context/UseAuth";

interface SecurityData {
  two_factor_enabled: boolean;
  last_logins: string[];
  password?: string;
}

const Security: React.FC = () => {
  const { token } = useAuth();
  const [security, setSecurity] = useState<SecurityData | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch security info
  useEffect(() => {
    if (!token) return;

    const fetchSecurity = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get("http://127.0.0.1:8000/user/security", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Format last login timestamps
        const formattedLogins = res.data.last_logins.map(
          (dt: string) => new Date(dt).toLocaleString()
        );

        setSecurity({ ...res.data, last_logins: formattedLogins });
      } catch (err) {
        console.error(err);
        setError("Unable to load security info.");
      } finally {
        setLoading(false);
      }
    };

    fetchSecurity();
  }, [token]);

  // Type-safe state update
  const handleChange = <K extends keyof SecurityData>(field: K, value: SecurityData[K]) => {
    setSecurity((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  // Save changes
  const handleSave = async () => {
    if (!security) return;

    try {
      await axios.put(
        "http://127.0.0.1:8000/user/security",
        {
          two_factor_enabled: security.two_factor_enabled,
          password: security.password ? security.password : undefined,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Security settings updated!");
      setEditMode(false);
      setSecurity((prev) => (prev ? { ...prev, password: undefined } : null));
    } catch (err) {
      console.error(err);
      alert("Failed to update security settings.");
    }
  };

  const handleCancel = () => {
    setEditMode(false);
    setSecurity((prev) => (prev ? { ...prev, password: undefined } : null));
  };

  if (loading)
    return <p className="text-center mt-10 text-gray-600">Loading security settings...</p>;
  if (error)
    return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (!security)
    return <p className="text-center mt-10 text-gray-600">No security data available.</p>;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-3">
        <h1 className="text-2xl font-bold text-primary">Security Settings</h1>
        <div className="flex gap-2 flex-wrap">
          {editMode && (
            <Button
              title="Cancel"
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg shadow hover:bg-gray-400 transition"
              onClick={handleCancel}
            />
          )}
          <Button
            title={editMode ? "Save Changes" : "Edit Security"}
            className="bg-secondary text-white px-5 py-2 rounded-lg shadow hover:bg-secondary/90 transition"
            onClick={editMode ? handleSave : () => setEditMode(true)}
          />
        </div>
      </div>

      {/* Password Section */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-primary mb-3">Password</h2>
        {editMode ? (
          <input
            type="password"
            className="p-3 border border-primary/30 rounded-lg w-full sm:w-1/2 focus:outline-none focus:ring-2 focus:ring-primary/50"
            placeholder="Enter new password"
            value={security.password || ""}
            onChange={(e) => handleChange("password", e.target.value)}
          />
        ) : (
          <p className="font-medium tracking-widest">********</p>
        )}
      </section>

      {/* Two-Factor Authentication */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-primary mb-3">Two-Factor Authentication</h2>
        {editMode ? (
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={security.two_factor_enabled}
              onChange={(e) => handleChange("two_factor_enabled", e.target.checked)}
              className="w-5 h-5 accent-primary"
            />
            <span className="text-gray-700">Enable 2FA</span>
          </label>
        ) : (
          <span
            className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
              security.two_factor_enabled ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}
          >
            {security.two_factor_enabled ? "Enabled" : "Disabled"}
          </span>
        )}
      </section>

      {/* Recent Logins */}
      <section>
        <h2 className="text-lg font-semibold text-primary mb-4">Recent Logins</h2>
        <div className="space-y-2">
          {security.last_logins.length > 0 ? (
            security.last_logins.slice(-5).reverse().map((login, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg border border-primary/20 bg-white shadow-sm hover:shadow-md transition"
              >
                <p className="text-gray-700">{login}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No previous logins found.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default Security;
