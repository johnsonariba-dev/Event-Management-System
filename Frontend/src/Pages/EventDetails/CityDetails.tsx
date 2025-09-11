import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { cities } from "./CityLilst";
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
      fetchEvents(foundCity.name);
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
    <>
    <div className="w-full flex flex-col items-center justify-center pb-10">
      <div className="flex bg-secondary/10 rounded-lg gap-7 shadow-lg h-[80vh] p-15 mt-25 w-full">
        <div className="w-[50%] h-full flex-col justify-center items-center py-8 pr-20">
          <p className="text-xl font-semibold" >Events in</p>
          <p className="text-7xl font-bold text-primary pb-5">{city.name}, <span>{city.region}</span></p>
          <p> {city.desc}</p>
        </div>
      <div className="w-[50%] h-full"> 
        <img
          src={city.image}
          alt={city.name}
          className="w-full h-full object-cover rounded-lg"
        />
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
  </>
  );
}

export default CityDetails;
