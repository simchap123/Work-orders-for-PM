import React from 'react';
import { WorkOrder } from '../../lib/types';
import { STATUS_DOT_COLORS, PRIORITY_COLORS } from '../../lib/constants';
import { getPropertyById } from '../../lib/utils';

const WorkOrderList: React.FC<{ workOrders: WorkOrder[], onSelect: (id: number) => void }> = ({ workOrders, onSelect }) => (
    <div className="space-y-4">
        {workOrders.length > 0 ? (
            workOrders.map(wo => (
                <div key={wo.id} onClick={() => onSelect(wo.id)} className="bg-card dark:bg-card-dark rounded-xl p-4 border border-border dark:border-border-dark hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-semibold text-text-secondary dark:text-text-secondary-dark">WO-{wo.id} &middot; {getPropertyById(wo.propertyId)?.name}</p>
                            <p className="text-lg font-bold text-text-primary dark:text-text-primary-dark mt-1">{wo.title}</p>
                        </div>
                        <div className="text-right flex-shrink-0 ml-4">
                            <div className="flex items-center justify-end">
                                <span className={`h-2.5 w-2.5 rounded-full mr-2 ${STATUS_DOT_COLORS[wo.status]}`}></span>
                                <span className="text-sm font-medium">{wo.status}</span>
                            </div>
                            <p className={`text-sm font-bold mt-1 ${PRIORITY_COLORS[wo.priority]}`}>{wo.priority}</p>
                        </div>
                    </div>
                </div>
            ))
        ) : (
            <div className="bg-card dark:bg-card-dark rounded-xl p-6 text-center border border-border dark:border-border-dark">
                <p className="text-text-secondary dark:text-text-secondary-dark">No work orders match your search.</p>
            </div>
        )}
    </div>
);

export default WorkOrderList;
