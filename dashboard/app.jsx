import React, { useState, useEffect, useCallback } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInAnonymously, 
  signInWithCustomToken, 
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  query, 
  where, 
  getDocs 
} from 'firebase/firestore';

// --- Global Variables (Provided by Canvas Environment) ---
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : null;
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

// --- External Data API URLs ---
// 1. External Sheet API (Used for Login Authentication)
const SHEET_API_URL = 'https://opensheet.elk.sh/1ErXPcMsvbek4jELn-dB59GDhlZKid_9DhBlGQ1IODuo/Sheet1';

// 2. Tokopedia Data API (Used to fetch filtered product data)
// NOTE: Please replace this with your actual, secured Apico Tokopedia endpoint if needed.
const TOKOPEDIA_API = 'https://api.apico.dev/v1/yndcCc/collections/68b327d9f1de8a0e3f730c33/items';


// Utility function for exponential backoff retry logic (for API calls)
const withRetry = async (fn, retries = 3) => {
  let attempt = 0;
  while (attempt < retries) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === retries - 1) throw error;
      const delay = Math.pow(2, attempt) * 1000;
      console.warn(`Attempt ${attempt + 1} failed. Retrying in ${delay / 1000}s...`, error);
      await new Promise(resolve => setTimeout(resolve, delay));
      attempt++;
    }
  }
};


