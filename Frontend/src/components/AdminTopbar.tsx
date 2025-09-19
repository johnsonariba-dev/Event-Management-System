import { motion } from "framer-motion";
import { Bell } from "lucide-react";

type TopbarProps = {
  isOpen: boolean;
  toggle: () => void;
  isMobile?: boolean;
};

export default function Topbar({ isOpen, toggle, isMobile }: TopbarProps) {
  const sidebarWidth = isMobile ? 0 : isOpen ? 240 : 64;

  return (
    <motion.header
      initial={false}
      animate={{
        left: isMobile ? 0 : sidebarWidth,
        width: isMobile ? "100%" : `calc(100% - ${sidebarWidth}px)`,
      }}
      transition={{ duration: 0.25 }}
      className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 fixed top-0 z-10"
    >
      {/* Left */}
      <div className="flex items-center gap-2">
        <button onClick={toggle} className="mr-2 p-2 rounded bg-gray-100">
          ☰
        </button>
        <span className="font-semibold">Event Management Admin</span>
        <span className="text-sm text-gray-500">Dashboard & Control Panel</span>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        <Bell className="w-5 h-5 text-gray-600" />
        <div className="flex items-center gap-2">
          <div className="text-right">
            <p className="text-sm font-medium">Admin User</p>
            <p className="text-xs text-gray-500">admin@eventmanager.com</p>
          </div>
          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-indigo-500 text-white">
            A
          </div>
        </div>
      </div>
    </motion.header>
  );
}
