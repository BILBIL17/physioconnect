import React, { useState, useEffect } from 'react';
import { getJournals, addJournal, deleteJournal } from '../../services/journalService';
import type { Journal } from '../../types';

const AdminJournals: React.FC = () => {
    const [journals, setJournals] = useState<Journal[]>([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    
    const [title, setTitle] = useState('');
    const [publisher, setPublisher] = useState('');
    const [year, setYear] = useState<number>(new Date().getFullYear());
    const [link, setLink] = useState('');

    useEffect(() => {
        loadJournals();
    }, []);

    const loadJournals = () => {
        setJournals(getJournals());
    };
    
    const resetForm = () => {
        setTitle('');
        setPublisher('');
        setYear(new Date().getFullYear());
        setLink('');
    };

    const handleOpenForm = () => {
        resetForm();
        setIsFormOpen(true);
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !publisher.trim() || !link.trim()) {
            alert('All fields are required.');
            return;
        }

        addJournal({ title, publisher, year, link });
        
        loadJournals();
        handleCloseForm();
    };
    
    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this journal link?')) {
            deleteJournal(id);
            loadJournals();
        }
    };

    return (
        <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800">Journal Links</h2>
                <button 
                    onClick={handleOpenForm}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105"
                >
                    <i className="fas fa-plus mr-2"></i> Add Journal
                </button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="space-y-4">
                    {journals.length > 0 ? journals.map(journal => (
                        <div key={journal.id} className="p-4 border rounded-lg flex justify-between items-center">
                           <div className="flex-grow">
                                <a href={journal.link} target="_blank" rel="noopener noreferrer" className="font-bold text-lg text-indigo-600 hover:underline">{journal.title}</a>
                                <p className="text-gray-600 mt-1">{journal.publisher} - {journal.year}</p>
                           </div>
                            <div className="flex-shrink-0 ml-4">
                                <button onClick={() => handleDelete(journal.id)} className="text-red-500 hover:text-red-700"><i className="fas fa-trash"></i></button>
                            </div>
                        </div>
                    )) : (
                        <p className="text-center text-gray-500 py-4">No journals found. Click "Add Journal" to create one.</p>
                    )}
                </div>
            </div>
            
            {isFormOpen && (
                 <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={handleCloseForm}>
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 animate-modal-pop" onClick={e => e.stopPropagation()}>
                        <h3 className="text-2xl font-bold mb-4">Add New Journal</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Title</label>
                                <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                            </div>
                             <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Publisher</label>
                                    <input type="text" value={publisher} onChange={e => setPublisher(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Year</label>
                                    <input type="number" value={year} onChange={e => setYear(Number(e.target.value))} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
                                </div>
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-700">Link (URL)</label>
                                <input type="url" value={link} onChange={e => setLink(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <button type="button" onClick={handleCloseForm} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">Cancel</button>
                                <button type="submit" className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700">Add Journal</button>
                            </div>
                        </form>
                    </div>
                 </div>
            )}
        </div>
    );
};

export default AdminJournals;