'use client'
//KL
import { useEffect } from 'react';
import Head from 'next/head';
import '../globals.css';
import Header from '../../components/Header'; 

export default function Spill() {
  
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
    </div>
    </>
  );
}
