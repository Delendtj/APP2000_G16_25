"use client";

//DL
import "./klubber.css";
import Header from "../../components/Header";
import { useEffect, useState } from "react";

export default function Klubber() {
  const [clubs, setClubs] = useState([]);
  const [userId, setUserId] = useState(null);
  const [message, setMessage] = useState("");

  const baseUrl =
    process.env.NODE_ENV === "production"
      ? "https://vast-mesa-22158-90c21fc001d1.herokuapp.com"
      : "http://localhost:5000";

  useEffect(() => {
    // Retrieve user object from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser); // Parse the JSON string
      setUserId(parsedUser.userId); // Set userId from user object
      console.log("User ID retrieved:", parsedUser.userId);
    } else {
      console.error("No user object found in localStorage.");
    }
  }, []);

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/klubbinfo`);
        if (!response.ok) {
          throw new Error("Failed to fetch clubs");
        }
        const data = await response.json();
        console.log("Fetched clubs:", data);
        setClubs(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchClubs();
  }, []);

  const handleButtonClick = async (clubId) => {
    if (!userId) {
      const msg = "You must be logged in to sign up for a club.";
      setMessage(msg);
      console.error(msg);
      return;
    }

    try {
      console.log(`Making request to: ${baseUrl}/api/newmember`);
      const response = await fetch(`${baseUrl}/api/newmember`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, clubId }),
      });

      if (!response.ok) {
        const errorMsg = await response.text();
        throw new Error(errorMsg || "Failed to sign up for the club");
      }

      const result = await response.json();
      setMessage(
        `Successfully signed up for ${result.clubName || "the club"}!`
      );
      console.log("sign up successful", result);
    } catch (err) {
      const errorMsg = err.message || "something went wrong during sign - up.";
      setMessage(errorMsg);
      console.error("Error signing up:", errorMsg);
    }
  };

  return (
    <>
      <Header />

      <div className="klubber">
        <h1>Clubs and their Contact Persons</h1>
        {message && (
          <div
            style={{
              backgroundColor: "#f8d7da",
              color: "#721c24",
              padding: "0.75rem",
              margin: "1rem 0",
              border: "1px solid #f5c6cb",
              borderRadius: "4px",
            }}
          >
            {message}
          </div>
        )}
        {clubs.map((club) => (
          <div
            key={club._id}
            style={{
              border: "1px solid #ccc",
              padding: "1rem",
              marginBottom: "1rem",
            }}
          >
            <h2>{club.name}</h2>
            <p>{club.description}</p>
            <h3>Contact Person:</h3>
            {club.contactPerson ? (
              <p>
                <strong>{club.contactPerson}</strong> - {club.contactEmail}
              </p>
            ) : (
              <p>No contact person available.</p>
            )}
            <button
              onClick={() => handleButtonClick(club.clubId)}
              style={{
                marginTop: "1rem",
                padding: "0.5rem 1rem",
                backgroundColor: "#007BFF",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Sign Up
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
