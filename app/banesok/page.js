'use client';
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Header from '../../components/Header';
import '../globals.css';
import { initMap, flyToLocation, resetMapView } from '../../module/map';



export default function BanesokPage() {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("");
  const [holeFilter, setHoleFilter] = useState("");
  const [clubFilter, setClubFilter] = useState("");
  const [sortBy, setSortBy] = useState("");

  useEffect(() => {
    async function fetchCourses() {
      try {
        const baseUrl = process.env.NODE_ENV === 'production'
          ? 'https://vast-mesa-22158-90c21fc001d1.herokuapp.com'
          : 'http://localhost:5000';

        const response = await fetch(`${baseUrl}/models/courses`);
        if (!response.ok) throw new Error("Error fetching courses");

        const data = await response.json();
        setCourses(data);
      } catch (error) {
        console.error("Error loading data:", error.message);
      }
    }

    fetchCourses();
  }, []);

  const getAverageRating = (course) => {
    if (!course.reviews?.length) return 0;
    const total = course.reviews.reduce((sum, r) => sum + r.rating, 0);
    return total / course.reviews.length;
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.name.toLowerCase().includes(search.toLowerCase());
    const matchesDifficulty = difficultyFilter ? course.difficulty.toLowerCase() === difficultyFilter.toLowerCase() : true;
    const matchesHoles = holeFilter ? course.numberOfHoles === Number(holeFilter) : true;
    const matchesClub = clubFilter ? course.clubId === Number(clubFilter) : true;
    return matchesSearch && matchesDifficulty && matchesHoles && matchesClub;
  });

  const sortedCourses = [...filteredCourses].sort((a, b) => {
    if (sortBy === "name") return a.name.localeCompare(b.name);
    if (sortBy === "holes") return b.numberOfHoles - a.numberOfHoles;
    if (sortBy === "rating") return getAverageRating(b) - getAverageRating(a);
    return 0;
  });

  useEffect(() => {
    window.courseData = sortedCourses;
    initMap('map', 'type');
  }, [sortedCourses]);

  const uniqueDifficulties = [...new Set(courses.map(c => c.difficulty))];
  const uniqueHoles = [...new Set(courses.map(c => c.numberOfHoles))].sort((a, b) => a - b);
  const uniqueClubs = [...new Set(courses.map(c => c.clubId))];

  const clearFilters = () => {
    setSearch("");
    setDifficultyFilter("");
    setHoleFilter("");
    setClubFilter("");
    setSortBy("");
  };

  return (
    <>
      <Head>
        <title>Baner i nærheten</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <Header />

      <div className="container">
        <h1>Baner i nærheten</h1>
        <SearchBar
          search={search}
          setSearch={setSearch}
          difficultyFilter={difficultyFilter}
          setDifficultyFilter={setDifficultyFilter}
          holeFilter={holeFilter}
          setHoleFilter={setHoleFilter}
          clubFilter={clubFilter}
          setClubFilter={setClubFilter}
          sortBy={sortBy}
          setSortBy={setSortBy}
          clearFilters={clearFilters}
          uniqueDifficulties={uniqueDifficulties}
          uniqueHoles={uniqueHoles}
          uniqueClubs={uniqueClubs}
        />
        <div className="main-content">
          <CourseList
            courses={sortedCourses}
            onSelectCourse={(course) => {
              const coords = course.coordinates?.coordinates;
              if (Array.isArray(coords)) {
                const [lon, lat] = coords;
                flyToLocation(Number(lon), Number(lat));
              }
            }}
          />
          <Map courses={sortedCourses} />
        </div>
      </div>
    </>
  );
}

