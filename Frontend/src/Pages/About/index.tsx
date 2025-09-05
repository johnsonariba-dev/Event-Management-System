import about from "../../assets/images/about.jpeg";
import ourmission from "../../assets/images/our-vision.jpg";
import global from "../../assets/images/global.jpg";
import { MdCall, MdEmail } from "react-icons/md";
import { FaLocationDot, FaGlobe, FaEye } from "react-icons/fa6";
import { FaRocket } from "react-icons/fa";

const About = () => {
  return (
    <div>
      {/*About Hero*/}
      <div className="relative h-screen w-full">
        <div className="absolute inset-0 h-screen bg-[url(/src/assets/images/about.jpeg)] bg-cover bg-center brightness-30 blur-[2px]"></div>
        <div className="relative  flex flex-col justify-center text-white p-8 sm:p-20 -bottom-60 max-md:-bottom-90 space-y-4 xl:-bottom-100">
          <h1 className="text-[6vw] font-bold">
            <span className="text-primary">Powering</span> World Class <br />
            <span className="text-secondary">Events Experiences</span>
          </h1>
          <p className="text-[3vw] sm:text-lg md:text-xl">
            Delivering enterprise-grade event management solutions <br /> for
            conferences, summits, and large-scale gatherings.
          </p>
        </div>
      </div>

      {/*About Mission*/}
      <div className="px-6">
        <div className="flex flex-col lg:flex-row justify-between items-center pt-20 ">
          <div className=" sm:p-8 bg-secondary w-100 space-y-4 rounded-md text-white  max-lg:w-full max-lg:text-center max-lg:bg-white max-lg:text-black">
            <div className="flex gap-3 text-primary max-lg:justify-center">
              <FaRocket size={24} />
              <h1 className="text-xl sm:text-2xl  font-bold">Our Mission</h1>
            </div>
            <p className="text-base sm:text-lg pb-5">
              To empower organizations worldwide with cutting-edge event
              technology that transform how people connect, learn and
              collaborate at scale. We make complex event management simple and
              impactful.
            </p>
          </div>
          <div className="w-full lg:w-1/2 flex justify-center">
            <img
              src={ourmission}
              alt="Our Mission"
              className="rounded-md w-full object-cover"
            />
          </div>
        </div>

        {/* Vision */}
        <div className="flex flex-row max-lg:flex-col-reverse justify-between items-center pt-20 ">
          <div className="w-1/2 max-lg:w-full">
            <img
              src={global}
              alt="Our Vision"
              className="rounded-md w-full object-cover"
            />
          </div>
          <div className=" p-7 border-secondary bg-secondary w-100 h-60 rounded-md text-white space-y-3 max-lg:w-full max-lg:text-center max-lg:bg-white max-lg:text-black">
            <div className="flex gap-3 items-center text-primary max-lg:justify-center">
              <FaEye size={24} />
              <h3 className="text-2xl text-primary font-bold">Our Vision</h3>
            </div>
            <p className="text-lg text-align-right">
              To be the global leader in event technology, enabling seamless
              experiences that drive business growth, foster innovation, and
              create lasting professional connections.
            </p>
          </div>
        </div>
      </div>

      {/* Impact Number */}
      <div className="flex w-full items-center justify-center flex-col gap-20 pt-20 px-6">
        <div className="justify-center items-center bg-violet-200 border-gray rounded-md pt-10 pb-20 w-full">
          <h3 className="text-4xl font-bold text-center text-primary max-md:text-3xl max-md:pb-10">
            Impact by Numbers
          </h3>
          <div className="flex items-center justify-center gap-20 pt-10 max-md:flex-col text-center">
            <div>
              <h3 className="text-3xl font-bold text-center">10K+</h3>
              <p>Events Created</p>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-center">50K+</h3>
              <p>Happy Users</p>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-center">200+</h3>
              <p>Cities Worldwide</p>
            </div>
            <div>
              <h3 className="text-3xl font-bold">95%</h3>
              <p>Satisfaction Rate</p>
            </div>
          </div>
        </div>

        {/* Contact info */}
        <div className="bg-violet-200 rounded-md w-full py-10 pb-20 mb-20 flex flex-col items-center justify-center ">
          <div className="flex justify-center items-center ">
            <h3 className="text-4xl font-bold text-center text-primary pb-20">
              Get In Touch
            </h3>
          </div>
          <div className="flex justify-between items-center w-full gap-20 px-55 flex-grow max-lg:px-10 max-md:flex-col">
            {/* Left Column */}
            <div className="flex flex-col gap-20 ">
              <div className="flex items-center gap-3">
                <div className="bg-primary rounded-lg p-2">
                  <MdEmail size={30} color="white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold ">Email</h3>
                  <p className = "text-xl">planvibes1@gmail.com</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-primary rounded-lg p-2">
                  <MdCall size={30} color="white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Phone</h3>
                  <p className = "text-xl">+237 652 173 171</p>
                </div>
              </div>
            </div>

            {/* Right column */}
            <div className="flex flex-col gap-20">
              <div className="flex items-center gap-3">
                <div  className="bg-primary rounded-lg p-2">
                  <FaLocationDot size={30} color="white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Address</h3>
                  <p className = "text-xl">Douala - Cameroun</p>
                </div>
              </div>
              <div className="flex items-center  gap-3">
                <div className="bg-primary rounded-lg p-2">
                  <FaGlobe size={30} color="white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Website</h3>
                  <p className = "text-xl">www.planvibes.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
