import { useState } from "react";
import images from "../../../types/images";
import Button from "../../../components/button";
import { Link } from "react-router-dom";

const URL_API = "";

function Login() {
  const [email, setEmail] = useState("");
  const [password, ssetPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmite = async () => {
    try {
      const response = await fetch(URL_API, {
        method: "post",
        headers: { "content-type": "applisation/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        throw new Error("Login fial");
      }
      const data = await response.json();
      localStorage.setItem("token", data.token);
      window.location.href = "/Dashboard";
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknow error occured");
      }
    }
  };

  return (
    <div className="p-20 w-full flex h-screen flex-cool items-center justify-center bg-gray-100">
      <div className="w-[50vw] flex items-center justify-center bg-white border-violet-500 border-3 p-4 rounded-md max-md:flex-col shadow-2xl mt-10 max-sm:flex-col-reverse">
        <form
          action=""
          method="post"
          className="w-full flex flex-col items-center justify-center gap-10 p-4"
        >
          <h1 className="text-2xl font-bold max-sm:text-sm max-lg:text-xl">
            Login To Your Account
          </h1>
          <p> {error} </p>
          <div className="w-full px-4 flex flex-col gap-2">
            <input
              type="email"
              value={email}
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-2 border-violet-500 rounded-sm outline-none p-2 transition-transform duration-300 hover:scale-105"
            />
            <input
              type="password"
              value={password}
              placeholder="Password"
              onChange={(e) => ssetPassword(e.target.value)}
              className="w-full border-2 border-violet-500 rounded-sm outline-none p-2 transition-transform duration-300 hover:scale-105"
            />
            <div className="flex w-full items-center justify-between max-sm:flex-col">
              <div className="flex items-center"></div>
              <a
                href=""
                className="text-sm px-2 text-secondary transition-transform duration-300 hover:text-violet-500"
              >
                Forgot Password?
              </a>{" "}
            </div>
          </div>
          <Button
            title="Login"
            onclick={handleSubmite}
            className="transition-transform duration-300 hover:scale-105"
          />
          <p className="">
            Do not have an account?{" "}
            <Link to="/Register">
              {" "}
              <span className="text-secondary tex-lg font-bold transition-transform duration-300 hover:text-violet-500">
                Register
              </span>
            </Link>
          </p>
        </form>
        <div className="w-full flex items-center justify-center p-2 max-sm:hidden">
          <img src={images.login} alt="" className="w-full animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export default Login;
