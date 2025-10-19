import { ActivityType, Role, Status, WorkOrder } from "../lib/types";
import { USERS } from "../lib/constants";
import { Action } from "./workOrders.types";

export const workOrdersReducer = (state: WorkOrder[], action: Action): WorkOrder[] => {
    switch (action.type) {
        case 'ADD_WORK_ORDER':
            return [action.payload, ...state].sort((a,b) => b.id - a.id);
        
        case 'ADD_ACTIVITY':
            return state.map(wo => {
                if (wo.id === action.payload.workOrderId) {
                    return { ...wo, activity: [action.payload.activity, ...wo.activity] };
                }
                return wo;
            });

        case 'ADD_MEDIA': {
             return state.map(wo => {
                if (wo.id === action.payload.workOrderId) {
                     return { ...wo, media: [...wo.media, action.payload.media] };
                }
                return wo;
            });
        }
            
        case 'UPDATE_WORK_ORDER_STATUS':
             return state.map(wo => {
                if (wo.id === action.payload.workOrderId) {
                     return { ...wo, status: action.payload.newStatus };
                }
                return wo;
            });

        case 'ASSIGN_WORK_ORDER':
            return state.map(wo => {
                if (wo.id === action.payload.workOrderId) {
                    const updatedWo = { ...wo };
                    const isVendor = USERS.find(u => u.id === action.payload.assigneeId)?.role === Role.VENDOR;
                    if (isVendor) {
                        updatedWo.vendorId = action.payload.assigneeId;
                        updatedWo.assignedToId = undefined;
                    } else {
                        updatedWo.assignedToId = action.payload.assigneeId;
                        updatedWo.vendorId = undefined;
                    }
                    updatedWo.status = Status.ASSIGNED;
                    return updatedWo;
                }
                return wo;
            });

        default:
            return state;
    }
};
