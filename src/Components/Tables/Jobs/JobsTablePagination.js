import 'ag-grid-community/styles/ag-theme-alpine.css';
import "../Applicants/table.css";

import { AllCommunityModule, themeQuartz } from 'ag-grid-community';
import { Button, Loader } from '@mantine/core';
import { useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { useNavigate, Link } from 'react-router-dom';

// React cell renderer for the Job Number column
function JobLinkRenderer(props) {
  const id = props.data?.job_id;
  const label = props.value || id || '';
  if (!id) return <span>{label}</span>;
  return (
    <Link
      to={`${id}`}              // navigates to /current-route/<job_id>
      onClick={e => e.stopPropagation()} // prevent row click from firing too
      className="text-primary text-decoration-underline"
    >
      {label}
    </Link>
  );
}

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
    {
      headerName: "Job Number",
      field: "job_number",
      filter: true,
      sortable: true,
      minWidth: 80,
      maxWidth: 150,
      cellRenderer: 'JobLinkRenderer' 
    },
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

  const rowHeight = 50;
  // Header + padding allowance
  const headerAllowance = 70;
  // Max grid body height
  const maxGridHeight = 700;
  // When no rows, keep a minimum height (e.g. spinner / empty state)
  const minGridHeight = 250;

  const visibleRows = tableData.length;
  const calculatedHeight = visibleRows === 0
    ? minGridHeight
    : Math.min(maxGridHeight, headerAllowance + (visibleRows * rowHeight));

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
          <Button size="xs" color="gray" variant="light" disabled={loading || page <= 1}
            onClick={() => onPageChange(1)}>«</Button>
          <Button size="xs" color="gray" variant="light" disabled={loading || page <= 1}
            onClick={() => onPageChange(page - 1)}>Prev</Button>
          <span className="small fw-semibold">Page {page} / {totalPages}</span>
          <Button size="xs" color="gray" variant="light" disabled={loading || page >= totalPages}
            onClick={() => onPageChange(page + 1)}>Next</Button>
          <Button size="xs" color="gray" variant="light" disabled={loading || page >= totalPages}
            onClick={() => onPageChange(totalPages)}>»</Button>
        </div>
      </div>

      {loading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ height: "600px" }}>
          <Button disabled color='dark' variant="outline" size='lg'>
            <Loader size="sm" type="dots" className="me-2" />
            Loading...
          </Button>
        </div>
      ) : (
        <div
          className="ag-theme-alpine"
          style={{
            width: "100%",
            height: `${calculatedHeight}px`,
            transition: 'height 0.25s ease'
          }}
        >
          <AgGridReact
            rowData={tableData}
            columnDefs={colDefs}
            defaultColDef={defaultColDef}
            rowHeight={rowHeight}
            modules={[AllCommunityModule]}
            pagination={false}
            suppressPaginationPanel={true}
            components={{ JobLinkRenderer }}
            accentColor="blue"
            theme={themeQuartz}
            onRowClicked={params => {
              navigate(`${params.data._id}`);
            }}
            // onRowClicked={params => {
            //   if (params.data?.job_id) navigate(`${params.data.job_id}`);
            // }}
          />
        </div>
      )}
    </div>
  );
}
