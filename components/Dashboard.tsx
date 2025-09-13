import React, { useState, useEffect, useRef } from 'react';
import Home from './features/Home';
import ExerciseFit from './features/ExerciseFit';
import NearTherapy from './features/NearTherapy';
import PostureIQ from './features/PostureIQ';
import TelePhysio from './features/TelePhysio';
import JournalLink from './features/JournalLink';
import NavItem from './shared/NavItem';
import ProfileModal from './shared/ProfileModal';
import PremiumModal from './shared/PremiumModal';
import type { AiProvider } from '../../App';
import type { ExercisePlan, User, PlanHistoryItem } from '../../types';

type Tab = 'home' | 'exercise' | 'posture' | 'therapy' | 'journal' | 'tele';

interface DashboardProps {
    user: User;
    onUpdateUser: (user: User) => void;
    onLogout: () => void;
    aiProvider: AiProvider;
    geminiApiKey: string;
    openAiApiKey: string;
    groqApiKey: string;
    customApiKey: string;
    customApiBaseUrl: string;
    customApiModel: string;
    onAiSettingsSave: (
        provider: AiProvider, 
        geminiKey: string, 
        openAiKey: string, 
        groqKey: string, 
        customKey: string, 
        customBaseUrl: string, 
        customModel: string
    ) => void;
}

const TABS: { [key in Tab]: { title: string; component: React.FC<any>; icon: string; isPremium?: boolean } } = {
    home: { title: "Dashboard", component: Home, icon: "fa-home" },
    exercise: { title: "Exercise Fit", component: ExerciseFit, icon: "fa-dumbbell" },
    posture: { title: "Posture IQ", component: PostureIQ, icon: "fa-user-check", isPremium: true },
    therapy: { title: "Near Therapy", component: NearTherapy, icon: "fa-map-location-dot" },
    journal: { title: "Journal Link", component: JournalLink, icon: "fa-book-open" },
    tele: { title: "TelePhysio", component: TelePhysio, icon: "fa-video", isPremium: true },
};

const NAV_ITEMS: Tab[] = ['home', 'exercise', 'posture', 'therapy'];

