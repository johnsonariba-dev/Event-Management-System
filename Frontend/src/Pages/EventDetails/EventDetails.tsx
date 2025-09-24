import Button from "../../components/button";
import { CiEdit } from "react-icons/ci";
import { FiBookmark, FiCalendar, FiMessageCircle } from "react-icons/fi";
import { HiLocationMarker, HiOutlineClock, HiUserCircle } from "react-icons/hi";
import { HiStar, HiTicket } from "react-icons/hi2";
import { FaCheck, FaMoneyBill } from "react-icons/fa";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ShareButton from "../../components/ShareButton";
import Like from "../../components/like";

// Types
interface Reviews {
  id: number;
  username: string;
  comment: string;
  rating: number;
}

interface Event {
  id: number;
  image_url?: string;
  title: string;
  description: string;
  category: string;
  venue: string;
  date: string;
  time: string;
  ticket_price: number;
  reviews?: Reviews[];
  organizer: string;
  total_likets?: number; // Add this optional
  liked_by_user?: boolean;
}

const EventDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState(" ");
  const [bookC, setBookC] = useState(false);
  const [reviews, setReviews] = useState<Reviews[]>([]);
  const [currentRating, setCurrentRating] = useState(0);
  const [editingReviewId, setEditingReviewId] = useState<number | null>(null);
  const [editingComment, setEditingComment] = useState("");
  const [editingRating, setEditingRating] = useState(0);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [userInfo, setUserInfo] = useState()


  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

