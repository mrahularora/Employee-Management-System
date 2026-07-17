import React from "react";
import { Link } from "react-router-dom";
import "../index.css";
import EmployeeHeader from "../components/EmployeeHeader";
import EmployeeNavigation from "../components/EmployeeNavigation";
import EmployeeTable from "../components/EmployeeTable";
import EmployeeFooter from "../components/EmployeeFooter";

const ListPage = () => {
  return (
    <div>
      <EmployeeHeader />
      <EmployeeNavigation />
      <div className="ems-clear"></div>
      <section className="ems-home-hero">
        <div>
          <p className="ems-kicker">Workforce operations</p>
          <h1>Manage employees, communities, and recreation in one place.</h1>
          <p>
            A simple employee management dashboard for tracking staff records,
            community groups, and workplace activities.
          </p>
          <div className="ems-home-actions">
            <Link to="/create" className="ems-button">Add Employee</Link>
            <Link to="/community" className="ems-button secondary">View Community</Link>
          </div>
        </div>
      </section>
      <section className="ems-home-grid">
        <Link to="/listpage" className="ems-home-card">
          <span>01</span>
          <h3>Employee Records</h3>
          <p>Review current employee details, roles, departments, and status.</p>
        </Link>
        <Link to="/community" className="ems-home-card">
          <span>02</span>
          <h3>Community Groups</h3>
          <p>Create and view internal clubs that keep employees connected.</p>
        </Link>
        <Link to="/recreation" className="ems-home-card">
          <span>03</span>
          <h3>Recreation</h3>
          <p>Explore workplace events, registrations, and team activities.</p>
        </Link>
      </section>
      <div className="ems-container">
      <h2 className="center">Employee Directory</h2>
        <EmployeeTable />
        </div>
        <div className="ems-clear"></div><br />
        <EmployeeFooter />
      </div>
  );
};

export default ListPage;
