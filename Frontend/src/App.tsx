import { BrowserRouter as router, Route, Routes } from "react-router-dom";
import { useLocation } from "react-router-dom";
import NavBar from "./container/Navbar";
import Footer from "./container/Footer";
import Home from "./Pages/Home";
import Events from "./Pages/Events";
import About from "./Pages/About";
import Register from "./Pages/Authentication/Register";
import Login from "./Pages/Authentication/Login/Login";


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
  const hidefooter = ['/Login', '/Register']
  const showfooter = !hidefooter.includes(location.pathname)
  return (
    <div>
        <NavBar items={NavBarItems} />
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/About" element={<About />}></Route>
          <Route path="/Events" element={<Events />}></Route>
          <Route path = "/Login" element={<Login/>}></Route>
          <Route path = "/Register" element={<Register/>}></Route>
        </Routes>
        {showfooter && (<Footer/>)}
    </div>
  );
}

export default App;
