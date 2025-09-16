import { useEffect, useState } from "react";
import { CiEdit, CiTrash } from "react-icons/ci";
import { HiStar } from "react-icons/hi2";
import Button from "./button";

interface Review {
  id: number;
  username: string;
  comment: string;
  rating: number;
  reply?: string;
}

const OrganizerDashboard = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [editingReplyId, setEditingReplyId] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");

  const token = localStorage.getItem("token");

  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/review", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data: Review[] = await res.json();
          setReviews(data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchReviews();
  }, []);

  // Start replying
  const startReply = (review: Review) => {
    setEditingReplyId(review.id);
    setReplyText(review.reply || "");
  };

  // Cancel replying
  const cancelReply = () => {
    setEditingReplyId(null);
    setReplyText("");
  };

  // Submit reply
  const handleReply = async (reviewId: number) => {
    if (!replyText.trim()) return;

    try {
      const res = await fetch(`http://127.0.0.1:8000/review/reply/${reviewId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reply: replyText }),
      });
      if (res.ok) {
        const updated = await res.json();
        setReviews((prev) =>
          prev.map((r) => (r.id === reviewId ? { ...r, ...updated } : r))
        );
        cancelReply();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete review
  const handleDelete = async (reviewId: number) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/review/${reviewId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setReviews((prev) => prev.filter((r) => r.id !== reviewId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="w-full flex flex-col items-center p-8 gap-6">
      
      <div className="w-full flex flex-col gap-4">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className="p-4 bg-gray-100 shadow rounded-xl flex flex-col gap-2"
          >
            <div className="flex justify-between items-start">
              <div>
                <h2 className="font-semibold text-gray-700">{rev.username}</h2>
                <p className="mt-2">{rev.comment}</p>
                <div className="flex gap-1 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <HiStar
                      key={i}
                      className={`text-xl ${
                        i < rev.rating ? "text-yellow-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                {rev.reply && (
                  <p className="mt-2 text-blue-600 font-medium">
                    Reply: {rev.reply}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => startReply(rev)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <CiEdit size={24} />
                </button>
                <button
                  onClick={() => handleDelete(rev.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <CiTrash size={24} />
                </button>
              </div>
            </div>

            {editingReplyId === rev.id && (
              <div className="flex flex-col gap-2 mt-2">
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="w-full p-2 border rounded"
                  rows={3}
                />
                <div className="flex gap-2">
                  <Button
                    title="Submit Reply"
                    className="bg-secondary text-white hover:bg-primary"
                    onClick={() => handleReply(rev.id)}
                  />
                  <Button
                    title="Cancel"
                    className="bg-gray-300 text-black hover:bg-gray-400"
                    onClick={cancelReply}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrganizerDashboard;
