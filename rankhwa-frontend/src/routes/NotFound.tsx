import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="text-lg mb-4">The page you are looking for does not exist.</p>
      <Link to="/" className="text-primary underline">
        Go to home
      </Link>
    </div>
  );
};

export default NotFoundPage;