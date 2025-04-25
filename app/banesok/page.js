'use client';
import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Header from '../../components/Header';
import CourseCard from '../../components/CourseCard';
import '../globals2.css';
import { initMap, flyToLocation, resetMapView, clearMapFeatures,} from '../../module/map';

export default function BanesokPage() {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('');
  const [holeFilter, setHoleFilter] = useState('');
  const [clubFilter, setClubFilter] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [holeData, setHoleData] = useState([]);
  const [viewMode, setViewMode] = useState('course');

const baseUrl =
    process.env.NODE_ENV === "production"
      ? "https://vast-mesa-22158-90c21fc001d1.herokuapp.com"
      : "http://localhost:5000";
  
  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (Array.isArray(courses) && courses.length > 0) {
      window.courseData = courses;
      initMap('map', null, null, [], null, null, false, 'readonly');
    }
  }, [courses]);

  useEffect(() => {
    if (selectedCourse && viewMode === 'holes') {
      fetchHoles(selectedCourse.courseId);
    }
  }, [selectedCourse, viewMode]);

  useEffect(() => {
    if (holeData.length > 0 && selectedCourse && viewMode === 'holes') {
      initMap("map", null, null, holeData, null, null, false, 'readonly');
    }
  }, [holeData, selectedCourse, viewMode]);

  const fetchCourses = async () => {
    try {
      const res = await fetch(baseUrl + '/models/courses');
      const data = await res.json();
      setCourses(data);
    } catch (error) {
      console.error('Feil ved henting av baner:', error);
    }
  };

  const fetchHoles = async (courseId) => {
    try {
      const res = await fetch(baseUrl + `/api/holes/courses/${courseId}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setHoleData(data);
      }
    } catch (err) {
      console.error('Feil ved henting av hull:', err);
    }
  };

  const getAverageRating = (course) => {
    if (!course.reviews?.length) return 0;
    return course.reviews.reduce((sum, r) => sum + r.rating, 0) / course.reviews.length;
  };

  const uniqueDifficulties = [...new Set(courses.map(c => c.difficulty))];
  const uniqueHoles = [...new Set(courses.map(c => c.numberOfHoles))].sort((a, b) => a - b);
  const uniqueClubs = [...new Set(courses.map(c => c.clubId))];

  const handleReset = () => {
    setViewMode('course');
    resetMapView();
    window.courseData = courses;
    initMap('map', null, null, [], null, null, false, 'readonly');
  };
const filteredCourses = courses
     .filter(course =>
       (!difficultyFilter || course.difficulty === difficultyFilter) &&
       (!holeFilter || course.numberOfHoles === parseInt(holeFilter)) &&
       (!clubFilter || course.clubId.toString() === clubFilter) &&
       (!search || course.name.toLowerCase().includes(search.toLowerCase()))
     )
     .sort((a, b) => {
       if (sortBy === "name") return a.name.localeCompare(b.name);
       if (sortBy === "holes") return a.numberOfHoles - b.numberOfHoles;
       if (sortBy === "rating") {
         const avgA = (a.reviews?.reduce((s, r) => s + r.rating, 0) || 0) / (a.reviews?.length || 1);
         const avgB = (b.reviews?.reduce((s, r) => s + r.rating, 0) || 0) / (b.reviews?.length || 1);
         return avgB - avgA;
       }
       return 0;
     });
 
 
  return (
    <>
      <Head><title>Baner</title></Head>
      <Header />
      <div className="container">
        <h1>Søk baner</h1>

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
          <button onClick={handleReset}>Zoom ut</button>
        </div>

        <div className="main-content">
          <div className="course-list">
            {filteredCourses.map(course => (
              <CourseCard key={course._id} course={course} onClick={() => {
                const coords = course.coordinates?.coordinates;
                if (Array.isArray(coords)) {
                  setSelectedCourse(course);
                  setViewMode('holes');
                  clearMapFeatures();
                  fetchHoles(course.courseId);
                  setTimeout(() => flyToLocation(coords[0], coords[1]), 400);
                }
              }} />
            ))}
          </div>

          <div className="map-container">
            <div id="map" style={{ width: '100%', height: '500px' }}></div>
          </div>
        </div>
      </div>
    </>
  );
}
