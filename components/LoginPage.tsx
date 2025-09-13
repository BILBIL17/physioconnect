import React, { useState } from 'react';
import type { User } from '../types';

interface LoginPageProps {
  onUserAuth: (email: string, pass: string) => User | null;
  onUserRegister: (name: string, email: string, pass: string) => { success: boolean, message: string };
  onGuestLogin: () => void;
  onAdminLogin: (email: string, pass: string) => boolean;
}

type Mode = 'user' | 'admin';
type AuthMode = 'login' | 'register';

const LoginPage: React.FC<LoginPageProps> = ({ onUserAuth, onUserRegister, onGuestLogin, onAdminLogin }) => {
  const [mode, setMode] = useState<Mode>('user');
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  
  // Admin state
  const [adminEmail, setAdminEmail] = useState('admin@physcio.com');
  const [adminPassword, setAdminPassword] = useState('password123');
  
  // User state
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');

  const [error, setError] = useState('');

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const success = onAdminLogin(adminEmail, adminPassword);
    if (!success) {
      setError('Invalid admin credentials. Please try again.');
    }
  };

  const handleUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if(authMode === 'login') {
        if (!userEmail || !userPassword) {
            setError('Email and password are required.');
            return;
        }
        const success = onUserAuth(userEmail, userPassword);
        if(!success) {
            setError('Invalid credentials. Please check your email and password.');
        }
    } else { // Register
        if (!userName || !userEmail || !userPassword) {
            setError('All fields are required for registration.');
            return;
        }
        const result = onUserRegister(userName, userEmail, userPassword);
        if (!result.success) {
            setError(result.message);
        }
    }
  };
  
  const resetUserFields = () => {
    setError('');
    setUserName('');
    setUserEmail('');
    setUserPassword('');
  };

  const renderUserLogin = () => (
    <div className="animate-fade-in-fast">
        <div className="flex justify-center mb-4 rounded-lg bg-gray-100 p-1">
             <button 
                onClick={() => { setAuthMode('login'); resetUserFields(); }}
                className={`flex-1 py-2 text-sm font-semibold rounded-md transition-colors ${authMode === 'login' ? 'bg-white shadow text-[#00838f]' : 'text-gray-500'}`}
             >
                Login
             </button>
             <button
                onClick={() => { setAuthMode('register'); resetUserFields(); }}
                className={`flex-1 py-2 text-sm font-semibold rounded-md transition-colors ${authMode === 'register' ? 'bg-white shadow text-[#00838f]' : 'text-gray-500'}`}
            >
                Register
            </button>
        </div>

        <form onSubmit={handleUserSubmit} className="space-y-4">
            {authMode === 'register' && (
                <div>
                    <label className="block text-[#78909c] text-sm font-bold mb-2">Full Name</label>
                    <input type="text" value={userName} onChange={e => setUserName(e.target.value)} className="w-full px-3 py-2 border rounded-lg bg-white" required />
                </div>
            )}
             <div>
                <label className="block text-[#78909c] text-sm font-bold mb-2">Email Address</label>
                <input type="email" value={userEmail} onChange={e => setUserEmail(e.target.value)} className="w-full px-3 py-2 border rounded-lg bg-white" required />
            </div>
             <div>
                <label className="block text-[#78909c] text-sm font-bold mb-2">Password</label>
                <input type="password" value={userPassword} onChange={e => setUserPassword(e.target.value)} className="w-full px-3 py-2 border rounded-lg bg-white" required />
            </div>
            
            {error && <p className="text-red-500 text-xs text-center">{error}</p>}
            
            <button
                type="submit"
                className="w-full bg-[#00838f] hover:bg-teal-800 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-colors"
            >
                {authMode === 'login' ? 'Login' : 'Create Account'}
            </button>
        </form>

        <div className="mt-4 flex items-center">
            <hr className="w-full" />
            <span className="p-2 text-gray-400 text-xs">OR</span>
            <hr className="w-full" />
        </div>

        <button
            type="button"
            onClick={onGuestLogin}
            className="w-full mt-4 bg-gray-200 hover:bg-gray-300 text-[#37474f] font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-colors"
        >
            Continue as Guest
        </button>
    </div>
  );

  const renderAdminLogin = () => (
    <form onSubmit={handleAdminSubmit} className="space-y-4 animate-fade-in-fast">
      <div>
        <label className="block text-[#78909c] text-sm font-bold mb-2">Admin Email</label>
        <input 
          type="email" 
          value={adminEmail}
          onChange={(e) => setAdminEmail(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg bg-white"
          required
        />
      </div>
       <div>
        <label className="block text-[#78909c] text-sm font-bold mb-2">Password</label>
        <input 
          type="password" 
          value={adminPassword}
          onChange={(e) => setAdminPassword(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg bg-white"
          required
        />
      </div>
      {error && <p className="text-red-500 text-xs text-center">{error}</p>}
      <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-colors"
      >
          Login as Admin
      </button>
    </form>
  );

  return (
    <div className="flex items-center justify-center h-screen bg-[#f4f7f6] p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">
        <div className="mb-8">
          <div className="flex border-b">
            <button 
              onClick={() => { setMode('user'); resetUserFields(); }}
              className={`flex-1 py-2 font-semibold text-center transition-colors ${mode === 'user' ? 'text-[#00838f] border-b-2 border-[#00838f]' : 'text-gray-500'}`}
            >
              User Portal
            </button>
            <button
              onClick={() => { setMode('admin'); resetUserFields(); }}
              className={`flex-1 py-2 font-semibold text-center transition-colors ${mode === 'admin' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}
            >
              Admin Portal
            </button>
          </div>
        </div>
        
        {mode === 'user' ? renderUserLogin() : renderAdminLogin()}
        
      </div>
    </div>
  );
};

export default LoginPage;