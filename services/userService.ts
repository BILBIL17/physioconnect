import type { User, ExercisePlan, ProgramProgress, AdminMessage } from '../types';

const DB_KEY = 'physcio_app_data';

// Default state for a new user
const createDefaultUser = (id: string, name: string, email: string): User => ({
    id,
    name,
    email,
    age: '30',
    weight: '70',
    height: '175',
    isPremium: false,
    activePlan: null,
    progressData: null,
    messagesFromAdmin: [],
    planHistory: [],
});

const getDb = (): { users: User[] } => {
    try {
        const data = localStorage.getItem(DB_KEY);
        const parsed = data ? JSON.parse(data) : { users: [] };
        // Ensure users is always an array
        if (!Array.isArray(parsed.users)) {
            return { users: [] };
        }
        return parsed;
    } catch (error) {
        console.error("Failed to parse user data from localStorage", error);
        return { users: [] };
    }
};

const saveDb = (db: { users: User[] }) => {
    // Reading the full DB again to avoid overwriting other keys like announcements
    // Fix: Corrected typo in variable name from DB_key to DB_KEY.
    const fullDb = JSON.parse(localStorage.getItem(DB_KEY) || '{}');
    fullDb.users = db.users;
    localStorage.setItem(DB_KEY, JSON.stringify(fullDb));
};

export const initializeUsers = () => {
    const db = getDb();
    const guestUserExists = db.users.some(u => u.id === 'guest_user');

    if (!guestUserExists) {
        const guestUser = createDefaultUser('guest_user', 'Guest User', 'guest@physcio.com');
        db.users.push(guestUser);
        saveDb(db);
    }
};

export const getUsers = (): User[] => {
    return getDb().users;
};

export const getUser = (userId: string): User | undefined => {
    const db = getDb();
    const user = db.users.find(u => u.id === userId);
    // Ensure all fields are present to avoid errors with older data structures
    if (user) {
        return {
            ...createDefaultUser(user.id, user.name, user.email),
            ...user
        };
    }
    return undefined;
};

export const updateUser = (updatedUser: User): void => {
    const db = getDb();
    const userIndex = db.users.findIndex(u => u.id === updatedUser.id);
    if (userIndex > -1) {
        db.users[userIndex] = updatedUser;
        saveDb(db);
    } else {
        console.error("User not found for update:", updatedUser.id);
    }
};

export const registerUser = (name: string, email: string, password: string): { success: boolean; message: string; user?: User } => {
    const db = getDb();
    const normalizedEmail = email.toLowerCase();
    
    if (db.users.some(u => u.email.toLowerCase() === normalizedEmail)) {
        return { success: false, message: 'An account with this email already exists.' };
    }

    // In a real app, hash the password here. For this demo, we ignore it.
    const newUserId = `user_${Date.now()}`;
    const newUser = createDefaultUser(newUserId, name, email);

    db.users.push(newUser);
    saveDb(db);

    return { success: true, message: 'Registration successful!', user: newUser };
};

export const authenticateUser = (email: string, password: string): User | null => {
    const db = getDb();
    const normalizedEmail = email.toLowerCase();
    
    // In a real app, you would find the user by email, then verify the hashed password.
    // For this demo, we'll just find the user by email and assume the password is correct.
    const user = db.users.find(u => u.email.toLowerCase() === normalizedEmail);
    
    if (user) {
         return getUser(user.id)!; // Use getUser to get the fully structured user object
    }

    return null;
};