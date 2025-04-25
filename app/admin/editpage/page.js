'use client'; // Markerer dette som en klientside-komponent i Next.js

import { useState, useEffect } from 'react';
import { useAuth } from "../../../module/context"; // Importerer autentiseringskontekst
import { useRouter } from "next/navigation"; // For navigering mellom sider
import ReactMarkdown from 'react-markdown'; // For markdown-rendering i forhåndsvisning
import { useSearchParams } from 'next/navigation';

// Hovedkomponent for redigering av klubbside
export default function EditClubPage() {
  const { user, adminClubId } = useAuth(); // Henter bruker og admin-klubb-ID fra auth-kontekst
  const router = useRouter(); // Router-instans for navigering
  
  // Tilstandsvariabler for skjemadata og UI-tilstand
  const [pageTitle, setPageTitle] = useState(""); // Sidetittel
  const [pageContent, setPageContent] = useState(""); // Sideinnhold i markdown-format
  const [message, setMessage] = useState(""); // Tilbakemeldingsmelding til brukeren
  const [loading, setLoading] = useState(true); // Laster-indikator
  const [error, setError] = useState(""); // Feilmelding
  const [editMode, setEditMode] = useState(true); // Veksler mellom redigering og forhåndsvisning

  // Definerer base-URL basert på miljø (produksjon eller utvikling)
  const baseUrl = process.env.NODE_ENV === 'production'
    ? 'https://vast-mesa-22158-90c21fc001d1.herokuapp.com'
    : 'http://localhost:5000';
  
  // Kommentar indikerer at kode er generert av Claude AI
  
  // useEffect-hook for å laste inn eksisterende sideinnhold ved komponentmontering
  useEffect(() => {
    const fetchClubData = async () => {
      try {
        setLoading(true);
        
        // Henter eksisterende sideinnhold for klubben fra API
        const pageDataResponse = await fetch(`${baseUrl}/api/clubs/${adminClubId}/page`);
        if (pageDataResponse.ok) {
          const pageData = await pageDataResponse.json();
          if (pageData) {
            // Fyller inn eksisterende data i skjemaet
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

    fetchClubData(); // Kjører datahentingsfunksjonen
  }, [user, router]); // Avhengigheter for når denne effekten skal kjøre på nytt

  // Håndteringsfunksjoner for skjemaendringer
  const handleTitleChange = (e) => {
    setPageTitle(e.target.value); // Oppdaterer tittel når brukeren skriver
  };

  const handleContentChange = (e) => {
    setPageContent(e.target.value); // Oppdaterer innhold når brukeren skriver
  };

  // Håndterer innsending av skjemaet
  const handleSubmit = async (e) => {
    e.preventDefault(); // Forhindrer standardskjemainnsending

    try {
      // Nullstiller meldinger
      setMessage("");
      setError("");
      
      // Sender oppdatert sideinnhold til API
      const response = await fetch(`${baseUrl}/api/clubs/${adminClubId}/page`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: pageTitle,
          content: pageContent,
        }),
      });
      
      // Håndterer eventuelle feil fra API
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Kunne ikke lagre endringer");
      }
      
      // Viser suksessmelding
      setMessage("Endringene ble lagret!");
    } catch (err) {
      // Viser feilmelding hvis noe går galt
      setError(err.message || "En feil oppstod under lagring av endringer");
    }
  };

  // Komponentens UI-rendering
  return (
    <>
      <div style={styles.container}>
        <h1 style={styles.header}>Rediger klubbside</h1>
        
        {/* Viser lasteskjerm, feilmelding eller redigeringsskjema basert på tilstand */}
        {loading ? (
          <p>Laster inn innhold...</p>
        ) : error ? (
          <div style={styles.errorMessage}>{error}</div>
        ) : (
          <>
            {/* Fanenavigasjon for å veksle mellom redigering og forhåndsvisning */}
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

            {/* Kondisjonell rendering basert på om vi er i redigeringsmodus eller forhåndsvisningsmodus */}
            {editMode ? (
              // Redigeringsskjema
              <form onSubmit={handleSubmit} style={styles.form}>
                {/* Felt for sidetittel */}
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
                
                {/* Felt for sideinnhold med markdown */}
                <div style={styles.formGroup}>
                  <label htmlFor="pageContent" style={styles.label}>Sideinnhold:</label>
                  {/* Hjelpetekst som forklarer markdown-syntaks */}
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
                
                {/* Knapper for innsending av skjema */}
                <div style={styles.formActions}>
                  <button type="submit" style={styles.saveButton}>
                    Lagre endringer
                  </button>
                </div>
              </form>
            ) : (
              // Forhåndsvisning av markdown-innhold
              <div style={styles.previewContainer}>
                <h1 style={styles.previewTitle}>{pageTitle}</h1>
                <div style={styles.previewContent}>
                  {/* Rendrer markdown-innholdet som HTML */}
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
            
            {/* Viser eventuelle suksessmeldinger */}
            {message && <div style={styles.successMessage}>{message}</div>}
          </>
        )}
      </div>
    </>
  );
}

// Inline stildefinisjoner for komponenten
const styles = {
  container: {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: '#3c1e1e', // Mørk rødbrun bakgrunn
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
    backgroundColor: '#973232', // Mørkere rød for aktiv fane
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
    fontFamily: 'monospace', // Bruker monospace-font for bedre markdown-redigering
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
    backgroundColor: '#fff', // Hvit bakgrunn for forhåndsvisning
    padding: '20px',
    borderRadius: '4px',
    color: '#333', // Mørk tekst for lesbarhet
  },
  previewTitle: {
    fontSize: '2em',
    marginBottom: '20px',
    color: '#333',
  },
  previewContent: {
    lineHeight: '1.6', // Økt linjehøyde for bedre lesbarhet
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
    backgroundColor: '#4CAF50', // Grønn bakgrunn for suksessmeldinger
    color: '#fff',
    padding: '10px',
    marginTop: '20px',
    borderRadius: '4px',
  },
  errorMessage: {
    backgroundColor: '#f44336', // Rød bakgrunn for feilmeldinger
    color: '#fff',
    padding: '10px',
    marginTop: '20px',
    borderRadius: '4px',
  },
};