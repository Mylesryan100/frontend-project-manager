import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <nav className="text-white flex justify-around items-center w-full h-10">
      <NavLink to="/">Home</NavLink>
      <NavLink to="/projects">Projects</NavLink>
      <NavLink to="/auth">Signin/Signup</NavLink>
    </nav>
  );
}

export default Navbar;