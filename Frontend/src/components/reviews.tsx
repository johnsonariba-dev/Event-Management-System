import { useEffect, useState } from "react";
import { FiCornerUpLeft, FiTrash2 } from "react-icons/fi";
import { HiOutlineDotsVertical } from "react-icons/hi";

interface Review {
  id: number;
  event_title: string;
  username: string;
  comment: string;
  rating: number;
  reply?: string;
  time?: string;
}

const OrganizerReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [replyText, setReplyText] = useState<Record<number, string>>({});
  const [editingReply, setEditingReply] = useState<Record<number, boolean>>({});
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://127.0.0.1:8000/organizer/reviews", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data: Review[] = await res.json();
          setReviews(data);
          console.log(data);

          const initialReplies: Record<number, string> = {};
          data.forEach((r) => {
            initialReplies[r.id] = r.reply || "";
          });
          setReplyText(initialReplies);
        }
      } catch (err: unknown) {
        console.error(err instanceof Error ? err.message : JSON.stringify(err));
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [token]);

  const handleReply = async (id: number) => {
    const reply = replyText[id];
    if (!reply) return;

    try {
      await fetch(`http://127.0.0.1:8000/review/${id}/reply`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reply }),
      });

      setReviews((prev) =>
        prev.map((r) => (r.id === id ? { ...r, reply } : r))
      );
      setEditingReply((prev) => ({ ...prev, [id]: false }));
    } catch (err: unknown) {
      console.error(err instanceof Error ? err.message : JSON.stringify(err));
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await fetch(`http://127.0.0.1:8000/reviews/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setReviews((prev) => prev.filter((r) => r.id !== id));
    } catch (err: unknown) {
      console.error(err instanceof Error ? err.message : JSON.stringify(err));
    }
  };

  if (reviews.length === 0) {
    return <p className="p-5 text-gray-500">No reviews yet.</p>;
  }

  {
    loading && <p className="text-gray-500">Loading...</p>;
  }

  return (
    <div className="p-5">
      {reviews.map((r) => (
        <div
          key={r.id}
          className="p-5 border border-gray-200 rounded-xl shadow-sm mb-6 bg-white"
        >
          <div className="flex justify-between ">
            <div className="flex flex-col space-x-3">
              <p className="font-semibold text-gray-800">{r.username}</p>

              <div className="flex items-center space-x-1 right">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={i}
                    xmlns="http://www.w3.org/2000/svg"
                    fill={i < r.rating ? "currentColor" : "none"}
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className={`w-5 h-5 ${
                      i < r.rating ? "text-yellow-400" : "text-gray-300"
                    }`}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.967c.3.921-.755 1.688-1.54 1.118l-3.38-2.455a1 1 0 00-1.175 0l-3.38 2.455c-.784.57-1.838-.197-1.539-1.118l1.287-3.967a1 1 0 00-.364-1.118L2.98 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z"
                    />
                  </svg>
                ))}
                <p className="font-medium text-sm text-gray-500">
                  {" "}
                  At {r.time}
                </p>
              </div>
            </div>

            <div className="relative">
              <button
                onClick={() => setOpenMenuId(openMenuId === r.id ? null : r.id)}
                className="text-gray-400 hover:text-gray-600"
              >
                <HiOutlineDotsVertical size={20} />
              </button>
              {openMenuId === r.id && (
                <div className="absolute right-0 mt-2 w-32 bg-white border rounded-md shadow-lg z-50">
                  <button
                    onClick={() => {
                      setEditingReply((prev) => ({ ...prev, [r.id]: true }));
                      setOpenMenuId(null);
                    }}
                    className="w-full px-4 py-2 text-sm hover:bg-gray-50 flex items-center space-x-2"
                  >
                    <FiCornerUpLeft className="text-gray-500" />
                    <span>Edit Reply</span>
                  </button>
                  <button
                    onClick={() => {
                      handleDelete(r.id);
                      setOpenMenuId(null);
                    }}
                    className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                  >
                    <FiTrash2 className="text-red-500" />
                    <span>Delete</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="leading-relaxed mt-2">
            <p className="text-md text-gray-400 font-medium">
              Event: <span className="text-gray-800">{r.event_title}</span>
            </p>
            <p className="">{r.comment}</p>
          </div>

          {editingReply[r.id] ? (
            <div className="mt-2 flex space-x-2">
              <input
                type="text"
                className="flex-1 border p-2 rounded-md"
                value={replyText[r.id]}
                onChange={(e) =>
                  setReplyText((prev) => ({ ...prev, [r.id]: e.target.value }))
                }
              />
              <button
                onClick={() => handleReply(r.id)}
                className="px-4 py-2 bg-primary text-white rounded-md"
              >
                Save
              </button>
              <button
                onClick={() =>
                  setEditingReply((prev) => ({ ...prev, [r.id]: false }))
                }
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md"
              >
                Cancel
              </button>
            </div>
          ) : r.reply ? (
            <div className="mt-2 p-4 border-l-4 border-purple-400 bg-purple-100 rounded-md text-gray-600 ">
              <strong className="text-violet-700">Your reply:</strong>
              <p className="text-sm">{r.reply}</p>
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
};

export default OrganizerReviews;

