import React, { useState, useEffect } from 'react';
import WelcomePage from './components/WelcomePage';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import AdminPanel from './components/admin/AdminPanel';
import { initializeAi } from './services/geminiService';
import { initializeUsers, getUser, updateUser, authenticateUser, registerUser } from './services/userService';
import type { User } from './types';

type View = 'welcome' | 'login' | 'dashboard' | 'admin';
export type AiProvider = 'gemini' | 'openai' | 'groq' | 'custom';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(() => (localStorage.getItem('current_view') as View) || 'welcome');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => localStorage.getItem('is_admin_logged_in') === 'true');
  
  // AI Provider State
  const [aiProvider, setAiProvider] = useState<AiProvider>(() => (localStorage.getItem('ai_provider') as AiProvider) || 'gemini');
  const [geminiApiKey, setGeminiApiKey] = useState<string>(() => localStorage.getItem('gemini_api_key') || '');
  const [openAiApiKey, setOpenAiApiKey] = useState<string>(() => localStorage.getItem('openai_api_key') || '');
  const [groqApiKey, setGroqApiKey] = useState<string>(() => localStorage.getItem('groq_api_key') || '');
  const [customApiBaseUrl, setCustomApiBaseUrl] = useState<string>(() => localStorage.getItem('custom_api_base_url') || '');
  const [customApiModel, setCustomApiModel] = useState<string>(() => localStorage.getItem('custom_api_model') || '');
  const [customApiKey, setCustomApiKey] = useState<string>(() => localStorage.getItem('custom_api_key') || '');


  useEffect(() => {
    initializeUsers(); // Ensure default users exist in local storage
    const loggedInUserId = localStorage.getItem('logged_in_user_id');
    if (loggedInUserId) {
      const user = getUser(loggedInUserId);
      if (user) {
        setCurrentUser(user);
        if(!currentView || currentView === 'welcome' || currentView === 'login') {
          navigateToDashboard();
        }
      } else {
        // User in local storage doesn't exist anymore, clear it
        handleLogout();
      }
    } else if (isAdminLoggedIn && currentView !== 'admin') {
      navigateToAdmin();
    }
  }, []);

  useEffect(() => {
    let activeProviderKey = '';
    let activeBaseUrl: string | undefined = undefined;
    let activeModel: string | undefined = undefined;

    switch (aiProvider) {
        case 'gemini':
            activeProviderKey = geminiApiKey;
            break;
        case 'openai':
            activeProviderKey = openAiApiKey;
            break;
        case 'groq':
            activeProviderKey = groqApiKey;
            break;
        case 'custom':
            activeProviderKey = customApiKey;
            activeBaseUrl = customApiBaseUrl;
            activeModel = customApiModel;
            break;
    }
    
    if (activeProviderKey) {
        initializeAi(aiProvider, activeProviderKey, activeBaseUrl, activeModel);
    } 
    else if (geminiApiKey) {
        initializeAi('gemini', geminiApiKey);
        if (aiProvider !== 'gemini') {
            setAiProvider('gemini');
            localStorage.setItem('ai_provider', 'gemini');
        }
    } 
    else {
        initializeAi('gemini', '');
    }
  }, [aiProvider, geminiApiKey, openAiApiKey, groqApiKey, customApiKey, customApiBaseUrl, customApiModel]);

  const handleAiSettingsSave = (provider: AiProvider, geminiKey: string, openAiKey: string, groqKey: string, customKey: string, customBaseUrl: string, customModel: string) => {
    localStorage.setItem('ai_provider', provider);
    setAiProvider(provider);
    
    localStorage.setItem('gemini_api_key', geminiKey);
    setGeminiApiKey(geminiKey);

    localStorage.setItem('openai_api_key', openAiKey);
    setOpenAiApiKey(openAiKey);

    localStorage.setItem('groq_api_key', groqKey);
    setGroqApiKey(groqKey);

    localStorage.setItem('custom_api_key', customKey);
    setCustomApiKey(customKey);

    localStorage.setItem('custom_api_base_url', customBaseUrl);
    setCustomApiBaseUrl(customBaseUrl);
    
    localStorage.setItem('custom_api_model', customModel);
    setCustomApiModel(customModel);
  };

  const loginUser = (user: User) => {
      setCurrentUser(user);
      localStorage.setItem('logged_in_user_id', user.id);
      navigateToDashboard();
  };
  
  const handleGuestLogin = () => {
    const guestUser = getUser('guest_user');
    if (guestUser) {
        loginUser(guestUser);
    }
  };

  const handleUserAuth = (email: string, pass: string): User | null => {
    const user = authenticateUser(email, pass);
    if(user) {
      loginUser(user);
      return user;
    }
    return null;
  };
  
  const handleUserRegister = (name: string, email: string, pass: string): { success: boolean, message: string } => {
    const result = registerUser(name, email, pass);
    if (result.success && result.user) {
      loginUser(result.user);
    }
    return { success: result.success, message: result.message };
  };

  const handleAdminLogin = (email: string, pass: string): boolean => {
    // Hardcoded credentials for demonstration
    if (email === 'admin@physcio.com' && pass === 'password123') {
      setIsAdminLoggedIn(true);
      localStorage.setItem('is_admin_logged_in', 'true');
      navigateToAdmin();
      return true;
    }
    return false;
  };


  const handleLogout = () => {
    setCurrentUser(null);
    setIsAdminLoggedIn(false);
    localStorage.removeItem('logged_in_user_id');
    localStorage.removeItem('is_admin_logged_in');
    localStorage.setItem('current_view', 'welcome');
    navigateToWelcome();
  };

  const handleUpdateUser = (updatedUser: User) => {
    updateUser(updatedUser);
    setCurrentUser(updatedUser); // Update state to trigger re-render
  };

  const navigateToLogin = () => setCurrentView('login');
  const navigateToDashboard = () => {
    setCurrentView('dashboard');
    localStorage.setItem('current_view', 'dashboard');
  };
  const navigateToAdmin = () => {
    setCurrentView('admin');
    localStorage.setItem('current_view', 'admin');
  };
  const navigateToWelcome = () => setCurrentView('welcome');

  const renderView = () => {
    switch (currentView) {
      case 'welcome':
        return <WelcomePage onNavigateToLogin={navigateToLogin} />;
      case 'login':
        return <LoginPage 
                  onUserAuth={handleUserAuth}
                  onUserRegister={handleUserRegister} 
                  onGuestLogin={handleGuestLogin}
                  onAdminLogin={handleAdminLogin} 
                />;
      case 'admin':
         if (!isAdminLoggedIn) {
            return <LoginPage 
                      onUserAuth={handleUserAuth}
                      onUserRegister={handleUserRegister} 
                      onGuestLogin={handleGuestLogin}
                      onAdminLogin={handleAdminLogin} 
                    />;
        }
        return <AdminPanel onLogout={handleLogout} />;
      case 'dashboard':
        if (!currentUser) {
            return <LoginPage 
                      onUserAuth={handleUserAuth}
                      onUserRegister={handleUserRegister} 
                      onGuestLogin={handleGuestLogin}
                      onAdminLogin={handleAdminLogin} 
                    />;
        }
        return <Dashboard 
                  user={currentUser}
                  onUpdateUser={handleUpdateUser}
                  onLogout={handleLogout}
                  aiProvider={aiProvider}
                  geminiApiKey={geminiApiKey}
                  openAiApiKey={openAiApiKey}
                  groqApiKey={groqApiKey}
                  customApiKey={customApiKey}
                  customApiBaseUrl={customApiBaseUrl}
                  customApiModel={customApiModel}
                  onAiSettingsSave={handleAiSettingsSave} 
                />;
      default:
        return <WelcomePage onNavigateToLogin={navigateToLogin} />;
    }
  };

  return <div className="min-h-screen bg-[#f4f7f6] text-[#37474f] font-sans">{renderView()}</div>;
};

export default App;