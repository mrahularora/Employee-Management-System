import { useQuery } from "@apollo/client";
import EmployeeFooter from "../components/EmployeeFooter";
import EmployeeHeader from "../components/EmployeeHeader";
import EmployeeNavigation from "../components/EmployeeNavigation";
import { GET_AUDIT_LOGS } from "../graphql/queries";

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
  timeStyle: "short",
});

const AuditLog = () => {
  const { data, loading, error } = useQuery(GET_AUDIT_LOGS);
  const logs = data?.auditLogs || [];

  return (
    <div>
      <EmployeeHeader />
      <EmployeeNavigation />
      <section className="ems-home-hero">
        <p className="ems-kicker">Administration</p>
        <h1>Audit History</h1>
        <p>Review the latest account, employee, community, and recreation changes across EMS.</p>
      </section>
      <div className="ems-container">
        {loading && <p className="ems-section-note">Loading audit history...</p>}
        {error && <p className="error-message">Unable to load audit history.</p>}
        {!loading && !error && (
          <div className="ems-table-container">
            {logs.length === 0 ? (
              <p className="ems-section-note">No tracked changes yet.</p>
            ) : (
              <table className="ems-table">
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>User</th>
                    <th>Action</th>
                    <th>Record</th>
                    <th>Details</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr key={log.id}>
                      <td>{dateFormatter.format(new Date(log.createdAt))}</td>
                      <td>{log.actor}</td>
                      <td><span className="audit-action">{log.action.replaceAll("_", " ").toLowerCase()}</span></td>
                      <td>{log.targetType}</td>
                      <td>{log.summary}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
      <EmployeeFooter />
    </div>
  );
};

export default AuditLog;
