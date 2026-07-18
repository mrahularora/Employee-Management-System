import { Link, useNavigate } from "react-router-dom";
import { getUser, logout } from "../auth";
import EmployeeHeader from "../components/EmployeeHeader";
import EmployeeNavigation from "../components/EmployeeNavigation";
import EmployeeFooter from "../components/EmployeeFooter";

const Admin = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div>
      <EmployeeHeader />
      <EmployeeNavigation />
      <section className="ems-home-hero">
        <p className="ems-kicker">Admin panel</p>
        <h1>Welcome, {getUser() || "admin"}.</h1>
        <p>Manage restricted EMS workflows from one internal dashboard.</p>
        <div className="ems-home-actions">
          <Link to="/create" className="ems-button">Add Employee</Link>
          <Link to="/community" className="ems-button secondary">Manage Community</Link>
          <button type="button" className="ems-button danger" onClick={handleLogout}>Logout</button>
        </div>
      </section>
      <section className="ems-home-grid">
        <Link to="/listpage" className="ems-home-card">
          <span>01</span>
          <h3>Employee Directory</h3>
          <p>Review employee records loaded from the protected GraphQL API.</p>
        </Link>
        <Link to="/create" className="ems-home-card">
          <span>02</span>
          <h3>Create Records</h3>
          <p>Add new employee profiles for internal tracking.</p>
        </Link>
        <Link to="/recreation" className="ems-home-card">
          <span>03</span>
          <h3>Programs</h3>
          <p>View recreation and activity registration areas.</p>
        </Link>
      </section>
      <EmployeeFooter />
    </div>
  );
};

export default Admin;
