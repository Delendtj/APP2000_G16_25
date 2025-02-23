'use client';
import { useAuth } from "../../module/context";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Profile() {
    const { user, logout, setUser } = useAuth();  
    const router = useRouter();

    // Initialize state from localStorage
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [staticFirstName, setHeaderFirstName] = useState(""); 
    const [staticLastName, setHeaderLastName] = useState("");

    // Load user data from localStorage on component mount
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser) {
            setHeaderFirstName(storedUser.firstName || ""); 
            setHeaderLastName(storedUser.lastName || "");
            setFirstName(storedUser.firstName || "");
            setLastName(storedUser.lastName || "");
            setEmail(storedUser.email || "");
        }
    }, []);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setMessage("");

        if (!user?._id) {
            setMessage("User ID is missing. Please log in again.");
            return;
        }

        console.log("Sending update request with:", { _id: user._id, firstName, lastName, email });

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
                    email
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage("Profile updated successfully!");

                // Update the user context and localStorage
                const updatedUser = { ...user, firstName, lastName, email };
                setUser(updatedUser);
                localStorage.setItem("user", JSON.stringify(updatedUser));
            } else {
                setMessage(data.error || "Update failed.");
            }
        } catch (error) {
            setMessage("An error occurred. Please try again.");
        }
    };

    return (
        <div>
            <h1>Welcome, {staticFirstName} {staticLastName}</h1>
            <p>Email: {email}</p>

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
            </form>

            {message && <p>{message}</p>}

            <button onClick={logout}>Log out</button>
        </div>
    );
}
