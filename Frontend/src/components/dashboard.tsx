import { IoCreateOutline } from "react-icons/io5";
import { FaTicketAlt } from "react-icons/fa";
import { BsThreeDots } from "react-icons/bs";
import { HiOutlineCalendar } from "react-icons/hi";
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

  // Modals
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [deletingEvent, setDeletingEvent] = useState<Event | null>(null);

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

  const formatDate = (d: string) => {
    try {
      return new Date(d).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      });
    } catch {
      return d;
    }
  };

  // Utility: format for datetime-local
  const toDateTimeLocal = (d: string) => {
    const date = new Date(d);
    return date.toISOString().slice(0, 16); // "YYYY-MM-DDTHH:mm"
  };

  // Edit Event
  const handleEditSave = async () => {
  if (!editingEvent) return;
  try {
    const payload = {
      ...editingEvent,
      // keep backend-friendly format (ISO or original string)
      date: new Date(editingEvent.date).toISOString(),
    };

    const res = await axios.put(
      `http://localhost:8000/events/${editingEvent.id}`,
      payload
    );

    // use payload if backend doesn’t echo back
    setEvents((prev) =>
      prev.map((ev) =>
        ev.id === editingEvent.id ? res.data ?? payload : ev
      )
    );

    setEditingEvent(null);
  } catch (err: any) {
    console.error("Error updating event:", err.response?.data || err.message);
  }
};


  // Delete Event
  const handleDeleteConfirm = async () => {
    if (!deletingEvent) return;
    try {
      await axios.delete(`http://localhost:8000/events/${deletingEvent.id}`);
      setEvents((prev) => prev.filter((ev) => ev.id !== deletingEvent.id));
      setDeletingEvent(null);
    } catch (err) {
      console.error("Error deleting event:", err);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-x-hidden">
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
        <p className="text-base sm:text-lg md:text-xl py-4 max-w-md">
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
          className="flex-1 min-w-0 p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <select
          className="p-3 rounded-lg border border-gray-200"
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
          className="p-3 rounded-lg border border-gray-200"
          onChange={(e) => setPrice(e.target.value)}
        >
          <option value="">All Prices</option>
          <option value="free">Free</option>
          <option value="paid">Paid</option>
        </select>
      </div>

      {/* Event list */}
      <ul className="flex flex-col gap-4">
        {filteredEvents.map((event) => (
          <li
            key={event.id}
            className="group bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition transform hover:-translate-y-0.5 p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4"
          >
            <input type="checkbox" className="w-5 h-5 flex-shrink-0" />
            <img
              src={event.image_url}
              alt={event.title}
              className="w-full sm:w-36 h-40 sm:h-20 rounded-md object-cover max-w-full"
            />
            <div className="flex-1 min-w-0 w-full">
              <div className="flex justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="font-semibold text-lg truncate break-words">
                    {event.title}
                  </h3>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 mt-1">
                    <span className="flex items-center text-sm text-gray-500 gap-1">
                      <FaLocationDot className="text-blue-500" /> {event.venue}
                    </span>
                    <span className="flex items-center text-sm text-gray-400 gap-1">
                      <HiOutlineCalendar /> {formatDate(event.date)}
                    </span>
                  </div>
                </div>
                <div className="relative">
                  <BsThreeDots
                    className="cursor-pointer text-xl"
                    onClick={() =>
                      setMenuOpenId(menuOpenId === event.id ? null : event.id)
                    }
                  />
                  {menuOpenId === event.id && (
                    <div className="absolute right-0 top-6 bg-white border rounded shadow-md z-10 flex flex-col max-w-[90vw]">
                      <button
                        className="px-4 py-2 text-left hover:bg-gray-100"
                        onClick={() => {
                          setEditingEvent(event);
                          setMenuOpenId(null);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="px-4 py-2 text-left hover:bg-gray-100 text-red-600"
                        onClick={() => {
                          setDeletingEvent(event);
                          setMenuOpenId(null);
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <p className="mt-2 text-sm text-gray-600 line-clamp-2 break-words">
                {event.description}
              </p>
            </div>
            <div className="w-full sm:w-auto flex flex-col sm:items-end items-start gap-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FaTicketAlt /> {event.sold ?? 0} sold
              </div>
              <div className="px-3 py-1 border rounded-md text-sm font-medium bg-gray-50">
                {event.ticket_price} FCFA
              </div>
              <span
                className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  event.status === "Cancelled"
                    ? "bg-red-100 text-red-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                {event.status ?? "Active"}
              </span>
            </div>
          </li>
        ))}
      </ul>

      {/* Edit Modal */}
      {editingEvent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-20 p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">Edit Event</h2>
            <div className="flex flex-col gap-3">
              <input
                type="text"
                value={editingEvent.title}
                onChange={(e) =>
                  setEditingEvent({ ...editingEvent, title: e.target.value })
                }
                className="p-2 border rounded w-full"
              />
              <input
                type="text"
                value={editingEvent.venue}
                onChange={(e) =>
                  setEditingEvent({ ...editingEvent, venue: e.target.value })
                }
                className="p-2 border rounded w-full"
              />
              <input
                type="datetime-local"
                value={toDateTimeLocal(editingEvent.date)}
                onChange={(e) =>
                  setEditingEvent({ ...editingEvent, date: e.target.value })
                }
                className="p-2 border rounded w-full"
              />
              <input
                type="number"
                value={editingEvent.ticket_price}
                onChange={(e) =>
                  setEditingEvent({
                    ...editingEvent,
                    ticket_price: parseFloat(e.target.value),
                  })
                }
                className="p-2 border rounded w-full"
              />
              <textarea
                value={editingEvent.description}
                onChange={(e) =>
                  setEditingEvent({
                    ...editingEvent,
                    description: e.target.value,
                  })
                }
                className="p-2 border rounded w-full"
              />
            </div>
            <div className="mt-4 flex justify-end gap-3">
              <Button
                title="Cancel"
                className="bg-gray-200 text-gray-700"
                onClick={() => setEditingEvent(null)}
              />
              <Button
                title="Save"
                className="bg-primary text-white"
                onClick={handleEditSave}
              />
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deletingEvent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-20 p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm text-center">
            <h2 className="text-lg font-semibold">
              Delete "{deletingEvent.title}"?
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              This action cannot be undone.
            </p>
            <div className="mt-4 flex justify-center gap-3">
              <Button
                title="Cancel"
                className="bg-gray-200 text-gray-700"
                onClick={() => setDeletingEvent(null)}
              />
              <Button
                title="Delete"
                className="bg-red-600 text-white"
                onClick={handleDeleteConfirm}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
