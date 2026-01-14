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
import Mapgl from '../../../Components/Map_gl';
import { addJob, getJobStatusMapping, getNewJobNumber, getJobTypes, getAllContractorsShort, getAllApplications, searchProperties } from '../../../services/api';

export default function JobsAdd() {
  const [formData, setFormData] = useState({
    job_number: '',
    prefiling_date: '',
    paid: '',
    latest_action_date: '',
    fully_permitted: '',
    job_description: '',
    job_status: '',
    job_type: '',
    other_description: '',
    propertyID: '',
    application_num: '',
    application_id: '',
    applicant_firstName: '',
    applicant_lastName: '',
    applicant_title: '',
    applicant_license: '',
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
  const [applicantModalOpen, setApplicantModalOpen] = useState(false);
  const [applicantsList, setApplicantsList] = useState([]);
  const [applicantSearch, setApplicantSearch] = useState('');
  const [applicantsLoading, setApplicantsLoading] = useState(false);
  const [applicantsError, setApplicantsError] = useState('');
  const [propertyModalOpen, setPropertyModalOpen] = useState(false);
  const [propertySearch, setPropertySearch] = useState('');
  const [propertiesList, setPropertiesList] = useState([]);
  const [propertiesLoading, setPropertiesLoading] = useState(false);
  const [propertiesError, setPropertiesError] = useState('');
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

  // ANCHOR Helper to format applicant label for listing
  const formatApplicantLabel = (app) => {
    if (!app) return '';
    const first = app.applicant_first_name || app.applicant_firstName || app.first_name || app.firstName || '';
    const last = app.applicant_last_name || app.applicant_lastName || app.last_name || app.lastName || '';
    const fullName = `${first} ${last}`.trim();

    const title = app.title || app.job_title || app.business_title || '';
    const license = app.applicant_license || app.license || app.license_num || '';

    const namePart = fullName || app.applicant_name || app.name || '';

    // Build label as: "First Last - applicant_license - title" (skipping missing pieces)
    const parts = [namePart, license, title].filter(Boolean);
    return parts.join(' - ');
  };

  // ANCHOR Helper to format property label for listing
  const formatPropertyLabel = (prop) => {
    if (!prop) return '';

    const house = prop.house_num || prop.house_number || prop.house || '';
    const street = prop.street_name || prop.street || prop.primary_street || '';
    const borough = prop.borough || prop.city || '';
    const bbl = prop.bbl || '';

    const address = `${house} ${street}`.trim();
    const parts = [address, borough, bbl].filter(Boolean);

    if (parts.length > 0) return parts.join(' - ');

    const id = prop.propertyID || prop.property_id || prop._id;
    return id || '';
  };

  // ANCHOR Helper to derive property owner name
  const getPropertyOwnerName = (prop) => {
    if (!prop) return '';

    const owner1First =
      prop.property_owner_firstName ||
      prop.property_owner_first_name ||
      prop.owner1_first_name ||
      prop.owner1_firstName ||
      '';
    const owner1Last =
      prop.property_owner_lastName ||
      prop.property_owner_last_name ||
      prop.owner1_last_name ||
      prop.owner1_lastName ||
      '';
    const owner1Full = `${owner1First} ${owner1Last}`.trim();

    const owner2First = prop.owner2_first_name || prop.owner2_firstName || '';
    const owner2Last = prop.owner2_last_name || prop.owner2_lastName || '';
    const owner2Full = `${owner2First} ${owner2Last}`.trim();

    const businessOwner =
      prop.property_owner_business_name ||
      prop.property_owner_businessName ||
      '';

    const explicitOwner =
      prop.owner_name ||
      prop.ownerName ||
      prop.property_owner ||
      prop.owner_full_name ||
      prop.owner ||
      prop.owner1_name ||
      '';

    if (businessOwner) return businessOwner;
    if (explicitOwner) return explicitOwner;
    if (owner1Full && owner2Full) return `${owner1Full} & ${owner2Full}`;
    if (owner1Full) return owner1Full;
    if (owner2Full) return owner2Full;

    return '';
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

  // ANCHOR Open Applicant Modal and fetch applicants if not already loaded
  const openApplicantModal = async () => {
    setApplicantModalOpen(true);
    if (applicantsList.length === 0 && !applicantsLoading) {
      setApplicantsLoading(true);
      setApplicantsError('');
      try {
        const data = await getAllApplications();
        setApplicantsList(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error('Failed to fetch applicants', e);
        setApplicantsError('Failed to load applicants');
      } finally {
        setApplicantsLoading(false);
      }
    }
  };

  // ANCHOR Open Property Modal
  const openPropertyModal = () => {
    setPropertyModalOpen(true);
  };

  // ANCHOR Search properties whenever the search input changes
  const handlePropertySearchChange = async (e) => {
    const term = e.target.value;
    setPropertySearch(term);

    const trimmed = term.trim();
    if (!trimmed) {
      setPropertiesList([]);
      setPropertiesError('');
      setPropertiesLoading(false);
      return;
    }

    setPropertiesLoading(true);
    setPropertiesError('');
    try {
      const data = await searchProperties(trimmed);
      setPropertiesList(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error('Failed to search properties', e);
      setPropertiesError('Failed to search properties');
    } finally {
      setPropertiesLoading(false);
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

  // ANCHOR Handle selecting an applicant: fill Application Number and ID
  const handleSelectApplicant = (applicant) => {
    if (!applicant) return;

    // Some APIs may wrap applicant data under an `application` key
    const core = applicant.application || applicant;

    setFormData(prev => ({
      ...prev,
      // Send applicant_license back as application_num (appNum)
      application_num:
        core.applicant_license || core.license || core.license_num ||
        core.application_num || core.application_number || prev.application_num,
      application_id:
        core.application_id || core._id || applicant.application_id || applicant._id || prev.application_id,
      applicant_firstName:
        core.applicant_firstName || core.applicant_first_name || core.first_name || core.firstName ||
        prev.applicant_firstName,
      applicant_lastName:
        core.applicant_lastName || core.applicant_last_name || core.last_name || core.lastName ||
        prev.applicant_lastName,
      applicant_title:
        core.applicant_title || core.title || prev.applicant_title,
      applicant_license:
        core.applicant_license || core.license || core.license_num || prev.applicant_license
    }));
    setApplicantModalOpen(false);
  };

  // ANCHOR Handle selecting a property: fill Property ID fields
  const handleSelectProperty = (prop) => {
    if (!prop) return;
    setFormData(prev => ({
      ...prev,
      // Prefer Mongo _id so it matches backend ObjectId validation
      propertyID: prop._id || prop.propertyID || prop.property_id || prev.propertyID,
      Property_proptertyID: prop.Property_proptertyID || prop.property_proptertyID || prev.Property_proptertyID
    }));
    setPropertyModalOpen(false);
  };

  // ANCHOR Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const normalizeDate = (value) => (value === '' || value == null ? undefined : value);

      const payload = {
        ...formData,
        // Ensure numeric fields are numbers when provided
        initial_cost: formData.initial_cost !== '' ? Number(formData.initial_cost) : undefined,
        total_est__fee: formData.total_est__fee !== '' ? Number(formData.total_est__fee) : undefined,
        // Let Mongoose apply default null for empty dates
        prefiling_date: normalizeDate(formData.prefiling_date),
        paid: normalizeDate(formData.paid),
        latest_action_date: normalizeDate(formData.latest_action_date),
        fully_permitted: normalizeDate(formData.fully_permitted),
        approved_date: normalizeDate(formData.approved_date),
      };

      const response = await addJob(payload);
      setSuccess('Job created successfully!');
      // Reset form
      setFormData({
        job_number: '',
        prefiling_date: '',
        paid: '',
        latest_action_date: '',
        fully_permitted: '',
        job_description: '',
        job_status: '',
        job_type: '',
        other_description: '',
        propertyID: '',
        application_num: '',
        application_id: '',
        applicant_firstName: '',
        applicant_lastName: '',
        applicant_title: '',
        applicant_license: '',
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
      // Handle both fetch Response objects and generic Errors
      try {
        if (err && typeof err.json === 'function') {
          const data = await err.json();
          setError(data?.error || 'Failed to create job');
        } else if (err && err.response) {
          setError(err.response.data?.error || 'Failed to create job');
        } else {
          setError(err?.message || 'Failed to create job');
        }
      } catch (parseError) {
        setError('Failed to create job');
      }
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

  // ANCHOR Filtered applicants based on search term
  const filteredApplicants = applicantsList.filter(a => {
    if (!applicantSearch) return true;
    const term = applicantSearch.toLowerCase();
    const haystack = formatApplicantLabel(a).toLowerCase();
    return haystack.includes(term);
  });

  // ANCHOR Selected property based on Property ID
  const selectedProperty = propertiesList.find(p => {
    const id = p.propertyID || p.property_id || p._id;
    return id && id === formData.propertyID;
  });

  const propertyDisplay = selectedProperty
    ? formatPropertyLabel(selectedProperty)
    : formData.propertyID;

  // ANCHOR Derived address and owner name for display and map
  const propertyHouse = selectedProperty
    ? (selectedProperty.house_num || selectedProperty.house_number || selectedProperty.house || '')
    : '';
  const propertyStreet = selectedProperty
    ? (selectedProperty.street_name || selectedProperty.street || selectedProperty.primary_street || '')
    : '';
  const propertyBorough = selectedProperty
    ? (selectedProperty.borough || selectedProperty.city || '')
    : '';

  const propertyAddressLine = `${propertyHouse} ${propertyStreet}`.trim();
  const propertyOwnerName = selectedProperty ? getPropertyOwnerName(selectedProperty) : '';

  const propertyMapLocation = selectedProperty
    ? [propertyAddressLine, propertyBorough, 'NY']
        .filter(Boolean)
        .join(', ')
    : propertyDisplay;

  // ANCHOR Selected applicant based on Application ID or Number
  const selectedApplicant = applicantsList.find(a => {
    const appId = a.application_id || a._id;
    const appNum = a.application_num || a.application_number;
    return (appId && appId === formData.application_id) ||
           (appNum && appNum === formData.application_num);
  });

  // ANCHOR Derived display values for Application Number (name) and ID (license)
  const applicantFirst = selectedApplicant
    ? (selectedApplicant.applicant_first_name || selectedApplicant.applicant_firstName || selectedApplicant.first_name || selectedApplicant.firstName || '')
    : '';
  const applicantLast = selectedApplicant
    ? (selectedApplicant.applicant_last_name || selectedApplicant.applicant_lastName || selectedApplicant.last_name || selectedApplicant.lastName || '')
    : '';
  const applicantFullName = `${applicantFirst} ${applicantLast}`.trim() ||
    (selectedApplicant?.applicant_name || selectedApplicant?.name || '');

  const applicationNumberDisplay = selectedApplicant
    ? (applicantFullName || formData.application_num)
    : formData.application_num;

  const applicationIdDisplay = selectedApplicant
    ? (selectedApplicant.applicant_license || selectedApplicant.license || selectedApplicant.license_num || formData.application_id)
    : formData.application_id;

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
              value={applicationNumberDisplay}
              onChange={handleChange}
              readOnly
              onClick={openApplicantModal}
            />
            <div className="mt-2">
              <MDBBtn color="primary" size="sm" type="button" onClick={openApplicantModal}>
                Search & Select Applicant
              </MDBBtn>
            </div>
          </div>

          {/*  ANCHOR Application ID */}
          <div className="col-md-6 mb-3">
            <MDBInput
              label="Application ID"
              name="application_id"
              type="text"
              value={applicationIdDisplay}
              onChange={handleChange}
              readOnly
              onClick={openApplicantModal}
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

          {/*  ANCHOR Paid Date */}
          <div className="col-md-6 mb-3">
            <MDBInput
              label="Paid Date"
              name="paid"
              type="date"
              value={formData.paid}
              onChange={handleChange}
            />
          </div>

          {/*  ANCHOR Fully Permitted Date */}
          <div className="col-md-6 mb-3">
            <MDBInput
              label="Fully Permitted Date"
              name="fully_permitted"
              type="date"
              value={formData.fully_permitted}
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

          {/*  ANCHOR Property Address */}
          <div className="col-md-6 mb-3">
            <MDBInput
              label="Property Address"
              name="propertyID"
              type="text"
              value={propertyDisplay}
              onChange={handleChange}
              readOnly
              onClick={openPropertyModal}
            />
            <div className="mt-2">
              <MDBBtn color="primary" size="sm" type="button" onClick={openPropertyModal}>
                Search & Select Property
              </MDBBtn>
            </div>
          </div>

          {/*  ANCHOR Property Owner Name (derived from property record) */}
          <div className="col-md-6 mb-3">
            <MDBInput
              label="Property Owner Name"
              name="property_owner_name"
              type="text"
              value={propertyOwnerName}
              readOnly
            />
          </div>

          {/*  ANCHOR Property Details & Map */}
          {selectedProperty && (
            <div className="col-12 mb-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title mb-3">Property Details</h5>
                  {propertyAddressLine && (
                    <p className="mb-1">
                      <strong>Address:</strong> {propertyAddressLine}
                      {propertyBorough && `, ${propertyBorough}, NY`}
                    </p>
                  )}
                  {propertyOwnerName && (
                    <p className="mb-3">
                      <strong>Owner:</strong> {propertyOwnerName}
                    </p>
                  )}
                  <Mapgl newLocation={propertyMapLocation} />
                </div>
              </div>
            </div>
          )}

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
      {/* Property selection modal */}
      <MDBModal open={propertyModalOpen} setOpen={setPropertyModalOpen} tabIndex='-1'>
        <MDBModalDialog size='lg' scrollable>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>Select Property</MDBModalTitle>
              <MDBBtn className='btn-close' color='none' onClick={() => setPropertyModalOpen(false)}></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
              <MDBInput
                label="Search property"
                type="text"
                value={propertySearch}
                onChange={handlePropertySearchChange}
              />
              {propertiesLoading && <p className="mt-3">Searching properties...</p>}
              {propertiesError && <p className="mt-3 text-danger">{propertiesError}</p>}
              {!propertiesLoading && !propertiesError && propertiesList.length > 0 && (
                <div className="list-group mt-3" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                  {propertiesList.map((p, idx) => {
                    const label = formatPropertyLabel(p);
                    return (
                      <button
                        key={p.propertyID || p.property_id || p._id || idx}
                        type="button"
                        className="list-group-item list-group-item-action"
                        onClick={() => handleSelectProperty(p)}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              )}
              {!propertiesLoading && !propertiesError && propertiesList.length === 0 && propertySearch.trim() && (
                <div className="mt-3 text-muted small">No properties found.</div>
              )}
            </MDBModalBody>
            <MDBModalFooter>
              <MDBBtn color="secondary" onClick={() => setPropertyModalOpen(false)}>
                Close
              </MDBBtn>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
      {/* Applicant selection modal */}
      <MDBModal open={applicantModalOpen} setOpen={setApplicantModalOpen} tabIndex='-1'>
        <MDBModalDialog size='lg' scrollable>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>Select Applicant</MDBModalTitle>
              <MDBBtn className='btn-close' color='none' onClick={() => setApplicantModalOpen(false)}></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
              <MDBInput
                label="Search applicant"
                type="text"
                value={applicantSearch}
                onChange={(e) => setApplicantSearch(e.target.value)}
              />
              {applicantsLoading && <p className="mt-3">Loading applicants...</p>}
              {applicantsError && <p className="mt-3 text-danger">{applicantsError}</p>}
              {!applicantsLoading && !applicantsError && (
                <div className="list-group mt-3" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                  {filteredApplicants.map((a, idx) => {
                    const label = formatApplicantLabel(a);
                    return (
                      <button
                        key={a.application_id || a._id || a.application_num || idx}
                        type="button"
                        className="list-group-item list-group-item-action"
                        onClick={() => handleSelectApplicant(a)}
                      >
                        {label}
                      </button>
                    );
                  })}
                  {filteredApplicants.length === 0 && (
                    <div className="text-muted small">No applicants found.</div>
                  )}
                </div>
              )}
            </MDBModalBody>
            <MDBModalFooter>
              <MDBBtn color="secondary" onClick={() => setApplicantModalOpen(false)}>
                Close
              </MDBBtn>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
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