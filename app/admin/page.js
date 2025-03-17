'use client';

import { useState, useEffect } from 'react';
import { useAuth } from "../../module/context";


//DETTE ER CHATGPT
export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalClubs: 0,
    totalMemberships: 0
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch dashboard statistics
    const fetchStats = async () => {
      try {
        const baseUrl = process.env.NODE_ENV === 'production'
          ? 'https://vast-mesa-22158-90c21fc001d1.herokuapp.com'
          : 'http://localhost:5000';

        // Fetch users and memberships concurrently
        const [usersResponse, membershipsResponse] = await Promise.all([
          fetch(`${baseUrl}/api/users`),
          fetch(`${baseUrl}/api/memberships`)
        ]);

        if (!usersResponse.ok || !membershipsResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const usersData = await usersResponse.json();
        const membershipsData = await membershipsResponse.json();

        // Update stats
        setStats({
          totalUsers: usersData.length || 0,
          totalClubs: new Set(membershipsData.map(m => m.clubId)).size || 0,
          totalMemberships: membershipsData.length || 0
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        setError('Failed to load dashboard statistics. Please try again later.');
      }
    };

    fetchStats();
  }, []);

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
          <a href="/admin/memberships" className="action-button" style={styles.actionButton}>Manage Memberships</a>
          <a href="/admin/clubs" className="action-button" style={styles.actionButton}>Manage Clubs</a>
        </div>
      </div>
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