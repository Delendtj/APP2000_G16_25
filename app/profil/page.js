'use client';  

import { useAuth } from "../../module/context";  
import { useState, useEffect } from "react";  
import { useRouter } from "next/navigation";  
import Header from "../../components/Header"; 
import Head from "next/head";
import "./profil.css"; 

//DL
export default function Profile() {
    const { user, logout, login } = useAuth();  
    const router = useRouter();  

    // State to manage inputs
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");  
    const [staticFirstName, setHeaderFirstName] = useState("");
    const [staticLastName, setHeaderLastName] = useState("");

    //membership and club state
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

    //membership details
    const fetchMembershipDetails = async (userId) => {
        try {
            const response = await fetch(`/api/usersclub`);
            if (!response.ok) {
                throw new Error("Failed to fetch membership details");
            }

            const usersWithClubs = await response.json();

            // Finn UId
            const currentUser = usersWithClubs.find((user) => user.userId === userId);

            if (currentUser) {
                setMembershipId(currentUser.membershipId || "N/A");

                // Fetch club name 
                if (currentUser.clubId) {
                    const clubResponse = await fetch(`/api/klubber/${currentUser.clubId}`);
                    if (!clubResponse.ok) {
                        throw new Error("Failed to fetch club details");
                    }

                    const clubData = await clubResponse.json();
                    setClubName(clubData.name || "Unknown Club");
                } else {
                    setClubName("N/A");
                }
            } else {
                console.log("User is not a member of any club.");
            }
        } catch (error) {
            console.error("Error fetching membership details:", error);
        }
    };

    //profile update
    const handleUpdate = async (e) => {
        e.preventDefault();
        setMessage("");
    
        if (!user?._id) {
            setMessage("User ID is missing. Please log in again.");
            return;
        }
    
        try {//put oppdaterer data
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
                
                // Update 
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
    
    //account deletion
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
                localStorage.removeItem("user");  // Clear localStorage
                alert("Account deleted successfully.");
                window.location.href = "/logginn";  // Redirect 
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

            
            
                <p>
                    <strong>Membership ID:</strong> {membershipId}
                </p>
            
          
                <p>
                    <strong>Club:</strong> {clubName}
                </p>
            

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
                <button type="button" onClick={handleDelete}>Delete Profile</button>
                <br />
            </form>

            {message && <p>{message}</p>}  {/* Display messages */}
        </div>
        </>
    );
}
