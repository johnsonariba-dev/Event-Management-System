import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../../components/button";
import images from "../../../types/images";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
<<<<<<< Updated upstream
<<<<<<< HEAD
import {jwtDecode} from "jwt-decode";
=======
<<<<<<< Updated upstream
=======
import { useAuth } from "../../Context/UseAuth";
>>>>>>> Stashed changes
>>>>>>> b0ff3c1 (new install)
=======
import { useAuth } from "../../Context/UseAuth";
>>>>>>> Stashed changes

const URL_API = "http://localhost:8000/user/login";

function Login() {
  const navigate = useNavigate();
  const { setEmail, setRole, setToken } = useAuth();

  const [emailInput, setEmailInput] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);

  const handlePassword = () => setShowPassword(!showPassword);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch(URL_API, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          username: emailInput,
          password: password,
        }),
      });

      if (!response.ok) {
        throw new Error("Email or password incorrect");
      }

<<<<<<< HEAD
      const data = await response.json();
      const token = data.access_token;
      const role = data.role;

      // Save in context and localStorage
      setToken(token);
      setRole(role);
      setEmail(emailInput);
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("email", emailInput);

=======
<<<<<<< Updated upstream
>>>>>>> b0ff3c1 (new install)
      setSuccess(true);

      // Redirect based on role
      setTimeout(() => {
<<<<<<< Updated upstream
<<<<<<< HEAD
        navigate("/events");
=======
        if (role === "admin") navigate("/admin/dashboard");
        else if (role === "organizer") navigate("/CreateEvent");
        else navigate("/events"); // normal user
>>>>>>> Stashed changes
      }, 1000);
=======
        navigate("/events"); 
      }, 3000);
=======
      const data = await response.json();
      const token = data.access_token;
      const role = data.role;

      // Save in context and localStorage
      setToken(token);
      setRole(role);
      setEmail(emailInput);
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("email", emailInput);

      setSuccess(true);

      // Redirect based on role
      setTimeout(() => {
        if (role === "admin") navigate("/admin/dashboard");
        else if (role === "organizer") navigate("/CreateEvent");
        else navigate("/events"); // normal user
      }, 1000);
>>>>>>> Stashed changes
>>>>>>> b0ff3c1 (new install)
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100 p-6 pt-20">
      <div className="flex w-full max-w-6xl rounded-2xl shadow-2xl bg-white max-md:flex-col">
        <div className="max-md:hidden w-1/2 items-center justify-center overflow-hidden rounded-br-[50px] rounded-l-2xl">
          <img
            src={images.register}
            alt="Register"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="w-full md:w-1/2 flex flex-col justify-center bg-[url(/src/assets/images/sign.jpg)] max-md:rounded-2xl bg-rotate-90 bg-cover rounded-r-2xl">
          <div className="p-10 flex flex-col justify-center bg-white h-full max-md:rounded-2xl rounded-r-2xl rounded-tl-[50px]">
            <form onSubmit={handleSubmit} className="flex flex-col space-y-5">
              <h1 className="text-3xl font-bold text-center pb-10">
                Login In Account
              </h1>

              {success && (
                <div className="bg-green-500 shadow-lg rounded-lg">
                  <h1 className="text-center p-2 text-2xl text-white">
                    Successful Login
                  </h1>
                </div>
              )}

              {error && <p className="text-red-500 text-center">{error}</p>}

              <input
                type="email"
                placeholder="Email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
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
                  {showPassword ? (
                    <FaRegEye size={22} />
                  ) : (
                    <FaRegEyeSlash size={22} />
                  )}
                </button>
              </div>

              <div className="flex w-full items-center justify-between max-sm:flex-col">
                <div></div>
                <Link
                  to="/forgot-password"
                  className="text-sm px-2 text-secondary transition-transform duration-300 hover:text-violet-500"
                >
                  Forgot Password?
                </Link>
              </div>

              <div className="flex justify-center pt-4">
                <Button
                  type="submit"
                  title="Login"
                  className="px-8 py-3 text-white rounded-md transition"
                />
              </div>

              <div className="text-center">
                <p>
                  Do not have an account?{" "}
                  <Link
                    to="/register"
                    className="font-bold text-violet-500 hover:text-secondary hover:underline"
                  >
                    Register
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
