import React, {useRef, useState, useEffect} from "react";
import { ChevronLeft, ChevronRight } from "lucide-react"; // nice icons
import { Link } from "react-router-dom";
import { HiArrowRight, HiCalendar, HiOutlineStar, HiUserGroup } from "react-icons/hi";
import Button from "../../components/button";
import { FaChartLine } from "react-icons/fa6";

const cards = [
  {
    imge: "/src/assets/images/GES-2 Msc 1.png",
    title: "Appstech Music Festival",
    desc: "Join us for the biggest Music Festival in Cameroon, Come and meet new people, party with your friends and participate t...",
    date: "March 15, 2026 at 2:00 PM",
    location: "Maison Du Parti Bonanjo, Douala",
  },
  {
    imge: "/src/assets/images/GES-2 Msc 1.png",
    title: "Appstech Music Festival",
    desc: "Join us for the biggest Music Festival in Cameroon, Come and meet new people, party with your friends and participate t...",
    date: "March 15, 2026 at 2:00 PM",
    location: "Maison Du Parti Bonanjo, Douala",
  },
  {
    imge: "/src/assets/images/GES-2 Msc 1.png",
    title: "Appstech Music Festival",
    desc: "Join us for the biggest Music Festival in Cameroon, Come and meet new people, party with your friends and participate t...",
    date: "March 15, 2026 at 2:00 PM",
    location: "Maison Du Parti Bonanjo, Douala",
  },
  {
    imge: "/src/assets/images/GES-2 Msc 1.png",
    title: "Appstech Music Festival",
    desc: "Join us for the biggest Music Festival in Cameroon, Come and meet new people, party with your friends and participate t...",
    date: "March 15, 2026 at 2:00 PM",
    location: "Maison Du Parti Bonanjo, Douala",
  },
  {
    imge: "/src/assets/images/GES-2 Msc 1.png",
    title: "Appstech Music Festival",
    desc: "Join us for the biggest Music Festival in Cameroon, Come and meet new people, party with your friends and participate t...",
    date: "March 15, 2026 at 2:00 PM",
    location: "Maison Du Parti Bonanjo, Douala",
  },
];



