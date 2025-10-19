import React from 'react';

const Screen5_Waiting: React.FC = () => {
  return (
    <div className="bg-gray-100 min-h-screen flex justify-center items-center text-center p-4">
      <div className="max-w-md bg-white p-10 rounded-xl shadow-lg animate-fade-in-up">
        <style>{`
          @keyframes fade-in-up {
            0% {
              opacity: 0;
              transform: translateY(20px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fade-in-up {
            animation: fade-in-up 0.5s ease-out forwards;
          }
        `}</style>
        <div className="text-green-500 mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Terima Kasih!</h1>
        <p className="text-gray-600 text-lg">
          Permintaan Anda telah kami terima. Admin akan segera meninjau permintaan Anda untuk bergabung. Mohon tunggu.
        </p>
      </div>
    </div>
  );
};

export default Screen5_Waiting;