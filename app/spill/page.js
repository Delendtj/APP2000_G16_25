'use client';

import React, { useState } from 'react';
import Head from 'next/head';
import '../globals.css';
import Header from '../../components/Header'; 

export default function Spill() {
  const initialPlayers = [];

  const [players, setPlayers] = useState(initialPlayers);
  const [holes, setHoles] = useState(9);
  const [gameStarted, setGameStarted] = useState(false);
  const [numPlayers, setNumPlayers] = useState(2); 
  const [playerNames, setPlayerNames] = useState([]);

  const handlePlayerNameChange = (index, value) => {
    const updatedNames = [...playerNames];
    updatedNames[index] = value;
    setPlayerNames(updatedNames);
  };

  const startGame = () => {
    const setupPlayers = playerNames.map((name) => ({ name, scores: Array(holes).fill(0) }));
    setPlayers(setupPlayers);
    setGameStarted(true);
  };

  const handlePlayerCountChange = (e) => {
    const count = parseInt(e.target.value);
    setNumPlayers(count);
    setPlayerNames(new Array(count).fill(''));
  };

  return (
    <>
      <Head>
        <title>Om Discgolf</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Disc Golf Sporing</h1>

  
        {!gameStarted && (
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Start nytt spill</h2>

            <input
              type="number"
              min="1"
              max="18"
              placeholder="Antall hull"
              value={holes}
              onChange={(e) => setHoles(parseInt(e.target.value))}
              style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ccc', marginBottom: '12px', width: '100%' }}
            />

            <input
              type="number"
              min="1"
              value={numPlayers}
              onChange={handlePlayerCountChange}
              placeholder="Antall spillere"
              style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ccc', marginBottom: '12px', width: '100%' }}
            />

          
            {Array.from({ length: numPlayers }).map((_, idx) => (
              <input
                key={idx}
                type="text"
                placeholder={`Spiller ${idx + 1} navn`}
                value={playerNames[idx]}
                onChange={(e) => handlePlayerNameChange(idx, e.target.value)}
                style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ccc', marginBottom: '12px', width: '100%' }}
              />
            ))}

            <button onClick={startGame} style={{ padding: '12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
              Start spill
            </button>
          </div>
        )}

    
        {gameStarted && (
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Poengkort</h2>
            {players.map((player, pIdx) => (
              <div key={pIdx} style={{ marginBottom: '16px' }}>
                <h3 style={{ fontWeight: '500', marginBottom: '8px' }}>{player.name}</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(9, 1fr)', gap: '8px' }}>
                  {player.scores.map((score, hIdx) => (
                    <input
                      key={hIdx}
                      type="number"
                      min="1"
                      value={score}
                      onChange={(e) => {
                        const updated = [...players];
                        updated[pIdx].scores[hIdx] = parseInt(e.target.value);
                        setPlayers(updated);
                      }}
                      style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ccc', marginBottom: '12px', width: '100%' }}
                    />
                  ))}
                </div>
              </div>
            ))}
            <button onClick={() => {  }} style={{ padding: '12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
              Ferdig
            </button>
          </div>
        )}
      </div>
    </>
  );
}
