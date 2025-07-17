import 'ag-grid-community/styles/ag-theme-alpine.css';
import "./table.css"

import { AllCommunityModule, themeQuartz } from 'ag-grid-community';
import { useEffect, useState } from 'react';

import { AgGridReact } from 'ag-grid-react';
import { useNavigate } from 'react-router-dom';

export default function Table_Custom({ tableData }) {
  const [rowData, setRowData] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    setRowData(Array.isArray(tableData) ? tableData : []);
  }, [tableData]);

  const [colDefs] = useState([
    { headerName: "First Name", field: "applicant_firstName", filter: true, sortable: true, },
    { headerName: "Last Name", field: "applicant_lastName", filter: true, sortable: true },
    { headerName: "License", field: "applicant_license", filter: true, sortable: true },
    {
      headerName: "# of Job Listing",
      field: "job_listing",
      filter: true,
      sortable: true,
      valueGetter: params => Array.isArray(params.data.job_listing) ? params.data.job_listing.length : 0,
      cellRenderer: params => {
        const jobs = params.data.job_listing;
        let jobListings = "no jobs";
        if (Array.isArray(jobs) && jobs.length > 0) {
          jobListings = jobs.length;
        }
        return (
          <span>{jobListings}</span>
        );
      }
    }
  ]);

  const defaultColDef = {
    flex: 1,
  };
  const pagination = true;
  const paginationPageSize = 50;
  const paginationPageSizeSelector = [10, 20, 50, 100];

  return (
    <div>
      <div className="ag-theme-alpine" style={{ width: "100%", height: "700px" }}>
        <AgGridReact
          rowData={rowData}
          columnDefs={colDefs}
          rowHeight={50}
          defaultColDef={defaultColDef}
          modules={[AllCommunityModule]}
          pagination={pagination}
          paginationPageSize={paginationPageSize}
          paginationPageSizeSelector={paginationPageSizeSelector}
          accentColor="blue"
          theme={themeQuartz}
          onRowClicked={params => {
            navigate(`applicants/${params.data._id}`);
          }}
        />
      </div>
    </div>
  )
}
