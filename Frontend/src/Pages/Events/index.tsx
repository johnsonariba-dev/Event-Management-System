import axios from "axios";
import { useEffect, useState } from "react";
import Button from "../../components/button";
import { FaLocationDot } from "react-icons/fa6";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/UseAuth";

interface Review {
  user: string;
  comment: string;
  rating?: number;
}

interface EventProps {
  id: number;
  title: string;
  description: string;
  category: string;
  venue: string;
  ticket_price: number;
  date: string;
  image_url: string;
  organizer_id?: number;
  review?: Review[];
  isRecommended?: boolean; // 🔑 extra flag for frontend badge
}

const Events: React.FC = () => {
  const [events, setEvents] = useState<EventProps[]>([]);
  const [recommended, setRecommended] = useState<EventProps[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [popularity, setPopularity] = useState("");
  const [loader, setLoader] = useState(true);
  const [visibleCount, setVisibleCount] = useState(12);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  const { token, role } = useAuth();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/events");
        setEvents(res.data);
      } catch (err) {
        console.error("Error fetching events:", err);
      } finally {
        setLoader(false);
      }
    };

    const fetchRecommendations = async () => {
      if (!token) return;
      try {
        const res = await axios.get("http://127.0.0.1:8000/recommend/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        let recs = res.data.recommended || [];

        if (recs.length === 0) {
          // 🔑 Fallback → pick top 5 rated events
          recs = [...events]
            .sort((a, b) => (b.review?.length || 0) - (a.review?.length || 0))
            .slice(0, 5);
        }

        // Mark as recommended
        const recsWithFlag = recs.map((r: EventProps) => ({
          ...r,
          isRecommended: true,
        }));

        setRecommended(recsWithFlag);
      } catch (err) {
        console.error("Error fetching recommendations:", err);
      }
    };

    fetchEvents().then(fetchRecommendations);
  }, [token]);

  console.log(setMessage, role);

  // 🔑 Merge recommended + normal events
  let mergedEvents = [...recommended, ...events];

  // Deduplicate (avoid showing same event twice)
  const seen = new Set<number>();
  mergedEvents = mergedEvents.filter((e) => {
    if (seen.has(e.id)) return false;
    seen.add(e.id);
    return true;
  });

  // Apply filters and sorting
  const filteredEvents = mergedEvents
    .filter((event) => event.title.toLowerCase().includes(search.toLowerCase()))
    .filter((event) =>
      category ? event.category.toLowerCase() === category.toLowerCase() : true
    )
    .filter((event) =>
      price === "free"
        ? event.ticket_price === 0
        : price === "paid"
        ? event.ticket_price > 0
        : true
    )
    .sort((a, b) => {
      if (popularity === "top") return b.ticket_price - a.ticket_price;
      if (popularity === "most") return b.id - a.id;
      return 0;
    });

  const visibleEvents = filteredEvents.slice(0, visibleCount);

  const handleViewEvent = (event: EventProps) => {
    if (!token) {
      navigate("/login");
    } else {
      navigate(`/event/${event.id}`);
    }
  };

  if (loader) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-32 w-32 animate-spin border-b-gray-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-accent">
      {/* Hero Section */}
      <div className="relative h-120 flex flex-col mx-6">
        <div className="absolute inset-0 bg-[url(/src/assets/images/carnaval.jpeg)] bg-contain brightness-80 rounded-2xl mt-25"></div>
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-black to-gray-100/10 mt-25"></div>
        <div className="relative top-64 pl-5">
          <h1 className="text-primary font-bold text-[5vw]">
            Discover <span className="text-secondary">Events</span>
          </h1>
          <p className="text-gray-200 text-[1.5vw] max-w-xl">
            Explore thousands of events happening around you and connect with
            like-minded people
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="px-6 bg-accent py-20">
        <div className="bg-white shadow-md rounded-2xl flex flex-wrap gap-4 px-5 py-10 justify-between">
          <input
            type="search"
            placeholder="Search events ..."
            onChange={(e) => setSearch(e.target.value)}
            className="bg-purple-100 p-3 rounded-lg flex-1"
          />
          <select
            className="bg-purple-100 p-3 rounded-lg"
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="music">Music</option>
            <option value="tech">Tech</option>
            <option value="art">Art</option>
            <option value="business">Business</option>
            <option value="sports">Sports</option>
          </select>
          <select
            className="bg-purple-100 p-3 rounded-lg"
            onChange={(e) => setPrice(e.target.value)}
          >
            <option value="">All Prices</option>
            <option value="free">Free</option>
            <option value="paid">Paid</option>
          </select>
          <select
            className="bg-purple-100 p-3 rounded-lg"
            onChange={(e) => setPopularity(e.target.value)}
          >
            <option value="">Popularity</option>
            <option value="top">Top rated</option>
            <option value="most">Most viewed</option>
          </select>
        </div>
      </div>

      {/* Toast message */}
      {message && (
        <div className="text-center text-green-600 mb-4">{message}</div>
      )}

      {/* Event Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 px-6 pb-20">
        {visibleEvents.map((event) => (
          <div
            key={event.id}
            className="bg-white shadow-lg rounded-xl overflow-hidden hover:scale-105 transition-transform relative"
          >
            {/* ⭐ Recommended Badge */}
            {event.isRecommended && (
              <span className="absolute top-3 left-3 bg-yellow-400 text-white text-xs font-bold px-2 py-1 rounded-lg shadow-md">
                ⭐ Recommended
              </span>
            )}

            <img
              src={
                event.image_url
                  ? event.image_url.startsWith("http")
                    ? event.image_url
                    : `http://127.0.0.1:8000${event.image_url}`
                  : "/placeholder.png"
              }
              alt={event.title}
              className="h-40 w-full object-cover"
            />
            <div className="p-4">
              <h3 className="font-bold text-lg">{event.title}</h3>
              <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                {event.description}
              </p>
              <p className="mt-3 text-sm flex gap-2 items-center pb-3">
                <FaLocationDot color="purple" /> {event.venue}
              </p>
              <p className="text-gray-800 font-medium pb-2">
                <span className="font-bold">Price: </span>
                {event.ticket_price === 0
                  ? "Free"
                  : `${event.ticket_price} FCFA`}
              </p>

              <div className="flex justify-end gap-2">
                <NavLink to={token ? `/event/${event.id}` : "/login"}>
                  <Button
                    title="View Details"
                    onClick={() => handleViewEvent(event)}
                    className="bg-secondary hover:bg-primary text-white px-4 py-2 rounded-lg"
                  />
                </NavLink>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* See More Button */}
      {visibleCount < filteredEvents.length && (
        <div className="flex justify-end pb-10 pr-10 underline text-secondary cursor-pointer text-xl font-bold">
          <p onClick={() => setVisibleCount((prev) => prev + 12)}>See more ...</p>
        </div>
      )}
    </div>
  );
};

export default Events;
