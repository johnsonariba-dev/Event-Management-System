import { FaArrowLeftLong } from "react-icons/fa6";
import { LuClock2 } from "react-icons/lu";
import { FaRegCalendarAlt } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { useEffect, useState, useRef } from "react";
import Button from "../../components/button";
import images from "../../types/images";
import { useParams } from "react-router-dom";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import TicketCard from "../Ticket/TicketCard";
import * as htmlToImage from "html-to-image";
import { jsPDF } from "jspdf";

interface Event {
  id: number;
  image_url?: string;
  title: string;
  desc: string;
  category: string;
  venue: string;
  date: string;
  time: string;
  ticket_price: number; // in FCFA
  organizer: string;
}

function Payment() {
  const [method, setMethod] = useState<string>("paypal");
  const [event, setEvent] = useState<Event | null>(null);
  const { id } = useParams<{ id: string }>();
  const [count, setCount] = useState(1);
  const [amount, setAmount] = useState(0);
  const [ticketGenerated, setTicketGenerated] = useState(false);
  const [phone, setPhone] = useState("");
  const [currency, setCurrency] = useState<"XAF" | "USD">("XAF");
  const [rate, setRate] = useState<number>(0); // XAF → USD
  const ticketRef = useRef<HTMLDivElement>(null);

  // Fetch event
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

  // Fetch conversion rate XAF → USD
  useEffect(() => {
    const fetchRate = async () => {
      try {
        const res = await fetch("https://open.er-api.com/v6/latest/XAF");
        const data = await res.json();
        // Assuming USD is in data.rates.USD
        setRate(data.rates.USD);
      } catch (err) {
        console.error("Failed to fetch conversion rate:", err);
        setRate(0.0017); // fallback
      }
    };
    fetchRate();
  }, []);

  // Calculate displayed amount
  useEffect(() => {
    if (!event) return;
    const baseAmount = event.ticket_price * count;
    const displayAmount =
      currency === "USD" ? Number((baseAmount * rate).toFixed(2)) : baseAmount;
    setAmount(displayAmount);
  }, [event?.ticket_price, count, currency, rate]);

  const decrement = () => {
    if (count > 1) setCount(count - 1);
  };

  const increment = () => {
    setCount(count + 1);
  };

  const handleFreeTicket = () => setTicketGenerated(true);

 const handleMtnPayment = async () => {
  if (!phone) return alert("Enter phone number");

  if (!event) return alert("Event not loaded");

  // Always send amount in XAF to backend
  const totalAmount = event.ticket_price * count;

  try {
    const res = await fetch("http://127.0.0.1:8000/pay-mtn", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phone: phone,       // user enters 9 digits
        amount: totalAmount // always integer in XAF
      })
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("MTN Payment error:", res.status, errText);
      return alert(`Payment failed: ${errText}`);
    }

    const data = await res.json();

    if (data.id) {
      alert(`Transaction initiated: ${data.id}. Please approve on your phone.`);
    } else {
      alert("Failed to initiate MTN payment");
    }
  } catch (err) {
    console.error(err);
    alert("Payment failed");
  }
};


  const downloadTicket = async () => {
    if (!ticketRef.current) return;
    try {
      const dataUrl = await htmlToImage.toPng(ticketRef.current, {
        cacheBust: true,
        pixelRatio: 5,
        style: { filter: "none", background: "gray" },
      });

      const pdf = new jsPDF("p", "pt", "a4");
      const imgProps = pdf.getImageProperties(dataUrl);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const scale = Math.min(
        pdfWidth / imgProps.width,
        pdfHeight / imgProps.height
      );
      const newWidth = imgProps.width * scale;
      const newHeight = imgProps.height * scale;
      const x = (pdfWidth - newWidth) / 2;
      const y = (pdfHeight - newHeight) / 2;
      pdf.addImage(dataUrl, "PNG", x, y, newWidth, newHeight);
      pdf.save(`${event?.title || "ticket"}-ticket.pdf`);
    } catch (err) {
      console.error("Download failed:", err);
      alert("Something went wrong while generating the PDF");
    }
  };

  const resetPage = () => {
    setTicketGenerated(false);
    setMethod("paypal");
    setCount(1);
    setPhone("");
  };

  // Ticket view after generation
  if (ticketGenerated && event) {
    const ticketId = `ticket-${event.id}-${Date.now()}`; // unique QR code
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white p-6">
        <div className="w-full md:w-1/2 flex flex-col items-center gap-6">
          <div ref={ticketRef}>
            <TicketCard
              eventTitle={event.title}
              location={event.venue}
              date={event.date}
              time={event.time}
              organizer={event.organizer}
              userName="zounka"
              price={event.ticket_price}
              imageUrl={event.image_url}
              ticketId={ticketId}
            />
          </div>

          <Button
            title="Download Ticket"
            onClick={downloadTicket}
            className="bg-blue-500 text-white px-6 py-2"
          />

          <Button
            title="Go Back"
            onClick={resetPage}
            className="bg-gray-300 text-black px-6 py-2"
          />
        </div>
      </div>
    );
  }

  // Regular payment page
  return (
    <div className="flex flex-col items-center justify-center bg-purple-50">
      <div className="py-10 mt-25 mb-10 flex flex-col px-6 w-full md:w-200 justify-center bg-white rounded-lg shadow-lg">
        {/* Event header */}
        <div
          className="flex items-center font-semibold text-2xl gap-10 px-4 md:px-10 pb-10 cursor-pointer"
          onClick={() => window.history.back()}
        >
          <FaArrowLeftLong />
          <h1>Ticket Purchase</h1>
        </div>

        {/* Event details */}
        <div className="border rounded-lg p-6">
          <img
            src={event?.image_url}
            alt="image"
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
                <p>{event?.ticket_price ?? 0} XAF</p>
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

            {/* Currency selector */}
            <div className="mt-5 flex justify-center gap-3">
              <button
                className={`px-4 py-2 rounded ${currency === "XAF" ? "bg-gray-300" : "bg-white"}`}
                onClick={() => setCurrency("XAF")}
              >
                XAF
              </button>
              <button
                className={`px-4 py-2 rounded ${currency === "USD" ? "bg-gray-300" : "bg-white"}`}
                onClick={() => setCurrency("USD")}
              >
                USD
              </button>
            </div>

            {/* Order Summary */}
            <div className="mt-10">
              <h1 className="text-xl text-center pb-5 font-semibold">Order Summary</h1>
              <div className="flex justify-between pb-3">
                <p>Ticket Price</p>
                <p>{currency === "XAF" ? event?.ticket_price ?? 0 : (event?.ticket_price ?? 0 * rate).toFixed(2)}</p>
              </div>
              <div className="flex justify-between pb-3">
                <p>Number</p>
                <p>{count}</p>
              </div>
              <hr />
              <div className="flex justify-between py-3">
                <p>Total ({currency})</p>
                <p>{amount}</p>
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
                    className={`w-20 h-10 cursor-pointer border-2 rounded ${
                      method === "mtn"
                        ? "border-yellow-500 scale-105"
                        : "border-gray-300"
                    }`}
                    onClick={() => setMethod("mtn")}
                  />
                  <img
                    src={images.orange}
                    alt="Orange Money"
                    className={`w-20 h-10 cursor-pointer border-2 rounded ${
                      method === "orange"
                        ? "border-orange-500 scale-105"
                        : "border-gray-300"
                    }`}
                    onClick={() => setMethod("orange")}
                  />
                  <img
                    src={images.Paypal}
                    alt="PayPal"
                    className={`w-20 h-10 cursor-pointer border-2 rounded ${
                      method === "paypal"
                        ? "border-blue-500 scale-105"
                        : "border-gray-300"
                    }`}
                    onClick={() => setMethod("paypal")}
                  />
                </div>

                {/* MTN & Orange */}
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
                      title={`Pay ${currency} ${amount} via ${method.toUpperCase()}`}
                      onClick={handleMtnPayment}
                      className="mt-2 px-4 py-2 bg-yellow-500 text-white"
                    />
                  </div>
                )}

                {/* PayPal */}
                {method === "paypal" && currency === "USD" && (
                  <div className="p-4 border rounded-lg shadow-md bg-white">
                    <PayPalScriptProvider
                      options={{ clientId: "AWcbUIkfqRx51ILXg1sIoHVdDWqFfrYsKPDCrzoXNSf_2StjtXPBn75giD0bYLCnQ8YrtWTw0VQxddIB" }}
                    >
                      <PayPalButtons
                        style={{
                          layout: "vertical",
                          color: "blue",
                          shape: "rect",
                          label: "pay",
                        }}
                        createOrder={async () => {
                          const res = await fetch(
                            `http://127.0.0.1:8000/create-order`,
                            {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ amount }),
                            }
                          );
                          const data = await res.json();
                          return data.id;
                        }}
                        onApprove={async (data) => {
                          const res = await fetch(`http://127.0.0.1:8000/capture-order/${data.orderID}`, { method: "POST" });
                          const details = await res.json();
                          alert(
                            "Transaction completed by " +
                              details.payer.name.given_name
                          );
                          setTicketGenerated(true);
                        }}
                      />
                    </PayPalScriptProvider>
                  </div>
                )}

                {/* Convert to USD automatically if PayPal selected */}
                {method === "paypal" && currency === "XAF" && (
                  <Button
                    title="Switch to USD for PayPal"
                    onClick={() => setCurrency("USD")}
                    className="mt-2 px-4 py-2 bg-blue-500 text-white"
                  />
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