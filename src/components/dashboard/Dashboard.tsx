import React from 'react';
import { User, WorkOrder, View, Role, Status } from '../../lib/types';
import WorkOrderList from '../workorders/WorkOrderList';
import { ListIcon } from '../../icons';

const Dashboard: React.FC<{
    currentUser: User;
    workOrders: WorkOrder[];
    onSelectWorkOrder: (id: number) => void;
    onViewChange: (view: View) => void;
}> = ({ currentUser, workOrders, onSelectWorkOrder, onViewChange }) => {
    
    // Technician View
    if (currentUser.role === Role.TECHNICIAN) {
        const myActiveWorkOrders = workOrders.filter(wo => wo.assignedToId === currentUser.id && [Status.ASSIGNED, Status.IN_PROGRESS].includes(wo.status));
        const myCompletedWorkOrders = workOrders.filter(wo => wo.assignedToId === currentUser.id && wo.status === Status.COMPLETED);

        return (
            <div className="space-y-6">
                <div>
                    <h2 className="text-xl font-bold mb-3">My Active Jobs ({myActiveWorkOrders.length})</h2>
                    {myActiveWorkOrders.length > 0 ? (
                        <WorkOrderList workOrders={myActiveWorkOrders} onSelect={onSelectWorkOrder} />
                    ) : (
                        <div className="bg-card dark:bg-card-dark rounded-xl p-6 text-center border border-border dark:border-border-dark">
                            <p className="text-text-secondary dark:text-text-secondary-dark">You have no active jobs.</p>
                        </div>
                    )}
                </div>
                <div>
                    <h2 className="text-xl font-bold mb-3">My Recently Completed ({myCompletedWorkOrders.length})</h2>
                     {myCompletedWorkOrders.length > 0 ? (
                        <WorkOrderList workOrders={myCompletedWorkOrders.slice(0, 5)} onSelect={onSelectWorkOrder} />
                    ) : (
                         <div className="bg-card dark:bg-card-dark rounded-xl p-6 text-center border border-border dark:border-border-dark">
                            <p className="text-text-secondary dark:text-text-secondary-dark">You have no completed jobs.</p>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Admin / PM / Supervisor etc. View
    const newOrders = workOrders.filter(wo => wo.status === Status.NEW).length;
    const inProgressOrders = workOrders.filter(wo => wo.status === Status.IN_PROGRESS).length;
    const onHoldOrders = workOrders.filter(wo => wo.status === Status.ON_HOLD).length;
    const highPriorityOrders = workOrders.filter(wo => wo.priority === 'High' && ![Status.COMPLETED, Status.CLOSED].includes(wo.status));

    const StatCard: React.FC<{ label: string; value: number; color: string }> = ({ label, value, color }) => (
        <div className="bg-card dark:bg-card-dark rounded-xl p-4 border border-border dark:border-border-dark flex-1 text-center md:text-left">
            <p className="text-sm font-medium text-text-secondary dark:text-text-secondary-dark">{label}</p>
            <p className={`text-3xl font-bold ${color}`}>{value}</p>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4">
                <StatCard label="New" value={newOrders} color="text-blue-500" />
                <StatCard label="In Progress" value={inProgressOrders} color="text-yellow-500" />
                <StatCard label="On Hold" value={onHoldOrders} color="text-gray-500" />
            </div>
            
            <button 
                onClick={() => onViewChange('WORK_ORDERS')} 
                className="w-full text-left p-4 rounded-xl bg-card dark:bg-card-dark border border-border dark:border-border-dark hover:bg-secondary/50 dark:hover:bg-secondary-dark/50 flex justify-between items-center transition-all"
            >
                <div className="flex items-center space-x-3">
                    <ListIcon />
                    <span className="font-bold">View All Work Orders</span>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>

            <div>
                <h2 className="text-xl font-bold mb-3">Urgent: High Priority ({highPriorityOrders.length})</h2>
                {highPriorityOrders.length > 0 ? (
                    <WorkOrderList workOrders={highPriorityOrders} onSelect={onSelectWorkOrder} />
                ) : (
                    <div className="bg-card dark:bg-card-dark rounded-xl p-6 text-center border border-border dark:border-border-dark">
                        <p className="text-text-secondary dark:text-text-secondary-dark">No open high priority work orders.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
