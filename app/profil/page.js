'use client';  

import { useAuth } from "../../module/context";  
import { useState, useEffect } from "react";  
import { useRouter } from "next/navigation";  
import Header from "../../components/Header"; 
import Head from "next/head";
import "../styles/stil.css"; 

export default function Profile() {
    const { user, logout, login } = useAuth();  
    const router = useRouter();  

    // State to manage form inputs and messages
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");  
    const [staticFirstName, setHeaderFirstName] = useState("");
    const [staticLastName, setHeaderLastName] = useState("");

    // State for membership and club details
    const [membershipId, setMembershipId] = useState(null);
    const [clubName, setClubName] = useState(null);

    // Load user data from localStorage when component mounts
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser) {
            setHeaderFirstName(storedUser.firstName || "");
            setHeaderLastName(storedUser.lastName || "");
            setFirstName(storedUser.firstName || "");
            setLastName(storedUser.lastName || "");
            setEmail(storedUser.email || "");

            // Fetch membership and club details
            fetchMembershipDetails(storedUser.userId);
        }
    }, []);

    // Fetch membership details
    const fetchMembershipDetails = async (userId) => {
    try {
        const response = await fetch(`/api/usersclub`);
        if (!response.ok) {
            throw new Error("Failed to fetch membership details");
        }

        const usersWithClubs = await response.json();

        // Find the current user's membership details
        const currentUser = usersWithClubs.find((user) => user.userId === userId);

        if (currentUser) {
            setMembershipId(currentUser.membershipId || "N/A");
            setClubName(currentUser.clubId || "N/A");
        } else {
            console.log("User is not a member of any club.");
        }
    } catch (error) {
        console.error("Error fetching membership details:", error);
    }
};

    // Fetch club details
    const fetchClubDetails = async (clubId) => {
        try {
            const response = await fetch(`/api/klubbinfo/${clubId}`);
            if (!response.ok) {
                throw new Error("Failed to fetch club details");
            }

            const clubData = await response.json();
            setClubName(clubData.name);
        } catch (error) {
            console.error("Error fetching club details:", error);
        }
    };

    // Handle profile update
    const handleUpdate = async (e) => {
        e.preventDefault();
        setMessage("");
    
        if (!user?._id) {
            setMessage("User ID is missing. Please log in again.");
            return;
        }
    
        try {
            const response = await fetch("/api/update-profile", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    _id: user._id,
                    firstName,
                    lastName,
                    email,
                }),
            });
    
            const data = await response.json();
    
            if (response.ok) {
                setMessage("Profile updated successfully!");
        
                const updatedUser = { ...user, firstName, lastName, email };
                
                // Update localStorage
                localStorage.setItem("user", JSON.stringify(updatedUser));
                
                login(updatedUser);

                setHeaderFirstName(firstName);
                setHeaderLastName(lastName);
            } else {
                setMessage(data.error || "Update failed.");
            }
        } catch (error) {
            setMessage("An error occurred. Please try again.");
        }
    };
    
    // Handle account deletion
    const handleDelete = async () => {
        const storedUser = JSON.parse(localStorage.getItem("user")); 
    
        if (!storedUser) {
            console.error("User is not logged in");
            return;
        }
    
        if (!confirm("Are you sure you want to delete your account?")) {
            return;
        }
    
        try {
            const response = await fetch(`/api/delete-user/${storedUser._id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": JSON.stringify(storedUser),
                },
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.removeItem("user");  // Clear localStorage after deletion
                alert("Account deleted successfully.");
                window.location.href = "/logginn";  // Redirect to login
            } else {
                alert(data.error || "Failed to delete account.");
            }
        } catch (error) {
            console.error("Error deleting account:", error);
        }
    };

    return (
        <>
        <Head>
            <title>Om Discgolf</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </Head>

        <Header/>
        <div>
            <h1>Welcome, {staticFirstName} {staticLastName}</h1>
            <p>Email: {email}</p>

            {/* Display membership and club details */}
            {membershipId && (
                <p>
                    <strong>Membership ID:</strong> {membershipId}
                </p>
            )}
            {clubName && (
                <p>
                    <strong>Club:</strong> {clubName}
                </p>
            )}

            <form onSubmit={handleUpdate}>
                <label>
                    First Name:
                    <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                </label>
                <br />
                <label>
                    Last Name:
                    <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                </label>
                <br />
                <label>
                    Email:
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </label>
                <br />
                <button type="submit">Update Profile</button>
                <br />
                <button type="button" onClick={handleDelete} style={{ color: "red" }}>Delete Profile</button>
                <br />
            </form>

            {message && <p>{message}</p>}  {/* Display messages */}

            <button onClick={logout}>Log out</button>
        </div>
        </>
    );
}
