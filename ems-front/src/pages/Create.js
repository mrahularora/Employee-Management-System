import EmployeeHeader from "../components/EmployeeHeader";
import EmployeeNavigation from "../components/EmployeeNavigation";
import EmployeeCreate from "../components/EmployeeCreate";
import EmployeeFooter from "../components/EmployeeFooter";

const Create = () => {
  return (
    <div>
      <EmployeeHeader />
      <EmployeeNavigation />
      <div className="ems-clear"></div>
        <div className="ems-container">
        <h2 className="center">Create New Employee</h2>
        <section className="ems-info-section">
          <div>
            <h2>Add a complete employee profile</h2>
            <p>
              Use this page to register new employees with the details needed
              for directory tracking, department reporting, and employment status
              visibility.
            </p>
          </div>
          <ul>
            <li>Enter the employee name exactly as it should appear.</li>
            <li>Choose the correct title, department, and employment type.</li>
            <li>Confirm the joining date before submitting the record.</li>
          </ul>
        </section>
        <EmployeeCreate />
        </div>
        <div className="ems-clear"></div>
        <EmployeeFooter />
    </div>
  );
};

export default Create;
