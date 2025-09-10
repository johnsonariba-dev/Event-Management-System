import React, { useState } from "react";
import {
  FaShareAlt,
  FaFacebookF,
  FaWhatsapp,
  FaTwitter,
  FaTelegramPlane,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

interface ShareButtonProps {
  event: {
    id: number;
    title: string;
    description: string;
    image_url?: string;
  };
}

interface SocialPlatform {
  name: string;
  icon: React.ReactNode;
  link: (url: string, text: string, image?: string) => string;
}

export default function ShareButton({ event }: ShareButtonProps) {
  const [showMenu, setShowMenu] = useState(false);

  const generateShareURL = () =>
    `http://127.0.0.1:8000/events/${event.id}/share`;
  
  const handleMobileShare = () => {
    const url = generateShareURL();
    const text = `${event.title} - ${event.description}`;

    if (navigator.share) {
      navigator.share({ title: event.title, text, url }).catch(console.error);
    } else {
      navigator.clipboard.writeText(`${text} ${url}`);
      alert("Event link copied to clipboard!");
    }
  };

  const socialPlatforms: SocialPlatform[] = [
    {
      name: "WhatsApp",
      icon: <FaWhatsapp />,
      link: (url, text, image) =>
        `https://web.whatsapp.com/send?text=${encodeURIComponent(
          `${text} ${image ? "\n" + image : ""} ${url}`
        )}`,
    },
    {
      name: "Facebook",
      icon: <FaFacebookF />,
      link: (url) =>
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          url
        )}`,
    },
    {
      name: "Twitter",
      icon: <FaTwitter />,
      link: (url, text) =>
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(
          text
        )}&url=${encodeURIComponent(url)}`,
    },
    {
      name: "Telegram",
      icon: <FaTelegramPlane />,
      link: (url, text) =>
        `https://t.me/share/url?url=${encodeURIComponent(
          url
        )}&text=${encodeURIComponent(text)}`,
    },
  ];

  const handleDesktopShare = () => setShowMenu(!showMenu);

  const handleClickPlatform = (platform: SocialPlatform) => {
    const url = generateShareURL();
    const text = `${event.title} - ${event.description}`;
    window.open(platform.link(url, text, event.image_url), "_blank");
    setShowMenu(false);
  };

  const isMobile = !!navigator.share;

  return (
    <div className="relative inline-block">
      <FaShareAlt
        className="cursor-pointer text-2xl text-gray-600 hover:text-blue-500 transition-colors"
        onClick={isMobile ? handleMobileShare : handleDesktopShare}
      />

      {/* Desktop share menu */}
      {!isMobile && (
        <AnimatePresence>
          {showMenu && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-full mb-2 -left-20 -translate-x-1/2 bg-white shadow-lg rounded p-4 grid grid-cols-2 gap-3 z-50 w-[200px]"
            >
              {/* Arrow above the menu */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-3 h-3 bg-white rotate-45 shadow-md"></div>

              {socialPlatforms.map((platform) => (
                <button
                  key={platform.name}
                  className="flex flex-col items-center justify-center p-2 hover:bg-gray-100 rounded transition-colors"
                  onClick={() => handleClickPlatform(platform)}
                  title={platform.name}
                >
                  <span className="text-xl">{platform.icon}</span>
                  <span className="text-xs mt-1">{platform.name}</span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
