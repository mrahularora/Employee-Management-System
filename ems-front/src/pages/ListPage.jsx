import "../index.css";
import EmployeeHeader from "../components/EmployeeHeader";
import EmployeeNavigation from "../components/EmployeeNavigation";
import EmployeeTable from "../components/EmployeeTable";
import EmployeeTransfer from "../components/EmployeeTransfer";
import EmployeeFooter from "../components/EmployeeFooter";
import { isAdmin } from "../auth";

const ListPage = () => {
  return (
    <div>
      <EmployeeHeader />
      <EmployeeNavigation />
      <div className="ems-clear"></div>
      <section className="ems-home-hero">
        <p className="ems-kicker">Employee records</p>
        <h1>Employee Directory</h1>
        <p>
          Review live employee records from the GraphQL API, including role,
          department, employment type, and current status.
        </p>
      </section>
      <div className="ems-container directory-page">
        <p className="ems-section-note">
          Search and filter the workforce. Administrators can edit profiles and manage employment status.
        </p>
        {isAdmin() && <EmployeeTransfer />}
        <EmployeeTable />
        </div>
        <div className="ems-clear"></div><br />
        <EmployeeFooter />
      </div>
  );
};

export default ListPage;
