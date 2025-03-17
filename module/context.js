"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
//DL
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
                if (parsedUser && parsedUser.firstName && parsedUser.lastName && parsedUser.email) {
                    setUser(parsedUser);
                } else {
                    throw new Error("Invalid user data");
                }
            } catch (error) {
                console.error("Invalid user data in localStorage", error);
                localStorage.removeItem("user");
            }
        }
    }, []);

    const login = (userData) => {
        if (userData && userData.firstName && userData.lastName && userData.email) {
            setUser(userData);
            localStorage.setItem("user", JSON.stringify(userData));
            
            // Redirect based on user role
            if (userData.membershipStatus === "admin" || userData.isAdmin) {
                router.push("/admin");
            } else {
                router.push("/profil");
            }
        } else {
            console.error("Invalid user data received during login");
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
        router.push("/logginn");
    };

    // Function to check if user is admin
    const isAdmin = () => {
        return user && (user.membershipStatus === "admin" || user.isAdmin === true);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isAdmin }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}