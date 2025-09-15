import React from "react";
import { useState, useEffect } from "react";
import { HiHeart } from "react-icons/hi";
import { useParams } from "react-router-dom";

interface LikeResponse {
  event_id: number;
  total_like: number;
  liked_by_user: boolean;
}

const LikePage: React.FC = () => {
  const [like, setLike] = useState(false);
  const [totalLike, setTotalLike] = useState(0);

  const { id } = useParams<{ id: string }>();
  const eventId = Number(id);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token || !eventId) return;

    fetch(`http://127.0.0.1:8000/events/${eventId}/likes`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setLike(data.liked_by_user);
        setTotalLike(data.total_like);
      })
      .catch((err) => console.log("Error fetching likes", err));
  }, [eventId, token]);

  const handleclickLike = async () => {
    if (!token) return alert("Vous devez être connecté !");

    try {
      const res = await fetch(`http://127.0.0.1:8000/events/${eventId}/likes`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ event_id: eventId }),
      });
      if (res.ok) {
        // const data: LikeResponse = await res.json();
        setLike(!like);
        setTotalLike((prev) => (like ? prev - 1 : prev + 1));
      } else {
        console.error("Error liking event");
      }
    } catch (err) {
      console.error("failed to fetch", err);
    }
  };

  return (
    <div onClick={handleclickLike} className="flex items-center gap-2">
      <span className="text-[1.2rem]">{isNaN(totalLike) ? 0 : totalLike}</span>
      <HiHeart
        className={`cursor-pointer text-2xl ${
          like ? "text-red-500" : "text-gray-400"
        }`}
      />
    </div>
  );
};

export default LikePage;
