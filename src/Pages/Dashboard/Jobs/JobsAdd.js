import React, { useState, useEffect } from 'react';
import {
  MDBBtn,
  MDBInput,
  MDBTextArea,
  MDBCheckbox,
  MDBSelect,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter
} from 'mdb-react-ui-kit';
import { addJob, getJobStatusMapping, getNewJobNumber, getJobTypes, getAllContractorsShort } from '../../../services/api';

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
  const [newJobNumber, setNewJobNumber] = useState('');
  const [jobStatusMapping, setJobStatusMapping] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [jobTypes, setJobTypes] = useState([]);
  const [contractorModalOpen, setContractorModalOpen] = useState(false);
  const [contractorsList, setContractorsList] = useState([]);
  const [contractorSearch, setContractorSearch] = useState('');
  const [contractorsLoading, setContractorsLoading] = useState(false);
  const [contractorsError, setContractorsError] = useState('');
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleStatusChange = (input) => {
    // Accept MDBSelect output (string | array | object) or native event
    let value = '';
    if (input == null) value = '';
    else if (typeof input === 'string') value = input;
    else if (input.target && input.target.value !== undefined) value = input.target.value;
    else if (Array.isArray(input) && input.length > 0) {
      const first = input[0];
      value = typeof first === 'string' ? first : first?.value ?? first?.label ?? '';
    } else if (typeof input === 'object') {
      value = input.value ?? input.label ?? '';
    }

    const matchedStatus = jobStatusMapping.find(s => s.job_status === value);
    setFormData(prev => ({
      ...prev,
      job_status: value,
      job_status_descrp: matchedStatus ? matchedStatus.job_status_descrp : ''
    }));
  };

  const handleJobTypeChange = (input) => {
    let value = '';
    if (input == null) value = '';
    else if (typeof input === 'string') value = input;
    else if (input.target && input.target.value !== undefined) value = input.target.value;
    else if (Array.isArray(input) && input.length > 0) {
      const first = input[0];
      value = typeof first === 'string' ? first : first?.value ?? first?.label ?? '';
    } else if (typeof input === 'object') {
      value = input.value ?? input.label ?? '';
    }

    setFormData(prev => ({
      ...prev,
      job_type: value
    }));
  };

  // ANCHOR Helper to format contractor label 
  const formatContractorLabel = (contractor) => {
    if (!contractor) return '';
    const first = contractor.first_name || contractor.firstName || '';
    const last = contractor.last_name || contractor.lastName || '';
    const license = contractor.license_num || contractor.licenseNumber || contractor.license || '';
    const licenseType = contractor.license_type || '';
    const licenseSlNo = contractor.license_sl_no || '';
    const licenseDescriptor = `${licenseType} ${licenseSlNo}`.trim();

    const nameParts = `${first} ${last}`.trim();
    // If we have a person name, prefer "First Last - license_type license_sl_no" (or basic license info)
    if (nameParts) {
      if (licenseDescriptor) return `${nameParts} - ${licenseDescriptor}`;
      if (license) return `${nameParts} ${license}`.trim();
      return nameParts;
    }

    // If no person name, prefer business / company name (optionally with license details)
    const company = contractor.business_name || contractor.company || contractor.name || '';
    if (company) {
      if (licenseDescriptor) return `${company} - ${licenseDescriptor}`;
      if (license) return `${company} ${license}`.trim();
      return company;
    }

    // If there is no name or company, show license_type with license_sl_no if available
    if (licenseDescriptor) return licenseDescriptor;

    // Final fallbacks
    return contractor.email || license || '';
  };

  // ANCHOR Helper to get contractor ID (_id)
  const getContractorId = (contractor) => {
    if (!contractor) return undefined;
    return contractor._id;
  };

  // ANCHOR Open Contractor Modal and fetch contractors if not already loaded
  const openContractorModal = async () => {
    setContractorModalOpen(true);
    if (contractorsList.length === 0 && !contractorsLoading) {
      setContractorsLoading(true);
      setContractorsError('');
      try {
        const data = await getAllContractorsShort();
        setContractorsList(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error('Failed to fetch contractors', e);
        setContractorsError('Failed to load contractors');
      } finally {
        setContractorsLoading(false);
      }
    }
  };


// ANCHOR Handle adding/removing contractor from form data
  const handleAddContractor = (contractor) => {
    const id = getContractorId(contractor);
    if (!id) return;
    setFormData(prev => {
      const exists = prev.contractors.includes(id);
      return {
        ...prev,
        contractors: exists
          ? prev.contractors.filter(c => c !== id)
          : [...prev.contractors, id]
      };
    });
  };

  // ANCHOR Handle form submission
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
    // ANCHOR Fetch job types on mount
    (async () => {
      try {
        const types = await getJobTypes();
        console.log('Job types fetched:', types);
        setJobTypes(types);
      } catch (e) {
        console.error('Failed to fetch job types', e);
      }
    })();
    // ANCHOR Fetch new job number on mount
    (async () => {
      try {
        const newJobNum = await getNewJobNumber();
        console.log('New job number fetched:', newJobNum.newJobNumber);
        setNewJobNumber(newJobNum.newJobNumber);
        setFormData(prev => ({ ...prev, job_number: newJobNum.newJobNumber }));
      } catch (e) {
        console.error('Failed to fetch new job number', e);
      }
    })();
    // ANCHOR Fetch job status mapping for dropdown (if needed)
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

// ANCHOR Filtered contractors based on search term
  const filteredContractors = contractorsList.filter(c => {
    if (!contractorSearch) return true;
    const term = contractorSearch.toLowerCase();
    const haystack = formatContractorLabel(c).toLowerCase();
    return haystack.includes(term);
  });

  // ANCHOR Human-readable labels for selected contractor IDs
  const selectedContractorLabels = formData.contractors.map(id => {
    const match = contractorsList.find(c => getContractorId(c) === id);
    return match ? formatContractorLabel(match) : id;
  });

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
              value={formData.job_number || newJobNumber}
              onChange={handleChange}
              required
              disabled
            />
          </div>

          {/*  ANCHOR Job Type */}
          <div className="col-md-6 mb-3">
            <div className="form-outline">
              <MDBSelect
                label="Job Type"
                data={[
                  { text: 'Select Job Type', value: '' },
                  ...jobTypes.map((jt) => ({
                    text: `${jt.job_type} - ${jt.label}`,
                    value: jt.job_type
                  }))
                ]}
                value={formData.job_type}
                onChange={handleJobTypeChange}
              />
            </div>
          </div>

          {/*  ANCHOR Prefiling Date */}
          <div className="col-md-6 mb-3">
            <MDBInput
              label="Prefiling Date"
              name="prefiling_date"
              type="date"
              value={formData.prefiling_date}
              onChange={handleChange}
            />
          </div>

          {/*  ANCHOR Latest Action Date */}
          <div className="col-md-6 mb-3">
            <MDBInput
              label="Latest Action Date"
              name="latest_action_date"
              type="date"
              value={formData.latest_action_date}
              onChange={handleChange}
            />
          </div>

          {/*  ANCHOR Job Status */}
          <div className="col-md-6 mb-3">
            <div className="form-outline">
              <MDBSelect
                label="Job Status"
                data={[
                  { text: 'Select Job Status', value: '' },
                  ...jobStatusMapping.map((status) => ({
                    text: `${status.job_status} - ${status.job_status_short}`,
                    value: status.job_status
                  }))
                ]}
                value={formData.job_status}
                onChange={handleStatusChange}
              />
            </div>
          </div>

          {/*  ANCHOR Job Status Description */}
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

          {/*  ANCHOR Application Number */}
          <div className="col-md-6 mb-3">
            <MDBInput
              label="Application Number"
              name="application_num"
              type="text"
              value={formData.application_num}
              onChange={handleChange}
            />
          </div>

          {/*  ANCHOR Application ID */}
          <div className="col-md-6 mb-3">
            <MDBInput
              label="Application ID"
              name="application_id"
              type="text"
              value={formData.application_id}
              onChange={handleChange}
            />
          </div>

          {/*  ANCHOR Property ID */}
          <div className="col-md-6 mb-3">
            <MDBInput
              label="Property ID"
              name="propertyID"
              type="text"
              value={formData.propertyID}
              onChange={handleChange}
            />
          </div>

          {/*  ANCHOR Property Property ID */}
          <div className="col-md-6 mb-3">
            <MDBInput
              label="Property Property ID"
              name="Property_proptertyID"
              type="text"
              value={formData.Property_proptertyID}
              onChange={handleChange}
            />
          </div>

          {/*  ANCHOR Job Description */}
          <div className="col-md-6 mb-3">
            <MDBTextArea
              label="Job Description"
              name="job_description"
              value={formData.job_description}
              onChange={handleChange}
              rows={3}
            />
          </div>

          {/*  ANCHOR Other Description */}
          <div className="col-md-6 mb-3">
            <MDBTextArea
              label="Other Description"
              name="other_description"
              value={formData.other_description}
              onChange={handleChange}
              rows={3}
            />
          </div>

          {/*  ANCHOR Professional Cert */}
          <div className="col-md-6 mb-3">
            <MDBInput
              label="Professional Cert"
              name="professional_cert"
              type="text"
              value={formData.professional_cert}
              onChange={handleChange}
            />
          </div>

          {/*  ANCHOR Contractors */}
          <div className="col-md-6 mb-3">
            <MDBInput
              label="Contractors"
              name="contractors"
              type="text"
              value={selectedContractorLabels.join(', ')}
              readOnly
              onClick={openContractorModal}
            />
            <div className="mt-2">
              <MDBBtn color="primary" size="sm" type="button" onClick={openContractorModal}>
                Search & Add Contractor
              </MDBBtn>
            </div>
          </div>

          {/*  ANCHOR Initial Cost */}
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

          {/*  ANCHOR Total Est Fee */}
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

          {/*  ANCHOR Approved Date */}
          <div className="col-md-6 mb-3">
            <MDBInput
              label="Approved Date"
              name="approved_date"
              type="date"
              value={formData.approved_date}
              onChange={handleChange}
            />
          </div>

          {/*  ANCHOR Paid */}
          <div className="col-md-6 mb-3">
            <MDBCheckbox
              name="paid"
              label="Paid"
              checked={formData.paid}
              onChange={handleChange}
            />
          </div>

          {/*  ANCHOR Fully Permitted */}
          <div className="col-md-6 mb-3">
            <MDBCheckbox
              name="fully_permitted"
              label="Fully Permitted"
              checked={formData.fully_permitted}
              onChange={handleChange}
            />
          </div>

          {/*  ANCHOR Approved */}
          <div className="col-md-6 mb-3">
            <MDBCheckbox
              name="approved"
              label="Approved"
              checked={formData.approved}
              onChange={handleChange}
            />
          </div>
        </div>

        {/*  ANCHOR Submit Button */}
        <div className="row">
          <div className="col-12">
            <MDBBtn color="success" type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Job'}
            </MDBBtn>
          </div>
        </div>
      </form>
      <MDBModal open={contractorModalOpen} setOpen={setContractorModalOpen} tabIndex='-1'>
        <MDBModalDialog size='lg' scrollable>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>Select Contractor</MDBModalTitle>
              <MDBBtn className='btn-close' color='none' onClick={() => setContractorModalOpen(false)}></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
              <MDBInput
                label="Search contractor"
                type="text"
                value={contractorSearch}
                onChange={(e) => setContractorSearch(e.target.value)}
              />
              {contractorsLoading && <p className="mt-3">Loading contractors...</p>}
              {contractorsError && <p className="mt-3 text-danger">{contractorsError}</p>}
              {!contractorsLoading && !contractorsError && (
                <div className="list-group mt-3" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                  {filteredContractors.map((c, idx) => {
                    const label = formatContractorLabel(c);
                    const cid = getContractorId(c);
                    const isSelected = cid ? formData.contractors.includes(cid) : false;
                    return (
                      <button
                        key={c._id || c.contractor_id || c.id || label || idx}
                        type="button"
                        className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center ${isSelected ? 'active' : ''}`}
                        onClick={() => handleAddContractor(c)}
                      >
                        <span>{label}</span>
                        {isSelected && <span className="badge bg-light text-dark">Selected</span>}
                      </button>
                    );
                  })}
                  {filteredContractors.length === 0 && (
                    <div className="text-muted small">No contractors found.</div>
                  )}
                </div>
              )}
            </MDBModalBody>
            <MDBModalFooter>
              <MDBBtn color="secondary" onClick={() => setContractorModalOpen(false)}>
                Close
              </MDBBtn>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </div>
  );
}