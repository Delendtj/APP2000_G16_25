"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const router = useRouter();

    // Load user from localStorage when app starts
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                if (parsedUser && parsedUser.firstName && parsedUser.lastName && parsedUser.email) { // Ensure user data is valid
                    setUser(parsedUser); // Set user if valid
                } else {
                    throw new Error("Invalid user data");
                }
            } catch (error) {
                console.error("Invalid user data in localStorage", error);
                localStorage.removeItem("user"); // Clear corrupted data
            }
        }
    }, []);

    const login = (userData) => {
        if (userData && userData.firstName && userData.lastName && userData.email) { // Ensure valid user data before saving
            setUser(userData);
            localStorage.setItem("user", JSON.stringify(userData)); // Save valid user data
            router.push("/profil"); // Redirect after login
        } else {
            console.error("Invalid user data received during login");
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
        router.push("/logginn"); // Redirect to login page
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
