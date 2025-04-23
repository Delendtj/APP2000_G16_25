'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../module/context';
import { useSearchParams } from 'next/navigation';

const MembershipList = () => {
  const { user } = useAuth();
  const [memberships, setMemberships] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [clubName, setClubName] = useState('');
  
  const searchParams = useSearchParams();
  const clubId = searchParams.get('clubId');

  useEffect(() => {
    const fetchClubMembers = async () => {
      if (!clubId) {
        setError('No club ID provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        const baseUrl = process.env.NODE_ENV === 'production'
          ? 'https://vast-mesa-22158-90c21fc001d1.herokuapp.com'
          : 'http://localhost:5000';

        // Fetch club name
        const clubResponse = await fetch(`${baseUrl}/api/klubber/${clubId}`);
        if (clubResponse.ok) {
          const clubData = await clubResponse.json();
          setClubName(clubData.name || 'Your Club');
        }
        
        // Fetch memberships for this specific club
        const membershipResponse = await fetch(`${baseUrl}/api/usersbyclub/${clubId}`);
        
        if (!membershipResponse.ok) {
          throw new Error(`Failed to fetch memberships: ${membershipResponse.status}`);
        }
        
        // This will return users with their club info already merged
        const membersData = await membershipResponse.json();
        setMemberships(membersData);
        
      } catch (err) {
        console.error("Error fetching club members:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchClubMembers();
  }, [clubId]);

  if (loading) return <div className="loading-container">Loading club members...</div>;
  
  if (error) return <div className="error-message">Error: {error}</div>;
  
  return (
    <div className="membership-list-container">
      <h2>Members of {clubName}</h2>
      
      {memberships.length > 0 ? (
        <table className="membership-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Membership ID</th>
              <th>Status</th>
              <th>Join Date</th>
            </tr>
          </thead>
          <tbody>
            {memberships.map((member) => (
              <tr key={member._id}>
                <td>{member.firstName} {member.lastName}</td>
                <td>{member.email}</td>
                <td>{member.membershipId}</td>
                <td>
                  <span className={`status-badge ${member.membershipStatus}`}>
                    {member.membershipStatus}
                  </span>
                </td>
                <td>{member.joinDate ? new Date(member.joinDate).toLocaleDateString() : 'N/A'}</td>
                
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="no-data-message">No members found for this club.</p>
      )}

      <style jsx>{`
        .membership-list-container {
          padding: 20px;
          background: #333;
          border-radius: 8px;
          color: white;
        }
        
        .membership-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }
        
        .membership-table th, .membership-table td {
          padding: 12px 15px;
          text-align: left;
          border-bottom: 1px solid #555;
        }
        
        .membership-table th {
          background-color: #222;
          color: white;
        }
        
        .membership-table tr:hover {
          background-color: #444;
        }
        
        .status-badge {
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 0.8rem;
          font-weight: bold;
        }
        
        .status-badge.active {
          background-color: #4caf50;
          color: white;
        }
        
        .status-badge.inactive {
          background-color: #f44336;
          color: white;
        }
        
        .action-buttons {
          display: flex;
          gap: 8px;
        }
        
        .edit-button, .remove-button {
          padding: 6px 12px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: bold;
        }
        
        .edit-button {
          background-color: #973232;
          color: white;
        }
        
        .remove-button {
          background-color: #d32f2f;
          color: white;
        }
        
        .loading-container, .error-message, .no-data-message {
          padding: 20px;
          text-align: center;
          border-radius: 8px;
        }
        
        .error-message {
          background-color: rgba(244, 67, 54, 0.2);
          color: #f44336;
        }
      `}</style>
    </div>
  );
};

export default MembershipList;
