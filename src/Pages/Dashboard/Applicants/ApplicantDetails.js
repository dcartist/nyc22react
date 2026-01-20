import React, {useState, useEffect} from 'react'
import {getOneApplication} from '../../../services/api'
import { Link, useParams } from 'react-router-dom';
import { Badge, Card } from '@mantine/core';
import "./Applicant.css"

export default function ApplicantDetails() {
  const [data, setApplicant] = useState(null);
  const { applicantId } = useParams();
  const [active, setActive] = useState(0);

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
  // Normalize job listings to a safe array of objects
  const safeJobListings = Array.isArray(data.job_listing)
    ? data.job_listing.filter(j => j && typeof j === 'object')
    : [];

  const jobListingCount = safeJobListings.length;

  const jobAccordionItems = safeJobListings.map((detail, index) => {
    const property = detail && detail.property ? detail.property : {};
    const houseNum = property.house_num || '';
    const streetName = property.street_name || '';
    const borough = property.borough || '';
    const isOpen = active === index;

    return (
      <div className="accordion-item" key={index}>
        <h2 className="accordion-header">
          <button
            className={'accordion-button' + (isOpen ? '' : ' collapsed')}
            type="button"
            onClick={() => setActive(isOpen ? -1 : index)}
          >
            {`Job No. #${detail.job_number} `}
            <Badge color={detail.approved ? 'blue' : 'red'} className='ms-2'>
              {detail.approved ? 'Approved' : 'Not Approved'}
            </Badge>
          </button>
        </h2>
        <div className={'accordion-collapse collapse' + (isOpen ? ' show' : '')}>
          <div className='accordion-body text-start'>
            <div className='fw-bold'>Address: <span className='fw-normal'>{houseNum} {streetName}</span></div>
            <div className='fw-bold'>Borough: <span className='fw-normal'>{borough || 'N/A'}</span></div>
            <div>
              <div className='fw-bold text-start'>Description:</div>
              <div className='fw-normal'>{detail.job_description}</div>
            </div>
            <div className='fw-bold'>Description Status:</div>
            <div className='fw-normal'>{detail.job_status_descrp}</div>
            <div className='fw-bold'>Job Type: <span className='fw-normal'>{detail.job_type}</span></div>
          </div>
        </div>
      </div>
    );
  });

  return (
    <div className="container my-4">
      <h1>Applicant Details</h1>
      <div className="row justify-content-center">
        <div className="col-12 col-md-8">
<Card className='p-5 w-100'>
      <Card.Section className='d-flex justify-content-between align-items-center px-3 py-2 border-bottom'>
        <span></span>
        {applicantId && (
          <Link
            to={`/dashboard/applicants/${applicantId}/edit`}
            className="btn btn-warning btn-sm"
          >
            Edit Applicant
          </Link>
        )}
      </Card.Section>
     <ul className='list-group'>
      <li className='list-group-item d-flex justify-content-between align-items-center text-start'>
        <div className=''>
          <div className='fw-bold'>Name:</div>
          <div className='text-muted'>{data.applicant_firstName} {data.applicant_lastName}</div>
        </div>
        <div><div className='fw-bold'>Title:</div>
        <Badge color='blue' className='p-2 fs-6'>
          {data.applicant_title}
        </Badge></div>
          
      </li>
      <li className='list-group-item d-flex justify-content-between align-items-center'>
        <div>
          <div className='fw-bold'>license:</div>
          <div className='text-muted'>{data.applicant_license}</div>
        </div>
        <div><div className='fw-bold'>Job Applied:</div>

          <span className=''>{jobListingCount > 0 ? jobListingCount : 'N/A'}</span>
       </div>
      </li>
    </ul>

     <h2 className='mt-4 d-flex justify-content-between align-items-center'>
       <span>Job Listings</span>
       <Link
         to="/dashboard/jobs/add"
         state={{ prefillApplicant: data }}
         className="btn btn-primary btn-sm"
       >
         Create New Job
       </Link>
     </h2>
          <div className="accordion" id="applicantJobListingsAccordion">
            {jobAccordionItems}
          </div>
 </Card>
        </div>
      </div>
    </div>
  );
}

