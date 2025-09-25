import React, { useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa";
import { ImCross } from "react-icons/im";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

interface EventStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, placeholder }) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="w-full md:w-auto">
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          onSearch(e.target.value); // 🔑 mise à jour en temps réel
        }}
        placeholder={placeholder || "Search events..."}
        className="border rounded-3xl h-8 p-2 text-xs w-full md:w-64"
      />
    </form>
  );
};

export const EventApproval: React.FC = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [filter, setFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>(""); // ✅ query pour la recherche
  const [stats, setStats] = useState<EventStats>({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });

  const fetchEvents = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/events/all");
      const data = await res.json();
      setEvents(data);
    } catch (err) {
      console.error("Error fetching events:", err);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/events/stats");
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  useEffect(() => {
    fetchEvents();
    fetchStats();
  }, []);

  const handleStatusUpdate = async (id: number, status: string) => {
    try {
      await fetch(
        `http://127.0.0.1:8000/admin/events/${id}/status?status=${status}`,
        { method: "PATCH", headers: { "Content-Type": "application/json" } }
      );
      setEvents((prev) =>
        prev.map((event) => (event.id === id ? { ...event, status } : event))
      );
      fetchStats();
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const filteredEvents = events.filter((e) => {
    const matchStatus = filter === "All" || e.status === filter;
    const matchQuery =
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.organizer.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.venue.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchQuery;
  });

  return (
    <div className="space-y-4 p-2 md:p-4">
      {/* Header */}
      <div className="pl-2 md:pl-4">
        <h1 className="text-2xl font-bold">Event Management</h1>
        <p className="font-light text-sm">
          Review and approve events before they go live
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-2 md:p-4">
        <div className="border rounded-lg p-4 flex flex-col">
          <p className="text-sm">Pending</p>
          <span className="font-bold text-xl md:text-2xl">{stats.pending}</span>
        </div>
        <div className="border rounded-lg p-4 flex flex-col ">
          <p className="text-sm">Approved</p>
          <span className="font-bold text-xl md:text-2xl">
            {stats.approved}
          </span>
        </div>
        <div className="border rounded-lg p-4 flex flex-col ">
          <p className="text-sm">Rejected</p>
          <span className="font-bold text-xl md:text-2xl">
            {stats.rejected}
          </span>
        </div>
        <div className="border rounded-lg p-4 flex flex-col">
          <p className="text-sm">Total Events</p>
          <span className="font-bold text-xl md:text-2xl">{stats.total}</span>
        </div>
      </div>

      {/* Event List Table */}
      <div className="shadow bg-white rounded-lg p-4 md:p-6 space-y-4 overflow-x-auto">
        <div className="flex justify-between items-start md:items-center gap-2 md:gap-4">
          <div>
            <h2 className="font-bold text-xl">Events List</h2>
            <p className="text-xs font-light">
              Review and manage event approvals
            </p>
          </div>
          <div className="flex  items-start sm:items-center gap-2">
            <SearchBar onSearch={setSearchQuery} /> {/* ✅ onSearch */}
            <select
              className="border rounded-3xl text-xs p-2 w-full sm:w-auto"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        <table className="w-full min-w-[700px] border border-gray-400 rounded-lg text-xs md:text-sm">
          <thead className="bg-gray-100">
            <tr className="text-left font-medium">
              <th className="px-4 py-2">Event details</th>
              <th className="px-4 py-2">Organizer</th>
              <th className="px-4 py-2">Date & Location</th>
              <th className="px-4 py-2">Attendees</th>
              <th className="px-4 py-2">Price</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEvents.map((event) => (
              <tr key={event.id} className="border-t border-gray-300">
                <td className="px-4 py-2">
                  {event.title} <br />
                  <div className="text-xs font-light">{event.category}</div>
                </td>
                <td className="px-4 py-2">{event.organizer.username}</td>
                <td className="px-4 py-2">
                  {event.date} <br /> {event.venue}
                </td>
                <td className="px-4 py-2">{event.capacity_max}</td>
                <td className="px-4 py-2">{event.ticket_price} FCFA</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded-full font-medium ${
                      event.status?.trim().toLowerCase() === "pending"
                        ? "bg-yellow-200 "
                        : event.status?.trim().toLowerCase() === "approved"
                        ? "bg-green-200 "
                        : "bg-red-200 "
                    }`}
                  >
                    {event.status}
                  </span>
                </td>
                <td className="px-4 py-2 flex gap-2 md:gap-3">
                  <button
                    onClick={() => handleStatusUpdate(event.id, "Approved")}
                    className="p-2 rounded-full bg-green-200 hover:bg-green-300 transition-colors"
                  >
                    <FaCheck size={18} />
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(event.id, "Rejected")}
                    className="p-2 rounded-full bg-red-200 hover:bg-red-300 transition-colors"
                  >
                    <ImCross size={16} />
                  </button>
                </td>
              </tr>
            ))}

            {filteredEvents.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center text-gray-500 py-4">
                  No matching events found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
