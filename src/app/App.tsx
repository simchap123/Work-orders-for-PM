import React, { useState } from 'react';
import { View, Status, User } from '../lib/types';
import { USERS } from '../lib/constants';
import { useWorkOrders } from '../store/workOrders.context';

import Header from '../components/layout/Header';
import BottomNav from '../components/layout/BottomNav';
import Dashboard from '../components/dashboard/Dashboard';
import WorkOrderList from '../components/workorders/WorkOrderList';
import WorkOrderDetail from '../components/workorders/WorkOrderDetail';
import CreateWorkOrder from '../components/workorders/CreateWorkOrder';
import SettingsScreen from '../components/workorders/SettingsScreen';

const App: React.FC = () => {
    const { workOrders } = useWorkOrders();
    const [currentView, setCurrentView] = useState<View>('DASHBOARD');
    const [selectedWorkOrderId, setSelectedWorkOrderId] = useState<number | null>(null);
    const [currentUser, setCurrentUser] = useState<User>(USERS[2]); // Default to Charlie (PM)
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<Status | 'ALL'>('ALL');


    const handleSelectWorkOrder = (id: number) => {
        setSelectedWorkOrderId(id);
        setCurrentView('DETAIL');
    };

    const handleViewChange = (view: View) => {
        if (view !== 'DETAIL') {
            setSelectedWorkOrderId(null);
        }
        setCurrentView(view);
    };

    const selectedWorkOrder = workOrders.find(wo => wo.id === selectedWorkOrderId);

    const renderContent = () => {
        switch (currentView) {
            case 'DASHBOARD':
                return <Dashboard currentUser={currentUser} workOrders={workOrders} onSelectWorkOrder={handleSelectWorkOrder} onViewChange={handleViewChange} />;
            case 'WORK_ORDERS': {
                const filteredWorkOrders = workOrders
                    .filter(wo => statusFilter === 'ALL' || wo.status === statusFilter)
                    .filter(wo => {
                        const query = searchQuery.toLowerCase();
                        if (!query) return true;
                        return (
                            wo.id.toString().includes(query) ||
                            wo.title.toLowerCase().includes(query) ||
                            wo.description.toLowerCase().includes(query)
                        );
                    });

                return (
                    <div>
                        <div className="mb-4 space-y-4">
                            <input
                                type="text"
                                placeholder="Search by ID, title, or description..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="w-full p-3 bg-secondary dark:bg-secondary-dark border border-border dark:border-border-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                            <div className="flex flex-wrap gap-2">
                                {(['ALL', ...Object.values(Status)] as const).map(status => (
                                    <button
                                        key={status}
                                        onClick={() => setStatusFilter(status)}
                                        className={`px-3 py-1.5 text-sm font-semibold rounded-full transition-colors ${
                                            statusFilter === status
                                                ? 'bg-primary text-text-onPrimary dark:bg-primary-dark dark:text-text-onPrimary-dark'
                                                : 'bg-secondary dark:bg-secondary-dark hover:bg-secondary/80 dark:hover:bg-secondary-dark/80'
                                        }`}
                                    >
                                        {status}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <WorkOrderList workOrders={filteredWorkOrders} onSelect={handleSelectWorkOrder} />
                    </div>
                );
            }
            case 'DETAIL':
                return selectedWorkOrder ? <WorkOrderDetail workOrder={selectedWorkOrder} currentUser={currentUser} /> : <p>Work order not found.</p>;
            case 'CREATE_WO':
                return <CreateWorkOrder currentUser={currentUser} onCancel={() => handleViewChange('DASHBOARD')} onSaveSuccess={() => handleViewChange('DASHBOARD')} />;
            case 'SETTINGS':
                return <SettingsScreen users={USERS} currentUser={currentUser} onSelectUser={setCurrentUser} />;
            default:
                return <Dashboard currentUser={currentUser} workOrders={workOrders} onSelectWorkOrder={handleSelectWorkOrder} onViewChange={handleViewChange} />;
        }
    };
    
    const getHeaderTitle = () => {
        switch (currentView) {
            case 'DASHBOARD': return 'Dashboard';
            case 'WORK_ORDERS': return 'All Work Orders';
            case 'DETAIL': return selectedWorkOrder ? `WO-${selectedWorkOrder.id}` : 'Detail';
            case 'CREATE_WO': return 'Create Work Order';
            case 'SETTINGS': return 'Settings';
            default: return 'Nexus';
        }
    }

    return (
        <div className="bg-background dark:bg-background-dark text-text-primary dark:text-text-primary-dark h-screen w-screen flex flex-col font-sans antialiased overflow-hidden">
            <Header title={getHeaderTitle()} showBackButton={currentView !== 'DASHBOARD'} onBack={() => handleViewChange('DASHBOARD')} currentUser={currentUser} />
            
            <main className="flex-1 overflow-y-auto pb-24 px-4 md:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto py-6">
                   {renderContent()}
                </div>
            </main>

            <BottomNav currentUser={currentUser} currentView={currentView} onViewChange={handleViewChange} />
        </div>
    );
};

export default App;
