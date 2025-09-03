import React, {useState} from "react";

import Button from "../../../components/button";

import images from "../../../types/images";
import { Link } from "react-router-dom";

const URL_API = "";



function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleSubmite = async () =>{
    try{
      const response = await fetch(URL_API,{
        method: "post",
        headers: {"content-type": "application/json"},
        body:JSON.stringify({name, email, password}),

      })
      if(!response.ok){
        throw new Error("registration failed ")
      }
      
      const data = await response.json()

      localStorage.setItem("token", data.token);
      window.location.href = "/dashboard";
    }
    catch(err: Any){
      setError(err.message);
    }
  }
  // ***REMOVED***;



  return (
    <div className="p-20 w-full flex flex-cool items-center justify-center bg-gray-100">
      <div className="w-[50vw] flex items-center justify-center bg-white border-violet-500 border-3 p-4 rounded-md max-md:flex-col shadow-2xl mt-10 max-sm:flex-col-reverse">
        <form
          action=""
          method="post"
          className="w-full flex flex-col items-center justify-center gap-10 p-4 max-md:p-1"
        >
          <h1 className="text-2xl font-bold max-sm:text-lg">
            Create an account
          </h1>
          <div className="w-full px-4 flex flex-col gap-2">
            <p>{error} </p>
            <input
              type="text"
              placeholder="Name"
              onChange={(e) => setName(e.target.value)}
              value={name}
              id=""
              className="w-full border-2 border-violet-500 rounded-sm outline-none p-2  transition-transform duration-300 hover:scale-105"
            />
            <input
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              placeholder="Email"
              className="w-full border-2 border-violet-500 rounded-sm outline-none p-2 transition-transform duration-300 hover:scale-105"
            />
            <input
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              placeholder="Password"
              className="w-full border-2 border-violet-500 rounded-sm outline-none p-2 transition-transform duration-300 hover:scale-105"
            />
            <div className="flex w-full items-center justify-between max-sm:flex-col max-md:flex-col">
              <div className="flex items-center w-full">
                <input
                  type="checkbox"
                  name=""
                  id=""
                  className="transition-transform duration-300 hover:scale-105"
                />
                <label htmlFor="chekbox" className="text-sm px-2 ">
                  Remember Me
                </label>
              </div>
             
            </div>
          </div>
          <Button
            title="Register"
            onclick={handleSubmite}
            className="transition-transform duration-300 hover:scale-105"
          />
          <div className="w-full flex items-center justify-center space-x-4 max-sm:flex-col max-sm:items-center">
            <p className="">Already have an account? </p>
            <Link to="/Login">
              <span className="text-secondary tex-lg font-bold transition-transform duration-300 hover:text-violet-500">
                Login
              </span>
            </Link>
          </div>
        </form>
        <div className="w-full flex items-center justify-center p-2 max-sm:hidden">
          <img src={images.login} alt="" className="w-full" />
        </div>
      </div>
    </div>
  );
}

export default Register
