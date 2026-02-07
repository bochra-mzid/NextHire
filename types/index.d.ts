interface User {
	id: string;
	username: string;
	email: string;
	password: string;
}

interface AuthFormProps {
	type: FormType;
}

type FormType = 'sign-in' | 'sign-up';

interface Job {
	id: string;
	name: string;
	description: string;
	level: string;
	jobTitle: string;
	userId: string;
	createdAt: string;
	updatedAt?: string;
}

interface JobFormData {
	name: string;
	jobTitle: string;
	level: string;
	description: string;
}

interface JobFormFieldsProps {
	formData: JobFormData;
	onChange?: (data: JobFormData) => void;
	readOnly?: boolean;
}

interface JobFormProps {
	job?: Job;
	isEditing?: boolean;
	setIsEditing?: (isEditing: boolean) => void;
}

interface JobActionsProps {
	job: Job;
	isEditing?: boolean;
	setIsEditing?: (isEditing: boolean) => void;
}

interface JobCardProps {
	job: Job;
}

interface JobDetailsProps {
	job: Job;
}

interface JobDetailsPageProps {
	params: Promise<{
		id: string;
	}>;
}

interface InterviewsPageProps {
	params: Promise<{
		id: string;
	}>;
}

interface InterviewsPageHeaderProps {
	jobId: string;
}

interface InterviewListProps {
	interviews: Interview[];
	jobId: string;
}

type InterviewType = 'technical' | 'behavioral' | 'mixed';

interface Interview {
	interviewId: string;
	jobId: string;
	title: string;
	level: string;
	userId: string;
	type: InterviewType;
	questionCount: number;
	score?: number;
	duration?: number;
	createdAt: string;
	completedAt?: string;
	transcript?: string;
	feedback?: string;
	strengths?: string[];
	improvements?: string[];
	questionExamples?: {
		question: string;
		exampleAnswer: string;
	}[];
	questions: string[];
	finalized?: boolean;
}

interface TranscriptMessage {
	role: string;
	content: string;
	timestamp: number;
}

interface NewInterviewProps {
	job: Job;
	user: User;
}

interface NewInterviewPageProps {
	params: Promise<{
		id: string;
	}>;
}

interface InterviewsPageHeaderProps {
	jobId: string;
}

interface InterviewDetailProps {
	interview: Interview;
	job: Job;
}

interface InterviewDetailPageProps {
	params: Promise<{
		id: string;
		interviewId: string;
	}>;
}

interface ResumeAnalysis {
	overallScore: number;
	summary: string;
	strengths: string[];
	weaknesses: string[];
	suggestions: {
		category: string;
		issue: string;
		recommendation: string;
		priority: 'high' | 'medium' | 'low';
	}[];
	keywordMatch: {
		matched: string[];
		missing: string[];
	};
	tailoredSummary: string;
}

interface OptimizeResumePageProps {
	params: Promise<{ id: string }>;
}

interface TechnicalTestDetailProps {
	test: TechnicalTest;
	job: Job;
}

type TechnicalTestQuestionType = 'multiple-choice' | 'written' | 'riddles' | 'mixed';

interface TechnicalTestQuestion {
	id: string;
	type: 'multiple-choice' | 'written' | 'riddle';
	question: string;
	options?: string[];
	correctAnswer: string;
	explanation: string;
}

interface TechnicalTestAnswer {
	questionId: string;
	userAnswer: string;
	isCorrect: boolean;
	feedback?: string;
}

interface TechnicalTest {
	id: string;
	jobId: string;
	userId: string;
	questionType: TechnicalTestQuestionType;
	questions: TechnicalTestQuestion[];
	answers: TechnicalTestAnswer[];
	score: number;
	totalQuestions: number;
	createdAt: string;
	completedAt?: string;
	status: 'in-progress' | 'completed';
	overallFeedback?: string;
}
interface TechnicalTestListProps {
	tests: TechnicalTest[];
	jobId: string;
}

interface EvaluationResult {
	score: number;
	correctCount: number;
	totalQuestions: number;
	answers: TechnicalTestAnswer[];
	overallFeedback: string;
}

interface ActiveTechnicalTestProps {
	test: TechnicalTest;
	testId: string;
}

interface TechnicalTestConfigurationProps {
	job: Job | null;
	user: User | null;
	onTestStarted: (testId: string, test: TechnicalTest) => void;
}

interface TechnicalTestDetailPageProps {
	params: Promise<{
		id: string;
		testId: string;
	}>;
}

interface TechnicalTestsPageProps {
	params: Promise<{
		id: string;
	}>;
}
