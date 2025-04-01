'use client';
import { useState } from 'react';

export default function UserPage() {
    const [userId, setUserId] = useState(''); 
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState(null);

    const fetchUserData = async () => {
        if (!userId) {
            setError('Please enter a user ID.');
            return;
        }

        try {
            setError(null); 
            setUserData(null); 
            const response = await fetch(`/api/users/${userId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch user data');
            }
            const data = await response.json();
            setUserData(data);
        } catch (err) {
            console.error('Error fetching user data:', err);
            setError(err.message);
        }
    };

    return (
        <div>
            <h1>Fetch User Details</h1>
            <div>
                <input
                    type="text"
                    placeholder="Enter User ID"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    style={{ padding: '8px', marginRight: '8px' }}
                />
                <button onClick={fetchUserData} style={{ padding: '8px' }}>
                    Fetch User
                </button>
            </div>

            {error && <p style={{ color: 'red' }}>Error: {error}</p>}

            {userData && (
                <div style={{ marginTop: '20px' }}>
                    <h2>User Details</h2>
                    <p><strong>Name:</strong> {userData.firstName} {userData.lastName}</p>
                    <p><strong>Email:</strong> {userData.email}</p>
                    <p><strong>Membership Status:</strong> {userData.membershipStatus}</p>
                </div>
            )}
        </div>
    );
}