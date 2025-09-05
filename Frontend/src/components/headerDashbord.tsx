import { FaChevronDown, FaPlus } from "react-icons/fa6";
import Button from "./button";
import { NavLink } from "react-router-dom";

interface Props {
  title: string;
}

const HeaderDashboard: React.FC<Props> = ({ title }) => {
  return (
    <div className="flex justify-between items-center p-4 border-b ">
      <h1 className="text-2xl font-bold">{title}</h1>
      <div className="flex gap-10">
        <NavLink to="/CreateEvent">
          <Button icon={<FaPlus />} title="Create Event" />
        </NavLink>
        <Button title="User Profile" icon={<FaChevronDown />} />
      </div>
    </div>
  );
};

export default HeaderDashboard;
