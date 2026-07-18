import { useState } from 'react';
import { Link } from "react-router-dom";
import { useMutation } from '@apollo/client';
import { CREATE_EMPLOYEE_COMMUNITY } from '../graphql/mutations';
import { useForm } from 'react-hook-form';
import EmployeeHeader from "../components/EmployeeHeader";
import EmployeeNavigation from "../components/EmployeeNavigation";
import EmployeeFooter from "../components/EmployeeFooter";
import "../index.css";

const Community = () => {
  const [createEmployeeCommunity] = useMutation(CREATE_EMPLOYEE_COMMUNITY);

  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (formData) => {
    try {
      setSubmitting(true);
      await createEmployeeCommunity({ variables: { ...formData } });
      alert('Employee Community entry created successfully!');
      reset();
    } catch (err) {
      console.error('Error creating Employee Community:', err);
      alert(`Error creating Employee Community entry: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <EmployeeHeader />
      <EmployeeNavigation />
      <div className="ems-clear"></div>
      <div className="ems-container create-page">
        <div className="create-layout">
          <aside className="create-details">
            <section className="ems-home-hero">
              <p className="ems-kicker">Employee community</p>
              <h1>Add a community record.</h1>
              <p>
                Register employee-led clubs and team groups so participation is
                easy to review from the community data page.
              </p>
            </section>
            <section className="ems-info-section">
              <div>
                <h2>Before you submit</h2>
                <p>
                  Confirm the employee, department, club name, and member count
                  before saving the community entry.
                </p>
              </div>
              <ul>
                <li>Use the employee name exactly as it appears internally.</li>
                <li>Choose the department responsible for the community entry.</li>
                <li>Member count must stay between 4 and 20.</li>
              </ul>
            </section>
          </aside>
          <div className="ems-create">
            <div className="create-form-header">
              <h2>Community details</h2>
              <p>All fields are required.</p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="create-form-grid">
                <div className="form-group">
                  <label>Employee Name<span id="red">*</span></label>
                  <input
                    type="text"
                    placeholder="Example: Rahul Arora"
                    {...register('EmployeeName', {
                      required: 'Employee Name is required',
                      maxLength: { value: 32, message: 'Employee Name cannot exceed 32 characters' }
                    })}
                  />
                  {errors.EmployeeName && <p className="error-message">{errors.EmployeeName.message}</p>}
                </div>

                <div className="form-group">
                  <label>Department Name<span id="red">*</span></label>
                  <select
                    {...register('DepartmentName', { required: 'Department Name is required' })}
                  >
                    <option value="">Select Department</option>
                    <option value="IT">IT</option>
                    <option value="Security">Security</option>
                    <option value="Taxation and Accounts">Taxation and Accounts</option>
                    <option value="Safety">Safety</option>
                    <option value="Health">Health</option>
                  </select>
                  {errors.DepartmentName && <p className="error-message">{errors.DepartmentName.message}</p>}
                </div>

                <div className="form-group">
                  <label>Club Name<span id="red">*</span></label>
                  <input
                    type="text"
                    placeholder="Example: Wellness Club"
                    {...register('ClubName', {
                      required: 'Club Name is required',
                      maxLength: { value: 50, message: 'Club Name cannot exceed 50 characters' }
                    })}
                  />
                  {errors.ClubName && <p className="error-message">{errors.ClubName.message}</p>}
                </div>

                <div className="form-group">
                  <label>Number of Members<span id="red">*</span></label>
                  <input
                    type="number"
                    min="4"
                    max="20"
                    placeholder="4-20"
                    {...register('NumberOfMembers', {
                      required: 'Number of Members is required',
                      min: { value: 4, message: 'Number of Members must be at least 4' },
                      max: { value: 20, message: 'Number of Members cannot exceed 20' },
                      valueAsNumber: true
                    })}
                  />
                  {errors.NumberOfMembers && <p className="error-message">{errors.NumberOfMembers.message}</p>}
                </div>
              </div>
              <div className="form-group"><button type="submit" disabled={submitting}>Send</button></div>
            </form>
          </div>
        </div>
      </div>
      <p className="ems-section-note">
        <Link to="/community-data">View Community Data</Link>
      </p>
      <EmployeeFooter />
    </div>
  );
};

export default Community;
