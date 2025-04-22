'use client';
import React, { useState } from 'react';


export default function CourseCard({ course, onClick }) {
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
          <p><strong>Koordinater: </strong>
            {Array.isArray(course.coordinates?.coordinates) && course.coordinates.coordinates.length === 2
              ? `${course.coordinates.coordinates[1]}, ${course.coordinates.coordinates[0]}`
              : "Ikke oppgitt"}
          </p>

          <button onClick={(e) => {
  e.stopPropagation();
  onClick(); 
}}>
  Vis bane på kart
</button>

          <h4>Anmeldelser:</h4>
          {course.reviews?.length > 0 ? (
            course.reviews.map(review => (
              <div key={review.reviewId} style={{ padding: '5px 0' }}>
                <p>{review.reviewText} ({review.rating} stjerner)</p>
              </div>
            ))
          ) : (
            <p>Ingen anmeldelser</p>
          )}

          <h4>Vær:</h4>
          {course.weathers?.length > 0 ? (
            <p>{course.weathers[0].conditions} – {Number(course.weathers[0].temperature)}°C</p>
          ) : (
            <p>Ingen værdata</p>
          )}
        </div>
      )}
    </div>
  );
}
