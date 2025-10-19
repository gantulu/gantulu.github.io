import React from 'react';
import type { StepProps, Testimonial } from '../types';

const testimonials: Testimonial[] = [
  {
    name: 'Andi S.',
    avatarUrl: 'https://i.pravatar.cc/100?u=andi',
    text: 'Program ini mengubah hidup saya! Dalam seminggu, saya sudah bisa menghasilkan uang dari Facebook. Sangat mudah dan cepat!',
    income: 'Rp 5.000.000 / minggu'
  },
  {
    name: 'Siti K.',
    avatarUrl: 'https://i.pravatar.cc/100?u=siti',
    text: 'Awalnya saya ragu, tapi ternyata benar-benar gratis dan terbukti menghasilkan. Terima kasih banyak!',
    income: 'Rp 3.500.000 / minggu'
  },
  {
    name: 'Budi W.',
    avatarUrl: 'https://i.pravatar.cc/100?u=budi',
    text: 'Materi pembelajarannya sangat mudah dipahami. Cocok untuk pemula seperti saya. Recommended!',
    income: 'Rp 4.200.000 / minggu'
  },
];

const Screen1_Landing: React.FC<StepProps> = ({ onNext }) => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
        <div className="container mx-auto px-6 py-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight drop-shadow-md">Rahasia Menghasilkan Uang dari Facebook Terungkap!</h1>
          <p className="mt-4 text-lg md:text-xl text-blue-100">Program Pelatihan Eksklusif: Cepat, Mudah, dan 100% GRATIS!</p>
        </div>
      </header>
      
      <main className="container mx-auto px-6 py-12">
        <section className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Mengapa Anda Harus Bergabung Sekarang?</h2>
          <p className="max-w-3xl mx-auto text-lg text-gray-600">
            Kami akan membimbing Anda langkah demi langkah untuk mengubah akun Facebook Anda menjadi mesin penghasil uang. Tanpa perlu pengalaman, tanpa modal, dan bisa dikerjakan kapan saja, di mana saja.
          </p>
        </section>
        
        <section className="mt-16 grid md:grid-cols-3 gap-8 text-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="text-blue-600 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Cepat & Mudah</h3>
            <p className="text-gray-600">Materi dirancang agar mudah dipahami dan langsung bisa dipraktikkan oleh siapa saja.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="text-blue-600 mb-4">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" /></svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Tanpa Biaya</h3>
            <p className="text-gray-600">Program ini 100% gratis. Tidak ada biaya tersembunyi apapun.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="text-blue-600 mb-4">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Terbukti Berhasil</h3>
            <p className="text-gray-600">Ratusan anggota telah membuktikan keberhasilan program ini.</p>
          </div>
        </section>

        <section className="mt-20 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-10">Testimoni Anggota Kami</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-xl transform hover:scale-105 transition-transform duration-300 ease-in-out">
                <img src={testimonial.avatarUrl} alt={testimonial.name} className="w-24 h-24 rounded-full mx-auto -mt-16 border-4 border-white shadow-md" />
                <h4 className="text-xl font-semibold mt-4">{testimonial.name}</h4>
                <p className="text-gray-500 italic my-4">"{testimonial.text}"</p>
                <div className="bg-green-100 text-green-800 font-bold py-2 px-4 rounded-full inline-block">
                  Penghasilan: {testimonial.income}
                </div>
              </div>
            ))}
          </div>
        </section>
        
        <section className="mt-20 text-center">
          <button 
            onClick={onNext}
            className="bg-green-500 hover:bg-green-600 text-white font-bold text-2xl py-4 px-12 rounded-full shadow-lg transform hover:scale-110 transition-transform duration-300 animate-pulse"
            aria-label="Gabung sekarang, gratis!"
          >
            GABUNG SEKARANG GRATIS!
          </button>
        </section>

      </main>
      
      <footer className="bg-gray-800 text-white mt-12 py-6">
          <div className="container mx-auto px-6 text-center">
              <p className="font-semibold">Butuh Bantuan?</p>
              <p>Email: support@belajarfb.com | WhatsApp: +62 123 4567 890</p>
              <p className="text-sm text-gray-400 mt-4">&copy; 2024 Program Pembelajaran Facebook. All Rights Reserved.</p>
          </div>
      </footer>
    </div>
  );
};

export default Screen1_Landing;