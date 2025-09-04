import axios from "axios";
import { useEffect, useState } from "react";
import Button from "../../components/button";

interface eventProps{
  id: number,
  title: string;
  description: string;
  category: string;
  venue: string;
  ticket_price: number;
  date: Date;
  image_url: string;

}

const Events:React.FC<eventProps> = () => {

  const [events, setEvents] = useState<eventProps[]>([]);

  useEffect(() => {
    axios
      .get("http://localhost:8000/events/events")
      .then((res) => {console.log(res.data);
       setEvents(res.data) }
      )
      .catch((err) => console.error("Error fetching events:", err));
  }, []);


  return (
    <div>
      {/* Event hero */}
      <div className="relative bg-accent">
        <div className="absolute inset-0 bg-[url(/src/assets/images/EventHero.png)] bg-cover brightness-30 blur-xs"></div>

        <div className="relative flex flex-col items-center justify-center h-screen text-center">
          <h1 className="text-primary font-bold text-[7vw] pb-10">
            Discover <span className="text-secondary">Events</span>
          </h1>
          <p className="text-gray-300 text-[2vw] max-w-3xl">
            Explore thousands of events happening around you and connect with
            like-minded people
          </p>
        </div>
      </div>

      {/* Filter */}
      <div className="px-6 bg-accent py-20">
        <div className="bg-white shadow-md rounded-2xl flex flex-wrap gap-4 px-5 py-10 justify-between">
          <input
            type="text"
            placeholder="Search events ..."
            className=" bg-purple-100 p-3 rounded-lg flex-1"
          />

          <select className="bg-purple-100 p-3 rounded-lg">
            <option value="">All Categories</option>
            <option value="music">Music</option>
            <option value="tech">Tech</option>
            <option value="art">Art</option>
            <option value="business">Business</option>
            <option value="sports">Sports</option>
          </select>

          <select className="bg-purple-100 p-3 rounded-lg">
            <option value="">All Prices</option>
            <option value="free">Free</option>
            <option value="paid">Paid</option>
          </select>

          <select className="bg-purple-100 p-3 rounded-lg">
            <option value="">Popularity</option>
            <option value="Top rated">Top rated</option>
            <option value="Most viewed">Most viewed</option>
          </select>
        </div>
      </div>

      {/* Event Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {events.map((event) => (
          <div
            key={event.id}
            className="bg-white shadow-lg rounded-xl overflow-hidden hover:scale-105 transition-transform"
          >
            <img
              src={event.image_url}
              alt={event.title}
              className="h-48 w-full object-cover"
            />
            <div className="p-4">
              <h3 className="font-bold text-lg">{event.title}</h3>
              <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                {event.description}
              </p>
              <p className="text-red-500 mt-2 text-sm">  
                📍 {event.venue}
              </p>
              <p className="text-gray-800 font-medium mt-1">
                {event.ticket_price === 0
                  ? "Free"
                  : `$${event.ticket_price}`}
              </p>
              <Button title="View Details"/>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Events;
