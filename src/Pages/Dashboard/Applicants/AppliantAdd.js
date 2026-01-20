import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { addApplicant, getApplicantsTitles, getNewApplicationNumber } from '../../../services/api';
import { Container, Grid, Card, TextInput, Button, Select, Text } from '@mantine/core';
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
  const [applicationNumber, setApplicationNumber] = useState('');

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

  useEffect(() => {
    const fetchApplicationNumber = async () => {
      try {
        const data = await getNewApplicationNumber();
        const newNumber = typeof data === 'string' || typeof data === 'number'
          ? data
          : data?.application_number || data?.application_num || '';

        if (newNumber) {
          setApplicationNumber(newNumber.toString());
          setFormData(prev => ({
            ...prev,
            applicant_license: newNumber.toString()
          }));
        }
      } catch (error) {
        console.error('Error fetching new application number:', error);
      }
    };

    fetchApplicationNumber();
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

  const handleTitleChange = (input) => {
    let value = '';

    if (input == null) value = '';
    else if (typeof input === 'string') value = input;

    setFormData(prev => ({
      ...prev,
      applicant_title: value
    }));

    if (errors.applicant_title) {
      setErrors(prev => ({
        ...prev,
        applicant_title: ''
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
    <Container className="mt-4">
      <Grid className="justify-content-center">
        <Grid.Col span={{ base: 12, md: 10, lg: 8 }}>
          <Card className="p-4">
            <div className="text-center pb-3 border-bottom mb-4">
              <h2 className="mb-0">Add New Applicant</h2>
            </div>
            <div className="p-1">
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

              <form onSubmit={handleSubmit}>
                {/* Personal Information Section */}
                <h5 className="mb-3 text-primary">Personal Information</h5>
                
                <Grid className="mb-3" gutter="md">
                  <Grid.Col span={{ base: 12, md: 6 }}>
                      <TextInput
                        label="First Name *"
                        name="applicant_firstName"
                        value={formData.applicant_firstName}
                        onChange={handleChange}
                        required
                        error={errors.applicant_firstName}
                      />
                  </Grid.Col>
                  
                  <Grid.Col span={{ base: 12, md: 6 }}>
                      <TextInput
                        label="Last Name *"
                        name="applicant_lastName"
                        value={formData.applicant_lastName}
                        onChange={handleChange}
                        required
                        error={errors.applicant_lastName}
                      />
                  </Grid.Col>
                </Grid>

                <Grid className="mb-3" gutter="md">
                  <Grid.Col span={{ base: 12, md: 6 }}>
                      <Select
                        label="Title *"
                        placeholder={titlesLoading ? 'Loading titles...' : 'Select Title'}
                        data={titleOptions.map((title) => {
                          const professionalTitle = title.applicant_professional_title || title.applicant_title || '';
                          const description = title.description || '';
                          const label = description
                            ? `${professionalTitle} - ${description}`
                            : professionalTitle;

                          return {
                            value: professionalTitle,
                            label
                          };
                        })}
                        value={formData.applicant_title}
                        onChange={handleTitleChange}
                        error={errors.applicant_title}
                      />
                      {titlesError && (
                        <div className="form-text text-danger">{titlesError}</div>
                      )}
                  </Grid.Col>
                  
                  <Grid.Col span={{ base: 12, md: 6 }}>
                      <TextInput
                        label="License Number *"
                        name="applicant_license"
                        value={formData.applicant_license}
                        onChange={handleChange}
                        required
                        error={errors.applicant_license}
                      />
                  </Grid.Col>
                </Grid>

       

                {/* Action Buttons */}
                <Grid className="mt-4">
                  <Grid.Col className="d-flex justify-content-end gap-2">
                    <Button 
                      color="gray" 
                      onClick={handleCancel}
                      type="button"
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                    <Button 
                      color="blue" 
                      type="submit"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Creating...' : 'Create Applicant'}
                    </Button>
                  </Grid.Col>
                </Grid>
              </form>
            </div>
          </Card>
        </Grid.Col>
      </Grid>
    </Container>
  );
}
