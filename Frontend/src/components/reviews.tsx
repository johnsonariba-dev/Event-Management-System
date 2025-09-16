import { useEffect, useState } from "react";

const OrganizerReviews = () => {
  const [reviews, setReviews] = useState<any[]>([]);

  const token = localStorage.getItem("token");
  console.log("JWT Token:", token);

  useEffect(() => {
    const fetchReviews = async () => {
      const res = await fetch("http://127.0.0.1:8000/organizer/reviews", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setReviews(data);
      }
    };
    fetchReviews();
  }, []);

  const handleReply = async (id: number, reply: string) => {
    if (!reply) return;
    const token = localStorage.getItem("token");
    await fetch(`http://127.0.0.1:8000/reviews/${id}/reply`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ reply }),
    });

    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, reply } : r)));
  };

  const handleDelete = async (id: number) => {
    const token = localStorage.getItem("token");
    await fetch(`http://127.0.0.1:8000/reviews/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setReviews(reviews.filter((r) => r.id !== id));
  };

  return (
    <div className="p-5">
      {reviews.map((r) => (
        <div key={r.id} className="p-4 bg-gray-100 rounded-lg mb-2">
          <p className="text-sm text-gray-500 mb-1">
            Event: <strong>{r.event_title}</strong>
          </p>
          <p>
            <strong>{r.username}:</strong> {r.comment} ⭐{r.rating}
          </p>

          {r.reply && (
            <div className="ml-6 mt-2 p-2 border-l-2 border-gray-300 text-gray-600">
              <strong>Organizer reply:</strong> {r.reply}
            </div>
          )}

          <div className="mt-2">
            <button
              onClick={() => handleReply(r.id, prompt("Enter reply") || "")}
              className="text-blue-500 hover:underline"
            >
              Reply
            </button>
            <button
              onClick={() => handleDelete(r.id)}
              className="ml-4 text-red-500 hover:underline"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrganizerReviews;
