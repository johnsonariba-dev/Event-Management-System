import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { FiChevronDown } from "react-icons/fi";
import { HiArrowRight, HiCalendar, HiOutlineStar, HiUserGroup } from "react-icons/hi";
import { FaChartLine } from "react-icons/fa6";
import Button from "../../components/button";
import { cities } from "../EventDetails/CityLilst";
import Recommender from "../../components/recommend";

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

  // Smooth horizontal auto-scroll
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let animationFrameId: number;

    const scrollStep = () => {
      if (!isHovered) {
        scrollContainer.scrollLeft += 1;
        if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth / 2) {
          scrollContainer.scrollLeft = 0;
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
        const res = await fetch("http://127.0.0.1:8000/events");
        if (!res.ok) throw new Error("Failed to fetch events");
        const data: EventItem[] = await res.json();
        setEvents(data);
      } catch (err) {
        console.error(err);
        setEvents([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div className="w-full flex flex-col items-center justify-center overflow-x-hidden">
      {/* Hero Section */}
      <div className="relative w-full bg-accent">
        <div className="absolute inset-0 bg-[url(/src/assets/images/hero.png)] bg-cover brightness-40" />
        <div className="relative w-full h-screen flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-[7vw] font-bold text-white max-md:text-[10vw]">
            <span className="text-primary">Connect</span> through Unforgettable{" "}
            <span className="text-secondary">Events</span>
          </h1>
          <p className="text-[1.5vw] max-md:text-[3vw] text-white pb-4">
            Discover, create, and attend events that matter to you. Join thousands of people connecting through shared experiences.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-sm:items-center text-center p-4">
            <Link to="/Events">
              <Button title="Explore Events" icon={<HiArrowRight />} />
            </Link>
            <Link to="/CreateEvents">
              <Button title="Create Your Events" icon={<HiArrowRight />} className="bg-secondary hover:bg-primary" />
            </Link>
          </div>
        </div>
      </div>

      {/* Highlight Events */}
      <div className="w-full flex flex-col items-center justify-center p-6 max-md:p-4">
        <h1 className="text-[3.5vw] font-bold max-md:text-xl text-center">Don't Miss These Amazing Events</h1>
        <p className="text-xl text-center font-light">Handpicked events trending and highly rated by our community.</p>
      </div>
{/* Events */}
<div className="flex flex-wrap justify-center gap-8 px-6">
  {isLoading ? (
    <div>Loading events...</div>
  ) : (
    events.slice(0, 2).map((event) => (
      <div
        key={event.id}
        className="relative w-full sm:w-[45%] lg:w-[400px] rounded-2xl overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all duration-300"
      >
        {/* Event image */}
        <div className="relative h-64">
          <img
            src={event.image_url || "/images/placeholder.jpg"}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute top-3 left-3 px-3 py-1 bg-primary/90 text-white rounded-lg text-xs font-semibold">
            {event.category}
          </div>
          <div className="absolute top-3 right-3 px-3 py-1 bg-secondary/90 text-white rounded-lg text-xs font-semibold">
            {event.ticket_price === 0 ? "Free" : `${event.ticket_price} FCFA`}
          </div>
        </div>

        {/* Event content */}
        <div className="p-5 flex flex-col justify-between h-[calc(100%-16rem)]">
          <div>
            <h3 className="text-xl font-bold text-gray-900 line-clamp-2">{event.title}</h3>
            <p className="text-gray-400 text-sm mt-1">{event.venue}</p>
            <p className="text-gray-400 text-sm">{new Date(event.date).toLocaleDateString()}</p>
            <p className="text-gray-600 text-sm mt-2 line-clamp-3">{event.description}</p>
          </div>
          <div className="mt-4 flex justify-between items-center">
            <Link to={`/Event/${event.id}`}>
              <Button
                title="View Details"
                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-secondary transition"
              />
            </Link>
            <span className="text-gray-500 text-xs">{event.capacity_max} Seats</span>
          </div>
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition duration-300 rounded-2xl" />
      </div>
    ))
  )}
</div>


      <p className="flex hover:underline p-4">
        <Link to="/Events" className="text-secondary flex items-center justify-center text-2xl max-md:text-lg">
          View all events<HiArrowRight className="text-2xl ml-2" />
        </Link>
      </p>

      {/* Locations Carousel */}
      <div className="w-full flex flex-col items-center justify-center py-10">
        <div className="w-full flex flex-col items-center justify-center py-6 px-4">
          <h1 className="font-bold text-2xl sm:text-3xl md:text-4xl text-center">Our Locations</h1>
          <p className="font-light text-center mt-2 sm:mt-4 sm:text-lg">Explore events happening in these exciting cities</p>
        </div>

        <div className="relative w-full flex group items-center justify-center">
          <div
            ref={scrollRef}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="flex flex-nowrap md:flex-row flex-col md:space-x-6 space-y-4 md:space-y-0 overflow-x-auto overflow-y-hidden scrollbar-hide px-2 py-6"
          >
            {[...cities, ...cities].map((city) => (
              <div
                key={city.id}
                className="flex-shrink-0 w-[80vw] max-md:w-full lg:w-80 h-[40vh] md:h-72 lg:h-80 rounded-2xl shadow-lg relative overflow-hidden transform transition-transform duration-300 hover:scale-105"
              >
                <img src={city.image} alt={city.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-4 sm:p-5 text-white">
                  <h1 className="font-extrabold sm:text-xl md:text-2xl drop-shadow-md">{city.name}</h1>
                  <p className="text-xs sm:text-sm text-gray-200 mt-1">{city.region}</p>
                </div>
                <button
                  onClick={() => navigate(`/cities/${city.id}`)}
                  className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 flex items-center gap-1 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-primary/70 backdrop-blur-sm text-white text-sm font-semibold shadow-md hover:bg-secondary hover:scale-105 transition-all duration-300"
                >
                  Explore <FiChevronDown className="animate-bounce" size={18} />
                </button>
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
      <div className="flex flex-wrap justify-center gap-8 py-16">
        {[
          { icon: <HiCalendar />, value: "10,000+", label: "Events Created" },
          { icon: <HiUserGroup />, value: "250,000+", label: "Happy Attendees" },
          { icon: <FaChartLine />, value: "1,500+", label: "Organizations" },
          { icon: <HiOutlineStar />, value: "98%", label: "Event Satisfaction" },
        ].map((stat, i) => (
          <div
            key={i}
            className="w-40 h-40 sm:w-48 sm:h-48 flex flex-col items-center justify-center rounded-2xl bg-gray-100 shadow-md text-center"
          >
            <div className="text-5xl text-primary">{stat.icon}</div>
            <p className="text-xl font-bold text-primary mt-2">{stat.value}</p>
            <p className="text-gray-600 text-sm">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* CTA Section */}
      <div className="w-full flex flex-col items-center justify-center p-8 text-center">
        <h1 className="text-[3vw] max-md:text-2xl font-bold">Ready To Create An Event?</h1>
        <p className="text-clamp-2 p-2 w-full max-w-3xl">
          Discover, create and attend the event that matters to you. Join thousands of people connecting through shared experiences.
        </p>
        <div className="w-full max-md:flex-col flex items-center justify-center p-8 gap-8">
          <Link to="/Events">
            <Button title="Explore Events" icon={<HiArrowRight />} />
          </Link>
          <Link to="/CreateEvents">
            <Button title="Create Your Events" icon={<HiArrowRight />} className="bg-secondary hover:bg-primary" />
          </Link>
        </div>
      </div>
      <div className="px-2">
        <h1 className="text-center text-2xl mb-5 max-md:text-xl">Recommended for you</h1>
          <Recommender userId={1} topN={5} />
      </div>
    </div>
  );
}

export default Home;
