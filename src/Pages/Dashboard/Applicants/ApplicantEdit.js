import React, { useEffect, useState } from 'react';
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
import { editApplicant, getAllJobs, getOneApplication } from '../../../services/api';

export default function ApplicantEdit() {
	const { applicantId } = useParams();
	const navigate = useNavigate();

	const [formData, setFormData] = useState({
		applicant_firstName: '',
		applicant_lastName: '',
		applicant_title: '',
		applicant_license: '',
		jobs: []
	});

	const [allJobs, setAllJobs] = useState([]);
	const [jobsLoading, setJobsLoading] = useState(false);
	const [jobsError, setJobsError] = useState('');
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');
	const [saveConfirmOpen, setSaveConfirmOpen] = useState(false);
	const [activeAccordion, setActiveAccordion] = useState(1);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData(prev => ({
			...prev,
			[name]: value
		}));
	};

	const getJobId = (job) => job._id || job.id || job.job_id;

	const handleToggleJob = (job) => {
		const id = getJobId(job);
		if (!id) return;
		setFormData(prev => {
			const exists = prev.jobs.includes(id);
			return {
				...prev,
				jobs: exists
					? prev.jobs.filter(j => j !== id)
					: [...prev.jobs, id]
			};
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setSaving(true);
		setError('');
		setSuccess('');

		try {
			const payload = {
				applicant_firstName: formData.applicant_firstName,
				applicant_lastName: formData.applicant_lastName,
				applicant_title: formData.applicant_title,
				// applicant_license is intentionally omitted from updates so it cannot be changed
				jobs: formData.jobs
			};

			await editApplicant(applicantId, payload);
			setSuccess('Applicant updated successfully!');
			setSaveConfirmOpen(true);
		} catch (err) {
			try {
				if (err && typeof err.json === 'function') {
					const data = await err.json();
					setError(data?.error || 'Failed to update applicant');
				} else if (err && err.response) {
					setError(err.response.data?.error || 'Failed to update applicant');
				} else {
					setError(err?.message || 'Failed to update applicant');
				}
			} catch (parseError) {
				setError('Failed to update applicant');
			}
		} finally {
			setSaving(false);
		}
	};

	const handleReturnToPreview = () => {
		setSaveConfirmOpen(false);
		navigate(`/dashboard/applicants/${applicantId}`);
	};

	const handleContinueEditing = () => {
		setSaveConfirmOpen(false);
	};

	useEffect(() => {
		(async () => {
			setLoading(true);
			setError('');
			try {
				const application = await getOneApplication(applicantId);

				const existingJobs = Array.isArray(application.job_listing)
					? application.job_listing
					: [];

				setFormData(prev => ({
					...prev,
					applicant_firstName: application.applicant_firstName || '',
					applicant_lastName: application.applicant_lastName || '',
					applicant_title: application.applicant_title || '',
					applicant_license: application.applicant_license || '',
					jobs: existingJobs
						.map(j => (typeof j === 'object' ? getJobId(j) : j))
						.filter(Boolean)
				}));

				setJobsLoading(true);
				try {
					const jobs = await getAllJobs();
					setAllJobs(Array.isArray(jobs) ? jobs : []);
				} catch (e) {
					console.error('Failed to load jobs for applicant edit', e);
					setJobsError('Failed to load jobs');
				} finally {
					setJobsLoading(false);
				}
			} catch (e) {
				console.error('Failed to load applicant for editing', e);
				setError('Failed to load applicant for editing');
			} finally {
				setLoading(false);
			}
		})();
	}, [applicantId]);

	const linkedJobs = allJobs.filter(job => {
		const id = getJobId(job);
		return id && formData.jobs.includes(id);
	});

	if (loading) {
		return (
			<div className="container mt-5">
				<h2 className="mb-4">Edit Applicant</h2>
				<p>Loading applicant data...</p>
			</div>
		);
	}

	return (
		<>
		<div className="container mt-5">
			<h2 className="mb-4">Edit Applicant</h2>

			{error && <div className="alert alert-danger">{error}</div>}
			{success && <div className="alert alert-success">{success}</div>}

			<form onSubmit={handleSubmit}>
				<div className="row">
					<div className="col-md-6 mb-3">
						<MDBInput
							label="First Name"
							name="applicant_firstName"
							type="text"
							value={formData.applicant_firstName}
							onChange={handleChange}
						/>
					</div>

					<div className="col-md-6 mb-3">
						<MDBInput
							label="Last Name"
							name="applicant_lastName"
							type="text"
							value={formData.applicant_lastName}
							onChange={handleChange}
						/>
					</div>

					<div className="col-md-6 mb-3">
						<MDBInput
							label="Title"
							name="applicant_title"
							type="text"
							value={formData.applicant_title}
							onChange={handleChange}
						/>
					</div>

					<div className="col-md-6 mb-3">
						<MDBInput
							label="Applicant Number / License"
							name="applicant_license"
							type="text"
							value={formData.applicant_license}
							disabled
						/>
					</div>

					<div className="col-12 mb-3">
						<h5>Linked Jobs</h5>
						{jobsLoading && <p>Loading jobs...</p>}
						{jobsError && <p className="text-danger">{jobsError}</p>}
						{!jobsLoading && !jobsError && linkedJobs.length === 0 && (
							<p className="text-muted">No jobs linked to this applicant.</p>
						)}
						{!jobsLoading && !jobsError && linkedJobs.length > 0 && (
							<MDBAccordion
								initialActive={1}
								active={activeAccordion}
								onChange={(itemId) => setActiveAccordion(itemId)}
								className="mb-3"
							>
								{linkedJobs.map((job, index) => {
									const id = getJobId(job);
									const collapseId = index + 1;
									return (
										<MDBAccordionItem
											key={id || job.job_number || collapseId}
											collapseId={collapseId}
											headerTitle={
												<>
													{job.job_number ? `Job No. #${job.job_number} ` : 'Job'}
													<MDBBadge color={job.approved ? 'primary' : 'danger'} className='ms-2'>
														{job.approved ? 'Approved' : 'Not Approved'}
													</MDBBadge>
												</>
											}
										>
											<MDBListGroup className='text-start m-3'>
												<MDBListGroupItem>
													<div className='fw-bold'>Address: <span className='fw-normal'>{job.property?.house_num || ''} {job.property?.street_name || ''}</span></div>
												</MDBListGroupItem>
												<MDBListGroupItem>
													<div className='fw-bold'>Borough: <span className='fw-normal'>{job.property?.borough || 'N/A'}</span></div>
												</MDBListGroupItem>
												<MDBListGroupItem>
													<div><div className='fw-bold text-start'>Description:</div><div className='fw-normal'>{job.job_description || 'N/A'}</div></div>
												</MDBListGroupItem>
												<MDBListGroupItem>
													<div className='fw-bold'>Description Status:</div><div className='fw-normal'>{job.job_status_descrp || job.job_status || 'N/A'}</div>
												</MDBListGroupItem>
												<MDBListGroupItem>
													<div className='fw-bold'>Job Type: <span className='fw-normal'>{job.job_type || 'N/A'}</span></div>
												</MDBListGroupItem>
											</MDBListGroup>
										</MDBAccordionItem>
									);
								})}
							</MDBAccordion>
						)}
						<MDBBtn
							color="primary"
							size="sm"
							type="button"
							onClick={() => navigate('/dashboard/jobs/add')}
						>
							Create New Job
						</MDBBtn>
						<hr className="my-3" />
						<h6>All Jobs (click to link/unlink)</h6>
						{!jobsLoading && !jobsError && allJobs.length === 0 && (
							<p className="text-muted">No jobs available.</p>
						)}
						{!jobsLoading && !jobsError && allJobs.length > 0 && (
							<div className="list-group" style={{ maxHeight: '300px', overflowY: 'auto' }}>
								{allJobs.map((job) => {
									const id = getJobId(job);
									const selected = formData.jobs.includes(id);
									return (
										<button
											key={id || job.job_number}
											type="button"
											className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center ${selected ? 'active' : ''}`}
											onClick={() => handleToggleJob(job)}
										>
											<span>
												{job.job_number ? `Job #${job.job_number}` : 'Job'}
												{job.property?.borough && ` - ${job.property.borough}`}
											</span>
											{selected && <span className="badge bg-light text-dark">Linked</span>}
										</button>
									);
								})}
							</div>
						)}
						<small className="text-muted d-block mt-1">
							Click a job in the list below to add or remove it from this applicant. This does not change the applicant number.
						</small>
					</div>
				</div>

				<div className="row">
					<div className="col-12">
						<MDBBtn color="success" type="submit" disabled={saving}>
							{saving ? 'Saving...' : 'Save Changes'}
						</MDBBtn>
					</div>
				</div>
			</form>

			<MDBModal open={saveConfirmOpen} setOpen={setSaveConfirmOpen} tabIndex='-1'>
				<MDBModalDialog size='md'>
					<MDBModalContent>
						<MDBModalHeader>
							<MDBModalTitle>Applicant Saved</MDBModalTitle>
							<MDBBtn className='btn-close' color='none' onClick={handleContinueEditing}></MDBBtn>
						</MDBModalHeader>
						<MDBModalBody>
							<p className="mb-0">
								Applicant information has been saved successfully. Would you like to return to the preview page or continue editing?
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
		</div>
		</>
	);
}

