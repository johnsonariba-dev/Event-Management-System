import React, { useState } from "react";
import { BiChat } from "react-icons/bi";

const Chatbot: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-100">
      {/* Toggle Button */}
      <button
        onClick={() => setOpen(!open)}
        className="bg-primary hover:bg-secondary text-white rounded-lg p-3 shadow-lg transition animate-bounce"
      >
        <BiChat size={33} />
      </button>

      {/* Chatbot Popup */}
      {open && (
        <div className="fixed bottom-16 right-4 w-196 h-[600px] bg-white border rounded-xl shadow-2xl overflow-hidden">
          <iframe
            src="https://app.vectorshift.ai/chatbots/deployed/68af42e7a7097005e10bc4fa"
            className="w-full h-full border-0"
            allow="microphone; camera"
            title="VectorShift Chatbot"
          />
        </div>
      )}
    </div>
  );
};

export default Chatbot;
