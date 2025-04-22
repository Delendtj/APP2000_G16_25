'use client';

import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Header from '../../components/Header';
import './spill.css';

export default function Spill() {
  const [players, setPlayers] = useState([]);
  const [playerName, setPlayerName] = useState('');
  const [holeCount, setHoleCount] = useState(9);
  const [currentHole, setCurrentHole] = useState(1);
  const [scores, setScores] = useState({});
  const [gameStarted, setGameStarted] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(5);
  const [showStats, setShowStats] = useState(false);

  useEffect(() => {
    async function fetchCourses() {
      try {
        const baseUrl = process.env.NODE_ENV === 'production'
          ? 'https://vast-mesa-22158-90c21fc001d1.herokuapp.com'
          : 'http://localhost:5000';
        const res = await fetch(`${baseUrl}/models/courses`);
        const data = await res.json();
        setCourses(data);
      } catch (err) {
        console.error("Feil ved henting av baner:", err);
      }
    }

    fetchCourses();
  }, []);

  const startGame = () => {
    if (!selectedCourse || players.length === 0) return;

    const initialScores = {};
    players.forEach(player => {
      initialScores[player] = {};
    });

    setHoleCount(selectedCourse.numberOfHoles || 9);
    setScores(initialScores);
    setCurrentHole(1);
    setGameStarted(true);
    setGameFinished(false);
  };

  const handleAddPlayer = () => {
    if (playerName && !players.includes(playerName)) {
      setPlayers([...players, playerName]);
      setPlayerName('');
    }
  };

  const handleScoreChange = (player, change) => {
    setScores(prev => ({
      ...prev,
      [player]: {
        ...prev[player],
        [currentHole]: (prev[player]?.[currentHole] || 3) + change,
      },
    }));
  };

  const handleNextHole = () => {
    if (currentHole < holeCount) {
      setCurrentHole(currentHole + 1);
    } else {
      setGameFinished(true);
    }
  };

  const totalScore = (player) => {
    return Object.values(scores[player] || {}).reduce((acc, val) => acc + (val - 3), 0);
  };

  const submitReview = () => {
    if (!selectedCourse || !reviewText) return;
    
    const newReview = {
      courseId: selectedCourse._id,
      courseName: selectedCourse.name,
      rating,
      text: reviewText,
      date: new Date().toLocaleDateString()
    };
    
    setReviews([...reviews, newReview]);
    setReviewText('');
    setRating(5);
  };

  const getPlayerStats = (player) => {
    const playerScores = scores[player] || {};
    const scoresArray = Object.values(playerScores);
    
    if (scoresArray.length === 0) return null;
    
    const total = scoresArray.reduce((acc, val) => acc + val, 0);
    const average = (total / scoresArray.length).toFixed(1);
    const bestHole = Math.min(...scoresArray);
    const worstHole = Math.max(...scoresArray);
    
    return {
      total,
      average,
      bestHole,
      worstHole,
      holesPlayed: scoresArray.length
    };
  };

  return (
    <>
      <Head>
        <title>Spill Frisbeegolf</title>
      </Head>
      <Header />

      <div className="spill-wrapper">
        {!gameStarted ? (
          <div className="setup">
            <h2>Start nytt spill</h2>

            <label>
              Velg bane:
              <select
                value={selectedCourse?._id || ''}
                onChange={(e) => {
                  const course = courses.find(c => c._id === e.target.value);
                  setSelectedCourse(course);
                }}
              >
                <option value="">-- Velg en bane --</option>
                {courses.map(course => (
                  <option key={course._id} value={course._id}>
                    {course.name} ({course.numberOfHoles} hull)
                  </option>
                ))}
              </select>
            </label>

            <label>
              Legg til spiller:
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
              />
              <button onClick={handleAddPlayer}>Legg til</button>
            </label>

            <ul className="player-list">
              {players.map((p) => <li key={p}>{p}</li>)}
            </ul>

            <button className="start-btn" onClick={startGame}>
              Start spill
            </button>
          </div>
        ) : gameFinished ? (
          <div className="game-finished">
            <div className="scoreboard">
              <h2>Resultater</h2>
              <table>
                <thead>
                  <tr>
                    <th>Spiller</th>
                    <th>Totalt (+/- par)</th>
                    <th>
                      <button 
                        className="stats-toggle"
                        onClick={() => setShowStats(!showStats)}
                      >
                        {showStats ? 'Skjul' : 'Vis'} statistikk
                      </button>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {players.map(player => (
                    <tr key={player}>
                      <td>{player}</td>
                      <td>{totalScore(player)}</td>
                      <td>
                        {showStats && getPlayerStats(player) && (
                          <div className="player-stats">
                            <p>Gjennomsnitt: {getPlayerStats(player).average}</p>
                            <p>Beste hull: {getPlayerStats(player).bestHole}</p>
                            <p>Værste hull: {getPlayerStats(player).worstHole}</p>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {selectedCourse && (
              <div className="review-section">
                <h3>Anmeld banen: {selectedCourse.name}</h3>
                <div className="rating">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`star ${star <= rating ? 'filled' : ''}`}
                      onClick={() => setRating(star)}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Skriv din anmeldelse her..."
                />
                <button onClick={submitReview}>Send anmeldelse</button>
                
                {reviews.filter(r => r.courseId === selectedCourse._id).length > 0 && (
                  <div className="reviews-list">
                    <h4>Tidligere anmeldelser:</h4>
                    {reviews
                      .filter(r => r.courseId === selectedCourse._id)
                      .map((review, index) => (
                        <div key={index} className="review">
                          <div className="review-rating">
                            {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                          </div>
                          <p>{review.text}</p>
                          <small>{review.date}</small>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="hole-play">
            <h2>Hull {currentHole} av {holeCount}</h2>
            {players.map(player => (
              <div key={player} className="score-entry">
                <h4>{player}</h4>
                <div className="score-controls">
                  <button onClick={() => handleScoreChange(player, -1)}>-</button>
                  <span>{scores[player]?.[currentHole] || 3}</span>
                  <button onClick={() => handleScoreChange(player, 1)}>+</button>
                </div>
              </div>
            ))}

            <button className="next-hole-btn" onClick={handleNextHole}>
              {currentHole === holeCount ? "Avslutt spill" : "Neste hull"}
            </button>
          </div>
        )}
      </div>
    </>
  );
}