'use client';

import { useState, useEffect } from 'react';
import { useAuth } from "../../../module/context";
import { useRouter } from "next/navigation";
import ReactMarkdown from 'react-markdown';
import { useSearchParams } from 'next/navigation';

export default function EditClubPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [pageTitle, setPageTitle] = useState("");
  const [pageContent, setPageContent] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editMode, setEditMode] = useState(true);
  const searchParams = useSearchParams();
  const clubId = searchParams.get('clubId');
  const baseUrl = process.env.NODE_ENV === 'production'
          ? 'https://vast-mesa-22158-90c21fc001d1.herokuapp.com'
          : 'http://localhost:5000';
          

          //Generated Code by Claude AI
 
useEffect(() => {
    const fetchClubData = async () => {
      try {
        setLoading(true);
        
        // Fetch existing page content for the club
        const pageDataResponse = await fetch(`${baseUrl}/api/clubs/${clubId}/page`);
        if (pageDataResponse.ok) {
          const pageData = await pageDataResponse.json();
          if (pageData) {
            setPageTitle(pageData.title);
            setPageContent(pageData.content);
          }
        }

        setLoading(false);
      } catch (err) {
        setError(err.message || "En feil oppstod under lasting av klubbdata");
        setLoading(false);
      }
    };

    fetchClubData();
  }, [user, router]);

  const handleTitleChange = (e) => {
    setPageTitle(e.target.value);
  };

  const handleContentChange = (e) => {
    setPageContent(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();


    try {
      setMessage("");
      setError("");
      
      const baseUrl = process.env.NODE_ENV === 'production'
        ? 'https://vast-mesa-22158-90c21fc001d1.herokuapp.com'
        : 'http://localhost:5000';

      const response = await fetch(`${baseUrl}/api/clubs/${clubId}/page`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: pageTitle,
          content: pageContent,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Kunne ikke lagre endringer");
      }
      setMessage("Endringene ble lagret!");
    } catch (err) {
      setError(err.message || "En feil oppstod under lagring av endringer");
    }
  };

  return (
    <>
      
      <div style={styles.container}>
        <h1 style={styles.header}>Rediger klubbside</h1>
        
        {loading ? (
          <p>Laster inn innhold...</p>
        ) : error ? (
          <div style={styles.errorMessage}>{error}</div>
        ) : (
          <>
            <div style={styles.editorTabs}>
              <button 
                onClick={() => setEditMode(true)}
                style={editMode ? styles.activeTab : styles.tab}
              >
                Rediger
              </button>
              <button 
                onClick={() => setEditMode(false)}
                style={!editMode ? styles.activeTab : styles.tab}
              >
                Forhåndsvisning
              </button>
            </div>

            {editMode ? (
              <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.formGroup}>
                  <label htmlFor="pageTitle" style={styles.label}>Sidetittel:</label>
                  <input
                    id="pageTitle"
                    type="text"
                    value={pageTitle}
                    onChange={handleTitleChange}
                    style={styles.titleInput}
                    required
                  />
                </div>
                
                <div style={styles.formGroup}>
                  <label htmlFor="pageContent" style={styles.label}>Sideinnhold:</label>
                  <p style={styles.helpText}>
                    Du kan bruke markdown for formatering: 
                    <br />
                    **fet tekst**, *kursiv tekst*, # Overskrift, ## Mindre overskrift, - liste punkt, 1. nummerert punkt, [lenke](url)
                  </p>
                  <textarea
                    id="pageContent"
                    value={pageContent}
                    onChange={handleContentChange}
                    style={styles.contentTextarea}
                    rows={15}
                    required
                  />
                </div>
                
                <div style={styles.formActions}>
                  <button type="submit" style={styles.saveButton}>
                    Lagre endringer
                  </button>
                </div>
              </form>
            ) : (
              <div style={styles.previewContainer}>
                <h1 style={styles.previewTitle}>{pageTitle}</h1>
                <div style={styles.previewContent}>
                  <ReactMarkdown>{pageContent}</ReactMarkdown>
                </div>
                <button 
                  onClick={() => setEditMode(true)} 
                  style={styles.editButton}
                >
                  Tilbake til redigering
                </button>
              </div>
            )}
            
            {message && <div style={styles.successMessage}>{message}</div>}
          </>
        )}
      </div>
    </>
  );
}

const styles = {
  container: {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: '#3c1e1e',
    borderRadius: '10px',
    color: '#fff',
  },
  header: {
    fontSize: '2em',
    marginBottom: '20px',
    color: '#fff',
    textAlign: 'center',
  },
  editorTabs: {
    display: 'flex',
    marginBottom: '20px',
    borderBottom: '1px solid #ccc',
  },
  tab: {
    padding: '10px 20px',
    backgroundColor: 'transparent',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
  },
  activeTab: {
    padding: '10px 20px',
    backgroundColor: '#973232',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    borderRadius: '5px 5px 0 0',
  },
  form: {
    width: '100%',
  },
  formGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: 'bold',
    color: '#fff',
  },
  titleInput: {
    width: '100%',
    padding: '10px',
    fontSize: '16px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    boxSizing: 'border-box',
    backgroundColor: '#fff',
    color: '#333',
  },
  contentTextarea: {
    width: '100%',
    padding: '10px',
    fontSize: '16px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    boxSizing: 'border-box',
    backgroundColor: '#fff',
    color: '#333',
    resize: 'vertical',
    fontFamily: 'monospace',
  },
  helpText: {
    fontSize: '14px',
    color: '#ddd',
    marginBottom: '10px',
  },
  formActions: {
    marginTop: '20px',
  },
  saveButton: {
    backgroundColor: '#973232',
    color: '#fff',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    cursor: 'pointer',
  },
  previewContainer: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '4px',
    color: '#333',
  },
  previewTitle: {
    fontSize: '2em',
    marginBottom: '20px',
    color: '#333',
  },
  previewContent: {
    lineHeight: '1.6',
  },
  editButton: {
    backgroundColor: '#973232',
    color: '#fff',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    cursor: 'pointer',
    marginTop: '20px',
  },
  successMessage: {
    backgroundColor: '#4CAF50',
    color: '#fff',
    padding: '10px',
    marginTop: '20px',
    borderRadius: '4px',
  },
  errorMessage: {
    backgroundColor: '#f44336',
    color: '#fff',
    padding: '10px',
    marginTop: '20px',
    borderRadius: '4px',
  },
};