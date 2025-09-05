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
];

function App() {
  const location = useLocation();
  const hidefooter = ["/login", "/register", "/CreateEvent"];
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
        <Route path="/Event/:id" element={<EventDetails />}></Route>
      </Routes>
      {showfooter && <Footer />}
    </div>
  );
}

export default App;
