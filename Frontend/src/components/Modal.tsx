import { useState, useRef, useEffect } from "react";
import type { ReactNode } from "react";
import ModalContext from "./ModalContext";
import FuturisticAlertCard from "./FuturisticAlertCard";

interface ModalAlertProviderProps {
  children: ReactNode;
}

export function ModalAlertProvider({ children }: ModalAlertProviderProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  const timeoutRef = useRef<number | null>(null);

  const show = (t: string, m: string) => {
    // Clear any previous timer
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    setTitle(t);
    setMessage(m);
    setOpen(true);

    // Auto-close after 5 seconds
    timeoutRef.current = window.setTimeout(() => setOpen(false), 5000);
  };

  const close = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(false);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <ModalContext.Provider value={{ show }}>
      {children}

      {open && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-xm">
          <FuturisticAlertCard
            title={title}
            message={message}
            onClose={close}
            open={open}
          />
        </div>
      )}
    </ModalContext.Provider>
  );
}
