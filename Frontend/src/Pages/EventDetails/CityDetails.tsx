import { useParams, NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import { cities } from "./CityLilst";
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
      fetchEvents(foundCity.name);
    }
  }, [id]);

  const fetchEvents = async (venue: string) => {
    try {
      const response = await fetch("http://127.0.0.1:8000/event_fake/events"); 
      // adjust API path to your router
      if (!response.ok) {
        console.error("Failed to fetch events");
        return;
      }
      const data = await response.json();

      // Filter events locally by venue (if backend doesn’t support query)
      const filtered = data.filter((ev: Event) => ev.venue === venue);
      setEvents(filtered);
    } catch (err) {
      console.error("Error fetching events:", err);
    }
  };

  if (!city) return <div>City not found</div>;

  return (
    <div className="w-full flex flex-col items-center justify-center pb-10">
      {/* City Header */}
      <div
        className="flex max-md:flex-col text-white md:gap-7 shadow-lg md:h-[85vh] p-5 mt-10 w-full bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${city.image})`,
        }}
      >
        {/* City Intro */}
        <div className="md:w-[50%] h-full flex flex-col gap-5 justify-center items-center py-20 md:pr-20">
          <p className="md:text-7xl text-6xl font-bold pb-5">
            {city.name}, <span>{city.region}</span>
          </p>
          <p className="text-lg">{city.desc}</p>
        </div>

        {/* City Image */}
        <div className="md:w-[50%] h-full">
          <img
            src={city.image}
            alt={city.name}
            className="w-full h-full object-cover max-md:hidden rounded-lg"
          />
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="w-[95%] mt-10 p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold">Upcoming Events</h2>
        <div className="mt-5 flex flex-wrap justify-evenly gap-8">
          {events.length > 0 ? (
            events.slice(0, 5).map((event) => (
              <div
                key={event.id}
                className="bg-white shadow-lg rounded-xl overflow-hidden hover:scale-105 transition-transform sm:w-[48%] md:w-[30%] lg:w-[25%] max-md:w-full"
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
                    {event.ticket_price === 0
                      ? "Free"
                      : `${event.ticket_price} FCFA`}
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
