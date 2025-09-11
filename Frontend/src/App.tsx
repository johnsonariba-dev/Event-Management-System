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
import LikePage from "./components/like";


const NavBarItems = [
  {
    title: "Home",
    path: "/",
  },
  {
    title: "About",
    path: "/about",
  },
  {
    title: "Events",
    path: "/events",
  },
  {
    title: "LikePage",
    path: "/like",
  },
];

function App() {
  const location = useLocation();
  const hidefooter = ["/login", "/register", "/CreateEvent", "/NewEvent", "/payment/:id"];
  const hideNavbar = ["/CreateEvent"];
  const showfooter = !hidefooter.includes(location.pathname);
  const showNavbar = !hideNavbar.includes(location.pathname);
  return (
    <div>
      {showNavbar && <NavBar items={NavBarItems} />}
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
        <Route path="/Payment" element={<Payment />}></Route>
        <Route path="/like" element={<LikePage eventId={1}/>}></Route>
      </Routes>
      {showfooter && <Footer />}
    </div>
  );
}

export default App;
