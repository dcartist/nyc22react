import React from 'react'
import SideNav from '../../Components/Navigation/SideNav'
import { Outlet, Link } from 'react-router-dom';
import { MDBContainer, MDBRow, MDBCol, MDBListGroup, MDBListGroupItem } from 'mdb-react-ui-kit';

export default function Dashboard() {
  return (
    <div>
      <MDBContainer fluid>
      <MDBRow>
        <MDBCol md="2" className="bg-light min-vh-100 p-3">
          <MDBListGroup>
            {/* <MDBListGroupItem tag={Link} to="/" action>
              Home
            </MDBListGroupItem> */}
            <MDBListGroupItem tag={Link} to="applicants" action>
              Applicants
            </MDBListGroupItem>
            <MDBListGroupItem tag={Link} to="jobs" action>
              Job Listings
            </MDBListGroupItem>
            <MDBListGroupItem tag={Link} to="settings" action>
              Settings
            </MDBListGroupItem>
            <MDBListGroupItem tag={Link} to="profile" action>
              Profile
            </MDBListGroupItem>
          </MDBListGroup>
        </MDBCol>

        <MDBCol md="10" className="p-4">
          <Outlet />
        </MDBCol>
      </MDBRow>
    </MDBContainer>
    
    </div>
  )
}
