'use client';


/*
    Tournament creation og display har blitt skrevet av DL
    Editing av tournament har blitt skrevet av DL i samarbeid med Claude AI
*/

import { useState, useEffect } from 'react';
import { useAuth } from "../../../module/context";
import { useSearchParams } from 'next/navigation';
import "./tournament.css";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [tournaments, setTournaments] = useState([]);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [startDate, setStartdate] = useState('');
  const [endDate, setEnddate] = useState('');
  const [courseId, setCourseId] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editingTournamentId, setEditingTournamentId] = useState(null);

  const baseUrl =
    process.env.NODE_ENV === 'production'
      ? 'https://vast-mesa-22158-90c21fc001d1.herokuapp.com'
      : 'http://localhost:5000';

  const searchParams = useSearchParams();
  const clubId = searchParams.get('clubId');

  useEffect(() => {
    if (clubId) {
      console.log(`Club ID from URL: ${clubId}`);
    }
  }, [clubId]);

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/tournaments/${clubId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch tournaments');
        }
        const data = await response.json();
        setTournaments(data);
      } catch (error) {
        console.error('Error fetching tournaments:', error);
      } finally {
        setLoading(false);
      }
    };

    if (clubId) {
      fetchTournaments();
    }
  }, [user, clubId]);

  const handleCreateTournament = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${baseUrl}/api/tournaments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          location,
          startDate,
          endDate,
          courseId,
          clubId,
          userId: user.userId, 
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create tournament');
      }

      const result = await response.json();
      setTournaments((prev) => [...prev, result.tournament]);
      setMessage('Tournament created successfully!');
      resetForm();
    } catch (error) {
      console.error('Error creating tournament:', error);
      setMessage('Failed to create tournament.');
    }
  };

  // Handle edit tournament
  const handleEditTournament = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${baseUrl}/api/tournaments/${editingTournamentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          location,
          startDate,
          endDate,
          courseId,
          clubId,
          userId: user.userId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update tournament');
      }

      const updatedTournament = await response.json();
      
      // Update the tournaments list with the edited tournament
      setTournaments(tournaments.map(tournament => 
        tournament._id === editingTournamentId ? updatedTournament : tournament
      ));
      
      setMessage('Tournament updated successfully!');
      resetForm();
      setIsEditing(false);
      setEditingTournamentId(null);
    } catch (error) {
      console.error('Error updating tournament:', error);
      setMessage('Failed to update tournament.');
    }
  };

  const handleDeleteTournament = async (tournamentId) => {
    if (!confirm("Er du sikker på at du vil slette denne turneringen?")) {
      return;
    }
    
    try {
      const response = await fetch(`${baseUrl}/api/tournaments/${tournamentId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete tournament');
      }

      // Remove the deleted tournament from state
      setTournaments(tournaments.filter(tournament => tournament._id !== tournamentId));
      setMessage('Tournament deleted successfully!');
      
      // If the deleted tournament was being edited, reset the form
      if (editingTournamentId === tournamentId) {
        resetForm();
        setIsEditing(false);
        setEditingTournamentId(null);
      }
    } catch (error) {
      console.error('Error deleting tournament:', error);
      setMessage('Failed to delete tournament.');
    }
  };

  // Function to populate form with tournament data for editing
  const startEditingTournament = (tournamentId) => {
    const tournamentToEdit = tournaments.find(t => t._id === tournamentId);
    if (tournamentToEdit) {
      setName(tournamentToEdit.name);
      setLocation(tournamentToEdit.location);
      setStartdate(tournamentToEdit.startDate.split('T')[0]); // Format date for input
      setEnddate(tournamentToEdit.endDate.split('T')[0]); // Format date for input
      setCourseId(tournamentToEdit.courseId);
      setIsEditing(true);
      setEditingTournamentId(tournamentId);
      
      // Scroll to form
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Function to reset form
  const resetForm = () => {
    setName('');
    setLocation('');
    setStartdate('');
    setEnddate('');
    setCourseId('');
  };

  // Function to cancel editing
  const cancelEditing = () => {
    resetForm();
    setIsEditing(false);
    setEditingTournamentId(null);
    setMessage('');
  };

  return (
    <div className="admin-container">
      <h1>Tournament Management</h1>

      <h2>{isEditing ? 'Edit Tournament' : 'Create a New Tournament'}</h2>
      <form onSubmit={isEditing ? handleEditTournament : handleCreateTournament} className="tournament-form">
        <div className="form-group">
          <label htmlFor="name">Tournament Name</label>
          <input
            id="name"
            type="text"
            placeholder="Tournament Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="location">Location</label>
          <input
            id="location"
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="startDate">Start Date</label>
          <input
            id="startDate"
            type="date"
            value={startDate}
            onChange={(e) => setStartdate(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="endDate">End Date</label>
          <input
            id="endDate"
            type="date"
            value={endDate}
            onChange={(e) => setEnddate(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="courseId">Course ID</label>
          <input
            id="courseId"
            type="number"
            placeholder="Course ID"
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
            required
          />
        </div>
        
        <div className="form-actions">
          <button type="submit">{isEditing ? 'Update Tournament' : 'Create Tournament'}</button>
          {isEditing && <button type="button" onClick={cancelEditing} className="cancel-button">Cancel</button>}
        </div>
      </form>
      
      {message && <p className="message">{message}</p>}

      <h2>Existing Tournaments</h2>
      {loading ? (
        <p>Loading existing tournaments...</p>
      ) : tournaments.length > 0 ? (
        <ul className="tournament-list">
          {tournaments.map((tournament) => (
            <li key={tournament._id} className="tournament-item">
              <div className="tournament-info">
                <h3>{tournament.name}</h3>
                <p>
                  <strong>Location:</strong> {tournament.location}<br />
                  <strong>Dates:</strong> {new Date(tournament.startDate).toLocaleDateString()} to{' '}
                  {new Date(tournament.endDate).toLocaleDateString()}<br />
                  <strong>Course ID:</strong> {tournament.courseId}
                </p>
              </div>
              <div className="tournament-actions">
                <button onClick={() => startEditingTournament(tournament._id)} className="edit-button">Edit</button>
                <button onClick={() => handleDeleteTournament(tournament._id)} className="delete-button">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No tournaments found.</p>
      )}
    </div>
  );
}