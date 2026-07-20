import { useMemo, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { Link, useSearchParams } from "react-router-dom";
import { isAdmin } from "../auth";
import { SET_EMPLOYEE_STATUS, UPDATE_EMPLOYEE } from "../graphql/mutations";
import { GET_EMPLOYEES, GET_EMPLOYEE_COMMUNITIES, GET_METRICS } from "../graphql/queries";
import "../index.css";

const dateValue = (value) => {
  const numeric = Number(value);
  const date = new Date(Number.isNaN(numeric) ? value : numeric);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 10);
};

const displayDate = (value) => {
  const [year, month, day] = dateValue(value).split("-");
  return year ? `${month}/${day}/${year}` : "Unavailable";
};

const EmployeeTable = () => {
  const { loading, error, data } = useQuery(GET_EMPLOYEES);
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("all");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("name");
  const [editing, setEditing] = useState(null);
  const [notice, setNotice] = useState("");
  const [actionError, setActionError] = useState("");
  const admin = isAdmin();
  const selectedEmployeeId = searchParams.get("employee");
  const refetchQueries = [
    { query: GET_EMPLOYEES },
    { query: GET_EMPLOYEE_COMMUNITIES },
    { query: GET_METRICS },
  ];
  const [updateEmployee, { loading: updating }] = useMutation(UPDATE_EMPLOYEE, { refetchQueries });
  const [setEmployeeStatus, { loading: changingStatus }] = useMutation(SET_EMPLOYEE_STATUS, { refetchQueries });

  const employees = data?.employees || [];
  const departments = useMemo(
    () => [...new Set(employees.map(({ Department }) => Department))].sort(),
    [employees]
  );
  const visibleEmployees = useMemo(() => {
    const term = search.trim().toLowerCase();
    return employees
      .filter((employee) => {
        const searchable = [
          employee.FirstName,
          employee.LastName,
          employee.Title,
          employee.Department,
          employee.EmployeeType,
        ].join(" ").toLowerCase();
        return (!term || searchable.includes(term))
          && (department === "all" || employee.Department === department)
          && (status === "all" || employee.CurrentStatus === (status === "active"));
      })
      .sort((a, b) => {
        if (sort === "newest") return new Date(dateValue(b.DateOfJoining)) - new Date(dateValue(a.DateOfJoining));
        if (sort === "oldest") return new Date(dateValue(a.DateOfJoining)) - new Date(dateValue(b.DateOfJoining));
        return `${a.FirstName} ${a.LastName}`.localeCompare(`${b.FirstName} ${b.LastName}`);
      });
  }, [department, employees, search, sort, status]);

  const startEditing = (employee) => {
    setNotice("");
    setActionError("");
    setEditing({ ...employee, DateOfJoining: dateValue(employee.DateOfJoining) });
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    setActionError("");
    try {
      const { id, FirstName, LastName, Age, DateOfJoining, Title, Department, EmployeeType } = editing;
      await updateEmployee({
        variables: {
          id,
          input: {
            FirstName: FirstName.trim(),
            LastName: LastName.trim(),
            Age: Number(Age),
            DateOfJoining,
            Title,
            Department,
            EmployeeType,
          },
        },
      });
      setEditing(null);
      setNotice("Employee details updated.");
    } catch (mutationError) {
      setActionError(mutationError.message);
    }
  };

  const handleStatus = async (employee) => {
    setNotice("");
    setActionError("");
    try {
      await setEmployeeStatus({
        variables: { id: employee.id, active: !employee.CurrentStatus },
      });
      setNotice(`${employee.FirstName} is now ${employee.CurrentStatus ? "inactive" : "active"}.`);
    } catch (mutationError) {
      setActionError(mutationError.message);
    }
  };

  if (loading) return <p>Loading employee directory...</p>;
  if (error) {
    return (
      <p className="error-message">
        Employee data is unavailable. Start the backend API on port 4000 and refresh.
      </p>
    );
  }

  if (!employees.length) {
    return (
      <p className="center">
        No employee records yet.{admin && <> <Link to="/create">Add the first employee</Link>.</>}
      </p>
    );
  }

  return (
    <div className="directory-workspace">
      <div className="directory-toolbar" aria-label="Employee directory filters">
        <label className="directory-search">
          <span>Search</span>
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Name, title, department..."
          />
        </label>
        <label>
          <span>Department</span>
          <select value={department} onChange={(event) => setDepartment(event.target.value)}>
            <option value="all">All departments</option>
            {departments.map((name) => <option key={name} value={name}>{name}</option>)}
          </select>
        </label>
        <label>
          <span>Status</span>
          <select value={status} onChange={(event) => setStatus(event.target.value)}>
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </label>
        <label>
          <span>Sort</span>
          <select value={sort} onChange={(event) => setSort(event.target.value)}>
            <option value="name">Name</option>
            <option value="newest">Newest joiners</option>
            <option value="oldest">Longest serving</option>
          </select>
        </label>
      </div>

      <div className="directory-summary">
        <strong>{visibleEmployees.length}</strong> of {employees.length} employees
        <span>{employees.filter(({ CurrentStatus }) => CurrentStatus).length} active</span>
      </div>

      {notice && <p className="success-message directory-message" role="status">{notice}</p>}
      {actionError && <p className="error-message directory-message" role="alert">{actionError}</p>}

      {editing && (
        <form className="employee-edit-panel" onSubmit={handleUpdate}>
          <div className="employee-edit-heading">
            <div>
              <p className="ems-kicker">Edit profile</p>
              <h2>{editing.FirstName} {editing.LastName}</h2>
            </div>
            <button type="button" className="account-status-button" onClick={() => setEditing(null)}>Cancel</button>
          </div>
          <div className="employee-edit-grid">
            <label>First name<input value={editing.FirstName} onChange={(event) => setEditing({ ...editing, FirstName: event.target.value })} required /></label>
            <label>Last name<input value={editing.LastName} onChange={(event) => setEditing({ ...editing, LastName: event.target.value })} required /></label>
            <label>Age<input type="number" min="20" max="70" value={editing.Age} onChange={(event) => setEditing({ ...editing, Age: event.target.value })} required /></label>
            <label>Date of joining<input type="date" value={editing.DateOfJoining} onChange={(event) => setEditing({ ...editing, DateOfJoining: event.target.value })} required /></label>
            <label>Title
              <select value={editing.Title} onChange={(event) => setEditing({ ...editing, Title: event.target.value })}>
                <option value="Employee">Employee</option><option value="Manager">Manager</option><option value="Director">Director</option><option value="VP">VP</option>
              </select>
            </label>
            <label>Department
              <select value={editing.Department} onChange={(event) => setEditing({ ...editing, Department: event.target.value })}>
                <option value="IT">IT</option><option value="Marketing">Marketing</option><option value="HR">HR</option><option value="Engineering">Engineering</option>
              </select>
            </label>
            <label>Employee type
              <select value={editing.EmployeeType} onChange={(event) => setEditing({ ...editing, EmployeeType: event.target.value })}>
                <option value="FullTime">Full-Time</option><option value="PartTime">Part-Time</option><option value="Contract">Contract</option><option value="Seasonal">Seasonal</option>
              </select>
            </label>
          </div>
          <button type="submit" className="ems-button" disabled={updating}>{updating ? "Saving..." : "Save Changes"}</button>
        </form>
      )}

      <div className="ems-table-container directory-table-container">
        <table className="ems-table directory-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Age</th>
              <th>Joined</th>
              <th>Title</th>
              <th>Department</th>
              <th>Type</th>
              <th>Status</th>
              {admin && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {visibleEmployees.map((employee) => (
              <tr key={employee.id} className={employee.id === selectedEmployeeId ? "selected-row" : ""}>
                <td><strong>{employee.FirstName} {employee.LastName}</strong></td>
                <td>{employee.Age}</td>
                <td>{displayDate(employee.DateOfJoining)}</td>
                <td>{employee.Title}</td>
                <td>{employee.Department}</td>
                <td>{employee.EmployeeType}</td>
                <td><span className={`employee-status ${employee.CurrentStatus ? "active" : "inactive"}`}>{employee.CurrentStatus ? "Active" : "Inactive"}</span></td>
                {admin && (
                  <td>
                    <div className="directory-actions">
                      <button type="button" onClick={() => startEditing(employee)}>Edit</button>
                      <button type="button" onClick={() => handleStatus(employee)} disabled={changingStatus}>
                        {employee.CurrentStatus ? "Deactivate" : "Reactivate"}
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        {!visibleEmployees.length && <p className="directory-empty">No employees match these filters.</p>}
      </div>
    </div>
  );
};

export default EmployeeTable;
