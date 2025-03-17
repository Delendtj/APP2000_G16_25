'use client'
import React, { useEffect } from 'react';
import { initMap } from '../../module/map';

export default function AnotherPage() {
  useEffect(() => {
    initMap('map', 'type');
  }, []);

  return (
    <div>
      <h1>Another Page with Map</h1>
      <select id="type">
        <option value="Point">Point</option>
        <option value="LineString">LineString</option>
        <option value="Polygon">Polygon</option>
      </select>
      <div id="map" style={{ width: '50%', height: '400px' }}></div>
    </div>
  );
}