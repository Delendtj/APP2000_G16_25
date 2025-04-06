'use client';

//AI generated code

import { useState, useEffect } from 'react';
import { useAuth } from "../../module/context";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalClubs: 0,
    totalMemberships: 0
  });
  const [clubData, setClubData] = useState(null);
  const [clubUsers, setClubUsers] = useState([]);
  const [error, setError] = useState(null);
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      console.log("No user data available yet");
      return;
    }

    const fetchAllData = async () => {
      try {
        setLoading(true);
        const baseUrl = process.env.NODE_ENV === 'production'
          ? 'https://vast-mesa-22158-90c21fc001d1.herokuapp.com'
          : 'http://localhost:5000';
        
        console.log("Current logged-in user:", user);

        // Step 1: First, get all users with their club IDs using usermerge
        const mergedUsersResponse = await fetch(`${baseUrl}/api/usersclub`);
        if (!mergedUsersResponse.ok) {
          throw new Error(`Failed to fetch merged users: ${mergedUsersResponse.status}`);
        }
        
        const mergedUsers = await mergedUsersResponse.json();
        console.log("All users with club IDs:", mergedUsers);
        
        // Step 2: Find the current admin's club ID
        const currentUserWithClub = mergedUsers.find(u => u.userId === user.userId || u._id === user._id);
        
        if (!currentUserWithClub || !currentUserWithClub.clubId) {
          console.log("Current user not found in merged data or has no club ID");
          setError("You are not associated with any club.");
          setLoading(false);
          return;
        }
        
        const adminClubId = currentUserWithClub.clubId;
        console.log(`Found admin's club ID: ${adminClubId}`);
        
        // Step 3: Fetch users for this specific club ID using usersbyclub
        const clubUsersResponse = await fetch(`${baseUrl}/api/usersbyclub/${adminClubId}`);
        if (!clubUsersResponse.ok) {
          throw new Error(`Failed to fetch club users: ${clubUsersResponse.status}`);
        }
        
        const clubUsersData = await clubUsersResponse.json();
        console.log(`Users for club ${adminClubId}:`, clubUsersData);
        setClubUsers(clubUsersData);
        
        // Step 4: Fetch detailed club information using clubinfo
        const clubInfoResponse = await fetch(`${baseUrl}/api/klubbinfo`);
        if (!clubInfoResponse.ok) {
          throw new Error(`Failed to fetch club info: ${clubInfoResponse.status}`);
        }
        
        const allClubsInfo = await clubInfoResponse.json();
        
        // Find the specific club data for this admin
        const adminClubData = allClubsInfo.find(club => club.clubId.toString() === adminClubId.toString());
        
        if (!adminClubData) {
          console.log(`No club found with ID ${adminClubId}`);
          setError(`Club information not found for ID ${adminClubId}`);
        } else {
          console.log("Admin's club data:", adminClubData);
          setClubData(adminClubData);
        }
        
        // Step 5: Fetch all memberships
        const membershipsResponse = await fetch(`${baseUrl}/api/memberships`);
        if (!membershipsResponse.ok) {
          throw new Error(`Failed to fetch memberships: ${membershipsResponse.status}`);
        }
        
        const membershipsData = await membershipsResponse.json();
        
        // Filter memberships for this club
        const clubMemberships = membershipsData.filter(
          membership => membership.clubId.toString() === adminClubId.toString()
        );
        
        // Update stats
        setStats({
          totalUsers: clubUsersData.length || 0,
          totalClubs: 1, // Admin can only see their own club
          totalMemberships: clubMemberships.length || 0
        });
        
      } catch (error) {
        setError(`Failed to load dashboard data: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [user]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };
 
  const handleFileUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      setMessage('Please select a file.');
      return;
    }

    const formData = new FormData();
    formData.append('pdf', file);

    const baseUrl = process.env.NODE_ENV === 'production'
      ? 'https://vast-mesa-22158-90c21fc001d1.herokuapp.com'
      : 'http://localhost:5000';

    try {
      const response = await fetch(`${baseUrl}/api/upload`, {
        method: 'POST',
        body: formData,
      });

      // Check content type header
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        if (response.ok) {
          setMessage(data.message);
        } else {
          setMessage(data.error || 'Failed to upload file.');
        }
      } else {
        // Handle non-JSON response
        const text = await response.text();
        console.log('Raw non-JSON response:', text);
        setMessage('Server responded with non-JSON data. Check console for details.');
      }
    } catch (error) {
      console.error('File upload error:', error);
      setMessage('An error occurred while uploading the file.');
    }
  };

  return (
    <div className="admin-dashboard" style={styles.dashboard}>
      <h1 style={styles.header}>Admin Dashboard</h1>
      <p style={styles.welcome}>Welcome, {user?.firstName} {user?.lastName}!</p>

      {error && <p style={styles.error}>{error}</p>}

      <div className="stats-grid" style={styles.statsGrid}>
        <div className="stat-card" style={styles.statCard}>
          <h3 style={styles.statHeader}>Total Users</h3>
          <p className="stat-value" style={styles.statValue}>{stats.totalUsers}</p>
        </div>
        <div className="stat-card" style={styles.statCard}>
          <h3 style={styles.statHeader}>Total Clubs</h3>
          <p className="stat-value" style={styles.statValue}>{stats.totalClubs}</p>
        </div>
        <div className="stat-card" style={styles.statCard}>
          <h3 style={styles.statHeader}>Total Memberships</h3>
          <p className="stat-value" style={styles.statValue}>{stats.totalMemberships}</p>
        </div>
      </div>

      <div className="admin-actions" style={styles.adminActions}>
        <h2 style={styles.actionsHeader}>Quick Actions</h2>
        <div className="action-buttons" style={styles.actionButtons}>
          <a href="/admin/users" className="action-button" style={styles.actionButton}>Manage Users</a>
          <a href="/../medlemsliste" className="action-button" style={styles.actionButton}>Manage Memberships</a>
          <a href="/../courseadmin" className="action-button" style={styles.actionButton}>Manage Clubs</a>
        </div>
      </div>

      <form onSubmit={handleFileUpload}>
        <input type="file" accept="application/pdf" onChange={handleFileChange} />
        <button type="submit">Upload PDF</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

const styles = {
  dashboard: {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  header: {
    fontSize: '2em',
    marginBottom: '10px',
  },
  welcome: {
    fontSize: '1.2em',
    marginBottom: '20px',
  },
  error: {
    color: 'red',
    marginBottom: '20px',
  },
  statsGrid: {
    display: 'flex',
    justifyContent: 'space-around',
    marginBottom: '20px',
  },
  statCard: {
    border: '1px solid #ccc',
    borderRadius: '8px',
    padding: '20px',
    textAlign: 'center',
    width: '30%',
  },
  statHeader: {
    fontSize: '1.5em',
    marginBottom: '10px',
  },
  statValue: {
    fontSize: '2em',
    fontWeight: 'bold',
  },
  adminActions: {
    marginTop: '20px',
  },
  actionsHeader: {
    fontSize: '1.5em',
    marginBottom: '10px',
  },
  actionButtons: {
    display: 'flex',
    justifyContent: 'space-around',
  },
  actionButton: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '5px',
  },
};