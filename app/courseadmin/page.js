'use client';
import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Header from '../../components/Header';
import CourseCard from '../../components/CourseCard';
import { useAuth } from '../../module/context';
import '../globals2.css';
import { initMap, flyToLocation, resetMapView, enableDrawPoint, source, clearMapFeatures,} from '../../module/map';

export default function BanesokPage() {
  const { user, isAdmin } = useAuth();
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('');
  const [holeFilter, setHoleFilter] = useState('');
  const [clubFilter, setClubFilter] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [viewMode, setViewMode] = useState('course');
  const [holeData, setHoleData] = useState([]);
  const [selectedHole, setSelectedHole] = useState(null);
  const [geometry, setGeometry] = useState(null);
  const [addingNew, setAddingNew] = useState(false);
  const [message, setMessage] = useState('');
  const [form, setForm] = useState({ par: '', distance: '', description: '', outOfBounds: false });

  const hasAdminAccess = user && isAdmin && isAdmin();

const baseUrl =
    process.env.NODE_ENV === "production"
      ? "https://vast-mesa-22158-90c21fc001d1.herokuapp.com"
      : "http://localhost:5000";
  
  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (courses.length > 0) {
      window.courseData = courses;
      initMap('map', null, null, [], null, null, false, hasAdminAccess ? 'admin' : 'readonly');
    }
  }, [courses, hasAdminAccess]);

  useEffect(() => {
    if (selectedCourse && viewMode === 'holes') {
      fetchHoles(selectedCourse.courseId);
    }
  }, [selectedCourse, viewMode]);

  useEffect(() => {
    if (viewMode === 'holes' && holeData.length > 0 && selectedCourse) {
      if (hasAdminAccess) {
        initMap("map", null, handleDrawNewHole, holeData, handleMoveHole, handleSelectHole, false, 'admin');
      } else {
        initMap("map", null, null, holeData, null, null, false, 'readonly');
      }
    }
  }, [holeData, viewMode, selectedCourse, hasAdminAccess]);

  const fetchCourses = async () => {
    try {
      const res = await fetch(`${baseUrl}/models/courses`);
      const data = await res.json();
      setCourses(data);
    } catch (error) {
      console.error('Feil ved henting av baner:', error);
    }
  };

  const fetchHoles = async (courseId) => {
    try {
      const res = await fetch(`${baseUrl}/api/holes/courses/${courseId}`);
      const data = await res.json();
      if (Array.isArray(data)) setHoleData(data);
    } catch (err) {
      console.error('Feil ved henting av hull:', err);
    }
  };

  const handleDrawNewHole = (geom) => {
    setGeometry(geom);
    setForm({ par: '', distance: '', description: '', outOfBounds: false });
    setAddingNew(true);
    setSelectedHole(null);
    setMessage("Fyll ut info og lagre hullet.");
  };

  const handleSelectHole = (holeId) => {
    const hole = holeData.find(h => {
      const rawId = h.holeId;
      const normalized = typeof rawId === 'object' && rawId?.$numberLong
        ? rawId.$numberLong
        : rawId?.toString?.() || rawId;
      return normalized?.toString() === holeId?.toString();
    });

    if (!hole) return setMessage('Fant ikke hull med ID: ' + holeId);
    setSelectedHole(hole);
    setAddingNew(false);
    setGeometry(hole.geometry);
    setForm({
      par: hole.par,
      distance: hole.distance,
      description: hole.description,
      outOfBounds: hole.outOfBounds === 1,
    });
  };

  const handleMoveHole = (holeId, newCoords) => {
    const hole = holeData.find(h => {
      const rawId = h.holeId;
      const normalized = typeof rawId === 'object' && rawId?.$numberLong
        ? rawId.$numberLong
        : rawId?.toString?.() || rawId;
      return normalized?.toString() === holeId?.toString();
    });

    if (!hole) return;
    setSelectedHole(hole);
    setGeometry({ type: 'Point', coordinates: newCoords });
    setMessage("Hull flyttet – husk å lagre endringene.");
  };

  const uniqueDifficulties = [...new Set(courses.map(c => c.difficulty))];
  const uniqueHoles = [...new Set(courses.map(c => c.numberOfHoles))].sort((a, b) => a - b);
  const uniqueClubs = [...new Set(courses.map(c => c.clubId))];

  return (
    <>
      <Head><title>Endre baner</title></Head>
      <Header />
      <div className="container">
        <h1>Endre baner {hasAdminAccess && <span style={{ fontSize: '0.7em', color: '#28a745' }}>(Admin tilgang)</span>}</h1>

        <div className="search-bar" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
          <input type="text" placeholder="Søk etter baner..." value={search} onChange={(e) => setSearch(e.target.value)} />
          <select value={difficultyFilter} onChange={(e) => setDifficultyFilter(e.target.value)}>
            <option value="">Vanskelighetsgrad</option>
            {uniqueDifficulties.map(diff => <option key={diff} value={diff}>{diff}</option>)}
          </select>
          <select value={holeFilter} onChange={(e) => setHoleFilter(e.target.value)}>
            <option value="">Antall hull</option>
            {uniqueHoles.map(h => <option key={h} value={h}>{h} hull</option>)}
          </select>
          <select value={clubFilter} onChange={(e) => setClubFilter(e.target.value)}>
            <option value="">Klubb</option>
            {uniqueClubs.map(id => <option key={id} value={id}>Klubb #{id}</option>)}
          </select>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="">Sorter etter</option>
            <option value="name">Navn (A-Å)</option>
            <option value="holes">Antall hull</option>
            <option value="rating">Rating</option>
          </select>
          <button onClick={() => {
            setSearch('');
            setDifficultyFilter('');
            setHoleFilter('');
            setClubFilter('');
            setSortBy('');
          }}>Nullstill filtre</button>
          <button onClick={() => {
            setViewMode('course');
            resetMapView();
            window.courseData = courses;
            initMap('map', null, null, [], null, null, false, hasAdminAccess ? 'admin' : 'readonly');
          }}>Zoom ut</button>
        </div>

        <div className="main-content">
          <div className="course-list">
            {courses.map(course => (
              <CourseCard key={course._id} course={course} onClick={() => {
                const coords = course.coordinates?.coordinates;
                if (Array.isArray(coords)) {
                  setSelectedCourse(course);
                  setViewMode('holes');
                  setSelectedHole(null);
                  setAddingNew(false);
                  clearMapFeatures();
                  fetchHoles(course.courseId);
                  setTimeout(() => flyToLocation(coords[0], coords[1]), 400);
                }
              }} />
            ))}
          </div>

          <div className="map-container">
            <div id="map" style={{ width: '100%', height: '500px' }}></div>

            {hasAdminAccess && selectedCourse && !addingNew && (
              <button style={{ marginTop: '10px' }} onClick={() => {
                setAddingNew(true);
                setSelectedHole(null);
                setGeometry(null);
                setMessage("Klikk på kartet for å plassere hullet.");
                enableDrawPoint(handleDrawNewHole, source);
              }}>
                Tegn nytt hull
              </button>
            )}

            {hasAdminAccess && (selectedHole || addingNew) && (
              <div style={{ backgroundColor: '#949494',border: '1px solid #ccc', padding: 10, marginTop: '10px' }}>
                <h3>{selectedHole ? `Hull ${selectedHole.holeNumber}` : "Nytt hull"}</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div><label>Par:</label><input type="number" value={form.par} onChange={e => setForm({ ...form, par: e.target.value })} /></div>
                  <div><label>Distanse:</label><input type="number" value={form.distance} onChange={e => setForm({ ...form, distance: e.target.value })} /></div>
                </div>
                <div><label>Beskrivelse:</label><textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
                <div><label><input type="checkbox" checked={form.outOfBounds} onChange={e => setForm({ ...form, outOfBounds: e.target.checked })} /> Out of Bounds</label></div>
                <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
                  {addingNew ? (
                    <button onClick={async () => {
                      const newHole = {
                        holeId: Date.now(),
                        holeNumber: holeData.length + 1,
                        courseId: selectedCourse.courseId,
                        par: Number(form.par),
                        distance: Number(form.distance),
                        description: form.description,
                        outOfBounds: form.outOfBounds ? 1 : 0,
                        geometry,
                        user
                      };
                      const res = await fetch(`/api/holes`, {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                          'Authorization': JSON.stringify(user)
                        },
                        body: JSON.stringify(newHole)
                      });
                      if (res.ok) {
                        setMessage("Hull lagret!");
                        setForm({ par: '', distance: '', description: '', outOfBounds: false });
                        setGeometry(null);
                        setAddingNew(false);
                        await fetchHoles(selectedCourse.courseId);
                      } else {
                        setMessage("Feil ved lagring av nytt hull");
                      }
                    }}>Lagre nytt hull</button>
                  ) : (
                    <>
                      <button onClick={async () => {
                        const updated = {
                          par: Number(form.par),
                          distance: Number(form.distance),
                          description: form.description,
                          outOfBounds: form.outOfBounds ? 1 : 0,
                          geometry: geometry || selectedHole.geometry,
                          user,
                          courseId: selectedCourse.courseId
                        };
                        const res = await fetch(`/api/holes/${selectedHole._id}`, {
                          method: 'PUT',
                          headers: {
                            'Content-Type': 'application/json',
                            'Authorization': JSON.stringify(user)
                          },
                          body: JSON.stringify(updated)
                        });
                        if (res.ok) {
                          setMessage("Hull oppdatert");
                          await fetchHoles(selectedCourse.courseId);
                        } else {
                          setMessage("Feil ved oppdatering");
                        }
                      }}>Lagre endringer</button>
                      <button onClick={async () => {
                        const res = await fetch(`/api/holes/${selectedHole._id}`, {
                          method: 'DELETE',
                          headers: {
                            'Content-Type': 'application/json',
                            'Authorization': JSON.stringify(user)
                          },
                          body: JSON.stringify({ user, courseId: selectedCourse.courseId })
                        });
                        if (res.ok) {
                          setMessage("Hull slettet");
                          setSelectedHole(null);
                          await fetchHoles(selectedCourse.courseId);
                        } else {
                          setMessage("Feil ved sletting");
                        }
                      }}>Slett hull</button>
                    </>
                  )}
                </div>
              </div>
            )}

            {message && <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#d4edda', color: '#155724' }}>{message}</div>}
          </div>
        </div>
      </div>
    </>
  );
}
