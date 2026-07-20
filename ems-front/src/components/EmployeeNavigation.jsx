import { useQuery } from "@apollo/client";
import {
  Building2,
  ChartNoAxesCombined,
  ChevronDown,
  Gamepad2,
  HeartHandshake,
  LayoutDashboard,
  LogOut,
  Menu,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  getNotificationsReadAt,
  getRole,
  getUser,
  isAdmin,
  isLoggedIn,
  logout,
  NOTIFICATIONS_READ_EVENT,
} from "../auth";
import { GET_NOTIFICATIONS } from "../graphql/queries";
import "../index.css";

const sectionForPath = (pathname) => {
  if (["/listpage", "/create"].includes(pathname)) return "workforce";
  if (pathname.startsWith("/community")) return "community";
  if (["/metrics", "/notifications"].includes(pathname)) return "insights";
  if (pathname.startsWith("/recreation") || pathname === "/tictactoe") return "recreation";
  if (["/admin", "/audit-log"].includes(pathname)) return "administration";
  return null;
};

const SidebarSection = ({ id, label, icon: Icon, open, active, onToggle, children }) => (
  <li className={`sidebar-section${open ? " open" : ""}${active ? " active" : ""}`}>
    <button
      type="button"
      className="sidebar-section-toggle"
      onClick={() => onToggle(id)}
      aria-controls={`${id}-menu`}
      aria-expanded={open}
    >
      <Icon size={19} strokeWidth={1.9} aria-hidden="true" />
      <span>{label}</span>
      <ChevronDown className="sidebar-chevron" size={17} aria-hidden="true" />
    </button>
    <ul id={`${id}-menu`} className="sidebar-submenu" hidden={!open}>
      {children}
    </ul>
  </li>
);

const Navigation = () => {
  const { pathname } = useLocation();
  const activeSection = sectionForPath(pathname);
  const [openSection, setOpenSection] = useState(activeSection);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [readAt, setReadAt] = useState(getNotificationsReadAt);
  const loggedIn = isLoggedIn();
  const admin = isAdmin();
  const username = getUser() || "User";
  const roleLabel = getRole() === "ADMIN" ? "Administrator" : "Employee";
  const { data: notificationData } = useQuery(GET_NOTIFICATIONS, {
    pollInterval: 30000,
    skip: !loggedIn,
  });
  const unreadNotifications = (notificationData?.notifications || [])
    .filter(({ createdAt }) => new Date(createdAt).getTime() > readAt).length;

  useEffect(() => {
    setOpenSection(activeSection);
    setMobileOpen(false);
  }, [activeSection, pathname]);

  useEffect(() => {
    const updateReadAt = () => setReadAt(getNotificationsReadAt());
    window.addEventListener(NOTIFICATIONS_READ_EVENT, updateReadAt);
    return () => window.removeEventListener(NOTIFICATIONS_READ_EVENT, updateReadAt);
  }, []);

  const toggleSection = (section) => {
    setOpenSection((current) => (current === section ? null : section));
  };
  const linkClass = ({ isActive }) => `sidebar-link${isActive ? " active" : ""}`;
  const sublinkClass = ({ isActive }) => `sidebar-sub-link${isActive ? " active" : ""}`;

  return (
    <nav className="ems-navigation" aria-label="Primary navigation">
      <div className="sidebar-brand">
        <div className="sidebar-brand-identity">
          <span className="sidebar-brand-mark" aria-hidden="true">
            <Building2 size={20} strokeWidth={2} />
          </span>
          <div className="sidebar-brand-copy">
            <span>EMS</span>
            <small>Internal Portal</small>
          </div>
        </div>
        <button
          type="button"
          className="mobile-nav-toggle"
          onClick={() => setMobileOpen((open) => !open)}
          aria-controls="ems-primary-nav"
          aria-expanded={mobileOpen}
          aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
        >
          {mobileOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
        </button>
      </div>

      <div id="ems-primary-nav" className={`sidebar-content${mobileOpen ? " mobile-open" : ""}`}>
        <ul className="sidebar-menu">
          <li>
            <NavLink to="/" end className={linkClass}>
              <LayoutDashboard size={19} strokeWidth={1.9} aria-hidden="true" />
              <span>Dashboard</span>
            </NavLink>
          </li>

          <SidebarSection
            id="workforce"
            label="Workforce"
            icon={Users}
            open={openSection === "workforce"}
            active={activeSection === "workforce"}
            onToggle={toggleSection}
          >
            <li><NavLink to="/listpage" className={sublinkClass}>Employee Directory</NavLink></li>
            {admin && <li><NavLink to="/create" className={sublinkClass}>Add Employee</NavLink></li>}
          </SidebarSection>

          <SidebarSection
            id="community"
            label="Community"
            icon={HeartHandshake}
            open={openSection === "community"}
            active={activeSection === "community"}
            onToggle={toggleSection}
          >
            <li><NavLink to="/community-data" className={sublinkClass}>Community Directory</NavLink></li>
            {admin && <li><NavLink to="/community" className={sublinkClass}>Manage Community</NavLink></li>}
          </SidebarSection>

          <SidebarSection
            id="insights"
            label="Insights"
            icon={ChartNoAxesCombined}
            open={openSection === "insights"}
            active={activeSection === "insights"}
            onToggle={toggleSection}
          >
            <li><NavLink to="/metrics" className={sublinkClass}>Workforce Metrics</NavLink></li>
            <li>
              <NavLink
                to="/notifications"
                className={({ isActive }) => `sidebar-sub-link notification-link${isActive ? " active" : ""}`}
              >
                <span>Notifications</span>
                {unreadNotifications > 0 && (
                  <span className="notification-count" aria-label={`${unreadNotifications} unread notifications`}>
                    {unreadNotifications > 9 ? "9+" : unreadNotifications}
                  </span>
                )}
              </NavLink>
            </li>
          </SidebarSection>

          <SidebarSection
            id="recreation"
            label="Recreation"
            icon={Gamepad2}
            open={openSection === "recreation"}
            active={activeSection === "recreation"}
            onToggle={toggleSection}
          >
            <li><NavLink to="/recreation" end className={sublinkClass}>Recreation Overview</NavLink></li>
            <li><NavLink to="/recreation/boardgames" className={sublinkClass}>Board Games</NavLink></li>
            <li><NavLink to="/tictactoe" className={sublinkClass}>Tic Tac Toe</NavLink></li>
          </SidebarSection>

          {admin && (
            <SidebarSection
              id="administration"
              label="Administration"
              icon={ShieldCheck}
              open={openSection === "administration"}
              active={activeSection === "administration"}
              onToggle={toggleSection}
            >
              <li><NavLink to="/admin" className={sublinkClass}>Admin Panel</NavLink></li>
              <li><NavLink to="/audit-log" className={sublinkClass}>Audit History</NavLink></li>
            </SidebarSection>
          )}
        </ul>

        {loggedIn && (
          <div className="sidebar-account">
            <span className="sidebar-avatar" aria-hidden="true">{username.charAt(0).toUpperCase()}</span>
            <span className="sidebar-user">
              <strong>{username}</strong>
              <small>{roleLabel}</small>
            </span>
            <button
              type="button"
              className="sidebar-logout"
              onClick={() => { logout(); window.location.href = "/login"; }}
              aria-label="Log out"
              title="Log out"
            >
              <LogOut size={18} strokeWidth={2} aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
