import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Ticket, LogOut, Calendar } from "lucide-react";

import Personal from "./personal";
import Security from "./security";
import UserTicket from "./userTicket";
import Logout from "./userlogout";
import images from "../types/images";
import { Link } from "react-router-dom";
import UserCalendar from "./UserCalendar"

const routes = [
  { id: "personal", label: "Personal Info", icon: <User size={20} /> },
  { id: "usercalendar", label: "Calendar", icon: <Calendar size={20} /> },
  { id: "tickets", label: "Tickets", icon: <Ticket size={20} /> },
  { id: "logout", label: "Logout", icon: <LogOut size={20} /> },
];

const Profile: React.FC = () => {
  const [active, setActive] = useState("personal");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const renderContent = () => {
    switch (active) {
      case "personal":
        return <Personal />;
      case "security":
        return <Security />;
      case "tickets":
        return <UserTicket />;
      case "logout":
        return <Logout />;
      case "usercalendar":
        return <UserCalendar />;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-primary/5">
      {/* Desktop Sidebar */}
      {!isMobile && (
        <aside className="fixed top-0 left-0 h-full w-64 bg-primary text-white flex flex-col shadow-xl">
          <div className="px-6 py-6 flex justify-center items-center border-b-2 border-secondary gap-3">
            <Link
              to="/"
              className="px-2 rounded-xl transform transition-transform duration-300 hover:scale-105"
            >
              <img src={images.brand} alt="Logo" className="w-10 h-10" />
            </Link>
          </div>

          <nav className="flex flex-col mt-6 gap-3 px-3">
            {routes.map((route) => (
              <button
                key={route.id}
                onClick={() => setActive(route.id)}
                className={`flex items-center gap-3 px-4 py-4 text-left rounded-lg transition-all border-l-4 ${
                  active === route.id
                    ? "bg-secondary text-white border-white shadow-md"
                    : "text-white/80 border-transparent hover:bg-white/10 hover:text-secondary hover:border-secondary"
                }`}
              >
                {route.icon}
                <span className="text-base">{route.label}</span>
              </button>
            ))}
          </nav>
        </aside>
      )}

      {/* Main Content */}
      <main
        className={`flex-1 p-6 transition-all ${
          !isMobile ? "md:ml-64" : "pb-28"
        }`}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Mobile Bottom Menu */}
      {isMobile && (
        <AnimatePresence>
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            transition={{ type: "spring", stiffness: 120, damping: 15 }}
            className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[92%] bg-primary/95 text-white border border-secondary shadow-xl rounded-2xl px-4 py-4 flex justify-around gap-3"
          >
            {routes.map((route) => (
              <button
                key={route.id}
                onClick={() => setActive(route.id)}
                className={`flex flex-col items-center text-xs px-3 py-2 rounded-md transition ${
                  active === route.id
                    ? "text-secondary font-semibold bg-white/10"
                    : "text-white/80 hover:text-secondary hover:bg-white/10"
                }`}
              >
                {route.icon}
                <span>{route.label}</span>
              </button>
            ))}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};

export default Profile;
