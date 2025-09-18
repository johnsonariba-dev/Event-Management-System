import { useEffect, useState } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";
import { IoCreateOutline } from "react-icons/io5";
import { BsThreeDots } from "react-icons/bs";
import { HiOutlineCalendar } from "react-icons/hi";
import { FaLocationDot } from "react-icons/fa6";
import Button from "./button";

interface Event {
  id: number;
  title: string;
  description: string;
  category: string;
  venue: string;
  ticket_price: number;
  date: string;
  status: "Pending" | "Approved" | "Cancelled";
  image_url: string;
}

const Dashboard: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [displayCount, setDisplayCount] = useState(10);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [menuOpenId, setMenuOpenId] = useState<number | null>(null);
<<<<<<< Updated upstream
<<<<<<< HEAD
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [deletingEvent, setDeletingEvent] = useState<Event | null>(null);
  const [userName, setUserName] = useState("");
=======
  const role = localStorage.getItem("role"); 
=======
  const role = localStorage.getItem("role"); 

>>>>>>> Stashed changes

>>>>>>> b0ff3c1 (new install)

  const token = localStorage.getItem("token");

  // Fetch events and user
  useEffect(() => {
    axios
      .get("http://localhost:8000/events/my", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setEvents(res.data))
      .catch((err) => console.error("Error fetching events:", err));

    axios
      .get("http://localhost:8000/user/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUserName(res.data.name))
      .catch((err) => console.error("Error fetching username:", err));
  }, [token]);

  // Filter events
  const filteredEvents = events.filter((event) => {
    return (
      event.title.toLowerCase().includes(search.toLowerCase()) &&
      (category
        ? event.category.toLowerCase() === category.toLowerCase()
        : true) &&
      (price === "free"
        ? event.ticket_price === 0
        : price === "paid"
        ? event.ticket_price > 0
        : true)
    );
  });

<<<<<<< Updated upstream
<<<<<<< HEAD
  // Format date for display
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

  // Convert backend ISO to input value
  const toDateTimeLocal = (d: string) => {
    if (!d) return "";
    const date = new Date(d);
    const tzOffset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - tzOffset).toISOString().slice(0, 16);
  };

  // Edit Event Save
  const handleEditSave = async () => {
    if (!editingEvent) return;
    try {
      const payload = {
        ...editingEvent,
        date: new Date(editingEvent.date).toISOString(), // full ISO for backend
      };
      const res = await axios.put(
        `http://localhost:8000/events/${editingEvent.id}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEvents((prev) =>
        prev.map((ev) => (ev.id === editingEvent.id ? res.data : ev))
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
      await axios.delete(`http://localhost:8000/events/${deletingEvent.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents((prev) => prev.filter((ev) => ev.id !== deletingEvent.id));
      setDeletingEvent(null);
    } catch (err) {
      console.error("Error deleting event:", err);
    }
  };

  // Load more
  const handleSeeMore = () => setDisplayCount((prev) => prev + 10);
=======
=======
>>>>>>> Stashed changes

  const token = localStorage.getItem("token");

  const handleDelete = async (id: number) => {
    if (!token) return;

    if (!window.confirm("Are you sure you want to delete this event?")) return;

    try {
      await axios.delete(`http://127.0.0.1:8000/events/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Remove the deleted event from state
      setEvents((prev) => prev.filter((e) => e.id !== id));
      alert("Event deleted successfully!");
    } catch (err) {
      console.error(err);
      alert("Error deleting event");
    }
  };

<<<<<<< Updated upstream
>>>>>>> b0ff3c1 (new install)
=======
>>>>>>> Stashed changes

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-x-hidden">
      {/* Welcome Header */}
      <h1 className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 py-6 text-3xl sm:text-4xl md:text-5xl font-bold">
        Welcome
        <span className="text-secondary font-light text-xl sm:text-2xl md:text-3xl">
          {userName || "Organizer"}
        </span>
      </h1>

      {/* Create Event Box */}
      <div className="bg-gray-100 flex flex-col items-center justify-center rounded-lg p-6 sm:p-9 mb-10 text-center">
        <IoCreateOutline size={36} />
        <h2 className="font-bold text-xl sm:text-2xl pt-3">
          Create a new event
        </h2>
<<<<<<< Updated upstream
<<<<<<< HEAD
        <p className="text-base sm:text-lg md:text-xl py-4 max-w-md">
=======
        <p className="text-base sm:text-lg md:text-xl py-4">
>>>>>>> b0ff3c1 (new install)
=======
        <p className="text-base sm:text-lg md:text-xl py-4">
>>>>>>> Stashed changes
          Add all your event details, create new tickets, and set up recurring
          events.
        </p>
        <NavLink to="/NewEvent">
          <Button
            title="Create Event"
            className="bg-black text-white mt-3 sm:mt-5"
          />
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

      {/* Event List */}
      <ul className="flex flex-col gap-4">
        {filteredEvents.slice(0, displayCount).map((event) => (
          <li
            key={event.id}
            className="group bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition transform hover:-translate-y-0.5 p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4"
          >
<<<<<<< HEAD
=======
            {/* Checkbox */}
            <input
              type="checkbox"
              className="self-start sm:self-auto w-5 h-5 "
            />

            {/* Thumbnail */}
>>>>>>> b0ff3c1 (new install)
            <img
              src={event.image_url}
              alt={event.title}
              className="w-full sm:w-36 h-40 sm:h-20 rounded-md object-cover max-w-full"
            />
<<<<<<< HEAD
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
=======

            {/* Details */}
            <div className="flex-1 border  flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-4">
              <div className="flex flex-col">
                <h3 className="font-bold text-lg">{event.title}</h3>
                <p className="text-gray-500 text-sm flex items-center gap-1">
                  <FaLocationDot color="blue" /> {event.venue}
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
                    {role === "organizer" || role === "admin" ? (
                      <NavLink to={`/event/update/${event.id}`}>
                        <Button
                          title="Update"
                          className="bg-yellow-500 text-white px-3 py-1 rounded"
                        />
                      </NavLink>
                    ) : null}

                    <Button
                      title="Delete"
                      className="bg-red-600 text-white px-3 py-1 rounded"
                      onClick={() => handleDelete(event.id)}
                    />
<<<<<<< Updated upstream
>>>>>>> b0ff3c1 (new install)
=======
>>>>>>> Stashed changes
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
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <p className="mt-2 text-sm text-gray-600 line-clamp-2 break-words">
                {event.description}
              </p>
            </div>
            <div className="w-full sm:w-auto flex flex-col sm:items-end items-start gap-8">
              <div className="px-3 py-1 border rounded-md text-sm font-medium bg-gray-50">
                {event.ticket_price} FCFA
              </div>
              <span
                className={`px-3 py-1 rounded-xl text-xs font-semibold ${
                  event.status === "Cancelled"
                    ? "bg-red-100 text-red-800"
                    : event.status === "Pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                {event.status}
              </span>
            </div>
          </li>
        ))}
      </ul>

      {/* See More */}
      {displayCount < filteredEvents.length && (
        <div className="flex justify-center mt-6">
          <Button
            title="See More"
            className="bg-primary text-white"
            onClick={handleSeeMore}
          />
        </div>
      )}

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

      {/* Delete Modal */}
      {deletingEvent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-20 p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm text-center">
            <h2 className="text-lg font-semibold">
              Cancel "{deletingEvent.title}"?
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              This action will permanently delete this event.
            </p>
            <div className="mt-4 flex justify-center gap-3">
              <Button
                title="Back"
                className="bg-gray-200 text-gray-700"
                onClick={() => setDeletingEvent(null)}
              />
              <Button
                title="Delete Event"
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
