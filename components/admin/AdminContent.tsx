import React, { useState, useEffect } from 'react';
import { getAnnouncements, addAnnouncement, updateAnnouncement, deleteAnnouncement } from '../../services/contentService';
import type { Announcement } from '../../types';

const AdminContent: React.FC = () => {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    useEffect(() => {
        loadAnnouncements();
    }, []);

    const loadAnnouncements = () => {
        setAnnouncements(getAnnouncements());
    };

    const handleOpenForm = (announcement: Announcement | null = null) => {
        if (announcement) {
            setEditingAnnouncement(announcement);
            setTitle(announcement.title);
            setContent(announcement.content);
        } else {
            setEditingAnnouncement(null);
            setTitle('');
            setContent('');
        }
        setIsFormOpen(true);
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setEditingAnnouncement(null);
        setTitle('');
        setContent('');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) {
            alert('Title and content cannot be empty.');
            return;
        }

        if (editingAnnouncement) {
            updateAnnouncement({ ...editingAnnouncement, title, content });
        } else {
            addAnnouncement({ title, content });
        }
        
        loadAnnouncements();
        handleCloseForm();
    };
    
    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this announcement?')) {
            deleteAnnouncement(id);
            loadAnnouncements();
        }
    };

    return (
        <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800">Announcements</h2>
                <button 
                    onClick={() => handleOpenForm()}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105"
                >
                    <i className="fas fa-plus mr-2"></i> New Announcement
                </button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <ul className="space-y-4">
                    {announcements.length > 0 ? announcements.map(ann => (
                        <li key={ann.id} className="p-4 border rounded-lg flex justify-between items-start">
                           <div>
                                <h3 className="font-bold text-lg text-gray-800">{ann.title}</h3>
                                <p className="text-gray-600 mt-1">{ann.content}</p>
                                <p className="text-xs text-gray-400 mt-2">Posted: {new Date(ann.createdAt).toLocaleDateString()}</p>
                           </div>
                            <div className="flex gap-2 flex-shrink-0 ml-4">
                                <button onClick={() => handleOpenForm(ann)} className="text-blue-500 hover:text-blue-700"><i className="fas fa-edit"></i></button>
                                <button onClick={() => handleDelete(ann.id)} className="text-red-500 hover:text-red-700"><i className="fas fa-trash"></i></button>
                            </div>
                        </li>
                    )) : (
                        <p className="text-center text-gray-500 py-4">No announcements yet. Click "New Announcement" to create one.</p>
                    )}
                </ul>
            </div>
            
            {isFormOpen && (
                 <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={handleCloseForm}>
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 animate-modal-pop" onClick={e => e.stopPropagation()}>
                        <h3 className="text-2xl font-bold mb-4">{editingAnnouncement ? 'Edit' : 'New'} Announcement</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Title</label>
                                <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-700">Content</label>
                                <textarea value={content} onChange={e => setContent(e.target.value)} rows={4} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"></textarea>
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <button type="button" onClick={handleCloseForm} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">Cancel</button>
                                <button type="submit" className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700">Save</button>
                            </div>
                        </form>
                    </div>
                 </div>
            )}
        </div>
    );
};

export default AdminContent;
