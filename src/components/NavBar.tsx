import { NavLink } from "react-router-dom";
function Navbar() {
  return (
    <nav className="text-white flex justify-between items-center w-full h-10">
      <NavLink to="/">Home</NavLink>
      <NavLink to="/projects">Projects</NavLink>
    </nav>
  );
}
export default Navbar;