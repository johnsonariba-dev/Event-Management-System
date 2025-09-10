import { FaArrowLeftLong } from "react-icons/fa6";
import { LuClock2 } from "react-icons/lu";
import { FaRegCalendarAlt } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { useEffect, useState } from "react";
import Button from "../../components/button";
import images from "../../types/images";
import { useParams } from "react-router-dom";

interface Event {
  id: number;
  image_url?: string;
  title: string;
  desc: string;
  category: string;
  venue: string;
  date: string;
  time: string;
  ticket_price: number;
  organizer: string;
}

function Payment() {
  const [method, setMethod] = useState<string>("paypal");
  const [event, setEvent] = useState<Event | null>(null);
  const { id } = useParams<{ id: string }>();
  const [count, setCount] = useState(0);
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/events/${id}`);
        if (!res.ok) throw new Error("Event not found");
        const data: Event = await res.json();
        setEvent(data);
      } catch (err) {
        console.error(err);
        setEvent(null);
      }
    };

    fetchEvent();
  }, [id]);

  const decrement = () => {
    if (count > 0) setCount(count - 1);
  };
  const increment = () => {
    setCount(count + 1);
  };
  useEffect(() => {
    const total = Number(((event?.ticket_price || 0) * count).toFixed(2));
    setAmount(total);
  }, [event?.ticket_price, count]);

  return (
    <div className="flex flex-col items-center justify-center bg-purple-50">
      <div className="py-10 mt-25 mb-10 flex flex-col px-6 w-full md:w-200 justify-center bg-white rounded-lg shadow-lg">

        <div className="flex items-center font-semibold text-2xl gap-10 px-4 md:px-10 pb-10">
          <FaArrowLeftLong />
          <h1>Ticket Purchase</h1>
        </div>

        <div className="border rounded-lg p-6">
          <img
            src={event?.image_url}
            alt="image"
            className="w-full h-60 object-cover rounded-lg mb-4"
          />
          <h1 className="font-semibold text-xl">{event?.title}</h1>
          <div className="p-3 text-gray-500">
            <div className="items-center flex gap-3 ">
              <FaRegCalendarAlt />
              <p>{event?.date}</p>
            </div>
            <div className="flex items-center gap-3  ">
              <LuClock2 />
              <p>{event?.time}</p>
            </div>
            <div className="flex items-center gap-3  ">
              <FaLocationDot />
              <p>{event?.venue}</p>
            </div>
          </div>
        </div>

        {/* payment */}
        <div className="flex flex-col md:flex-row justify-between border rounded-lg mt-10 p-5 gap-10">
          <div className="flex-1">
            <h1 className="text-xl text-center pb-5 font-semibold">
              Available Tickets
            </h1>

            <div className="border rounded-lg p-2">
              <div className="flex justify-between pb-3">
                <h1>Standard Ticket</h1>
                <p>{event?.ticket_price}</p>
              </div>
              <div className="text-gray-400 text-md">
                <p>Standard entry to the event</p>
                <p>150 tickets available</p>
              </div>
              <div className="flex items-center justify-center gap-6 pt-5">
                <button onClick={decrement} className="border px-2 rounded-sm">
                  -
                </button>
                <span>{count}</span>
                <button onClick={increment} className="border px-2 rounded-sm">
                  +
                </button>
              </div>
            </div>

            <div className="mt-10">
              <h1 className="text-xl text-center pb-5 font-semibold">
                Order Summary
              </h1>
              <div className="flex justify-between pb-3">
                <p>Ticket Price</p>
                <p>{event?.ticket_price}</p>
              </div>
              <div className="flex justify-between pb-3">
                <p>Number </p>
                <p>{count}</p>
              </div>
              <hr />
              <div className="flex justify-between py-3 ">
                <p>Total</p>
                <p>{amount}</p>
              </div>
            </div>
          </div>

          {/* payment details */}
          <div className="flex-1">
            <h1 className="text-xl pb-5 font-semibold">Checkout</h1>

            <div className="flex flex-wrap md:flex-nowrap gap-5 md:gap-10 pb-10">
              <img
                src={images.mtn}
                alt="MTN MoMo"
                className={`w-20 h-10 cursor-pointer ${
                  method === "mtn" ? "ring-2 ring-yellow-500" : ""
                }`}
                onClick={() => setMethod("mtn")}
              />
              <img
                src={images.orange}
                alt="Orange Money"
                className={`w-20 h-10 cursor-pointer ${
                  method === "orange" ? "ring-2 ring-orange-500" : ""
                }`}
                onClick={() => setMethod("orange")}
              />
              <img
                src={images.Paypal}
                alt="PayPal"
                className={`w-20 h-10 cursor-pointer ${
                  method === "paypal" ? "ring-2 ring-blue-500" : ""
                }`}
                onClick={() => setMethod("paypal")}
              />
            </div>

            {method === "mtn" && (
              <form>
                <h2 className="font-semibold mb-2">MTN MoMo Payment</h2>
                <label>Phone Number</label>
                <input
                  type="text"
                  className="w-full bg-gray-200 p-2 rounded-sm mb-3"
                />
              </form>
            )}

            {method === "orange" && (
              <form>
                <h2 className="font-semibold mb-2">Orange Money Payment</h2>
                <label>Phone Number</label>
                <input
                  type="text"
                  className="w-full bg-gray-200 p-2 rounded-sm mb-3"
                />
              </form>
            )}

            {method === "paypal" && (
              <form>
                <h2 className="font-semibold mb-2">PayPal Payment</h2>
                <div>
                  <label htmlFor="">Cardholder Name</label>
                  <input
                    type="text"
                    className="w-full bg-gray-200 p-2 rounded-sm"
                  />
                </div>
                <br />
                <div>
                  <label htmlFor="">Card Number</label>
                  <input
                    type="text"
                    className="w-full bg-gray-200 p-2 rounded-sm"
                  />
                </div>
                <br />
                <div>
                  <label htmlFor="">CVV2</label>
                  <input
                    type="text"
                    className="w-full bg-gray-200 p-2 rounded-sm"
                  />
                </div>
              </form>
            )}
            <div className="flex justify-center">
              <Button title="Pay Now" className="mt-20 px-10" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Payment;
