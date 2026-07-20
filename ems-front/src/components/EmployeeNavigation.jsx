import { NavLink, useLocation } from 'react-router-dom';
import { useEffect, useState } from "react";
import { isAdmin, isLoggedIn, logout } from "../auth";
import "../index.css";

const Navigation = () => {
  const { pathname } = useLocation();
  const [recreationOpen, setRecreationOpen] = useState(pathname.startsWith("/recreation"));

  useEffect(() => {
    setRecreationOpen(pathname.startsWith("/recreation"));
  }, [pathname]);

  const navClass = ({ isActive }) => (isActive ? "active" : "");

  return (
    <nav className="ems-navigation">
      <div className="sidebar-brand">
        <span>EMS</span>
        <small>Internal Portal</small>
      </div>
      <ul>
        <li><NavLink to="/" end className={navClass}>Home</NavLink></li>
        <li><NavLink to="/listpage" className={navClass}>Employee Directory</NavLink></li>
        {isAdmin() && <li><NavLink to="/create" className={navClass}>Add Employee</NavLink></li>}
        {isAdmin() && <li><NavLink to="/community" className={navClass}>Community</NavLink></li>}
        <li><NavLink to="/community-data" className={navClass}>Community Data</NavLink></li>
        <li><NavLink to="/metrics" className={navClass}>Metrics</NavLink></li>
        {isAdmin() && <li><NavLink to="/admin" className={navClass}>Admin</NavLink></li>}
        <li className={`nav ${recreationOpen ? "open" : ""}`}>
          <button
            type="button"
            className="nav-button nav-toggle"
            onClick={() => setRecreationOpen((open) => !open)}
            aria-expanded={recreationOpen}
          >
            Recreation Page <span className="down">{recreationOpen ? "-" : "+"}</span>
          </button>
          {recreationOpen && (
            <ul className="nav-menu">
              <li><NavLink to="/recreation" end className={navClass}>Overview</NavLink></li>
              <li><NavLink to="/recreation/boardgames" className={navClass}>Board Games</NavLink></li>
            </ul>
          )}
        </li>
        {isLoggedIn() && (
          <li>
            <button className="nav-button logout-link" onClick={() => { logout(); window.location.href = "/login"; }}>
              Logout
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navigation;
