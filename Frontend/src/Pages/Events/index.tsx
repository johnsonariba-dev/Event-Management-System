import axios from "axios";
import { useEffect, useState } from "react";
import Button from "../../components/button";
import { FaLocationDot } from "react-icons/fa6";
import { NavLink } from "react-router-dom";

interface EventProps {
  id: number;
  title: string;
  description: string;
  category: string;
  venue: string;
  ticket_price: number;
  date: string;
  image_url: string;
}

const Events: React.FC = () => {
  const [events, setEvents] = useState<EventProps[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [popularity, setPopularity] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:8000/event_fake/events")
      .then((res) => {
        setEvents(res.data);
      })
      .catch((err) => console.error("Error fetching events:", err));
  }, []);

  return (
    <div className="bg-accent">
      {/* Hero Section */}
      <div className="relative h-screen flex flex-col items-center justify-center text-center">
        <div className="absolute inset-0 bg-[url(/src/assets/images/EventHero.png)] bg-cover brightness-50"></div>
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative ">
          <h1 className="text-primary font-bold text-[7vw] pb-10">
            Discover <span className="text-secondary">Events</span>
          </h1>
          <p className="text-gray-200 text-[2vw] max-w-3xl mx-auto">
            Explore thousands of events happening around you and connect with
            like-minded people
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="px-6 bg-accent py-20">
        <div className="bg-white shadow-md rounded-2xl flex flex-wrap gap-4 px-5 py-10 justify-between">
          <input
            type="text"
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

      {/* Event Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 px-6 pb-20">
        {events
          .filter((event) =>
            event.title.toLowerCase().includes(search.toLowerCase())
          )
          .filter((event) =>
            category
              ? event.category.toLowerCase() === category.toLowerCase()
              : true
          )
          .filter((event) =>
            price === "free"
              ? event.ticket_price === 0
              : price === "paid"
              ? event.ticket_price > 0
              : true
          )
          .sort((a, b) => {
            if (popularity === "top") return b.ticket_price - a.ticket_price; // real ratings will be replaced in feature
            if (popularity === "most") return b.id - a.id; // fake "most viewed"
            return 0;
          })
          .map((event) => (
            <div
              key={event.id}
              className="bg-white shadow-lg rounded-xl overflow-hidden hover:scale-105 transition-transform"
            >
              <img
                src={event.image_url}
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
                  {event.ticket_price === 0 ? "Free" : event.ticket_price}
                </p>
                <div className="flex justify-end">
                  <NavLink to={"/EventDetail"}>
                    <Button
                      title="View Details"
                      className="bg-secondary hover:bg-primary text-white px-4 py-2 rounded-lg"
                    />
                  </NavLink>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Events;
