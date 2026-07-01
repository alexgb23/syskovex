import { useState } from "react";
import { NavLink, Link } from "react-router";
import { FaMoon, FaSun, FaArrowRight, FaBars, FaTimes } from "react-icons/fa";
import "./Navbar.css";

function Navbar({ isDarkMode, themeMode, toggleTheme }) {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  const themeLabel =
    themeMode === "system"
      ? `Tema automático (${isDarkMode ? "oscuro" : "claro"})`
      : `Tema manual ${isDarkMode ? "oscuro" : "claro"}`;

  return (
    <nav className="navbar">
      <div className="nav-container">
     

        <div className={`nav-links ${isOpen ? "active" : ""}`}>

          <NavLink
            to="/about"
            className={({ isActive }) => (isActive ? "active" : "")}
            onClick={closeMenu}
          >
            About
          </NavLink>

          
        </div>

        <div className="nav-actions">
          <button
            type="button"
            className={`theme-toggle ${themeMode === "system" ? "is-system" : ""}`}
            onClick={toggleTheme}
            aria-label={
              isDarkMode ? "Activar modo claro" : "Activar modo oscuro"
            }
            aria-pressed={isDarkMode}
            title={themeLabel}
          >
            {isDarkMode ? <FaSun /> : <FaMoon />}
          </button>


        </div>
      </div>
    </nav>
  );
}

export default Navbar;
