import React from 'react';
import MembershipList from '../module/MembershipList'; // Import the MembershipList component

function App() {
  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Membership Information</h1>
      <MembershipList />
    </div>
  );
}

const styles = {
  container: {
    textAlign: 'center',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  heading: {
    color: '#333',
    marginBottom: '20px',
  },
};

export default App;