// fetch organiser name
useEffect(() => {
    if (!id) return;
    const fetchOrganizer = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/events/${id}/organizer`);
        if (!res.ok) throw new Error("Organizer not found");
        const data = await res.json();
        console.log(data);
        setUserInfo(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchOrganizer();
  }, [id]);


  // Fetch event data
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/events/${id}`);
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

  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      const res = await fetch(`http://127.0.0.1:8000/events/${id}/reviews`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setReviews(data);
      }
    };
    fetchReviews();
  }, [id, token]);

  // Bookmark event
  const handleBookClick = () => {
    if (!token) return alert("You must be logged in to bookmark this event");
    if (role !== "user") return alert("Only users can bookmark events");
    setBookC(!bookC);
  };

  // Buy ticket
  const handleBuyTicket = () => {
    if (!token) {
      alert("You must be logged in to buy a ticket");
      navigate("/Login");
      return;
    }
    if (role !== "user") {
      alert("Only users can buy tickets");
      return;
    }
    navigate(`/Payment/${event?.id}`);
  };

  // Review editing
  const startEditing = (review: Reviews) => {
    setEditingReviewId(review.id);
    setEditingComment(review.comment);
    setEditingRating(review.rating);
  };
  const cancelEditing = () => {
    setEditingReviewId(null);
    setEditingComment("");
    setEditingRating(0);
  };
  const handleUpdate = async () => {
    if (!editingComment.trim() || editingRating === 0) return;
    if (!token) return alert("You must be logged in");
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/review/${editingReviewId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            comment: editingComment,
            rating: editingRating,
          }),
        }
      );
      if (res.ok) {
        const updated = await res.json();
        setReviews((prev) =>
          prev.map((r) => (r.id === editingReviewId ? { ...r, ...updated } : r))
        );
        cancelEditing();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Submit new review
  const handleSubmit = async () => {
    if (!token) return alert("You must be logged in to leave a review");
    if (role !== "user") return alert("Only users can leave reviews");
    if (!comment.trim() || currentRating === 0) return;

    const newReview = { comment, rating: currentRating };
    try {
      const res = await fetch(`http://127.0.0.1:8000/review/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newReview),
      });
      if (!res.ok) throw new Error("Failed to submit review");
      const savedReview = await res.json();
      setReviews([...reviews, savedReview]);
      setComment("");
      setCurrentRating(0);
    } catch (error) {
      console.error(error);
    }
  };
  const getEventImageUrl = (url?: string) => {
    if (!url) return "/placeholder.png";
    if (url.startsWith("http")) return url;
    return `http://127.0.0.1:8000${encodeURI(url)}`;
  };

  if (loading)
    return (
      <div className="w-full h-screen flex items-center justify-center">
        Loading event...
      </div>
    );
  if (!event)
    return (
      <div className="w-full h-screen flex items-center justify-center">
        Event not found
      </div>
    );
    

  return (
    <div className="w-full flex flex-col items-center justify-center ">
      {/* Event Header */}
      <div className="w-full relative h-[80vh] bg-accent flex mt-4 flex-col items-center justify-center">
        <div
          className="absolute w-[95vw] h-[60vh]  bg-center
           bg-cover  flex items-center justify-center brightness-70 rounded-2xl"
          style={{
            backgroundImage: `url(${getEventImageUrl(event.image_url)})`,
          }}
        ></div>
        <div className="relative w-full h-[80vh] flex items-center justify-end max-md:h-[60vh]">
          <h1 className="absolute bottom-40 left-15 text-white text-[3vw] font-bold max-md:text-xl">
            {event.title}
          </h1>
          <p className="absolute bottom-20 left-15 text-white text-3xl pb-10 max-md:text-sm">
            {event.category}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full flex max-md:flex-col justify-center items-center gap-4 p-5">
        {/* Left Side: About & Details */}
        <div className="w-full flex flex-col items-center justify-center p-4 gap-6">
          {/* About Event */}
          <div className="flex flex-col gap-6 w-full p-2 rounded-2xl bg-gray-100 shadow-md">
            <div className="w-full flex justify-between items-center">
              <h1 className="text-lg font-semibold text-secondary">
                About This Event
              </h1>
              <div className="flex gap-4 text-2xl">
                <Like
                  event_id={event.id}
                  total_like={event.total_likets || 0} // ✅ matches the type
                  liked_by_user={event.liked_by_user || false}
                />

                <FiBookmark
                  className={`cursor-pointer ${
                    bookC ? "text-red-500" : "text-gray-400"
                  }`}
                  onClick={handleBookClick}
                />
                {event && <ShareButton event={event} />}
              </div>
            </div>
            <p className="text-justify">{event.description}</p>
            <div className="w-full flex justify-between items-center max-sm:flex-col gap-4">
              <div className="flex flex-col gap-2">
                <h1 className="text-lg font-semibold text-primary">
                  By {userInfo}
                </h1>
              
              </div>
              <Button
                icon={<FiMessageCircle size={24} />}
                title="Contact Organizer"
                onClick={() => {
                  if (!token)
                    return alert("You must be logged in to contact organizer");
                  if (role !== "user")
                    return alert("Only users can contact organizer");
                  alert(`Contacting organizer for ${event.title}`);
                }}
                className="bg-secondary hover:bg-primary transition-transform duration-300 hover:scale-105"
              />
            </div>
          </div>

          {/* Event Details */}
          <div className="w-full flex flex-col gap-6 p-2 rounded-2xl bg-gray-100 shadow-md">
            <h1 className="text-lg font-semibold text-secondary">
              Event Details
            </h1>
            <div className="flex gap-4 justify-stretch">
              <div className="flex flex-col gap-4 w-full">
                <div className="flex items-center gap-2 w-full py-4">
                  <FiCalendar size={24} className="text-primary" />
                  <div className="flex flex-col w-full">
                    <h1 className="text-sm font-semibold">Date & Time</h1>
                    <p className="text-sm">
                      {event.date} {event.time}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 w-full py-4">
                  <HiLocationMarker size={24} className="text-primary" />
                  <div>
                    <h1 className="text-sm font-semibold">Location</h1>
                    <p className="text-sm">
                      {event.venue || "Unknown Location"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-4 w-full">
                <div className="flex gap-2 w-full justify-end py-4 px-1">
                  <HiUserCircle size={24} className="text-primary" />
                  <div>
                    <h1 className="text-sm font-semibold">Organizer</h1>
                    <p className="text-sm">{userInfo}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 w-full justify-end py-4 px-1">
                  <FaMoneyBill size={24} className="text-primary" />
                  <div>
                    <h1 className="text-sm font-semibold">Ticket Price</h1>
                    <p className="text-sm">{event.ticket_price}FCFA</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Ticket Info */}
        <div className="w-md max-md:w-full m-8 flex flex-col items-center justify-center p-4 bg-gray-400 shadow-md h-[65vh] max-md:h-[94vh] rounded-2xl">
          <div className="w-full flex justify-around gap-4 items-center p-4">
            <h1 className="text-white text-2xl">
              {event.ticket_price}FCFA per
            </h1>
            <HiTicket size={44} className="text-primary" />
          </div>
          <p className="text-white p-4">847 people registered</p>
          <div className="w-full flex bg-primary h-3 rounded-2xl m-4">
            <div className="bg-secondary h-3 rounded-2xl w-[70%]"></div>
          </div>
          <div className="w-full flex justify-between items-center p-4 rounded-2xl bg-secondary/20 shadow m-4">
            <HiOutlineClock size={24} className="text-secondary" />
            <p className="text-white">Almost full!</p>
          </div>
          <Link to={`/payment/${event.id}`}>
            <Button
              icon={<FiBookmark />}
              title="Buy ticket"
              onClick={handleBuyTicket}
              className="bg-secondary hover:bg-primary transition-transform duration-300 hover:scale-105 m-4"
            />
          </Link>
          <p className="text-white p-4 flex items-center gap-2">
            <FaCheck className="rounded-full bg-primary p-1  text-white" size={23} />{" "}
            <span>Instant confirmation</span>
          </p>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="w-full flex flex-col items-center justify-center p-8">
        <div className="w-full flex flex-col p-2 rounded-2xl bg-gray-400 shadow-md">
          <h1 className="font-bold text-xl">Review & Ratings</h1>
          <div className="w-full flex flex-col items-center justify-center p-4 gap-4">
            <h1 className="font-bold text-2xl">5.0</h1>
            <div className="flex items-center gap-1 p-4">
              {[...Array(5)].map((_, i) => (
                <HiStar key={i} className="text-secondary text-xl" />
              ))}
            </div>
            <p>
              <span className="text-primary">Based on 100 reviews</span>
            </p>
          </div>
        </div>
      </div>

      {/* Leave Review */}
      <div className="w-full flex flex-col items-center gap-4 p-8">
        <div className="w-full flex flex-col gap-2 p-4 rounded-2xl bg-gray-100 shadow-md">
          <h1 className="font-bold text-xl">Leave a Review</h1>
          <h4 className="font-semibold mt-2">Your Rating</h4>
          <div className="flex items-center gap-1 p-2">
            {[...Array(5)].map((_, i) => (
              <HiStar
                key={i}
                className={`text-xl cursor-pointer ${
                  i < currentRating ? "text-yellow-400" : "text-gray-300"
                }`}
                onClick={() => setCurrentRating(i + 1)}
                onDoubleClick={() => setCurrentRating(0)}
              />
            ))}
          </div>
          <textarea
            placeholder="Your Comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full p-4 outline-secondary rounded-xl border-2 border-gray-300"
            rows={4}
          />
          <button
            className="bg-secondary text-white py-2 px-4 rounded hover:bg-primary transition"
            onClick={handleSubmit}
          >
            Submit Review
          </button>
        </div>

        {/* Existing Reviews */}
        <div className="w-full flex flex-col gap-4 mt-4">
          {(showAllReviews ? reviews : reviews.slice(0, 5)).map((rev) => (
            <div
              key={rev.id}
              className="p-4 bg-gray-100 text-black rounded-xl shadow flex flex-col gap-2"
            >
              {editingReviewId === rev.id ? (
                <div className="flex flex-col gap-2">
                  <textarea
                    value={editingComment}
                    onChange={(e) => setEditingComment(e.target.value)}
                    className="w-full p-2 border rounded"
                    rows={3}
                  />
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <HiStar
                        key={i}
                        className={`text-xl cursor-pointer ${
                          i < editingRating
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                        onClick={() => setEditingRating(i + 1)}
                      />
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleUpdate}
                      className="bg-secondary text-white px-4 py-2 rounded hover:bg-primary"
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEditing}
                      className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <div>
                    <h1 className="text-gray-500">{rev.username}</h1>
                    <p className="pt-5">{rev.comment}</p>
                  </div>
                  <div>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <HiStar
                          key={i}
                          className={`text-xl ${
                            i < rev.rating ? "text-yellow-400" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <button
                      className="pl-20 pt-5"
                      onClick={() => startEditing(rev)}
                    >
                      <CiEdit size={23} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
          {reviews.length > 5 && (
            <button
              onClick={() => setShowAllReviews(!showAllReviews)}
              className="text-secondary font-semibold self-end mt-2 hover:underline"
            >
              {showAllReviews ? "See less" : "See more"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
