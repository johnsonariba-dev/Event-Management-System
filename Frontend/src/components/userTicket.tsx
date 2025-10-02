import { useState, useEffect } from "react";
import axios from "axios";
import {
  FaDownload,
  FaInfoCircle,
  FaCheck,
  FaTimes,
  FaTicketAlt,
} from "react-icons/fa";
import Button from "./button";
import { useAuth } from "../Pages/Context/UseAuth";
import { useNavigate } from "react-router-dom";
import { useModalAlert } from "./ModalContext";


interface Ticket {
  id: string;
  event_title: string;
  event_id: number,
  purchase_date: string;
  venue: string;
  quantity: number;
  status: "Active" | "Used" | "Cancelled";
}

const UserTicket: React.FC = () => {
  const navigate = useNavigate();
  const modal = useModalAlert();
  const { token } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchTickets = async () => {
      if (!token) return;
      setLoading(true);
      setError("");

      try {
        const res = await axios.get<Ticket[]>(
          "http://127.0.0.1:8000/ticket/me",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setTickets(res.data);
        console.log(res.data);
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          console.error(
            "Failed to fetch tickets:",
            err.response?.data || err.message
          );
        } else {
          console.error("Unexpected error:", err);
        }
        setError("Unable to load tickets. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [token]);

  const getStatusStyle = (status: Ticket["status"]) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-700 flex items-center gap-1";
      case "Used":
        return "bg-gray-100 text-gray-700 flex items-center gap-1";
      case "Cancelled":
        return "bg-red-100 text-red-700 flex items-center gap-1";
      default:
        return "";
    }
  };

  if (loading)
    return (
      <p className="text-center mt-10 text-gray-600">Loading tickets...</p>
    );
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (!tickets.length)
    return (
      <p className="text-center mt-10 text-gray-600">
        You have no tickets yet.
      </p>
    );

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h1 className="text-2xl font-bold text-primary mb-8 flex items-center gap-2">
        <FaTicketAlt /> My Tickets
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tickets.map((ticket) => (
          <div
            key={ticket.id}
            className="bg-white shadow-lg rounded-2xl p-6 border border-primary/10 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <h2 className="text-lg font-semibold text-primary mb-2">
                {ticket.event_title}
              </h2>

              <p className="text-sm text-gray-600 mb-1">
                <span className="font-medium">Date:</span>{" "}
                {ticket.purchase_date}
              </p>
              <p className="text-sm text-gray-600 mb-3">
                <span className="font-medium">Venue:</span> {ticket.venue}
              </p>

              <p className="text-xs text-gray-500 mb-3">
                Ticket ID: {ticket.id}
              </p>

              <span
                className={`inline-block px-3 py-1 text-sm font-medium rounded-full mb-4 ${getStatusStyle(
                  ticket.status
                )}`}
              >
                {ticket.status === "Active" && <FaCheck />}
                {ticket.status === "Used" && <FaInfoCircle />}
                {ticket.status === "Cancelled" && <FaTimes />}
                {ticket.status}
              </span>
            </div>

            <div className="flex gap-3 mt-2 flex-wrap">
              <Button
                title="View Details"
                icon={<FaInfoCircle />}
                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition flex-1"
                onClick={() =>
                  navigate(`/event/${ticket.event_id}?ticket_id=${ticket.id}`)
                }
              />

              {ticket.status === "Active" && (
                <Button
                  title="Download"
                  icon={<FaDownload />}
                  className="bg-secondary text-white px-4 py-2 rounded-lg hover:bg-secondary/90 transition flex-1"
                  onClick={() => modal.show(`Downloading ticket ${ticket.id}` , "close")}
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
