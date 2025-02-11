'use client'

import '../styles/stil.css'
import Head from 'next/head';
import Header from '../../components/Header'; 
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from "../../module/context"

export default function Logginn() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const router = useRouter();
    const { login } = useAuth();

const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!email || !password) {
        setError("Email and password are required.");
        return;
    }

    try {
        const response = await fetch("/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        console.log("Parsed response data:", data); // Debugging 

        
        if (response.ok && data._id) {
            login(data);  // 
            router.push("/profil");  // force Redirect til profile page
        } else {
            setError(data.error || "Login failed.");
        }
    } catch (error) {
        setError("An error occurred. Please try again later.");
    }
};



    return (
        <>
            <Head>
                <title>Om Discgolf</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </Head>

            <Header/>

            <div className="wrapper">
                <div className="content-container">
                    <div className="form-section">
                        <h1>Logg inn</h1>
                        <form id="form" onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="email-input">
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
                                        <path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm320-280L160-640v400h640v-400L480-440Zm0-80 320-200H160l320 200ZM160-640v-80 480-400Z"/>
                                    </svg>
                                </label>
                                <input type="email" 
                                    value={email}
                                    onChange={(e)=> setEmail(e.target.value)}
                                    name="email" 
                                    id="email-input" 
                                    placeholder="E-post" 
                                    required />
                            </div>
                            <div>
                                <label htmlFor="password-input">
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
                                        <path d="M240-80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h40v-80q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240Zm240-200q33 0 56.5-23.5T560-360q0-33-23.5-56.5T480-440q-33 0-56.5 23.5T400-360q0 33 23.5 56.5T480-280ZM360-640h240v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80Z"/>
                                    </svg>
                                </label>
                                <input type="password"
                                    value={password}
                                    onChange={(e)=> setPassword(e.target.value)}
                                    required 
                                    name="password" 
                                    id="password-input" 
                                    placeholder="Passord" />
                            </div>

                            <button type="submit">Logg inn</button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
