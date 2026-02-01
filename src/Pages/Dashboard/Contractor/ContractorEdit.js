import React, { useEffect, useRef, useState } from 'react';
import {
	MDBBtn,
	MDBInput,
	MDBCheckbox,
	MDBAccordion,
	MDBAccordionItem,
	MDBListGroup,
	MDBListGroupItem,
	MDBBadge,
	MDBModal,
	MDBModalDialog,
	MDBModalContent,
	MDBModalHeader,
	MDBModalTitle,
	MDBModalBody,
	MDBModalFooter
} from 'mdb-react-ui-kit';
import { useNavigate, useParams } from 'react-router-dom';
import { editContractor, getOneContractor, searchJobs, getLicenseTypes, getLicenseStatuses } from '../../../services/api';
import Mapgl from '../../../Components/Map_gl';

export default function ContractorEdit() {
	const { contractorId } = useParams();
	const navigate = useNavigate();

	const [formData, setFormData] = useState({
		first_name: '',
		last_name: '',
		business_name: '',
		license_sl_no: '',
		license_type: '',
		license_number: '',
		business_phone_number: '',
		business_house_number: '',
		business_street_name: '',
		license_business_city: '',
		business_state: '',
		business_zip_code: '',
		license_status: '',
		job_listing: []
	});

	const [allJobs, setAllJobs] = useState([]);
	const [linkedJobsData, setLinkedJobsData] = useState([]);
	const [jobsLoading, setJobsLoading] = useState(false);
	const [jobsError, setJobsError] = useState('');
	const [loading, setLoading] = useState(true);
	const searchTimeoutRef = useRef(null);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');
	const [saveConfirmOpen, setSaveConfirmOpen] = useState(false);
	const [activeAccordion, setActiveAccordion] = useState(1);
	const [jobSearchTerm, setJobSearchTerm] = useState('');
	const [viewJobModalOpen, setViewJobModalOpen] = useState(false);
	const [selectedJob, setSelectedJob] = useState(null);
	const [licenseTypes, setLicenseTypes] = useState([]);
	const [licenseStatuses, setLicenseStatuses] = useState([]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData(prev => ({
			...prev,
			[name]: value ?? ''
		}));
	};

	const getJobId = (job) => job._id || job.id || job.job_id;

	const handleToggleJob = (job) => {
		const id = getJobId(job);
		if (!id) return;
		setFormData(prev => {
			const exists = prev.job_listing.includes(id);
			// Update linkedJobsData to reflect the change
			if (exists) {
				setLinkedJobsData(prevLinked => prevLinked.filter(j => getJobId(j) !== id));
			} else {
				setLinkedJobsData(prevLinked => [...prevLinked, job]);
			}
			return {
				...prev,
				job_listing: exists
					? prev.job_listing.filter(j => j !== id)
					: [...prev.job_listing, id]
			};
		});
	};

	const handleOpenJobModal = (job) => {
		setSelectedJob(job);
		setViewJobModalOpen(true);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setSaving(true);
		setError('');
		setSuccess('');

		try {
			const normalizeText = (value) => (value ?? '').toString();
			const payload = {
				first_name: normalizeText(formData.first_name),
				last_name: normalizeText(formData.last_name),
				business_name: normalizeText(formData.business_name),
				license_type: normalizeText(formData.license_type),
				business_phone_number: normalizeText(formData.business_phone_number),
				business_house_number: normalizeText(formData.business_house_number),
				business_street_name: normalizeText(formData.business_street_name),
				license_business_city: normalizeText(formData.license_business_city),
				business_state: normalizeText(formData.business_state),
				business_zip_code: normalizeText(formData.business_zip_code),
				license_status: normalizeText(formData.license_status),
				// license_number and license_sl_no are intentionally omitted from updates so they cannot be changed
				job_listing: formData.job_listing
			};

			const updatedData = await editContractor(contractorId, payload);
			setSuccess('Contractor updated successfully!');
			setFormData({
				first_name: updatedData.first_name || '',
				last_name: updatedData.last_name || '',
				business_name: updatedData.business_name || '',
				license_sl_no: updatedData.license_sl_no || '',
				license_type: updatedData.license_type || '',
				license_number: updatedData.license_number || '',
				business_phone_number: updatedData.business_phone_number || '',
				business_house_number: updatedData.business_house_number || '',
				business_street_name: updatedData.business_street_name || '',
				license_business_city: updatedData.license_business_city || '',
				business_state: updatedData.business_state || '',
				business_zip_code: updatedData.business_zip_code || '',
				license_status: updatedData.license_status || '',
				job_listing: updatedData.job_listing || []
			});
			
			setLinkedJobsData(updatedData.jobs || []);
			setSaveConfirmOpen(true);

		} catch (err) {
			console.error('Error updating contractor:', err);
			setError(err.message || 'Failed to update contractor');
		} finally {
			setSaving(false);
		}
	};

	const handleReturnToPreview = () => {
		setSaveConfirmOpen(false);
		navigate(`/dashboard/contractors/${contractorId}`);
	};

	const handleContinueEditing = () => {
		setSaveConfirmOpen(false);
	};

	const handleJobSearchChange = (e) => {
		const value = e.target.value;
		setJobSearchTerm(value);

		if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

		if (!value.trim()) {
			setAllJobs([]);
			return;
		}

		const newTimeout = setTimeout(async () => {
			setJobsLoading(true);
			setJobsError('');
			try {
				const results = await searchJobs(value);
				const jobsArray = Array.isArray(results) ? results : [];
				setAllJobs(jobsArray);
			} catch (err) {
				console.error('Error searching jobs:', err);
				setJobsError('Failed to search jobs');
				setAllJobs([]);
			} finally {
				setJobsLoading(false);
			}
		}, 300);

		searchTimeoutRef.current = newTimeout;
	};

	useEffect(() => {
		console.log('Fetching contractor data for ID:', contractorId);
		const fetchContractor = async () => {
			try {
				const data = await getOneContractor(contractorId);
				
				// Use job_listing for IDs, jobs for populated data
				const jobIds = data.job_listing || [];
				const jobsData = data.jobs || [];

				setFormData({
					first_name: data.first_name || '',
					last_name: data.last_name || '',
					business_name: data.business_name || '',
					license_sl_no: data.license_sl_no || '',
					license_type: data.license_type || '',
					license_number: data.license_number || '',
					business_phone_number: data.business_phone_number || '',
					business_house_number: data.business_house_number || '',
					business_street_name: data.business_street_name || '',
					license_business_city: data.license_business_city || '',
					business_state: data.business_state || '',
					business_zip_code: data.business_zip_code || '',
					license_status: data.license_status || '',
					job_listing: jobIds
				});

				setLinkedJobsData(jobsData);

			} catch (err) {
				console.error('Error fetching contractor:', err);
				setError('Failed to load contractor');
			} finally {
				setLoading(false);
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

		fetchContractor();
		fetchLicenseTypes();
		fetchLicenseStatuses();

		return () => {
			if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
		};
	}, [contractorId]);

	if (loading) {
		return <div className="container mt-5 text-center">Loading contractor data...</div>;
	}

	return (
		<div className="container mt-5">
			<h2 className="mb-4">Edit Contractor</h2>
			
			{error && <div className="alert alert-danger mt-3">{error}</div>}
			{success && <div className="alert alert-success mt-3">{success}</div>}

			<form onSubmit={handleSubmit}>
				<h5 className="text-primary mb-3">Personal Information</h5>
				<div className="row mb-3">
					<div className="col-md-6 mb-3">
						<MDBInput
							label="First Name"
							name="first_name"
							value={formData.first_name}
							onChange={handleChange}
							required
						/>
					</div>
					<div className="col-md-6 mb-3">
						<MDBInput
							label="Last Name"
							name="last_name"
							value={formData.last_name}
							onChange={handleChange}
							required
						/>
					</div>
				</div>

				<h5 className="text-primary mb-3 mt-4">Business Information</h5>
				<div className="col-12 mb-3">
					<MDBInput
						label="Business Name"
						name="business_name"
						value={formData.business_name}
						onChange={handleChange}
					/>
				</div>
				<div className="col-12 mb-3">
					<MDBInput
						label="Business Phone"
						name="business_phone_number"
						value={formData.business_phone_number}
						onChange={handleChange}
					/>
				</div>

				<h5 className="text-primary mb-3 mt-4">Business Address</h5>
				<div className="row mb-3">
					<div className="col-md-6 mb-3">
						<MDBInput
							label="House Number"
							name="business_house_number"
							value={formData.business_house_number}
							onChange={handleChange}
						/>
					</div>
					<div className="col-md-6 mb-3">
						<MDBInput
							label="Street Name"
							name="business_street_name"
							value={formData.business_street_name}
							onChange={handleChange}
						/>
					</div>
				</div>
				<div className="row mb-3">
					<div className="col-md-4 mb-3">
						<MDBInput
							label="City"
							name="license_business_city"
							value={formData.license_business_city}
							onChange={handleChange}
						/>
					</div>
					<div className="col-md-4 mb-3">
						<MDBInput
							label="State"
							name="business_state"
							value={formData.business_state}
							onChange={handleChange}
						/>
					</div>
					<div className="col-md-4 mb-3">
						<MDBInput
							label="ZIP Code"
							name="business_zip_code"
							value={formData.business_zip_code}
							onChange={handleChange}
						/>
					</div>
				</div>

				<h5 className="text-primary mb-3 mt-4">License Information</h5>
				<div className="row mb-3">
					<div className="col-md-6 mb-3">
						<label className="form-label">License Type</label>
						<select
							className="form-select"
							name="license_type"
							value={formData.license_type}
							onChange={handleChange}
						>
							<option value="">Select License Type</option>
							{licenseTypes.map((type, index) => (
								<option key={index} value={type}>{type}</option>
							))}
						</select>
					</div>
					<div className="col-md-6 mb-3">
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
					</div>
				</div>
				<div className="row mb-3">
					<div className="col-md-6 mb-3">
						<MDBInput
							label="License Serial Number (Read-only)"
							name="license_sl_no"
							value={formData.license_sl_no}
							disabled
						/>
					</div>
					<div className="col-md-6 mb-3">
						<MDBInput
							label="License Number (Read-only)"
							name="license_number"
							value={formData.license_number}
							disabled
						/>
					</div>
				</div>

				<h5 className="mt-4 mb-3">Assigned Jobs ({linkedJobsData.length})</h5>
				{linkedJobsData.length === 0 ? (
					<p className="text-muted">No jobs currently assigned to this contractor.</p>
				) : (
					<MDBAccordion
						initialActive={1}
						active={activeAccordion}
						onChange={(itemId) => setActiveAccordion(itemId)}
						className="mb-3"
					>
						{linkedJobsData.map((job, index) => {
							const id = getJobId(job);
							const property = job.property || {};
							const address = `${property.house_num || ''} ${property.street_name || ''}`.trim() || 'N/A';
							const collapseId = index + 1;
							return (
								<MDBAccordionItem 
									key={id} 
									collapseId={collapseId}
									headerTitle={
										<>
											<MDBCheckbox
												checked={formData.job_listing.includes(id)}
												onChange={() => handleToggleJob(job)}
												onClick={(e) => e.stopPropagation()}
												label={
													<span>
														<strong>Job #{job.job_number}</strong> - {address}
													</span>
												}
											/>
											<MDBBadge color={job.approved ? 'success' : 'warning'} className="ms-2">
												{job.approved ? 'Approved' : 'Pending'}
											</MDBBadge>
										</>
									}
								>
									<MDBListGroup className='text-start m-3'>
										<MDBListGroupItem>
											<div className='fw-bold'>Address: <span className='fw-normal'>{property.house_num} {property.street_name}</span></div>
										</MDBListGroupItem>
										<MDBListGroupItem>
											<div className='fw-bold'>Borough: <span className='fw-normal'>{property.borough || 'N/A'}</span></div>
										</MDBListGroupItem>
										<MDBListGroupItem>
											<div><div className='fw-bold text-start'>Description:</div><div className='fw-normal'>{job.job_description || 'N/A'}</div></div>
										</MDBListGroupItem>
										<MDBListGroupItem>
											<div className='fw-bold'>Job Type: <span className='fw-normal'>{job.job_type || 'N/A'}</span></div>
										</MDBListGroupItem>
										<MDBListGroupItem>
											<MDBBtn
												size="sm"
												color="info"
												onClick={() => handleOpenJobModal(job)}
											>
												View Full Details
											</MDBBtn>
										</MDBListGroupItem>
									</MDBListGroup>
								</MDBAccordionItem>
							);
						})}
					</MDBAccordion>
				)}

				<hr className="my-4" />

				<h5 className="mb-3">Search & Add Jobs</h5>
				<div className="col-12 mb-3">
					<MDBInput
						label="Search jobs by number, address, or description"
						value={jobSearchTerm}
						onChange={handleJobSearchChange}
					/>
				</div>
				
				{jobsLoading && <p className="text-muted">Searching...</p>}
				{jobsError && <p className="text-danger">{jobsError}</p>}
				
				{allJobs.length > 0 && (
					<MDBListGroup className="mb-3">
						{allJobs.map(job => {
							const id = getJobId(job);
							const property = job.property || {};
							const address = `${property.house_num || ''} ${property.street_name || ''}`.trim() || 'N/A';
							const isLinked = formData.job_listing.includes(id);
							
							return (
								<MDBListGroupItem key={id} className="d-flex justify-content-between align-items-center">
									<div>
										<MDBCheckbox
											checked={isLinked}
											onChange={() => handleToggleJob(job)}
											label={
												<span>
													<strong>Job #{job.job_number}</strong> - {address}
													<MDBBadge color={job.approved ? 'success' : 'warning'} className="ms-2">
														{job.approved ? 'Approved' : 'Pending'}
													</MDBBadge>
												</span>
											}
										/>
									</div>
									<MDBBtn
										size="sm"
										color="info"
										onClick={() => handleOpenJobModal(job)}
									>
										View Details
									</MDBBtn>
								</MDBListGroupItem>
							);
						})}
					</MDBListGroup>
				)}

				<div className="d-flex justify-content-end gap-2 mt-4">
					<MDBBtn color="secondary" onClick={() => navigate(`/dashboard/contractors/${contractorId}`)}>
						Cancel
					</MDBBtn>
					<MDBBtn color="primary" type="submit" disabled={saving}>
						Save Changes
					</MDBBtn>
				</div>
			</form>

			{/* Save Confirmation Modal */}
			<MDBModal open={saveConfirmOpen} setOpen={setSaveConfirmOpen} tabIndex='-1'>
				<MDBModalDialog size='md'>
					<MDBModalContent>
						<MDBModalHeader>
							<MDBModalTitle>Contractor Saved</MDBModalTitle>
							<MDBBtn className='btn-close' color='none' onClick={handleContinueEditing}></MDBBtn>
						</MDBModalHeader>
						<MDBModalBody>
							<p className="mb-0">
								Contractor information has been saved successfully. Would you like to return to the preview page or continue editing?
							</p>
						</MDBModalBody>
						<MDBModalFooter>
							<MDBBtn color="secondary" onClick={handleContinueEditing}>
								Continue Editing
							</MDBBtn>
							<MDBBtn color="primary" onClick={handleReturnToPreview}>
								Return to Preview
							</MDBBtn>
						</MDBModalFooter>
					</MDBModalContent>
				</MDBModalDialog>
			</MDBModal>

			{/* View Job Details Modal */}
			<MDBModal open={viewJobModalOpen} setOpen={setViewJobModalOpen} tabIndex='-1'>
				<MDBModalDialog size="lg">
					<MDBModalContent>
						<MDBModalHeader>
							<MDBModalTitle>Job Details</MDBModalTitle>
							<MDBBtn className='btn-close' color='none' onClick={() => setViewJobModalOpen(false)}></MDBBtn>
						</MDBModalHeader>
						<MDBModalBody>
							{selectedJob ? (
								<div>
									<MDBListGroup>
										<MDBListGroupItem>
											<strong>Job Number:</strong> {selectedJob.job_number}
										</MDBListGroupItem>
										<MDBListGroupItem>
											<strong>Status:</strong> 
											<MDBBadge color={selectedJob.approved ? 'success' : 'warning'} className="ms-2">
												{selectedJob.approved ? 'Approved' : 'Pending'}
											</MDBBadge>
										</MDBListGroupItem>
										<MDBListGroupItem>
											<strong>Address:</strong> {selectedJob.property?.house_num} {selectedJob.property?.street_name}
										</MDBListGroupItem>
										<MDBListGroupItem>
											<strong>Borough:</strong> {selectedJob.property?.borough || 'N/A'}
										</MDBListGroupItem>
										<MDBListGroupItem>
											<strong>Description:</strong> {selectedJob.job_description || 'N/A'}
										</MDBListGroupItem>
										<MDBListGroupItem>
											<strong>Job Type:</strong> {selectedJob.job_type || 'N/A'}
										</MDBListGroupItem>
									</MDBListGroup>

									{selectedJob.property?.latitude && selectedJob.property?.longitude && (
										<div className="mt-3">
											<h6>Location</h6>
											<Mapgl
												latitude={selectedJob.property.latitude}
												longitude={selectedJob.property.longitude}
												zoom={15}
											/>
										</div>
									)}
								</div>
							) : (
								<p>No job selected</p>
							)}
						</MDBModalBody>
						<MDBModalFooter>
							<MDBBtn color='secondary' onClick={() => setViewJobModalOpen(false)}>
								Close
							</MDBBtn>
						</MDBModalFooter>
					</MDBModalContent>
				</MDBModalDialog>
			</MDBModal>
		</div>
	);
}
