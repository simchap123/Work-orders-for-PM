import React from 'react';
import { User, View } from '../../lib/types';
import { CREATION_ROLES } from '../../lib/constants';
import { HomeIcon, PlusIcon, SettingsIcon } from '../../icons';

const BottomNav: React.FC<{ currentUser: User, currentView: View; onViewChange: (view: View) => void; }> = ({ currentUser, currentView, onViewChange }) => {
    const canCreate = CREATION_ROLES.includes(currentUser.role);
    
    return (
    <footer className="fixed bottom-0 left-0 right-0 z-10 h-20 bg-background/80 dark:bg-background-dark/80 backdrop-blur-md border-t border-border dark:border-border-dark">
        <nav className="flex justify-around items-center h-full max-w-md mx-auto">
            <button onClick={() => onViewChange('DASHBOARD')} className={`flex flex-col items-center justify-center w-full transition-colors duration-200 ${currentView === 'DASHBOARD' ? 'text-primary dark:text-primary-dark' : 'text-text-secondary dark:text-text-secondary-dark hover:text-primary dark:hover:text-primary-dark'}`}>
                <HomeIcon />
                <span className="text-xs font-medium mt-1">Dashboard</span>
            </button>
            {canCreate && (
                <button onClick={() => onViewChange('CREATE_WO')} className="flex items-center justify-center w-20 h-14 bg-primary text-text-onPrimary dark:bg-primary-dark dark:text-text-onPrimary-dark rounded-2xl shadow-lg -translate-y-4">
                    <PlusIcon />
                </button>
            )}
            <button onClick={() => onViewChange('SETTINGS')} className={`flex flex-col items-center justify-center w-full transition-colors duration-200 ${currentView === 'SETTINGS' ? 'text-primary dark:text-primary-dark' : 'text-text-secondary dark:text-text-secondary-dark hover:text-primary dark:hover:text-primary-dark'}`}>
                <SettingsIcon />
                <span className="text-xs font-medium mt-1">Settings</span>
            </button>
        </nav>
    </footer>
    );
};

export default BottomNav;
