import { Link } from "react-router-dom";
import EmployeeHeader from "../components/EmployeeHeader";
import EmployeeNavigation from "../components/EmployeeNavigation";
import EmployeeFooter from "../components/EmployeeFooter";

const Error404 = () => {
  return (
    <div>
      <EmployeeHeader />
      <EmployeeNavigation />
      <section className="ems-home-hero">
        <p className="ems-kicker">Page not found</p>
        <h1>We could not find that EMS page.</h1>
        <p>
          The link may be outdated, or the page may have moved. Use one of the
          shortcuts below to return to an active area of the system.
        </p>
        <div className="ems-home-actions">
          <Link to="/listpage" className="ems-button">Employee Directory</Link>
          <Link to="/create" className="ems-button secondary">Add Employee</Link>
          <Link to="/recreation" className="ems-button secondary">Recreation</Link>
        </div>
      </section>
      <EmployeeFooter />
    </div>
  );
};

export default Error404;
