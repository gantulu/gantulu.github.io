import React from 'react';

const LoadingOverlay: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-75 flex justify-center items-center z-50 backdrop-blur-sm">
      <div className="flex space-x-2">
        <div className="w-4 h-4 bg-blue-600 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
        <div className="w-4 h-4 bg-blue-600 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
        <div className="w-4 h-4 bg-blue-600 rounded-full animate-pulse"></div>
      </div>
    </div>
  );
};

export default LoadingOverlay;