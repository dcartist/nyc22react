import React, {useState, useEffect} from 'react'
import {getOneApplication} from '../../../services/api'
import { useParams } from 'react-router-dom';



export default function ApplicantDetails() {
  const [data, setApplicant] = useState(null);
  const { applicantId } = useParams();

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
    <div>
      <h2>Applicant Details</h2>
      <p><strong>Name:</strong> {data.applicant_firstName} {data.applicant_lastName}</p>
      <p><strong>Email:</strong> {data.email}</p>
      <p><strong>Phone:</strong> {data.phone}</p>
      {/* Add more fields as needed */}
    </div>
  );
}

