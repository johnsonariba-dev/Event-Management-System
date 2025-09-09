import { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../../../components/button";
import images from "../../../types/images";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

const URL_API = "http://localhost:8000/user/login";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handlePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async () => {
    setError(null);
    try {
      const response = await fetch(URL_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Login failed");
      }

      // const data = await response.json();
      // if (data?.token) {
      //   localStorage.setItem("token", data.token);
      //   console.log("TOKEN:", data.token);
        
      //   window.location.href = "/Events";
      // } else {
      //   throw new Error("No token returned from server");
      // }
      window.location.href = "/Events"
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100 p-6 pt-20">
      <div className="flex w-full max-w-6xl rounded-2xl shadow-2xl bg-white">
        <div className="w-full md:w-1/2 flex flex-col justify-center bg-[url(/src/assets/images/sign.jpg)] bg-rotate-90 bg-cover rounded-l-2xl max-md:rounded-2xl">
          <div className=" p-10 flex flex-col justify-center rounded-br-[50px] bg-white h-full rounded-l-2xl max-md:rounded-2xl">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
              className="flex flex-col space-y-5 "
            >
              <h1 className="text-3xl font-bold text-center pb-10">
                Login In Account
              </h1>

              {error && <p className="text-red-500 text-center">{error}</p>}

              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-2 border-violet-500 rounded-md p-3 outline-none focus:ring-2 focus:ring-violet-400"
              />

              <div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="absolute w-124 border-2 border-violet-500 rounded-md p-3 outline-none focus:ring-2 focus:ring-violet-400"
                />
                <p onClick={handlePassword}>
                  {showPassword ? (
                    <FaRegEye size={22} className="relative left-115 top-4" />
                  ) : (
                    <FaRegEyeSlash
                      size={22}
                      className="relative left-115 top-4"
                    />
                  )}
                </p>
              </div>
              <br />

              <div className="flex w-full items-center justify-between max-sm:flex-col">
                <div className="flex items-center"></div>
                <a
                  href=""
                  className="text-sm px-2 text-secondary transition-transform duration-300 hover:text-violet-500"
                >
                  Forgot Password?
                </a>{" "}
              </div>

              <div className="flex justify-center pt-4">
                <Button
                  title="Login"
                  className="px-8 py-3 text-white rounded-md transition"
                />
              </div>

              <div className="text-center">
                <p>
                  Do not have an account?{" "}
                  <Link
                    to="/Register"
                    className="font-bold text-violet-500 hover:text-secondary hover:underline"
                  >
                    Register
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>

        <div className="max-md:hidden  w-1/2 items-center justify-center overflow-hidden rounded-r-2xl rounded-tl-[50px]">
          <img
            src={images.register}
            alt="Register"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}

export default Register;
