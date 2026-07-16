import React from "react";
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
      <div className="ems-container">
      <h2 className="center">Employee List</h2>
        <EmployeeTable />
        </div>
        <div className="ems-clear"></div><br />
        <EmployeeFooter />
      </div>
  );
};

export default ListPage;
