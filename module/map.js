import Map from 'ol/Map.js';
import View from 'ol/View.js';
import Draw from 'ol/interaction/Draw.js';
import Modify from 'ol/interaction/Modify.js';
import Snap from 'ol/interaction/Snap.js';
import TileLayer from 'ol/layer/Tile.js';
import VectorLayer from 'ol/layer/Vector.js';
import { get } from 'ol/proj.js';
import OSM from 'ol/source/OSM.js';
import VectorSource from 'ol/source/Vector.js';

import Feature from 'ol/Feature.js';
import Point from 'ol/geom/Point.js';
import { fromLonLat } from 'ol/proj.js';
import { Style, Circle as CircleStyle, Fill, Stroke } from 'ol/style.js';

let map; // Global variable to store the map instance

export function initMap(targetId, typeSelectId) {
  // Check if the map already exists and dispose of it
  if (map) {
    map.setTarget(null);
    map = null;
  }

  const raster = new TileLayer({
    source: new OSM(),
  });

  const source = new VectorSource();

  const vector = new VectorLayer({
    source: source,
    style: {
      'fill-color': 'rgba(255, 255, 255, 0.2)',
      'stroke-color': '#ffcc33',
      'stroke-width': 2,
      'circle-radius': 7,
      'circle-fill-color': '#ffcc33',
    },
  });

  // Limit multi-world panning to one world east and west of the real world.
  // Geometry coordinates have to be within that range.
  const extent = get('EPSG:3857').getExtent().slice();
  extent[0] += extent[0];
  extent[2] += extent[2];
  map = new Map({
    layers: [raster, vector],
    target: targetId,
    view: new View({
      center: fromLonLat([10.75, 59.91]), // Oslo center 
      zoom: 6,
      extent,
    }),
  });

  // add course points from window.courseData
  if (Array.isArray(window.courseData)) {
    window.courseData.forEach((course) => {
      const coords = course.coordinates?.coordinates;
      if (Array.isArray(coords) && coords.length === 2) {
        const [lon, lat] = coords;

        const feature = new Feature({
          geometry: new Point(fromLonLat([lon, lat])),
          name: course.name,
        });

        feature.setStyle(new Style({
          image: new CircleStyle({
            radius: 6,
            fill: new Fill({ color: '#007bff' }),
            stroke: new Stroke({ color: '#fff', width: 2 })
          })
        }));

        source.addFeature(feature);
      }

      console.log(window.courseData)
    });
  }

  const modify = new Modify({ source: source });
  map.addInteraction(modify);

  let draw, snap; 
  const typeSelect = document.getElementById(typeSelectId);

  function addInteractions() {
    draw = new Draw({
      source: source,
      type: typeSelect.value,
    });
    map.addInteraction(draw);
    snap = new Snap({ source: source });
    map.addInteraction(snap);
  }

  
  typeSelect.onchange = function () {
    map.removeInteraction(draw);
    map.removeInteraction(snap);
    addInteractions();
  };

  addInteractions();
}

export function flyToLocation(lon, lat, zoom = 15) {
  if (!map) return;
  map.getView().animate({
    center: fromLonLat([lon, lat]),
    zoom: zoom,
    duration: 500
  });
  
}
export function resetMapView() {
  if (!map) return;

  map.getView().animate({
    center: fromLonLat([10.75, 59.91]), 
    zoom: 6,
    duration: 800
  });
}
