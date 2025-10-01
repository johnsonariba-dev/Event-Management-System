import React, { useState } from "react";
import { BiChat } from "react-icons/bi";

const Chatbot: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Toggle Button */}
      <button
        onClick={() => setOpen(!open)}
        className="bg-primary hover:bg-secondary text-white rounded-full p-3 shadow-lg transition transform hover:scale-110"
      >
        <BiChat size={28} />
      </button>

      {/* Chatbot Popup */}
      {open && (
        <div className="fixed bottom-16 right-4 w-full max-md:w-[90vw] max-w-[800px] h-[70vh] max-h-[600px] bg-white border rounded-xl shadow-2xl overflow-hidden sm:h-[500px]  md:h-[600px]">
          <iframe
            src="https://app.vectorshift.ai/chatbots/deployed/68da83e2d2e60a08aa00d4a6"
            className="w-full h-full border-0"
            allow="microphone; camera"
            title="PlanVibes Chatbot"
          />
        </div>
      )}
    </div>
  );
};

export default Chatbot;
