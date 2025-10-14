import React, {useEffect, useState} from 'react'

import JobsTable from '../../../Components/Tables/Jobs/JobsTable';
import  {getAllJobs, getMetadata} from '../../../services/api';
import JobsTablePagination from '../../../Components/Tables/Jobs/JobsTablePagination';

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [jobamount, setJobAmount] = useState(0);

  useEffect(() => {
    const fetchJobs = async () => {
      const data = await getAllJobs();
      setJobs(data);
      console.log("Jobs data:", data);
    };
    fetchJobs();

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
