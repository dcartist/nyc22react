import axios from "axios";

const API_BASE = process.env.REACT_APP_API_URL || process.env.REACT_APP_API_URL_DEV;

//Get All Applicantions
export const getAllApplications = async () => {
    const res = await axios.get(`${API_BASE}/applications`);
    if (res.status !== 200) throw new Error("Failed to fetch applications");
    console.log("Applications fetched successfully:", res.data);
    return res.data;
};

//Get All applications by page (pagination)
export const getApplicantsByPage = async (page) => {
    const res = await axios.get(`${API_BASE}/applications/page/${page}`);
    if (res.status !== 200) throw new Error("Failed to fetch applications by page");
    console.log("Applications by page fetched successfully:", res.data);
    return res.data;
};

//Get one application by ID with majority of details
export const getOneApplication = async (id) => {
    const res = await axios.get(`${API_BASE}/applications/id/${id}/full`);
    console.log("Fetching application with ID:", id);
    console.log("API URL:", `${API_BASE}/applications/id/${id}/full`);
    if (res.status !== 200) throw new Error("Failed to fetch application");
    console.log("Application fetched successfully:::", res.data);
    return res.data;
};

//Get one application by license with min details
export const getApplicationByLicense = async (license) => {
    const res = await axios.get(`${API_BASE}/applications/license/${license}`);
    if (res.status !== 200) throw new Error("Failed to fetch application by license");
    console.log("Application by license fetched successfully:", res.data);
    return res.data;
};  

//Get all properties
export const getAllProperties = async () => {
    const res = await axios.get(`${API_BASE}/properties`);
    if (res.status !== 200) throw new Error("Failed to fetch properties");
    console.log("Properties fetched successfully:", res.data);
    return res.data;
};

// Get all Contractors
export const getAllContractors = async () => {
    const res = await axios.get(`${API_BASE}/contractors`);
    if (res.status !== 200) throw new Error("Failed to fetch contractors");
    console.log("Contractors fetched successfully:", res.data);
    return res.data;
};

//Get all Jobs
export const getAllJobs = async () => {
    const res = await axios.get(`${API_BASE}/jobs`);
    if (res.status !== 200) throw new Error("Failed to fetch jobs");
    console.log("Jobs fetched successfully:", res.data);
    return res.data;
};
