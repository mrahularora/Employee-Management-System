import { useState } from 'react';
import { Link, useSearchParams } from "react-router-dom";
import { useMutation, useQuery } from '@apollo/client';
import { CREATE_EMPLOYEE_COMMUNITY } from '../graphql/mutations';
import { GET_EMPLOYEES, GET_EMPLOYEE_COMMUNITIES, GET_METRICS } from '../graphql/queries';
import { useForm } from 'react-hook-form';
import EmployeeHeader from "../components/EmployeeHeader";
import EmployeeNavigation from "../components/EmployeeNavigation";
import EmployeeFooter from "../components/EmployeeFooter";
import "../index.css";

const Community = () => {
  const [searchParams] = useSearchParams();
  const { data, loading: employeesLoading, error: employeesError } = useQuery(GET_EMPLOYEES);
  const employees = data?.employees || [];
  const [createEmployeeCommunity] = useMutation(CREATE_EMPLOYEE_COMMUNITY, {
    refetchQueries: [GET_EMPLOYEE_COMMUNITIES, GET_METRICS],
  });
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm({
    defaultValues: { EmployeeId: searchParams.get("employee") || "" },
  });
  const [submitting, setSubmitting] = useState(false);
  const selectedEmployee = employees.find(({ id }) => id === watch("EmployeeId"));

  const onSubmit = async (formData) => {
    try {
      setSubmitting(true);
      await createEmployeeCommunity({ variables: formData });
      alert('Employee Community entry created successfully!');
      reset({ EmployeeId: "", ClubName: "", NumberOfMembers: "" });
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
                connected to verified employee directory records.
              </p>
            </section>
            <section className="ems-info-section">
              <div>
                <h2>Before you submit</h2>
                <p>
                  Choose a directory employee, then confirm the club name and
                  member count before saving.
                </p>
              </div>
              <ul>
                <li>Employees must be added to the directory first.</li>
                <li>The employee name and department are synchronized automatically.</li>
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
                  <label htmlFor="EmployeeId">Directory Employee<span id="red">*</span></label>
                  <select
                    id="EmployeeId"
                    disabled={employeesLoading || Boolean(employeesError)}
                    {...register('EmployeeId', { required: 'Select an employee from the directory' })}
                  >
                    <option value="">
                      {employeesLoading ? "Loading employees..." : "Select Employee"}
                    </option>
                    {employees.map(({ id, FirstName, LastName, Department }) => (
                      <option key={id} value={id}>
                        {FirstName} {LastName} - {Department}
                      </option>
                    ))}
                  </select>
                  {errors.EmployeeId && <p className="error-message">{errors.EmployeeId.message}</p>}
                  {employeesError && <p className="error-message">Employee directory is unavailable.</p>}
                </div>

                <div className="form-group">
                  <label htmlFor="CommunityDepartment">Department</label>
                  <input
                    id="CommunityDepartment"
                    type="text"
                    value={selectedEmployee?.Department || ""}
                    placeholder="Assigned from employee directory"
                    readOnly
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="ClubName">Club Name<span id="red">*</span></label>
                  <input
                    id="ClubName"
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
                  <label htmlFor="NumberOfMembers">Number of Members<span id="red">*</span></label>
                  <input
                    id="NumberOfMembers"
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
              <p className="form-help">
                Employee not listed? <Link to="/create">Add them to the directory first.</Link>
              </p>
              <div className="form-group">
                <button type="submit" disabled={submitting || employeesLoading || !employees.length}>
                  {submitting ? "Saving..." : "Create Community Record"}
                </button>
              </div>
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
