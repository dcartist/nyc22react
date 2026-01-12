import axios from "axios";

const API_BASE = process.env.REACT_APP_API_URL || process.env.REACT_APP_API_URL_DEV;

// ANCHOR: Get All Applications
export const getAllApplications = async () => {
    const res = await axios.get(`${API_BASE}/applications`);
    if (res.status !== 200) throw new Error("Failed to fetch applications");
    console.log("Applications fetched successfully:", res.data);
    return res.data;
};

// ANCHOR: Get All applications by page (pagination)
export const getApplicantsByPage = async (page) => {
    const res = await axios.get(`${API_BASE}/applications/page/${page}`);
    if (res.status !== 200) throw new Error("Failed to fetch applications by page");
    console.log("Applications by page fetched successfully:", res.data);
    return res.data;
};

// ANCHOR: Get one application by ID with majority of details
export const getOneApplication = async (id) => {
    const res = await axios.get(`${API_BASE}/applications/id/${id}/full`);
    console.log("Fetching application with ID:", id);
    console.log("API URL:", `${API_BASE}/applications/id/${id}/full`);
    if (res.status !== 200) throw new Error("Failed to fetch application");
    console.log("Application fetched successfully:::", res.data);
    return res.data;
};

// ANCHOR: Get one application by license with min details
export const getApplicationByLicense = async (license) => {
    const res = await axios.get(`${API_BASE}/applications/license/${license}`);
    if (res.status !== 200) throw new Error("Failed to fetch application by license");
    console.log("Application by license fetched successfully:", res.data);
    return res.data;
};  

export const getApplicantsTitles = async () => {
    const res = await axios.get(`${API_BASE}/applications/titles/`);
    if (res.status !== 200) throw new Error("Failed to fetch application titles by page");
    console.log("Application titles by page fetched successfully:", res.data);
    return res.data;
}

// ANCHOR: Get all properties
export const getAllProperties = async () => {
    const res = await axios.get(`${API_BASE}/properties`);
    if (res.status !== 200) throw new Error("Failed to fetch properties");
    console.log("Properties fetched successfully:", res.data);
    return res.data;
};

// ANCHOR: Get all Contractors
export const getAllContractors = async () => {
    const res = await axios.get(`${API_BASE}/contractors`);
    if (res.status !== 200) throw new Error("Failed to fetch contractors");
    console.log("Contractors fetched successfully:", res.data);
    return res.data;
};
// ANCHOR: Get all Contractors (short list)
export const getAllContractorsShort = async () => {
    const res = await axios.get(`${API_BASE}/contractors/shortlist`);
    if (res.status !== 200) throw new Error("Failed to fetch contractors");
    console.log("Contractors fetched successfully:", res.data);
    return res.data;
};

// ANCHOR: Get all Jobs
export const getAllJobs = async () => {
    const res = await axios.get(`${API_BASE}/jobs`);
    if (res.status !== 200) throw new Error("Failed to fetch jobs");
    console.log("Jobs fetched successfully:", res.data);
    return res.data;
};

// ANCHOR: Get paginated jobs
export const getPaginatedJobs = async (page, limit) => {
    const res = await axios.get(`${API_BASE}/jobs/page/${page}/${limit}`);
    if (res.status !== 200) throw new Error("Failed to fetch paginated jobs");
    console.log("Paginated jobs fetched successfully:", res.data);
    return res.data;
};

// ANCHOR: Get one job by ID
export const getOneJob = async (id) => {
    const res = await axios.get(`${API_BASE}/jobs/id/${id}`);
    console.log("Fetching job with ID:", id);
    console.log("API URL:", `${API_BASE}/jobs/id/${id}`);
    if (res.status !== 200) throw new Error("Failed to fetch job");
    console.log("Job fetched successfully:::", res.data);
    return res.data;
}

// ANCHOR: Get jobs by page
export const getJobsByPage = async (page) => {
    const res = await axios.get(`${API_BASE}/jobs/page/${page}`);
    if (res.status !== 200) throw new Error("Failed to fetch jobs by page");
    console.log("Jobs by page fetched successfully:", res.data);
    return res.data;
}
// ANCHOR: Get job status mapping

export const getJobStatusMapping = async () => {
    const res = await axios.get(`${API_BASE}/jobs/statusmap`);
    if (res.status !== 200) throw new Error("Failed to fetch job status mapping");
    console.log("Job status mapping fetched successfully:", res.data);
    return res.data;
// ANCHOR: Get metadata
}

export const getMetadata = async () => {
    const res = await axios.get(`${API_BASE}/meta`);
    if (res.status !== 200) throw new Error("Failed to fetch metadata");
    console.log("Metadata fetched successfully:", res.data);
// ANCHOR: Add new job
    return res.data;
}

export const addJob = async (jobData) => {
  const response = await fetch(`${API_BASE}/jobs/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(jobData)
  });
// ANCHOR: Find contractors by search term and page number
  if (!response.ok) throw response;
  return response.json();
};

export const findContractosBySearchTermandPageNumber = async (searchTerm, pagenumber) => {
    const res = await axios.get(`${API_BASE}/contractors/search/${searchTerm}/page/${pagenumber}`);
// ANCHOR: Get new job number
    if (res.status !== 200) throw new Error("Failed to fetch contractors by search term");
    console.log("Contractors by search term fetched successfully:", res.data);
    return res.data;
};

export const getNewJobNumber = async () => {
    const res = await axios.get(`${API_BASE}/jobs/newjobnumber`);
// ANCHOR: Get job types
    if (res.status !== 200) throw new Error("Failed to fetch new job number");
    console.log("New job number fetched successfully:", res.data);
    return res.data;
}


// ANCHOR: Search properties
export const getJobTypes = async () => {
    const res = await axios.get(`${API_BASE}/jobs/types`);
    if (res.status !== 200) throw new Error("Failed to fetch job types");
    console.log("Job types fetched successfully:", res.data);
    return res.data;
}

//ANCHOR search properties
export const searchProperties = async (searchTerm) => {
    const res = await axios.get(`${API_BASE}/properties/search/${searchTerm}`);
    if (res.status !== 200) throw new Error("Failed to search properties");
    console.log("Properties searched successfully:", res.data);
    console.log(res.data);
    return res.data;
}

// ANCHOR Add new applicant
export const addApplicant = async (applicantData) => {
  const response = await fetch(`${API_BASE}/applications/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(applicantData)
  });
  if (!response.ok) throw response;
  return response.json();
};

//ANCHOR Get application number
export const getNewApplicationNumber = async () => {
    const res = await axios.get(`${API_BASE}/applications/newNumber`);
    if (res.status !== 200) throw new Error("Failed to fetch new application number");
    console.log("New application number fetched successfully:", res.data);
    return res.data.new_application_number;
}