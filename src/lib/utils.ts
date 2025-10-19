import { User, Property } from './types';
import { USERS, PROPERTIES } from './constants';

export const getUserById = (id: number): User | undefined => USERS.find(u => u.id === id);

export const getPropertyById = (id: number): Property | undefined => PROPERTIES.find(p => p.id === id);
