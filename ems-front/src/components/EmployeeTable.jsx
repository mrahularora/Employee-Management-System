import { useQuery } from "@apollo/client";
import { GET_EMPLOYEES } from "../graphql/queries";
import "../index.css";

const EmployeeTable = () => {
  const { loading, error, data } = useQuery(GET_EMPLOYEES);

  if (loading) return <p>Loading data...</p>;
  if (error) {
    return (
      <p className="error-message">
        Employee data is unavailable. Start the backend API on port 4000 and refresh.
      </p>
    );
  }

  if (!data?.employees?.length) {
    return <p className="center">No employees found.</p>;
  }

  return (
    <div className="ems-table-container">
      <table className="ems-table">
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Age</th>
            <th>Date of Joining</th>
            <th>Title</th>
            <th>Department</th>
            <th>Employee Type</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {data.employees.map((employee) => (
            <tr key={employee.id}>
              <td>{employee.FirstName}</td>
              <td>{employee.LastName}</td>
              <td>{employee.Age}</td>
              <td>
                {new Date(Number(employee.DateOfJoining))
                  .toISOString()
                  .split("T")[0]
                  .split("-")
                  .reverse()
                  .join("/")}
              </td>
              <td>{employee.Title}</td>
              <td>{employee.Department}</td>
              <td>{employee.EmployeeType}</td>
              <td className={employee.CurrentStatus ? "true" : "false"}>
                {employee.CurrentStatus ? "1" : "0"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeTable;
