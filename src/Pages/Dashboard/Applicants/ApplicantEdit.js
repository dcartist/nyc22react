import React, { useEffect, useState } from 'react';
import { Button, TextInput, Badge, Modal, Group, Text } from '@mantine/core';
import { useNavigate, useParams } from 'react-router-dom';
import { editApplicant, getAllJobs, getOneApplication } from '../../../services/api';
import Mapgl from '../../../Components/Map_gl';

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
	const [activeAccordion, setActiveAccordion] = useState(null);
	const [jobSearchTerm, setJobSearchTerm] = useState('');
	const [viewJobModalOpen, setViewJobModalOpen] = useState(false);
	const [selectedJob, setSelectedJob] = useState(null);

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

	const filteredJobs = allJobs.filter(job => {
		if (!jobSearchTerm) return true;
		const term = jobSearchTerm.toLowerCase();
		const number = job.job_number ? String(job.job_number).toLowerCase() : '';
		const borough = job.property?.borough ? String(job.property.borough).toLowerCase() : '';
		const street = job.property?.street_name ? String(job.property.street_name).toLowerCase() : '';
		const house = job.property?.house_num ? String(job.property.house_num).toLowerCase() : '';
		const desc = job.job_description ? String(job.job_description).toLowerCase() : '';
		return (
			number.includes(term) ||
			borough.includes(term) ||
			street.includes(term) ||
			house.includes(term) ||
			desc.includes(term)
		);
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
						<TextInput
							label="First Name"
							name="applicant_firstName"
							type="text"
							value={formData.applicant_firstName}
							onChange={handleChange}
						/>
					</div>

					<div className="col-md-6 mb-3">
						<TextInput
							label="Last Name"
							name="applicant_lastName"
							type="text"
							value={formData.applicant_lastName}
							onChange={handleChange}
						/>
					</div>

					<div className="col-md-6 mb-3">
						<TextInput
							label="Title"
							name="applicant_title"
							type="text"
							value={formData.applicant_title}
							onChange={handleChange}
						/>
					</div>

					<div className="col-md-6 mb-3">
						<TextInput
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
								<div className="accordion mb-3" id="linkedJobsAccordion">
									{linkedJobs.map((job, index) => {
										const id = getJobId(job);
										const isOpen = activeAccordion === index;
										return (
											<div className="accordion-item" key={id || job.job_number || index}>
												<h2 className="accordion-header">
													<button
														className={'accordion-button' + (isOpen ? '' : ' collapsed')}
														type="button"
														onClick={() => setActiveAccordion(isOpen ? null : index)}
													>
														{job.job_number ? `Job No. #${job.job_number} ` : 'Job'}
														<Badge color={job.approved ? 'blue' : 'red'} className='ms-2'>
															{job.approved ? 'Approved' : 'Not Approved'}
														</Badge>
													</button>
												</h2>
												<div className={'accordion-collapse collapse' + (isOpen ? ' show' : '')}>
													<div className='accordion-body text-start'>
														<div className='fw-bold'>Address: <span className='fw-normal'>{job.property?.house_num || ''} {job.property?.street_name || ''}</span></div>
														<div className='fw-bold'>Borough: <span className='fw-normal'>{job.property?.borough || 'N/A'}</span></div>
														<div>
															<div className='fw-bold text-start'>Description:</div>
															<div className='fw-normal'>{job.job_description || 'N/A'}</div>
														</div>
														<div className='fw-bold'>Description Status: <span className='fw-normal'>{job.job_status_descrp || job.job_status || 'N/A'}</span></div>
														<div className='fw-bold'>Job Type: <span className='fw-normal'>{job.job_type || 'N/A'}</span></div>
													</div>
												</div>
											</div>
										);
									})}
								</div>
						)}
							<Button
								color="blue"
								size="sm"
								type="button"
								onClick={() =>
								navigate('/dashboard/jobs/add', {
									state: {
										prefillApplicant: {
											applicant_firstName: formData.applicant_firstName,
											applicant_lastName: formData.applicant_lastName,
											applicant_title: formData.applicant_title,
											applicant_license: formData.applicant_license,
											application_id: applicantId
										}
									}
								})
							}
						>
							Create New Job
						</Button>
						<hr className="my-3" />
						<h6>All Jobs (click to link/unlink)</h6>
						<div className="mb-2">
							<TextInput
								label="Search jobs by number, address, borough, or description"
								type="text"
								value={jobSearchTerm}
								onChange={(e) => setJobSearchTerm(e.target.value)}
								size="sm"
							/>
						</div>
						{!jobsLoading && !jobsError && allJobs.length === 0 && (
							<p className="text-muted">No jobs available.</p>
						)}
						{!jobsLoading && !jobsError && filteredJobs.length > 0 && (
							<div className="list-group" style={{ maxHeight: '300px', overflowY: 'auto' }}>
								{filteredJobs.map((job) => {
									const id = getJobId(job);
									const selected = formData.jobs.includes(id);
									return (
										<button
											key={id || job.job_number}
											type="button"
											className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center ${selected ? 'active' : ''}`}
											onClick={() => handleOpenJobModal(job)}
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
						{!jobsLoading && !jobsError && allJobs.length > 0 && filteredJobs.length === 0 && (
							<p className="text-muted">No jobs match your search.</p>
						)}
						<small className="text-muted d-block mt-1">
							Click a job in the list below to add or remove it from this applicant. This does not change the applicant number.
						</small>
					</div>
				</div>

				<div className="row">
					<div className="col-12">
						<Button color="green" type="submit" disabled={saving}>
							{saving ? 'Saving...' : 'Save Changes'}
						</Button>
					</div>
				</div>
			</form>

			<Modal
				opened={saveConfirmOpen}
				onClose={handleContinueEditing}
				size="md"
				title="Applicant Saved"
			>
				<Text>
					Applicant information has been saved successfully. Would you like to return to the preview page or continue editing?
				</Text>
				<Group justify="flex-end" mt="md">
					<Button color="gray" onClick={handleContinueEditing}>
						Continue Editing
					</Button>
					<Button color="blue" onClick={handleReturnToPreview}>
						Return to Preview
					</Button>
				</Group>
			</Modal>

			<Modal
				opened={viewJobModalOpen}
				onClose={() => setViewJobModalOpen(false)}
				size="lg"
				title="Job Details"
			>
				{!selectedJob && <p className="mb-0">No job selected.</p>}
				{selectedJob && (
					<>
						<div className="mb-3">
							<p><strong>Job Number:</strong> {selectedJob.job_number || 'N/A'}</p>
							<p><strong>Job Type:</strong> {selectedJob.job_type || 'N/A'}</p>
							<p><strong>Status:</strong> {selectedJob.job_status_descrp || selectedJob.job_status || 'N/A'}</p>
							<p><strong>Approved:</strong> {selectedJob.approved ? 'Yes' : 'No'}</p>
							<p><strong>Description:</strong> {selectedJob.job_description || 'N/A'}</p>
							<p>
								<strong>Property:</strong>{' '}
								{selectedJob.property
										? `${selectedJob.property.house_num || ''} ${selectedJob.property.street_name || ''}${selectedJob.property.borough ? ', ' + selectedJob.property.borough : ''}`.trim()
										: 'N/A'}
							</p>
						</div>
						{selectedJob.property && (
							<Mapgl
								newLocation={`${selectedJob.property.house_num || ''} ${selectedJob.property.street_name || ''}, ${selectedJob.property.borough || ''}`}
							/>
						)}
					</>
				)}
				<Group justify="space-between" mt="md">
					{selectedJob && (
						<Button
							color={formData.jobs.includes(getJobId(selectedJob)) ? 'red' : 'green'}
							onClick={() => handleToggleJob(selectedJob)}
						>
							{formData.jobs.includes(getJobId(selectedJob)) ? 'Unlink Job' : 'Link Job'}
						</Button>
					)}
					<Button color="gray" onClick={() => setViewJobModalOpen(false)}>
						Close
					</Button>
				</Group>
			</Modal>
		</div>
		</>
	);
}

