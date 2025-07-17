import {
  MDBCollapse,
  MDBContainer,
  MDBIcon,
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarItem,
  MDBNavbarLink,
  MDBNavbarNav,
  MDBNavbarToggler
} from 'mdb-react-ui-kit';

import { useState } from 'react';

export default function Navigation() {
  const [openNavText, setOpenNavText] = useState(false);
  return (<MDBNavbar expand='lg' light bgColor='light'>
    <MDBContainer fluid>
      <MDBNavbarBrand href='/'>NYC Job Portal</MDBNavbarBrand>
      <MDBNavbarToggler
        type='button'
        data-target='#navbarText'
        aria-controls='navbarText'
        aria-expanded='false'
        aria-label='Toggle navigation'
        onClick={() => setOpenNavText(!openNavText)}
      >
        <MDBIcon icon='bars' fas />
      </MDBNavbarToggler>
      <MDBCollapse navbar open={openNavText}>
        <MDBNavbarNav className='mr-auto mb-2 mb-lg-0'>
          <MDBNavbarItem>
            <MDBNavbarLink active aria-current='page' href='/'>
              Home
            </MDBNavbarLink>
          </MDBNavbarItem>
          <MDBNavbarItem>
            <MDBNavbarLink href='/about'>About</MDBNavbarLink>
          </MDBNavbarItem>
          <MDBNavbarItem>
            <MDBNavbarLink href='/dashboard'>Dashboard</MDBNavbarLink>
          </MDBNavbarItem>
        </MDBNavbarNav>

      </MDBCollapse>
    </MDBContainer>
  </MDBNavbar>)

    ;
}
