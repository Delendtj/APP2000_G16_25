"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext();
//DL og ChatGPT
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);  
    const [adminClubId, setAdminClubId] = useState(null);
    const router = useRouter();

    // Load user from localStorage when app starts
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                if (parsedUser && parsedUser.firstName && parsedUser.lastName && parsedUser.email) {
                    setUser(parsedUser);
                    
                    // If user is admin, fetch their club ID
                    if (parsedUser.isAdmin) {
                        fetchAdminClubId(parsedUser);
                    }
                } else {
                    throw new Error("Invalid user data");
                }
            } catch (error) {
                console.error("Invalid user data in localStorage", error);
                localStorage.removeItem("user");
            }
        }
        setLoading(false); 
    }, []);
    
    // hneter adminClubId og putter i localstorage for admin panel
    //DL og ChatGPT
    //bedre enn løsningen fra før lol
    const fetchAdminClubId = async (userData) => {
        try {
            const baseUrl = process.env.NODE_ENV === "production"
                ? "https://vast-mesa-22158-90c21fc001d1.herokuapp.com"
                : "http://localhost:5000";
            
            const response = await fetch(`${baseUrl}/api/usersclub`);
            if (!response.ok) throw new Error('Failed to fetch users club data');
            
            const mergedUsers = await response.json();
            const currentUserWithClub = mergedUsers.find(u => 
                u.userId === userData.userId || 
                u._id === userData._id ||
                u.email === userData.email
            );
            
            if (currentUserWithClub && currentUserWithClub.clubId) {
                setAdminClubId(currentUserWithClub.clubId);
                
                
                const updatedUser = { ...userData, adminClubId: currentUserWithClub.clubId };
                localStorage.setItem("user", JSON.stringify(updatedUser));
                setUser(updatedUser);
            }
        } catch (error) {
            console.error('Error fetching admin club ID:', error);
        }
    };

    const login = (userData) => {
        console.log("User data received during login:", userData);
    
        if (userData && userData.firstName && userData.lastName && userData.email) {
            setUser(userData);
            localStorage.setItem("user", JSON.stringify(userData));
            
            // If user is an admin, fetch their club ID
            if (userData.isAdmin === true) {
                fetchAdminClubId(userData);
            }
            
            // Redirect
            router.push("/");
        } else {
            console.error("Invalid user data received during login");
        }
    };

    const logout = () => {
        setUser(null);
        setAdminClubId(null);
        localStorage.removeItem("user");
        router.push("/logginn");
    };

    // isAdmin
    const isAdmin = () => {
        return user && (user.isAdmin === true);
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, isAdmin, adminClubId }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}