import React, { useState, useEffect } from 'react';
import { getUsers } from '../../services/userService';
import type { User } from '../../types';

const AdminDashboard: React.FC = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        premiumUsers: 0,
    });

    useEffect(() => {
        const allUsers = getUsers();
        const premiumCount = allUsers.filter(u => u.isPremium).length;
        setStats({
            totalUsers: allUsers.length,
            premiumUsers: premiumCount,
        });
    }, []);

    const premiumPercentage = stats.totalUsers > 0 
        ? ((stats.premiumUsers / stats.totalUsers) * 100).toFixed(1) 
        : 0;
        
    const StatCard = ({ icon, title, value, color }: {icon: string, title: string, value: string | number, color: string}) => (
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mr-4 ${color}`}>
                <i className={`fas ${icon} text-2xl text-white`}></i>
            </div>
            <div>
                <p className="text-3xl font-bold text-gray-800">{value}</p>
                <p className="text-gray-500">{title}</p>
            </div>
        </div>
    );

    return (
        <div className="animate-fade-in">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Overview</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <StatCard icon="fa-users" title="Total Users" value={stats.totalUsers} color="bg-blue-500" />
                 <StatCard icon="fa-star" title="Premium Users" value={stats.premiumUsers} color="bg-yellow-500" />
                 <StatCard icon="fa-percentage" title="Premium Conversion" value={`${premiumPercentage}%`} color="bg-green-500" />
            </div>

            <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-4">Welcome, Admin!</h3>
                <p className="text-gray-600">
                    This is your control center for the Physcio Connect application. From here, you can manage users,
                    post announcements, and monitor the application's health. Use the navigation on the left to
                    access different sections.
                </p>
            </div>
        </div>
    );
};

export default AdminDashboard;
