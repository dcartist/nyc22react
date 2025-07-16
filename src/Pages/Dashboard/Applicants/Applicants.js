import React, {useState, useEffect} from 'react'
import { getApplicantsByPage, getAllApplications } from '../../../services/api'
import DataTables from '../../../Components/Tables/Tables'
import { data } from 'react-router-dom';
import Table_Custom from '../../../Components/Tables/Table_Custom';

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

  if (error) return <div>Error: {error}</div>;

  return (
    <div>Applicants

<Table_Custom tableData={applications} />
    </div>
  )
}
