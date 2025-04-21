'use client'

import { useState, useEffect } from 'react';
import Head from 'next/head';
import './spill.css';
import Header from '../../components/Header';

export default function Spill() {
  const [courses, setCourses] = useState([]);  // For å lagre banene
  const [selectedCourse, setSelectedCourse] = useState(null);  // Valgt bane
  const [players, setPlayers] = useState([]);
  const [playerName, setPlayerName] = useState('');
  const [scores, setScores] = useState({});
  const [gameName, setGameName] = useState('');

  // Hente banene fra API
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/courses');  // Backend API endpoint
        const data = await response.json();
        setCourses(data);  // Sett banene i state
      } catch (err) {
        console.error("Error fetching courses:", err);
      }
    };

    fetchCourses();
  }, []);

  // Funksjon for å håndtere spillnavnet
  const handleGameNameChange = (e) => {
    setGameName(e.target.value);
  };

  // Funksjon for å legge til spiller
  const handleAddPlayer = () => {
    if (playerName && !players.includes(playerName)) {
      setPlayers([...players, playerName]);
      setScores({ ...scores, [playerName]: {} });  // Nullstill score for spilleren
      setPlayerName('');
    }
  };

  // Funksjon for å registrere score
  const handleScoreChange = (player, hole, score) => {
    setScores({
      ...scores,
      [player]: {
        ...scores[player],
        [hole]: score,
      },
    });
  };

  // Funksjon for å velge bane
  const handleSelectCourse = (course) => {
    setSelectedCourse(course);
    setScores({});  // Nullstill poeng for spillere
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
          <h2>Velg Bane</h2>
          <ul>
            {courses.map((course) => (
              <li key={course._id} onClick={() => handleSelectCourse(course)}>
                {course.name} - {course.holes} hull
              </li>
            ))}
          </ul>
        </div>

        <div className="left-panel">
          <h1>Frisbeegolf Spill</h1>

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
            <button className="poeng-knapp" onClick={handleAddPlayer}>Legg til spiller</button>
          </div>

          {/* Spillerliste og registrer score */}
          <div className="game-section">
            <h2>Spillere</h2>
            <ul>
              {players.map((player) => (
                <li key={player}>
                  {player}
                  <div>
                    {/* Hull-registrering */}
                    {selectedCourse && Array.from({ length: selectedCourse.holes }).map((_, holeIndex) => (
                      <div key={holeIndex}>
                        <label>Hull {holeIndex + 1} score: </label>
                        <input
                          type="number"
                          value={scores[player]?.[holeIndex + 1] || ''}
                          onChange={(e) => handleScoreChange(player, holeIndex + 1, e.target.value)}
                          placeholder={`Score for Hull ${holeIndex + 1}`}
                        />
                      </div>
                    ))}
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
                    <strong>{player}</strong>: {Object.values(scores[player] || {}).join(', ')}
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
