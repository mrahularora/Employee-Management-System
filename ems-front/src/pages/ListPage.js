import { Link } from "react-router-dom";
import "../index.css";
import EmployeeHeader from "../components/EmployeeHeader";
import EmployeeNavigation from "../components/EmployeeNavigation";
import EmployeeTable from "../components/EmployeeTable";
import EmployeeFooter from "../components/EmployeeFooter";

const ListPage = () => {
  return (
    <div>
      <EmployeeHeader />
      <EmployeeNavigation />
      <div className="ems-clear"></div>
      <section className="ems-home-hero">
        <div>
          <p className="ems-kicker">Workforce operations</p>
          <h1>Manage employees, communities, and recreation in one place.</h1>
          <p>
            A simple employee management dashboard for tracking staff records,
            community groups, and workplace activities.
          </p>
          <div className="ems-home-actions">
            <Link to="/create" className="ems-button">Add Employee</Link>
            <Link to="/community" className="ems-button secondary">View Community</Link>
          </div>
        </div>
      </section>
      <section className="ems-home-grid">
        <Link to="/listpage" className="ems-home-card">
          <span>01</span>
          <h3>Employee Records</h3>
          <p>Review current employee details, roles, departments, and status.</p>
        </Link>
        <Link to="/community" className="ems-home-card">
          <span>02</span>
          <h3>Community Groups</h3>
          <p>Create and view internal clubs that keep employees connected.</p>
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
            Use this system as a single place to keep employee information organized,
            review active staff, add new employees, and connect workplace programs
            with the people who participate in them.
          </p>
        </div>
        <ul>
          <li>Keep employee records easy to scan and update.</li>
          <li>Track departments, job titles, employment type, and status.</li>
          <li>Connect employee data with community and recreation activities.</li>
        </ul>
      </section>
      <div className="ems-container">
      <h2 className="center">Employee Directory</h2>
        <p className="ems-section-note">
          The directory below loads live employee records from the GraphQL API.
          Start the backend before viewing or adding records.
        </p>
        <EmployeeTable />
        </div>
        <div className="ems-clear"></div><br />
        <EmployeeFooter />
      </div>
  );
};

export default ListPage;
