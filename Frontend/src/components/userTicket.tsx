import { useState } from "react";
import Button from "./button";

interface Ticket {
  id: string;
  event: string;
  date: string;
  venue: string;
  status: "Active" | "Used" | "Cancelled";
}

const UserTicket: React.FC = () => {
  const [tickets] = useState<Ticket[]>([
    {
      id: "TCK12345",
      event: "Tech Conference 2025",
      date: "Oct 10, 2025",
      venue: "Yaoundé Convention Center",
      status: "Active",
    },
    {
      id: "TCK67890",
      event: "Music Festival",
      date: "Aug 22, 2025",
      venue: "Douala Arena",
      status: "Used",
    },
    {
      id: "TCK54321",
      event: "Startup Meetup",
      date: "Nov 15, 2025",
      venue: "Buea Hub",
      status: "Cancelled",
    },
  ]);

  const getStatusStyle = (status: Ticket["status"]) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-700";
      case "Used":
        return "bg-gray-100 text-gray-700";
      case "Cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "";
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <h1 className="text-2xl font-bold text-primary mb-8">My Tickets</h1>

      {/* Ticket List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tickets.map((ticket) => (
          <div
            key={ticket.id}
            className="bg-white shadow-md rounded-2xl p-6 border border-primary/10 hover:shadow-lg transition"
          >
            {/* Event Title */}
            <h2 className="text-lg font-semibold text-primary mb-2">
              {ticket.event}
            </h2>

            {/* Date & Venue */}
            <p className="text-sm text-gray-600 mb-1">
              <span className="font-medium">Date:</span> {ticket.date}
            </p>
            <p className="text-sm text-gray-600 mb-3">
              <span className="font-medium">Venue:</span> {ticket.venue}
            </p>

            {/* Ticket ID */}
            <p className="text-xs text-gray-500 mb-3">
              Ticket ID: {ticket.id}
            </p>

            {/* Status */}
            <span
              className={`inline-block px-3 py-1 text-sm font-medium rounded-full mb-4 ${getStatusStyle(
                ticket.status
              )}`}
            >
              {ticket.status}
            </span>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                title="View Details"
                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition"
                onClick={() => alert(`Viewing ${ticket.event}`)}
              />
              {ticket.status === "Active" && (
                <Button
                  title="Download"
                  className="bg-secondary text-white px-4 py-2 rounded-lg hover:bg-secondary/90 transition"
                  onClick={() => alert(`Downloading ${ticket.id}`)}
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserTicket;
