import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { REGISTER_ACTIVITY } from "../graphql/mutations";
import { GET_EMPLOYEES } from "../graphql/queries";

const activities = [
  "Yoga Session",
  "Beach Volleyball",
  "Community Service",
  "Team Building Retreat",
  "Health and Wellness Workshop",
];

const RegistrationForm = () => {
  const [formData, setFormData] = useState({ EmployeeId: "", activity: "" });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submissionError, setSubmissionError] = useState("");
  const { data, loading: employeesLoading, error: employeesError } = useQuery(GET_EMPLOYEES);
  const [registerActivity, { loading }] = useMutation(REGISTER_ACTIVITY);
  const employees = (data?.employees || []).filter(({ CurrentStatus }) => CurrentStatus);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = {
      ...(!formData.EmployeeId && { EmployeeId: "Employee selection is required" }),
      ...(!formData.activity && { activity: "Activity selection is required" }),
    };
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length) return;

    setSubmissionError("");
    try {
      await registerActivity({ variables: formData });
      setSubmitted(true);
      setFormData({ EmployeeId: "", activity: "" });
    } catch (error) {
      setSubmissionError(error.message);
    }
  };

  return (
    <section className="activity-registration">
      <h3>Register for an Activity</h3>
      <p>Select an active employee record so registration details stay connected to the directory.</p>
      {submitted && <p className="success-message" role="status">Activity registration completed.</p>}
      <form className="activity-registration-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="registration-employee">Employee <span className="required-mark" aria-hidden="true">*</span></label>
          <select
            id="registration-employee"
            value={formData.EmployeeId}
            onChange={(event) => setFormData({ ...formData, EmployeeId: event.target.value })}
            disabled={employeesLoading}
            required
            aria-invalid={Boolean(errors.EmployeeId)}
            aria-describedby={errors.EmployeeId ? "registration-employee-error" : undefined}
          >
            <option value="">{employeesLoading ? "Loading employees..." : "Select an employee"}</option>
            {employees.map((employee) => (
              <option key={employee.id} value={employee.id}>
                {employee.FirstName} {employee.LastName} - {employee.Department}
              </option>
            ))}
          </select>
          {errors.EmployeeId && <p id="registration-employee-error" className="field-error" role="alert">{errors.EmployeeId}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="registration-activity">Activity <span className="required-mark" aria-hidden="true">*</span></label>
          <select
            id="registration-activity"
            value={formData.activity}
            onChange={(event) => setFormData({ ...formData, activity: event.target.value })}
            required
            aria-invalid={Boolean(errors.activity)}
            aria-describedby={errors.activity ? "registration-activity-error" : undefined}
          >
            <option value="">Select an activity</option>
            {activities.map((activity) => <option key={activity} value={activity}>{activity}</option>)}
          </select>
          {errors.activity && <p id="registration-activity-error" className="field-error" role="alert">{errors.activity}</p>}
        </div>
        <button type="submit" className="ems-button" disabled={loading || employeesLoading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
      {employeesError && <p className="field-error" role="alert">Unable to load active employees.</p>}
      {submissionError && <p className="field-error" role="alert">{submissionError}</p>}
    </section>
  );
};

export default RegistrationForm;
