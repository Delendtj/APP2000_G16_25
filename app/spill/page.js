'use client'
//KL
import { useEffect } from 'react';
import Head from 'next/head';
import '../globals.css';
import Header from '../../components/Header'; 

export default function Spill() {
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
