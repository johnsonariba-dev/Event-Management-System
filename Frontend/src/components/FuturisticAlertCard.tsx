import React from "react";

interface FuturisticAlertCardProps {
  title: string;
  message: string;
  onClose: () => void;
  open: boolean;
}

export default function FuturisticAlertCard({
  title,
  message,
  onClose,
  open,
}: FuturisticAlertCardProps) {
  return (
    <div
      className={`pointer-events-auto bg-gradient-to-r 
        p-6 rounded-3xl text-center text-white max-w-sm w-full
        shadow-[0_0_30px_rgba(255,0,255,0.6)]
        transform transition-all duration-500
        ${
          open
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-90 -translate-y-10"
        }`}
    >
      <h2 className="text-2xl font-bold mb-3 tracking-wide">{title}</h2>
      <p className="mb-6 text-white/90">{message}</p>
      <button
        onClick={onClose}
        className="px-6 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-white font-semibold
        transition-all duration-300 shadow-[0_0_10px_rgba(255,255,255,0.5)]"
      >
        OK
      </button>
    </div>
  );
}
