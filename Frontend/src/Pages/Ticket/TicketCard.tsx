import React from "react";
import { QRCodeSVG } from "qrcode.react";

interface TicketCardProps {
  eventTitle: string;
  location: string;
  date: string;
  organizer: string;
  username: string;
  price: number;
  imageUrl?: string;
  ticketId: string;
}

const TicketCard: React.FC<TicketCardProps> = ({
  eventTitle,
  location,
  date,
  organizer,
  username,
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
          <div className="flex gap-15 justify-between w-full  ">
            <div className="flex flex-col gap-1">
              <div className="">
                <p className="text-black "><span className="font-bold">Venue:</span> {location}</p>
                <p className="text-black "><span className="font-bold">Time: </span>
                  {date} 
                </p>
                <p className="text-black"><span className="font-bold">Organizer: </span>
                  {organizer}
                </p>
              </div>
              <div>
                <p className="text-black font-semibold">
                  Attendee: {username}
                </p>
                <p className="text-black font-semibold ">Price: FCFA{price}</p>
              </div>
            </div>

            {/* QR Code */}
            <div className="bg-white p-2 border border-purple-200 rounded-md">
              <QRCodeSVG
                value={`ticket-${eventTitle}-${username}-${date}`}
                size={120}
                fgColor="#000000ff" 
                bgColor="#f3e8ff" 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketCard;
