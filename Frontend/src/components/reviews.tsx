import { useEffect, useState } from "react";
import axios from "axios";


interface Reply {
  id: number;
  user_id: number;
  reply: string;
  created_at: string;
  isOrganizer?: boolean;
}

interface Review {
  id: number;
  user_id: number;
  rating: number;
  comment: string;
  created_at: string;
  replies: Reply[];
  event_name: string;
}

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const organizerId = 1;

  
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get(`/organizer/${organizerId}/reviews`);
        
        const data = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data.reviews)
          ? res.data.reviews
          : [];
        
        const safeData = data.map((review: Review) => ({
          ...review,
          replies: Array.isArray(review.replies) ? review.replies : [],
        }));
        setReviews(safeData);
      } catch (err) {
        console.error("Error fetching reviews:", err);
        setReviews([]); 
      }
    };
    fetchReviews();
  }, [organizerId]);

 
  const handleDeleteReply = async (reviewId: number, replyId: number) => {
    try {
      await axios.delete(`/reviews/${reviewId}/replies/${replyId}`);
      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review.id === reviewId
            ? {
                ...review,
                replies: review.replies.filter(
                  (replyItem) => replyItem.id !== replyId
                ),
              }
            : review
        )
      );
    } catch (err) {
      console.error("Error deleting reply:", err);
    }
  };


  const handleAddReply = async (reviewId: number, replyText: string) => {
    if (!replyText.trim()) return;
    try {
      const res = await axios.post(`/reviews/${reviewId}/replies`, { reply: replyText });
      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review.id === reviewId
            ? { ...review, replies: [...review.replies, res.data] }
            : review
        )
      );
    } catch (err) {
      console.error("Error adding reply:", err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      
      {reviews.length === 0 && <p>No reviews yet.</p>}

      {reviews.map((review) => (
        <div
          key={review.id}
          className="border rounded-lg p-4 mb-4 bg-white shadow"
        >
          <p className="font-semibold text-gray-800">
            Event: <span className="text-blue-600">{review.event_name}</span>
          </p>
          <p className="mt-1">
            ⭐ {review.rating} – {review.comment}
          </p>
          <p className="text-xs text-gray-500">
            Posted: {new Date(review.created_at).toLocaleString()}
          </p>

     
          <div className="ml-4 mt-3">
            {review.replies.map((replyItem) => (
              <div
                key={replyItem.id}
                className="flex justify-between items-center border-l-2 border-gray-300 pl-2 py-1"
              >
                <p className="text-sm">
                  {replyItem.isOrganizer && (
                    <span className="bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded text-xs mr-2">
                      Organizer
                    </span>
                  )}
                  {replyItem.reply}
                </p>
                <button
                  className="text-red-500 text-xs"
                  onClick={() => handleDeleteReply(review.id, replyItem.id)}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>

          <ReplyForm reviewId={review.id} onReply={handleAddReply} />
        </div>
      ))}
    </div>
  );
}

// --- Reply Form Component ---
function ReplyForm({
  reviewId,
  onReply,
}: {
  reviewId: number;
  onReply: (reviewId: number, reply: string) => void;
}) {
  const [replyText, setReplyText] = useState("");

  const handleSubmit = async () => {
    if (!replyText.trim()) return;
    await onReply(reviewId, replyText);
    setReplyText("");
  };

  return (
    <div className="flex items-center mt-3 ml-4">
      <input
        value={replyText}
        onChange={(e) => setReplyText(e.target.value)}
        placeholder="Write a reply..."
        className="flex-1 border p-2 rounded text-sm"
      />
      <button
        onClick={handleSubmit}
        className="ml-2 bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
      >
        Reply
      </button>
    </div>
  );
}
