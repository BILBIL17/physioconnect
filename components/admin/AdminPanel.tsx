import React, { useState } from 'react';
import AdminDashboard from './AdminDashboard';
import AdminUsers from './AdminUsers';
import AdminContent from './AdminContent';
import AdminJournals from './AdminJournals';

interface AdminPanelProps {
    onLogout: () => void;
}

type AdminTab = 'dashboard' | 'users' | 'content' | 'journals';

const AdminPanel: React.FC<AdminPanelProps> = ({ onLogout }) => {
    const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');

    const renderActiveTab = () => {
        switch (activeTab) {
            case 'dashboard':
                return <AdminDashboard />;
            case 'users':
                return <AdminUsers />;
            case 'content':
                return <AdminContent />;
            case 'journals':
                return <AdminJournals />;
            default:
                return <AdminDashboard />;
        }
    };
    
    const NavLink = ({ tab, icon, label }: {tab: AdminTab, icon: string, label: string}) => (
        <button 
            onClick={() => setActiveTab(tab)}
            className={`flex items-center w-full px-4 py-3 text-left rounded-lg transition-colors ${
                activeTab === tab ? 'bg-indigo-700 text-white' : 'text-indigo-100 hover:bg-indigo-700'
            }`}
        >
            <i className={`fas ${icon} w-6 text-center mr-3`}></i>
            <span className="font-medium">{label}</span>
        </button>
    )

    return (
        <div className="flex h-screen bg-gray-100 font-sans">
            <aside className="w-64 bg-indigo-800 text-white flex flex-col">
                <div className="p-6 text-2xl font-bold border-b border-indigo-900">
                    Physcio Admin
                </div>
                <nav className="flex-grow p-4 space-y-2">
                   <NavLink tab="dashboard" icon="fa-chart-pie" label="Dashboard" />
                   <NavLink tab="users" icon="fa-users" label="Users" />
                   <NavLink tab="content" icon="fa-bullhorn" label="Announcements" />
                   <NavLink tab="journals" icon="fa-book-open" label="Journals" />
                </nav>
                 <div className="p-4 border-t border-indigo-900">
                    <button 
                        onClick={onLogout}
                        className="flex items-center w-full px-4 py-3 text-left rounded-lg transition-colors text-indigo-100 hover:bg-indigo-700"
                    >
                         <i className="fas fa-sign-out-alt w-6 text-center mr-3"></i>
                         <span className="font-medium">Logout</span>
                    </button>
                 </div>
            </aside>
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-white shadow-md p-4">
                     <h1 className="text-2xl font-bold text-gray-800 capitalize">{activeTab}</h1>
                </header>
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
                    {renderActiveTab()}
                </main>
            </div>
        </div>
    );
};

export default AdminPanel;