import { FaArrowLeftLong } from "react-icons/fa6";
import { LuClock2 } from "react-icons/lu";
import { FaRegCalendarAlt } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { useEffect, useState } from "react";
import Button from "../../components/button";
import images from "../../types/images";
import { useParams } from "react-router-dom";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

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
  const [count, setCount] = useState(1);
  const [amount, setAmount] = useState(0);
  const [usdAmount, setUsdAmount] = useState<number | null>(null);
  const [phone, setPhone] = useState("");

  // Fetch event from backend
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

  // Calculate total amount
  useEffect(() => {
    const total = Number(((event?.ticket_price ?? 0) * count).toFixed(2));
    setAmount(total);
  }, [event?.ticket_price, count]);

  const decrement = () => {
    if (count > 1) setCount(count - 1);
  };

  const increment = () => {
    setCount(count + 1);
  };

  const handleConvert = async () => {
    try {
      const res = await fetch(
        `https://api.exchangerate.host/convert?from=XAF&to=USD&amount=${amount}`
      );
      const data = await res.json();
      setUsdAmount(Number(data.result.toFixed(2)));
    } catch (err) {
      console.error("Conversion failed", err);
    }
  };

  const handleMtnOrangePayment = () => {
    alert(`Paying ${amount} FCFA via ${method.toUpperCase()} with phone ${phone}`);
    // Add your MTN/Orange payment logic here
  };

  const handleFreeTicket = () => {
    alert("Your free ticket has been issued!");
    // Add your free ticket generation logic here
  };

  return (
    <div className="flex flex-col items-center justify-center bg-purple-50">
      <div className="py-10 mt-25 mb-10 flex flex-col px-6 w-full md:w-200 justify-center bg-white rounded-lg shadow-lg">
        {/* Event details */}
        <div
          className="flex items-center font-semibold text-2xl gap-10 px-4 md:px-10 pb-10 cursor-pointer"
          onClick={() => window.history.back()}
        >
          <FaArrowLeftLong />
          <h1>Ticket Purchase</h1>
        </div>

        <div className="border rounded-lg p-6">
          <img
            src={event?.image_url}
            alt={event?.title || "Event image"}
            className="w-full h-60 object-cover rounded-lg mb-4"
          />
          <h1 className="font-semibold text-xl">{event?.title}</h1>
          <div className="p-3 text-gray-500">
            <div className="flex items-center gap-3">
              <FaRegCalendarAlt />
              <p>{event?.date}</p>
            </div>
            <div className="flex items-center gap-3">
              <LuClock2 />
              <p>{event?.time}</p>
            </div>
            <div className="flex items-center gap-3">
              <FaLocationDot />
              <p>{event?.venue}</p>
            </div>
          </div>
        </div>

        {/* Payment Section */}
        <div className="flex flex-col md:flex-row justify-between border rounded-lg mt-10 p-5 gap-10">
          {/* Ticket Selection */}
          <div className="flex-1">
            <h1 className="text-xl text-center pb-5 font-semibold">Tickets</h1>
            <div className="border rounded-lg p-2">
              <div className="flex justify-between pb-3">
                <h1>Standard Ticket</h1>
                <p>{event?.ticket_price.toLocaleString()} FCFA</p>
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
                <p>{event?.ticket_price.toLocaleString()} FCFA</p>
              </div>
              <div className="flex justify-between pb-3">
                <p>Number</p>
                <p>{count}</p>
              </div>
              <hr />
              <div className="flex justify-between py-3">
                <p>Total</p>
                <p>{amount.toLocaleString()} FCFA</p>
              </div>

              {/* Conversion section */}
              <div className="flex justify-between items-center py-3">
                <button
                  onClick={handleConvert}
                  className="text-sm text-blue-600 underline"
                >
                  Convert to USD
                </button>
                {usdAmount !== null && (
                  <p className="text-gray-600 text-sm">
                    {amount.toLocaleString()} FCFA ≈{" "}
                    <span className="font-semibold">{usdAmount} USD</span>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Checkout */}
          <div className="flex-1">
            <h1 className="text-xl pb-5 font-semibold">Checkout</h1>

            {/* Free Ticket */}
            {(event?.ticket_price ?? 0) === 0 && (
              <Button
                title="Get Ticket for Free"
                onClick={handleFreeTicket}
                className="bg-green-500 text-white px-4 py-2"
              />
            )}

            {/* Paid Ticket */}
            {(event?.ticket_price ?? 0) > 0 && (
              <>
                {/* Payment methods */}
                <div className="flex flex-wrap md:flex-nowrap gap-5 md:gap-10 pb-10">
                  <img
                    src={images.mtn}
                    alt="MTN MoMo"
                    className={`w-20 h-10 cursor-pointer border-2 rounded transition-transform ${
                      method === "mtn"
                        ? "border-yellow-500 scale-105"
                        : "border-gray-300"
                    }`}
                    onClick={() => setMethod("mtn")}
                  />
                  <img
                    src={images.orange}
                    alt="Orange Money"
                    className={`w-20 h-10 cursor-pointer border-2 rounded transition-transform ${
                      method === "orange"
                        ? "border-orange-500 scale-105"
                        : "border-gray-300"
                    }`}
                    onClick={() => setMethod("orange")}
                  />
                  <img
                    src={images.Paypal}
                    alt="PayPal"
                    className={`w-20 h-10 cursor-pointer border-2 rounded transition-transform ${
                      method === "paypal"
                        ? "border-blue-500 scale-105"
                        : "border-gray-300"
                    }`}
                    onClick={() => setMethod("paypal")}
                  />
                </div>

                {/* MTN & Orange Inputs */}
                {(method === "mtn" || method === "orange") && (
                  <div className="flex flex-col gap-3">
                    <label>Phone Number</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-gray-200 p-2 rounded-sm mb-3"
                      placeholder="Enter phone number"
                    />
                    <Button
                      title={`Pay ${amount.toLocaleString()} FCFA via ${method.toUpperCase()}`}
                      onClick={handleMtnOrangePayment}
                      className="mt-2 px-4 py-2 bg-yellow-500 text-white"
                    />
                  </div>
                )}

                {/* PayPal Payment */}
                {method === "paypal" && (
                  <div>
                    <h2 className="font-semibold mb-2">PayPal Payment</h2>
                    <PayPalScriptProvider
                      options={{
                        clientId:
                          "AWcbUIkfqRx51ILXg1sIoHVdDWqFfrYsKPDCrzoXNSf_2StjtXPBn75giD0bYLCnQ8YrtWTw0VQxddIB",
                      }}
                    >
                      <PayPalButtons
                        style={{ layout: "vertical", shape: "rect" }}
                        createOrder={(_, actions) => {
                          return fetch(
                            `http://127.0.0.1:8000/create-order`,
                            {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ amount }),
                            }
                          )
                            .then((res) => res.json())
                            .then((data) => data.id);
                        }}
                        onApprove={async (data) => {
                          const res = await fetch(
                            `http://127.0.0.1:8000/capture-order/${data.orderID}`,
                            { method: "POST" }
                          );
                          const details = await res.json();
                          alert(
                            "Transaction completed by " +
                              details.payer.name.given_name
                          );
                        }}
                      />
                    </PayPalScriptProvider>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Payment;
