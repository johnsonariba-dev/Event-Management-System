import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../../components/AdminSidebar";
import Topbar from "../../components/AdminTopbar";
import { motion } from "framer-motion";

export default function AdminDashboard() {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => setIsOpen((prev) => !prev);
  const sidebarWidth = isOpen && !isMobile ? 240 : 64;

  return (
    <div className="flex min-h-screen w-screen">
      {/* Sidebar */}
      <AdminSidebar isOpen={isOpen} toggle={toggleSidebar} isMobile={isMobile} />

      {/* Main content */}
      <div className="flex flex-col flex-1 min-w-0">
        <Topbar isOpen={isOpen} toggle={toggleSidebar} isMobile={isMobile} />

        {/* Motion container */}
        <motion.main
          initial={false}
          animate={{
            marginLeft: isMobile ? 0 : sidebarWidth,
          }}
          transition={{ type: "tween", duration: 0.25 }}
          className="flex-1 bg-gray-50 p-4 md:p-6 min-w-0"
        >
          <Outlet />
        </motion.main>
      </div>

      {/* Mobile overlay */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
}
