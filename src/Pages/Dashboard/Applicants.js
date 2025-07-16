import React, {useState, useEffect} from 'react'
import { getApplicantsByPage } from '../../services/api'
import DataTables from '../../Components/Tables/Tables'
import { data } from 'react-router-dom';
import Table_Custom from '../../Components/Tables/Table_Custom';

export default function Applicants() {
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState("");
  const [dataTableInfo, setDataTableInfo] = useState([]);
//   const tableData = applications.map(app => [
//     app.firstName || '',
//     app.lastName || '',
//     app.license || '',
//     app.jobs || [],
//     app.startDate || '',
//     app.salary || ''
//   ]);
  useEffect(() => {
    getApplicantsByPage(1)
      .then(data => {
        setApplications(data);
        console.log("Applications fetched:", data);
      })
      .catch((err) => setError(err.message));
  const tableData = applications.map(app => [
   app.applicant_firstName || '',
                app.applicant_lastName || '',
                app.applicant_license || '',
                app.job_listing || [], // Assuming jobs is an array
  ]);
    console.log(applications);
    console.log(tableData);
    setDataTableInfo(tableData);
  }, []);

  if (error) return <div>Error: {error}</div>;

  // Map objects to arrays for DataTables


  return (
    <div>Applicants

        {/* {applications.length > 0 ? (
          <DataTables data={applications} />
        ) : (
          <div>No applications found</div>
        )}       */}
      {/* <DataTables data={dataTableInfo} /> */}
<Table_Custom tableData={applications} />
      {applications.length > 0 ? (
       applications.map((app, index) => (
         <p key={index}>
           {app.applicant_firstName} {app.applicant_lastName}
         </p>
        ))
      ) : (
        <div>No applications found</div>
      )}
    </div>
  )
}
