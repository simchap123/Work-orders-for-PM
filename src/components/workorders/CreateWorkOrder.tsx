import React, { useState, useEffect, useRef } from 'react';
import { PROPERTIES } from '../../lib/constants';
import { Status, User } from '../../lib/types';
import { useWorkOrders } from '../../store/workOrders.context';
import { generateTitleFromDescription, generateTagsFromDescription } from '../../services/ai.service';
import { MagicIcon } from '../../icons';

const CreateWorkOrder: React.FC<{ currentUser: User, onCancel: () => void, onSaveSuccess: () => void }> = ({ currentUser, onCancel, onSaveSuccess }) => {
    const { addWorkOrder } = useWorkOrders();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [propertyId, setPropertyId] = useState<number>(PROPERTIES[0].id);
    const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');
    const [tags, setTags] = useState<string[]>([]);
    
    const [isGeneratingTitle, setIsGeneratingTitle] = useState(false);
    const [suggestedTags, setSuggestedTags] = useState<string[]>([]);
    
    const debounceTimeout = useRef<number | null>(null);

    useEffect(() => {
        if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
        if (description.length > 20) {
            debounceTimeout.current = window.setTimeout(() => {
                handleGenerateTags();
            }, 1000);
        } else {
            setSuggestedTags([]);
        }
        return () => { if (debounceTimeout.current) clearTimeout(debounceTimeout.current) };
    }, [description]);
    
    const handleGenerateTitle = async () => {
        setIsGeneratingTitle(true);
        const generatedTitle = await generateTitleFromDescription(description);
        if (generatedTitle) {
            setTitle(generatedTitle);
        }
        setIsGeneratingTitle(false);
    };
    
    const handleGenerateTags = async () => {
        const generatedTags = await generateTagsFromDescription(description);
        setSuggestedTags(generatedTags.filter((t: string) => !tags.includes(t)));
    };

    const toggleTag = (tag: string) => {
        setTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
        setSuggestedTags(prev => prev.filter(t => t !== tag));
    };

    const handleSubmit = () => {
        if (!title || !description) {
            alert('Please fill out Title and Description.');
            return;
        }
        addWorkOrder({ title, description, propertyId, priority, status: Status.NEW, tags }, currentUser.id);
        onSaveSuccess();
    };

    return (
        <div className="space-y-6">
            <div className="relative">
                <label className="text-sm font-medium text-text-secondary dark:text-text-secondary-dark">Title</label>
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g., Leaky Faucet in Unit 2B" className="w-full mt-1 p-3 bg-secondary dark:bg-secondary-dark border border-border dark:border-border-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark" />
                {description.length > 10 && (
                    <button onClick={handleGenerateTitle} disabled={isGeneratingTitle} className="absolute right-2 top-8 p-1.5 rounded-full bg-primary/10 text-primary dark:bg-primary-dark/20 dark:text-primary-dark hover:bg-primary/20 dark:hover:bg-primary-dark/30 disabled:opacity-50">
                        <MagicIcon />
                    </button>
                )}
            </div>

            <div>
                <label className="text-sm font-medium text-text-secondary dark:text-text-secondary-dark">Description</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe the issue in detail..." rows={5} className="w-full mt-1 p-3 bg-secondary dark:bg-secondary-dark border border-border dark:border-border-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark"></textarea>
            </div>

            <div>
                 <label className="text-sm font-medium text-text-secondary dark:text-text-secondary-dark">Tags</label>
                 <div className="flex flex-wrap gap-2 mt-2">
                     {tags.map(tag => (
                         <button key={tag} onClick={() => toggleTag(tag)} className="px-3 py-1 text-sm font-semibold text-text-onPrimary dark:text-text-onPrimary-dark bg-primary dark:bg-primary-dark rounded-full">{tag}</button>
                     ))}
                     {suggestedTags.map(tag => (
                         <button key={tag} onClick={() => toggleTag(tag)} className="px-3 py-1 text-sm font-semibold text-primary dark:text-primary-dark bg-primary/10 dark:bg-primary-dark/20 rounded-full border border-primary/20 dark:border-primary-dark/30">
                             {tag} +
                         </button>
                     ))}
                 </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-sm font-medium text-text-secondary dark:text-text-secondary-dark">Property</label>
                    <select value={propertyId} onChange={e => setPropertyId(Number(e.target.value))} className="w-full mt-1 p-3 bg-secondary dark:bg-secondary-dark border border-border dark:border-border-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark">
                        {PROPERTIES.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                </div>
                 <div>
                    <label className="text-sm font-medium text-text-secondary dark:text-text-secondary-dark">Priority</label>
                    <select value={priority} onChange={e => setPriority(e.target.value as any)} className="w-full mt-1 p-3 bg-secondary dark:bg-secondary-dark border border-border dark:border-border-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark">
                        <option>Low</option>
                        <option>Medium</option>
                        <option>High</option>
                    </select>
                </div>
            </div>
            
            <div className="flex justify-end gap-3 pt-4">
                <button onClick={onCancel} className="px-6 py-3 font-bold bg-secondary dark:bg-secondary-dark rounded-lg">Cancel</button>
                <button onClick={handleSubmit} className="px-6 py-3 font-bold text-text-onPrimary dark:text-text-onPrimary-dark bg-primary dark:bg-primary-dark rounded-lg">Create</button>
            </div>
        </div>
    );
};

export default CreateWorkOrder;
