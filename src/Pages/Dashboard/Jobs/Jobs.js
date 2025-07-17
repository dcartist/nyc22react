import React, {useEffect, useState} from 'react'

import JobsTable from '../../../Components/Tables/Jobs/JobsTable';
import  {getAllJobs} from '../../../services/api';

export default function Jobs() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      const data = await getAllJobs();
      setJobs(data);
    };
    fetchJobs();
  }, []);

  return (
    <div>
      <JobsTable tableData={jobs} />
    </div>
  )
}
