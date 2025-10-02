import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import { FaPlus } from "react-icons/fa6";
import { IoMdContact } from "react-icons/io";
import Button from "../../components/button";
import images from "../../types/images";
import { useAuth } from "../../Pages/Context/UseAuth";
import { useModalAlert } from "../../components/ModalContext";

interface NavBarProps {
  items: NavBarItems[];
}

interface NavBarItems {
  title: string;
  path: string;
}

const NavBar: React.FC<NavBarProps> = ({ items }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { token, role } = useAuth();
  const modal = useModalAlert();
  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const canCreateEvent =
    token &&
    (role?.toLowerCase() === "organizer" || role?.toLowerCase() === "admin");

  const navigate = useNavigate();
  const handleProfile = () => {
    if (!token) {
      modal.show("Please login to access your profile.", "close");
      return navigate("/Login");
    }

    if (role === "organizer") {
      navigate("/organizerProfile");
    } else if (role === "user") {
      navigate("/profile");
    } else {
      modal.show("Unknown role. Please contact support.", "close");
    }
  };

  return (
    <div className="relative z-4 flex flex-col w-full items-center">
      <div className="flex justify-between items-center fixed bg-white w-full px-6">
        <NavLink to={"/"} className="w-20 object-cover">
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

          {/* Role-based buttons */}
          {canCreateEvent && (
            <NavLink to="/CreateEvent">
              <Button icon={<FaPlus />} title="Create Event" />
            </NavLink>
          )}

          {!token ? (
            <>
              <NavLink to="/Register">
                <Button title="Register" />
              </NavLink>
              <NavLink to="/Login">
                <Button title="Login" />
              </NavLink>
            </>
          ) : (
            <IoMdContact
              size={40}
              className="text-primary"
              onClick={handleProfile}
            />
          )}
             
        </div>
      </div>

      {/* Mobile Nav */}
      <div>
        <div
          onClick={toggleMenu}
          className="hidden max-lg:block absolute top-6 right-12 cursor-pointer z-10 flex items-center justify-center"
        >
          {isOpen ? (
            <FiX size={24} className="fixed" />
          ) : (
            <div className="flex space-x-12 items-center ">
             {token && (role?.toLowerCase() === "organizer" || role?.toLowerCase() === "user")  &&(
               <div className="mb-2">
                <IoMdContact
                  size={40}
                  className="text-primary fixed"
                  onClick={handleProfile}
                />
              </div>
             ) }
              <div>
                <FiMenu size={24} className="fixed" />
              </div>
            </div>
          )}
        </div>

        {isOpen && (
          <div className="max-lg:flex flex-col gap-2 items-center bg-purple-50 p-5 fixed w-full right-0 rounded-lg shadow-lg">
            <ul className="flex flex-col gap-2 text-xl items-center pt-10">
              {items.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    onClick={closeMenu}
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
              {/* Role-based buttons */}
              {canCreateEvent && (
                <NavLink to="/CreateEvent">
                  <Button
                    onClick={closeMenu}
                    title="Create Event"
                    icon={<FaPlus />}
                    className="mt-6 px-10"
                  />
                </NavLink>
              )}

              {!token ? (
                <>
                  <NavLink to="/Login">
                    <Button
                      title="Login"
                      className="my-3 px-20"
                      onClick={closeMenu}
                    />
                  </NavLink>
                  <NavLink to="/Register">
                    <Button
                      title="Register"
                      className="px-18"
                      onClick={closeMenu}
                    />
                  </NavLink>
                </>
              ) : (
                <></>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NavBar;