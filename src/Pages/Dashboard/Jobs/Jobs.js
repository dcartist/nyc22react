import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getPaginatedJobs, getMetadata, searchJobs } from '../../../services/api';
import JobsTablePagination from '../../../Components/Tables/Jobs/JobsTablePagination';

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [jobamount, setJobAmount] = useState(0);    // total count from metadata
  const [page, setPage] = useState(1);              // 1-based
  const [pageSize, setPageSize] = useState(100);
  const [loading, setLoading] = useState(false);
  // searchInput: what the user is typing.
  // searchTerm: the applied term used for querying.
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // fetch paginated jobs
  const loadJobs = useCallback(async () => {
    setLoading(true);
    try {
      const trimmedSearch = searchTerm.trim();
      const usingSearch = trimmedSearch.length > 0;
      setIsSearching(usingSearch);

      let data;
      if (usingSearch) {
        data = await searchJobs(trimmedSearch, page, pageSize);
      } else {
        // adjust if API expects zero-based page
        data = await getPaginatedJobs(page, pageSize);
      }

      // Normalize shape: accept {jobs}, {items}, or array
      const items = Array.isArray(data?.jobs) ? data.jobs :
                    Array.isArray(data?.items) ? data.items :
                    Array.isArray(data) ? data : [];
      setJobs(items);

      // Prefer total/JobTotal from response when available (especially for search)
      const totalFromResponse =
        data?.JobTotal ?? data?.total ?? data?.job_count ?? items.length;

      if (usingSearch) {
        setJobAmount(totalFromResponse);
      } else if (totalFromResponse && !Number.isNaN(Number(totalFromResponse))) {
        setJobAmount(totalFromResponse);
      }
    } catch (e) {
      console.error('Failed to fetch paginated jobs', e);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, searchTerm]);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  // fetch total count once
  useEffect(() => {
    (async () => {
      try {
        const metadata = await getMetadata();
        // adjust key if different
        const total = metadata.JobTotal ?? metadata.total ?? metadata.job_count ?? 0;
        setJobAmount(total);
      } catch (e) {
        console.error('Failed to fetch metadata', e);
      }
    })();
  }, []);

  const handlePageChange = (newPage) => {
    const maxPage = Math.max(1, Math.ceil(jobamount / pageSize));
    if (newPage < 1 || newPage > maxPage) return;
    setPage(newPage);
  };

  const handlePageSizeChange = (newSize) => {
    if (newSize === pageSize) return;
    setPageSize(newSize);
    setPage(1);
  };

  const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Apply the current input as the active search term
    // and reset to the first page. The effect tied to
    // `searchTerm` will trigger the actual load.
    setPage(1);
    setSearchTerm(searchInput.trim());
  };

  return (
    <div>
      <div className="d-flex flex-wrap align-items-center mb-3 gap-2">
        <button className="btn btn-primary" onClick={loadJobs} disabled={loading}>
          {loading ? 'Loading...' : 'Refresh Jobs'}
        </button>

        <form className="d-flex align-items-center" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            className="form-control form-control-sm"
            style={{ minWidth: '220px' }}
            placeholder="Search jobs (number, borough, etc.)"
            value={searchInput}
            onChange={handleSearchInputChange}
            disabled={loading}
          />
          <button
            type="submit"
            className="btn btn-outline-secondary btn-sm ms-2"
            disabled={loading}
          >
            {isSearching ? 'Search' : 'Search'}
          </button>
          {searchTerm.trim() && (
            <button
              type="button"
              className="btn btn-link btn-sm ms-1"
              onClick={() => {
                setSearchInput('');
                setSearchTerm('');
                setPage(1);
              }}
              disabled={loading}
            >
              Clear
            </button>
          )}
        </form>

        <Link to="/dashboard/jobs/add" className="btn btn-success ms-auto">
          Add New Job
        </Link>
      </div>
      <JobsTablePagination
        tableData={jobs}
        loading={loading}
        page={page}
        pageSize={pageSize}
        total={jobamount}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
    </div>
  );
}
