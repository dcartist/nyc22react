
import React, { useState, useRef, useEffect } from 'react';
import {
  MDBSideNav,
  MDBSideNavMenu,
  MDBSideNavItem,
  MDBSideNavLink,
  MDBSideNavCollapse,
  MDBBtn,
  MDBIcon
} from 'mdb-react-ui-kit';

import { MDBContainer, MDBRow, MDBCol } from 'mdb-react-ui-kit';
export default function SideNav() {
  const [modeOpen, setModeOpen] = useState(true);
  const [modeCollapse1, setModeCollapse1] = useState(true);
  const [modeCollapse2, setModeCollapse2] = useState(true);
  const [mode, setMode] = useState('side');
  const [activeBtn, setActiveBtn] = useState('first');
  const [innerOpen, setInnerOpen] = useState(true);

  const sidenavContent = useRef(null);
  const [container, setContainer] = useState();

  useEffect(() => {
    setContainer(sidenavContent.current);
  }, []);

  return (
    <div style={{ height: '100vh', overflow: 'hidden' }}>
      <MDBRow>
        <MDBCol> 


      <MDBSideNav
        mode={mode}
        open={modeOpen}
        contentRef={container}
        // absolute
        // open={innerOpen} 
        getOpenState={(e) => setModeOpen(e)}
      >
        <MDBSideNavMenu>
          <MDBSideNavItem>
            <MDBSideNavLink>
              <MDBIcon far icon='smile' className='fa-fw me-3' />
              Link 1
            </MDBSideNavLink>
          </MDBSideNavItem>
          <MDBSideNavItem>
            <MDBSideNavLink icon='angle-down' shouldBeExpanded={modeCollapse1} onClick={() => setModeCollapse1(!modeCollapse1)}>
              <MDBIcon fas icon='grin' className='fa-fw me-3' />
              Category 1
            </MDBSideNavLink>
            <MDBSideNavCollapse open={modeCollapse1}>
              <MDBSideNavLink>Link 2</MDBSideNavLink>
              <MDBSideNavLink>Link 3</MDBSideNavLink>
            </MDBSideNavCollapse>
          </MDBSideNavItem>
          <MDBSideNavItem>
            <MDBSideNavLink icon='angle-down' shouldBeExpanded={modeCollapse2} onClick={() => setModeCollapse2(!modeCollapse2)}>
              <MDBIcon fas icon='grin' className='fa-fw me-3' />
              Category 2
            </MDBSideNavLink>
            <MDBSideNavCollapse open={modeCollapse2}>
              <MDBSideNavLink>Link 4</MDBSideNavLink>
              <MDBSideNavLink>Link 5</MDBSideNavLink>
            </MDBSideNavCollapse>
          </MDBSideNavItem>
        </MDBSideNavMenu>
      </MDBSideNav>

      <div style={{ padding: '20px' }} className='text-center'>
        <div style={{ padding: '20px' }} className='text-center'>
          <MDBBtn onClick={() => setModeOpen(!modeOpen)}>
            <MDBIcon fas icon='bars' />
          </MDBBtn>
        </div>

        <div ref={sidenavContent} className='d-flex my-5 text-start'>
         INSERT CONTENT HERE
        </div>
      </div>
      </MDBCol>
</MDBRow>
{/* </MDBContainer> */}
    </div>
  );
}