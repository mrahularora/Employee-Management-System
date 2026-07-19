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
        <p className="ems-kicker">Employee records</p>
        <h1>Employee Directory</h1>
        <p>
          Review live employee records from the GraphQL API, including role,
          department, employment type, and current status.
        </p>
      </section>
      <div className="ems-container">
        <p className="ems-section-note">
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
