
import { Outlet, Link } from 'react-router-dom';

export default function DashboardLayout() {
  return (
    <div>
      <h2>Dashboard</h2>
      <nav>
        <Link to="analytics">Analytics</Link> | <Link to="settings">Settings</Link>
      </nav>
      <Outlet />
    </div>
  );
}
