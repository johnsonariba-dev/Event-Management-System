import { motion } from "framer-motion";
import { Bell } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type TopbarProps = {
  isOpen: boolean;
  toggle: () => void;
  isMobile?: boolean;
};

interface User {
  username: string;
  email: string;
}

export default function Topbar({ isOpen, toggle, isMobile }: TopbarProps) {
  const sidebarWidth = isMobile ? 0 : isOpen ? 240 : 64;
  const [adminInfo, setAdminInfo] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return console.error("No token");

    fetch("http://localhost:8000/user/me", {
      method: "GET",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Erreur lors de la récupération");
        const data: User = await res.json();
        setAdminInfo(data);
      })
      .catch((err) => console.error(err.message));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <motion.header
      initial={false}
      animate={{
        left: isMobile ? 0 : sidebarWidth,
        width: isMobile ? "100%" : `calc(100% - ${sidebarWidth}px)`,
      }}
      transition={{ duration: 0.25 }}
      className="fixed top-0 z-10 h-16 w-full bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6 lg:px-10"
    >
      {/* Left */}
      <div className="flex items-center gap-2 md:gap-4 flex-1">
        <button
          onClick={toggle}
          className="p-2 rounded bg-gray-100 hover:bg-gray-200 transition-colors md:mr-2"
        >
          ☰
        </button>
        <div className="flex flex-col  gap-1 md:gap-3">
          <span className="font-semibold text-sm md:text-base">
            Event Management Admin
          </span>
          <span className="text-xs max-md:hidden text-gray-500 ">
            Dashboard & Control Panel
          </span>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2 md:gap-4">
        <Bell className="w-5 h-5 md:w-6 md:h-6 text-gray-600" />

        <div className="flex items-center gap-2 md:gap-3">
          <div className="text-right">
            <p className="text-xs md:text-sm font-medium">
              {adminInfo?.username
                ? adminInfo.username.charAt(0).toUpperCase() +
                  adminInfo.username.slice(1)
                : ""}
            </p>
            <p className="text-[10px] md:text-xs text-gray-500">
              {adminInfo?.email ?? ""}
            </p>
          </div>
          <div className="w-6 h-6 md:w-8 md:h-8 flex items-center justify-center rounded-full bg-primary text-white text-xs md:text-sm">
            {adminInfo?.username.charAt(0).toUpperCase()}
          </div>
          <button
            onClick={handleLogout}
            className="ml-2 md:ml-4 px-2 md:px-4 py-1 md:py-1.5 bg-red-500 rounded-md text-xs md:text-sm text-white hover:bg-red-600 transition-colors"
          >
            LogOut
          </button>
        </div>
      </div>
    </motion.header>
  );
}
