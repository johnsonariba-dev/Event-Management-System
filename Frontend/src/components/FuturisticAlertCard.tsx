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
      className={`pointer-events-auto bg-white 
        p-6 rounded-3xl text-center text-black max-w-sm w-full
        shadow-[0_0_20px_]
        transform transition-all duration-500
        ${
          open
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-90 -translate-y-10"
        }`}
    >
      <h2 className="text-2xl font-bold mb-3 text-primary tracking-wide">{title}</h2>
      <p className="mb-6 text-black/90">{message}</p>
      <button
        onClick={onClose}
        className="px-6 py-2 bg-black/20 hover:bg-black/30 rounded-xl text-white font-semibold
        transition-all duration-300 shadow-[0_0_10px_rgba(255,255,255,0.5)]"
      >
        OK
      </button>
    </div>
  );
}
