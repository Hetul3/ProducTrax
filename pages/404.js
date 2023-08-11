import Link from 'next/link';

const Custom404 = () => {
  const containerStyle = {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'Arial, sans-serif',
  };

  const contentStyle = {
    textAlign: 'center',
  };

  const titleStyle = {
    fontSize: '3rem',
    fontWeight: 'bold',
    color: '#333',
  };

  const textStyle = {
    fontSize: '1.5rem',
    color: '#666',
    marginBottom: '2rem',
  };

  const linkStyle = {
    fontSize: '1.2rem',
    color: '#0070f3',
    textDecoration: 'none',
  };

  const illustrationStyle = {
    width: '70%',
    maxWidth: '500px',
    animation: 'bounce 2s infinite',
  };

  const keyframesBounce = `
    @keyframes bounce {
      0%, 20%, 50%, 80%, 100% {
        transform: translateY(0);
      }
      40% {
        transform: translateY(-20px);
      }
      60% {
        transform: translateY(-10px);
      }
    }
  `;

  return (
    <div style={containerStyle}>
      <style>{keyframesBounce}</style>
      <div style={contentStyle}>
        <h1 style={titleStyle}>404 - Page Not Found</h1>
        <p style={textStyle}>Oops! The page you are looking for does not exist.</p>
        <Link href="/" className='linkStyle'>
          Go back to Homepage
        </Link>
      </div>
      <img
        style={illustrationStyle}
        src="https://static-00.iconduck.com/assets.00/404-page-not-found-illustration-512x249-ju1c9yxg.png"
        alt="404 Illustration"
      />
    </div>
  );
};

export default Custom404;
