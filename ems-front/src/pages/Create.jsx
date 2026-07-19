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
        <div className="ems-container create-page">
          <div className="create-layout">
            <aside className="create-details">
              <section className="ems-home-hero">
                <p className="ems-kicker">Employee onboarding</p>
                <h1>Create a new employee record.</h1>
                <p>
                  Add verified employee details once, then use them across the
                  directory, community, and recreation areas.
                </p>
              </section>
              <section className="ems-info-section">
                <div>
                  <h2>Before you submit</h2>
                  <p>
                    Confirm the employee name, role, department, and joining
                    date so the directory stays reliable for everyday HR work.
                  </p>
                </div>
                <ul>
                  <li>Enter the employee name exactly as it should appear.</li>
                  <li>Choose the correct title, department, and employment type.</li>
                  <li>Confirm the joining date before submitting the record.</li>
                </ul>
              </section>
            </aside>
            <EmployeeCreate />
          </div>
        </div>
        <div className="ems-clear"></div>
        <EmployeeFooter />
    </div>
  );
};

export default Create;
