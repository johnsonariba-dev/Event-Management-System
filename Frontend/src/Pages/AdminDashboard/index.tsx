import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../../components/AdminSidebar";
import Topbar from "../../components/AdminTopbar";
import { motion } from "framer-motion";

export default function AdminDashboard() {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Détection mobile / desktop
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const sidebarWidth = isMobile ? 0 : isOpen ? 240 : 64;

  return (
    <div className="flex min-h-screen w-screen">
      {/* Sidebar */}
      <AdminSidebar
        isOpen={isOpen}
        toggle={() => setIsOpen(!isOpen)}
        isMobile={isMobile}
      />

      {/* Zone principale */}
      <div className="flex flex-col flex-1">
        {/* Topbar */}
        <Topbar
          isOpen={isOpen}
          toggle={() => setIsOpen(!isOpen)}
          isMobile={isMobile}
        />

        {/* Contenu */}
        <motion.main
          initial={false}
          animate={{
            marginLeft: isMobile ? 0 : sidebarWidth,
          }}
          transition={{ type: "tween", duration: 0.25 }}
          style={{
            marginTop: 64, 
            padding: 24,
          }}
          className="min-h-screen bg-gray-50"
        >
          <Outlet />
        </motion.main>
      </div>
    </div>
  );
}
