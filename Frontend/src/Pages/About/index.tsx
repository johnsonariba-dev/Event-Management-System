import { motion } from "framer-motion";
import ourmission from "../../assets/images/our-vision.jpg";
import global from "../../assets/images/global.jpg";
import { MdCall, MdEmail } from "react-icons/md";
import { FaLocationDot, FaGlobe, FaEye } from "react-icons/fa6";
import { FaRocket } from "react-icons/fa";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const About = () => {
  const [totalEvents, setTotalEvents] = useState<string>("0");
  const [totalUsers, setTotalUsers] = useState<string>("No attendees");
  const [percentRating, setPercentRating] = useState<string>("0");

  // total events
  useEffect(() => {
    const fetchTotalEvents = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/totalEvents");
        if (!res.ok) throw new Error("Failed to fetch events");
        const data = await res.json();

        setTotalEvents(String(data));
      } catch (error) {
        console.error(error);
      }
    };
    fetchTotalEvents();
  }, []);

  // total users
  useEffect(() => {
    const fetchTotalUsers = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/totalUsers");
        if (!res.ok) throw new Error("Failed to fetch users");
        const data = await res.json();
        setTotalUsers(String(data));
      } catch (error) {
        console.error(error);
      }
    };
    fetchTotalUsers();
  }, []);

  // Percentage Rating
  useEffect(() => {
    const fetchPercentRating = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/rating");
        if (!res.ok) throw new Error("Failed to fetch users");
        const data = await res.json();
        setPercentRating(String(data));
      } catch (error) {
        console.error(error);
      }
    };
    fetchPercentRating();
  }, []);

  return (
    <div>
      {/* About Hero */}
      <div className="relative h-screen w-full">
        <div className="absolute inset-0 h-screen bg-[url(/src/assets/images/about.jpeg)] bg-cover bg-center brightness-30 blur-[2px]"></div>
        <motion.div
          className="relative flex flex-col items-center text-center justify-center text-white p-8 sm:p-20 max-md:-bottom-70 md:-bottom-60 xl:-bottom-50 space-y-4"
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-[6vw] font-bold">
            <span className="text-primary">Powering</span> World Class <br />
            <span className="text-secondary">Events Experiences</span>
          </h1>
          <p className="text-[3vw] sm:text-lg md:text-xl">
            Delivering enterprise-grade event management solutions <br /> for
            conferences, summits, and large-scale gatherings.
          </p>
        </motion.div>
      </div>

      {/* About Mission */}
      <div className="px-6">
        <div className="flex flex-col lg:flex-row justify-between items-center pt-20 ">
          <motion.div
            className="sm:p-8 bg-secondary w-100 space-y-4 rounded-md text-white  max-lg:w-full max-lg:text-center max-lg:bg-white max-lg:text-black"
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="flex gap-3 text-primary max-lg:justify-center">
              <FaRocket size={24} />
              <h1 className="text-xl sm:text-2xl font-bold">Our Mission</h1>
            </div>
            <p className="text-base sm:text-lg pb-5">
              To empower organizations worldwide with cutting-edge event
              technology that transform how people connect, learn and
              collaborate at scale. We make complex event management simple and
              impactful.
            </p>
          </motion.div>

          <motion.div
            className="w-full lg:w-1/2 flex justify-center"
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <img
              src={ourmission}
              alt="Our Mission"
              className="rounded-md w-full object-cover"
            />
          </motion.div>
        </div>

        {/* Vision */}
        <div className="flex flex-row max-lg:flex-col-reverse justify-between items-center pt-20 ">
          <motion.div
            className="w-1/2 max-lg:w-full"
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <img
              src={global}
              alt="Our Vision"
              className="rounded-md w-full object-cover"
            />
          </motion.div>

          <motion.div
            className="p-7 border-secondary bg-secondary w-100 h-60 rounded-md text-white space-y-3 max-lg:w-full max-lg:text-center max-lg:bg-white max-lg:text-black"
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="flex gap-3 items-center text-primary max-lg:justify-center">
              <FaEye size={24} />
              <h3 className="text-2xl text-primary font-bold">Our Vision</h3>
            </div>
            <p className="text-lg text-align-right">
              To be the global leader in event technology, enabling seamless
              experiences that drive business growth, foster innovation, and
              create lasting professional connections.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Impact Numbers */}
      <div className="flex w-full items-center justify-center flex-col gap-20 pt-20 px-6">
        <motion.div
          className="justify-center items-center bg-violet-200 border-gray rounded-md pt-10 pb-20 w-full"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h3 className="text-4xl font-bold text-center text-primary max-md:text-3xl max-md:pb-10">
            Impact by Numbers
          </h3>
          <div className="flex items-center justify-center gap-20 pt-10 max-md:flex-col text-center">
            {[
              { value: totalEvents, label: "Events Created" },
              { value: totalUsers, label: "Happy Users" },
              { value: "10", label: "Cities Worldwide" },
              { value: percentRating, label: "Satisfaction Rate" },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                viewport={{ once: true }}
              >
                <h3 className="text-3xl font-bold text-center">{item.value}</h3>
                <p>{item.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Contact info */}
        <motion.div
          className="bg-violet-200 rounded-md w-full py-10 pb-20 mb-20 flex flex-col items-center justify-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <div className="flex justify-center items-center">
            <h3 className="text-4xl font-bold text-center text-primary pb-20">
              Get In Touch
            </h3>
          </div>
          <div className="flex justify-between items-center w-full gap-20 px-55 flex-grow max-lg:px-10 max-md:flex-col">
            {/* Left Column */}
            <motion.div
              className="flex flex-col gap-20"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3">
                <div className="bg-primary rounded-lg p-2">
                  <MdEmail size={30} color="white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Email</h3>
                  <a
                    href="mailto:planvibes1@gmail.com"
                    className="text-blue-600 hover:underline"
                  >
                    planvibes1@gmail.com
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-primary rounded-lg p-2">
                  <MdCall size={30} color="white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Phone</h3>
                  <a
                    href="https://wa.me/237652173171"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xl text-blue-500 hover:underline"
                  >
                    +237 652 173 171
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Right column */}
            <motion.div
              className="flex flex-col gap-20"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3">
                <div className="bg-primary rounded-lg p-2">
                  <FaLocationDot size={30} color="white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Address</h3>
                  <a
                    href="https://www.google.com/maps?q=Douala+Akwa"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xl text-blue-600 hover:underline"
                  >
                    Douala - Cameroun
                  </a>
                </div>
              </div>
              <div className="flex items-center  gap-3">
                <div className="bg-primary rounded-lg p-2">
                  <FaGlobe size={30} color="white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Website</h3>
                  <p className="text-xl">www.planvibes.com</p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
