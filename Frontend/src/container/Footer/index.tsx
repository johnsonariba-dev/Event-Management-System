import React from "react";
import { FaPhoneAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FaLocationDot } from "react-icons/fa6";
import { SiLinkedin } from "react-icons/si";
import { FaInstagramSquare } from "react-icons/fa";
import { FaSquareFacebook } from "react-icons/fa6";
import { FaSquareTwitter } from "react-icons/fa6";
import { GoDotFill } from "react-icons/go";

import Button from "../../components/button";
import { NavLink } from "react-router-dom";

const Footer: React.FC = () => {
  return (
    <div className="bg-primary text-gray-300 font-light text-sm px-8 py-6 w-100% ">
      <div className="flex justify-between max-lg:flex-col">
        <div className="w-100 mt-5 max-lg:w-full">
          <h1 className="font-bold mb-3">
            Plan <span className="text-secondary">Vibes.</span>{" "}
          </h1>
          <p className="font-light text-sm">
            Join us for a transformative experience at our upcoming events.
            Discover outing-edge insight, network with industry.
          </p>
          <div className="flex gap-3 py-4">
            <SiLinkedin size={20} />
            <FaInstagramSquare size={20} />
            <FaSquareFacebook size={20} />
            <FaSquareTwitter size={20} />
          </div>
          <NavLink to={"/"} className="hover:text-secondary underline">
            www.planvibes.com
          </NavLink>
        </div>
        <div className="mt-5">
          <h1 className="font-bold mb-3 ">Important Links</h1>
          <ul>
            <li className="mb-1 flex items-center gap-2">
              <GoDotFill />
              Home
            </li>
            <li className="mb-1 flex items-center gap-2">
              <GoDotFill />
              About
            </li>
            <li className="mb-1 flex items-center gap-2">
              <GoDotFill />
              Browse Events
            </li>
            <li className="mb-1 flex items-center gap-2">
              <GoDotFill />
              Login
            </li>
            <NavLink to="/Dashboard">
              <li className="mb-1 flex items-center gap-2 underline text-secondary">
                <GoDotFill />
                Admin Dashboard
              </li>
            </NavLink>
          </ul>
        </div>
        <div className="mt-5">
          <h1 className="font-bold mb-3">Get In Touch</h1>
          <div className="flex flex-row gap-2 items-center">
            <FaLocationDot size={20} />
            <p> Douala - Cameroon</p>
          </div>
          <div className="flex flex-row gap-2 items-center py-2">
            <MdEmail size={20} />
            planvibes1@gmail.com
          </div>
          <div className="flex flex-row gap-2 items-center">
            <FaPhoneAlt size={20} />
            <p> (+237) 652-173-171</p>
          </div>
          <Button title="Buy A Ticket" className="bg-secondary mt-3" type="" />
        </div>
      </div>
      <hr className="mt-3" />
      <div className="flex flex-col justify-center items-center mt-3">
        <p>©Copyright 2025 | Plan Vibes - Events | All right reserved.</p>
      </div>
    </div>
  );
};

export default Footer;
