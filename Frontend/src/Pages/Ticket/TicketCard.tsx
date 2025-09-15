import React from "react";
import { QRCodeSVG } from "qrcode.react";

// ...other imports

interface TicketCardProps {
  eventTitle: string;
  location: string;
  date: string;
  time: string;
  organizer: string;
  userName: string;
  price: number;
  imageUrl?: string;
  ticketId: string;
}

const TicketCard: React.FC<TicketCardProps> = ({
  eventTitle,
  location,
  date,
  time,
  organizer,
  userName,
  price,
  imageUrl,
}) => {
  return (
    <div className="flex flex-row w-full  bg-purple-50 shadow-lg rounded-xl overflow-hidden border border-purple-200">
      {/* Event Image */}
      {imageUrl && (
        <div className="w-1/3">
          <img
            src={imageUrl}
            alt={eventTitle}
            className="h-full w-full object-cover"
          />
        </div>
      )}

      {/* Event Details */}
      <div className="flex  justify-between  w-full h-50 relative">
        <div className="flex flex-col justify-between pl-4">
          <h2 className="text-2xl font-bold text-purple-900">{eventTitle}</h2>
          <div className="flex  justify-between w-full  ">
            <div className="flex flex-col gap-1">
              <div className="">
                <p className="text-black ">{location}</p>
                <p className="text-black ">
                  {date} • {time}
                </p>
                <p className="text-black  text-sm">
                  Organized by {organizer}
                </p>
              </div>
              <div>
                <p className="text-black font-semibold">
                  Attendee: {userName}
                </p>
                <p className="text-black font-semibold ">Price: £{price}</p>
              </div>
            </div>

            {/* QR Code */}
            <div className="bg-white p-2 border border-purple-200 rounded-md">
              <QRCodeSVG
                value={`ticket-${eventTitle}-${userName}-${date}`}
                size={120}
                fgColor="#4c1d95" // purple color to match design
                bgColor="#f3e8ff" // light purple background
              />
            </div>
          </div>
        </div>
        <div className="h-full p-2 bg-secondary">

        </div>
      </div>
    </div>
  );
};

export default TicketCard;
