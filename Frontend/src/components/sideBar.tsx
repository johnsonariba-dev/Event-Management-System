import { useState } from "react";
import { HiHome } from "react-icons/hi2";
import { FaRegCalendarAlt } from "react-icons/fa";
import { GrTicket } from "react-icons/gr";
import { VscSettingsGear } from "react-icons/vsc";
import { TbLogout } from "react-icons/tb";
import { Link } from "react-router-dom";

import Dashboard from "./dashboard";
import Settings from "./settings";
import Calendar from "./myCalendar";
import Tickets from "./tickets";
import images from "../types/images";
import HeaderDashboard from "./headerDashbord";
import CalendarComponent from "./myCalendar";

const SideBar = () => {
  const [active, setActive] = useState("dashboard");

  const links = [
    { id: "dashboard", icon: <HiHome size={28} className="max-md:w-5"/>, label: "Dashboard" },
    {
      id: "Calendar",
      icon: <FaRegCalendarAlt size={28} className="max-md:w-4"/>,
      label: "Calendar",
    },
    { id: "tickets", icon: <GrTicket size={28} className="max-md:w-5"/>, label: "Tickets" },
    { id: "settings", icon: <VscSettingsGear size={28} className="max-md:w-5" />, label: "Settings" },
  ];
  const activeTitle = (active: string) => {
    switch (active) {
      case "dashboard":
        return "Dashboard";
      case "Calendar":
        return "Calendar";
      case "tickets":
        return "Tickets";
      case "settings":
        return "Settings";
      default:
        return "";
    }
  };

  return (
    <div className="flex">
      <div className="w-20 max-md:w-15 fixed h-full bg-purple-100 flex flex-col items-center justify-between py-6">
        <div className="flex flex-col items-center gap-6">
          <Link to="/" className="p-2 rounded-xl hover:bg-purple-200">
            <img src={images.brand} alt="Logo" className="w-10 h-10" />
          </Link>

          {links.map(({ id, icon, label }) => (
            <button
              key={id}
              onClick={() => setActive(id)}
              className={`relative group flex items-center justify-center p-3 rounded-xl transition-colors duration-200 
              ${
                active === id
                  ? "bg-purple-300 text-purple-900"
                  : "text-gray-600 hover:bg-purple-200"
              }`}
            >
              {icon}
              <span className="absolute left-16 opacity-0 group-hover:opacity-100 transition bg-gray-800 text-white text-sm rounded-md px-2 py-1 whitespace-nowrap">
                {label}
              </span>
            </button>
          ))}
        </div>

        <div className="flex items-center justify-center p-3 rounded-xl text-gray-600 hover:bg-purple-200 relative group cursor-pointer">
          <TbLogout size={28} className="max-md:w-7"/>
          <span className="absolute left-16 opacity-0 group-hover:opacity-100 transition bg-gray-800 text-white text-sm rounded-md px-2 py-1 whitespace-nowrap">
            Logout
          </span>
        </div>
      </div>

      <div className="flex-1 bg-white pl-20 max-md:pl-14">
        <HeaderDashboard title={activeTitle(active)} />
        {active === "dashboard" && <Dashboard />}
        {active === "Calendar" && <CalendarComponent />}
        {active === "tickets" && <Tickets />}
        {active === "settings" && <Settings />}
      </div>
    </div>
  );
};

export default SideBar;