function SearchBar({
  search, setSearch,
  difficultyFilter, setDifficultyFilter,
  holeFilter, setHoleFilter,
  clubFilter, setClubFilter,
  sortBy, setSortBy,
  clearFilters,
  uniqueDifficulties, uniqueHoles, uniqueClubs
}) {
  return (
    <div className="search-bar" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
      <input
        type="text"
        placeholder="Søk etter baner..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <select value={difficultyFilter} onChange={(e) => setDifficultyFilter(e.target.value)}>
        <option value="">Vanskelighetsgrad</option>
        {uniqueDifficulties.map(diff => (
          <option key={diff} value={diff}>{diff}</option>
        ))}
      </select>
      <select value={holeFilter} onChange={(e) => setHoleFilter(e.target.value)}>
        <option value="">Antall hull</option>
        {uniqueHoles.map(h => (
          <option key={h} value={h}>{h} hull</option>
        ))}
      </select>
      <select value={clubFilter} onChange={(e) => setClubFilter(e.target.value)}>
        <option value="">Klubb</option>
        {uniqueClubs.map(id => (
          <option key={id} value={id}>Klubb #{id}</option>
        ))}
      </select>
      <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
        <option value="">Sorter etter</option>
        <option value="name">Navn (A-Å)</option>
        <option value="holes">Antall hull (flest først)</option>
        <option value="rating">Rating (høyest først)</option>
      </select>
      <button onClick={clearFilters}>Nullstill filtre</button>
      <button onClick={() => resetMapView()}>Zoom ut</button>
    </div>
    
  );
}

function CourseList({ courses, onSelectCourse }) {
  if (courses.length === 0) {
    return <p>Ingen baner funnet</p>;
  }

  return (
    <div className="course-list">
      {courses.map((course) => (
        <CourseCard key={course._id} course={course} onClick={() => onSelectCourse(course)} />
      ))}
    </div>
  );
}

function CourseCard({ course, onClick }) {
  const [expanded, setExpanded] = useState(false);
  const avgRating = course.reviews?.length
    ? (course.reviews.reduce((sum, r) => sum + r.rating, 0) / course.reviews.length).toFixed(1)
    : "Ingen";

  return (
    <div
      className={`course-card ${expanded ? 'expanded' : ''}`}
      onClick={() => setExpanded(!expanded)}
      style={{
        border: '1px solid #ccc',
        borderRadius: '10px',
        padding: '15px',
        margin: '10px',
        cursor: 'pointer',
        backgroundColor: '#fff',
        boxShadow: '2px 2px 10px rgba(0,0,0,0.1)'
      }}
    >
      <h3>{course.name}</h3>
      <p><strong>Vanskelighetsgrad:</strong> {course.difficulty}</p>
      <p><strong>Antall hull:</strong> {course.numberOfHoles}</p>
      <p><strong>Rating:</strong> {avgRating}</p>
      <p><strong>Klubb:</strong> #{course.clubId}</p>

      {expanded && (
        <div className="course-details">
          <p><strong>Beskrivelse:</strong> {course.description}</p>
          <p><strong>By:</strong> {course.city}</p>
          <p><strong>Koordinater:</strong>
            {Array.isArray(course.coordinates?.coordinates) && course.coordinates.coordinates.length === 2
              ? `${course.coordinates.coordinates[1]}, ${course.coordinates.coordinates[0]}`
              : "Ikke oppgitt"}
          </p>

          <button onClick={(e) => {
            e.stopPropagation(); // prevent toggle
            if (onClick) onClick();
          }}>
            Vis på kart
          </button>

          <h4>Anmeldelser:</h4>
          {course.reviews.length > 0 ? (
            course.reviews.map(review => (
              <div key={review.reviewId} style={{ padding: '5px 0' }}>
                <p>{review.reviewText} ({review.rating} stjerner)</p>
              </div>
            ))
          ) : (
            <p>Ingen anmeldelser</p>
          )}

          <h4>Vær:</h4>
          {course.weathers.length > 0 ? (
            <p>{course.weathers[0].conditions} - {Number(course.weathers[0].temperature)}°C</p>
          ) : (
            <p>Ingen værdata</p>
          )}
        </div>
      )}
    </div>
  );
}

function Map({ courses }) {
  useEffect(() => {
    initMap('map', 'type');
  }, [courses]);

  return (
    <div className="map-container">
      <select id="type">
        <option value="Point">Point</option>
        <option value="LineString">LineString</option>
        <option value="Polygon">Polygon</option>
      </select>
      <div className="map" id="map"></div>
    </div>
  );
}
