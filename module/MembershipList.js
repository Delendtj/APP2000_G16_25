//DL

'use client'; // client component in Next.js

import React, { useState, useEffect } from 'react';

const MembershipList = () => {
  // State to store membership data
  const [memberships, setMemberships] = useState([]); // Default state
  const [loading, setLoading] = useState(true); // loading state
  const [error, setError] = useState(null); // error state

  useEffect(() => {
    const fetchMemberships = async () => {
      try {
        // Determine the API base URL based on the environment
        const baseUrl =
          process.env.NODE_ENV === 'production'
            ? 'https://vast-mesa-22158-90c21fc001d1.herokuapp.com/'  // Heroku APP URL
            : 'http://localhost:5000';  // Local URL for dev

        // Fetch data 
        const response = await fetch(`${baseUrl}/api/memberships`);
        
        // Check response
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Parse JSON response
        const data = await response.json();
        setMemberships(data); // Update state with fetched data
      } catch (err) {
        setError(err.message); //error state
      } finally {
        setLoading(false); //loading state update
      }
    };

    fetchMemberships(); // Call the function
  }, []); // Empty array run once

  //loading message
  if (loading) return <p>Loading memberships...</p>;

  //error message
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
