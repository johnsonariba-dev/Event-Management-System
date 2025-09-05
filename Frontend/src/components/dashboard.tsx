import { IoCreateOutline } from "react-icons/io5";
import { FaCircle } from "react-icons/fa";
import Button from "./button";
import { useState } from "react";

type Event = {
  id: number;
  day: string;
  month: string;
  name: string;
  location: string;
  dateFull: string;
  image: string;
  sold: string;
  price: string;
  status: string;
};

const initialEvents: Event[] = [
  {
    id: 1,
    day: "12",
    month: "OCT",
    name: "Music Festival",
    location: "Yaoundé",
    dateFull: "Tuesday, 02 Sept. 2025",
    image: "https://via.placeholder.com/80x80",
    sold: "150/250",
    price: "XAF 10,000",
    status: "On Sale",
  },
  {
    id: 2,
    day: "15",
    month: "NOV",
    name: "Tech Conference",
    location: "Douala",
    dateFull: "Friday, 05 Sept. 2025",
    image: "https://via.placeholder.com/80x80",
    sold: "50/200",
    price: "XAF 25,000",
    status: "On Sale",
  },
];

const Dashboard: React.FC = () => {
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");

  const filteredEvents = events.filter((event) => {
    return (
      event.name.toLowerCase().includes(search.toLowerCase()) &&
      (category
        ? event.name.toLowerCase().includes(category.toLowerCase())
        : true) &&
      (price ? event.price.toLowerCase().includes(price.toLowerCase()) : true)
    );
  });

  return (
    <div>
      {/* Welcome */}
      <h1 className="px-7 py-3 text-[4vw] font-bold">
        Welcome{" "}
        <span className="text-[2vw] text-secondary text-italics font-light">
          John Doe
        </span>
      </h1>

      {/* Create Event Card */}
      <div className="p-9 bg-gray-100 flex flex-col items-center justify-center rounded-lg mx-6 mb-10">
        <IoCreateOutline size={33} />
        <h1 className="font-bold text-2xl pt-3">Create a new event</h1>
        <p className="text-xl py-5 text-center">
          Add all your event details, create new tickets, and set up recurring
          events.
        </p>
        <Button title="Create Event" className="bg-black text-white mt-5" />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 px-5 py-4 justify-between">
        <input
          type="text"
          placeholder="Search events ..."
          onChange={(e) => setSearch(e.target.value)}
          className="bg-purple-100 p-3 rounded-lg flex-1"
        />

        <select
          className="bg-purple-100 p-3 rounded-lg"
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
          className="bg-purple-100 p-3 rounded-lg"
          onChange={(e) => setPrice(e.target.value)}
        >
          <option value="">All Organisers</option>
          <option value="free">Appstech</option>
          <option value="paid">ActivSpaces</option>
        </select>
      </div>

      {/* Event List */}
      <div className="w-full px-6 mt-10">
        {/* Header */}
        <div className="flex bg-primary text-white font-bold rounded-t-md px-10 p-4">
          <span className="flex-1">Event</span>
          <div className="flex gap-30">
            <span>Sold</span>
            <span>Price</span>
            <span>Status</span>
          </div>
        </div>

        {/* Rows */}
        {filteredEvents.map((event) => (
          <div
            key={event.id}
            className="flex items-center bg-violet-100 p-4 border-b border-violet-200"
          >
            <div className="flex items-center gap-10 flex-1">
              <div className="flex flex-col text-violet-600 font-bold text-sm w-10 text-center">
                <span>{event.month}</span>
                <span className="text-2xl">{event.day}</span>
              </div>
              <img
                src={event.image}
                alt={event.name}
                className="w-16 h-16 object-cover rounded"
              />
              <div>
                <h3 className="font-bold text-black">{event.name}</h3>
                <p className="text-sm text-gray-600">{event.location}</p>
                <p className="text-sm text-gray-600">{event.dateFull}</p>
              </div>
            </div>
            <div className="flex gap-25">
              <span className="text-gray-700">{event.sold}</span>
              <span className="text-gray-700">{event.price}</span>
              <span className="flex items-center gap-2 text-green-600 font-semibold">
                <FaCircle size={8} /> {event.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
