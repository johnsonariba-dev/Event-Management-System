import { IoCreateOutline } from "react-icons/io5";
import { FaTicketAlt } from "react-icons/fa";
import { BsThreeDots } from "react-icons/bs"; // "..." icon
import Button from "./button";
import axios from "axios";
import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { FaLocationDot } from "react-icons/fa6";

interface Event {
  id: number;
  title: string;
  description: string;
  category: string;
  venue: string;
  ticket_price: number;
  date: string;
  sold?: number;
  status?: string;
  image_url: string;
}

const Dashboard: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [menuOpenId, setMenuOpenId] = useState<number | null>(null);

  useEffect(() => {
    axios
      .get("http://localhost:8000/events")
      .then((res) => setEvents(res.data))
      .catch((err) => console.error("Error fetching events:", err));
  }, []);

  const filteredEvents = events.filter((event) => {
    return (
      event.title.toLowerCase().includes(search.toLowerCase()) &&
      (category ? event.category.toLowerCase() === category.toLowerCase() : true) &&
      (price === "free"
        ? event.ticket_price === 0
        : price === "paid"
        ? event.ticket_price > 0
        : true)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Welcome Header */}
      <h1 className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 py-6 text-3xl sm:text-4xl md:text-5xl font-bold">
        Welcome
        <span className="text-secondary font-light text-xl sm:text-2xl md:text-3xl">
          John Doe
        </span>
      </h1>

      {/* Create Event Box */}
      <div className="bg-gray-100 flex flex-col items-center justify-center rounded-lg p-6 sm:p-9 mb-10 text-center">
        <IoCreateOutline size={36} />
        <h2 className="font-bold text-xl sm:text-2xl pt-3">Create a new event</h2>
        <p className="text-base sm:text-lg md:text-xl py-4">
          Add all your event details, create new tickets, and set up recurring events.
        </p>
        <NavLink to="/NewEvent">
          <Button title="Create Event" className="bg-black text-white mt-3 sm:mt-5" />
        </NavLink>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 mb-6">
        <input
          type="text"
          placeholder="Search events ..."
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-0 p-3 rounded-lg bg-purple-100 text-base sm:text-[16px]"
        />
        <select
          className="p-3 rounded-lg bg-purple-100 text-base sm:text-[16px]"
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
          className="p-3 rounded-lg bg-purple-100 text-base sm:text-[16px]"
          onChange={(e) => setPrice(e.target.value)}
        >
          <option value="">All Prices</option>
          <option value="free">Free</option>
          <option value="paid">Paid</option>
        </select>
      </div>

      {/* Event List Header */}
      <div className="hidden sm:flex justify-between font-bold bg-gray-200 rounded-t-lg px-4 py-2 mb-2">
        <span className="flex-1">Event</span>
        <span className="w-24 text-center">Sold</span>
        <span className="w-24 text-center">Price</span>
        <span className="w-24 text-center">Status</span>
        <span className="w-8"></span> {/* placeholder for menu icon */}
      </div>

      {/* Event List */}
      <ul className="divide-y divide-gray-200">
        {filteredEvents.map((event) => (
          <li
            key={event.id}
            className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 py-4 hover:bg-gray-50 transition rounded-lg px-2 sm:px-4"
          >
            {/* Checkbox */}
            <input type="checkbox" className="self-start sm:self-auto w-5 h-5 " />

            {/* Thumbnail */}
            <img
              src={event.image_url}
              alt={event.title}
              className="w-full sm:w-28 h-40 sm:h-20 object-cover rounded-lg shadow flex-shrink-0"
            />

            {/* Details */}
            <div className="flex-1 border  flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-4">
              <div className="flex flex-col">
                <h3 className="font-bold text-lg">{event.title}</h3>
                <p className="text-gray-500 text-sm flex items-center gap-1">
                  <FaLocationDot color="blue"/> {event.venue}
                </p>
                <p className="text-gray-600 text-sm">{event.date}</p>
              </div>

              {/* Sold, Price, Status */}
              <div className="flex justify-center border items-center">
                <span className="text-center">{event.sold ?? 0}</span>
                <span className="text-center">
                  <FaTicketAlt className="inline mr-1" />
                  {event.ticket_price} FCFA
                </span>
                <span className="text-center">{event.status ?? "Active"}</span>
              </div>

              {/* Menu icon */}
              <div className="relative">
                <BsThreeDots
                  className="cursor-pointer text-xl"
                  onClick={() =>
                    setMenuOpenId(menuOpenId === event.id ? null : event.id)
                  }
                />
                {menuOpenId === event.id && (
                  <div className="absolute right-0 transition-smooth top-6 bg-white border rounded shadow-md z-10 flex flex-col">
                    <NavLink
                      to={`/event/${event.id}`}
                      className="px-4 py-2 hover:bg-gray-100"
                    >
                      View
                    </NavLink>
                    <button className="px-4 py-2 text-left hover:bg-gray-100">
                      Edit
                    </button>
                    <button className="px-4 py-2 text-left hover:bg-gray-100 text-red-600">
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
