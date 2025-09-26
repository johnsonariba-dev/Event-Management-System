import React, { useState, useEffect } from "react";
import axios from "axios";

interface Event {
  id: number;
  title: string;
}

interface Notification {
  id: number;
  message: string;
  created_at: string;
}

interface NotificationsProps {
  token: string;
}

export default function Notifications({ token }: NotificationsProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Fetch organizer's events + notifications
  useEffect(() => {
    if (!token) return;

    const fetchEvents = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/events/my", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEvents(Array.isArray(res.data) ? res.data : res.data.events || []);
      } catch {
        setError("Failed to load events");
      }
    };

    const fetchNotifications = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/events/notifications/my", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotifications(Array.isArray(res.data) ? res.data : []);
      } catch {
        setError("Failed to load notifications");
      }
    };

    fetchEvents();
    fetchNotifications();
  }, [token]);

  // Handle submitting the update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    if (!selectedEvent) {
      setError("Please select an event first");
      setLoading(false);
      return;
    }

    try {
      await axios.post(
        `http://127.0.0.1:8000/events/${selectedEvent}/updates`,
        { message },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess(true);
      setMessage("");

      // Refresh notifications
      const res = await axios.get("http://127.0.0.1:8000/events/notifications/my", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(Array.isArray(res.data) ? res.data : []);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to send update");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="w-full md:w-1/3 lg:w-1/4 bg-white shadow-md p-6 border-r">
        <h2 className="text-xl font-bold mb-6">Post Update</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <select
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
            value={selectedEvent ?? ""}
            onChange={(e) => setSelectedEvent(Number(e.target.value))}
            required
          >
            <option value="" disabled>
              Select an event
            </option>
            {events.map((event) => (
              <option key={event.id} value={event.id}>
                {event.title}
              </option>
            ))}
          </select>

          <textarea
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
            rows={4}
            placeholder="Type your update here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-primary text-white py-2 rounded-lg disabled:opacity-50 hover:bg-secondary transition"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Update"}
          </button>
        </form>

        {/* Feedback messages */}
        {success && (
          <p className="mt-3 text-green-600">✅ Update sent successfully!</p>
        )}
        {error && <p className="mt-3 text-red-600">❌ {error}</p>}
      </div>

      {/* Right: Notifications (takes full space, scrollable) */}
      <div className="flex-1 bg-gray-50 p-6 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">My Notifications</h2>

        {notifications.length === 0 ? (
          <p className="text-gray-500 text-center mt-10">
            No notifications yet
          </p>
        ) : (
          <ul className="space-y-4">
            {notifications.map((n) => (
              <li
                key={n.id}
                className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition"
              >
                <p className="text-gray-800">{n.message}</p>
                <span className="text-xs text-gray-500 block mt-1">
                  {new Date(n.created_at).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
