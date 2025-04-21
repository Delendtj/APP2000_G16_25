'use client'
//KL
import { useState } from 'react';
import Head from 'next/head';
import '../spill.css';
import Header from '../../components/Header'; 

export default function Spill() {
  const [gameName, setGameName] = useState('');
  const [players, setPlayers] = useState([]);
  const [playerName, setPlayerName] = useState('');
  const [scores, setScores] = useState({});

  // Funksjon for å håndtere spillnavnet
  const handleGameNameChange = (e) => {
    setGameName(e.target.value);
  };

  // Funksjon for å legge til spiller
  const handleAddPlayer = () => {
    if (playerName && !players.includes(playerName)) {
      setPlayers([...players, playerName]);
      setScores({ ...scores, [playerName]: [] });
      setPlayerName('');
    }
  };

  // Funksjon for å registrere score
  const handleScoreChange = (player, score) => {
    setScores({
      ...scores,
      [player]: [...scores[player], parseInt(score)],
    });
  };

  return (
    <>
      <Head>
        <title>Om Discgolf</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <Header/>
      <div className="container">
        <div className="right-panel">
          <h2>Spillkart</h2>
          <div id="map" className="map" style={{ width: '100%', height: '400px' }}></div>
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
