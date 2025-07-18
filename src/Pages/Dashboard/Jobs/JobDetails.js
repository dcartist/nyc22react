import { MDBAccordion, MDBAccordionItem, MDBBadge, MDBCard, MDBCardHeader, MDBCol, MDBContainer, MDBListGroup, MDBListGroupItem, MDBRow } from 'mdb-react-ui-kit';
import { formatToCurrency, isoToReadable } from '../../../services/conversions';
import { useEffect, useState } from 'react'

import { NYMap } from "../../../Components/Map";
import { getOneJob } from '../../../services/api';
import { useParams } from 'react-router-dom';

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
                <MDBContainer>
                    <MDBRow className='justify-content-center'>
                        <MDBCol md='8'>
                            <MDBCard className='p-5'>
                                <MDBCardHeader><h2>Job Information</h2></MDBCardHeader>
                                 
                                <MDBListGroup className='mb-5'>
                                    <MDBListGroupItem className='d-flex justify-content-between text-start'>

                                        <div>
                                            <div className='fw-bold'>Job Approval Status:</div>
                                            <div className={`fw-normal mb-2 ${data && data.approved ? 'text-success' : 'text-danger'}`}>
                                                {data ? (data.approved ? "Approved" : "Not Approved") : 'N/A'}
                                            </div>
                                            <div className='fw-bold '>Approved on: 
                                            </div>
 <div className='fw-normal mb-4'>{data ? (data.approved_date ? isoToReadable(data.approved_date) : "N/A") : 'N/A'}</div>
                                             <div className='fw-bold'>Job Status:</div>
                                            <div className={`fw-normal ${data && data.job_status_descrp ? 'text-success' : 'text-danger'}`}>
                                                {data ? data.job_status_descrp : 'N/A'}
                                            </div>
                                         <div className='fw-bold'>Job Type:</div>
                                            <div className='text-muted'>{data.job_type}</div>
                                        </div>
                                        <div className=''>
                                            <div className='fw-bold'>Job Number:</div>
                                            <div className='text-muted'>{data.job_number}</div>

                                        </div>
                                        
                                    </MDBListGroupItem>
                                    
                                    {/* <MDBListGroupItem className='d-flex justify-content-between align-items-center text-start'>
                                        <div>
                                  
                                        </div>
                                        <div>
                                           
                                        </div>
                                    </MDBListGroupItem> */}
                                    <MDBListGroupItem className='d-flex justify-content-between align-items-center text-start'>
                                        <div>
                                            <div className='fw-bold'>Job Initial Cost:</div>
                                            <div className='text-muted'>{formatToCurrency(data.initial_cost)}</div>
                                             <div className='fw-bold'>Total Estimate Fee:</div>
                                            <div className='text-muted mb-3'>{formatToCurrency(data.total_est__fee)}</div>
                                             <div className='fw-bold'>Paid:</div>
                                            <div className='text-muted'>{isoToReadable(data.paid)}</div>
                                        </div>
                                        
                                    </MDBListGroupItem>
<MDBListGroupItem className='text-start'>
                                            <div>
                                                <div className='fw-bold'>Job Description:</div>
                                                <div className='text-muted'>{data ? data.job_description : 'N/A'}</div>
                                            </div>
                                        </MDBListGroupItem>
                                </MDBListGroup>



                                    <h2>Applicant Information</h2>
                                    <MDBListGroup className='text-start mb-4'>
                                    <MDBListGroupItem className='d-flex justify-content-between align-items-center text-start'>
                                        <div className=''>
                                            <div className='fw-bold'>Name:</div>
                                            <div className='text-muted'>{data.application.applicant_firstName} {data.application.applicant_lastName}</div>
                                        </div>
                                        <div><div className='fw-bold'>Title:</div>
                                            <MDBBadge color='primary' className='p-2 fs-6'>
                                                {data.application.applicant_title}
                                            </MDBBadge></div>

                                    </MDBListGroupItem>
                                    <MDBListGroupItem className='d-flex justify-content-between align-items-center'>
