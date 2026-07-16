import React from "react";
import EmployeeHeader from "../components/EmployeeHeader";
import EmployeeNavigation from "../components/EmployeeNavigation";
import EmployeeCreate from "../components/EmployeeCreate";
import EmployeeFooter from "../components/EmployeeFooter";

const Create = () => {
  return (
    <div>
      <EmployeeHeader />
      <EmployeeNavigation />
      <div className="ems-clear"></div>
        <div className="ems-container">
        <h2 className="center">Create New Employee</h2>
        <EmployeeCreate />
        </div>
        <div className="ems-clear"></div>
        <EmployeeFooter />
    </div>
  );
};

export default Create;
