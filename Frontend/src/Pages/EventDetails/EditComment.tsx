// import React, { useState } from 'react'

// interface Reviews {
//     id: number;
//     username: string;
//     comment: string;
//     rating: number;
//     time: string;
//   }
  
// const EditComment = () => {
    
//   const [editingReviewId, setEditingReviewId] = useState<number | null>(null);
//   const [editingComment, setEditingComment] = useState("");
//   const [editingRating, setEditingRating] = useState(0);

//   const startEditing = (review: Reviews) => {
//     setEditingReviewId(review.id);
//     setEditingComment(review.comment);
//     setEditingRating(review.rating);
//   };

//   const cancelEditing = () => {
//     setEditingReviewId(null);
//     setEditingComment("");
//     setEditingRating(0);
//   };

//   const handleUpdate = async () => {
//     if (!editingComment.trim() || editingRating === 0) return;

//     const token = localStorage.getItem("token");
//     if (!token) return alert("You must be logged in");

//     try {
//       const res = await fetch(
//         `http://127.0.0.1:8000/review/${editingReviewId}`,
//         {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({
//             comment: editingComment,
//             rating: editingRating,
//           }),
//         }
//       );
//       if (res.ok){
//         setEditingComment(comment);
//       }
//     } catch (e) {
//       console.error(e);
//     }
//   };
//   return (
//     <div>
      
//     </div>
//   )
// }

// export default EditComment
