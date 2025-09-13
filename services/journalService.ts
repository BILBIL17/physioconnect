import type { Journal } from '../types';

const DB_KEY = 'physcio_app_data';

const initialJournalData: Omit<Journal, 'id'>[] = [
    { title: 'Journal of Orthopaedic & Sports Physical Therapy (JOSPT)', publisher: 'JOSPT', year: 1979, link: 'https://www.jospt.org/' },
    { title: 'Physical Therapy Journal (PTJ)', publisher: 'Oxford University Press', year: 1921, link: 'https://academic.oup.com/ptj' },
    { title: 'PubMed', publisher: 'National Library of Medicine (NLM)', year: 1996, link: 'https://pubmed.ncbi.nlm.nih.gov/' },
    { title: 'The Lancet', publisher: 'Elsevier', year: 1823, link: 'https://www.thelancet.com/' },
    { title: 'ResearchGate', publisher: 'ResearchGate GmbH', year: 2008, link: 'https://www.researchgate.net/' },
    { title: 'British Journal of Sports Medicine (BJSM)', publisher: 'BMJ', year: 1964, link: 'https://bjsm.bmj.com/' },
    { title: 'Archives of Physical Medicine and Rehabilitation', publisher: 'Elsevier', year: 1920, link: 'https://www.archives-pmr.org/' },
];

const getDb = (): { users: any[], announcements?: any[], journals?: Journal[] } => {
    try {
        const data = localStorage.getItem(DB_KEY);
        const parsed = data ? JSON.parse(data) : { users: [], announcements: [], journals: [] };
        
        if (!parsed.journals) {
            parsed.journals = initialJournalData.map((j, index) => ({ ...j, id: `journal_${index + 1}` }));
        }
        
        return parsed;
    } catch (error) {
        console.error("Failed to parse data from localStorage", error);
        return { users: [], announcements: [], journals: [] };
    }
};

const saveDb = (db: { users: any[], announcements?: any[], journals?: Journal[] }) => {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
};

// Initialize DB with journals if they don't exist
const db = getDb();
saveDb(db);


export const getJournals = (): Journal[] => {
    const db = getDb();
    return (db.journals || []).sort((a, b) => a.title.localeCompare(b.title));
};

export const addJournal = (journal: Omit<Journal, 'id'>): void => {
    const db = getDb();
    const newJournal: Journal = {
        ...journal,
        id: `journal_${Date.now()}`,
    };
    db.journals = [newJournal, ...(db.journals || [])];
    saveDb(db);
};

export const deleteJournal = (journalId: string): void => {
    const db = getDb();
    db.journals = (db.journals || []).filter(j => j.id !== journalId);
    saveDb(db);
};