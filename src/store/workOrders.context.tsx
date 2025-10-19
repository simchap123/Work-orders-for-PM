import React, { createContext, useReducer, useContext, useCallback } from 'react';
import { MOCK_WORK_ORDERS, USERS } from '../lib/constants';
import { WorkOrder, Activity, Status, Media, ActivityType } from '../lib/types';
import { workOrdersReducer } from './workOrders.reducer';

interface WorkOrdersContextType {
    workOrders: WorkOrder[];
    addWorkOrder: (newOrder: Omit<WorkOrder, 'id' | 'activity' | 'media'>, currentUserId: number) => void;
    addActivity: (workOrderId: number, activity: Omit<Activity, 'id'>) => void;
    addMedia: (workOrderId: number, url: string, type: 'image' | 'video', currentUserId: number) => void;
    handleAssign: (workOrderId: number, assigneeId: number, currentUserId: number) => void;
    handleStatusChange: (workOrderId: number, newStatus: Status, currentUserId: number) => void;
}

const WorkOrdersContext = createContext<WorkOrdersContextType | undefined>(undefined);

export const WorkOrdersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [workOrders, dispatch] = useReducer(workOrdersReducer, MOCK_WORK_ORDERS);

    const addWorkOrder = useCallback((newOrder: Omit<WorkOrder, 'id' | 'activity' | 'media'>, currentUserId: number) => {
        const newId = Math.max(...workOrders.map(wo => wo.id)) + 1;
        const fullNewOrder: WorkOrder = {
            ...newOrder,
            id: newId,
            media: [],
            activity: [{
                id: 1,
                userId: currentUserId,
                type: ActivityType.CREATED,
                timestamp: new Date().toISOString(),
                details: {},
            }],
        };
        dispatch({ type: 'ADD_WORK_ORDER', payload: fullNewOrder });
    }, [workOrders]);

    const addActivity = useCallback((workOrderId: number, activity: Omit<Activity, 'id'>) => {
        const workOrder = workOrders.find(wo => wo.id === workOrderId);
        if (!workOrder) return;
        const newActivity = { ...activity, id: workOrder.activity.length + 1 };
        dispatch({ type: 'ADD_ACTIVITY', payload: { workOrderId, activity: newActivity } });
    }, [workOrders]);
    
    const addMedia = useCallback((workOrderId: number, url: string, type: 'image' | 'video', currentUserId: number) => {
        const workOrder = workOrders.find(wo => wo.id === workOrderId);
        if (!workOrder) return;

        const newMedia: Media = {
            id: (workOrder.media.length > 0 ? Math.max(...workOrder.media.map(m => m.id)) : 0) + 1,
            url,
            type,
            uploadedBy: currentUserId,
            timestamp: new Date().toISOString(),
        };
         dispatch({ type: 'ADD_MEDIA', payload: { workOrderId, media: newMedia } });

        addActivity(workOrderId, {
            userId: currentUserId,
            type: ActivityType.MEDIA_UPLOAD,
            timestamp: new Date().toISOString(),
            details: { mediaUrl: url }
        });
    }, [workOrders, addActivity]);

    const handleAssign = useCallback((workOrderId: number, assigneeId: number, currentUserId: number) => {
        const workOrder = workOrders.find(wo => wo.id === workOrderId);
        if (!workOrder) return;

        dispatch({ type: 'ASSIGN_WORK_ORDER', payload: { workOrderId, assigneeId, oldStatus: workOrder.status } });
        
        addActivity(workOrderId, {
            userId: currentUserId,
            type: ActivityType.ASSIGNMENT,
            timestamp: new Date().toISOString(),
            details: { assignedToId: assigneeId }
        });
        addActivity(workOrderId, {
            userId: currentUserId,
            type: ActivityType.STATUS_CHANGE,
            timestamp: new Date().toISOString(),
            details: { oldStatus: workOrder.status, newStatus: Status.ASSIGNED }
        });
    }, [workOrders, addActivity]);

    const handleStatusChange = useCallback((workOrderId: number, newStatus: Status, currentUserId: number) => {
        const workOrder = workOrders.find(wo => wo.id === workOrderId);
        if (!workOrder || workOrder.status === newStatus) return;

        dispatch({ type: 'UPDATE_WORK_ORDER_STATUS', payload: { workOrderId, newStatus, oldStatus: workOrder.status } });
        
        addActivity(workOrderId, {
            userId: currentUserId,
            type: ActivityType.STATUS_CHANGE,
            timestamp: new Date().toISOString(),
            details: { oldStatus: workOrder.status, newStatus }
        });
    }, [workOrders, addActivity]);


    const value = { workOrders, addWorkOrder, addActivity, addMedia, handleAssign, handleStatusChange };

    return (
        <WorkOrdersContext.Provider value={value}>
            {children}
        </WorkOrdersContext.Provider>
    );
};

export const useWorkOrders = (): WorkOrdersContextType => {
    const context = useContext(WorkOrdersContext);
    if (context === undefined) {
        throw new Error('useWorkOrders must be used within a WorkOrdersProvider');
    }
    return context;
};
