import "./App.css";

import { MDBCol, MDBContainer, MDBRow } from "mdb-react-ui-kit";
import { Navigate, Route, Routes } from "react-router-dom";

import About from "./Pages/About";
import ApplicantDetails from "./Pages/Dashboard/Applicants/ApplicantDetails";
import Applicants from "./Pages/Dashboard/Applicants/Applicants";
import ApplicantsLayout from "./Pages/Dashboard/Applicants/ApplicantsLayout";
import Billing from "./Pages/Dashboard/Billing";
import Dashboard from "./Pages/Dashboard/Dashboard";
import Home from "./Pages/Home";
import JobsAdd from "./Pages/Dashboard/Jobs/JobsAdd";
import JobDetails from "./Pages/Dashboard/Jobs/JobDetails";
import Jobs from "./Pages/Dashboard/Jobs/Jobs";
import JobsDashboard from "./Pages/Dashboard/Jobs/JobsDashboard";
import MainLayout from "./Pages/MainLayout";
import Navigation from "./Components/Navigation/Navigation";
import Profile from "./Pages/Dashboard/Profile";
import SettingsLayout from "./Pages/Dashboard/Settings";

function App() {

  return (
    <div className="App">
      <MDBContainer fluid>
        <MDBRow className="justify-content-center bg-primary p-2">
          <MDBCol md="12"></MDBCol>
        </MDBRow>
        <MDBRow>
          <MDBCol>
            <Navigation />
          </MDBCol>
        </MDBRow>
        <MDBRow className="justify-content-center bg-secondary smallLine">
          <MDBCol md="12"></MDBCol>
        </MDBRow>
        <MDBRow>
          <MDBCol>
            <Routes>
              <Route path="/" element={<MainLayout />}>
                <Route index element={<Home />} />
                <Route path="about" element={<About />} />
                <Route path="dashboard" element={<Dashboard />}>
                 <Route index element={<Navigate to="applicants" replace />} />
                  <Route path="applicants" element={<ApplicantsLayout />}>
                    <Route index element={<Applicants />} />
                    <Route path=":applicantId" element={<ApplicantDetails />} />
                  </Route>
                  <Route path="jobs" element={<JobsDashboard />}>
                    <Route index element={<Jobs />} />
                    <Route path="add" element={<JobsAdd />} />
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
