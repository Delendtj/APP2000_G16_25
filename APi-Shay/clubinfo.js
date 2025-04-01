const express = require('express');
const fetch = require('node-fetch');

const router = express.Router();

router.get('/klubbinfo', async (req, res) => {
    try {
        const baseUrl = process.env.NODE_ENV === 'production'
            ? 'https://vast-mesa-22158-90c21fc001d1.herokuapp.com'
            : 'http://localhost:5000';

        const [clubsResponse, membershipsResponse, usersResponse] = await Promise.all([
            fetch(`${baseUrl}/api/klubber`),
            fetch(`${baseUrl}/api/memberships`),
            fetch(`${baseUrl}/api/users`)
        ]);

        if (!clubsResponse.ok || !membershipsResponse.ok || !usersResponse.ok) {
            throw new Error('Failed to fetch data from one or more APIs');
        }

        const clubs = await clubsResponse.json();
        const memberships = await membershipsResponse.json();
        const users = await usersResponse.json();
        const clubsWithUsers = clubs.map((club) => {
            const clubMemberships = memberships.filter(
                (membership) => membership.clubId === club.clubId
            );


            const registeredUsers = clubMemberships.map((membership) =>
                users.find((user) => user.userId === membership.userId)
            );

            return {
                ...club, 
                registeredUsers: registeredUsers.filter(Boolean) 
            };
        });

        res.json(clubsWithUsers);
    } catch (error) {
        console.error('Error fetching clubs with users:', error);
        res.status(500).json({ error: 'Failed to fetch clubs with users' });
    }
});

module.exports = router;