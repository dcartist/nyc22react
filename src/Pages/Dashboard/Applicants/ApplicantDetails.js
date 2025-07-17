import React, {useState, useEffect} from 'react'
import {getOneApplication} from '../../../services/api'
import { useParams } from 'react-router-dom';
import { MDBListGroup, MDBListGroupItem, MDBBadge, MDBCard, MDBCardHeader, MDBContainer, MDBRow, MDBCol, MDBAccordion, MDBAccordionItem } from 'mdb-react-ui-kit';


export default function ApplicantDetails() {
  const [data, setApplicant] = useState(null);
  const { applicantId } = useParams();
  const [active, setActive] = useState(1);

  useEffect(() => {
    getOneApplication(applicantId)
      .then(data => {
        setApplicant(data);
        console.log("Applicant details fetched:", data);
      })
      .catch(error => {
        console.error('Error fetching applicant details:', error);
      });
  }, []);

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div className='d-flex justify-content-center direction-column'>
      <MDBContainer>
      <MDBRow className='justify-content-center'>
        <MDBCol md='8'>
<MDBCard className='p-5'>
      <MDBCardHeader><h1>Applicant Details</h1></MDBCardHeader>
     <MDBListGroup flush>
      <MDBListGroupItem className='d-flex justify-content-between align-items-center text-start'>
        <div className=''>
          <div className='fw-bold'>Name:</div>
          <div className='text-muted'>{data.applicant_firstName} {data.applicant_lastName}</div>
        </div>
        <div><div className='fw-bold'>Title:</div>
        <MDBBadge color='primary' className='p-2 fs-6'>
          {data.applicant_title}
        </MDBBadge></div>
          
      </MDBListGroupItem>
      <MDBListGroupItem className='d-flex justify-content-between align-items-center'>
        <div>
          <div className='fw-bold'>license:</div>
          <div className='text-muted'>{data.applicant_license}</div>
        </div>
        <div><div className='fw-bold'>Job Applied:</div>

          <span className=''>{data.job_listing.length > 0 ? data.job_listing.length : 'N/A'}</span>
       </div>
      </MDBListGroupItem>
    </MDBListGroup>
 </MDBCard>
 </MDBCol>
      </MDBRow>
      <MDBRow className='mt-4 justify-content-center'>
        <MDBCol md='8'>
          <h2>Job Listings</h2>
          <MDBAccordion initialActive={1} active={active} onChange={(itemId) => setActive(itemId)}>
           
                {data.job_listing.map((detail, index) => (
                   <MDBAccordionItem className='fw-bold' collapseId={index+1} headerTitle={`Job ${index + 1} - ${detail.job_number}`} key={index}>
                    <MDBListGroup flush>
                  <MDBListGroupItem key={index} className='d-flex justify-content-between align-items-center'>
                  <div className='text-muted'>{detail.job_number}</div>
                  </MDBListGroupItem>
                    </MDBListGroup>
            </MDBAccordionItem>
                ))}
            
          </MDBAccordion>
        </MDBCol>
      </MDBRow>
      </MDBContainer>

   
    </div>
  );
}

