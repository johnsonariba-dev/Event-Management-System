import { Route, Routes, useLocation, Navigate } from "react-router-dom";
import NavBar from "./container/Navbar";
import Footer from "./container/Footer";
import Home from "./Pages/Home";
import Events from "./Pages/Events";
import About from "./Pages/About";
import Register from "./Pages/Authentication/Register";
import Login from "./Pages/Authentication/Login/Login";
import CreateEvent from "./Pages/CreateEvents";
import EventDetails from "./Pages/EventDetails/EventDetails";
import CityDetails from "./Pages/EventDetails/CityDetails";
import NewEvent from "./Pages/NewEvent";
import Payment from "./Pages/Payments/Payment";
import Chatbot from "./Pages/Chatbot";
<<<<<<< Updated upstream
<<<<<<< HEAD
=======
<<<<<<< Updated upstream
import Attendees from "./Pages/Attendees";
>>>>>>> b0ff3c1 (new install)
import BuyTicket from "../src/Pages/Ticket/BuyTicket";
import TicketScan from "../src/Pages/Ticket/TicketScan";
=======
import BuyTicket from "./Pages/Ticket/BuyTicket";
import TicketScan from "./Pages/Ticket/TicketScan";
>>>>>>> Stashed changes
import ScrollToTop from "./components/ScrollTop";
import UpdateEvent from "./Pages/Events/UpdateEvent";
import Attendees from "./components/reviews";
<<<<<<< Updated upstream

=======
import BuyTicket from "./Pages/Ticket/BuyTicket";
import TicketScan from "./Pages/Ticket/TicketScan";
import ScrollToTop from "./components/ScrollTop";
import UpdateEvent from "./Pages/Events/UpdateEvent";
import Attendees from "./components/reviews";
=======
>>>>>>> Stashed changes
import type { JSX } from "react/jsx-dev-runtime";
// ✅ Import AuthProvider and useAuth
import { AuthProvider } from "./Pages/Context/AuthProvider";
import { useAuth } from "./Pages/Context/UseAuth";
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
const NavBarItems = [
  { title: "Home", path: "/" },
  { title: "About", path: "/about" },
  { title: "Events", path: "/events" },
];

// 🔹 ProtectedRoute component
const ProtectedRoute = ({
  children,
  roles,
}: {
  children: JSX.Element;
  roles?: string[];
}) => {
  const { token } = useAuth();
  const role: string = localStorage.getItem("role")!;

  if (!token) {
    // User not logged in
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(role)) {
    // User role not allowed
    return <Navigate to="/events" replace />;
  }

  return children;
};

function App() {
  const location = useLocation();
  const hidefooter = [
    "/login",
    "/register",
    "/CreateEvent",
    "/NewEvent",
    "/payment/:id",
  ];
  const hideNavbar = ["/CreateEvent"];
  const showfooter = !hidefooter.includes(location.pathname);
  const showNavbar = !hideNavbar.includes(location.pathname);

  return (
<<<<<<< Updated upstream
<<<<<<< Updated upstream
    <div>
      {showNavbar && <NavBar items={NavBarItems} />}
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/about" element={<About />}></Route>
        <Route path="/events" element={<Events />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/register" element={<Register />}></Route>
        <Route path="/CreateEvent" element={<CreateEvent />}></Route>
        <Route path="/NewEvent" element={<NewEvent />}></Route>
        <Route path="/Event/:id" element={<EventDetails />}></Route>
        <Route path="/cities/:id" element={<CityDetails />}></Route>
        <Route path="/payment/:id" element={<Payment />}></Route>
        <Route path="/attendees/:id" element={<Attendees />}></Route>
        <Route path="/buy-ticket/:eventId" element={<BuyTicket />} />
        <Route path="/scan" element={<TicketScan />} />
      </Routes>
      <Chatbot />
      {showfooter && <Footer />}
    </div>
=======
=======
>>>>>>> Stashed changes
    <AuthProvider>
      <div>
        {showNavbar && <NavBar items={NavBarItems} />}
        <ScrollToTop />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/events" element={<Events />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/Event/:id" element={<EventDetails />} />
          <Route path="/cities/:id" element={<CityDetails />} />
          <Route path="/CreateEvents" element={<CreateEvent />} />

          {/* Protected Routes */}
          <Route
            path="/CreateEvent"
            element={
              <ProtectedRoute roles={["organiser"]}>
                <CreateEvent />
              </ProtectedRoute>
            }
          />
          <Route
            path="/NewEvent"
            element={
              <ProtectedRoute roles={["organiser"]}>
                <NewEvent />
              </ProtectedRoute>
            }
          />
          <Route
            path="/event/update/:id"
            element={
              <ProtectedRoute roles={["organiser"]}>
                <UpdateEvent />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment/:id"
            element={
              <ProtectedRoute>
                <Payment />
              </ProtectedRoute>
            }
          />
          <Route
            path="/buy-ticket/:eventId"
            element={
              <ProtectedRoute>
                <BuyTicket />
              </ProtectedRoute>
            }
          />
          <Route
            path="/attendees/:id"
            element={
              <ProtectedRoute roles={["admin"]}>
                <Attendees />
              </ProtectedRoute>
            }
          />
          <Route
            path="/scan"
            element={
              <ProtectedRoute roles={["admin"]}>
                <TicketScan />
              </ProtectedRoute>
            }
          />

          {/* Chatbot always visible */}
          <Route path="*" element={<Home />} />
        </Routes>
        <Chatbot />
        {showfooter && <Footer />}
      </div>
    </AuthProvider>
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
  );
}

export default App;
