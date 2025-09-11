import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { cities } from "./CityLilst";
import { FiChevronDown } from "react-icons/fi";
import { NavLink } from "react-router-dom";
import { FaLocationDot } from "react-icons/fa6";
import Button from "../../components/button";

interface Event {
  id: number;
  title: string;
  venue: string;
  date: string;
  description: string;
  image_url: string;
  ticket_price: number;
}

function CityDetails() {
  const { id } = useParams<{ id: string }>();
  const [city, setCity] = useState<(typeof cities)[0] | null>(null);
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const foundCity = cities.find((c) => c.id === Number(id));
    setCity(foundCity || null);

    if (foundCity) {
      fetchEvents(foundCity.venue);
    }
  }, [id]);

  const fetchEvents = async (venue: string) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/events/?venue=${venue}`);
      if (!response.ok){
        return 'failed to fetch';
      }
      const data = await response.json();
      setEvents(data);
    }
    catch(err){
      console.error("Error fetching events:", err);
    }
  }
 
  if (!city) return <div>City not found</div>;

  return (
    <div className="w-full flex flex-col items-center justify-center pb-10">
      <img
        src={city.image}
        alt={city.title}
        className="mt-20 w-[95vw] h-[80vh] shadow-lg rounded-2xl"
      />
      <h1 className="text-4xl bottom-20 absolute font-bold text-secondary hover:bg-white/20 hover:scale-105 transition-transform duration-300 bg-primary/60 px-5 py-2 rounded-lg shadow-lg">
        View all events in {city.title}{" "}
        <FiChevronDown
          className="inline animate-bounce transition-transform duration-300"
          size={54}
        />
      </h1>

      <div className="w-[95vw] flex items-center justify-between px-10 mt-5 bg-primary/10 rounded-lg shadow-lg py-5">
        <div className="flex flex-col">
          <p className="text-xl font-semibold">{city.country}</p>
        </div>
        <div className="flex flex-col items-end space-y-3">
          <p>{city.date}</p>
          <p>{city.venue}</p>
        </div>
      </div>

      <div className="w-[95vw] mt-10">
        <h2 className="text-2xl font-semibold">Upcoming Events</h2>
        <div className="mt-5 space-y-5 flex flex-wrap justify-evenly items-center gap-8">
          {events.length > 0 ? (
            events.slice(0, 5).map((event) => (
            <div
              key={event.id}
              className="bg-white shadow-lg rounded-xl overflow-hidden hover:scale-105 transition-transform w-[25vw] max-md:w-full"
            >
              <img
                src={event.image_url}
                alt={event.title}
                className="h-40 w-full object-cover"
              />
              <div className="p-4">
                <h3 className="font-bold text-lg">{event.title}</h3>
                <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                  {event.description}
                </p>
                <p className="mt-3 text-sm flex gap-2 items-center pb-3">
                  <FaLocationDot color="purple" /> {event.venue}
                </p>
                <p className="text-gray-800 font-medium pb-2">
                  {event.ticket_price === 0 ? "Free" : event.ticket_price}
                </p>
                <div className="flex justify-end">
                  <NavLink to={`/event/${event.id}`}>
                    <Button
                      title="View Details"
                      className="bg-secondary hover:bg-primary text-white px-4 py-2 rounded-lg"
                    />
                  </NavLink>
                </div>
              </div>
            </div>
          ))
          ) : (
            <p>No events found for this city.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default CityDetails;
