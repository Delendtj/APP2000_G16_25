'use client';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import './spill.css';
import Header from '../../components/Header';
import { initMap, flyToLocation } from '../../module/map';

export default function Spill() {
  const [gameName, setGameName] = useState('');
  const [players, setPlayers] = useState([]);
  const [playerName, setPlayerName] = useState('');
  const [scores, setScores] = useState({});
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    async function fetchCourses() {
      try {
        const baseUrl =
          process.env.NODE_ENV === 'production'
            ? 'https://vast-mesa-22158-90c21fc001d1.herokuapp.com'
            : 'http://localhost:5000';

        const response = await fetch(`${baseUrl}/models/courses`);
        if (!response.ok) throw new Error('Klarte ikke hente baner');
        const data = await response.json();
        setCourses(data);
      } catch (error) {
        console.error('Feil ved henting av baner:', error.message);
      }
    }

    fetchCourses();
  }, []);

  useEffect(() => {
    initMap('map', 'type');
  }, []);

  const handleFlyTo = (course) => {
    const coords = course.coordinates?.coordinates;
    if (Array.isArray(coords)) {
      const [lon, lat] = coords;
      flyToLocation(Number(lon), Number(lat));
    }
  };

  const handleGameNameChange = (e) => {
    setGameName(e.target.value);
  };

  const handleAddPlayer = () => {
    if (playerName && !players.includes(playerName)) {
      setPlayers([...players, playerName]);
      setScores({ ...scores, [playerName]: [] });
      setPlayerName('');
    }
  };

  const handleScoreChange = (player, score) => {
    setScores({
      ...scores,
      [player]: [...scores[player], parseInt(score)],
    });
  };

  return (
    <>
      <Head>
        <title>Frisbeegolf Spill</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <Header />

      <div className="container">
        <div className="right-panel">
          <h2>Spillkart</h2>
          <div id="map" className="map" style={{ width: '100%', height: '400px' }}></div>
        </div>

        <div className="left-panel">
          <h1>Frisbeegolf Spill</h1>

          {/* Tilgjengelige baner */}
          <div className="game-section">
            <h2>Baner</h2>
            {courses.length === 0 ? (
              <p>Laster baner...</p>
            ) : (
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {courses.map((course) => (
                  <li
                    key={course._id}
                    onClick={() => handleFlyTo(course)}
                    style={{
                      background: '#444',
                      padding: '8px',
                      borderRadius: '6px',
                      marginBottom: '6px',
                      color: 'white',
                      cursor: 'pointer',
                    }}
                  >
                    <strong>{course.name}</strong> – {course.numberOfHoles} hull
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Spillnavn */}
          <div className="game-section">
            <label>
              Spillnavn:
              <input
                type="text"
                value={gameName}
                onChange={handleGameNameChange}
                placeholder="Navn på spillet"
              />
            </label>
          </div>

          {/* Legg til spiller */}
          <div className="game-section">
            <label>
              Spiller navn:
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Legg til spiller"
              />
            </label>
            <button className="poeng-knapp" onClick={handleAddPlayer}>
              Legg til spiller
            </button>
          </div>

          {/* Spillerliste og score */}
          <div className="game-section">
            <h2>Spillere</h2>
            <ul>
              {players.map((player) => (
                <li key={player}>
                  {player}
                  <div>
                    <label>Score for {player}: </label>
                    <input
                      type="number"
                      onChange={(e) => handleScoreChange(player, e.target.value)}
                      placeholder="Registrer score"
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Resultater */}
          <div className="game-section">
            <h2>Resultater</h2>
            {players.length > 0 && (
              <ul>
                {players.map((player) => (
                  <li key={player}>
                    <strong>{player}</strong>: {scores[player].join(', ')}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
