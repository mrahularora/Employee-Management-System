import { useQuery } from "@apollo/client";
import { Link } from "react-router-dom";
import { GET_EMPLOYEE_COMMUNITIES } from "../graphql/queries";
import EmployeeHeader from "../components/EmployeeHeader";
import EmployeeNavigation from "../components/EmployeeNavigation";
import EmployeeFooter from "../components/EmployeeFooter";

const CommunityData = () => {
  const { data, loading, error } = useQuery(GET_EMPLOYEE_COMMUNITIES);
  const communities = data?.employeeCommunities || [];

  return (
    <div>
      <EmployeeHeader />
      <EmployeeNavigation />
      <section className="ems-home-hero">
        <p className="ems-kicker">Community records</p>
        <h1>Community Data</h1>
        <p>
          Review employee community entries loaded from the GraphQL API,
          including department, club name, and member count.
        </p>
      </section>
      <div className="ems-container">
        {loading && <p className="ems-section-note">Loading community data...</p>}
        {error && <p className="error-message">Error: {error.message}</p>}
        {!loading && !error && (
          <div className="ems-table-container">
            {communities.length === 0 ? (
              <p className="ems-section-note">No community entries found.</p>
            ) : (
              <table className="ems-table">
                <thead>
                  <tr>
                    <th>Employee Name</th>
                    <th>Department Name</th>
                    <th>Club Name</th>
                    <th>Number of Members</th>
                  </tr>
                </thead>
                <tbody>
                  {communities.map(({ id, EmployeeId, EmployeeName, DepartmentName, ClubName, NumberOfMembers }) => (
                    <tr key={id}>
                      <td>
                        {EmployeeId ? (
                          <Link to={`/listpage?employee=${EmployeeId}`}>{EmployeeName}</Link>
                        ) : EmployeeName}
                      </td>
                      <td>{DepartmentName}</td>
                      <td>{ClubName}</td>
                      <td>{NumberOfMembers} members</td>
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

export default CommunityData;
