import { Route, Routes, useLocation } from "react-router-dom";
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
import BuyTicket from "./Pages/Ticket/BuyTicket";
import TicketScan from "./Pages/Ticket/TicketScan";
import ScrollToTop from "./components/ScrollTop";
import UpdateEvent from "./Pages/Events/UpdateEvent";
import Profile from "./Pages/Profile";


import Attendees from "./components/reviews";
import { EventApproval } from "./components/EventApproval";
import { HomeDashboard } from "./components/HomeDashboard";
import AdminDashboard from "./Pages/AdminDashboard";
import { ReportsAnalytics } from "./components/ReportsAnalytics";
import OrganizerManagement from "./components/OrganizerManagement";
import UserManagement from "./components/UserManagement";


import Dashboard from "./components/dashboard";
import { ProtectedRoute } from "./components/PotectedRoute";
// import type { JSX } from "react/jsx-dev-runtime";
import AuthProvider from "./Pages/Context/AuthProvider";
// import { useAuth } from "./Pages/Context/UseAuth";

const NavBarItems = [
  { title: "Home", path: "/" },
  { title: "About", path: "/about" },
  { title: "Events", path: "/events" },
];

// 🔹 ProtectedRoute component (fixed role check)
// const ProtectedRoute = ({
//   children,
//   roles,
// }: {
//   children: JSX.Element;
//   roles?: string[];
// }) => {
//   const { token } = useAuth();
//   const role = (localStorage.getItem("role") || "").toLowerCase();

//   if (!token) {
//     return <Navigate to="/login" replace />;
//   }

//   if (roles && !roles.map((r) => r.toLowerCase()).includes(role)) {
//     return <Navigate to="/unauthorized" replace />;
//   }

//   return children;
// };

function App() {
  const location = useLocation();

  // Fix: Use regex for dynamic routes
  const hidefooter = [
    /^\/login$/,
    /^\/register$/,
    /^\/CreateEvent$/,
    /^\/NewEvent$/,
    /^\/payment\/.+$/,
  ];
  const hideNavbar = [/^\/CreateEvent$/];

  const showfooter = !hidefooter.some((regex) => regex.test(location.pathname));
  const showNavbar = !hideNavbar.some((regex) => regex.test(location.pathname));

  return (
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
          <Route path="/profile" element={<Profile />} />

        <Route path="/admindashboard" element={<AdminDashboard />}>
          <Route index element={<HomeDashboard />} />
          <Route path="event-approval" element={<EventApproval />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="organizers" element={<OrganizerManagement />} />
          <Route path="reports" element={<ReportsAnalytics/>} />
        </Route>
          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute roles={["organizer", "admin"]}>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/CreateEvent"
            element={
              <ProtectedRoute roles={["organizer", "admin"]}>
                <CreateEvent />
              </ProtectedRoute>
            }
          />

          <Route
            path="/NewEvent"
            element={
              <ProtectedRoute roles={["organizer", "admin"]}>
                <NewEvent />
              </ProtectedRoute>
            }
          />

          <Route
            path="/event/update/:id"
            element={
              <ProtectedRoute roles={["organizer", "admin"]}>
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

          {/* Fallback */}
          <Route path="*" element={<Home />} />
        </Routes>
        <Chatbot />
        {showfooter && <Footer />}
      </div>
    </AuthProvider>
  )
}

export default App;
