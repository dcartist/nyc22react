import './App.css';
import { Outlet, Link, Routes, Route } from 'react-router-dom';
import React, { useEffect, useState } from "react";
import Home from './Pages/Home';
import MainLayout from './Pages/MainLayout';
import About from './Pages/About';
import Dashboard from './Pages/Dashboard/Dashboard';
import Navigation from './Components/Navigation/Navigation';
import SettingsLayout from './Pages/Dashboard/Settings';
import ApplicantsLayout from './Pages/Dashboard/Applicants/ApplicantsLayout';
import Applicants from './Pages/Dashboard/Applicants/Applicants';
import ApplicantDetails from './Pages/Dashboard/Applicants/ApplicantDetails';
import Profile from './Pages/Dashboard/Profile';
import Billing from './Pages/Dashboard/Billing';
import JobsDashboard from './Pages/Dashboard/Jobs/JobsDashboard';
import Jobs from './Pages/Dashboard/Jobs/Jobs';
import JobDetails from './Pages/Dashboard/Jobs/JobDetails';
import {getAllJobs} from './services/api';  
import { MDBContainer, MDBRow, MDBCol } from 'mdb-react-ui-kit';



function App() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  useEffect(() => {
    // getAllJobs()
    //   .then(setUsers)
    //   .catch((err) => setError(err.message));
      // console.log(users)
  }, []);

  return (
    <div className="App">
<MDBContainer fluid>
  <MDBRow className='justify-content-center bg-primary p-2'>
    <MDBCol md='12'>
    </MDBCol>
  </MDBRow>
      <MDBRow>
        <MDBCol> 
<Navigation />
</MDBCol>
</MDBRow>
 <MDBRow className='justify-content-center bg-secondary smallLine'>
    <MDBCol md='12'>
    </MDBCol>
  </MDBRow>
<MDBRow>
        <MDBCol>
        <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="dashboard" element={<Dashboard />}> 
            <Route index element={<Applicants />} />
            <Route path="applicants" element={<ApplicantsLayout />}>
              <Route index element={<Applicants />} />
              <Route path=":applicantId" element={<ApplicantDetails />} />
            </Route>
            <Route path="jobs" element={<JobsDashboard />}>
              <Route index element={<Jobs />} />
              <Route path=":jobId" element={<JobDetails />} />
            </Route>
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<SettingsLayout />}>
              
              <Route path="billing" element={<Billing />} />
            </Route>
          </Route>

        </Route>
      </Routes>


        </MDBCol>
      </MDBRow>
    </MDBContainer>
    </div>
  );
}

export default App;
