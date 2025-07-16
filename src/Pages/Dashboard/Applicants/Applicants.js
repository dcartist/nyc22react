import React, {useState, useEffect} from 'react'
import { getApplicantsByPage, getAllApplications } from '../../../services/api'
import { data } from 'react-router-dom';
import Table_Custom from '../../../Components/Tables/Applicants/Table_Custom';

export default function Applicants() {
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState("");
  useEffect(() => {
   getAllApplications()
      .then(data => {
        setApplications(data);  
        console.log("Applications fetched:", data);
      })
      .catch((err) => setError(err.message));
  }, []);


  return (
    <div>Applicants

<Table_Custom tableData={applications} />
    </div>
  )
}
