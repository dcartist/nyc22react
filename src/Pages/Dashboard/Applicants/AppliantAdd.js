import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { addApplicant, getApplicantsTitles } from '../../../services/api';
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
import './Applicant.css';

export default function AppliantAdd() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    applicant_firstName: '',
    applicant_lastName: '',
    applicant_title: '',
    applicant_license: '',
    applicant_email: '',
    applicant_phone: '',
    applicant_address: '',
    applicant_city: '',
    applicant_state: '',
    applicant_zip: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [titleOptions, setTitleOptions] = useState([]);
  const [titlesLoading, setTitlesLoading] = useState(false);
  const [titlesError, setTitlesError] = useState('');

  useEffect(() => {
    const fetchTitles = async () => {
      setTitlesLoading(true);
      setTitlesError('');
      try {
        const data = await getApplicantsTitles();
        // Accept either an array directly or an object wrapper
        const titlesArray = Array.isArray(data) ? data : (data && Array.isArray(data.titles) ? data.titles : []);
        setTitleOptions(titlesArray);
      } catch (error) {
        console.error('Error fetching applicant titles:', error);
        setTitlesError('Unable to load titles. You can type a title manually.');
      } finally {
        setTitlesLoading(false);
      }
    };

    fetchTitles();
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

    if (!formData.applicant_firstName.trim()) {
      newErrors.applicant_firstName = 'First name is required';
    }

    if (!formData.applicant_lastName.trim()) {
      newErrors.applicant_lastName = 'Last name is required';
    }

    if (!formData.applicant_title.trim()) {
      newErrors.applicant_title = 'Title is required';
    }

    if (!formData.applicant_license.trim()) {
      newErrors.applicant_license = 'License number is required';
    }

    if (formData.applicant_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.applicant_email)) {
      newErrors.applicant_email = 'Invalid email format';
    }

    if (formData.applicant_phone && !/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(formData.applicant_phone)) {
      newErrors.applicant_phone = 'Invalid phone format (e.g., 123-456-7890)';
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
      const data = await addApplicant(formData);
      console.log('Applicant created successfully:', data);
      
      setSubmitSuccess(true);
      
      // Reset form
      setFormData({
        applicant_firstName: '',
        applicant_lastName: '',
        applicant_title: '',
        applicant_license: '',
        applicant_email: '',
        applicant_phone: '',
        applicant_address: '',
        applicant_city: '',
        applicant_state: '',
        applicant_zip: ''
      });

      // Navigate to applicants list after 2 seconds
      setTimeout(() => {
        navigate('/dashboard/applicants');
      }, 2000);

    } catch (error) {
      console.error('Error creating applicant:', error);
      setSubmitError(error.message || 'Failed to create applicant. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard/applicants');
  };

  return (
    <MDBContainer className="mt-4">
      <MDBRow className="justify-content-center">
        <MDBCol md="10" lg="8">
          <MDBCard>
            <MDBCardHeader className="text-center py-3">
              <h2 className="mb-0">Add New Applicant</h2>
            </MDBCardHeader>
            <MDBCardBody className="p-4">
              {submitSuccess && (
                <div className="alert alert-success mb-3" role="alert">
                  Applicant created successfully! Redirecting...
                </div>
              )}
              
              {submitError && (
                <div className="alert alert-danger mb-3" role="alert">
                  {submitError}
                </div>
              )}

              <MDBValidation onSubmit={handleSubmit}>
                {/* Personal Information Section */}
                <h5 className="mb-3 text-primary">Personal Information</h5>
                
                <MDBRow className="mb-3">
                  <MDBCol md="6">
                    <MDBValidationItem 
                      invalid={!!errors.applicant_firstName}
                      feedback={errors.applicant_firstName}
                    >
                      <MDBInput
                        label="First Name *"
                        name="applicant_firstName"
                        value={formData.applicant_firstName}
                        onChange={handleChange}
                        required
                      />
                    </MDBValidationItem>
                  </MDBCol>
                  
                  <MDBCol md="6">
                    <MDBValidationItem 
                      invalid={!!errors.applicant_lastName}
                      feedback={errors.applicant_lastName}
                    >
                      <MDBInput
                        label="Last Name *"
                        name="applicant_lastName"
                        value={formData.applicant_lastName}
                        onChange={handleChange}
                        required
                      />
                    </MDBValidationItem>
                  </MDBCol>
                </MDBRow>

                <MDBRow className="mb-3">
                  <MDBCol md="6">
                    <MDBValidationItem 
                      invalid={!!errors.applicant_title}
                      feedback={errors.applicant_title}
                    >
                      <>
                        <label className="form-label">Title *</label>
                        <select
                          className="form-select"
                          name="applicant_title"
                          value={formData.applicant_title}
                          onChange={handleChange}
                          required
                        >
                          <option value="" disabled>
                            {titlesLoading ? 'Loading titles...' : 'Select Title'}
                          </option>
                          {titleOptions.map((title, index) => {
                            const professionalTitle = title.applicant_professional_title || title.applicant_title || '';
                            const description = title.description || '';
                            const label = description
                              ? `${professionalTitle} - ${description}`
                              : professionalTitle;

                            return (
                              <option key={index} value={professionalTitle}>
                                {label}
                              </option>
                            );
                          })}
                        </select>
                        {titlesError && (
                          <div className="form-text text-danger">{titlesError}</div>
                        )}
                      </>
                    </MDBValidationItem>
                  </MDBCol>
                  
                  <MDBCol md="6">
                    <MDBValidationItem 
                      invalid={!!errors.applicant_license}
                      feedback={errors.applicant_license}
                    >
                      <MDBInput
                        label="License Number *"
                        name="applicant_license"
                        value={formData.applicant_license}
                        onChange={handleChange}
                        required
                      />
                    </MDBValidationItem>
                  </MDBCol>
                </MDBRow>

                {/* Contact Information Section */}
                <h5 className="mb-3 mt-4 text-primary">Contact Information</h5>
                
                <MDBRow className="mb-3">
                  <MDBCol md="6">
                    <MDBValidationItem 
                      invalid={!!errors.applicant_email}
                      feedback={errors.applicant_email}
                    >
                      <MDBInput
                        type="email"
                        label="Email"
                        name="applicant_email"
                        value={formData.applicant_email}
                        onChange={handleChange}
                        placeholder="example@email.com"
                      />
                    </MDBValidationItem>
                  </MDBCol>
                  
                  <MDBCol md="6">
                    <MDBValidationItem 
                      invalid={!!errors.applicant_phone}
                      feedback={errors.applicant_phone}
                    >
                      <MDBInput
                        type="tel"
                        label="Phone Number"
                        name="applicant_phone"
                        value={formData.applicant_phone}
                        onChange={handleChange}
                        placeholder="123-456-7890"
                      />
                    </MDBValidationItem>
                  </MDBCol>
                </MDBRow>

                {/* Address Section */}
                <h5 className="mb-3 mt-4 text-primary">Address</h5>
                
                <MDBRow className="mb-3">
                  <MDBCol md="12">
                    <MDBInput
                      label="Street Address"
                      name="applicant_address"
                      value={formData.applicant_address}
                      onChange={handleChange}
                    />
                  </MDBCol>
                </MDBRow>

                <MDBRow className="mb-3">
                  <MDBCol md="5">
                    <MDBInput
                      label="City"
                      name="applicant_city"
                      value={formData.applicant_city}
                      onChange={handleChange}
                    />
                  </MDBCol>
                  
                  <MDBCol md="3">
                    <MDBInput
                      label="State"
                      name="applicant_state"
                      value={formData.applicant_state}
                      onChange={handleChange}
                      maxLength="2"
                      placeholder="NY"
                    />
                  </MDBCol>
                  
                  <MDBCol md="4">
                    <MDBInput
                      label="ZIP Code"
                      name="applicant_zip"
                      value={formData.applicant_zip}
                      onChange={handleChange}
                      placeholder="10001"
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
                      {isSubmitting ? 'Creating...' : 'Create Applicant'}
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
