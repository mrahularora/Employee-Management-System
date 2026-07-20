import { NavLink, useLocation } from 'react-router-dom';
import { useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import {
  getNotificationsReadAt,
  isAdmin,
  isLoggedIn,
  logout,
  NOTIFICATIONS_READ_EVENT,
} from "../auth";
import { GET_NOTIFICATIONS } from "../graphql/queries";
import "../index.css";

const Navigation = () => {
  const { pathname } = useLocation();
  const [recreationOpen, setRecreationOpen] = useState(pathname.startsWith("/recreation"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [readAt, setReadAt] = useState(getNotificationsReadAt);
  const loggedIn = isLoggedIn();
  const { data: notificationData } = useQuery(GET_NOTIFICATIONS, {
    pollInterval: 30000,
    skip: !loggedIn,
  });
  const unreadNotifications = (notificationData?.notifications || [])
    .filter(({ createdAt }) => new Date(createdAt).getTime() > readAt).length;

  useEffect(() => {
    setRecreationOpen(pathname.startsWith("/recreation"));
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const updateReadAt = () => setReadAt(getNotificationsReadAt());
    window.addEventListener(NOTIFICATIONS_READ_EVENT, updateReadAt);
    return () => window.removeEventListener(NOTIFICATIONS_READ_EVENT, updateReadAt);
  }, []);

  const navClass = ({ isActive }) => (isActive ? "active" : "");

  return (
    <nav className="ems-navigation" aria-label="Primary navigation">
      <div className="sidebar-brand">
        <div className="sidebar-brand-copy">
          <span>EMS</span>
          <small>Internal Portal</small>
        </div>
        <button
          type="button"
          className="mobile-nav-toggle"
          onClick={() => setMobileOpen((open) => !open)}
          aria-controls="ems-primary-nav"
          aria-expanded={mobileOpen}
          aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
        >
          <span aria-hidden="true">{mobileOpen ? "\u2715" : "\u2630"}</span>
        </button>
      </div>
      <ul id="ems-primary-nav" className={mobileOpen ? "mobile-open" : ""}>
        <li><NavLink to="/" end className={navClass}>Home</NavLink></li>
        <li><NavLink to="/listpage" className={navClass}>Employee Directory</NavLink></li>
        {isAdmin() && <li><NavLink to="/create" className={navClass}>Add Employee</NavLink></li>}
        {isAdmin() && <li><NavLink to="/community" className={navClass}>Community</NavLink></li>}
        <li><NavLink to="/community-data" className={navClass}>Community Data</NavLink></li>
        <li><NavLink to="/metrics" className={navClass}>Metrics</NavLink></li>
        <li>
          <NavLink to="/notifications" className={({ isActive }) => `notification-link${isActive ? " active" : ""}`}>
            <span>Notifications</span>
            {unreadNotifications > 0 && (
              <span className="notification-count" aria-label={`${unreadNotifications} unread notifications`}>
                {unreadNotifications > 9 ? "9+" : unreadNotifications}
              </span>
            )}
          </NavLink>
        </li>
        {isAdmin() && <li><NavLink to="/admin" className={navClass}>Admin</NavLink></li>}
        {isAdmin() && <li><NavLink to="/audit-log" className={navClass}>Audit History</NavLink></li>}
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
        {loggedIn && (
          <li>
            <button type="button" className="nav-button logout-link" onClick={() => { logout(); window.location.href = "/login"; }}>
              Logout
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navigation;
