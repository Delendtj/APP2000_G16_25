'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../module/context';

export default function UserClubPage() {
  const { user } = useAuth(); // Get the logged-in user
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user === undefined) {
      return; 
    }

    if (!user) {
      router.push('/logginn');
      return;
    }

    
  }, [user, router]);

  useEffect(() => {
    const checkMembership = async () => {
      if (!user) {
        router.push('/logginn'); 
        return;
      }

      try {
        const baseUrl =
          process.env.NODE_ENV === 'production'
            ? 'https://vast-mesa-22158-90c21fc001d1.herokuapp.com'
            : 'http://localhost:5000';

        const response = await fetch(`${baseUrl}/api/usersclub`);
        if (!response.ok) {
          throw new Error('Failed to fetch user-club mapping');
        }

        const usersWithClubs = await response.json();

        const currentUser = usersWithClubs.find(
          (u) => u.userId === user.userId
        );

        if (currentUser && currentUser.clubId) {
          setIsAuthorized(true);
        } else {
          
        }
      } catch (error) {
        console.error('Error checking user-club mapping:', error);
      } finally {
        setLoading(false);
      }
    };

    checkMembership();
  }, [user, router]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!isAuthorized) {
    return null; 
  }

  return (
    <div>
      <h1>Welcome to Your Club Page</h1>
      <p>This page is accessible only to members of your club.</p>
    </div>
  );
}