<div>

                                            <div className='fw-bold'>License:</div>
                                            <div className='text-muted'>{data.application.applicant_license}</div>
</div>
                                        </MDBListGroupItem>
</MDBListGroup>

       <h2>Property Information</h2>


                                   <MDBListGroup className='text-start mb-4'>
                                         <MDBListGroupItem>
                                            <div>
                                            <div className='fw-bold'>Property Owner: </div>
                                            <div className='fw-normal mb-3'>{data.property ? `${data.property.property_owner_firstName} ${data.property.property_owner_lastName}` : 'N/A'}</div>
                                       
                                          
                                            </div>
                                            
                                        </MDBListGroupItem>
                                        <MDBListGroupItem>
                                            <div className='fw-bold'>Address: <span className='fw-normal'>{data.property ? `${data.property.house_num} ${data.property.street_name}` : 'N/A'}</span></div>
                                        </MDBListGroupItem>
                                        <MDBListGroupItem>
                                            <div className='fw-bold'>Borough: <span className='fw-normal'>{data.property ? data.property.borough : 'N/A'}</span></div>
                                        </MDBListGroupItem>
                                         <MDBListGroupItem>
                                                 <div className='fw-bold'>Property Owner Type: </div>
                                            <span className='fw-normal'>{data.property ? `${data.property.owner_type}` : 'N/A'}</span>
                                          <div className='fw-bold'>Building Type: </div><span className='fw-normal'>{data.property ? data.property.building_type : 'N/A'}</span>
                                            <div className='fw-bold'>Non Profit: </div>
                                            <span className='fw-normal'>{data.property ? `${data.property.non_profit}` : 'N/A'}</span>
                                          <div className='fw-bold'>Existing Occupancy: </div><span className='fw-normal'>{data.property ? data.property.existing_occupancy : 'N/A'}</span>


                                        </MDBListGroupItem>
                                        <MDBListGroupItem>
                                           <NYMap newLocation={`${data.property.house_num} ${data.property.street_name}, ${data.property.borough}`} />
                                        </MDBListGroupItem>
                                       
                                    </MDBListGroup>


      
                                {/* <MDBAccordion initialActive={1} active={active} onChange={(itemId) => setActive(itemId)}>
            
                 {data.job_listing.map((detail, index) => (
                   <MDBAccordionItem
                     className='fw-bold'
                     collapseId={index + 1}
                     headerTitle={
                       <>
                         {`Job No. #${detail.job_number} `}
                         <MDBBadge color={detail.approved ? 'primary' : 'danger'} className='ms-2'>
                           {detail.approved ? 'Approved' : 'Not Approved'}
                         </MDBBadge>
                       </>
                     }
                     key={index}
                   >
                     <MDBListGroup className='text-start m-3' >
                       
                       <MDBListGroupItem key={index} >
                          <div className='fw-bold'>Address: <span className='fw-normal'>{detail.property.house_num} {detail.property.street_name}</span></div>
                       </MDBListGroupItem>
                       <MDBListGroupItem key={index} >
                          <div className='fw-bold'>Borough: <span className='fw-normal'>{detail.property.borough}</span></div>
                       </MDBListGroupItem>
                       <MDBListGroupItem key={index} >
                          <div><div className='fw-bold text-start'>Description:</div><div className='fw-normal'>{detail.job_description}</div></div>
                       </MDBListGroupItem>
                       <MDBListGroupItem key={index} >
                          <div className='fw-bold'>Description Status:</div><div className='fw-normal'>{detail.job_status_descrp}</div>
                       </MDBListGroupItem>
                       <MDBListGroupItem key={index} >
                          <div className='fw-bold'>Job Type: <span className='fw-normal'>{detail.job_type}</span></div>
                       </MDBListGroupItem>
                     </MDBListGroup>
                   </MDBAccordionItem>
                 ))}
             
           </MDBAccordion> */}
                            </MDBCard>
                        </MDBCol>
                    </MDBRow>

                </MDBContainer>


            </div>)}
           
        </div>
    )
}
