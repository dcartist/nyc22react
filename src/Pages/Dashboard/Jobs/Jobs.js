import React, { useEffect, useState, useCallback } from 'react';

import { getPaginatedJobs, getMetadata } from '../../../services/api';
import JobsTablePagination from '../../../Components/Tables/Jobs/JobsTablePagination';

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [jobamount, setJobAmount] = useState(0);    // total count from metadata
  const [page, setPage] = useState(1);              // 1-based
  const [pageSize, setPageSize] = useState(100);
  const [loading, setLoading] = useState(false);

  // fetch paginated jobs
  const loadJobs = useCallback(async () => {
    setLoading(true);
    try {
      // adjust if API expects zero-based page
      const data = await getPaginatedJobs(page, pageSize);
      // if API returns array directly
      const items = Array.isArray(data?.jobs) ? data.jobs :
                    Array.isArray(data?.items) ? data.items :
                    Array.isArray(data) ? data : [];
      setJobs(items);
    } catch (e) {
      console.error('Failed to fetch paginated jobs', e);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]);

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

  return (
    <div>
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
