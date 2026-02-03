import React, { useState, useEffect, useCallback } from 'react';
import { getAllContractors } from '../../../services/api';
import { Link } from 'react-router-dom';
import ContractorTable from './ContractorTable.js';

export default function Contractors() {
  const [contractors, setContractors] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const loadContractors = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getAllContractors();

      const trimmed = searchTerm.trim().toLowerCase();
      const filtered = trimmed
        ? data.filter(contractor => {
            const firstName = (contractor.first_name || '').toString().toLowerCase();
            const lastName = (contractor.last_name || '').toString().toLowerCase();
            const businessName = (contractor.business_name || '').toString().toLowerCase();
            const phone = (contractor.business_phone_number || '').toString().toLowerCase();
            const license = (contractor.license_number || '').toString().toLowerCase();
            const licenseType = (contractor.license_type || '').toString().toLowerCase();

            const haystack = [firstName, lastName, businessName, phone, license, licenseType]
              .filter(Boolean)
              .join(' ');

            return haystack.includes(trimmed);
          })
        : data;

      setContractors(filtered);
      console.log('Contractors fetched:', data);
    } catch (err) {
      console.error('Failed to fetch contractors', err);
      setError(err.message || 'Failed to load contractors');
      setContractors([]);
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    loadContractors();
  }, [loadContractors]);

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
        <button className="btn btn-primary" onClick={loadContractors} disabled={loading}>
          {loading ? 'Loading...' : 'Refresh Contractors'}
        </button>

        <form className="d-flex align-items-center" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            className="form-control form-control-sm"
            style={{ minWidth: '220px' }}
            placeholder="Search contractors (name, business, license)"
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

        <Link to="/dashboard/contractors/add" className="btn btn-success ms-auto">
          Create New Contractor
        </Link>
      </div>

      {error && <div className="alert alert-danger mb-2">{error}</div>}

      <ContractorTable tableData={contractors} />
    </div>
  );
}