const Dashboard: React.FC<DashboardProps> = ({ 
    user,
    onUpdateUser,
    onLogout,
    aiProvider, 
    geminiApiKey, 
    openAiApiKey, 
    groqApiKey,
    customApiKey,
    customApiBaseUrl,
    customApiModel, 
    onAiSettingsSave 
}) => {
    const [activeTab, setActiveTab] = useState<Tab>('home');
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
    const [showScrollTopButton, setShowScrollTopButton] = useState(false);
    const mainContentRef = useRef<HTMLElement>(null);
    
    const activePlan = user.activePlan;
    const progressData = user.progressData;

    useEffect(() => {
        const mainEl = mainContentRef.current;
        if (!mainEl) return;

        const handleScroll = () => {
            if (mainEl.scrollTop > 300) {
                setShowScrollTopButton(true);
            } else {
                setShowScrollTopButton(false);
            }
        };

        mainEl.addEventListener('scroll', handleScroll);
        
        return () => {
            mainEl.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const scrollToTop = () => {
        mainContentRef.current?.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    const updateProgress = () => {
        if (!progressData || !activePlan) return;

        const totalSessions = progressData.totalWeeks * progressData.sessionsPerWeek;
        
        if (progressData.completedSessions >= totalSessions) {
            alert("This program is already complete!");
            return;
        }

        const newCompletedSessions = progressData.completedSessions + 1;

        // Check if this session completes the plan
        if (newCompletedSessions >= totalSessions) {
            const historyItem: PlanHistoryItem = {
                planTitle: activePlan.planTitle,
                durationWeeks: activePlan.durationWeeks,
                completedDate: new Date().toISOString(),
                status: 'Completed',
            };
            const updatedHistory = [...(user.planHistory || []), historyItem];
            onUpdateUser({ ...user, activePlan: null, progressData: null, planHistory: updatedHistory });
            alert("Congratulations! You've completed your exercise program.");
            return;
        }
        
        // Standard progress update
        const newProgressPercent = Math.round((newCompletedSessions / totalSessions) * 100);
        
        const newWeeklyCompletions = [...progressData.weeklyCompletions];
        const weekIndexToUpdate = Math.floor(progressData.completedSessions / progressData.sessionsPerWeek);

        if (weekIndexToUpdate < newWeeklyCompletions.length) {
            const sessionsInPreviousWeeks = weekIndexToUpdate * progressData.sessionsPerWeek;
            const sessionsCompletedInCurrentWeek = progressData.completedSessions - sessionsInPreviousWeeks;
            newWeeklyCompletions[weekIndexToUpdate] = sessionsCompletedInCurrentWeek + 1;
        }
        
        const newCurrentWeek = Math.min(progressData.totalWeeks, Math.floor(newCompletedSessions / progressData.sessionsPerWeek) + 1);
        
        const newProgress = {
            ...progressData,
            completedSessions: newCompletedSessions,
            currentWeek: newCurrentWeek,
            progressPercent: newProgressPercent,
            weeklyCompletions: newWeeklyCompletions,
        };

        onUpdateUser({ ...user, progressData: newProgress });
    };
    
    const handleAcceptPlan = (plan: ExercisePlan) => {
        let updatedHistory = user.planHistory || [];

        // If there's an active plan, move it to history as 'Replaced'
        if (user.activePlan) {
            const historyItem: PlanHistoryItem = {
                planTitle: user.activePlan.planTitle,
                durationWeeks: user.activePlan.durationWeeks,
                completedDate: new Date().toISOString(),
                status: 'Replaced',
            };
            updatedHistory = [...updatedHistory, historyItem];
        }
        
        const newProgress = {
            progressPercent: 0,
            currentWeek: 1,
            completedSessions: 0,
            totalWeeks: plan.durationWeeks,
            sessionsPerWeek: 3, // Default sessions per week
            weeklyCompletions: Array(plan.durationWeeks).fill(0),
        };
        
        onUpdateUser({ ...user, activePlan: plan, progressData: newProgress, planHistory: updatedHistory });
        alert("Program added to your dashboard!");
        setActiveTab('home');
    };

    const handleHomeNavigation = (tab: Tab) => {
        const isPremiumFeature = TABS[tab].isPremium;
        if (isPremiumFeature && !user.isPremium) {
            setIsPremiumModalOpen(true);
        } else {
            setActiveTab(tab);
        }
    };

    const handleNavClick = (tabKey: Tab) => {
        const isPremiumFeature = TABS[tabKey].isPremium;
        if (isPremiumFeature && !user.isPremium) {
            setIsPremiumModalOpen(true);
        } else {
            setActiveTab(tabKey);
        }
    };

    const ActiveComponent = TABS[activeTab].component;
    const componentProps = {
        home: { 
            progressData: progressData, 
            onUpdateProgress: updateProgress,
            onNavigate: handleHomeNavigation,
            activePlan: activePlan,
            user: user,
            onUpdateUser: onUpdateUser,
        },
        exercise: { onAcceptPlan: handleAcceptPlan },
        posture: {},
        therapy: {},
        journal: {},
        tele: {},
    }[activeTab];


    return (
        <div className="flex flex-col min-h-screen bg-[#f4f7f6]">
            <header className="bg-white shadow-sm p-4 sticky top-0 z-10">
                <h1 className="text-2xl font-bold text-center text-[#37474f]">{TABS[activeTab].title}</h1>
            </header>

            <main ref={mainContentRef} className="flex-grow p-4 md:p-6 pb-24 overflow-y-auto">
                <div className="bg-white p-4 md:p-6 rounded-2xl shadow-lg">
                    <ActiveComponent {...componentProps} />
                </div>
            </main>
            
            {showScrollTopButton && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-24 left-6 bg-[#00838f] text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:bg-teal-800 transition-all duration-300 ease-in-out transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-[#00838f]/50 z-10 animate-fade-in-fast"
                    aria-label="Scroll to top"
                >
                    <i className="fas fa-arrow-up text-xl"></i>
                </button>
            )}

            <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.05)] flex justify-around items-center h-20 z-20">
                {NAV_ITEMS.map(tabKey => (
                     <NavItem 
                        key={tabKey}
                        label={TABS[tabKey].title}
                        icon={TABS[tabKey].icon}
                        isActive={activeTab === tabKey}
                        onClick={() => handleNavClick(tabKey)}
                     />
                ))}
                <NavItem 
                    label="Profile"
                    icon="fa-user-cog"
                    isActive={isProfileModalOpen}
                    onClick={() => setIsProfileModalOpen(true)}
                />
            </nav>

            <ProfileModal
                isOpen={isProfileModalOpen}
                onClose={() => setIsProfileModalOpen(false)}
                onLogout={onLogout}
                user={user}
                onUpdateUser={onUpdateUser}
                aiProvider={aiProvider}
                geminiApiKey={geminiApiKey}
                openAiApiKey={openAiApiKey}
                groqApiKey={groqApiKey}
                customApiKey={customApiKey}
                customApiBaseUrl={customApiBaseUrl}
                customApiModel={customApiModel}
                onAiSettingsSave={onAiSettingsSave}
            />
            <PremiumModal 
                isOpen={isPremiumModalOpen}
                onClose={() => setIsPremiumModalOpen(false)}
            />
        </div>
    );
};

export default Dashboard;