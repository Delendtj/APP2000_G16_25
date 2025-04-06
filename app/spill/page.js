'use client'
//KL
import { useState, useEffect } from 'react';
import Head from 'next/head';
import '../globals.css';
import Header from '../../components/Header'; 

export default function Spill() {
  const [players, setPlayers] = useState([]);
  const [numPlayers, setNumPlayers] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [scores, setScores] = useState([]);

  useEffect(() => {
    // Load Google Maps dynamically
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?AIzaSyD1vL1uzCXSb3FDUTcLgydbyDf_cJlNUEE&callback=initMap`;
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    // Callback function to initialize map
    window.initMap = function () {
      new window.google.maps.Map(document.getElementById('map'), {
        center: { lat: 59.9139, lng: 10.7522 }, // Oslo, Norway
        zoom: 10,
      });
    };
  }, []);

  const handleNumPlayersChange = (e) => {
    const num = e.target.value;
    setNumPlayers(num);
    setPlayers(new Array(num).fill(''));
    setScores(new Array(num).fill(0));
  };

  const handlePlayerNameChange = (index, e) => {
    const updatedPlayers = [...players];
    updatedPlayers[index] = e.target.value;
    setPlayers(updatedPlayers);
  };

  const handleStartGame = () => {
    if (players.some(player => player === '')) {
      alert('Alle spillere må ha et navn!');
      return;
    }
    setGameStarted(true);
  };

  const handleScoreChange = (playerIndex, score) => {
    const updatedScores = [...scores];
    updatedScores[playerIndex] = score;
    setScores(updatedScores);
  };

  return (
    <>
      <Head>
        <title>Om Discgolf</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <Header />
      <div className="container">
        <div className="right-panel">
          <h2>Opprett Spill</h2>
          {!gameStarted ? (
            <div>
              <div>
                <label htmlFor="numPlayers">Antall spillere: </label>
                <input 
                  type="number" 
                  id="numPlayers" 
                  value={numPlayers} 
                  onChange={handleNumPlayersChange} 
                  min="1" 
                />
              </div>

              {Array.from({ length: numPlayers }).map((_, index) => (
                <div key={index}>
                  <label>Spiller {index + 1} navn: </label>
                  <input 
                    type="text" 
                    value={players[index]} 
                    onChange={(e) => handlePlayerNameChange(index, e)} 
                    placeholder={`Spiller ${index + 1}`}
                  />
                </div>
              ))}

              <button onClick={handleStartGame}>Start Spill</button>
            </div>
          ) : (
            <div>
              <h3>Scoreboard</h3>
              <table>
                <thead>
                  <tr>
                    <th>Spiller</th>
                    <th>Score</th>
                  </tr>
                </thead>
                <tbody>
                  {players.map((player, index) => (
                    <tr key={index}>
                      <td>{player}</td>
                      <td>
                        <input 
                          type="number" 
                          value={scores[index]} 
                          onChange={(e) => handleScoreChange(index, e.target.value)} 
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
