import Button from "../../components/button";
import {
  FiBookmark,
  FiCalendar,
  FiMessageCircle,
  FiShare2,
} from "react-icons/fi";
import {
  HiHeart,
  HiLocationMarker,
  HiOutlineClock,
  HiUserCircle,
} from "react-icons/hi";
import { HiStar, HiTicket } from "react-icons/hi2";
import { FaCheck } from "react-icons/fa6";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaMoneyBill } from "react-icons/fa";
import { Link } from "react-router-dom";

// ✅ Types for events + reviews
interface Reviews {
  user: string;
  comment: string;
  rating?: number;
}

interface Event {
  id: number;
  image_url?: string;
  title: string;
  desc: string;
  category: string;
  venue: string;
  date: string;
  time: string;
  ticket_price: number;
  reviews?: Reviews[];
  organizer: string;
}

function EventDetails() {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(
          `http://127.0.0.1:8000/event_fake/events/${id}`
        );
        if (!res.ok) throw new Error("Event not found");
        const data: Event = await res.json();
        setEvent(data);
      } catch (err) {
        console.error(err);
        setEvent(null);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        Loading event...
      </div>
    );
  }

  if (!event) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        Event not found
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center justify-center ">
      <div className="w-full relative h-[80vh] bg-accent flex mt-4 flex-col items-center justify-center">
        <div
          className="absolute w-[95vw] h-[60vh]  bg-center
           bg-cover  flex items-center justify-center brightness-70 rounded-2xl"
          style={{ backgroundImage: `url(${event.image_url})` }}
        ></div>
        <div className="relative w-full h-[80vh] flex items-center justify-end">
          <h1 className="absolute bottom-30 left-10 text-white text-[3vw] font-bold">
            {event.title}
          </h1>
          <p className="absolute bottom-20 left-10 text-white text-2xl">
            {event.category}
          </p>
        </div>
      </div>
      <div className="w-full flex max-md:flex-col justify-center items-center gap-4 p-5">
        <div className="w-full flex flex-col items-center justify-center p-4 gap-6">
          <div className="flex flex-col gap-6 w-full p-2 rounded-2xl   bg-gray-100 shadow-md">
            <div className="w-full flex justify-between items-center">
              <h1 className="text-lg font-semibold text-secondary">
                About This Event
              </h1>
              <div className="flex gap-4 text-2xl">
                <HiHeart className="text-primary" />
                <FiShare2 className="text-primary" />
              </div>
            </div>
            <p className="text-justify">{event.desc}</p>
            <div className="w-full flex justify-between items-center max-sm:flex-col gap-4">
              <div className="flex flex-col gap-2">
                <h1 className="text-lg font-semibold text-secondary">
                  By AI Learning Hub
                </h1>
                <p className="flex items-center gap-2 max-md:flex-col ">
                  Rating 4.8k (124 reviews)
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <HiStar key={i} className="text-secondary" />
                    ))}
                  </div>
                </p>
              </div>
              <Button
                icon={<FiMessageCircle size={24} />}
                title="Contact Organizer"
                onClick={() => alert(`Contacting organizer for ${event.title}`)}
                className="bg-secondary hover:bg-primary transition-transform duration-300 hover:scale-105"
              />
            </div>
          </div>
          <div className="w-full flex flex-col gap-6 p-2  rounded-2xl  bg-gray-100 shadow-md">
            <h1 className="text-lg font-semibold text-secondary">
              Event Details
            </h1>
            <div className="flex gap-4 justify-stretch">
              <div className="flex flex-col gap-4 w-full">
                <div className="flex items-center gap-2 w-full  py-4">
                  <FiCalendar size={24} className="text-primary" />
                  <div className="flex flex-col w-full">
                    <h1 className="text-sm font-semibold">Date & Time</h1>
                    <p className="text-sm">
                      {event.date} {event.time}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 w-full py-4">
                  <HiLocationMarker size={24} className="text-secondary" />
                  <div>
                    <h1 className="text-sm font-semibold">Location</h1>
                    <p className="text-sm">
                      {event.venue || "Unknown Location"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-4 w-full">
                <div className="flex  gap-2 w-full justify-end py-4 px-1">
                  <HiUserCircle size={24} className="text-secondary" />
                  <div>
                    <h1 className="text-sm font-semibold">Organizer</h1>
                    <p className="text-sm">{event.organizer}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 w-full justify-end py-4 px-1">
                  <FaMoneyBill size={24} className="text-primary" />
                  <div className="">
                    <h1 className="text-sm font-semibold">Ticket Price</h1>
                    <p className="text-sm">${event.ticket_price}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-md max-md:w-full m-8 flex flex-col items-center justify-center p-4 bg-gray-400 shadow-md h-[65vh] max-md:h-[94vh] rounded-2xl">
          <div className="w-full flex justify-around gap-4 items-center p-4">
            <h1 className="text-white text-2xl">${event.ticket_price} per</h1>
            <HiTicket size={44} className="text-primary" />
          </div>
          <p className="text-white p-4">847 people registered</p>
          <div className="w-full flex   bg-primary h-3 rounded-2xl m-4">
            <div className="bg-secondary h-3 rounded-2xl w-[70%]"></div>
          </div>
          <div className="w-full flex justify-between items-center p-4 rounded-2xl bg-secondary/20 shadow m-4">
            <HiOutlineClock size={24} className="text-secondary" />
            <p className="text-white">Almost full!</p>
          </div>
          <Button
            icon={<FiBookmark />}
            title="Buy ticket"
            className="bg-secondary hover:bg-primary transition-transform duration-300 hover:scale-105 m-4"
          />
          <p className="text-white p-4 flex items-center gap-2">
            <FaCheck className="rounded-full bg-secondary  text-white" />{" "}
            <span>Instant confirmation</span>
          </p>
        </div>
      </div>
      <div className="w-full flex flex-col items-center justify-center p-8">
        <div className="w-full flex flex-col p-2 rounded-2xl bg-gray-100 shadow-md ">
          <h1 className="font-bold text-xl">Review & Ratings</h1>
          <div className="w-full flex flex-col items-center justify-center p-4 gap-4">
            <h1 className="font-bold text-2xl">5.0</h1>
            <div className="flex items-center gap-1 p-4">
              <div className="flex items-center gap-1 p-4">
                {[...Array(5)].map((_, i) => (
                  <HiStar key={i} className="text-secondary text-xl" />
                ))}
              </div>
            </div>
            <p>
              <span className="text-primary">Based on 100 reviews</span>
            </p>
          </div>
        </div>
      </div>
      <div className="w-full flex flex-col items-center justify-center p-8 gap-4">
        <h1 className="font-bold text-xl">What are your attendees saying?</h1>
        <div className="flex flex-col gap-4">
          {event.reviews?.map((review: Reviews, index: number) => (
            <div key={index} className="p-4 bg-gray-100 rounded-xl shadow">
              <div className="flex items-center gap-4 mb-2 rounded-full bg-primary text-white ">
                ZR
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <h1 className="font-semibold">Zounka Raneni</h1>
                    <p className="text-sm text-gray-500">1 day ago</p>
                  </div>
                  <div className="flex items-center gap-1 p-4">
                    {[...Array(5)].map((_, i) => (
                      <HiStar key={i} className="text-secondary text-xl" />
                    ))}
                  </div>
                </div>
                <div className="flex">
                  <p className="text-gray-700">{review.comment}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="w-full flex items-center justify-center p-10 mb-10">
        <Link to="/reviews">
          <button className="text-secondary bg-transparent border hover:bg-primary/20 py-2 shadow border-secondary transition rounded-md px-4 cursor-pointer">
            See all reviews
          </button>
        </Link>
      </div>
      <div className="w-[90vw] flex flex-col items-center justify-center p-8 gap-4 border bg-primary/70 border-secondary rounded-2xl mb-10">
        <Button
          title="Buy tickets"
          icon={<FiBookmark />}
          className="bg-secondary text-white hover:scale-105 transition-transform duration-200"
        />

        <p>125 places left</p>
      </div>
      <div className="w-full flex flex-col items-center justify-center p-8 gap-4 mb-10">
        <div className="w-full flex flex-col p-4 rounded-2xl bg-gray-100 shadow-md gap-4">
          <h1 className="font-bold text-xl">Leave a review</h1>
          <h4 className="font-semibold">Your rating</h4>
          <div className="flex items-center gap-1 p-4">
            {[...Array(5)].map((_, i) => (
              <HiStar key={i} className="text-secondary text-xl" />
            ))}
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="" className="font-semibold">
              Your Comment
            </label>
            <textarea
              name=""
              id=""
              cols={30}
              rows={5}
              className="w-full p-4 outline-secondary rounded-xl border-2 border-gray-300"
            ></textarea>
          </div>
          <div>
            <Button title="Send Review" className="bg-secondary" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventDetails;
