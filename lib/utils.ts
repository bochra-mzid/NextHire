import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { EXPERIENCE_LEVELS } from './constants';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const getExperienceLevelLabel = (value: string): string => {
	const level = EXPERIENCE_LEVELS.find((level) => level.value === value);
	return level?.label || value;
};

export const getExperienceLevelDescription = (value: string): string => {
	const level = EXPERIENCE_LEVELS.find((level) => level.value === value);
	return level?.description || '';
};
