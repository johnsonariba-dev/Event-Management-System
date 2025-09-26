import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Button from "../../components/button";


interface EventType {
  id: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  organizer: string;
  ticket_price: number;
  image_url?: string;
}

export default function BuyTicket() {
  const { eventId } = useParams<{ eventId: string }>();
  const [eventData, setEventData] = useState<EventType | null>(null);
  const [ticketId, setTicketId] = useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch event info
  useEffect(() => {
    fetch(`http://127.0.0.1:8000/events/${eventId}`)
      .then((res) => res.json())
      .then((data: EventType) => setEventData(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [eventId]);

  // Simulate payment
  const handlePayment = async () => {
    if (!eventData) return;

    // Simulate generating a ticket ID after payment
    const generatedTicketId = `TICKET-${Math.floor(Math.random() * 100000)}`;
    setTicketId(generatedTicketId);

    // Create URL for PDF
    const url = `http://127.0.0.1:8000/ticket/${generatedTicketId}?event_id=${eventData.id}`;
    setPdfUrl(url);
  };

  if (loading) return <p className="p-8 text-center">Loading event info...</p>;
  if (!eventData)
    return <p className="p-8 text-center text-red-500">Event not found.</p>;

  return (
    <div className="max-w-4xl w-full pt-40 items-center justify-center mx-auto p-6 flex flex-col gap-6">
      {/* Event info */}
      <div className="w-full h-full flex flex-col items-center justify-center gap-8">
        <div className="bg-gray-100 p-6 rounded-2xl shadow flex flex-col md:flex-row gap-6 items-center">
          {eventData.image_url && (
            <img
              src={eventData.image_url}
              alt={eventData.title}
              className="w-full md:w-1/3 h-48 object-cover rounded-lg shadow-md"
            />
          )}
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-2">{eventData.title}</h1>
            <p className="text-gray-600 mb-1">
              Date: {eventData.date} {eventData.time}
            </p>
            <p className="text-gray-600 mb-1">Venue: {eventData.venue}</p>
            <p className="text-gray-600 mb-1">
              Organizer: {eventData.organizer}
            </p>
            <p className="text-gray-800 font-semibold mt-2">
              Price: £{eventData.ticket_price}
            </p>
          </div>
        </div>
      {/* Payment button */}
      {!pdfUrl && (
        <Button
          title="Pay & Generate Ticket"
          className="bg-secondary text-white hover:bg-primary w-[30vw] py-3 text-lg"
          onClick={handlePayment}
        />
      )}
      </div>


      {/* PDF ticket */}
      {pdfUrl && (
        <div className="w-full  justify-center flex flex-col items-center gap-4">
          <h2 className="text-xl font-bold mb-2">Your Ticket</h2>
          <iframe
            src={pdfUrl}
            width="100%"
            height="600px"
            className="border rounded-xl shadow-md"
            title="Event Ticket"
          />
          <a
            href={pdfUrl}
            download={`ticket_${ticketId}.pdf`}
            className="mt-2 px-4 py-2 bg-primary text-white rounded hover:bg-secondary transition"
          >
            Download Ticket
          </a>
        </div>
      )}
    </div>
  );
}
