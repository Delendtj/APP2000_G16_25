'use client';

import { useState, useEffect } from 'react';
import { useAuth } from "../../../module/context";
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import "./courseManager.css";

export default function CourseManager() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [holes, setHoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [holesLoading, setHolesLoading] = useState(false);
  const [error, setError] = useState(null);
  const [holesError, setHolesError] = useState(null);

  const searchParams = useSearchParams();
  const clubId = searchParams.get('clubId');

  const baseUrl = process.env.NODE_ENV === 'production'
    ? 'https://vast-mesa-22158-90c21fc001d1.herokuapp.com'
    : 'http://localhost:5000';

  // Fetch courses for the club
  useEffect(() => {
    async function fetchClubCourses() {
     try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`${baseUrl}/api/courses/${clubId}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch courses: ${response.status}`);
        }
        
        const data = await response.json();
        setCourses(data);
        
        if (data.length > 0) {
          setSelectedCourse(data[0]);
        }
        
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError(`Failed to load courses: ${err.message}`);
      } finally {
        setLoading(false);
      }
    }
    
    fetchClubCourses();
  }, [clubId]);

  // Fetch holes for the selected course using the holeRoute endpoint
  useEffect(() => {
    async function fetchCourseHoles() {
      if (!selectedCourse) return;
      
      try {
        setHolesLoading(true);
        setHolesError(null);
        
        // Use the route from your holeRoute.js file
        const response = await fetch(`${baseUrl}/api/holes/courses/${selectedCourse.courseId}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch holes: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Sort holes by hole number
        const sortedHoles = data.sort((a, b) => a.holeNumber - b.holeNumber);
        setHoles(sortedHoles);
        
      } catch (err) {
        console.error("Error fetching holes:", err);
        setHolesError(`Failed to load holes: ${err.message}`);
      } finally {
        setHolesLoading(false);
      }
    }
    
    fetchCourseHoles();
  }, [selectedCourse]);

  return (
    <div className="course-manager-container">
      <h1>Course Manager</h1>

      {error && <p className="error-message">{error}</p>}

      <div className="course-manager-layout">
        <div className="courses-panel">
          <h3>Courses</h3>
          {loading ? (
            <p className="loading">Loading courses...</p>
          ) : courses.length > 0 ? (
            <ul className="coursesList">
              {courses.map(course => (
                <li 
                  key={course._id || course.courseId} 
                  className={selectedCourse && (selectedCourse._id === course._id || selectedCourse.courseId === course.courseId) ? 'selected' : ''}
                  onClick={() => setSelectedCourse(course)}
                >
                  <div className="course-name">{course.name}</div>
                  <div className="course-meta">
                    <span>{course.holeCount || course.numberOfHoles || '?'} holes</span>
                    <span className="difficulty">{course.difficulty || 'N/A'}</span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="empty-message">No courses found for this club.</p>
          )}
        </div>

        <div className="details-panel">
          {selectedCourse ? (
            <>
              <div className="course-details">
                <h3>{selectedCourse.name}</h3>
                <div className="detail-row">
                  <strong>Location:</strong> {selectedCourse.location || 'Not specified'}
                  {selectedCourse.city && `, ${selectedCourse.city}`}
                </div>
                <div className="detail-row">
                  <strong>Difficulty:</strong> {selectedCourse.difficulty || 'Not specified'}
                </div>
                <div className="detail-row">
                  <strong>Holes:</strong> {selectedCourse.holeCount || selectedCourse.numberOfHoles || 'Not specified'}
                </div>
                {selectedCourse.description && (
                  <div className="course-description">
                    <strong>Description:</strong> 
                    <p>{selectedCourse.description}</p>
                  </div>
                )}
              </div>

              <div className="holes-section">
                <h3>Holes</h3>
                {holesError && <p className="error-message">{holesError}</p>}
                
                {holesLoading ? (
                  <p className="loading">Loading holes...</p>
                ) : holes.length > 0 ? (
                  <div className="holes-grid">
                    {holes.map(hole => (
                      <div key={hole._id} className="hole-card">
                        <div className="hole-number">#{hole.holeNumber}</div>
                        <div className="hole-details">
                          <div className="hole-par">Par {hole.par}</div>
                          <div className="hole-distance">{hole.distance}m</div>
                          {hole.description && (
                            <div className="hole-description">{hole.description}</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="empty-message">No holes defined for this course.</p>
                )}
              </div>
            </>
          ) : (
            <div className="no-selection">
              <p>Select a course from the list to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}