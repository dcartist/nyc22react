import 'ag-grid-community/styles/ag-theme-alpine.css';
import "../Applicants/table.css"

import { AllCommunityModule, themeQuartz } from 'ag-grid-community';
import { MDBBtn, MDBSpinner } from 'mdb-react-ui-kit';
import { useEffect, useState } from 'react';

import { AgGridReact } from 'ag-grid-react';
import { useNavigate } from 'react-router-dom';

export default function JobsTable({ tableData }) {
  const [rowData, setRowData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    if (Array.isArray(tableData)) {
      setRowData(tableData);
      setLoading(false);
    } else {
      setRowData([]);
      setLoading(false);
    }
  }, [tableData]);

  const [colDefs] = useState([
    { headerName: "Job Number", field: "job_number", filter: true, sortable: true, minWidth: 50, maxWidth: 150,  resizable: false  },
    { headerName: "# of Contractors", field: "contractors", filter: true, sortable: true, minWidth: 50, maxWidth: 150,  resizable: false  },
    { headerName: "Approved", field: "approved", filter: true, sortable: true, minWidth: 50, maxWidth: 150 },
    { headerName: "Job Status", field: "job_status_descrp", filter: true, sortable: true },
    // { headerName: "Property", field: "property", filter: true, sortable: true },
    { headerName: "Borough", field: "property.borough", filter: true, sortable: true },
    // {
    //   headerName: "# of Job Listing",
    //   field: "job_listing",
    //   filter: true,
    //   sortable: true,
    //   valueGetter: params => Array.isArray(params.data.job_listing) ? params.data.job_listing.length : 0,
    //   cellRenderer: params => {
    //     const jobs = params.data.job_listing;
    //     let jobListings = "no jobs";
    //     if (Array.isArray(jobs) && jobs.length > 0) {
    //       jobListings = jobs.length;
    //     }
    //     return (
    //       <span>{jobListings}</span>
    //     );
    //   }
    // }
  ]);

  const defaultColDef = {
    flex: 1,
  };
  const pagination = true;
  const paginationPageSize = 100;
  const paginationPageSizeSelector = [10, 20, 50, 100, 150, 200];

  return (
    <div>
      {loading || rowData.length === 0 ? (
        <div className="d-flex justify-content-center align-items-center" style={{ height: "700px" }}>
          <MDBBtn disabled color='dark' outline size='lg'>
            <MDBSpinner grow size="sm" role="status" tag="span" className="me-2" />
            Loading...
          </MDBBtn>
        </div>
      ) : (
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
            // onRowClicked={params => {
            //   navigate(`applicants/${params.data._id}`);
            // }}
          />
        </div>
      )}
    </div>
  )
}
