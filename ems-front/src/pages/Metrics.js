import { useQuery } from "@apollo/client";
import { GET_METRICS } from "../graphql/queries";
import EmployeeHeader from "../components/EmployeeHeader";
import EmployeeNavigation from "../components/EmployeeNavigation";
import EmployeeFooter from "../components/EmployeeFooter";

const Metrics = () => {
  const { data, loading, error } = useQuery(GET_METRICS);
  const metrics = data?.metrics;
  const totalEmployees = metrics?.totalEmployees || 0;
  const activePercent = totalEmployees
    ? Math.round((metrics.activeEmployees / totalEmployees) * 100)
    : 0;
  const largestDepartment = Math.max(
    1,
    ...(metrics?.departments.map(({ count }) => count) || [])
  );
  const averageCommunitySize = metrics?.totalCommunities
    ? Math.round(metrics.totalCommunityMembers / metrics.totalCommunities)
    : 0;

  return (
    <div>
      <EmployeeHeader />
      <EmployeeNavigation />
      <section className="ems-home-hero">
        <p className="ems-kicker">Organization metrics</p>
        <h1>EMS Metrics</h1>
        <p>
          A visual overview of workforce status, department size, and community
          participation from live organization data.
        </p>
      </section>
      <div className="ems-container">
        {loading && <p className="ems-section-note">Loading metrics...</p>}
        {error && <p className="error-message">Error: {error.message}</p>}
        {metrics && (
          <>
            <section className="metrics-grid">
              <article className="ems-home-card">
                <span>{metrics.totalEmployees}</span>
                <h3>Total Employees</h3>
              </article>
              <article className="ems-home-card metric-active">
                <span>{metrics.activeEmployees}</span>
                <h3>Active Employees</h3>
              </article>
              <article className="ems-home-card metric-inactive">
                <span>{metrics.inactiveEmployees}</span>
                <h3>Inactive Employees</h3>
              </article>
              <article className="ems-home-card metric-community">
                <span>{metrics.totalCommunities}</span>
                <h3>Communities</h3>
              </article>
              <article className="ems-home-card metric-members">
                <span>{metrics.totalCommunityMembers}</span>
                <h3>Memberships</h3>
              </article>
            </section>

            <section className="metrics-charts" aria-label="Organization charts">
              <article className="metric-chart-card">
                <header>
                  <p className="ems-kicker">Workforce status</p>
                  <h2>Active vs. Inactive</h2>
                </header>
                <div className="status-chart-layout">
                  <div
                    className="metrics-donut"
                    style={{ "--active-share": `${activePercent * 3.6}deg` }}
                    role="img"
                    aria-label={`${activePercent}% of employees are active`}
                  >
                    <div>
                      <strong>{activePercent}%</strong>
                      <span>active</span>
                    </div>
                  </div>
                  <ul className="chart-legend">
                    <li>
                      <span className="legend-dot active" />
                      <div>
                        <small>Active</small>
                        <strong>{metrics.activeEmployees}</strong>
                      </div>
                    </li>
                    <li>
                      <span className="legend-dot inactive" />
                      <div>
                        <small>Inactive</small>
                        <strong>{metrics.inactiveEmployees}</strong>
                      </div>
                    </li>
                  </ul>
                </div>
              </article>

              <article className="metric-chart-card department-chart-card">
                <header>
                  <p className="ems-kicker">Team distribution</p>
                  <h2>Employees by Department</h2>
                </header>
                {metrics.departments.length === 0 ? (
                  <p className="ems-section-note">No department data found.</p>
                ) : (
                  <ol className="department-chart">
                    {metrics.departments.map(({ name, count }) => (
                      <li key={name}>
                        <div className="department-chart-label">
                          <span>{name}</span>
                          <strong>{count}</strong>
                        </div>
                        <div
                          className="department-bar-track"
                          role="progressbar"
                          aria-label={`${name}: ${count} employees`}
                          aria-valuemin="0"
                          aria-valuemax={largestDepartment}
                          aria-valuenow={count}
                        >
                          <span
                            style={{ width: `${(count / largestDepartment) * 100}%` }}
                          />
                        </div>
                      </li>
                    ))}
                  </ol>
                )}
              </article>
            </section>

            <section className="community-metrics">
              <div>
                <p className="ems-kicker">Community activity</p>
                <h2>Participation snapshot</h2>
                <p>Membership totals include participation across all registered groups.</p>
              </div>
              <div className="community-stat">
                <strong>{averageCommunitySize}</strong>
                <span>Average members per community</span>
              </div>
              <div className="community-stat">
                <strong>{metrics.totalCommunityMembers}</strong>
                <span>Total recorded memberships</span>
              </div>
            </section>
          </>
        )}
      </div>
      <EmployeeFooter />
    </div>
  );
};

export default Metrics;
