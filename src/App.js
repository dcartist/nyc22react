import './App.css';
import { Outlet, Link, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import MainLayout from './Pages/MainLayout';
import About from './Pages/About';
import Dashboard from './Pages/Dashboard/Dashboard';
import Navigation from './Components/Navigation/Navigation';
import SettingsLayout from './Pages/Dashboard/Settings';
import Profile from './Pages/Dashboard/Profile';
import Billing from './Pages/Dashboard/Billing';
import { MDBContainer, MDBRow, MDBCol } from 'mdb-react-ui-kit';
function App() {
  return (
    <div className="App">
<MDBContainer fluid>
      <MDBRow>
        <MDBCol> 
<Navigation />
</MDBCol>
</MDBRow>
<MDBRow>
        <MDBCol>
        <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="dashboard" element={<Dashboard />}> 
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
