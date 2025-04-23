import MembershipList from '../../module/MembershipList'; // Import the MembershipList component
import Header from '../../components/Header'; 
import Head from 'next/head';

//DL
export default function App(){

return(
    <>
     <Head>
          <title>Om Discgolf</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </Head>
    
        <Header/>
    
    <h1 style={styles.heading}>Membership Information</h1>
<div style={styles.container}>
      <MembershipList />
    </div>
    </>
)}
const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      height: '100vh', 
      textAlign: 'center',
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
    },
    heading: {
      color: 'white',
      marginBottom: '20px',
      textAlign: 'center',
    },
  };
  