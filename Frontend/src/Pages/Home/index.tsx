import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { FiChevronDown } from "react-icons/fi";
import {
  HiArrowRight,
  HiCalendar,
  HiOutlineStar,
  HiUserGroup,
} from "react-icons/hi";
import { FaChartLine, FaPlus } from "react-icons/fa6";
import Button from "../../components/button";
import { cities } from "../EventDetails/CityLilst";

import { useAuth } from "../Context/UseAuth";

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

type CityItem = {
  id: number;
};

function Home() {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { token, role } = useAuth();
  const [showMore, setShowMore] = useState(false);
  const [totalEvents, setTotalEvents] = useState<string>("0");
  const [totalUsers, setTotalUsers] = useState<string>("No attendees");
  const [totalorganizer, setTotalorganizer] = useState<string>("No organizations");
  const [percentRating, setPercentRating] = useState<string>("0");

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
      const scrollAmount = 350;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

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

  const displayedEvents = showMore ? events.slice(0, 10) : events.slice(0, 3);

  const handleViewEvent = (event: EventItem) => {
    if (!token) {
      alert("You must be logged in to view event details");
      navigate("/Login");
      return;
    }
    if (role !== "user" && role !== "admin" && role !== "organizer") {
      alert("Only users can view event details");
      return;
    } else {
      navigate(`/event/${event.id}`);
    }
  };

  const handleCreateEvent = () => {
    if (!token) {
      alert(
        "You must be logged in as an organizer or admin to create an event"
      );
      navigate("/Login");
      return;
    }
    if (role !== "admin" && role !== "organizer") {
      alert("Only admins and organizers can create events");
      return;
    }
    navigate("/CreateEvent");
  };

  const handleViewAll = () => {
    if (!token) {
      alert("You must be logged in to see more events");
      navigate("/Login");
      return;
    }
    if (role !== "user" && role !== "admin" && role !== "organizer") {
      alert("Only users can see more events");
      return;
    }
    if (!showMore) {
      setShowMore(true);
    } else {
      navigate("/Events");
    }
  };

  const handleViewCity = (cityItem: CityItem) => {
    if (!token) {
      alert("You must be logged in to view city details");
      navigate("/Login");
      return;
    }
    if (role !== "user" && role !== "admin" && role !== "organizer") {
      alert("Only users can view city details");
      return;
    } else {
      navigate(`/Cities/${cityItem.id}`);
    }
  };

  // Statistics

  // total events
  useEffect(() => {
    const fetchTotalEvents = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/totalEvents");
        if (!res.ok) throw new Error("Failed to fetch events");
        const data = await res.json();

        setTotalEvents(String(data));
      } catch (error) {
        console.error(error);
      }
    };
    fetchTotalEvents();
  }, []);

  // total users
  useEffect(() => {
    const fetchTotalUsers = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/totalUsers");
        if (!res.ok) throw new Error("Failed to fetch users");
        const data = await res.json();
        setTotalUsers(String(data));
      } catch (error) {
        console.error(error);
      }
    };
    fetchTotalUsers();
  }, []);

  // total organizations
  useEffect(() => {
    const fetchTotalorganizations = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/totalorganizers");
        if (!res.ok) throw new Error("Failed to fetch users");
        const data = await res.json();
        setTotalorganizer(String(data));
      } catch (error) {
        console.error(error);
      }
    };
    fetchTotalorganizations();
  }, []);

  // Percentage Rating
  useEffect(() => {
    const fetchPercentRating = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/rating");
        if (!res.ok) throw new Error("Failed to fetch users");
        const data = await res.json();
        setPercentRating(String(data));
      } catch (error) {
        console.error(error);
      }
    };
    fetchPercentRating();
  }, []);

  return (
    <div className="w-full flex flex-col items-center justify-center overflow-x-hidden">
      {/* Hero Section */}
      <div className="relative w-full h-screen bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-600 overflow-hidden">
        <div className="absolute inset-0 bg-[url(/src/assets/images/hero.png)] bg-cover bg-center brightness-50 animate-fadeIn" />
        <div className="relative w-full h-full flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-[7vw] max-md:text-[10vw] font-extrabold text-white animate-slideInDown">
            <span className="text-secondary">Connect</span> through
            Unforgettable <span className="text-secondary">Events</span>
          </h1>
          <p className="text-[1.5vw] max-md:text-[3vw] text-white font-light mt-4 animate-slideInUp">
            Discover, create, and attend events that matter to you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-sm:items-center text-center mt-6 animate-fadeInDelay">
            <Link to="/Events">
              <Button
                title="Explore Events"
                icon={<HiArrowRight />}
                className="hover:scale-105 transform transition-all duration-500"
              />
            </Link>

            <Button
              icon={<FaPlus />}
              title="Create Event"
              onClick={handleCreateEvent}
              className="hover:scale-110 transform transition-all duration-500"
            />
          </div>
        </div>
      </div>

      {/* Highlight Events */}
      <div className="w-full flex flex-col items-center justify-center p-6 max-md:p-4 mt-12">
        <h1 className="text-[3.5vw] font-bold max-md:text-xl text-center animate-slideInLeft">
          Don't Miss These Amazing Events
        </h1>
        <p className="text-xl text-center font-light mt-2 animate-slideInRight">
          Handpicked events trending and highly rated by our community.
        </p>
      </div>

      {/* Events Grid */}
      <div className="flex flex-wrap justify-center gap-8 px-6 mt-6">
        {isLoading ? (
          <div className="text-xl font-semibold animate-pulse">
            Loading events...
          </div>
        ) : (
          displayedEvents.map((event) => (
            <div
              key={event.id}
              className="relative w-full sm:w-[45%] lg:w-[400px] rounded-3xl overflow-hidden bg-white shadow-xl hover:shadow-2xl transition-transform duration-500 hover:scale-105 group"
            >
              <div className="relative h-64">
                <img
                  src={event.image_url || "/images/placeholder.jpg"}
                  alt={event.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent animate-fadeIn" />
                <div className="absolute top-3 left-3 px-3 py-1 bg-primary/90 text-white rounded-lg text-xs font-semibold animate-bounce">
                  {event.category}
                </div>
                <div className="absolute top-3 right-3 px-3 py-1 bg-secondary/90 text-white rounded-lg text-xs font-semibold animate-bounceDelay">
                  {event.ticket_price === 0
                    ? "Free"
                    : `${event.ticket_price} FCFA`}
                </div>
              </div>
              <div className="p-5 flex flex-col justify-between h-[calc(100%-16rem)]">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 line-clamp-2">
                    {event.title}
                  </h3>
                  <p className="text-gray-400 text-sm mt-1">{event.venue}</p>
                  <p className="text-gray-400 text-sm">
                    {new Date(event.date).toLocaleDateString()}
                  </p>
                  <p className="text-gray-600 text-sm mt-2 line-clamp-3">
                    {event.description}
                  </p>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <Button
                    title="View Details"
                    onClick={() => handleViewEvent(event)}
                    className="bg-primary cursor-pointer text-white px-4 py-2 rounded-lg hover:bg-secondary transition-all duration-500 hover:scale-105"
                  />
                  <span className="text-gray-500 text-xs">
                    {event.capacity_max} Seats
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {!token && (
        <p className="flex hover:underline p-4 text-red-500 font-semibold animate-pulse">
          Login to see all events and access full features.
        </p>
      )}

      <p className="flex hover:underline p-4">
        <button
          onClick={handleViewAll}
          className="text-secondary flex items-center justify-center text-2xl max-md:text-lg animate-bounce"
        >
          {showMore ? "Go to all events" : "View all events"}
          <HiArrowRight className="text-2xl ml-2" />
        </button>
      </p>

      {/* Locations Carousel */}
      <div className="w-full flex flex-col items-center justify-center py-10">
        <div className="w-full flex flex-col items-center justify-center py-6 px-4">
          <h1 className="font-bold text-2xl sm:text-3xl md:text-4xl text-center animate-fadeInUp">
            Our Locations
          </h1>
          <p className="font-light text-center mt-2 sm:mt-4 sm:text-lg animate-fadeInUpDelay">
            Explore events happening in these exciting cities
          </p>
        </div>
        <div className="relative w-full flex group items-center justify-center">
          <div
            ref={scrollRef}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="flex gap-8 md:space-x-6 space-y-4 md:space-y-0 overflow-x-auto overflow-y-hidden scrollbar-hide px-2 py-6 "
          >
            {[...cities, ...cities].map((city) => (
              <div
                key={city.id}
                className="flex-shrink-0 w-[70vw] max-md:w-[40vw] lg:w-80 h-[40vh] md:h-72 lg:h-80 gap-8 rounded-2xl shadow-2xl relative overflow-hidden transform transition-transform duration-500 hover:scale-105"
              >
                <img
                  src={city.image}
                  alt={city.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent animate-fadeIn" />
                <div className="absolute bottom-0 left-0 p-4 sm:p-5 text-white">
                  <h1 className="font-extrabold sm:text-xl md:text-2xl drop-shadow-lg animate-slideInLeft">
                    {city.name}
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-200 mt-1 animate-slideInRight">
                    {city.region}
                  </p>
                </div>
                <button
                  onClick={() => handleViewCity(city)}
                  className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 flex items-center gap-1 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-primary/70 backdrop-blur-sm text-white text-sm font-semibold shadow-md hover:bg-secondary hover:scale-110 transition-all duration-500"
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
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute top-1/2 left-2 -translate-y-1/2 bg-primary/75 rounded-full p-2 shadow hover:scale-110"
          />
          <Button
            title=""
            onClick={() => scroll("right")}
            icon={<ChevronRight size={24} />}
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute top-1/2 right-2 -translate-y-1/2 bg-primary/75 rounded-full p-2 shadow hover:scale-110"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="flex flex-wrap justify-center gap-8 py-16">
        {[
          {
            icon: <HiCalendar />,
            value: totalEvents,
            label: "Events Created",
          },
          {
            icon: <HiUserGroup />,
            value: totalUsers,
            label: "Happy Attendees",
          },
          {
            icon: <FaChartLine />,
            value:  totalorganizer ,
            label: "Organizations",
          },
          {
            icon: <HiOutlineStar />,
            value: percentRating + "%",
            label: "Event Satisfaction",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="w-40 h-40 sm:w-48 sm:h-48 flex flex-col items-center justify-center rounded-2xl  bg-gray-100 shadow-xl text-center transform transition-transform duration-500 hover:scale-110"
          >
            <div className="text-5xl text-primary animate-bounce">
              {stat.icon}
            </div>
            <p className="text-xl font-bold text-primary mt-2">
              {typeof stat.value === "string" ? stat.value : " "}
            </p>
            <p className="text-primary text-sm">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* CTA Section */}
      <div className="w-full flex-col flex  items-center justify-center p-8 gap-8 text-center">
        <h1 className="text-[3vw] max-md:text-2xl font-bold">
          Ready To Create An Event?
        </h1>
        <p className="text-clamp-2 p-2 w-full max-w-3xl text-xl">
          Discover, create, and attend events that matter to you. Join thousands
          of people connecting through shared experiences.
        </p>
        <div className="w-full max-md:flex-col flex items-center justify-center p-8 gap-8">
          <Link to="/Events">
            <Button title="Explore Events" icon={<HiArrowRight />} />
          </Link>
          {token && (role === "admin" || role !== "organizer") && (
            <Button
              onClick={handleCreateEvent}
              title="Create Event"
              icon={<FaPlus />}
              className="px-10 bg-secondary hover:bg-primary "
            />
          )}
        </div>
      </div>

      {/* <div className="px-2 mt-10">
        <h1 className="text-center text-2xl mb-5 max-md:text-xl animate-slideInLeft">
          Recommended for you
        </h1>
        <Recommender userId={1} topN={5} />
      </div> */}
    </div>
  );
}

export default Home;

