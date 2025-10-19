import React from 'react';
import { User } from '../../lib/types';

const SettingsScreen: React.FC<{ users: User[]; currentUser: User; onSelectUser: (user: User) => void }> = ({ users, currentUser, onSelectUser }) => (
    <div>
        <h2 className="text-xl font-bold mb-4">Select User For Testing</h2>
        <div className="space-y-3">
            {users.map(user => (
                <button
                    key={user.id}
                    onClick={() => onSelectUser(user)}
                    className={`w-full text-left p-4 rounded-xl flex items-center justify-between transition-all duration-200 ${currentUser.id === user.id 
                        ? 'bg-primary/10 dark:bg-primary-dark/20 border border-primary/30 dark:border-primary-dark/50 shadow-md' 
                        : 'bg-card dark:bg-card-dark border border-border dark:border-border-dark hover:bg-secondary/50 dark:hover:bg-secondary-dark/50'}`}
                >
                    <div className="flex items-center space-x-4">
                        <img src={user.avatarUrl} alt={user.name} className="w-12 h-12 rounded-full"/>
                        <div>
                            <p className="font-bold text-lg">{user.name}</p>
                            <p className="text-sm text-text-secondary dark:text-text-secondary-dark">{user.role}</p>
                        </div>
                    </div>
                    {currentUser.id === user.id && (
                        <div className="px-3 py-1 text-xs font-bold text-primary dark:text-primary-dark bg-primary/10 dark:bg-primary-dark/20 rounded-full">
                            CURRENT
                        </div>
                    )}
                </button>
            ))}
        </div>
    </div>
);

export default SettingsScreen;
