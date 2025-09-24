import Button from "./button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Pages/Context/UseAuth";

const Logout: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth(); // use the same logout from NavBar

  const handleLogout = () => {
    logout(); // clear token/session etc.
    navigate("/login"); // redirect after logout
  };

  const handleCancel = () => {
    navigate(-1); // go back to previous page/profile
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full text-center border border-primary/20">
        <h1 className="text-2xl font-bold text-primary mb-3">Logout</h1>
        <p className="text-gray-600 mb-6">
          Are you sure you want to log out of your account?
        </p>

        <div className="flex justify-center gap-4">
          <Button
            title="Cancel"
            className="px-6 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 text-gray-700"
            onClick={handleCancel}
          />
          <Button
            title="Logout"
            className="px-6 py-2 rounded-lg bg-secondary text-white hover:bg-secondary/90"
            onClick={handleLogout}
          />
        </div>
      </div>
    </div>
  );
};

export default Logout;
