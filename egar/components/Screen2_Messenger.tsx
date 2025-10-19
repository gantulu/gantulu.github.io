import React, { useState, useEffect, useRef } from 'react';
import type { StepProps, ChatMessage } from '../types';

const initialMessages: ChatMessage[] = [
    { id: 1, sender: 'Admin', avatarUrl: 'https://i.pravatar.cc/40?u=admin', text: 'Selamat datang di grup bimbingan! Silakan perkenalkan diri.', isOwn: false },
    { id: 2, sender: 'Rina', avatarUrl: 'https://i.pravatar.cc/40?u=rina', text: 'Halo semua, saya Rina dari Bandung. Baru join 2 hari yg lalu.', isOwn: false },
    { id: 3, sender: 'Agus', avatarUrl: 'https://i.pravatar.cc/40?u=agus', text: 'Mantap! Saya Agus, udah seminggu di sini. Gak nyangka beneran dapet duit!', isOwn: false },
    { id: 4, sender: 'Admin', avatarUrl: 'https://i.pravatar.cc/40?u=admin', text: 'Selamat pak Agus! Bisa diceritakan pengalamannya?', isOwn: false },
    { id: 5, sender: 'Agus', avatarUrl: 'https://i.pravatar.cc/40?u=agus', text: 'Cuma ikutin video tutorialnya aja min, eh tau2 dapet transferan 1.5jt. Gampang banget ternyata.', isOwn: false },
    { id: 6, sender: 'Sari', avatarUrl: 'https://i.pravatar.cc/40?u=sari', text: 'Wah serius pak? Saya baru mau coba nih, masih ragu.', isOwn: false },
    { id: 7, sender: 'Rina', avatarUrl: 'https://i.pravatar.cc/40?u=rina', text: 'Jangan ragu mba Sari, saya juga baru mulai udah dapet 500rb. Beneran gratis kok!', isOwn: false },
    { id: 8, sender: 'Agus', avatarUrl: 'https://i.pravatar.cc/40?u=agus', text: 'Betul, gas aja mba. Nyesel kalo telat.', isOwn: false },
];

const messageQueue = [
  { id: 9, sender: 'Dewi', avatarUrl: 'https://i.pravatar.cc/40?u=dewi', text: 'Serius ini work? Mau coba juga ah!', isOwn: false },
  { id: 10, sender: 'Bambang', avatarUrl: 'https://i.pravatar.cc/40?u=bambang', text: 'Jangan ragu, saya udah cair 2jt, ajarannya mantap betul!', isOwn: false },
  { id: 11, sender: 'Admin', avatarUrl: 'https://i.pravatar.cc/40?u=admin', text: 'Slot terbatas ya teman-teman, siapa cepat dia dapat. Segera login untuk amankan posisi Anda!', isOwn: false, isLoginTrigger: true },
];


const TypingIndicator: React.FC<{ avatarUrl: string }> = ({ avatarUrl }) => (
    <div className="flex items-end gap-2">
        <img src={avatarUrl} alt="typing user" className="w-7 h-7 rounded-full" />
        <div className="max-w-xs md:max-w-md p-3 rounded-2xl bg-gray-200 text-black rounded-bl-lg">
            <div className="flex items-center space-x-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.3s]"></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.15s]"></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></span>
            </div>
        </div>
    </div>
);

