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
