import { useQuery } from "@apollo/client";
import { GET_METRICS } from "../graphql/queries";
import EmployeeHeader from "../components/EmployeeHeader";
import EmployeeNavigation from "../components/EmployeeNavigation";
import EmployeeFooter from "../components/EmployeeFooter";

const Metrics = () => {
  const { data, loading, error } = useQuery(GET_METRICS);
  const metrics = data?.metrics;

  return (
    <div>
      <EmployeeHeader />
      <EmployeeNavigation />
      <section className="ems-home-hero">
        <p className="ems-kicker">Organization metrics</p>
        <h1>EMS Metrics</h1>
        <p>
          Review high-level workforce and community numbers from the protected
          GraphQL metrics API.
        </p>
      </section>
      <div className="ems-container">
        {loading && <p className="ems-section-note">Loading metrics...</p>}
        {error && <p className="error-message">Error: {error.message}</p>}
        {metrics && (
          <>
            <section className="metrics-grid">
              <div className="ems-home-card">
                <span>{metrics.totalEmployees}</span>
                <h3>Total Employees</h3>
                <p>All employee records currently stored in EMS.</p>
              </div>
              <div className="ems-home-card">
                <span>{metrics.activeEmployees}</span>
                <h3>Active Employees</h3>
                <p>Employees marked as currently active.</p>
              </div>
              <div className="ems-home-card">
                <span>{metrics.inactiveEmployees}</span>
                <h3>Inactive Employees</h3>
                <p>Employees no longer marked active.</p>
              </div>
              <div className="ems-home-card">
                <span>{metrics.totalCommunities}</span>
                <h3>Communities</h3>
                <p>Registered employee community groups.</p>
              </div>
              <div className="ems-home-card">
                <span>{metrics.totalCommunityMembers}</span>
                <h3>Community Members</h3>
                <p>Total members across all community groups.</p>
              </div>
            </section>
            <section className="ems-info-section metrics-breakdown">
              <div>
                <h2>Employees by Department</h2>
                <p>Department totals are calculated from live employee records.</p>
              </div>
              <ul>
                {metrics.departments.length === 0 ? (
                  <li>No department data found.</li>
                ) : (
                  metrics.departments.map(({ name, count }) => (
                    <li key={name}>{name}: {count}</li>
                  ))
                )}
              </ul>
            </section>
          </>
        )}
      </div>
      <EmployeeFooter />
    </div>
  );
};

export default Metrics;
