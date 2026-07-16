import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { CREATE_EMPLOYEE } from "../graphql/mutations";
import { GET_EMPLOYEES } from "../graphql/queries";
import "../index.css";

const EmployeeCreate = () => {
  const [formData, setFormData] = useState({
    FirstName: "",
    LastName: "",
    Age: "",
    DateOfJoining: "",
    Title: "",
    Department: "",
    EmployeeType: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [createEmployee, { loading, error }] = useMutation(CREATE_EMPLOYEE, {
    update(cache, { data: { createEmployee } }) {
      const { employees } = cache.readQuery({ query: GET_EMPLOYEES });
      cache.writeQuery({
        query: GET_EMPLOYEES,
        data: { employees: [...employees, createEmployee] },
      });
    },
    onCompleted: (data) => {
      console.log("Employee added:", data);
      setSuccessMessage("Employee added successfully!");
      setErrorMessage("");
      setFormData({
        FirstName: "",
        LastName: "",
        Age: "",
        DateOfJoining: "",
        Title: "",
        Department: "",
        EmployeeType: "",
      });
    },
    onError: (error) => {
      setErrorMessage("Failed to add employee. Please try again.");
    },
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  //validations
  const validateForm = () => {
    const { FirstName, LastName, Age, DateOfJoining, Title, Department, EmployeeType } = formData;
    if (!FirstName || !LastName || !Age || !DateOfJoining || !Title || !Department || !EmployeeType) {
      setErrorMessage("All fields are required.");
      return false;
    }
    if (Age < 20 || Age > 70) {
      setErrorMessage("Age must be between 20 and 70.");
      return false;
    }
    setErrorMessage("");
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      createEmployee({ variables: { ...formData, Age: parseInt(formData.Age) } });
    }
  };

  return (
    <div className="ems-create">
      <form onSubmit={handleSubmit}>
        {successMessage && <p className="success-message">{successMessage}</p>}
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {error && <p className="error-message">Error: {error.message}</p>}

        <div className="form-group">
          <label htmlFor="FirstName">First Name<span id="red">*</span> :</label>
          <input
            type="text"
            id="FirstName"
            name="FirstName"
            value={formData.FirstName}
            onChange={handleChange}
            placeholder="Employee First Name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="LastName">Last Name<span id="red">*</span> :</label>
          <input
            type="text"
            id="LastName"
            name="LastName"
            value={formData.LastName}
            onChange={handleChange}
            placeholder="Employee Last Name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="Age">Age<span id="red">*</span> :</label>
          <input
            type="number"
            id="Age"
            name="Age"
            value={formData.Age}
            onChange={handleChange}
            placeholder="Employee Age should be between (20-70)"
          />
        </div>

        <div className="form-group">
          <label htmlFor="DateOfJoining">Date of Joining<span id="red">*</span> :</label>
          <input
            type="date"
            id="DateOfJoining"
            name="DateOfJoining"
            value={formData.DateOfJoining}
            onChange={handleChange}
            placeholder="Select Date Of Joining"
          />
        </div>

        <div className="form-group">
          <label htmlFor="Title">Title<span id="red">*</span> :</label>
          <select
            id="Title"
            name="Title"
            value={formData.Title}
            onChange={handleChange}
          >
            <option value="">Select Title</option>
            <option value="Employee">Employee</option>
            <option value="Manager">Manager</option>
            <option value="Director">Director</option>
            <option value="VP">VP</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="Department">Department<span id="red">*</span> :</label>
          <select
            id="Department"
            name="Department"
            value={formData.Department}
            onChange={handleChange}
          >
            <option value="">Select Department</option>
            <option value="IT">IT</option>
            <option value="Marketing">Marketing</option>
            <option value="HR">HR</option>
            <option value="Engineering">Engineering</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="EmployeeType">Employee Type<span id="red">*</span> :</label>
          <select
            id="EmployeeType"
            name="EmployeeType"
            value={formData.EmployeeType}
            onChange={handleChange}
          >
            <option value="">Select Employee Type</option>
            <option value="FullTime">Full-Time</option>
            <option value="PartTime">Part-Time</option>
            <option value="Contract">Contract</option>
            <option value="Seasonal">Seasonal</option>
          </select>
        </div>

        <div className="form-group">
          <button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeCreate;
