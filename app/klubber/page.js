"use client";

//DL
import "../styles/stil.css";
import Header from "../../components/Header";
import { useEffect, useState } from "react";

export default function Klubber() {
  const [clubs, setClubs] = useState([]);
  const baseUrl =
    process.env.NODE_ENV === "production"
      ? "https://vast-mesa-22158-90c21fc001d1.herokuapp.com"
      : "http://localhost:5000";

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/klubbinfo`);
        if (!response.ok) {
          throw new Error("Failed to fetch clubs");
        }
        const data = await response.json();
        setClubs(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchClubs();
  }, []);

  return (
    <>
      <Header />

      <div className="klubber">
        <h1>Clubs and their Members</h1>
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
            <h3>Registered Members:</h3>
            {club.registeredUsers.length > 0 ? (
              <ul>
                {club.registeredUsers.map((user) => (
                  <li key={user._id}>
                    {user.firstName} {user.lastName}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No members yet.</p>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
