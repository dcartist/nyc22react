import React, { useState, useEffect, useCallback } from 'react';
import { getAllApplications } from '../../../services/api';
import { Link } from 'react-router-dom';
import TableCustom from '../../../Components/Tables/Applicants/Table_Custom';

export default function Applicants() {
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const loadApplications = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getAllApplications();

      const trimmed = searchTerm.trim().toLowerCase();
      const filtered = trimmed
        ? data.filter(app => {
            const first = (app.applicant_firstName || app.applicant_first_name || '').toString().toLowerCase();
            const last = (app.applicant_lastName || app.applicant_last_name || '').toString().toLowerCase();
            const full = `${first} ${last}`.trim();
            const license = (app.applicant_license || app.license || '').toString().toLowerCase();
            const title = (app.applicant_title || '').toString().toLowerCase();
            const email = (app.applicant_email || '').toString().toLowerCase();

            const haystack = [first, last, full, license, title, email]
              .filter(Boolean)
              .join(' ');

            return haystack.includes(trimmed);
          })
        : data;

      setApplications(filtered);
      console.log('Applications fetched:', data);
    } catch (err) {
      console.error('Failed to fetch applications', err);
      setError(err.message || 'Failed to load applications');
      setApplications([]);
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    loadApplications();
  }, [loadApplications]);

  const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchTerm(searchInput.trim());
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setSearchTerm('');
  };

  return (
    <div>
      <div className="d-flex flex-wrap align-items-center mb-3 gap-2">
        <button className="btn btn-primary" onClick={loadApplications} disabled={loading}>
          {loading ? 'Loading...' : 'Refresh Applicants'}
        </button>

        <form className="d-flex align-items-center" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            className="form-control form-control-sm"
            style={{ minWidth: '220px' }}
            placeholder="Search applicants (name, license, email)"
            value={searchInput}
            onChange={handleSearchInputChange}
            disabled={loading}
          />
          <button
            type="submit"
            className="btn btn-outline-secondary btn-sm ms-2"
            disabled={loading}
          >
            Search
          </button>
          {searchTerm && (
            <button
              type="button"
              className="btn btn-link btn-sm ms-1"
              onClick={handleClearSearch}
              disabled={loading}
            >
              Clear
            </button>
          )}
        </form>

        <Link to="/dashboard/applicants/new" className="btn btn-success ms-auto">
          Create New Application
        </Link>
      </div>

      {error && <div className="alert alert-danger mb-2">{error}</div>}

      <TableCustom tableData={applications} />
    </div>
  );
}
