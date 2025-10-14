import 'ag-grid-community/styles/ag-theme-alpine.css';
import "../Applicants/table.css";

import { AllCommunityModule, themeQuartz } from 'ag-grid-community';
import { MDBBtn, MDBSpinner } from 'mdb-react-ui-kit';
import { useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { useNavigate } from 'react-router-dom';

export default function JobsTablePagination({
  tableData = [],
  loading = false,
  page = 1,
  pageSize = 100,
  total = 0,
  onPageChange = () => {},
  onPageSizeChange = () => {}
}) {

  const navigate = useNavigate();

  const colDefs = useMemo(() => ([
    { headerName: "Job Number", field: "job_number", filter: true, sortable: true, minWidth: 80, maxWidth: 150 },
    {
      headerName: "# of Contractors",
      field: "contractors",
      filter: true,
      sortable: true,
      minWidth: 80,
      maxWidth: 160,
      valueGetter: p => Array.isArray(p.data?.contractors) ? p.data.contractors.length : 0
    },
    {
      headerName: "Approved",
      field: "approved",
      filter: true,
      sortable: true,
      minWidth: 90,
      maxWidth: 140,
      valueFormatter: p => p.value ? "Yes" : "No",
      cellClass: p => p.value ? 'text-success fw-bold' : 'text-danger fw-bold'
    },
    { headerName: "Job Status", field: "job_status_descrp", filter: true, sortable: true },
    {
      headerName: "Borough",
      field: "property.borough",
      filter: true,
      sortable: true,
      valueGetter: p => p.data?.property?.borough || ''
    }
  ]), []);

  const defaultColDef = { flex: 1 };

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const startIdx = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const endIdx = Math.min(page * pageSize, total);

  return (
    <div>
      {/* External pagination controls */}
      <div className="d-flex flex-wrap align-items-center justify-content-between mb-3 gap-2">
        <div className="d-flex align-items-center gap-2">
          <label className="small fw-semibold mb-0">Rows per page:</label>
          <select
            className="form-select form-select-sm"
            style={{ width: 90 }}
            value={pageSize}
            disabled={loading}
            onChange={e => onPageSizeChange(Number(e.target.value))}
          >
            {[10, 20, 50, 100, 150, 200].map(sz => (
              <option key={sz} value={sz}>{sz}</option>
            ))}
          </select>
        </div>

        <div className="small text-muted">
          {loading
            ? "Loading..."
            : total === 0
              ? "No records"
              : `${startIdx}-${endIdx} of ${total}`}
        </div>

        <div className="d-flex align-items-center gap-2">
          <MDBBtn size="sm" color="light" disabled={loading || page <= 1}
                  onClick={() => onPageChange(1)}>«</MDBBtn>
          <MDBBtn size="sm" color="light" disabled={loading || page <= 1}
                  onClick={() => onPageChange(page - 1)}>Prev</MDBBtn>
          <span className="small fw-semibold">Page {page} / {totalPages}</span>
          <MDBBtn size="sm" color="light" disabled={loading || page >= totalPages}
                  onClick={() => onPageChange(page + 1)}>Next</MDBBtn>
          <MDBBtn size="sm" color="light" disabled={loading || page >= totalPages}
                  onClick={() => onPageChange(totalPages)}>»</MDBBtn>
        </div>
      </div>

      {loading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ height: "600px" }}>
          <MDBBtn disabled color='dark' outline size='lg'>
            <MDBSpinner grow size="sm" role="status" tag="span" className="me-2" />
            Loading...
          </MDBBtn>
        </div>
      ) : (
        <div className="ag-theme-alpine" style={{ width: "100%", height: "700px" }}>
          <AgGridReact
            rowData={tableData}
            columnDefs={colDefs}
            defaultColDef={defaultColDef}
            rowHeight={50}
            modules={[AllCommunityModule]}
            pagination={false}             // server-side handled externally
            suppressPaginationPanel={true}
            accentColor="blue"
            theme={themeQuartz}
            onRowClicked={params => {
              if (params.data?.job_id) navigate(`${params.data.job_id}`);
            }}
          />
        </div>
      )}
    </div>
  );
}
