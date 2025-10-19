import React, { useState, useRef } from 'react';
import { WorkOrder, User, Activity, Status, Role, ActivityType } from '../../lib/types';
import { useWorkOrders } from '../../store/workOrders.context';
import { getPropertyById, getUserById } from '../../lib/utils';
import { PRIORITY_COLORS, ASSIGNABLE_ROLES, USERS } from '../../lib/constants';
import { CreatedIcon, NoteIcon, StatusChangeIcon, AssignmentIcon, MediaIcon, PhoneIcon, EmailIcon, CameraIcon } from '../../icons';
import CompletionModal from './CompletionModal';

const ACTIVITY_ICONS: { [key in ActivityType]: React.ReactNode } = {
    [ActivityType.CREATED]: <CreatedIcon />,
    [ActivityType.NOTE]: <NoteIcon />,
    [ActivityType.STATUS_CHANGE]: <StatusChangeIcon />,
    [ActivityType.ASSIGNMENT]: <AssignmentIcon />,
    [ActivityType.MEDIA_UPLOAD]: <MediaIcon />,
};


const WorkOrderDetail: React.FC<{ workOrder: WorkOrder, currentUser: User }> = ({ workOrder, currentUser }) => {
    const { addActivity, handleAssign, handleStatusChange, addMedia } = useWorkOrders();
    const property = getPropertyById(workOrder.propertyId);
    const assignedTo = workOrder.assignedToId ? getUserById(workOrder.assignedToId) : workOrder.vendorId ? getUserById(workOrder.vendorId) : null;
    const [newNote, setNewNote] = useState('');
    
    const [showAssign, setShowAssign] = useState(false);
    const [assigneeId, setAssigneeId] = useState<number | null>(null);
    const [isCompleting, setIsCompleting] = useState(false);
    const generalFileInputRef = useRef<HTMLInputElement>(null);

    const isTechnician = currentUser.role === Role.TECHNICIAN;
    const isSupervisor = currentUser.role === Role.SUPERVISOR;

    const canAssign = ASSIGNABLE_ROLES.includes(currentUser.role) && [Status.NEW, Status.ON_HOLD].includes(workOrder.status);
    const assignableUsers = USERS.filter(u => u.role === Role.TECHNICIAN || u.role === Role.VENDOR);
    
    const canStartProgress = isTechnician && workOrder.status === Status.ASSIGNED;
    const canCompleteAsTechnician = isTechnician && workOrder.status === Status.IN_PROGRESS;
    const canCompleteAsSupervisor = isSupervisor && [Status.ASSIGNED, Status.IN_PROGRESS].includes(workOrder.status);

    const handleConfirmAssignment = () => {
        if (assigneeId) {
            handleAssign(workOrder.id, assigneeId, currentUser.id);
            setShowAssign(false);
            setAssigneeId(null);
        }
    };

    const handleAddNote = () => {
        if (!newNote.trim()) return;
        addActivity(workOrder.id, {
            userId: currentUser.id,
            type: ActivityType.NOTE,
            timestamp: new Date().toISOString(),
            details: { content: newNote },
        });
        setNewNote('');
    };

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (typeof reader.result === 'string') {
                    addMedia(workOrder.id, reader.result, 'image', currentUser.id);
                }
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleSubmitCompletion = (note: string, mediaUrl: string) => {
        addMedia(workOrder.id, mediaUrl, 'image', currentUser.id);
        addActivity(workOrder.id, {
            userId: currentUser.id,
            type: ActivityType.NOTE,
            timestamp: new Date().toISOString(),
            details: { content: `Completion Note: ${note}` },
        });
        handleStatusChange(workOrder.id, Status.COMPLETED, currentUser.id);
        setIsCompleting(false);
    };

    const renderActivityDetail = (activity: Activity) => {
        const user = getUserById(activity.userId);
        switch (activity.type) {
            case ActivityType.CREATED:
                return <p><span className="font-bold">{user?.name}</span> created the work order.</p>;
            case ActivityType.NOTE:
                return <p><span className="font-bold">{user?.name}</span> commented: <span className="text-text-secondary dark:text-text-secondary-dark italic">"{activity.details.content}"</span></p>;
            case ActivityType.STATUS_CHANGE:
                return <p><span className="font-bold">{user?.name}</span> changed status from <span className="font-semibold">{activity.details.oldStatus}</span> to <span className="font-semibold">{activity.details.newStatus}</span>.</p>;
            case ActivityType.ASSIGNMENT:
                const assignedUser = getUserById(activity.details.assignedToId!);
                return <p><span className="font-bold">{user?.name}</span> assigned this to <span className="font-bold">{assignedUser?.name}</span>.</p>;
            case ActivityType.MEDIA_UPLOAD:
                return <p><span className="font-bold">{user?.name}</span> uploaded new media.</p>;
            default:
                return null;
        }
    };

    return (
        <div className="space-y-6">
            {isCompleting && <CompletionModal onSubmit={handleSubmitCompletion} onCancel={() => setIsCompleting(false)} />}
            <input type="file" ref={generalFileInputRef} onChange={handleFileSelect} accept="image/*" capture="environment" style={{ display: 'none' }} />
            
            <div className="bg-card dark:bg-card-dark rounded-xl p-5 border border-border dark:border-border-dark">
                <p className="text-lg font-bold">{workOrder.title}</p>
                <p className="mt-2 text-text-secondary dark:text-text-secondary-dark whitespace-pre-wrap">{workOrder.description}</p>
            </div>

            <div className="bg-card dark:bg-card-dark rounded-xl p-5 border border-border dark:border-border-dark">
                 <h3 className="text-md font-bold mb-3">Property & Contact</h3>
                 <div className="space-y-3">
                     <div>
                         <p className="text-sm text-text-secondary dark:text-text-secondary-dark">Location</p>
                         <p className="font-semibold">{property?.name}{workOrder.unitNumber && `, Unit ${workOrder.unitNumber}`}</p>
                         <p className="text-sm text-text-secondary dark:text-text-secondary-dark">{property?.address}</p>
                     </div>
                     {workOrder.tenant && (
                         <div>
                             <p className="text-sm text-text-secondary dark:text-text-secondary-dark">Tenant</p>
                             <p className="font-semibold">{workOrder.tenant.name}</p>
                             <div className="flex items-center space-x-4 mt-1">
                                <a href={`tel:${workOrder.tenant.phone}`} className="flex items-center space-x-1.5 text-primary dark:text-primary-dark hover:underline">
                                    <PhoneIcon />
                                    <span className="text-sm font-medium">Call / Text</span>
                                </a>
                                <a href={`mailto:${workOrder.tenant.email}`} className="flex items-center space-x-1.5 text-primary dark:text-primary-dark hover:underline">
                                    <EmailIcon />
                                    <span className="text-sm font-medium">Email</span>
                                </a>
                             </div>
                         </div>
                     )}
                 </div>
            </div>

            <div className="bg-card dark:bg-card-dark rounded-xl p-5 border border-border dark:border-border-dark grid grid-cols-2 gap-y-4 gap-x-2">
                <div><p className="text-sm text-text-secondary dark:text-text-secondary-dark">Status</p><p className="font-semibold">{workOrder.status}</p></div>
                <div><p className="text-sm text-text-secondary dark:text-text-secondary-dark">Priority</p><p className={`font-semibold ${PRIORITY_COLORS[workOrder.priority]}`}>{workOrder.priority}</p></div>
                <div><p className="text-sm text-text-secondary dark:text-text-secondary-dark">Property</p><p className="font-semibold">{property?.name}</p></div>
                <div><p className="text-sm text-text-secondary dark:text-text-secondary-dark">Assigned To</p><p className="font-semibold">{assignedTo?.name || 'Unassigned'}</p></div>
            </div>

            {(canAssign || canStartProgress || canCompleteAsTechnician || canCompleteAsSupervisor) && (
                <div className="bg-card dark:bg-card-dark rounded-xl p-5 border border-border dark:border-border-dark">
                    <h3 className="text-md font-bold mb-3">Actions</h3>
                    <div className="space-y-3">
                        {canAssign && (
                            !showAssign ? (
                                <button onClick={() => setShowAssign(true)} className="w-full px-4 py-3 font-bold text-text-onPrimary dark:text-text-onPrimary-dark bg-primary dark:bg-primary-dark rounded-lg hover:opacity-90">
                                    Assign Work Order
                                </button>
                            ) : (
                                <div className="space-y-3">
                                    <select onChange={(e) => setAssigneeId(Number(e.target.value))} defaultValue="" className="w-full p-3 bg-secondary dark:bg-secondary-dark border border-border dark:border-border-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                                        <option value="" disabled>Select Technician or Vendor</option>
                                        {assignableUsers.map(u => <option key={u.id} value={u.id}>{u.name} ({u.role})</option>)}
                                    </select>
                                    <div className="flex gap-3">
                                        <button onClick={() => setShowAssign(false)} className="w-full px-4 py-2 font-bold bg-secondary dark:bg-secondary-dark rounded-lg">Cancel</button>
                                        <button onClick={handleConfirmAssignment} disabled={!assigneeId} className="w-full px-4 py-2 font-bold text-text-onPrimary dark:text-text-onPrimary-dark bg-primary dark:bg-primary-dark rounded-lg hover:opacity-90 disabled:opacity-50">Confirm</button>
                                    </div>
                                </div>
                            )
                        )}
                        {canStartProgress && (
                           <button onClick={() => handleStatusChange(workOrder.id, Status.IN_PROGRESS, currentUser.id)} className="w-full px-4 py-3 font-bold text-white bg-yellow-500 rounded-lg hover:bg-yellow-600 transition-colors">
                                Mark as In Progress
                            </button>
                        )}
                        {canCompleteAsTechnician && (
                             <button onClick={() => setIsCompleting(true)} className="w-full px-4 py-3 font-bold text-white bg-green-500 rounded-lg hover:bg-green-600 transition-colors">
                                Mark as Complete
                            </button>
                        )}
                         {canCompleteAsSupervisor && (
                             <button onClick={() => handleStatusChange(workOrder.id, Status.COMPLETED, currentUser.id)} className="w-full px-4 py-3 font-bold text-white bg-green-500 rounded-lg hover:bg-green-600 transition-colors">
                                Mark as Complete
                            </button>
                        )}
                    </div>
                </div>
            )}

             <div className="bg-card dark:bg-card-dark rounded-xl p-5 border border-border dark:border-border-dark">
                <div className="flex justify-between items-center mb-3">
                    <h3 className="text-md font-bold">Media</h3>
                    <button onClick={() => generalFileInputRef.current?.click()} className="flex items-center justify-center p-2 sm:px-3 sm:py-1.5 text-sm font-bold text-text-onPrimary dark:text-text-onPrimary-dark bg-primary dark:bg-primary-dark rounded-lg hover:opacity-90 transition-all">
                        <CameraIcon className="w-5 h-5" />
                        <span className="hidden sm:inline sm:ml-2">Add Media</span>
                    </button>
                </div>
                 {workOrder.media.length > 0 ? (
                    <div className="flex overflow-x-auto gap-3">
                         {workOrder.media.map(m => (
                             <img key={m.id} src={m.url} alt={`Work order media ${m.id}`} className="h-24 w-24 object-cover rounded-lg flex-shrink-0" />
                         ))}
                     </div>
                 ) : (
                    <p className="text-sm text-center py-4 text-text-secondary dark:text-text-secondary-dark">No media has been added yet.</p>
                 )}
             </div>

            <div className="bg-card dark:bg-card-dark rounded-xl p-5 border border-border dark:border-border-dark">
                <h3 className="text-md font-bold mb-4">Activity</h3>
                <div className="space-y-2">
                    <textarea value={newNote} onChange={e => setNewNote(e.target.value)} placeholder="Add a note..." rows={3} className="w-full p-2 bg-secondary dark:bg-secondary-dark border border-border dark:border-border-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"></textarea>
                    <button onClick={handleAddNote} className="w-full px-4 py-2 font-bold text-text-onPrimary dark:text-text-onPrimary-dark bg-primary dark:bg-primary-dark rounded-lg hover:opacity-90 disabled:opacity-50" disabled={!newNote.trim()}>Add Note</button>
                </div>
                <ul className="mt-6 space-y-4">
                    {workOrder.activity.map(act => (
                        <li key={act.id} className="flex items-start space-x-3">
                            <div className="flex-shrink-0 mt-1 text-text-secondary dark:text-text-secondary-dark">{ACTIVITY_ICONS[act.type]}</div>
                            <div>
                                {renderActivityDetail(act)}
                                <p className="text-xs text-text-secondary dark:text-text-secondary-dark mt-0.5">{new Date(act.timestamp).toLocaleString()}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default WorkOrderDetail;