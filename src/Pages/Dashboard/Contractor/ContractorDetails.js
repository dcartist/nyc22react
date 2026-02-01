import React, {useState, useEffect} from 'react'
import {getOneContractor} from '../../../services/api'
import { Link, useParams } from 'react-router-dom';
import { MDBListGroup, MDBListGroupItem, MDBBadge, MDBCard, MDBCardHeader, MDBContainer, MDBRow, MDBCol, MDBAccordion, MDBAccordionItem } from 'mdb-react-ui-kit';
import "./Contractor.css"

export default function ContractorDetails() {
  const [data, setContractor] = useState(null);
  const { contractorId } = useParams();
  const [active, setActive] = useState(1);

  useEffect(() => {
    getOneContractor(contractorId)
      .then(data => {
        setContractor(data);
        console.log("Contractor details fetched:", data);
      })
      .catch(error => {
        console.error('Error fetching contractor details:', error);
      });
  }, [contractorId]);

  if (!data) {
    return <div>Loading...</div>;
  }
  
  // Normalize jobs to a safe array of objects (jobs field has populated data)
  const safeJobs = Array.isArray(data.jobs)
    ? data.jobs.filter(j => j && typeof j === 'object')
    : [];

  const jobCount = safeJobs.length;

  const jobAccordionItems = safeJobs.map((job, index) => {
    const property = job && job.property ? job.property : {};
    const houseNum = property.house_num || '';
    const streetName = property.street_name || '';
    const borough = property.borough || '';

    return (
      <MDBAccordionItem
        key={index}
        className='fw-bold'
        collapseId={index + 1}
        headerTitle={
          <>
            {`Job No. #${job.job_number} `}
            <MDBBadge color={job.approved ? 'primary' : 'danger'} className='ms-2'>
              {job.approved ? 'Approved' : 'Not Approved'}
            </MDBBadge>
          </>
        }
      >
        <MDBListGroup className='text-start m-3'>
          <MDBListGroupItem>
            <div className='fw-bold'>Address: <span className='fw-normal'>{houseNum} {streetName}</span></div>
          </MDBListGroupItem>
          <MDBListGroupItem>
            <div className='fw-bold'>Borough: <span className='fw-normal'>{borough || 'N/A'}</span></div>
          </MDBListGroupItem>
          <MDBListGroupItem>
            <div>
              <div className='fw-bold text-start'>Description:</div>
              <div className='fw-normal'>{job.job_description}</div>
            </div>
          </MDBListGroupItem>
          <MDBListGroupItem>
            <div className='fw-bold'>Description Status:</div>
            <div className='fw-normal'>{job.job_status_descrp}</div>
          </MDBListGroupItem>
          <MDBListGroupItem>
            <div className='fw-bold'>Job Type: <span className='fw-normal'>{job.job_type}</span></div>
          </MDBListGroupItem>
        </MDBListGroup>
      </MDBAccordionItem>
    );
  });

  return (
    <div className='d-flex justify-content-center direction-column'>
      <MDBContainer>
      <MDBRow className='justify-content-center'>
        <h1>Contractor Details</h1>
        <MDBCol md='8'>
<MDBCard className='p-5'>
      <MDBCardHeader className='d-flex justify-content-between align-items-center'>
        <span></span>
        {contractorId && (
          <Link
            to={`/dashboard/contractors/${contractorId}/edit`}
            className="btn btn-warning btn-sm"
          >
            Edit Contractor
          </Link>
        )}
      </MDBCardHeader>
     <MDBListGroup >
      <MDBListGroupItem className='d-flex justify-content-between align-items-center text-start'>
        <div className=''>
          <div className='fw-bold'>Name:</div>
          <div className='text-muted'>{data.first_name} {data.last_name}</div>
        </div>
        <div>
          <div className='fw-bold'>License Status:</div>
          <MDBBadge color={data.license_status?.toLowerCase().includes('active') ? 'success' : 'warning'} className='p-2 fs-6'>
            {data.license_status || 'N/A'}
          </MDBBadge>
        </div>
      </MDBListGroupItem>
      <MDBListGroupItem className='d-flex justify-content-between align-items-center text-start'>
        <div>
          <div className='fw-bold'>Business Name:</div>
          <div className='text-muted'>{data.business_name || 'N/A'}</div>
        </div>
        <div>
          <div className='fw-bold'>License Type:</div>
          <div className='text-muted'>{data.license_type || 'N/A'}</div>
        </div>
      </MDBListGroupItem>
      <MDBListGroupItem className='d-flex justify-content-between align-items-center text-start'>
        <div>
          <div className='fw-bold'>License Number:</div>
          <div className='text-muted'>{data.license_number || 'N/A'}</div>
        </div>
        <div>
          <div className='fw-bold'>Phone:</div>
          <div className='text-muted'>{data.business_phone_number || 'N/A'}</div>
        </div>
      </MDBListGroupItem>
      <MDBListGroupItem className='text-start'>
        <div className='fw-bold'>Business Address:</div>
        <div className='text-muted'>
          {data.business_house_number} {data.business_street_name}
          {(data.business_house_number || data.business_street_name) && <br />}
          {data.license_business_city && `${data.license_business_city}, `}
          {data.business_state} {data.business_zip_code}
        </div>
      </MDBListGroupItem>
      <MDBListGroupItem className='d-flex justify-content-between align-items-center'>
        <div>
          <div className='fw-bold'>Jobs Assigned:</div>
          <span className=''>{jobCount > 0 ? jobCount : 'N/A'}</span>
        </div>
      </MDBListGroupItem>
    </MDBListGroup>

     <h2 className='mt-4 d-flex justify-content-between align-items-center'>
       <span>Assigned Jobs</span>
       <Link
         to="/dashboard/jobs/add"
         state={{ prefillContractor: data }}
         className="btn btn-primary btn-sm"
       >
         Create New Job
       </Link>
     </h2>
          <MDBAccordion
            initialActive={1}
            active={active}
            onChange={(itemId) => setActive(itemId)}
          >
            {jobAccordionItems}
          </MDBAccordion>
 </MDBCard>
 </MDBCol>
      </MDBRow>
      
      </MDBContainer>

   
    </div>
  );
}
