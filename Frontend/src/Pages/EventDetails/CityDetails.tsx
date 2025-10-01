import { useParams, NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import { cities } from "./CityLilst";
import { FaLocationDot } from "react-icons/fa6";
import Button from "../../components/button";
import Pagination from "../../components/pagination"; // ✅ import pagination

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
  const [loading, setLoading] = useState(true);

  // ✅ pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 6;

  useEffect(() => {
    const foundCity = cities.find((c) => c.id === Number(id));
    setCity(foundCity || null);

    if (foundCity) {
      fetchEvents(foundCity.name);
    }
  }, [id]);

  const fetchEvents = async (cityName: string) => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://127.0.0.1:8000/events/city/${encodeURIComponent(cityName)}`
      );
      if (!response.ok) {
        console.error("Failed to fetch city events");
        setEvents([]);
        return;
      }
      const data = await response.json();
      setEvents(data);
      setCurrentPage(1); // reset to first page
    } catch (err) {
      console.error("Error fetching events:", err);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  if (!city) return <div>City not found</div>;

  // ✅ Pagination logic
  const totalPages = Math.ceil(events.length / eventsPerPage);
  const currentEvents = events.slice(
    (currentPage - 1) * eventsPerPage,
    currentPage * eventsPerPage
  );

  return (
    <div className="w-full flex flex-col items-center justify-center pb-10">
      {/* City Header */}
      <div
        className="flex max-md:flex-col text-white md:gap-7 shadow-lg md:h-[85vh] max-md:h-screen p-5 mt-10 w-full bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${city.image})`,
        }}
      >
        {/* City Intro */}
        <div className="md:w-[50%] h-full flex flex-col gap-5 justify-center items-center max-md:pt-27 md:py-20 md:pr-20 text-center md:text-left">
          <p className="md:text-7xl text-4xl font-bold pb-5">
            {city.name},{" "}
            <span className="md:text-7xl text-4xl">{city.region}</span>
          </p>
          <p className="md:text-lg text-sm">{city.desc}</p>
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
        <h2 className="text-2xl md:text-3xl font-semibold">Upcoming Events</h2>
        <div className="mt-5 flex flex-wrap justify-evenly gap-8">
          {loading ? (
            <p className="md:text-lg text-sm">Loading events...</p>
          ) : events.length > 0 ? (
            <>
              {currentEvents.map((event) => (
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
                    <h3 className="font-bold md:text-lg text-base">
                      {event.title}
                    </h3>
                    <p className="text-gray-600 md:text-sm text-xs mt-1 line-clamp-2">
                      {event.description}
                    </p>
                    <p className="mt-3 md:text-sm text-xs flex gap-2 items-center pb-3">
                      <FaLocationDot color="purple" /> {event.venue}
                    </p>
                    <p className="text-gray-800 font-medium md:text-sm text-xs pb-2">
                      {event.ticket_price === 0
                        ? "Free"
                        : `${event.ticket_price} FCFA`}
                    </p>
                    <div className="flex justify-end">
                      <NavLink to={`/event/${event.id}`}>
                        <Button
                          title="View Details"
                          className="bg-secondary hover:bg-primary text-white px-4 py-2 rounded-lg text-sm md:text-base"
                        />
                      </NavLink>
                    </div>
                  </div>
                </div>
              ))}

              {/* ✅ Use shared Pagination component */}
              <div className="w-full flex justify-center mt-8">
                {totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                )}
              </div>
            </>
          ) : (
            <p className="md:text-base text-sm">No events found for this city.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default CityDetails;
