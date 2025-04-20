'use client';

import { useState, useEffect } from 'react';
import { useAuth } from "../../../module/context";
import { useSearchParams } from 'next/navigation';

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

  const baseUrl =
    process.env.NODE_ENV === 'production'
      ? 'https://vast-mesa-22158-90c21fc001d1.herokuapp.com'
      : 'http://localhost:5000';

      const searchParams = useSearchParams();
    const clubId = searchParams.get('clubId');

    useEffect(() => {
        if (clubId) {
            console.log(`Club ID from URL: ${clubId}`);
        }}, [clubId]);

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
  }, [user]);

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
          courseId: parseInt(courseId, 10),
          clubId: parseInt(courseId, 10),
          userId: user.userId, 
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create tournament');
      }

      const result = await response.json();
      setTournaments((prev) => [...prev, result.tournament]);
      setMessage('Tournament created successfully!');
      setName('');
      setLocation('');
      setStartdate('');
      setEnddate('');
      setCourseId('');
    } catch (error) {
      console.error('Error creating tournament:', error);
      setMessage('Failed to create tournament.');
    }
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>

      <h2>Create a New Tournament</h2>
      <form onSubmit={handleCreateTournament}>
        <input
          type="string"
          placeholder="Tournament Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />
        <input
          type="date"
          placeholder="Start Date"
          value={startDate}
          onChange={(e) => setStartdate(e.target.value)}
          required
        />
        <input
          type="date"
          placeholder="End Date"
          value={endDate}
          onChange={(e) => setEnddate(e.target.value)}
          required
        />
        <input
          type="integer"
          placeholder="Course ID"
          value={courseId}
          onChange={(e) => setCourseId(e.target.value)}
          required
        />
        <button type="submit">Create Tournament</button>
      </form>
      {message && <p>{message}</p>}

      <h2>Existing Tournaments</h2>
      {loading ? (
        <p>Loading existing tournamentData...</p>
      ) : tournaments.length > 0 ? (
        <ul>
          {tournaments.map((tournament) => (
            <li key={tournament._id}>
              {tournament.name} - {new Date(tournament.startDate).toLocaleDateString()} to{' '}
              {new Date(tournament.endDate).toLocaleDateString()}
            </li>
          ))}
        </ul>
      ) : (
        <p>No tournaments found.</p>
      )}
    </div>
  );
}