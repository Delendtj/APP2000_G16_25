'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../module/context';
import Header from '../../components/Header';
import Head from 'next/head';
import ReactMarkdown from 'react-markdown';


export default function UserClubPage() {
  const { user } = useAuth(); // Get the logged-in user
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pdfs, setPdfs] = useState([]); // State to store PDFs
  const [tournaments, setTournaments] = useState([]); // State to store tournaments
  const [clubName, setClubName] = useState('');
  const [pageTitle, setPageTitle] = useState('Velkommen til klubbsiden');
  const [pageContent, setPageContent] = useState('Dette er klubbsiden hvor medlemmer kan finne relevant informasjon.');
  const [userClubId, setUserClubId] = useState(null);

  useEffect(() => {
    if (!user) {
      router.push('/logginn');
      return;
    }

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
          setUserClubId(currentUser.clubId);
          setIsAuthorized(true);
          fetchClubData(currentUser.clubId);
          fetchPdfs(currentUser.clubId);
          fetchTournaments(currentUser.clubId);
        } else {
          setIsAuthorized(false);
        }
      } catch (error) {
        console.error('Error checking user-club mapping:', error);
      } finally {
        setLoading(false);
      }
    };

    checkMembership();
  }, [user, router]);

  const fetchClubData = async (clubId) => {
    try {
      const baseUrl =
        process.env.NODE_ENV === 'production'
          ? 'https://vast-mesa-22158-90c21fc001d1.herokuapp.com'
          : 'http://localhost:5000';

      // Fetch club name
      const clubResponse = await fetch(`${baseUrl}/api/klubber/${clubId}`);
      if (clubResponse.ok) {
        const clubData = await clubResponse.json();
        setClubName(clubData.name || 'Din klubb');
      }

      // Fetch custom page content
      const pageResponse = await fetch(`${baseUrl}/api/clubs/${clubId}/page`);
      if (pageResponse.ok) {
        const pageData = await pageResponse.json();
        if (pageData) {
          setPageTitle(pageData.title || 'Velkommen til klubbsiden');
          setPageContent(pageData.content || 'Dette er klubbsiden hvor medlemmer kan finne relevant informasjon.');
        }
      }
    } catch (error) {
      console.error('Error fetching club data:', error);
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
      
      // Konverter relative URL-er til absolutte URL-er
      const pdfsWithAbsoluteUrls = pdfData.map(pdf => ({
        ...pdf,
        // Bruk filnavnet fra den opprinnelige URL-en
        url: `${baseUrl}/downloadpdf/${pdf.url.split('/').pop()}`
      }));
      
      setPdfs(pdfsWithAbsoluteUrls);
    } catch (error) {
      console.error('Error fetching PDFs:', error);
    }
  };

  const fetchTournaments = async (clubId) => {
    try {
      const baseUrl =
        process.env.NODE_ENV === 'production'
          ? 'https://vast-mesa-22158-90c21fc001d1.herokuapp.com'
          : 'http://localhost:5000';

      const response = await fetch(`${baseUrl}/api/tournaments/${clubId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch tournaments');
      }

      const tournamentData = await response.json();
      setTournaments(tournamentData);
    } catch (error) {
      console.error('Error fetching tournaments:', error);
    }
  };

  if (loading) {
    return <div style={styles.loadingContainer}>Laster inn...</div>;
  }

  if (!isAuthorized) {
    return (
      <>
        <Header />
        <div style={styles.unauthorizedContainer}>
          <h1>Ingen tilgang</h1>
          <p>Du er ikke medlem av noen klubb. Vennligst bli medlem for å få tilgang til denne siden.</p>
          <button 
            onClick={() => router.push('/klubber')}
            style={styles.joinButton}
          >
            Se tilgjengelige klubber
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{clubName} - {pageTitle}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <Header/>
      <div style={styles.container}>
        {/* Custom content from admin's edits */}
        <div style={styles.customContentContainer}>
          <h1 style={styles.pageTitle}>{pageTitle}</h1>
          <div style={styles.pageContent}>
            <ReactMarkdown>{pageContent}</ReactMarkdown>
          </div>
        </div>

        {/* Documents section */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Klubbdokumenter</h2>
          {pdfs.length > 0 ? (
            <ul style={styles.documentList}>
              {pdfs.map((pdf) => (
                <li key={pdf._id} style={styles.documentItem}>
                  <a 
                    href={pdf.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={styles.documentLink}
                    download={pdf.name}
                  >
                    <span style={styles.documentName}>{pdf.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p style={styles.emptyMessage}>Ingen dokumenter tilgjengelig for klubben din.</p>
          )}
        </div>

        {/* Tournaments section */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Klubbturneringer</h2>
          {tournaments.length > 0 ? (
            <ul style={styles.tournamentList}>
              {tournaments.map((tournament) => (
                <li key={tournament._id} style={styles.tournamentItem}>
                  <span style={styles.tournamentName}>{tournament.name}</span> - fra {new Date(tournament.startDate).toLocaleDateString()} til {new Date(tournament.endDate).toLocaleDateString()}
                </li>
              ))}
            </ul>
          ) : (
            <p style={styles.emptyMessage}>Ingen turneringer tilgjengelig for klubben din.</p>
          )}
        </div>
      </div>
    </>
  );
}

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
  },
  loadingContainer: {
    textAlign: 'center',
    padding: '50px',
    fontSize: '18px',
  },
  unauthorizedContainer: {
    maxWidth: '800px',
    margin: '50px auto',
    padding: '30px',
    textAlign: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  joinButton: {
    backgroundColor: '#973232',
    color: '#fff',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    cursor: 'pointer',
    marginTop: '20px',
  },
  customContentContainer: {
    backgroundColor: '#fff',
    padding: '30px',
    marginBottom: '30px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  pageTitle: {
    fontSize: '2.5em',
    marginBottom: '20px',
    color: '#333',
  },
  pageContent: {
    lineHeight: '1.6',
    fontSize: '16px',
  },
  section: {
    backgroundColor: '#fff',
    padding: '25px',
    marginBottom: '30px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  sectionTitle: {
    fontSize: '1.8em',
    marginBottom: '15px',
    color: '#333',
    borderBottom: '2px solid #973232',
    paddingBottom: '10px',
  },
  documentList: {
    listStyle: 'none',
    padding: '0',
  },
  documentItem: {
    margin: '10px 0',
    padding: '10px',
    backgroundColor: '#f8f9fa',
    borderRadius: '4px',
    transition: 'background-color 0.2s',
  },
  documentLink: {
    color: '#973232',
    textDecoration: 'none',
    fontWeight: '500',
    display: 'block',
  },
  documentName: {
    marginRight: '10px',
  },
  downloadIcon: {
    fontSize: '14px',
    color: '#666',
  },
  tournamentList: {
    listStyle: 'none',
    padding: '0',
  },
  tournamentItem: {
    margin: '10px 0',
    padding: '15px',
    backgroundColor: '#f8f9fa',
    borderRadius: '4px',
    fontSize: '16px',
  },
  tournamentName: {
    fontWeight: 'bold',
    color: '#333',
  },
  emptyMessage: {
    color: '#666',
    fontStyle: 'italic',
  }
};