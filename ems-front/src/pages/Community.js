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
      <div className="ems-clear"></div><br />
      <h2 className="center">Employee Community</h2>
      <section className="ems-info-section">
        <div>
          <h2>Support employee connection</h2>
          <p>
            Track workplace clubs and internal communities so teams can see
            where employees are involved beyond their day-to-day department work.
          </p>
        </div>
        <ul>
          <li>Register employee-led clubs and groups.</li>
          <li>Keep department participation visible.</li>
          <li>Monitor group size for planning and coordination.</li>
        </ul>
      </section>
      <div className="ems-container ems-create">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label>Employee Name:</label><span id="red">*</span>
            <input 
              type="text"
              {...register('EmployeeName', {
                required: 'Employee Name is required',
                maxLength: { value: 32, message: 'Employee Name cannot exceed 32 characters' }
              })}
            />
            {errors.EmployeeName && <p className="error-message">{errors.EmployeeName.message}</p>}
          </div>

          <div className="form-group">
            <label>Department Name:</label><span id="red">*</span>
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
            <label>Club Name:</label><span id="red">*</span>
            <input 
              type="text"
              {...register('ClubName', {
                required: 'Club Name is required',
                maxLength: { value: 50, message: 'Club Name cannot exceed 50 characters' }
              })}
            />
            {errors.ClubName && <p className="error-message">{errors.ClubName.message}</p>}
          </div>

          <div className="form-group">
            <label>Number of Members:</label><span id="red">*</span>
            <input 
              type="number"
              {...register('NumberOfMembers', {
                required: 'Number of Members is required',
                min: { value: 4, message: 'Number of Members must be at least 4' },
                max: { value: 20, message: 'Number of Members cannot exceed 20' },
                valueAsNumber: true
              })}
            />
            {errors.NumberOfMembers && <p className="error-message">{errors.NumberOfMembers.message}</p>}
          </div>

          <div className="form-group"><button type="submit" disabled={submitting}>Send</button></div>
        </form>
      </div>
      <p className="ems-section-note">
        <Link to="/community-data">View Community Data</Link>
      </p>
      <EmployeeFooter />
    </div>
  );
};

export default Community;
