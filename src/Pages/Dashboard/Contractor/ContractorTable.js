import 'ag-grid-community/styles/ag-theme-alpine.css';
import "./Contractor.css"

import { AllCommunityModule, themeQuartz } from 'ag-grid-community';
import { MDBBtn, MDBSpinner } from 'mdb-react-ui-kit';
import { useEffect, useState } from 'react';

import { AgGridReact } from 'ag-grid-react';
import { useNavigate } from 'react-router-dom';

export default function ContractorTable({ tableData }) {
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
    { 
      headerName: "Name", 
      filter: true, 
      sortable: true,
      valueGetter: params => {
        const firstName = params.data.first_name || '';
        const lastName = params.data.last_name || '';
        return `${firstName} ${lastName}`.trim() || 'N/A';
      }
    },
    { headerName: "License #", field: "license_number", filter: true, sortable: true },
    { headerName: "License Type", field: "license_type", filter: true, sortable: true },
    { 
      headerName: "Status", 
      field: "license_status", 
      filter: true, 
      sortable: true,
      cellRenderer: params => {
        const status = params.data.license_status || 'N/A';
        const color = status.toLowerCase().includes('active') ? 'success' : 'secondary';
        return <span className={`badge bg-${color}`}>{status}</span>;
      }
    },
    {
      headerName: "# of Jobs",
      field: "job_listing",
      filter: true,
      sortable: true,
      valueGetter: params => Array.isArray(params.data.job_listing) ? params.data.job_listing.length : 0,
      cellRenderer: params => {
        const jobs = params.data.job_listing;
        let jobCount = "no jobs";
        if (Array.isArray(jobs) && jobs.length > 0) {
          jobCount = jobs.length;
        }
        return (
          <span>{jobCount}</span>
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
            onRowClicked={params => {
              navigate(`${params.data._id}`);
            }}
          />
        </div>
      )}
    </div>
  )
}