const Screen2_Messenger: React.FC<StepProps> = ({ onNext }) => {
    const [messages, setMessages] = useState(initialMessages);
    const [isTyping, setIsTyping] = useState<{ active: boolean; avatar: string }>({ active: false, avatar: '' });
    const [showLoginButton, setShowLoginButton] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);
    const messageQueueRef = useRef([...messageQueue]);
    const intervalRef = useRef<number | null>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping.active]);

    useEffect(() => {
        const addMessage = () => {
            if (messageQueueRef.current.length === 0) {
                if (intervalRef.current) clearInterval(intervalRef.current);
                setIsTyping({ active: false, avatar: '' });
                return;
            }

            const nextMessage = messageQueueRef.current.shift()!;
            setIsTyping({ active: true, avatar: nextMessage.avatarUrl });

            setTimeout(() => {
                setIsTyping({ active: false, avatar: '' });
                setMessages(prev => [...prev, nextMessage]);
                if (nextMessage.isLoginTrigger) {
                    setShowLoginButton(true);
                    if (intervalRef.current) clearInterval(intervalRef.current);
                }
            }, Math.random() * 2000 + 1500); // Typing duration
        };

        // Start the first message after a short delay
        const startTimeout = setTimeout(() => {
            addMessage();
            intervalRef.current = window.setInterval(addMessage, Math.random() * 5000 + 5000); // 5-10 seconds interval
        }, 2000);
        
        return () => {
            clearTimeout(startTimeout);
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-white shadow-2xl">
      <header className="flex items-center justify-between p-3 border-b border-gray-200 sticky top-0 bg-white z-10">
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          <div className="flex items-center ml-2">
            <div className="relative">
              <img className="h-10 w-10 rounded-full object-cover" src="https://picsum.photos/seed/group/100/100" alt="Group" />
              <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-400 border-2 border-white"></span>
            </div>
            <div className="ml-3">
              <h2 className="font-bold text-md">Bimbingan Sukses FB</h2>
              <p className="text-xs text-gray-500">157 anggota, 23 online</p>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-4 text-blue-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M20.518 15.823l-3.233-1.616a1.472 1.472 0 00-1.68.42l-1.42 1.42a13.332 13.332 0 01-5.94-5.94l1.42-1.42a1.472 1.472 0 00.42-1.68L8.177 3.482a1.473 1.473 0 00-1.65-.965L3.48 3.482a1.47 1.47 0 00-1.23 1.412A16.03 16.03 0 0019.11 21.75a1.47 1.47 0 001.41-1.23l.966-3.047a1.472 1.472 0 00-.968-1.65z" /></svg>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M16 10l5.21-2.48a1.2 1.2 0 011.79 1.05v6.86a1.2 1.2 0 01-1.79 1.05L16 14zm-2-3a3 3 0 00-3-3H5a3 3 0 00-3 3v6a3 3 0 003 3h6a3 3 0 003-3z" /></svg>
        </div>
      </header>
      <main className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        <p className="text-center text-xs text-gray-400">Sabtu, 14:30</p>
        {messages.map(msg => (
          <div key={msg.id} className={`flex items-end gap-2 ${msg.isOwn ? 'justify-end' : ''}`}>
            {!msg.isOwn && <img src={msg.avatarUrl} alt={msg.sender} className="w-7 h-7 rounded-full"/>}
            <div className={`max-w-xs md:max-w-md p-3 rounded-2xl ${msg.isOwn ? 'bg-blue-500 text-white rounded-br-lg' : 'bg-gray-200 text-black rounded-bl-lg'}`}>
              {!msg.isOwn && <p className="text-xs font-bold text-purple-600 mb-1">{msg.sender}</p>}
              <p className="text-sm">{msg.text}</p>
            </div>
          </div>
        ))}
        {isTyping.active && <TypingIndicator avatarUrl={isTyping.avatar} />}
        <div ref={chatEndRef} />
      </main>
      {showLoginButton && (
        <footer className="p-2 border-t border-gray-200 bg-white sticky bottom-0">
          <div className="flex items-center justify-center mb-2">
              <button onClick={onNext} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors animate-pulse">
                <svg height="20" viewBox="0 0 25 24" width="20" xmlns="http://www.w3.org/2000/svg"><path d="M16.581 3.913A8.31 8.31 0 0012.5 2.25a8.323 8.323 0 00-7.086 3.663A8.323 8.323 0 002.25 12.5a8.323 8.323 0 003.663 7.087A8.323 8.323 0 0012.5 23.25a8.323 8.323 0 007.087-3.663A8.323 8.323 0 0023.25 12.5a8.32 8.32 0 00-2.493-5.914 8.28 8.28 0 00-4.176-2.673zm-4.11 11.831l-3.036-3.036a.562.562 0 010-.795l1.518-1.518a.562.562 0 01.795 0l2.239 2.238 4.852-4.852a.562.562 0 01.795 0l1.518 1.518a.562.562 0 010 .795L13.266 16.54a.562.562 0 01-.795 0z" fill="white"></path></svg>
                <span>Login untuk Bergabung</span>
              </button>
          </div>
        </footer>
      )}
    </div>
  );
};

export default Screen2_Messenger;