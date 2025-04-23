import MembershipList from '../../../module/MembershipList';
import Header from '../../../components/Header'; 
import Head from 'next/head';

//DL
export default function App(){

return(
    <>
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
  