import { BrowserRouter, Route, Routes } from "react-router-dom";
import NavBar from "./container/Navbar";
import Footer from "./container/Footer";
import Home from "./Pages/Home";
import Events from "./Pages/Events";
import About from "./Pages/About";

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
  return (
    <div>
      <BrowserRouter>
        <NavBar items={NavBarItems} />
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/About" element={<About />}></Route>
          <Route path="/Events" element={<Events />}></Route>

        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
