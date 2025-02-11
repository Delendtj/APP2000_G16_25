'use client';
import { useAuth } from "../../module/context";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Profile() {
    const { user, logout, setUser } = useAuth();  // Use setUser to update the context
    const router = useRouter();
    const [name, setName] = useState(user?.name || "");
    const [email, setEmail] = useState(user?.email || "");
    const [message, setMessage] = useState("");

    
console.log("User in Profile:", user); // Log to verify user object


    const handleUpdate = async (e) => {
        e.preventDefault();
        setMessage(""); // Reset message before updating
        console.log({ _id, name, email });
        try {
            const response = await fetch("/api/update-profile", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ 
                    _id,  // Send the user ID
                    name, 
                    email 
                }),
            });
    
            const data = await response.json();
    
            if (response.ok) {
                setMessage("Profile updated successfully!");
                
                // After a successful update, update the global user context and localStorage
                setUser({
                    ...user, // Retain other user data
                    name,
                    email
                });

                // Optionally store updated user data back into localStorage
                localStorage.setItem("user", JSON.stringify({ 
                    ...user, 
                    name,
                    email
                }));
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

             ///   får ikke sent tilbake _id til databasen, implemente en JWT eller annen type authentication løsning -DL

            <form onSubmit={handleUpdate}>
                <label>
                    Name:
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
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
