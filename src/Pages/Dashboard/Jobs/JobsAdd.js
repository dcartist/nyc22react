import React, { useState, useEffect } from 'react';
import { MDBBtn, MDBInput, MDBTextArea, MDBCheckbox, MDBSelect } from 'mdb-react-ui-kit';
import { addJob, getJobStatusMapping } from '../../../services/api';

export default function JobsAdd() {
  const [formData, setFormData] = useState({
    job_number: '',
    prefiling_date: '',
    paid: false,
    latest_action_date: '',
    fully_permitted: false,
    job_description: '',
    job_status: '',
    job_type: '',
    other_description: '',
    propertyID: '',
    application_num: '',
    application_id: '',
    contractors: [],
    Property_proptertyID: '',
    approved_date: '',
    approved: false,
    initial_cost: '',
    total_est__fee: '',
    professional_cert: '',
    job_status_descrp: ''
  });

  const [loading, setLoading] = useState(false);
  const [jobStatusMapping, setJobStatusMapping] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleStatusChange = (e) => {
    const value = e.target.value;
    const matchedStatus = jobStatusMapping.find(s => s.job_status === value);
    setFormData(prev => ({
      ...prev,
      job_status: value,
      job_status_descrp: matchedStatus ? matchedStatus.job_status_descrp : ''
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await addJob(formData);
      setSuccess('Job created successfully!');
      // Reset form
      setFormData({
        job_number: '',
        prefiling_date: '',
        paid: false,
        latest_action_date: '',
        fully_permitted: false,
        job_description: '',
        job_status: '',
        job_type: '',
        other_description: '',
        propertyID: '',
        application_num: '',
        application_id: '',
        contractors: [],
        Property_proptertyID: '',
        approved_date: '',
        approved: false,
        initial_cost: '',
        total_est__fee: '',
        professional_cert: '',
        job_status_descrp: ''
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create job');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch job status mapping for dropdown (if needed)
    (async () => {
      try {
        const jobmapping = await getJobStatusMapping(); // Adjust if there's a specific endpoint
        console.log('Job status mapping loaded:', jobmapping);
        setJobStatusMapping(jobmapping);
      } catch (e) {
        console.error('Failed to fetch job status mapping', e);
      }
    })();
  }, []);

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Add New Job</h2>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={handleSubmit}>
        <div className="row">
          {/* Job Number - Required */}
          <div className="col-md-6 mb-3">
            <MDBInput
              label="Job Number *"
              name="job_number"
              type="text"
              value={formData.job_number}
              onChange={handleChange}
              required
            />
          </div>

          {/* Job Type */}
          <div className="col-md-6 mb-3">
            <MDBInput
              label="Job Type"
              name="job_type"
              type="text"
              value={formData.job_type}
              onChange={handleChange}
            />
          </div>

          {/* Prefiling Date */}
          <div className="col-md-6 mb-3">
            <MDBInput
              label="Prefiling Date"
              name="prefiling_date"
              type="date"
              value={formData.prefiling_date}
              onChange={handleChange}
            />
          </div>

          {/* Latest Action Date */}
          <div className="col-md-6 mb-3">
            <MDBInput
              label="Latest Action Date"
              name="latest_action_date"
              type="date"
              value={formData.latest_action_date}
              onChange={handleChange}
            />
          </div>

          {/* Job Status */}
          <div className="col-md-6 mb-3">
            <label className="form-label">Job Status</label>
            <select
              className="form-select"
              name="job_status"
              value={formData.job_status}
              onChange={handleStatusChange}
            >
              <option value="">Select Job Status</option>
              {jobStatusMapping.map((status) => (
                <option key={status.job_status} value={status.job_status}>
                  {status.job_status} - {status.job_status_short}
                </option>
              ))}
            </select>
          </div>

          {/* Job Status Description */}
          <div className="col-md-6 mb-3">
            <MDBInput
              label="Job Status Description"
              name="job_status_descrp"
              type="text"
              value={formData.job_status_descrp}
              onChange={handleChange}
              disabled
            />
          </div>

          {/* Application Number */}
          <div className="col-md-6 mb-3">
            <MDBInput
              label="Application Number"
              name="application_num"
              type="text"
              value={formData.application_num}
              onChange={handleChange}
            />
          </div>

          {/* Application ID */}
          <div className="col-md-6 mb-3">
            <MDBInput
              label="Application ID"
              name="application_id"
              type="text"
              value={formData.application_id}
              onChange={handleChange}
            />
          </div>

          {/* Property ID */}
          <div className="col-md-6 mb-3">
            <MDBInput
              label="Property ID"
              name="propertyID"
              type="text"
              value={formData.propertyID}
              onChange={handleChange}
            />
          </div>

          {/* Property Property ID */}
          <div className="col-md-6 mb-3">
            <MDBInput
              label="Property Property ID"
              name="Property_proptertyID"
              type="text"
              value={formData.Property_proptertyID}
              onChange={handleChange}
            />
          </div>

          {/* Job Description */}
          <div className="col-md-6 mb-3">
            <MDBTextArea
              label="Job Description"
              name="job_description"
              value={formData.job_description}
              onChange={handleChange}
              rows={3}
            />
          </div>

          {/* Other Description */}
          <div className="col-md-6 mb-3">
            <MDBTextArea
              label="Other Description"
              name="other_description"
              value={formData.other_description}
              onChange={handleChange}
              rows={3}
            />
          </div>

          {/* Professional Cert */}
          <div className="col-md-6 mb-3">
            <MDBInput
              label="Professional Cert"
              name="professional_cert"
              type="text"
              value={formData.professional_cert}
              onChange={handleChange}
            />
          </div>

          {/* Contractors */}
          <div className="col-md-6 mb-3">
            <MDBInput
              label="Contractors (comma-separated)"
              name="contractors"
              type="text"
              value={formData.contractors.join(',')}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                contractors: e.target.value.split(',').filter(c => c.trim())
              }))}
            />
          </div>

          {/* Initial Cost */}
          <div className="col-md-6 mb-3">
            <MDBInput
              label="Initial Cost"
              name="initial_cost"
              type="number"
              step="0.01"
              value={formData.initial_cost}
              onChange={handleChange}
            />
          </div>

          {/* Total Est Fee */}
          <div className="col-md-6 mb-3">
            <MDBInput
              label="Total Estimated Fee"
              name="total_est__fee"
              type="number"
              step="0.01"
              value={formData.total_est__fee}
              onChange={handleChange}
            />
          </div>

          {/* Approved Date */}
          <div className="col-md-6 mb-3">
            <MDBInput
              label="Approved Date"
              name="approved_date"
              type="date"
              value={formData.approved_date}
              onChange={handleChange}
            />
          </div>

          {/* Paid */}
          <div className="col-md-6 mb-3">
            <MDBCheckbox
              name="paid"
              label="Paid"
              checked={formData.paid}
              onChange={handleChange}
            />
          </div>

          {/* Fully Permitted */}
          <div className="col-md-6 mb-3">
            <MDBCheckbox
              name="fully_permitted"
              label="Fully Permitted"
              checked={formData.fully_permitted}
              onChange={handleChange}
            />
          </div>

          {/* Approved */}
          <div className="col-md-6 mb-3">
            <MDBCheckbox
              name="approved"
              label="Approved"
              checked={formData.approved}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="row">
          <div className="col-12">
            <MDBBtn color="success" type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Job'}
            </MDBBtn>
          </div>
        </div>
      </form>
    </div>
  );
}