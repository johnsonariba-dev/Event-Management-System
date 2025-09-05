import React from 'react'
import Button from '../../components/button'
import { FiBookmark, FiCalendar, FiMessageCircle, FiShare2 } from 'react-icons/fi';
import { HiHeart, HiLocationMarker, HiOutlineClock } from 'react-icons/hi';
import { HiStar, HiTicket } from 'react-icons/hi2';
import { FaCheck } from 'react-icons/fa6';

function EventDetails() {
  return (
    <div className="w-full flex flex-col items-center justify-center ">
      <div className="w-full relative h-[80vh] bg-accent">
        <div className="absolute w-full h-[80vh] bg-[url(/src/assets/images/ED.png)] bg-cover  flex items-center justify-center brightness-70"></div>
        <div className="relative w-full h-[80vh] flex items-center justify-end">
          <h1 className="absolute bottom-12 left-5 text-white text-[5vw] font-bold">
            React & Next.js Conference 2024
          </h1>
          <p className="absolute bottom-5 left-5 text-white text-4xl">tech</p>
        </div>
      </div>
      <div className="w-full flex max-md:flex-col justify-center items-center gap-4 p-5">
        <div className="w-full flex flex-col items-center justify-center p-4 gap-6">
          <div className="flex flex-col gap-6 w-full p-2 rounded-2xl   bg-gray-100 shadow-md">
            <div className="w-full flex justify-between items-center">
              <h1 className="text-lg font-semibold text-secondary">
                About This Event
              </h1>
              <div className="flex gap-4 text-2xl">
                <HiHeart className="text-primary" />
                <FiShare2 className="text-primary" />
              </div>
            </div>
            <p className="text-justify">
              Join us for the biggest React Conference of the year! This event
              brings together developers, designers, and tech enthusiasts from
              around the world to explore the latest trends and advancements in
              React and Next.js. Whether you're a seasoned pro or just starting
              out, there's something for everyone at this exciting event.
            </p>
            <div className="w-full flex justify-between items-center max-sm:flex-col gap-4">
              <div className="flex flex-col gap-2">
                <h1 className="text-lg font-semibold text-secondary">
                  By AI Learning Hub
                </h1>
                <p className="flex items-center gap-2 max-md:flex-col ">
                  Rating 4.8k (124 reviews)
                  <div className="flex items-center gap-1">
                    <HiStar className="text-secondary" />
                    <HiStar className="text-secondary" />
                    <HiStar className="text-secondary" />
                    <HiStar className="text-secondary" />
                    <HiStar className="text-secondary" />
                  </div>
                </p>
              </div>
              <Button
                icon={<FiMessageCircle size={24} />}
                title="Contact Organizer"
                className="bg-secondary hover:bg-primary transition-transform duration-300 hover:scale-105"
              />
            </div>
          </div>
          <div className="w-full flex flex-col gap-6 p-2  rounded-2xl  bg-gray-100 shadow-md">
            <h1 className="text-lg font-semibold text-secondary">
              Event Details
            </h1>
            <div className="flex gap-4 justify-stretch">
              <div className="flex flex-col gap-4 w-full">
                <div className="flex items-center gap-2 w-full  py-4">
                  <FiCalendar size={24} className="text-primary" />
                  <div className="flex flex-col w-full">
                    <h1 className="text-sm font-semibold">Date & Time</h1>
                    <p className="text-sm">
                      March 15, 2024 - 10:00 AM to 5:00 PM
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 w-full py-4">
                  <HiLocationMarker size={24} className="text-secondary" />
                  <div>
                    <h1 className="text-sm font-semibold">Location</h1>
                    <p className="text-sm">
                      Silicon Valley Tech Hub, Douala, Cameroon
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-4 w-full">
                <div className="flex  gap-2 w-full justify-end py-4 px-1">
                  <FiCalendar size={24} className="text-secondary" />
                  <div>
                    <h1 className="text-sm font-semibold">Date & Time</h1>
                    <p className="text-sm">
                      March 15, 2024 - 10:00 AM to 5:00 PM
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 w-full justify-end py-4 px-1">
                  <FiCalendar size={24} className="text-primary" />
                  <div className="">
                    <h1 className="text-sm font-semibold">Date & Time</h1>
                    <p className="text-sm">
                      March 15, 2024 - 10:00 AM to 5:00 PM
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-md flex flex-col items-center justify-center p-4 bg-purple shadow-md h-[65vh] max-md:h-[94vh] rounded-2xl">
          <div className="w-full flex justify-around gap-4 items-center p-4">
            <h1 className="text-white text-2xl">$299 per</h1>
            <HiTicket size={44} className="text-primary" />
          </div>
          <p className="text-white p-4">847 people registered</p>
          <div className="w-full flex   bg-primary h-3 rounded-2xl m-4">
            <div className="bg-secondary h-3 rounded-2xl w-[70%]"></div>
          </div>
          <div className="w-full flex justify-between items-center p-4 rounded-2xl bg-secondary/20 shadow m-4">
            <HiOutlineClock size={24} className="text-secondary" />
            <p className="text-white">Almost full!</p>
          </div>
          <Button
            icon={<FiBookmark />}
            title="Buy ticket"
            className="bg-secondary hover:bg-primary transition-transform duration-300 hover:scale-105 m-4"
          />
          <p className="text-white p-4 flex items-center gap-2">
            <FaCheck className="rounded-full bg-secondary  text-white" />{" "}
            <span>Instant confirmation</span>
          </p>
        </div>
      </div>
      <div className="w-full flex flex-col items-center justify-center p-8">
        <div className="w-full flex flex-col p-2 rounded-2xl bg-gray-100 shadow-md ">
          <h1 className="font-bold text-xl">Review & Ratings</h1>
          <div className="w-full flex flex-col items-center justify-center p-4 gap-4">
            <h1 className="font-bold text-2xl">5.0</h1>
            <div className="flex items-center gap-1 p-4">
              <HiStar className="text-secondary " />
              <HiStar className="text-secondary text-2xl" />
              <HiStar className="text-secondary text-3xl" />
              <HiStar className="text-secondary text-4xl" />
              <HiStar className="text-secondary text-5xl" />
            </div>
            <p>
              <span className="text-primary">Based on 100 reviews</span>
            </p>
          </div>
        </div>
      </div>
      <div>
        <h1>What are your attendees saying?</h1>
        <div>
            
        </div>
      </div>
    </div>
  );
}

export default EventDetails
