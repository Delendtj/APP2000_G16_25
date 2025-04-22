import Map from 'ol/Map.js';
import View from 'ol/View.js';
import Feature from 'ol/Feature.js';
import Point from 'ol/geom/Point.js';
import TileLayer from 'ol/layer/Tile.js';
import VectorLayer from 'ol/layer/Vector.js';
import OSM from 'ol/source/OSM.js';
import VectorSource from 'ol/source/Vector.js';
import { fromLonLat, toLonLat } from 'ol/proj.js';
import { Style, Circle as CircleStyle, Fill, Stroke, Text } from 'ol/style.js';
import Draw from 'ol/interaction/Draw.js';
import Select from 'ol/interaction/Select.js';
import Translate from 'ol/interaction/Translate.js';

let map;
export let source;
let drawInteraction;

export function initMap(targetId, typeSelectId = null, onNewDraw = null, holes = [], onMove = null, onSelect = null, enableDraw = false, mode = 'readonly') {
  if (map) {
    map.setTarget(null);
    map = null;
  }

  source = new VectorSource();
  const baseLayer = new TileLayer({ source: new OSM() });
  const vectorLayer = new VectorLayer({ source });

  map = new Map({
    target: targetId,
    layers: [baseLayer, vectorLayer],
    view: new View({
      center: fromLonLat([10.75, 59.91]),
      zoom: 6,
    }),
  });

  if (Array.isArray(window.courseData)) {
    window.courseData.forEach((course) => {
      const coords = course.coordinates?.coordinates;
      if (Array.isArray(coords) && coords.length === 2) {
        const [lon, lat] = coords;

        const feature = new Feature({
          geometry: new Point(fromLonLat([lon, lat])),
          name: course.name,
          type: 'course',
        });

        feature.setStyle(new Style({
          image: new CircleStyle({
            radius: 6,
            fill: new Fill({ color: '#007bff' }),
            stroke: new Stroke({ color: '#fff', width: 2 }),
          }),
        }));

        source.addFeature(feature);
      }
    });
  }

  holes.forEach((hole, index) => {
    const coords = hole.geometry?.coordinates;
    if (Array.isArray(coords) && coords.length === 2) {
      const [lon, lat] = coords;

      const feature = new Feature({
        geometry: new Point(fromLonLat([lon, lat])),
        type: 'hole',
        holeNumber: index + 1,
        holeId: hole.holeId || index + 1,
      });

      feature.setStyle(new Style({
        image: new CircleStyle({
          radius: 6,
          fill: new Fill({ color: '#28a745' }),
          stroke: new Stroke({ color: '#fff', width: 2 }),
        }),
        text: new Text({
          text: `${index + 1}`,
          offsetY: -15,
          font: 'bold 12px sans-serif',
          fill: new Fill({ color: '#000' }),
          stroke: new Stroke({ color: '#fff', width: 3 }),
        }),
      }));

      feature.setId(feature.get('holeId'));
      feature.set('holeId', feature.get('holeId'));
      source.addFeature(feature);
    }
  });

  if (mode === 'admin') {
    const select = new Select();
    select.on('select', (e) => {
      const feature = e.selected[0];
      if (feature) {
        const holeId = feature.get('holeId');
        if (holeId && onSelect) onSelect(holeId);
      }
    });
    map.addInteraction(select);

    const translate = new Translate({ features: select.getFeatures() });
    translate.on('translateend', (e) => {
      const feature = e.features.item(0);
      if (feature) {
        const coords = toLonLat(feature.getGeometry().getCoordinates());
        const holeId = feature.get('holeId');
        if (holeId && onMove) onMove(holeId, coords);
      }
    });
    map.addInteraction(translate);

    if (enableDraw && onNewDraw) {
      enableDrawPoint(onNewDraw, source);
    }
  }
}

export function enableDrawPoint(onDrawComplete, drawSource) {
  if (!map || !drawSource) return;

  if (drawInteraction) map.removeInteraction(drawInteraction);

  drawInteraction = new Draw({
    source: drawSource,
    type: 'Point',
  });

  drawInteraction.on('drawend', (event) => {
    const coords = toLonLat(event.feature.getGeometry().getCoordinates());
    onDrawComplete({ type: 'Point', coordinates: coords });
    map.removeInteraction(drawInteraction);
  });

  map.addInteraction(drawInteraction);
}

export function flyToLocation(lon, lat, zoom = 15) {
  if (!map) return;
  map.getView().animate({
    center: fromLonLat([lon, lat]),
    zoom,
    duration: 500,
  });
}

export function resetMapView() {
  if (!map) return;
  map.getView().animate({
    center: fromLonLat([10.75, 59.91]),
    zoom: 6,
    duration: 800,
  });
}

export function addHolePointsToMap(courseId, holes) {
  if (!map || !Array.isArray(holes)) return;

  const vectorLayer = map.getLayers().getArray().find(l => l instanceof VectorLayer);
  if (!vectorLayer) return;

  const source = vectorLayer.getSource();
  if (!source) return;

  source.getFeatures().forEach(f => {
    const type = f.get('type');
    if (type === 'hole' || type === 'course') {
      source.removeFeature(f);
    }
  });

  holes.forEach((hole, index) => {
    const coords = hole.geometry?.coordinates;
    if (Array.isArray(coords) && coords.length === 2) {
      const [lon, lat] = coords;

      const feature = new Feature({
        geometry: new Point(fromLonLat([lon, lat])),
        type: 'hole',
        holeNumber: index + 1,
        holeId: hole.holeId || index + 1,
      });

      feature.setStyle(new Style({
        image: new CircleStyle({
          radius: 6,
          fill: new Fill({ color: '#28a745' }),
          stroke: new Stroke({ color: '#fff', width: 2 }),
        }),
        text: new Text({
          text: `${index + 1}`,
          offsetY: -15,
          font: 'bold 12px sans-serif',
          fill: new Fill({ color: '#000' }),
          stroke: new Stroke({ color: '#fff', width: 3 }),
        }),
      }));

      feature.setId(feature.get('holeId'));
      feature.set('holeId', feature.get('holeId'));
      source.addFeature(feature);
    }
  });
  
}
export function clearMapFeatures() {
  if (!map || !source) return;
  source.clear(); // 
}
