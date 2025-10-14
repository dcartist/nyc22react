import React, {useEffect, useState} from 'react'

import JobsTable from '../../../Components/Tables/Jobs/JobsTable';
import  {getAllJobs, getMetadata, getPaginatedJobs} from '../../../services/api';
import JobsTablePagination from '../../../Components/Tables/Jobs/JobsTablePagination';

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [paginationJobs, setPaginationJobs] = useState([]);
  const [jobamount, setJobAmount] = useState(0);

  useEffect(() => {
    const fetchPaginationJobs = async () => {
      const data = await getPaginatedJobs(1, 100);
      setPaginationJobs(data);
      setJobs(data);
      console.log("Paginated Jobs data:", data);
    };
    fetchPaginationJobs();

    // const fetchJobs = async () => {
    //   const data = await getAllJobs();
    //   setJobs(data);
    //   console.log("Jobs data:", data);
    // };
    // fetchJobs();

    const fetchMetadata = async () => {
      const metadata = await getMetadata();
      setJobAmount(metadata.job_count || 0);
      console.log("Metadata:", metadata);
    };
    fetchMetadata();
  }, []);

  return (
    <div>
      <JobsTablePagination tableData={jobs} jobamount={jobamount}/>
    </div>
  )
}
