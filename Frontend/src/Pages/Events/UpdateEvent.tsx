import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SideBar from "../../components/sideBar";
import Button from "../../components/button";
import axios from "axios";
import { useModalAlert } from "../../components/ModalContext";
const UpdateEvent = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [venue, setVenue] = useState("");
  const [ticketPrice, setTicketPrice] = useState<number>(0);
  const [date, setDate] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [message, setMessage] = useState("");


  const modal = useModalAlert();
  useEffect(() => {
    if (!token) navigate("/login");

    const fetchEvent = async () => {
      try {
        const res = await axios.get(`http://127.0.0.1:8000/events/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const e = res.data;
        setTitle(e.title);
        setDescription(e.description);
        setCategory(e.category);
        setVenue(e.venue);
        setTicketPrice(e.ticket_price);
        setDate(e.date);
        setImageUrl(e.image_url);
      } catch (err) {
        console.error(err);
      }finally{
       modal.show("Error", "Failed to fetch event details.", "Close");
      }
    };
    fetchEvent();
  }, [id, token, navigate]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return modal.show("Not Authenticated", "You must be logged in to update an event.", "Close"), navigate("/Login");

    try {
      await axios.put(
        `http://127.0.0.1:8000/events/${id}`,
        {
          title,
          description,
          category,
          venue,
          ticket_price: ticketPrice,
          date,
          image_url: imageUrl,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("Event updated successfully!");
    } catch (err) {
      console.error(err);
      setMessage("Error updating event");
    }
  };

  return (
    <div className="flex">
      <SideBar />
      <div className="flex-1 p-6 bg-accent min-h-screen">
        <h1 className="text-2xl font-bold mb-6 text-white">Update Event</h1>
        {message && <p className="text-green-400 mb-4">{message}</p>}
        <form
          onSubmit={handleUpdate}
          className="bg-white rounded-2xl shadow-md p-6 flex flex-col gap-4 max-w-xl"
        >
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border p-2 rounded-lg"
            required
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border p-2 rounded-lg"
            required
          />
          <input
            type="text"
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border p-2 rounded-lg"
            required
          />
          <input
            type="text"
            placeholder="Venue"
            value={venue}
            onChange={(e) => setVenue(e.target.value)}
            className="border p-2 rounded-lg"
            required
          />
          <input
            type="number"
            placeholder="Ticket Price"
            value={ticketPrice}
            onChange={(e) => setTicketPrice(Number(e.target.value))}
            className="border p-2 rounded-lg"
            min={0}
            required
          />
          <input
            type="datetime-local"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border p-2 rounded-lg"
            required
          />
          <input
            type="text"
            placeholder="Image URL"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="border p-2 rounded-lg"
          />
          <Button title="Update Event" className="bg-yellow-500 text-white" />
        </form>
      </div>
    </div>
  );
};

export default UpdateEvent;
