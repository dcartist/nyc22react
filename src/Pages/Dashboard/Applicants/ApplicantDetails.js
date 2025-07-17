import React, {useState, useEffect} from 'react'
import {getOneApplication} from '../../../services/api'
import { useParams } from 'react-router-dom';
import { MDBListGroup, MDBListGroupItem, MDBBadge, MDBCard, MDBCardHeader, MDBContainer, MDBRow, MDBCol, MDBAccordion, MDBAccordionItem } from 'mdb-react-ui-kit';
import "./Applicant.css"

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
        <h1>Applicant Details</h1>
        <MDBCol md='8'>
<MDBCard className='p-5'>
      <MDBCardHeader></MDBCardHeader>
     <MDBListGroup >
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

     <h2 className='mt-4'>Job Listings</h2>
          <MDBAccordion initialActive={1} active={active} onChange={(itemId) => setActive(itemId)}>
           
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
                      {/* <MDBListGroupItem key={index} >
                         <div className='fw-bold'>Job No: <span>{detail.job_number}</span></div>
                      </MDBListGroupItem> */}
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
            
          </MDBAccordion>
 </MDBCard>
 </MDBCol>
      </MDBRow>
      
      </MDBContainer>

   
    </div>
  );
}

