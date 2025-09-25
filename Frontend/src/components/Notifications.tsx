import React, { useState, useEffect } from "react";
import axios from "axios";

interface Event {
  id: number;
  title: string;
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

  // Fetch organizer's events
  useEffect(() => {
    if (!token) return;

    const fetchEvents = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/events/my", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Events API response:", res.data);
        setEvents(Array.isArray(res.data) ? res.data : res.data.events || []);
      } catch (err) {
        console.error("Failed to fetch events:", err);
        setError("Failed to load events");
      }
    };

    fetchEvents();
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
      console.log(`Sending update to event_id=${selectedEvent}`);
      const res = await axios.post(
        `http://127.0.0.1:8000/events/${selectedEvent}/updates`,
        { message },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Update response:", res.data);
      setSuccess(true);
      setMessage("");
    } catch (err: any) {
      console.error("Failed to send update:", err);
      setError(err.response?.data?.detail || "Failed to send update");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white shadow-md rounded-2xl p-6 m-20">
      <h2 className="text-xl font-bold mb-4">Post Update to Attendees</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Event dropdown */}
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

        {/* Update message */}
        <textarea
          className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
          rows={4}
          placeholder="Type your update here..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />

        {/* Submit button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Sending..." : "Send Update"}
        </button>
      </form>

      {/* Feedback messages */}
      {success && <p className="mt-3 text-green-600">✅ Update sent successfully!</p>}
      {error && <p className="mt-3 text-red-600">❌ {error}</p>}
    </div>
  );
}
