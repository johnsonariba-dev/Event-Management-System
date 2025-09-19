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
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder || "Search events..."}
        className="border rounded-3xl h-8 p-2 text-xs w-70"
      />
    </form>
  );
};

export const EventApproval: React.FC = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [filter, setFilter] = useState<string>("All");
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

  const filteredEvents =
    filter === "All" ? events : events.filter((e) => e.status === filter);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Event Management</h1>
        <p className="font-light text-sm">
          Review and approve events before they go live
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4 p-4">
        <div className="border rounded-lg p-4">
          <p>Pending</p>
          <span className="font-bold text-2xl">{stats.pending}</span>
        </div>
        <div className="border rounded-lg p-4">
          <p>Approved</p>
          <span className="font-bold text-2xl">{stats.approved}</span>
        </div>
        <div className="border rounded-lg p-4">
          <p>Rejected</p>
          <span className="font-bold text-2xl">{stats.rejected}</span>
        </div>
        <div className="border rounded-lg p-4">
          <p>Total Events</p>
          <span className="font-bold text-2xl">{stats.total}</span>
        </div>
      </div>

      {/* Event List Table */}
      <div className="shadow bg-white rounded-lg p-6 space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="font-bold text-xl">Events List</h2>
            <p className="text-xs font-light">Review and manage event approvals</p>
          </div>
          <div className="flex items-center gap-2">
            <SearchBar onSearch={(query) => console.log("Search:", query)} />
            <select
              className="border rounded-3xl text-xs p-2"
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

        <table className="w-full border border-gray-400 rounded-lg">
          <thead>
            <tr className="text-sm font-medium">
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
              <tr key={event.id} className="text-sm border border-gray-400">
                <td className="px-6 py-2">
                  {event.title} <br />
                  <div className="text-xs font-light">{event.category}</div>
                </td>
                <td className="px-6 py-2">{event.organizer.username}</td>
                <td className="px-6 py-2">
                  {event.date} <br /> {event.venue}
                </td>
                <td className="px-6 py-2">{event.capacity_max}</td>
                <td className="px-6 py-2">{event.ticket_price} FCFA</td>
                <td className="px-6 py-2">{event.status}</td>
                <td className="px-6 py-5 flex gap-5 ">
          
                  <button
                    onClick={() => handleStatusUpdate(event.id, "Approved")}
                    className="text-xs px-2 py-2 rounded-full bg-green-200"
                  >
                    <FaCheck size={20}/>
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(event.id, "Rejected")}
                    className="text-xs px-2 py-2 rounded-full bg-red-200"
                  >
                    <ImCross size={18}/>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
