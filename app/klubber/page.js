"use client";

//DL
import "./klubber.css";
import Header from "../../components/Header";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";


export default function Klubber() {
  const [clubs, setClubs] = useState([]);
  const [userId, setUserId] = useState(null);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const baseUrl =
    process.env.NODE_ENV === "production"
      ? "https://vast-mesa-22158-90c21fc001d1.herokuapp.com"
      : "http://localhost:5000";

  
  useEffect(() => {
    // Retrieve user object from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      // Parse the JSON string
      const parsedUser = JSON.parse(storedUser);
      // Set userId from user object    
      setUserId(parsedUser.userId); 
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
        console.log({data});
        setClubs(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchClubs();
  }, []);
  
  const isUserRegistered = (club) => {
    return club.registeredUsers.some((user) => user.userId === userId);
  };

  const redirectToPayment = (clubId) => {
    if (!userId) {
      setMessage("You must be logged in to sign up for a club.");
      return
    }
    // Redirect to the payment page
    router.push(`/betaling?clubId=${clubId}`);
  }

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
              onClick={() => redirectToPayment(club.clubId)}
              disabled={isUserRegistered(club)}
              style={{
                marginTop: "1rem",
                padding: "0.5rem 1rem",
                backgroundColor: isUserRegistered(club) ? "#ccc" : "#007BFF",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
              }}
            >
              {isUserRegistered(club) ? "Already a member" : "Sign Up"}
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
