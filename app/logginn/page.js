'use client'

import "./logginn.css";
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
