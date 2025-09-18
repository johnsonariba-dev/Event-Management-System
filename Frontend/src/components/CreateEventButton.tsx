import React from "react";
import { useNavigate } from "react-router-dom";

const CreateEventButton: React.FC = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    const token = localStorage.getItem("token"); // check login token
    if (!token) {
      navigate("/login"); // redirect to login
      return;
    }

    navigate("/CreateEvent"); // go to CreateEvent page if logged in
  };

  return (
    <button
      onClick={handleClick}
      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
    >
      Create Event
    </button>
  );
};

export default CreateEventButton;
