import React, { useState, useEffect, useMemo } from 'react';
import { getUsers, updateUser } from '../../services/userService';
import type { User } from '../../types';

const AdminUsers: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [messageText, setMessageText] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const refreshData = () => {
        const allUsers = getUsers();
        setUsers(allUsers);
        if (selectedUser) {
            setSelectedUser(allUsers.find(u => u.id === selectedUser.id) || null);
        }
    };

    useEffect(() => {
        const allUsers = getUsers();
        setUsers(allUsers);
        if (allUsers.length > 0) {
            setSelectedUser(allUsers[0]);
        }
    }, []);

    const filteredUsers = useMemo(() => {
        return users.filter(user =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [users, searchTerm]);
    
    const handleUserSelect = (user: User) => {
        setSelectedUser(user);
        setMessageText('');
    };

    const handleTogglePremium = () => {
        if (!selectedUser) return;
        const updatedUser = { ...selectedUser, isPremium: !selectedUser.isPremium };
        updateUser(updatedUser);
        refreshData();
    };

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedUser || !messageText.trim()) return;
        
        const newMessage = {
            id: `msg_${Date.now()}`,
            text: messageText,
            timestamp: new Date().toISOString(),
            read: false,
        };
        
        const updatedUser = {
            ...selectedUser,
            messagesFromAdmin: [...selectedUser.messagesFromAdmin, newMessage],
        };
        
        updateUser(updatedUser);
        refreshData();
        setMessageText('');
    };

    const renderUserDetails = () => {
        if (!selectedUser) {
            return <div className="flex items-center justify-center h-full text-gray-500 bg-white rounded-lg shadow-md">Select a user to view details</div>;
        }

        return (
            <div className="bg-white p-6 rounded-lg shadow-md space-y-6 animate-fade-in-fast">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-2xl font-bold text-gray-800">{selectedUser.name}</h3>
                        <p className="text-sm text-gray-500">{selectedUser.email}</p>
                    </div>
                    <span className={`px-3 py-1 text-sm font-semibold rounded-full ${selectedUser.isPremium ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                        {selectedUser.isPremium ? 'Premium' : 'Standard'}
                    </span>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-bold mb-2 text-gray-700">User Stats</h4>
                    <div className="grid grid-cols-3 gap-2 text-center text-sm">
                        <div><span className="block font-semibold text-gray-800">{selectedUser.age}</span><span className="text-gray-500">Age</span></div>
                        <div><span className="block font-semibold text-gray-800">{selectedUser.weight}kg</span><span className="text-gray-500">Weight</span></div>
                        <div><span className="block font-semibold text-gray-800">{selectedUser.height}cm</span><span className="text-gray-500">Height</span></div>
                    </div>
                </div>

                <div>
                    <h4 className="font-bold mb-2 text-gray-700">Actions</h4>
                    <button onClick={handleTogglePremium} className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                        {selectedUser.isPremium ? 'Revoke Premium' : 'Grant Premium'}
                    </button>
                </div>

                <div>
                    <h4 className="font-bold mb-2 text-gray-700">Send Message</h4>
                    <form onSubmit={handleSendMessage} className="flex gap-2">
                        <input 
                            type="text"
                            value={messageText}
                            onChange={(e) => setMessageText(e.target.value)}
                            placeholder="Type a message..."
                            className="flex-grow px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg">Send</button>
                    </form>
                </div>

                <div>
                    <h4 className="font-bold mb-2 text-gray-700">Active Exercise Plan</h4>
                    {selectedUser.activePlan ? (
                        <div className="text-sm p-4 bg-gray-50 rounded-lg">
                            <p className="font-semibold text-gray-800">{selectedUser.activePlan.planTitle}</p>
                            <p className="text-gray-600">Progress: {selectedUser.progressData?.progressPercent || 0}% complete</p>
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500 p-4 bg-gray-50 rounded-lg">No active plan.</p>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="flex h-[calc(100vh-80px)]">
            <aside className="w-1/3 bg-white rounded-lg shadow-md flex flex-col">
                <div className="p-4 border-b">
                    <h2 className="text-lg font-bold text-gray-800">Users ({users.length})</h2>
                     <input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full mt-2 px-3 py-2 border rounded-lg"
                    />
                </div>
                <ul className="overflow-y-auto">
                    {filteredUsers.map(user => (
                        <li key={user.id}>
                            <button 
                                onClick={() => handleUserSelect(user)}
                                className={`w-full text-left p-4 border-b hover:bg-indigo-50 transition-colors ${selectedUser?.id === user.id ? 'bg-indigo-100' : ''}`}
                            >
                                <p className="font-semibold text-gray-800">{user.name}</p>
                                <p className="text-sm text-gray-500">{user.email}</p>
                            </button>
                        </li>
                    ))}
                </ul>
            </aside>
            <main className="w-2/3 ml-6">
                {renderUserDetails()}
            </main>
        </div>
    );
};

export default AdminUsers;
