
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Navbar, ScrollArea } from '@mantine/core';

export default function SideNav() {
  return (
    <Navbar width={{ base: 250 }} p="md">
      <Navbar.Section grow component={ScrollArea}>
        <nav className="nav flex-column">
          <NavLink to="/dashboard/applicants" className="nav-link">Applicants</NavLink>
          <NavLink to="/dashboard/jobs" className="nav-link">Jobs</NavLink>
          <NavLink to="/dashboard/settings" className="nav-link">Settings</NavLink>
          <NavLink to="/dashboard/profile" className="nav-link">Profile</NavLink>
        </nav>
      </Navbar.Section>
    </Navbar>
  );
}