function Home() {
 const scrollRef = useRef<HTMLDivElement>(null);
 const [isHovered, setIsHovered] = useState(false);

useEffect(() => {
  const scrollContainer = scrollRef.current;
  if (!scrollContainer) return;

  // Duplicate the content for seamless loop
  const content = scrollContainer.innerHTML;
  scrollContainer.innerHTML += content;

  let animationFrameId: number;

  const scrollStep = () => {
    if (!isHovered) {
      // Only scroll when NOT hovered
      scrollContainer.scrollLeft += 1; // Scroll speed
      if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth / 2) {
        scrollContainer.scrollLeft = 0; // Loop
      }
    }

    animationFrameId = requestAnimationFrame(scrollStep);
  };

  animationFrameId = requestAnimationFrame(scrollStep);

  return () => cancelAnimationFrame(animationFrameId);
}, [isHovered]);



 const scroll = (direction: "left" | "right") => {
 if (scrollRef.current){
  const scrollAmount = 300;
  scrollRef.current.scrollBy({
    left: direction === "left"? -scrollAmount : scrollAmount,
    behavior: "smooth",
  });
 }
 };


  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div className="relative bg-accent">
        <div className="absolute inset-0 bg-[url(/src/assets/images/hero.png)] bg-cover brightness-40 blue"></div>
        <div className="relative w-full h-screen flex flex-col items-center justify-center text-center">
          <h1 className="text-[7vw] font-bold px-4 text-white max-md:text-[10vw]">
            <span className="text-primary">Connect</span> through Unforgettable{" "}
            <span className="text-secondary">Events</span>{" "}
          </h1>
          <p className="px-4 pb-4 max-md:text-[3vw]  items-center justify-center text-center text-[1.5vw] text-white">
            Discover, create, and attend events that matter to you. Join
            thousands of people connecting through shared experiences.
          </p>
          <div className=" flex gap-8  max-sm: items-center text-center p-8">
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
      <div className="w-full flex flex-col items-center justify-center p-8 max-md:p-4">
        <h1 className="text-[3.5vw] font-bold max-md:text-xl text-center">
          Don't Miss These Amazing Events
        </h1>
        <p className="text-xl text-center font-light">
          Handpicked events trending and highly rated by our community.
        </p>
        <p className="flex underline p-8 ">
          <Link
            to="/Events"
            className="text-secondary flex items-center justify-center text-2xl max-md:text-lg"
          >
            {" "}
            View all events <HiArrowRight className="text-2xl ml-2" />{" "}
          </Link>
        </p>
      </div>
      <div className="w-full flex max-md:flex-col p-8 gap-10 max-sm:p-2 items-center justify-center">
        <div className="w-md max-md:w-[50vw] border border-secondary rounded-tl-4xl rounded-br-4xl shadow-xl">
          <img
            src="/src/assets/images/Group 24.png"
            alt=""
            className="w-md rounded-tl-4xl"
          />
          <div className="p-2">
            <h1 className="font-bold py-4 text-lg">Appstech Music Festival</h1>
            <p className="pb-4">
              Join us for the biggest Music Festival in Cameroon, Come and meet
              new people, party with your friends and participate t...
            </p>
            <p className="pb-2 font-light">March 15, 2026 at 2:00 PM</p>
            <p className="pb-2 font-light">Maison Du Parti Bonanjo, Douala</p>
            <div className="flex justify-end ">
              <Link to="/EventDetails">
                <Button
                  title="View Details"
                  type=""
                  className="bg-secondary hover:bg-primary transition-transform duration-300 hover:scale-105"
                />
              </Link>
            </div>
          </div>
        </div>
        <div className="w-md max-md:w-[50vw] border border-secondary  rounded-tl-4xl rounded-br-4xl shadow-xl object-cover">
          <img
            src="/src/assets/images/GES-2 Msc 1.png"
            alt=""
            className="w-md rounded-tl-4xl"
          />
          <div className="p-2">
            <h1 className="font-bold py-4 text-lg">Appstech Music Festival</h1>
            <p className="pb-4">
              Join us for the biggest Music Festival in Cameroon, Come and meet
              new people, party with your friends and participate t...
            </p>
            <p className="pb-2 font-light">March 15, 2026 at 2:00 PM</p>
            <p className="pb-2 font-light">Maison Du Parti Bonanjo, Douala</p>
            <div className="flex justify-end ">
              <Link to="/EventDetails">
                <Button
                  title="View Details"
                  type=""
                  className="bg-secondary hover:bg-primary transition-transform duration-300 hover:scale-105"
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full flex flex-col items-center justify-center p-2 py-10">
        <div className="w-full flex flex-col items-center justify-center py-15">
          <h1 className="font-bold text-2xl">Upcoming Events</h1>
          <p className="font-light text-center">
            Make your calenda for this exiting envent coming soon
          </p>
        </div>
        <div className="relative w-full flex group  items-center justify-center">
          <div
            ref={scrollRef}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className=" w-full  flex space-x-8 overflow-x-auto hide-scrollbar scrollbar-hide  p-2 py-8"
          >
            {cards.map((card, index) => (
              <div
                key={index}
                className="w-xs max-md:w-[50vw] flex-shrink-0 rounded-2xl border border-secondary shadow-lg"
              >
                <img
                  src={card.imge}
                  alt=""
                  className="w-md rounded-t-2xl-2xl "
                />
                <h1 className="font-bold py-4 px-1 text-2xl ">{card.title} </h1>
                <p className="px-4  line-clamp-2">{card.desc} </p>
                <p className="font-light px-4 py-4"> {card.location} </p>
                <div className="w-full flex justify-end p-2 ">
                  <Link to="/EventDetails">
                    <Button
                      title="View Details"
                      type=""
                      className="bg-secondary hover:bg-primary transition-transform duration-300 hover:scale-105"
                    />
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <Button
            onClick={() => scroll("left")}
            icon={<ChevronLeft size={24} />}
            type=""
            title=""
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute top-1/2 left-2 -translate-y-1/2 bg-primary/75 rounded-full p-2 shadow "
          />

          <Button
            onClick={() => scroll("right")}
            type=""
            title=""
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute top-1/2 right-2 -translate-y-1/2  rounded-full p-2 shadow bg-primary/75"
            icon={<ChevronRight size={24} />}
          />
        </div>
      </div>
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
          <div className="w-50  max-lg:p-4 rounded-2xl bg-gray-100 flex flex-col items-center justify-center">
            <FaChartLine className="text-9xl text-primary " />
            <p className="text-[3vw] text-primary">1,500+</p>
            <p className="text-primary p-2">Organization</p>
          </div>
          <div className="w-50  max-lg:p-4 rounded-2xl bg-gray-100 flex flex-col items-center justify-center">
            <HiOutlineStar className="text-9xl text-primary " />
            <p className="text-[3vw] text-primary">98%</p>
            <p className="text-primary p-2">Event Created</p>
          </div>
        </div>
      </div>
      <div className="w-full flex flex-col items-center justify-center p-8">
        <div className="w-full flex flex-col items-center justify-center text-center py-20">
          <h1 className="text-[3vw] max-md:text-2xl font-bold">
            Ready To Create An Event?
          </h1>
          <p className="text-clamp-2 p-2 w-[100vw] ">
            Discover, Create and attend the event that matters to you. Join
            thousands of people connecting through shared experience.
          </p>
          <div className="w-full max-md:flex-col flex items-center justify-center p-8 gap-8 ">
            <Link to="/Events">
              <Button title="Explore Events" icon={<HiArrowRight />} type="" />
            </Link>
            <Link to="/CreateEvents">
              <Button
                title="Create Your Events"
                icon={<HiArrowRight />}
                type=""
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
