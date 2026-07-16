// src/components/RegistrationForm.jsx
import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';

// Define the GraphQL mutation
const REGISTER_MUTATION = gql`
  mutation Register($name: String!, $email: String!, $activity: String!) {
    register(name: $name, email: $email, activity: $activity) {
      name
      email
      activity
    }
  }
`;

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    activity: '',
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submissionError, setSubmissionError] = useState(null);

  const [register, { loading, error }] = useMutation(REGISTER_MUTATION);

  const activities = [
    'Yoga Session',
    'Beach Volleyball',
    'Community Service',
    'Team Building Retreat',
    'Health and Wellness Workshop',
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validate = () => {
    const errors = {};
    if (!formData.name) errors.name = 'Name is required';
    if (!formData.email) errors.email = 'Email is required';
    if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Email is invalid';
    if (!formData.activity) errors.activity = 'Activity selection is required';
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      setErrors({});
      setSubmitted(false);
      setSubmissionError(null);

      try {
        await register({ variables: formData });
        setSubmitted(true);
      } catch (error) {
        setSubmissionError(error.message || 'Failed to submit the form');
      }
    }
  };

  return (
    <div>
        <br /><br /><hr />
      <h3>Register for an Activity</h3>
      {submitted ? (
        <p className="success-message">Thank you for registering! We will get in touch with you soon.</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name <span id="red">*</span> :</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name && <p className="error">{errors.name}</p>}
          </div>

          <div className="form-group">
            <label>Email <span id="red">*</span> :</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <p className="error">{errors.email}</p>}
          </div>

          <div className="form-group">
            <label>Activity <span id="red">*</span> :</label>
            <select
              name="activity"
              value={formData.activity}
              onChange={handleChange}
            >
              <option value="">Select an activity</option>
              {activities.map((activity, index) => (
                <option key={index} value={activity}>
                  {activity}
                </option>
              ))}
            </select>
            {errors.activity && <p className="error">{errors.activity}</p>}
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Submitting...' : 'Register'}
          </button>
        </form>
      )}
      {submissionError && <p className="error">{submissionError}</p>}
      {/* Display additional GraphQL errors */}
      {error && <p className="error">{error.message}</p>}<br />
      <hr />
    </div>
  );
};

export default RegistrationForm;
