'use client';

import React, { useState, useEffect } from 'react';

const MembershipList = () => {
  const [memberships, setMemberships] = useState([]); // ✅ Default value as an empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMemberships = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/memberships');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setMemberships(data); // ✅ Ensure it's always an array
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMemberships();
  }, []);

  if (loading) return <p>Loading memberships...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Membership List</h2>
      <table>
        <thead>
          <tr>
            <th>User ID</th>
            <th>Club ID</th>
            <th>Membership ID</th>
            <th>Status</th>
            <th>Join Date</th>
          </tr>
        </thead>
        <tbody>
          {memberships.length > 0 ? (
            memberships.map((membership) => (
              <tr key={membership._id}>
                <td>{membership.userId}</td>
                <td>{membership.clubId}</td>
                <td>{membership.membershipId}</td>
                <td>{membership.membershipStatus}</td>
                <td>{new Date(membership.joinDate).toLocaleDateString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No memberships found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MembershipList;
