export const EXPERIENCE_LEVELS = [
	{ value: 'entry', label: 'Entry Level', description: 'No professional experience' },
	{ value: 'junior', label: 'Junior', description: '0-2 years of experience' },
	{ value: 'mid', label: 'Mid Level', description: '2-5 years of experience' },
	{ value: 'senior', label: 'Senior', description: '5-8 years of experience' },
	{ value: 'lead', label: 'Lead', description: '8+ years of experience' },
	{ value: 'principal', label: 'Principal', description: '10+ years, strategic leadership' },
] as const;

export type ExperienceLevel = (typeof EXPERIENCE_LEVELS)[number]['value'];

export const INTERVIEW_TYPE_OPTIONS = [
	{ value: 'technical', label: 'Technical', description: 'Focus on coding, algorithms, and technical skills' },
	{ value: 'behavioral', label: 'Behavioral', description: 'Focus on past experiences and soft skills' },
	{ value: 'mixed', label: 'Mixed', description: 'Combination of technical and behavioral questions' },
] as const;

export const QUESTION_COUNT_OPTIONS = [
	{ value: 3, label: '3 Questions (~10 minutes)' },
	{ value: 5, label: '5 Questions (~15 minutes)' },
	{ value: 7, label: '7 Questions (~20 minutes)' },
	{ value: 10, label: '10 Questions (~30 minutes)' },
] as const;

export const ASSISTANT_CONFIG = {
	transcriber: {
		language: 'en',
		model: 'nova-2',
		provider: 'deepgram',
	},
	name: 'NextHireAssistant',
	voice: {
		voiceId: 'Elliot',
		provider: 'vapi',
	},
	model: {
		model: 'gpt-4o',
		provider: 'openai',
	},
} as const;

