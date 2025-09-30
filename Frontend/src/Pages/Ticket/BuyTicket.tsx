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

  const handlePayment = async () => {
    if (!eventData) return;

    const generatedTicketId = `TICKET-${Math.floor(Math.random() * 100000)}`;
    setTicketId(generatedTicketId);

    const url = `http://127.0.0.1:8000/ticket/${generatedTicketId}?event_id=${eventData.id}`;
    setPdfUrl(url);
  };

  if (loading) return <p className="p-8 text-center">Loading event info...</p>;
  if (!eventData)
    return <p className="p-8 text-center text-red-500">Event not found.</p>;

  return (
    <div className="max-w-4xl w-full pt-24 md:pt-40 mx-auto p-4 md:p-6 flex max-md:flex-col gap-6">
      {/* Event info */}
      <div className="max-w-4xl w-full mx-auto p-4 flex max-md:flex-col gap-6">
        <div className="w-full flex max-md:flex-col bg-gray-100 rounded-2xl shadow p-4 gap-4">
          {/* Event image */}
          {eventData?.image_url && (
            <img
              src={
                eventData.image_url.startsWith("http")
                  ? eventData.image_url
                  : `http://127.0.0.1:8000${eventData.image_url}`
              }
              alt={eventData.title}
              className="w-full md:w-1/3 h-auto object-contain rounded-lg"
            />
          )}

          {/* Event details */}
          <div className="flex-1 flex flex-col justify-start gap-2">
            <h1 className="text-xl md:text-2xl font-bold">
              {eventData?.title}
            </h1>
            <p className="text-sm md:text-base text-gray-700">
              Date: {eventData?.date} {eventData?.time}
            </p>
            <p className="text-sm md:text-base text-gray-700">
              Venue: {eventData?.venue}
            </p>
            <p className="text-sm md:text-base text-gray-700">
              Organizer: {eventData?.organizer}
            </p>
            <p className="text-sm md:text-base font-semibold">
              Price: £{eventData?.ticket_price || 0}
            </p>
          </div>
        </div>

        {/* Payment button */}
        {!pdfUrl && (
          <Button
            title="Pay & Generate Ticket"
            className="bg-secondary text-white hover:bg-primary w-full md:w-1/3 py-2 text-base md:text-lg self-center"
            onClick={handlePayment}
          />
        )}
      </div>

      {/* PDF ticket */}
      {pdfUrl && (
        <div className="w-full flex flex-col items-center gap-4">
          <h2 className="text-lg md:text-xl font-bold mb-2">Your Ticket</h2>
          <iframe
            src={pdfUrl}
            width="100%"
            height="400px"
            className="md:h-[600px] border rounded-xl shadow-md"
            title="Event Ticket"
          />
          <a
            href={pdfUrl}
            download={`ticket_${ticketId}.pdf`}
            className="mt-2 px-4 py-2 bg-primary text-white rounded hover:bg-secondary transition text-sm md:text-base"
          >
            Download Ticket
          </a>
        </div>
      )}
    </div>
  );
}
