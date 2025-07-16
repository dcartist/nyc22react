import React, {useEffect, useState} from 'react';
import { MDBDatatable } from 'mdb-react-ui-kit';

export default function DataTables({data}) {
    const [datatableData, setDatatableData] = useState({});
    const [error, setError] = useState("");
    useEffect(() => {
        if (data && data.length > 0) {
            const tableData = data.map(app => [
                app.applicant_firstName || '',
                app.applicant_lastName || '',
                app.applicant_license || '',
                app.job_listing , // Assuming jobs is an array
                // app.startDate || '',
                // app.salary || ''                        
            ]);
            setDatatableData({
                columns: ['First Name', 'Last Name', 'License', 'Jobs'],
                rows: tableData
            });
        } else {
            setError("No data available");
        }
    }, [data]); 

console.log("DataTables data:", datatableData);
  const basicData = {
    columns: ['First Name', 'Last Name', 'License', 'Jobs'],
    rows: [
      ['Tiger Nixon', 'System Architect', 'Edinburgh', '61'],
      ['Garrett Winters', 'Accountant', 'Tokyo', '63'],
      ['Ashton Cox', 'Junior Technical Author', 'San Francisco', '66'],
      ['Cedric Kelly', 'Senior Javascript Developer', 'Edinburgh', '22'],
      ['Airi Satou', 'Accountant', 'Tokyo', '33'],
      ['Brielle Williamson', 'Integration Specialist', 'New York', '61'],
      ['Herrod Chandler', 'Sales Assistant', 'San Francisco', '59'],
      ['Rhona Davidson', 'Integration Specialist', 'Tokyo', '55'],
      ['Colleen Hurst', 'Javascript Developer', 'San Francisco', '39'],
      ['Sonya Frost', 'Software Engineer', 'Edinburgh', '23'],
      ['Jena Gaines', 'Office Manager', 'London', '30'],
      ['Quinn Flynn', 'Support Lead', 'Edinburgh', '22'],
      ['Charde Marshall', 'Regional Director', 'San Francisco', '36'],
      ['Haley Kennedy', 'Senior Marketing Designer', 'London', '43'],
    ],
  };

  return (
    <MDBDatatable data={datatableData} />
  );
}