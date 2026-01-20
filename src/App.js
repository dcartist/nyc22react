import "./App.css";

import { Container, Grid } from "@mantine/core";
import { Navigate, Route, Routes } from "react-router-dom";

import About from "./Pages/About";
import ApplicantDetails from "./Pages/Dashboard/Applicants/ApplicantDetails";
import Applicants from "./Pages/Dashboard/Applicants/Applicants";
import ApplicantsLayout from "./Pages/Dashboard/Applicants/ApplicantsLayout";
import ApplicantAdd from "./Pages/Dashboard/Applicants/AppliantAdd";
import ApplicantEdit from "./Pages/Dashboard/Applicants/ApplicantEdit";
import Billing from "./Pages/Dashboard/Billing";
import Dashboard from "./Pages/Dashboard/Dashboard";
import Home from "./Pages/Home";
import JobsAdd from "./Pages/Dashboard/Jobs/JobsAdd";
import JobDetails from "./Pages/Dashboard/Jobs/JobDetails";
import JobEdit from "./Pages/Dashboard/Jobs/JobEdit";
import Jobs from "./Pages/Dashboard/Jobs/Jobs";
import JobsDashboard from "./Pages/Dashboard/Jobs/JobsDashboard";
import MainLayout from "./Pages/MainLayout";
import Navigation from "./Components/Navigation/Navigation";
import Profile from "./Pages/Dashboard/Profile";
import SettingsLayout from "./Pages/Dashboard/Settings";

function App() {

  return (
    <div className="App">
      <Container fluid>
        <Grid className="justify-content-center bg-primary p-2">
          <Grid.Col span={12}></Grid.Col>
        </Grid>
        <Grid>
          <Grid.Col span={12}>
            <Navigation />
          </Grid.Col>
        </Grid>
        <Grid className="justify-content-center bg-secondary smallLine">
          <Grid.Col span={12}></Grid.Col>
        </Grid>
        <Grid>
          <Grid.Col span={12}>
            <Routes>
              <Route path="/" element={<MainLayout />}>
                <Route index element={<Home />} />
                <Route path="about" element={<About />} />
                <Route path="dashboard" element={<Dashboard />}>
                 <Route index element={<Navigate to="applicants" replace />} />
                  <Route path="applicants" element={<ApplicantsLayout />}>
                    <Route index element={<Applicants />} />
                    <Route path=":applicantId" element={<ApplicantDetails />} />
                    <Route path=":applicantId/edit" element={<ApplicantEdit />} />
                    <Route path="new" element={<ApplicantAdd />} />
                  </Route>
                  <Route path="jobs" element={<JobsDashboard />}>
                    <Route index element={<Jobs />} />
                    <Route path="add" element={<JobsAdd />} />
                    <Route path=":jobId" element={<JobDetails />} />
                    <Route path=":jobId/edit" element={<JobEdit />} />
                  </Route>
                  <Route path="profile" element={<Profile />} />
                  <Route path="settings" element={<SettingsLayout />}>
                    <Route path="billing" element={<Billing />} />
                  </Route>
                </Route>
              </Route>
            </Routes>
          </Grid.Col>
        </Grid>
      </Container>
    </div>
  );
}

export default App;
