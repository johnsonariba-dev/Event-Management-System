import React, { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react"; // nice icons
import { Link } from "react-router-dom";
import {
  HiArrowRight,
  HiCalendar,
  HiOutlineStar,
  HiUserGroup,
} from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import Button from "../../components/button";
import { FaChartLine } from "react-icons/fa6";
import { cities } from "../EventDetails/CityLilst";


type EventItem = {
  id: number;
  title: string;
  description: string;
  date: string;
  venue: string;
  ticket_price: number;
  category: string;
  image_url: string;
  capacity_max: number;
  country?: string;
};



function Home() {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Smooth auto scroll
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let animationFrameId: number;

    const scrollStep = () => {
      if (!isHovered) {
        scrollContainer.scrollLeft += 1; // scroll speed
        if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth / 2) {
          scrollContainer.scrollLeft = 0; // reset to start
        }
      }
      animationFrameId = requestAnimationFrame(scrollStep);
    };

    animationFrameId = requestAnimationFrame(scrollStep);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isHovered]);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Fetch events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch(
          "http://127.0.0.1:8000/event_fake/events"
        );
        if (!res.ok) throw new Error("Failed to fetch events");
        const data: EventItem[] = await res.json();
        setEvents(data);
      } catch (err) {
        console.error(err);
        setEvents([]); // fallback
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="w-full flex flex-col items-center justify-center">
      {/* Hero Section */}
      <div className="relative bg-accent">
        <div className="absolute inset-0 bg-[url(/src/assets/images/hero.png)] bg-cover brightness-40 blue"></div>
        <div className="relative w-full h-screen flex flex-col items-center justify-center text-center">
          <h1 className="text-[7vw] font-bold px-4 text-white max-md:text-[10vw]">
            <span className="text-primary">Connect</span> through Unforgettable{" "}
            <span className="text-secondary">Events</span>{" "}
          </h1>
          <p className="px-4 pb-4 max-md:text-[3vw] text-[1.5vw] text-white">
            Discover, create, and attend events that matter to you. Join
            thousands of people connecting through shared experiences.
          </p>
          <div className="flex gap-8 max-sm:items-center text-center p-8">
            <Link to="/Events">
              <Button
                title="Explore Events"
                icon={<HiArrowRight />}
                type=""
                className="max-md:text-[3vw]"
              />
            </Link>
            <Link to="/CreateEvents">
              <Button
                title="Create Your Events"
                icon={<HiArrowRight />}
                type=""
                className="bg-secondary hover:bg-primary max-md:text-[3vw]"
              />
            </Link>
          </div>
        </div>
      </div>

      {/* Highlight Events */}
      <div className="w-full flex flex-col items-center justify-center p-8 max-md:p-4">
        <h1 className="text-[3.5vw] font-bold max-md:text-xl text-center">
          Don't Miss These Amazing Events
        </h1>
        <p className="text-xl text-center font-light">
          Handpicked events trending and highly rated by our community.
        </p>
        <p className="flex underline p-8">
          <Link
            to="/Events"
            className="text-secondary flex items-center justify-center text-2xl max-md:text-lg"
          >
            View all events <HiArrowRight className="text-2xl ml-2" />
          </Link>
        </p>
      </div>

      {/* Events Grid */}
      <div className="w-full flex max-md:flex-col p-8 gap-10 max-sm:p-2 items-center justify-center">
        <div className="w-full flex max-md:flex-col p-8 gap-10 max-sm:p-2 items-center justify-center">
          {isLoading ? (
            <div>Loading events...</div>
          ) : (
            events.slice(0, 2).map((event) => (
              <div
                key={event.id}
                className="w-[400px] md:w-[450px] lg:w-[500px] border border-secondary rounded-tl-4xl rounded-br-4xl shadow-xl flex flex-col"
              >
                <img
                  src={event.image_url || "/images/placeholder.jpg"}
                  alt={event.title || "Untitled"}
                  className="w-full h-[250px] md:h-[300px] lg:h-[350px] object-cover rounded-tl-4xl"
                />
                <div className="p-4 flex flex-col flex-1">
                  <h1 className="font-bold py-2 text-lg">
                    {event.title || "No Title"}
                  </h1>
                  <p className="pb-2 text-sm md:text-base">
                    {event.venue || "Unknown Country"}
                  </p>
                  <p className="pb-1 font-light">{event.date || "No Date"}</p>
                  <p className="pb-2 font-light">
                    {event.description || "No description available"}
                  </p>
                  <div className="flex justify-end mt-auto">
                    <Link to={`/Event/${event.id}`}>
                      <Button
                        title="View Details"
                        className="bg-secondary hover:bg-primary transition-transform duration-300 hover:scale-105"
                      />
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Upcoming Events Carousel */}
      <div className="w-full flex flex-col items-center justify-center p-2 py-10">
        <div className="w-full flex flex-col items-center justify-center py-15">
          <h1 className="font-bold text-2xl">Our Location</h1>
          <p className="font-light text-center">
            Explore events happening in these exciting cities
          </p>
        </div>
        <div className="relative w-full flex group items-center justify-center">
          <div
            ref={scrollRef}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="w-full flex space-x-8 overflow-x-auto hide-scrollbar scrollbar-hide p-2 py-8"
          >
            {[...cities, ...cities].map((city) => (
              <div
                key={city.id}
                className="w-xs relative max-md:w-[50vw] h-[50vh] flex-shrink-0 rounded-2xl border border-secondary shadow-lg"
              >
                <img
                  src={city.image}
                  alt={city.title}
                  className="w-full h-full object-cover rounded-t-2xl absolute"
                />
                <div className="absolute bottom-0 left-0 inset-0 bg-gradient-to-t from-black/70 to-transparent rounded-t-2xl text-secondary p-4 flex flex-col justify-end">
                  <h1 className="font-bold py-4 px-1 text-2xl">{city.title}</h1>
                  <p className="font-light px-4">{city.date}</p>
                  <p className="font-light px-4 py-4">{city.venue}</p>
                  <div className="w-full flex justify-end p-2">
                    <Button
                      onClick={() => navigate(`/cities/${city.id}`)}
                      title="View Details"
                      className="bg-secondary hover:bg-primary transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Button
            title=""
            onClick={() => scroll("left")}
            icon={<ChevronLeft size={24} />}
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute top-1/2 left-2 -translate-y-1/2 bg-primary/75 rounded-full p-2 shadow"
          />
          <Button
            title=""
            onClick={() => scroll("right")}
            icon={<ChevronRight size={24} />}
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute top-1/2 right-2 -translate-y-1/2 bg-primary/75 rounded-full p-2 shadow"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="w-full flex items-center justify-center py-20">
        <div className="w-full flex flex-wrap items-center justify-center gap-10">
          <div className="w-50 max-md:w-40 max-lg:p-4 rounded-2xl bg-gray-100 flex flex-col items-center justify-center">
            <HiCalendar className="text-9xl text-primary " />
            <p className="text-[3vw] text-primary">10,000+</p>
            <p className="p-2 text-primary">Event Created</p>
          </div>
          <div className="w-50 max-lg:p-4 rounded-2xl bg-gray-100 flex flex-col items-center justify-center">
            <HiUserGroup className="text-9xl text-primary " />
            <p className="text-[2.5vw] text-primary ">250,000+</p>
            <p className="text-primary p-2 max-lg:text-sm">Happy Attendees</p>
          </div>
          <div className="w-50 max-lg:p-4 rounded-2xl bg-gray-100 flex flex-col items-center justify-center">
            <FaChartLine className="text-9xl text-primary " />
            <p className="text-[3vw] text-primary">1,500+</p>
            <p className="text-primary p-2">Organization</p>
          </div>
          <div className="w-50 max-lg:p-4 rounded-2xl bg-gray-100 flex flex-col items-center justify-center">
            <HiOutlineStar className="text-9xl text-primary " />
            <p className="text-[3vw] text-primary">98%</p>
            <p className="text-primary p-2">Event Created</p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="w-full flex flex-col items-center justify-center p-8">
        <div className="w-full flex flex-col items-center justify-center text-center py-20">
          <h1 className="text-[3vw] max-md:text-2xl font-bold">
            Ready To Create An Event?
          </h1>
          <p className="text-clamp-2 p-2 w-[100vw] ">
            Discover, Create and attend the event that matters to you. Join
            thousands of people connecting through shared experience.
          </p>
          <div className="w-full max-md:flex-col flex items-center justify-center p-8 gap-8">
            <Link to="/Events">
              <Button title="Explore Events" icon={<HiArrowRight />} />
            </Link>
            <Link to="/CreateEvents">
              <Button
                title="Create Your Events"
                icon={<HiArrowRight />}
                className="bg-secondary hover:bg-primary"
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
