import React from 'react';

export default function DataTables({ data }) {
    if (!data || data.length === 0) {
        return <div>No data available</div>;
    }

    return (
        <div className="table-responsive">
            <table className="table table-striped table-bordered">
                <thead>
                    <tr>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>License</th>
                        <th>Jobs</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((app, index) => (
                        <tr key={index}>
                            <td>{app.applicant_firstName || ''}</td>
                            <td>{app.applicant_lastName || ''}</td>
                            <td>{app.applicant_license || ''}</td>
                            <td>{Array.isArray(app.job_listing) ? app.job_listing.length : ''}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}