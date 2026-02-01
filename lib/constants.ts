export const EXPERIENCE_LEVELS = [
	{ value: 'entry', label: 'Entry Level', description: 'No professional experience' },
	{ value: 'junior', label: 'Junior', description: '0-2 years of experience' },
	{ value: 'mid', label: 'Mid Level', description: '2-5 years of experience' },
	{ value: 'senior', label: 'Senior', description: '5-8 years of experience' },
	{ value: 'lead', label: 'Lead', description: '8+ years of experience' },
	{ value: 'principal', label: 'Principal', description: '10+ years, strategic leadership' },
] as const;

export type ExperienceLevel = (typeof EXPERIENCE_LEVELS)[number]['value'];

