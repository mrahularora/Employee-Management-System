import { useState } from "react";
import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { LOGIN } from "../graphql/mutations";
import { saveLogin } from "../auth";
import "../index.css";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [login, { loading, error }] = useMutation(LOGIN, {
    onCompleted: ({ login }) => {
      saveLogin(login);
      navigate(login.role === "ADMIN" ? "/admin" : "/");
    },
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    login({ variables: formData });
  };

  return (
    <main className="login-page">
      <section className="login-panel">
        <p className="ems-kicker">Internal access</p>
        <h1>Employee Management System</h1>
        <p className="login-copy">Sign in with your organization account to continue.</p>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              placeholder="admin"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              required
            />
          </div>
          {error && <p className="error-message">Invalid username or password.</p>}
          <button type="submit" className="ems-button" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </section>
    </main>
  );
};

export default Login;
