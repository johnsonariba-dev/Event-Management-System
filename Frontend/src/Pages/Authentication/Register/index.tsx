import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../../components/button";
import images from "../../../types/images";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { useAuth } from "../../Context/UseAuth";

const URL_API = "http://localhost:8000/user/register";

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);

  const handlePassword = () => setShowPassword(!showPassword);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!role) {
      setError("Please select a role");
      return;
    }

    try {
      const response = await fetch(URL_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password, role }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Registration failed");
      }

      const data = await response.json();
      const token = data.access_token;

      // Automatically login after registration
      login(token, role, email);

      setSuccess(true);

      setTimeout(() => {
     if (role === "organizer") navigate("/Login");
        else navigate("/Login");
      }, 1500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100 p-6 pt-20">
      <div className="flex w-full max-w-6xl rounded-2xl shadow-2xl bg-white max-md:flex-col">
        {/* Left Form */}
        <div className="w-full md:w-1/2 flex flex-col justify-center bg-[url(/src/assets/images/sign.jpg)] bg-rotate-90 bg-cover rounded-l-2xl max-md:rounded-2xl">
          <div className="p-10 flex flex-col justify-center bg-white h-full rounded-br-[50px] rounded-l-2xl max-md:rounded-2xl">
            <form onSubmit={handleSubmit} className="flex flex-col space-y-5">
              <h1 className="text-3xl font-bold text-center pb-5">
                Create an account
              </h1>

              {success && (
                <div className="bg-green-500 rounded-lg">
                  <h1 className="text-center p-2 text-2xl text-white">
                    Registration Successful
                  </h1>
                </div>
              )}

              {error && <p className="text-red-500 text-center">{error}</p>}

              <input
                type="text"
                placeholder="Name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border-2 border-violet-500 rounded-md p-3 outline-none focus:ring-2 focus:ring-violet-400"
                required
              />

              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-2 border-violet-500 rounded-md p-3 outline-none focus:ring-2 focus:ring-violet-400"
                required
              />

              <div className="relative w-full">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border-2 border-violet-500 rounded-md p-3 outline-none focus:ring-2 focus:ring-violet-400"
                  required
                />
                <button
                  type="button"
                  onClick={handlePassword}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-violet-500"
                >
                  {showPassword ? <FaRegEye size={22} /> : <FaRegEyeSlash size={22} />}
                </button>
              </div>

              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full border-2 border-violet-500 rounded-md p-3 outline-none focus:ring-2 focus:ring-violet-400"
                required
              >
                <option value="">Select Role</option>
                <option value="user">User</option>
                <option value="organizer">Organizer</option>
              </select>

              <div className="flex items-center">
                <input id="remember" type="checkbox" className="mr-2" />
                <label htmlFor="remember" className="text-sm">
                  Remember Me
                </label>
              </div>

              <div className="flex justify-center pt-4">
                <Button
                  type="submit"
                  title="Register"
                  className="px-8 py-3 text-white rounded-md transition"
                />
              </div>

              <div className="text-center">
                <p>
                  Already have an account?{" "}
                  <Link
                    to="/Login"
                    className="font-bold text-violet-500 hover:text-secondary hover:underline"
                  >
                    Login
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>

        {/* Right Image */}
        <div className="max-md:hidden w-1/2 overflow-hidden rounded-r-2xl rounded-tl-[50px]">
          <img
            src={images.register}
            alt="Register"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default Register;
