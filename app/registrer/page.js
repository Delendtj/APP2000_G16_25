"use client"
//DL + Chatgpt
//Brukte chat til å få riktig oppsett på usestates for form changes. Brukte en blanding av trad js med eventlisteners før.
import { useState } from "react";
import Head from "next/head";
import Header from "../../components/Header";
import "./registrer.css";

export default function Logginn() {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
    });

    //dette er chat sin kok
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const baseUrl =
            process.env.NODE_ENV === 'production'
              ? 'https://vast-mesa-22158-90c21fc001d1.herokuapp.com'  // Heroku APP URL
              : 'http://localhost:5000';  
  
            const response = await fetch(`${baseUrl}/api/users`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    passwordHash: formData.password,
                }),
            });

            const data = await response.json();
            alert(data.message || "Form submitted successfully!");

            // Reset form
            setFormData({
                firstName: "",
                lastName: "",
                email: "",
                password: "",
                });
        } catch (error) {
            console.error("Error submitting form:", error);
            alert("Failed to submit form.");
        }
    };

    return (
        <>
            <Head>
                <title>Om Discgolf</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </Head>

            <Header />

            <div className="wrapper">
                <div className="content-container">
                    <div className="form-section">
                        <h1>Registrering</h1>
                        <form onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="firstname-input"></label>
                                <input
                                    required
                                    type="text"
                                    name="firstName"
                                    id="firstname-input"
                                    placeholder="Fornavn"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label htmlFor="lastname-input"></label>
                                <input
                                    required
                                    type="text"
                                    name="lastName"
                                    id="lastname-input"
                                    placeholder="Etternavn"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label htmlFor="email-input"></label>
                                <input
                                    required
                                    type="email"
                                    name="email"
                                    id="email-input"
                                    placeholder="E-post"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label htmlFor="password-input"></label>
                                <input
                                    required
                                    type="password"
                                    name="password"
                                    id="password-input"
                                    placeholder="Passord"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                            </div>
                            <button type="submit">Registrer</button>
                        </form>
                        <p>Har allerede en Konto?</p>
                    </div>
                </div>
            </div>
        </>
    );
}
