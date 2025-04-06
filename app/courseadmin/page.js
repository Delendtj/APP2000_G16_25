'use client'
import React, { useEffect } from 'react';
import { initMap } from '../../module/map';
import Head from 'next/head';
import Header from '../../components/Header'; 


export default function AnotherPage() {
  useEffect(() => {
    initMap('map', 'type');
  }, []);

  return (
<>
<Head>
      <title>Om Discgolf</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </Head>

    <Header/>
    <div>
      <h1>Another Page with Map</h1>
      <select id="type">
        <option value="Point">Point</option>
        <option value="LineString">LineString</option>
        <option value="Polygon">Polygon</option>
      </select>
      <div id="map" style={{ width: '50%', height: '400px' }}></div>
    </div>
    </>
  );
}