'use client';
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Header from '../../components/Header';
import '../globals.css';
import { initMap } from '../../module/map';

export default function BanesokPage() {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchCourses() {
      try {
        console.log("🔍 Fetching courses from frontend...");
const baseUrl = process.env.NODE_ENV === 'production'
          ? 'https://vast-mesa-22158-90c21fc001d1.herokuapp.com'
          : 'http://localhost:5000';
        const response = await fetch(`${baseUrl}/models/courses`);
        
        if (!response.ok) {
          throw new Error(`Network error, Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Courses received in frontend:", data);
        setCourses(data);
      } catch (error) {
        console.error("Error fetching courses in frontend:", error.message);
      }
    }

    fetchCourses();
  }, []);

  // Filter courses based on search text
  const filteredCourses = courses.filter(course =>
    course.name.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    initMap('map', 'type');
  }, [filteredCourses]);

  return (
    <>
      <Head>
        <title>Baner i nærheten</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <Header />

      <div className="container">
        <h1>Baner i nærheten</h1>
        <SearchBar search={search} setSearch={setSearch} />
        <div className="main-content">
          <CourseList courses={filteredCourses} />
          <Map courses={filteredCourses} />
        </div>
      </div>
    </>
  );
}

function SearchBar({ search, setSearch }) {
  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Søk etter baner..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  );
}

function CourseList({ courses }) {
  if (courses.length === 0) {
    return <p>Ingen baner funnet</p>;
  }

  return (
    <div className="course-list">
      {courses.map((course) => (
        <CourseCard key={course._id} course={course} />
      ))}
    </div>
  );
}

function CourseCard({ course }) {
  const [expanded, setExpanded] = useState(false);

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
      <p><strong>Antall hull:</strong> {course.holes?.length || 0}</p>

      {expanded && (
        <div className="course-details">
          <p><strong>Beskrivelse:</strong> {course.description}</p>
          <p><strong>By:</strong> {course.city}, {course.country}</p>

          <h4>Anmeldelser:</h4>
          {course.reviews.length > 0 ? (
            course.reviews.map(review => (
              <div key={review.reviewId} style={{ padding: '5px 0' }}>
                <p>{review.reviewText} ({review.rating} stars)</p>
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
