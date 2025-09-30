import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/button";
import images from "../../../types/images";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { useAuth } from "../../Context/UseAuth";

const URL_API = "http://localhost:8000/admin/login";

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);

  const handlePassword = () => setShowPassword(!showPassword);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await fetch(URL_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) throw new Error("Email or password incorrect");

      const data = await res.json();
      const token = data.access_token;
      const role = data.role || "user";

      if (!token) throw new Error("Token missing from response");

      login(token, role, email);
      setSuccess(true);

      setTimeout(() => {
        if (role === "admin") navigate("/admindashboard");
        else if (role === "organizer") navigate("/CreateEvent");
        else navigate("/admindashboard");
      }, 1000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100 p-6 pt-20">
      <div className="flex w-full max-w-6xl rounded-2xl shadow-2xl bg-white max-md:flex-col">
        {/* Left Image */}
        <div className="max-md:hidden w-1/2 overflow-hidden rounded-br-[50px] rounded-l-2xl">
          <img
            src={images.register}
            alt="Register"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right Login Form */}
        <div className="w-full md:w-1/2 flex flex-col justify-center bg-[url(/src/assets/images/sign.jpg)] max-md:rounded-2xl bg-cover rounded-r-2xl">
          <div className="p-10 flex flex-col justify-center bg-white h-full max-md:rounded-2xl rounded-r-2xl rounded-tl-[50px]">
            <form onSubmit={handleSubmit} className="flex flex-col space-y-5">
              <h1 className="text-3xl font-bold text-center pb-10">
                Login to Your Account
              </h1>
              {success && (
                <div className="bg-green-500 rounded-lg text-center text-white p-2">
                  Login Successful
                </div>
              )}
              {error && <p className="text-red-500 text-center">{error}</p>}

              {/* Email */}
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-2 border-violet-500 rounded-md p-3 outline-none focus:ring-2 focus:ring-violet-400"
                required
              />

              {/* Password */}
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
                  {showPassword ? (
                    <FaRegEye size={22} />
                  ) : (
                    <FaRegEyeSlash size={22} />
                  )}
                </button>
              </div>

              {/* Forgot password */}
              <div className="flex justify-between items-center max-sm:flex-col">
                <div></div>
                <a
                  href="/forgot-password"
                  className="text-sm px-2 text-secondary hover:text-violet-500"
                >
                  Forgot Password?
                </a>
              </div>

              {/* Submit */}
                <div className="flex justify-center pt-4">
                  <Button
                    type="submit"
                    title="Login"
                    className="px-8 py-3 text-white rounded-md transition"
                  />
                </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;