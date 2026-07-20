import { Link } from "react-router-dom";
import EmployeeHeader from "../components/EmployeeHeader";
import EmployeeNavigation from "../components/EmployeeNavigation";
import EmployeeFooter from "../components/EmployeeFooter";
import { isAdmin } from "../auth";

const Home = () => {
  return (
    <div>
      <EmployeeHeader />
      <EmployeeNavigation />
      <section className="ems-home-hero">
        <p className="ems-kicker">Workforce operations</p>
        <h1>Manage employees, communities, and recreation in one place.</h1>
        <p>
          A simple internal dashboard for employee records, team communities,
          and workplace activity programs.
        </p>
        <div className="ems-home-actions">
          <Link to="/listpage" className="ems-button">Employee Directory</Link>
          {isAdmin() && <Link to="/create" className="ems-button secondary">Add Employee</Link>}
        </div>
      </section>
      <section className="ems-home-grid">
        <Link to="/listpage" className="ems-home-card">
          <span>01</span>
          <h3>Employee Directory</h3>
          <p>Review live employee records, roles, departments, and status.</p>
        </Link>
        <Link to="/community-data" className="ems-home-card">
          <span>02</span>
          <h3>Community Data</h3>
          <p>Review internal clubs and group participation records.</p>
        </Link>
        <Link to="/recreation" className="ems-home-card">
          <span>03</span>
          <h3>Recreation</h3>
          <p>Explore workplace events, registrations, and team activities.</p>
        </Link>
      </section>
      <section className="ems-info-section">
        <div>
          <h2>Built for everyday HR work</h2>
          <p>
            Use EMS as the starting point for staff records, onboarding, team
            participation, and internal activity planning.
          </p>
        </div>
        <ul>
          <li>Keep employee information organized and easy to scan.</li>
          <li>Connect directory data with community and recreation areas.</li>
          <li>Give admins one restricted place to manage internal workflows.</li>
        </ul>
      </section>
      <EmployeeFooter />
    </div>
  );
};

export default Home;
