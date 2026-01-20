import { Badge, Card, Container, Grid } from '@mantine/core';
import { formatToCurrency, isoToReadable } from '../../../services/conversions';
import { useEffect, useState } from 'react'

import { NYMap } from "../../../Components/Map";
import Mapgl from "../../../Components/Map_gl";
import { getOneJob } from '../../../services/api';
import { Link, useParams } from 'react-router-dom';

export default function JobDetails() {
    const { jobId } = useParams();
    const [data, setJobDetails] = useState(null);
    const [error, setError] = useState("");
    const [active, setActive] = useState(1);

    useEffect(() => {
        const fetchJobDetails = async () => {
            try {
                const jobData = await getOneJob(jobId);
                setJobDetails(jobData);
            } catch (err) {
                setError("Failed to fetch job details");
            }
        };
        fetchJobDetails();
    }, [jobId]);

    return (
        <div>
            {error && <div className="alert alert-danger">{error}</div>}
            {data && ( <div className='d-flex justify-content-center direction-column'>
                <Container>
                    <Grid className='justify-content-center'>
                        <Grid.Col span={{ base: 12, md: 8 }}>
                            <Card className='p-5'>
                                                                <Card.Section className='d-flex justify-content-between align-items-center px-3 py-2 border-bottom'>
                                                                    <h2 className='mb-0'>Job Information</h2>
                                                                    {jobId && (
                                                                        <Link
                                                                            to={`/dashboard/jobs/${jobId}/edit`}
                                                                            className="btn btn-warning btn-sm"
                                                                        >
                                                                            Edit Job
                                                                        </Link>
                                                                    )}
                                                                </Card.Section>
                                 
                                <ul className='list-group mb-5 text-start'>
                                    <li className='list-group-item d-flex justify-content-between'>
                                        <div>
                                            <div className='fw-bold'>Job Approval Status:</div>
                                            <div className={`fw-normal mb-2 ${data && data.approved ? 'text-success' : 'text-danger'}`}>
                                                {data ? (data.approved ? 'Approved' : 'Not Approved') : 'N/A'}
                                            </div>
                                            <div className='fw-bold '>Approved on:</div>
                                            <div className='fw-normal mb-4'>
                                                {data ? (data.approved_date ? isoToReadable(data.approved_date) : 'N/A') : 'N/A'}
                                            </div>
                                            <div className='fw-bold'>Job Status:</div>
                                            <div className={`fw-normal ${data && data.job_status_descrp ? 'text-success' : 'text-danger'}`}>
                                                {data ? data.job_status_descrp : 'N/A'}
                                            </div>
                                            <div className='fw-bold'>Job Type:</div>
                                            <div className='text-muted'>{data.job_type}</div>
                                        </div>
                                        <div>
                                            <div className='fw-bold'>Job Number:</div>
                                            <div className='text-muted'>{data.job_number}</div>
                                        </div>
                                    </li>

                                    <li className='list-group-item d-flex justify-content-between align-items-center text-start'>
                                        <div>
                                            <div className='fw-bold'>Job Initial Cost:</div>
                                            <div className='text-muted'>{formatToCurrency(data.initial_cost)}</div>
                                            <div className='fw-bold'>Total Estimate Fee:</div>
                                            <div className='text-muted mb-3'>{formatToCurrency(data.total_est__fee)}</div>
                                            <div className='fw-bold'>Paid:</div>
                                            <div className='text-muted'>{isoToReadable(data.paid)}</div>
                                        </div>
                                    </li>

                                    <li className='list-group-item text-start'>
                                        <div>
                                            <div className='fw-bold'>Job Description:</div>
                                            <div className='text-muted'>{data ? data.job_description : 'N/A'}</div>
                                        </div>
                                    </li>
                                </ul>



                                    <h2>Applicant Information</h2>
                                    <ul className='list-group text-start mb-4'>
                                    <li className='list-group-item d-flex justify-content-between align-items-center text-start'>
                                        <div className=''>
                                            <div className='fw-bold'>Name:</div>
                                            <div className='text-muted'>{data.application.applicant_firstName} {data.application.applicant_lastName}</div>
                                        </div>
                                        <div><div className='fw-bold'>Title:</div>
                                            <Badge color='blue' className='p-2 fs-6'>
                                                {data.application.applicant_title}
                                                </Badge></div>

                                            </li>
                                            <li className='list-group-item d-flex justify-content-between align-items-center'>
<div>

                                            <div className='fw-bold'>License:</div>
                                            <div className='text-muted'>{data.application.applicant_license}</div>
</div>
                                        </li>
</ul>

       <h2>Property Information</h2>


                                     <ul className='list-group text-start mb-4'>
                                         <li className='list-group-item'>
                                            <div>
                                            <div className='fw-bold'>Property Owner: </div>
                                            <div className='fw-normal mb-3'>{data.property ? `${data.property.property_owner_firstName} ${data.property.property_owner_lastName}` : 'N/A'}</div>
                                       
                                          
                                            </div>
                                            
                                        </li>
                                        <li className='list-group-item'>
                                            <div className='fw-bold'>Address: <span className='fw-normal'>{data.property ? `${data.property.house_num} ${data.property.street_name}` : 'N/A'}</span></div>
                                        </li>
                                        <li className='list-group-item'>
                                            <div className='fw-bold'>Borough: <span className='fw-normal'>{data.property ? data.property.borough : 'N/A'}</span></div>
                                        </li>
                                         <li className='list-group-item'>
                                                 <div className='fw-bold'>Property Owner Type: </div>
                                            <span className='fw-normal'>{data.property ? `${data.property.owner_type}` : 'N/A'}</span>
                                          <div className='fw-bold'>Building Type: </div><span className='fw-normal'>{data.property ? data.property.building_type : 'N/A'}</span>
                                            <div className='fw-bold'>Non Profit: </div>
                                            <span className='fw-normal'>{data.property ? `${data.property.non_profit}` : 'N/A'}</span>
                                          <div className='fw-bold'>Existing Occupancy: </div><span className='fw-normal'>{data.property ? data.property.existing_occupancy : 'N/A'}</span>
                                        </li>
                                        <li className='list-group-item'>
                                           {/* <NYMap newLocation={`${data.property.house_num} ${data.property.street_name}, ${data.property.borough}`} /> */}
                                             <Mapgl newLocation={`${data.property.house_num} ${data.property.street_name}, ${data.property.borough}`} />
                                        </li>
                                       
                                    </ul>


                            </Card>
                        </Grid.Col>
                    </Grid>

                </Container>


            </div>)}
           
        </div>
    )
}
