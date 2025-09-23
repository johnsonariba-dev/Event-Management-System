import { motion } from "framer-motion";
import { Home } from "lucide-react";
import { FaCheckCircle, FaUsers, FaUser, FaProjectDiagram } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import images from "../types/images";

type SidebarProps = {
  isOpen: boolean;
  toggle: () => void;
  isMobile?: boolean;
};

export default function AdminSidebar({ isOpen, toggle, isMobile }: SidebarProps) {
  const linkClasses = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2 p-2 rounded transition-colors ${
      isActive ? "bg-purple-400 text-white" : "hover:bg-purple-400/40"
    }`;

  // Mobile drawer
  if (isMobile) {
    return (
      <>
        {isOpen && <div className="fixed inset-0 bg-black/40 z-30" onClick={toggle} />}

        <motion.aside
          initial={{ x: -250 }}
          animate={{ x: isOpen ? 0 : -250 }}
          transition={{ duration: 0.25 }}
          className="fixed top-0 left-0 h-full w-60 bg-primary text-white z-40 flex flex-col"
        >
          <div className="flex items-center justify-between h-16 border-b border-primary px-4">
            <span className="text-xl font-bold">Admin</span>
            <button onClick={toggle}>✕</button>
          </div>

          <nav className="flex flex-col gap-2 p-2">
            <NavLink onClick={toggle} to="/admindashboard" className={linkClasses}>
              <Home size={20} />
              <span>Home</span>
            </NavLink>

            <NavLink onClick={toggle} to="/admindashboard/event-approval" className={linkClasses}>
              <FaCheckCircle size={20} />
              <span>Event Approval</span>
            </NavLink>

            <NavLink onClick={toggle} to="/admindashboard/users" className={linkClasses}>
              <FaUsers size={20} />
              <span>User Management</span>
            </NavLink>

            <NavLink onClick={toggle} to="/admindashboard/organizers" className={linkClasses}>
              <FaUser size={20} />
              <span>Organizer Management</span>
            </NavLink>

            <NavLink onClick={toggle} to="/admindashboard/reports" className={linkClasses}>
              <FaProjectDiagram size={20} />
              <span>Reports & Analytics</span>
            </NavLink>
          </nav>
        </motion.aside>
      </>
    );
  }

  // Desktop sidebar
  return (
    <motion.aside
      initial={false}
      animate={{ width: isOpen ? 240 : 64 }}
      transition={{ duration: 0.25 }}
      className="h-screen bg-purple-100 text-black flex flex-col fixed top-0 left-0 z-20"
    >
      <NavLink to="/">
        <div className="flex items-center justify-center h-16 border-b border-primary p-2">
          {isOpen ? (
            <img src={images.logo} alt="Logo" className="w-40 p-2" />
          ) : (
            <img src={images.brand} alt="Brand" className="p-2" />
          )}
        </div>
      </NavLink>

      <nav className="flex flex-col gap-2 p-2">
        <NavLink to="/admindashboard" className={linkClasses}>
          <Home size={20} />
          {isOpen && <span>Home</span>}
        </NavLink>

        <NavLink to="/admindashboard/event-approval" className={linkClasses}>
          <FaCheckCircle size={20} />
          {isOpen && <span>Event Approval</span>}
        </NavLink>

        <NavLink to="/admindashboard/users" className={linkClasses}>
          <FaUsers size={20} />
          {isOpen && <span>User Management</span>}
        </NavLink>

        <NavLink to="/admindashboard/organizers" className={linkClasses}>
          <FaUser size={20} />
          {isOpen && <span>Organizer Management</span>}
        </NavLink>

        <NavLink to="/admindashboard/reports" className={linkClasses}>
          <FaProjectDiagram size={20} />
          {isOpen && <span>Reports & Analytics</span>}
        </NavLink>
      </nav>
    </motion.aside>
  );
}
