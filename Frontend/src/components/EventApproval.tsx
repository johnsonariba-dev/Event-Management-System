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
          onSearch(e.target.value);
        }}
        placeholder={placeholder || "Search events..."}
        className="border rounded-3xl h-9 px-3 text-sm w-full md:w-64"
      />
    </form>
  );
};

export const EventApproval: React.FC = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [filter, setFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [stats, setStats] = useState<EventStats>({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 5;

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

  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);
  const indexOfLast = currentPage * eventsPerPage;
  const indexOfFirst = indexOfLast - eventsPerPage;
  const currentEvents = filteredEvents.slice(indexOfFirst, indexOfLast);

  return (
    <div className="space-y-4 p-2 max-md:pt-15 md:p-4">
      {/* Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold">Event Management</h1>
        <p className="font-light text-sm">
          Review and approve events before they go live
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {["pending", "approved", "rejected", "total"].map((key) => (
          <div key={key} className="border rounded-lg p-3 md:p-4 flex flex-col">
            <p className="text-xs md:text-sm capitalize">
              {key === "total" ? "Total Events" : key}
            </p>
            <span className="font-bold text-lg md:text-2xl">
              {stats[key as keyof EventStats]}
            </span>
          </div>
        ))}
      </div>

      {/* Event List Table */}
      <div className="shadow bg-white rounded-lg p-3 md:p-6 space-y-4 overflow-x-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 md:gap-4 flex-wrap">
          <div>
            <h2 className="font-bold text-lg md:text-xl">Events List</h2>
            <p className="text-xs font-light">
              Review and manage event approvals
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto flex-wrap">
            <SearchBar onSearch={setSearchQuery} />
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

        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] sm:min-w-[700px] md:min-w-[800px] border border-gray-300 rounded-lg text-xs md:text-sm table-auto">
            <thead className="bg-gray-100">
              <tr className="text-left font-medium">
                <th className="px-3 md:px-4 py-2">Event details</th>
                <th className="px-3 md:px-4 py-2">Organizer</th>
                <th className="px-3 md:px-4 py-2">Date & Location</th>
                <th className="px-3 md:px-4 py-2">Attendees</th>
                <th className="px-3 md:px-4 py-2">Price</th>
                <th className="px-3 md:px-4 py-2">Status</th>
                <th className="px-3 md:px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentEvents.map((event) => (
                <tr key={event.id} className="border-t border-gray-200">
                  <td className="px-3 md:px-4 py-2">
                    <div className="flex flex-col">
                      <span>{event.title}</span>
                      <span className="text-xs font-light">{event.category}</span>
                    </div>
                  </td>
                  <td className="px-3 md:px-4 py-2">{event.organizer.username}</td>
                  <td className="px-3 md:px-4 py-2">
                    <div className="flex flex-col">
                      <span>{event.date}</span>
                      <span className="text-xs font-light">{event.venue}</span>
                    </div>
                  </td>
                  <td className="px-3 md:px-4 py-2">{event.capacity_max}</td>
                  <td className="px-3 md:px-4 py-2">{event.ticket_price} FCFA</td>
                  <td className="px-3 md:px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded-full font-medium ${
                        event.status?.trim().toLowerCase() === "pending"
                          ? "bg-yellow-200"
                          : event.status?.trim().toLowerCase() === "approved"
                          ? "bg-green-200"
                          : "bg-red-200"
                      }`}
                    >
                      {event.status}
                    </span>
                  </td>
                  <td className="px-3 md:px-4 py-2 flex gap-2 md:gap-3 flex-wrap">
                    <button
                      onClick={() => handleStatusUpdate(event.id, "Approved")}
                      className="p-2 rounded-full bg-green-200 hover:bg-green-300 transition-colors"
                    >
                      <FaCheck size={16} />
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(event.id, "Rejected")}
                      className="p-2 rounded-full bg-red-200 hover:bg-red-300 transition-colors"
                    >
                      <ImCross size={14} />
                    </button>
                  </td>
                </tr>
              ))}
              {currentEvents.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center text-gray-500 py-4">
                    No matching events found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-wrap justify-center gap-2 mt-6 items-center py-5">
            <button
              className={`px-2 md:px-3 py-1 rounded-full border text-xs md:text-sm ${
                currentPage === 1
                  ? "text-gray-400 border-gray-300 cursor-not-allowed"
                  : "border-purple-500 text-purple-500"
              }`}
              onClick={() =>
                currentPage > 1 && setCurrentPage(currentPage - 1)
              }
              disabled={currentPage === 1}
            >
              &lt;
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(
                (page) =>
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
              )
              .map((page, idx, arr) => (
                <span key={page}>
                  {idx > 0 && page - arr[idx - 1] > 1 && (
                    <span className="px-1 md:px-2">...</span>
                  )}
                  <button
                    className={`px-2 md:px-3 py-1 rounded-full border text-xs md:text-sm ${
                      currentPage === page
                        ? "bg-purple-500 text-white border-purple-500"
                        : "text-purple-500 border-purple-500"
                    }`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                </span>
              ))}

            <button
              className={`px-2 md:px-3 py-1 rounded-full border text-xs md:text-sm ${
                currentPage === totalPages
                  ? "text-gray-400 border-gray-300 cursor-not-allowed"
                  : "border-purple-500 text-purple-500"
              }`}
              onClick={() =>
                currentPage < totalPages && setCurrentPage(currentPage + 1)
              }
              disabled={currentPage === totalPages}
            >
              &gt;
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
