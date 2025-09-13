import type { Announcement } from '../types';

const DB_KEY = 'physcio_app_data';

const getDb = (): { users: any[], announcements?: Announcement[] } => {
    try {
        const data = localStorage.getItem(DB_KEY);
        const parsed = data ? JSON.parse(data) : { users: [], announcements: [] };
        if (!parsed.announcements) {
            parsed.announcements = [];
        }
        return parsed;
    } catch (error) {
        console.error("Failed to parse data from localStorage", error);
        return { users: [], announcements: [] };
    }
};

const saveDb = (db: { users: any[], announcements?: Announcement[] }) => {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
};

export const getAnnouncements = (): Announcement[] => {
    const db = getDb();
    // Sort by most recent first
    return (db.announcements || []).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

export const addAnnouncement = (announcement: Omit<Announcement, 'id' | 'createdAt'>): void => {
    const db = getDb();
    const newAnnouncement: Announcement = {
        ...announcement,
        id: `ann_${Date.now()}`,
        createdAt: new Date().toISOString(),
    };
    db.announcements = [newAnnouncement, ...(db.announcements || [])];
    saveDb(db);
};

export const updateAnnouncement = (updatedAnnouncement: Announcement): void => {
    const db = getDb();
    const index = (db.announcements || []).findIndex(a => a.id === updatedAnnouncement.id);
    if (index > -1) {
        db.announcements[index] = updatedAnnouncement;
        saveDb(db);
    }
};

export const deleteAnnouncement = (announcementId: string): void => {
    const db = getDb();
    db.announcements = (db.announcements || []).filter(a => a.id !== announcementId);
    saveDb(db);
};
