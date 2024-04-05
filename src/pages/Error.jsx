// Error404.js

import React from 'react';

const Error404 = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>404 Not Found</h1>
      <p style={styles.message}>Sorry, the page you are looking for does not exist.</p>
      {/* You can add additional content or links to guide users */}
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    textAlign: 'center',
  },
  heading: {
    fontSize: '4rem',
    color: '#ff0000', // You can customize the color
  },
  message: {
    fontSize: '1.5rem',
    margin: '20px 0',
  },
};

export default Error404;
