import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { FaLocationDot } from "react-icons/fa6";
import Button from "./button";

interface Event {
  id: number;
  title: string;
  category: string;
  description: string;
  location: string;
  date: string;
  image_url?: string;
}

interface RecommenderProps {
  userId: number; // logged-in user ID
  topN?: number;  // optional number of recommendations
}

export default function Recommender({ userId, topN = 5 }: RecommenderProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!token) {
        setError("User not authenticated");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const res = await fetch(
          `http://127.0.0.1:8000/recommend/${userId}?top_n=${topN}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch recommendations");

        const data = await res.json();
        setEvents(data.recommended || []); // <-- extract recommended array
      } catch (err) {
        setError((err as Error).message || "Failed to load recommendations");
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [userId, topN, token]);

  if (loading) return <p>Loading recommendations...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (events.length === 0) return <p>No recommendations found.</p>;

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => (
        <div
          key={event.id}
          className="bg-white shadow-md rounded-2xl overflow-hidden hover:shadow-lg transition"
        >
          {event.image_url && (
            <img
              src={event.image_url}
              alt={event.title}
              className="h-40 w-full object-cover"
            />
          )}
          <div className="p-4 space-y-2">
            <h3 className="text-xl font-semibold">{event.title}</h3>
            <p className="text-sm text-gray-600">{event.category}</p>
            <p className="text-sm text-gray-500 truncate">
              {event.description}
            </p>
            <div className="flex items-center text-gray-500 text-sm">
              <FaLocationDot className="mr-1" /> {event.location}
            </div>
            <p className="text-sm text-gray-500">
              {new Date(event.date).toLocaleDateString()}
            </p>

            <NavLink to={`/events/${event.id}`}>
              <Button className="w-full mt-3" title="View Event" />
            </NavLink>
          </div>
        </div>
      ))}
    </div>
  );
}
