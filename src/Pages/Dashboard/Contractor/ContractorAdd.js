import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { addContractor, getNewContractorNumber, getLicenseTypes, getLicenseStatuses } from '../../../services/api';
import {
  MDBCard,
  MDBCardBody,
  MDBCardHeader,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBInput,
  MDBBtn,
  MDBValidation,
  MDBValidationItem
} from 'mdb-react-ui-kit';
import './Contractor.css';

export default function ContractorAdd() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    business_name: '',
    license_type: '',
    license_number: '',
    business_phone_number: '',
    business_house_number: '',
    business_street_name: '',
    license_business_city: '',
    business_state: '',
    business_zip_code: '',
    license_status: 'Active'
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [contractorNumber, setContractorNumber] = useState('');
  const [licenseTypes, setLicenseTypes] = useState([]);
  const [licenseStatuses, setLicenseStatuses] = useState([]);

  useEffect(() => {
    const fetchContractorNumber = async () => {
      try {
        const data = await getNewContractorNumber();
        const newNumber = typeof data === 'string' || typeof data === 'number'
          ? data
          : data?.contractor_number || data?.contractor_num || '';

        if (newNumber) {
          setContractorNumber(newNumber.toString());
          setFormData(prev => ({
            ...prev,
            license_number: newNumber.toString()
          }));
        }
      } catch (error) {
        console.error('Error fetching new contractor number:', error);
      }
    };

    const fetchLicenseTypes = async () => {
      try {
        const types = await getLicenseTypes();
        setLicenseTypes(types);
      } catch (err) {
        console.error('Error fetching license types:', err);
      }
    };

    const fetchLicenseStatuses = async () => {
      try {
        const statuses = await getLicenseStatuses();
        setLicenseStatuses(statuses);
      } catch (err) {
        console.error('Error fetching license statuses:', err);
      }
    };

    fetchContractorNumber();
    fetchLicenseTypes();
    fetchLicenseStatuses();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.first_name.trim()) {
      newErrors.first_name = 'First name is required';
    }

    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Last name is required';
    }

    if (!formData.license_number.trim()) {
      newErrors.license_number = 'License number is required';
    }

    if (!formData.license_type.trim()) {
      newErrors.license_type = 'License type is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitSuccess(false);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const data = await addContractor(formData);
      console.log('Contractor created successfully:', data);
      
      setSubmitSuccess(true);
      
      // Reset form
      setFormData({
        first_name: '',
        last_name: '',
        business_name: '',
        license_type: '',
        license_number: '',
        business_phone_number: '',
        business_house_number: '',
        business_street_name: '',
        license_business_city: '',
        business_state: '',
        business_zip_code: '',
        license_status: 'Active'
      });

      // Navigate to contractors list after 2 seconds
      setTimeout(() => {
        navigate('/dashboard/contractors');
      }, 2000);

    } catch (error) {
      console.error('Error creating contractor:', error);
      setSubmitError(error.message || 'Failed to create contractor. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard/contractors');
  };

  return (
    <MDBContainer className="mt-4">
      <MDBRow className="justify-content-center">
        <MDBCol md="10" lg="8">
          <MDBCard>
            <MDBCardHeader className="text-center py-3">
              <h2 className="mb-0">Add New Contractor</h2>
            </MDBCardHeader>
            <MDBCardBody className="p-4">
              {submitSuccess && (
                <div className="alert alert-success mb-3" role="alert">
                  Contractor created successfully! Redirecting...
                </div>
              )}
              
              {submitError && (
                <div className="alert alert-danger mb-3" role="alert">
                  {submitError}
                </div>
              )}

              <MDBValidation onSubmit={handleSubmit}>
                {/* Contractor Information Section */}
                <h5 className="mb-3 text-primary">Personal Information</h5>
                
                <MDBRow className="mb-3">
                  <MDBCol md="6">
                    <MDBValidationItem 
                      invalid={!!errors.first_name}
                      feedback={errors.first_name}
                    >
                      <MDBInput
                        label="First Name *"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        required
                      />
                    </MDBValidationItem>
                  </MDBCol>
                  <MDBCol md="6">
                    <MDBValidationItem 
                      invalid={!!errors.last_name}
                      feedback={errors.last_name}
                    >
                      <MDBInput
                        label="Last Name *"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        required
                      />
                    </MDBValidationItem>
                  </MDBCol>
                </MDBRow>

                <h5 className="mb-3 mt-4 text-primary">Business Information</h5>
                
                <MDBRow className="mb-3">
                  <MDBCol md="12">
                    <MDBInput
                      label="Business Name"
                      name="business_name"
                      value={formData.business_name}
                      onChange={handleChange}
                    />
                  </MDBCol>
                </MDBRow>

                <MDBRow className="mb-3">
                  <MDBCol md="6">
                    <MDBInput
                      label="Business Phone"
                      name="business_phone_number"
                      value={formData.business_phone_number}
                      onChange={handleChange}
                    />
                  </MDBCol>
                </MDBRow>

                <h5 className="mb-3 mt-4 text-primary">License Information</h5>

                <MDBRow className="mb-3">
                  <MDBCol md="6">
                    <MDBValidationItem 
                      invalid={!!errors.license_type}
                      feedback={errors.license_type}
                    >
                      <label className="form-label">License Type *</label>
                      <select
                        className="form-select"
                        name="license_type"
                        value={formData.license_type}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select License Type</option>
                        {licenseTypes.map((type, index) => (
                          <option key={index} value={type}>{type}</option>
                        ))}
                      </select>
                    </MDBValidationItem>
                  </MDBCol>
                  <MDBCol md="6">
                    <MDBValidationItem 
                      invalid={!!errors.license_number}
                      feedback={errors.license_number}
                    >
                      <MDBInput
                        label="License Number *"
                        name="license_number"
                        value={formData.license_number}
                        onChange={handleChange}
                        required
                      />
                    </MDBValidationItem>
                  </MDBCol>
                </MDBRow>

                <MDBRow className="mb-3">
                  <MDBCol md="6">
                    <label className="form-label">License Status</label>
                    <select
                      className="form-select"
                      name="license_status"
                      value={formData.license_status}
                      onChange={handleChange}
                    >
                      <option value="">Select License Status</option>
                      {licenseStatuses.map((status, index) => (
                        <option key={index} value={status}>{status}</option>
                      ))}
                    </select>
                  </MDBCol>
                </MDBRow>

                <h5 className="mb-3 mt-4 text-primary">Business Address</h5>
                
                <MDBRow className="mb-3">
                  <MDBCol md="6">
                    <MDBInput
                      label="House Number"
                      name="business_house_number"
                      value={formData.business_house_number}
                      onChange={handleChange}
                    />
                  </MDBCol>
                  <MDBCol md="6">
                    <MDBInput
                      label="Street Name"
                      name="business_street_name"
                      value={formData.business_street_name}
                      onChange={handleChange}
                    />
                  </MDBCol>
                </MDBRow>

                <MDBRow className="mb-3">
                  <MDBCol md="4">
                    <MDBInput
                      label="City"
                      name="license_business_city"
                      value={formData.license_business_city}
                      onChange={handleChange}
                    />
                  </MDBCol>
                  
                  <MDBCol md="4">
                    <MDBInput
                      label="State"
                      name="business_state"
                      value={formData.business_state}
                      onChange={handleChange}
                    />
                  </MDBCol>

                  <MDBCol md="4">
                    <MDBInput
                      label="ZIP Code"
                      name="business_zip_code"
                      value={formData.business_zip_code}
                      onChange={handleChange}
                    />
                  </MDBCol>
                </MDBRow>

                {/* Action Buttons */}
                <MDBRow className="mt-4">
                  <MDBCol className="d-flex justify-content-end gap-2">
                    <MDBBtn 
                      color="secondary" 
                      onClick={handleCancel}
                      type="button"
                      disabled={isSubmitting}
                    >
                      Cancel
                    </MDBBtn>
                    <MDBBtn 
                      color="primary" 
                      type="submit"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Creating...' : 'Create Contractor'}
                    </MDBBtn>
                  </MDBCol>
                </MDBRow>
              </MDBValidation>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}
