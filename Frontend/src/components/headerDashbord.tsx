import { FaPlus } from "react-icons/fa6";
import { CgProfile } from "react-icons/cg";
import Button from "./button";
import { NavLink } from "react-router-dom";
import { IoMdContact } from "react-icons/io";

interface Props {
  title: string;
}

const HeaderDashboard: React.FC<Props> = ({ title }) => {
  return (
    <div className="flex flex-row justify-between items-center p-4 border-b">
      {/* Title */}
      <h1 className="text-xl sm:text-2xl font-bold">{title}</h1>

      {/* Right side actions */}
      <div className="flex items-center">
        {/* Desktop buttons */}
        <div className="hidden md:flex gap-6">
          <NavLink to="/CreateEvent">
            <Button
              icon={<FaPlus />}
              title="Create Event"
              className="w-full sm:w-auto"
            />
          </NavLink>
          <NavLink to={"/OrganizerProfile"}>
         <IoMdContact size={40} className="text-primary"/>
          </NavLink>
        </div>

        {/* Mobile icons in a row with spacing */}
        <div className="flex md:hidden flex-row items-center">
          <NavLink to="/CreateEvent">
            <Button
              icon={<FaPlus color="#47348A" size={22} />}
              title=""
              className="bg-white border border-primary rounded-xl p-0"
            />
          </NavLink>
          <Button
            title=""
            icon={<CgProfile color="#47348A" size={33} />}
            className="bg-white  rounded-xl p-2"
          />
        </div>
      </div>
    </div>
  );
};

export default HeaderDashboard;
