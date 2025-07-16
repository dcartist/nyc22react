import axios from "axios";
import react from "react";

const API_BASE = process.env.REACT_APP_API_URL || process.env.REACT_APP_API_URL_DEV;

export const getAllApplications = async () => {
    const res = await axios.get(`${API_BASE}/applications`);
    if (res.status !== 200) throw new Error("Failed to fetch applications");
    console.log("Applications fetched successfully:", res.data);
    return res.data;
};

export const getApplicantsByPage = async (page) => {
    const res = await axios.get(`${API_BASE}/applications/page/${page}`);
    if (res.status !== 200) throw new Error("Failed to fetch applications by page");
    console.log("Applications by page fetched successfully:", res.data);
    return res.data;
};


export const getOneApplication = async (id) => {
    const res = await axios.get(`${API_BASE}/applications/id/${id}`);
    if (res.status !== 200) throw new Error("Failed to fetch application");
    console.log("Application fetched successfully:", res.data);
    return res.data;
};

export const getApplicationByLicense = async (license) => {
    const res = await axios.get(`${API_BASE}/applications/license/${license}`);
    if (res.status !== 200) throw new Error("Failed to fetch application by license");
    console.log("Application by license fetched successfully:", res.data);
    return res.data;
};  

export const getAllProperties = async () => {
    const res = await axios.get(`${API_BASE}/properties`);
    if (res.status !== 200) throw new Error("Failed to fetch properties");
    console.log("Properties fetched successfully:", res.data);
    return res.data;
};


export const getAllContractors = async () => {
    const res = await axios.get(`${API_BASE}/contractors`);
    if (res.status !== 200) throw new Error("Failed to fetch contractors");
    console.log("Contractors fetched successfully:", res.data);
    return res.data;
};


export const getAllJobs = async () => {
    const res = await axios.get(`${API_BASE}/jobs`);
    if (res.status !== 200) throw new Error("Failed to fetch jobs");
    console.log("Jobs fetched successfully:", res.data);
    return res.data;
};

//   const res = await fetch(`${API_BASE}/users`);
//   if (!res.ok) throw new Error("Failed to fetch users");
//   return res.json();
// };