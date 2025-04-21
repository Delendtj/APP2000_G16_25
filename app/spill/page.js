import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Header from '../../components/Header';
import '../globals.css';

export default function SpillPage() {
  const [courses, setCourses] = useState([]);  // For å lagre alle baner
  const [selectedCourse, setSelectedCourse] = useState(null); // For å lagre den valgte banen
  const [currentHole, setCurrentHole] = useState(1); // Hullnummeret spilleren er på
  const [scores, setScores] = useState({}); // For å lagre poeng for hvert hull
  const [gameOver, setGameOver] = useState(false); // For å sjekke om spillet er over

  // Hente alle banene når siden lastes
  useEffect(() => {
    async function fetchCourses() {
      try {
        const baseUrl = process.env.NODE_ENV === 'production'
          ? 'https://vast-mesa-22158-90c21fc001d1.herokuapp.com'
          : 'http://localhost:5000';

        const response = await fetch(`${baseUrl}/models/courses`);
        if (!response.ok) throw new Error("Error fetching courses");

        const data = await response.json();
        setCourses(data); // Sett banene til state
      } catch (error) {
        console.error("Error loading data:", error.message);
      }
    }

    fetchCourses();
  }, []);

  // Funksjon som håndterer banevalg
  const handleCourseSelect = (courseId) => {
    const course = courses.find(c => c._id === courseId);
    setSelectedCourse(course); // Sett den valgte banen som valgt
    setScores({}); // Nullstill poeng
    setCurrentHole(1); // Start med hull 1
    setGameOver(false); // Nullstill spillstatus
  };

  // Funksjon for å registrere poeng for hvert hull
  const handleRoundScore = (hole, score) => {
    setScores(prevScores => ({
      ...prevScores,
      [hole]: score
    }));
  };

  // Funksjon for å gå videre til neste hull
  const nextHole = () => {
    if (currentHole < selectedCourse.numberOfHoles) {
      setCurrentHole(prevHole => prevHole + 1);
    } else {
      setGameOver(true); // Hvis vi er ferdig med alle hullene
    }
  };

  // Funksjon for å vise resultatene etter at spillet er over
  const calculateStats = () => {
    const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);
    const avgScore = (totalScore / selectedCourse.numberOfHoles).toFixed(1);
    return { totalScore, avgScore };
  };

  return (
    <>
      <Head>
        <title>Spill - Velg bane</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <Header />

      <div className="container">
        <h1>Velg bane å spille</h1>
        
        {/* Listevisning for baner */}
        <div className="course-list">
          {courses.map(course => (
            <div 
              key={course._id} 
              className="course-card" 
              style={{ cursor: 'pointer', border: '1px solid #ccc', padding: '10px', margin: '10px', borderRadius: '8px' }}
              onClick={() => handleCourseSelect(course._id)}
            >
              <h3>{course.name}</h3>
              <p><strong>Vanskelighetsgrad:</strong> {course.difficulty}</p>
              <p><strong>Antall hull:</strong> {course.numberOfHoles}</p>
              <p><strong>Klubb:</strong> #{course.clubId}</p>
              <p><strong>By:</strong> {course.city}</p>
            </div>
          ))}
        </div>

        {/* Hvis en bane er valgt */}
        {selectedCourse && !gameOver && (
          <div>
            <h2>{selectedCourse.name}</h2>
            <p>Hull {currentHole} av {selectedCourse.numberOfHoles}</p>

            {/* Registrer poeng for hvert hull */}
            <div>
              <label>Poeng for Hull {currentHole}:</label>
              <input
                type="number"
                min="1"
                max="10"
                value={scores[currentHole] || ''}
                onChange={(e) => handleRoundScore(currentHole, e.target.value)}
              />
            </div>

            {/* Neste hull knapp */}
            <button onClick={nextHole}>Neste hull</button>
          </div>
        )}

        {/* Hvis spillet er over, vis statistikk */}
        {gameOver && (
          <div>
            <h2>Spillet er over!</h2>
            <div>
              <p><strong>Total Poengsum:</strong> {calculateStats().totalScore}</p>
              <p><strong>Gjennomsnittlig Poengsum per hull:</strong> {calculateStats().avgScore}</p>
            </div>
            <button onClick={() => handleCourseSelect(selectedCourse._id)}>Start på nytt</button>
          </div>
        )}
      </div>
    </>
  );
}
