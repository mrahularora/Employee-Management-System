import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { Link, useNavigate } from "react-router-dom";
import { getRole, getUser, logout } from "../auth";
import EmployeeHeader from "../components/EmployeeHeader";
import EmployeeNavigation from "../components/EmployeeNavigation";
import EmployeeFooter from "../components/EmployeeFooter";
import { CREATE_USER, SET_USER_ACTIVE } from "../graphql/mutations";
import { GET_USERS } from "../graphql/queries";

const emptyForm = { username: "", password: "", role: "USER" };

const Admin = () => {
  const navigate = useNavigate();
  const currentUser = getUser();
  const [form, setForm] = useState(emptyForm);
  const [notice, setNotice] = useState("");
  const { data, loading, error } = useQuery(GET_USERS);
  const [createUser, { loading: creating, error: createError }] = useMutation(CREATE_USER, {
    refetchQueries: [{ query: GET_USERS }],
  });
  const [setUserActive, { loading: updating, error: updateError }] = useMutation(SET_USER_ACTIVE, {
    refetchQueries: [{ query: GET_USERS }],
  });

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleCreate = async (event) => {
    event.preventDefault();
    setNotice("");
    try {
      await createUser({ variables: form });
      setForm(emptyForm);
      setNotice("Account created successfully.");
    } catch {
      // Apollo exposes the mutation error below.
    }
  };

  const handleStatus = async ({ id, active }) => {
    setNotice("");
    try {
      await setUserActive({ variables: { id, active: !active } });
    } catch {
      // Apollo exposes the mutation error below.
    }
  };

  return (
    <div>
      <EmployeeHeader />
      <EmployeeNavigation />
      <section className="ems-home-hero">
        <p className="ems-kicker">Admin panel</p>
        <h1>Welcome, {currentUser || "admin"}.</h1>
        <p>Manage restricted EMS workflows and organization access from one dashboard.</p>
        <div className="ems-home-actions">
          <Link to="/create" className="ems-button">Add Employee</Link>
          <Link to="/community" className="ems-button secondary">Manage Community</Link>
          <button type="button" className="ems-button danger" onClick={handleLogout}>Logout</button>
        </div>
      </section>
      <section className="ems-home-grid">
        <Link to="/listpage" className="ems-home-card">
          <span>01</span>
          <h3>Employee Directory</h3>
          <p>Review employee records loaded from the protected GraphQL API.</p>
        </Link>
        <Link to="/create" className="ems-home-card">
          <span>02</span>
          <h3>Create Records</h3>
          <p>Add new employee profiles for internal tracking.</p>
        </Link>
        <Link to="/recreation" className="ems-home-card">
          <span>03</span>
          <h3>Programs</h3>
          <p>View recreation and activity registration areas.</p>
        </Link>
      </section>
      <section className="ems-container admin-accounts">
        <div className="admin-section-heading">
          <p className="ems-kicker">Access control</p>
          <h2>Organization accounts</h2>
          <p>Create employee logins and control who can access the internal portal.</p>
        </div>
        <div className="admin-account-layout">
          <form className="ems-create admin-account-form" onSubmit={handleCreate}>
            <h2>Create account</h2>
            <p className="form-help">Administrators manage records. Users have read and recreation access.</p>
            <div className="form-group">
              <label htmlFor="account-username">Username</label>
              <input
                id="account-username"
                value={form.username}
                onChange={(event) => setForm({ ...form, username: event.target.value })}
                minLength="3"
                maxLength="32"
                pattern="[A-Za-z0-9._-]+"
                autoComplete="off"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="account-password">Temporary password</label>
              <input
                id="account-password"
                type="password"
                value={form.password}
                onChange={(event) => setForm({ ...form, password: event.target.value })}
                minLength="8"
                maxLength="128"
                autoComplete="new-password"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="account-role">Role</label>
              <select
                id="account-role"
                value={form.role}
                onChange={(event) => setForm({ ...form, role: event.target.value })}
              >
                <option value="USER">User</option>
                <option value="ADMIN">Administrator</option>
              </select>
            </div>
            {createError && <p className="error-message">{createError.message}</p>}
            {notice && <p className="success-message">{notice}</p>}
            <button type="submit" className="ems-button" disabled={creating}>
              {creating ? "Creating..." : "Create Account"}
            </button>
          </form>
          <div className="admin-account-list">
            <div className="admin-list-heading">
              <h2>Current accounts</h2>
              <span>{data?.users?.length || 0} total</span>
            </div>
            {loading && <p>Loading accounts...</p>}
            {error && <p className="error-message">Unable to load accounts.</p>}
            {updateError && <p className="error-message">{updateError.message}</p>}
            {!loading && !error && (
              <div className="ems-table-container">
                <table className="ems-table">
                  <thead>
                    <tr>
                      <th>Username</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Created</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.users?.map((user) => (
                      <tr key={user.id}>
                        <td>{user.username}{user.username === currentUser ? " (you)" : ""}</td>
                        <td>{user.role === "ADMIN" ? "Administrator" : "User"}</td>
                        <td className={String(user.active)}>{user.active ? "Active" : "Disabled"}</td>
                        <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                        <td>
                          <button
                            type="button"
                            className="account-status-button"
                            onClick={() => handleStatus(user)}
                            disabled={updating || user.username === currentUser}
                          >
                            {user.active ? "Disable" : "Enable"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
        <p className="admin-role-note">Signed in as {currentUser} | {getRole() === "ADMIN" ? "Administrator" : "User"}</p>
      </section>
      <EmployeeFooter />
    </div>
  );
};

export default Admin;
