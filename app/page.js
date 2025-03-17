import React from 'react';
import Link from 'next/link'
import Head from 'next/head';
import './globals.css';
import Header from '../components/Header'; 

function App({Component, pageProps}) {
  return (

    <>
    <Head>
      <title>Om Discgolf</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </Head>

    <Header/>

    <div className="content">
      <h2>Hva er Discgolf?</h2>
      <p>Discgolf er en sport som ligner på vanlig golf, men i stedet for ball og køller bruker spillerne en frisbee...</p>

      <h2>Regler</h2>
      <p>Spillet starter fra et utkastfelt. Spilleren kaster discen mot kurven...</p>

      <h2>Utstyr</h2>
      <p>Det finnes ulike typer discer: driver, midrange og putter...</p>

      <h2>Hvor kan du spille?</h2>
      <p>Discgolfbaner finnes over hele Norge...</p>
    </div>
     </>
  );
}

const stylesb = {
  button: {
    display: 'flex',
    justifyContent: 'center',
    
    textAlign: 'center',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    margin: 'auto',
  },
};

export default App;
