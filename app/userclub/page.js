'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../module/context';

export default function UserClubPage() {
  const { user } = useAuth(); // Get the logged-in user
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pdfs, setPdfs] = useState([]); // State to store PDFs

  useEffect(() => {
    const checkMembership = async () => {
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
          fetchPdfs(currentUser.clubId); // Fetch PDFs for the user's club
        } else {
          setIsAuthorized(false);
        }
      } catch (error) {
        console.error('Error checking user-club mapping:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchPdfs = async (clubId) => {
      try {
        const baseUrl =
          process.env.NODE_ENV === 'production'
            ? 'https://vast-mesa-22158-90c21fc001d1.herokuapp.com'
            : 'http://localhost:5000';

        const response = await fetch(`${baseUrl}/api/pdfs/${clubId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch PDFs');
        }

        const pdfData = await response.json();
        setPdfs(pdfData);
      } catch (error) {
        console.error('Error fetching PDFs:', error);
      }
    };

    checkMembership();
  }, [user, router]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!isAuthorized) {
    return <p>You are not authorized to view this page.</p>;
  }

  return (
    <div>
      <h1>Welcome to Your Club Page</h1>
      <p>This page is accessible only to members of your club.</p>

      <h2>Club Documents</h2>
      {pdfs.length > 0 ? (
        <ul>
          {pdfs.map((pdf) => (
            <li key={pdf._id}>
              <a href={pdf.url} target="_blank" rel="noopener noreferrer">
                {pdf.name}
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p>No documents available for your club.</p>
      )}
    </div>
  );
}