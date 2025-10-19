import React from 'react';
import { User } from '../../lib/types';
import { BackIcon } from '../../icons';

const Header: React.FC<{ title: string; showBackButton: boolean; onBack: () => void; currentUser: User; }> = ({ title, showBackButton, onBack, currentUser }) => (
    <header className="sticky top-0 z-10 p-4 flex items-center justify-between h-16 bg-background/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-border dark:border-border-dark">
        <div className="flex items-center">
            {showBackButton && (
                <button onClick={onBack} className="mr-2 p-2 rounded-full hover:bg-secondary dark:hover:bg-secondary-dark">
                    <BackIcon />
                </button>
            )}
            <h1 className="text-xl font-bold">{title}</h1>
        </div>
         <div className="flex items-center space-x-2">
             <div className="text-right">
                <p className="font-semibold text-sm">{currentUser.name}</p>
                <p className="text-xs text-text-secondary dark:text-text-secondary-dark">{currentUser.role}</p>
             </div>
             <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-9 h-9 rounded-full" />
        </div>
    </header>
);

export default Header;
