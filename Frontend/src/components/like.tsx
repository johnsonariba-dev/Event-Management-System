import React from 'react'
import { useState, useEffect } from 'react'
import { data } from 'react-router-dom';

interface eventProps{
   eventId: number

}



const LikePage: React.FC<eventProps> = ({ eventId })  => {
  const [like, setLike] = useState(false);
  const [totalLike, setTotalLike] = useState(0);

  const token = localStorage.getItem("token");


  useEffect(() =>{
    fetch(`http://127.0.0.1:8000/events/${eventId}/likes`, {
      headers: {autorization: `Beare ${token}`,
    }
  }).then((res) => res.json())
  .then((data) =>{
    setLike(data.like_by_user);
    setTotalLike(data.totalLike);
  })
  .catch((err) => console.log("err to execute", err));
  }, [eventId, token]);
  
  const handleclickLike = async () =>{
      try{
        const res = await fetch("http://127.0.0.1:8000/events/like", {
          method: "POST",
          headers: {"content-type" : "application/json", 
          autorisation: `Bearer ${token}`},
          body: JSON.stringify({event_id: eventId}),
          
        });
        if(res.ok){
          const data = await res.json();
          setLike(true);
          setTotalLike((prev) => prev - 1);
        }
        else{
          console.error("error:",);
        }
      }
      catch(err){
        console.error("failed to fetch", err);
      }
  };



  return (
    <div>
      <div className='w-full h-screen flex flex-col items-center justify-center'>
      <button
        onClick={handleclickLike }
        className={`px-4 py-2 rounded ${
          like ? "bg-red-500 text-white" : "bg-gray-300"
        }`}
      >
        {like ? "Unlike ❤️" : "Like 🤍"}
      </button>
      <p>{totalLike} likes</p>
    </div>
    </div>
  );
}

export default LikePage;
