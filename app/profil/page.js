'use client';
import { useAuth } from "../../module/context";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Profile() {
    const { user, logout, setUser } = useAuth(); 
    const router = useRouter();
    
    // Initialize state with user data
    const [firstName, setFirstName] = useState(user?.firstName || "");
    const [lastName, setLastName] = useState(user?.lastName || "");
    const [email, setEmail] = useState(user?.email || "");
    const [message, setMessage] = useState("");

    console.log("User in Profile:", user); // log

    const handleUpdate = async (e) => {
        e.preventDefault();
        setMessage(""); 

        if (!user?._id) {
            setMessage("User ID is missing. Please log in again.");
            return;
        }

        console.log({ _id: user._id, firstName, lastName, email }); // Debugging log

        try {
            const response = await fetch("/api/update-profile", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ 
                    _id: user._id,  // Retrieve _id from user object
                    firstName,  
                    lastName,  
                    email
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage("Profile updated successfully!");

                // Update the global user context and localStorage
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
            <h1>Welcome, {user?.name}</h1>
            <p>Email: {user?.email}</p>

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
