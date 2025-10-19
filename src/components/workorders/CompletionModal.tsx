import React, { useState, useRef } from 'react';
import { CameraIcon } from '../../icons';

const CompletionModal: React.FC<{
    onSubmit: (note: string, mediaUrl: string) => void;
    onCancel: () => void;
}> = ({ onSubmit, onCancel }) => {
    const [note, setNote] = useState('');
    const [mediaUrl, setMediaUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (typeof reader.result === 'string') {
                    setMediaUrl(reader.result);
                }
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleSubmit = () => {
        if (!note.trim() || !mediaUrl) {
            alert('Please provide a completion note and a photo.');
            return;
        }
        onSubmit(note, mediaUrl);
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
             <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept="image/*" capture="environment" style={{ display: 'none' }} />
            <div className="bg-card dark:bg-card-dark rounded-xl p-6 w-full max-w-md space-y-4">
                <h2 className="text-xl font-bold">Complete Work Order</h2>
                
                <div>
                    <label className="text-sm font-medium text-text-secondary dark:text-text-secondary-dark">Completion Note (Required)</label>
                    <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Describe the work completed..." rows={4} className="w-full mt-1 p-2 bg-secondary dark:bg-secondary-dark border border-border dark:border-border-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"></textarea>
                </div>

                <div>
                    <label className="text-sm font-medium text-text-secondary dark:text-text-secondary-dark">Proof of Completion (Required)</label>
                    {mediaUrl ? (
                         <div className="mt-2 relative">
                             <img src={mediaUrl} alt="Completion media" className="w-full h-48 object-cover rounded-lg" />
                             <button onClick={() => setMediaUrl(null)} className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1">&times;</button>
                         </div>
                    ) : (
                        <button onClick={() => fileInputRef.current?.click()} className="mt-2 w-full h-32 border-2 border-dashed border-border dark:border-border-dark rounded-lg flex flex-col items-center justify-center text-text-secondary dark:text-text-secondary-dark hover:bg-secondary dark:hover:bg-secondary-dark">
                            <CameraIcon />
                            <span className="mt-1 text-sm">Add Photo</span>
                        </button>
                    )}
                </div>

                <div className="flex justify-end gap-3 pt-2">
                    <button onClick={onCancel} className="px-5 py-2.5 font-bold bg-secondary dark:bg-secondary-dark rounded-lg">Cancel</button>
                    <button onClick={handleSubmit} disabled={!note.trim() || !mediaUrl} className="px-5 py-2.5 font-bold text-text-onPrimary dark:text-text-onPrimary-dark bg-primary dark:bg-primary-dark rounded-lg disabled:opacity-50">Submit</button>
                </div>
            </div>
        </div>
    );
};

export default CompletionModal;