// Main App Component
const App = () => {
  const [db, setDb] = useState(null);
  const [auth, setAuth] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [form, setForm] = useState({ user: '', pass: '', who: '', whatsapp: '' });
  const [message, setMessage] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState(null); // Holds the logged-in user's data from the sheet
  const [isLoading, setIsLoading] = useState(false); // Controls loading state for forms/login
  
  // New States for Tokopedia Data
  const [tokopediaData, setTokopediaData] = useState([]);
  const [isTokopediaLoading, setIsTokopediaLoading] = useState(false);


  // 1. Firebase Initialization and Authentication Setup
  useEffect(() => {
    if (!firebaseConfig) {
      setMessage('Error: Firebase configuration is missing.');
      return;
    }

    const app = initializeApp(firebaseConfig);
    const firestore = getFirestore(app);
    const authInstance = getAuth(app);
    
    setDb(firestore);
    setAuth(authInstance);

    // Set up auth listener
    const unsubscribe = onAuthStateChanged(authInstance, async (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        // Handle anonymous or unauthenticated state
        setUserId(crypto.randomUUID()); 
      }
      setIsAuthReady(true);
    });

    // Sign in using the custom token if available, otherwise anonymously
    const authenticate = async () => {
      try {
        if (initialAuthToken) {
          await signInWithCustomToken(authInstance, initialAuthToken);
        } else {
          await signInAnonymously(authInstance);
        }
      } catch (error) {
        console.error('Firebase Auth Error:', error);
      }
    };

    authenticate();
    return () => unsubscribe();
  }, []);
  

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const clearForm = () => {
    setForm({ user: '', pass: '', who: '', whatsapp: '' });
  };


  // 2. Registration Logic (Stores data locally in Firestore, but login is external)
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!db || !userId || isLoading) return;
    setIsLoading(true);
    setMessage('');
    
    const { user, pass, who, whatsapp } = form;

    if (!user || !pass || !who || !whatsapp) {
        setMessage('Semua kolom pendaftaran wajib diisi.');
        setIsLoading(false);
        return;
    }

    try {
      // --- Store in Private Collection ---
      const userDocRef = doc(db, 
        `artifacts/${appId}/users/${userId}/user_profile`, 
        'user_info'
      );
      
      // Store user profile details
      await withRetry(() => setDoc(userDocRef, {
        username: user,
        password: pass, // WARNING: Plaintext password for demo. Use hashing in real apps.
        role: who,
        whatsapp: whatsapp,
        registeredAt: new Date().toISOString()
      }));

      setMessage('Pendaftaran berhasil (data disimpan secara lokal). Silakan gunakan kredensial yang ada di sheet eksternal untuk Login.');
      clearForm();
      setMode('login');

    } catch (error) {
      console.error('Registration Error:', error);
      setMessage('Terjadi kesalahan saat pendaftaran. Cek konsol.');
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Login Logic (AUTHENTICATION using SHEET API)
  const handleLogin = async (e) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);
    setMessage('');

    const { user, pass } = form;
    
    if (!user || !pass) {
        setMessage('Nama pengguna dan Kata Sandi wajib diisi.');
        setIsLoading(false);
        return;
    }

    try {
        // 1. Fetch data from the external sheet API (used for authentication)
        const response = await withRetry(() => fetch(SHEET_API_URL));
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const sheetUsers = await response.json();

        // 2. Find a matching user in the sheet data
        const foundUser = sheetUsers.find(
            // NOTE: The sheet uses 'user' and 'pass' as field names
            (u) => u.user === user && u.pass === pass
        );

        if (foundUser) {
            // Success: Use the sheet data as the profile
            setUserProfile(foundUser);
            setIsLoggedIn(true);
            setMessage(`Login Berhasil! Selamat datang, ${foundUser.user}.`);
            clearForm();
        } else {
            setMessage('Login Gagal: Kredensial tidak cocok dengan data sheet eksternal.');
        }

    } catch (error) {
        console.error('Login Error:', error);
        setMessage('Terjadi kesalahan saat otentikasi menggunakan data sheet.');
    } finally {
        setIsLoading(false);
    }
  };
  
  // 4. Logout Logic (clears only the user profile and resets state)
  const handleLogout = () => {
    setUserProfile(null);
    setIsLoggedIn(false);
    setMessage('Anda telah keluar.');
    setMode('login');
    setTokopediaData([]); // Clear product data on logout
  };
  
  // --- Tokopedia Data Fetching Logic ---

  /**
   * Fetches data from the Tokopedia API, filtering by the logged-in user's 'who' value.
   * This is the core function implementing the user's request.
   */
  const fetchTokopediaData = useCallback(async (whoValue) => {
    if (!whoValue) return;
    setIsTokopediaLoading(true);
    setTokopediaData([]);
    
    // Construct the dynamic URL with filter for 'fieldData.who' equal to the whoValue
    // Example: .../items?filter[who]=ladelo
    const dynamicApiUrl = `${TOKOPEDIA_API}?filter[who]=${whoValue}`;
    
    try {
        const options = { method: 'GET' };
        const response = await withRetry(() => fetch(dynamicApiUrl, options));
        
        if (!response.ok) {
            throw new Error(`API Tokopedia error: ${response.status}`);
        }
        
        const data = await response.json();
        // Assuming the collection API returns an object with an 'items' array
        const items = data.items || []; 
        setTokopediaData(Array.isArray(items) ? items : []);

    } catch (err) {
        console.error('Fetch Tokopedia Error:', err);
        setMessage(`Gagal memuat data produk: ${err.message}`);
    } finally {
        setIsTokopediaLoading(false);
    }
  }, []); 

  // 5. Data Fetching Effect (Triggers on successful login)
  useEffect(() => {
    // Only fetch if logged in AND userProfile (which contains 'who') is available
    if (isLoggedIn && userProfile?.who) {
      fetchTokopediaData(userProfile.who);
    }
  }, [isLoggedIn, userProfile?.who, fetchTokopediaData]); 


  // --- UI Components ---

  const LoadingIndicator = () => (
    <div className="flex justify-center items-center p-4">
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span>Memproses...</span>
    </div>
  );

  const FormField = ({ label, name, type = 'text', required = true }) => (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        id={name}
        type={type}
        name={name}
        value={form[name]}
        onChange={handleInputChange}
        required={required}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
      />
    </div>
  );

  const LoginRegisterForm = () => (
    <form onSubmit={mode === 'login' ? handleLogin : handleRegister} className="space-y-4">
      <h2 className="text-2xl font-bold text-center text-gray-800">{mode === 'login' ? 'Login Akun (Via Sheet API)' : 'Daftar Akun Baru (Lokal)'}</h2>
      <p className="text-center text-sm text-gray-500 mb-6">
        {mode === 'login' ? 'Masukkan kredensial yang ada di sheet.' : 'Pendaftaran akan disimpan secara lokal, tetapi login tetap menggunakan data sheet.'}
      </p>

      {/* Fields always visible */}
      <FormField label="Nama Pengguna (user)" name="user" />
      <FormField label="Kata Sandi (pass)" name="pass" type="password" />

      {/* Registration specific fields */}
      {mode === 'register' && (
        <>
          <FormField label="Peran Anda (who)" name="who" />
          <FormField label="Nomor WhatsApp (whatsapp)" name="whatsapp" />
        </>
      )}

      {/* Submission and Mode Toggle */}
      <button
        type="submit"
        disabled={isLoading}
        className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${isLoading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'}`}
      >
        {isLoading ? <LoadingIndicator /> : (mode === 'login' ? 'Masuk' : 'Daftar Sekarang')}
      </button>

      <p className="text-center text-sm">
        {mode === 'login' ? 'Belum punya akun?' : 'Sudah punya akun?'}
        <button
          type="button"
          onClick={() => {
            setMode(mode === 'login' ? 'register' : 'login');
            setMessage('');
            clearForm();
          }}
          className="ml-1 font-medium text-indigo-600 hover:text-indigo-500"
        >
          {mode === 'login' ? 'Daftar di sini' : 'Masuk di sini'}
        </button>
      </p>
    </form>
  );

  const TokopediaDataView = () => {
    const whoFilter = userProfile?.who || 'N/A';
    
    return (
      <div className="mt-8 pt-4 border-t border-gray-200">
        <h3 className="text-xl font-bold text-gray-700 mb-4 text-center">
          Data Produk Tokopedia (Filter WHO: <span className="text-indigo-600">{whoFilter}</span>)
        </h3>
        
        {isTokopediaLoading && <LoadingIndicator />}

        {!isTokopediaLoading && tokopediaData.length === 0 && (
          <p className="text-center text-gray-500 p-4 border rounded-lg bg-gray-50">
            Tidak ada data produk ditemukan untuk pengguna **{whoFilter}**.
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {tokopediaData.map((item, index) => {
            const data = item.fieldData || {};
            const name = data.name || 'Produk Tanpa Nama';
            const price = data.price || 'Harga Tidak Tersedia';
            const city = data.kota || 'N/A';
            const imageUrl = data.image1 || 'https://placehold.co/400x150/e0e0e0/555555?text=No+Image';

            return (
              <div key={index} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-md">
                <img 
                    src={imageUrl} 
                    alt={name} 
                    className="w-full h-36 object-cover"
                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x150/e0e0e0/555555?text=Gagal+Memuat'; }}
                />
                <div className="p-3">
                  <h4 className="font-semibold text-gray-800 line-clamp-1">{name}</h4>
                  <p className="text-xl font-bold text-green-600 mb-1">{price}</p>
                  <p className="text-xs text-gray-500">{city}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };


  const ProfileView = () => (
    <div className="space-y-6">
      <h2 className="text-3xl font-extrabold text-gray-900 text-center">Selamat Datang, {userProfile.user}!</h2>
      <button
        onClick={handleLogout}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
      >
        Keluar (Logout)
      </button>

      {/* Profile Detail Block (derived from sheet data of the logged-in user) */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 bg-indigo-500 text-white">
          <h3 className="text-lg leading-6 font-medium">Detail Profil Pengguna Anda (Dari Sheet)</h3>
          <p className="mt-1 max-w-2xl text-sm opacity-90">Informasi yang digunakan untuk login.</p>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            {Object.entries(userProfile).map(([key, value]) => {
                // Simple transformation for display
                const displayKey = key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');
                if (key === 'pass') return null; // Hide password
                return (
                    <div key={key} className="bg-gray-50 px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 odd:bg-white">
                        <dt className="text-sm font-medium text-gray-500">{displayKey}</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{value}</dd>
                    </div>
                );
            })}
          </dl>
        </div>
      </div>
      
      {/* NEW: Tokopedia Data Filtered by userProfile.who */}
      <TokopediaDataView />

    </div>
  );
  
  // Main Render
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <script src="https://cdn.tailwindcss.com"></script>
        <div className="w-full max-w-lg bg-white p-6 rounded-xl shadow-2xl">
            
            {/* User ID Display (Mandatory for multi-user apps) */}
            <p className="text-xs text-center text-gray-400 mb-4 truncate">
                {userId ? `User ID Canvas: ${userId}` : 'Memuat ID Pengguna...'}
            </p>

            {/* General Message Box */}
            {message && (
                <div 
                    className={`p-3 mb-4 text-sm font-medium rounded-lg ${message.includes('Gagal') ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}
                    role="alert"
                >
                    {message}
                </div>
            )}

            {/* Conditional Rendering */}
            {!isAuthReady && <LoadingIndicator />}
            
            {isAuthReady && (
                isLoggedIn ? <ProfileView /> : <LoginRegisterForm />
            )}

        </div>
    </div>
  );
};

export default App;
