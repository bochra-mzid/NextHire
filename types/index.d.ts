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

interface Interview {
	interviewId: string;
	jobId: string;
	title: string;
	level: string;
	userId: string;
	type: 'technical' | 'behavioral' | 'mixed';
	questionCount: number;
	score?: number;
	duration?: number;
	createdAt: string;
	completedAt?: string;
}
