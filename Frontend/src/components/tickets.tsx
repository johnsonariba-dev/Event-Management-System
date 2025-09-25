import React, { useEffect, useState } from "react";
import axios from "axios";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, placeholder }) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 flex items-center gap-2">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder || "Search..."}
        className="border rounded-2xl px-3 py-2 w-full md:w-80"
      />
      <button
        type="submit"
        className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-secondary"
      >
        Search
      </button>
    </form>
  );
};

interface Ticket {
  id: number;
  event_id: number;
  user_id: number;
  username: string;
  event_title: string;
  quantity: number;
  price: number;
  purchase_date: string;
}

const Tickets: React.FC = () => {

  // State for tickets
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([]);

  // Fetch tickets from backend
 useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token) return;

  axios
    .get<Ticket[]>("http://127.0.0.1:8000/ticket/attendees", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => {
      setTickets(res.data);
      setFilteredTickets(res.data);
    })
    .catch((err) => console.error(err));
}, []);

  // Search tickets
  const handleSearch = (query: string) => {
    if (!query) {
      setFilteredTickets(tickets);
    } else {
      const lower = query.toLowerCase();
      setFilteredTickets(
        tickets.filter(
          (t) =>
            t.event_title.toLowerCase().includes(lower) ||
            t.username.toLowerCase().includes(lower)
        )
      );
    }
  };

  return (
    <div className="rounded-lg shadow w-full p-6 mt-5">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <h2 className="text-xl font-semibold mb-4 md:mb-0">Recent Orders</h2>
        <SearchBar
          onSearch={handleSearch}
          placeholder="Search by event or attendee"
        />
      </div>

      <div className="overflow-x-auto mt-4">
        <table className="text-sm w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2">Order ID</th>
              <th className="px-4 py-2">Event</th>
              <th className="px-4 py-2">Attendee</th>
              <th className="px-4 py-2">Quantity</th>
              <th className="px-4 py-2">Total</th>
              <th className="px-4 py-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredTickets.map((ticket) => (
              <tr key={ticket.id} className="border-b hover:bg-gray-50">
                <td className=" py-4 pl-20">{ticket.id}</td>
                <td className="px-4 py-4 pl-20">{ticket.event_title}</td>
                <td className="px-4 py-4 pl-10">{ticket.username}</td>
                <td className="px-4 py-4 pl-20">{ticket.quantity}</td>
                <td className="px-4 py-4 pl-20">{ticket.price.toFixed(2)}FCFA</td>
                <td className="px-4 py-4 pl-20">
                  {new Date(ticket.purchase_date).toLocaleString()}
                </td>
              </tr>
            ))}
            {filteredTickets.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-4 text-gray-500">
                  No tickets found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Tickets;
