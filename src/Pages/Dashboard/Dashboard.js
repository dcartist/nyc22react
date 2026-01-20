import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';

export default function Dashboard() {
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12 col-md-2 bg-light min-vh-100 p-3">
          <ul className="list-group list-group-flush">
            <NavLink
              to="applicants"
              className={({ isActive }) =>
                'list-group-item list-group-item-action' + (isActive ? ' active' : '')
              }
            >
              Applicants
            </NavLink>
            <NavLink
              to="jobs"
              className={({ isActive }) =>
                'list-group-item list-group-item-action' + (isActive ? ' active' : '')
              }
            >
              Job Listings
            </NavLink>
            <NavLink
              to="settings"
              className={({ isActive }) =>
                'list-group-item list-group-item-action' + (isActive ? ' active' : '')
              }
            >
              Settings
            </NavLink>
            <NavLink
              to="profile"
              className={({ isActive }) =>
                'list-group-item list-group-item-action' + (isActive ? ' active' : '')
              }
            >
              Profile
            </NavLink>
          </ul>
        </div>

        <div className="col-12 col-md-10 p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
