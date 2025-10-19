import { Activity, Media, Status, WorkOrder } from "../lib/types";

export type Action =
    | { type: 'ADD_WORK_ORDER'; payload: WorkOrder }
    | { type: 'ADD_ACTIVITY'; payload: { workOrderId: number; activity: Activity } }
    | { type: 'ADD_MEDIA'; payload: { workOrderId: number; media: Media } }
    | { type: 'ASSIGN_WORK_ORDER'; payload: { workOrderId: number; assigneeId: number; oldStatus: Status } }
    | { type: 'UPDATE_WORK_ORDER_STATUS'; payload: { workOrderId: number; newStatus: Status, oldStatus: Status } };
