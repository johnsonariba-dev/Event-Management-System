import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import { FaPlus } from "react-icons/fa6";
import Button from "../../components/button";
import images from "../../types/images";

interface NavBarProps {
  items: NavBarItems[];
}

interface NavBarItems {
  title: string;
  path: string;
}

const NavBar: React.FC<NavBarProps> = ({ items }) => {
  const [isOpen, setisOpen] = useState(false);

  const toggleMenu = () => {
    setisOpen(!isOpen);
  };

  useEffect(() => {
    const token = localStorage.getItem("token")
    const email = localStorage.getItem("email")

    if (token && email){
      
    }
  },[])

  return (
    <div className="relative z-4">
      <div className="flex justify-between items-center fixed bg-white w-full px-6">
        <NavLink to={"/"}
        className="w-20 object-cover">
          <img src={images.logo} alt="" className="w-full" />
        </NavLink>
        {/* Desktop Nav */}
        <div className="flex gap-10 items-center max-lg:hidden">
          <ul className="flex gap-8 text-xl max-xl:gap-4">
            {items.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `hover:text-primary ${
                      isActive ? "text-primary font-semibold underline" : ""
                    }`
                  }
                >
                  {item.title}
                </NavLink>
              </li>
            ))}
          </ul>
          <NavLink to="/CreateEvent">
            <Button icon={<FaPlus />} title="Create Event" />
          </NavLink>
          <NavLink to="/Register">
            <Button title="Register" />
          </NavLink>
          <NavLink to="/Login">
            <Button title="Login" />
          </NavLink>
        </div>
      </div>

      {/* Mobile Nav */}
      <div>
        <div
          onClick={toggleMenu}
          className="hidden max-lg:block absolute top-8 right-12 cursor-pointer fixed z-1 "
        >
          {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </div>

        {isOpen && (
          <div className="hidden max-lg:block flex flex-col gap-2 items-center bg-purple-50 transparent p-5 fixed absolute w-full right-0 rounded-lg shadow-lg">
            <ul className="flex flex-col gap-2 text-xl items-center pt-10">
              {items.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `hover:text-primary ${
                        isActive ? "text-primary font-semibold underline" : ""
                      }`
                    }
                  >
                    {item.title}
                  </NavLink>
                </li>
              ))}
            </ul>
            <div className="flex flex-col items-center justify-center">
              <NavLink to="/CreateEvent">
                <Button
                  title="Create Event"
                  icon={<FaPlus />}
                  className="mt-6 px-10"
                />
              </NavLink>
              <NavLink to="/Login">
                <Button title="Login" className="my-3 px-20" />
              </NavLink>
              <NavLink to="/Register">
                <Button title="Register" className="px-18" />
              </NavLink>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NavBar;
