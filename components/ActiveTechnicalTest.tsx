'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LoadingOverlay } from '@/components/ui/loading-overlay';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { ArrowRight, Trophy } from 'lucide-react';

function ActiveTechnicalTest({ test, testId }: ActiveTechnicalTestProps) {
	const router = useRouter();
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const [answers, setAnswers] = useState<Record<string, string>>({});
	const [isEvaluating, setIsEvaluating] = useState(false);

	const currentQuestion = test.questions[currentQuestionIndex];
	const isLastQuestion = currentQuestionIndex === test.questions.length - 1;
	const currentAnswer = answers[currentQuestion.id] || '';

	const handleAnswerChange = (value: string) => {
		setAnswers({ ...answers, [currentQuestion.id]: value });
	};

	const handleNextQuestion = () => {
		setCurrentQuestionIndex(currentQuestionIndex + 1);
	};

	const handleFinishTest = async () => {
		setIsEvaluating(true);

		try {
			const submissionAnswers = test.questions.map((question) => ({
				questionId: question.id,
				userAnswer: answers[question.id] || '',
			}));

			const response = await fetch('/api/technical-test/evaluate', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ testId, answers: submissionAnswers }),
			});
			const data = await response.json();
			if (data.success) {
				router.push(`/jobs/${test.jobId}/technical-tests/${testId}`);
			} else {
				toast.error('Failed to evaluate test');
				setIsEvaluating(false);
			}
		} catch {
			toast.error('Failed to evaluate test');
			setIsEvaluating(false);
		}
	};

	if (isEvaluating) {
		return <LoadingOverlay message="Submitting answers and evaluating..." />;
	}

	const answeredCount = Object.keys(answers).length;

	return (
		<div className="container mx-auto py-10 px-4 max-w-3xl">
			<div className="mb-6 flex items-center justify-between">
				<Badge variant="outline" className="text-lg px-4 py-2">
					Question {currentQuestionIndex + 1} of {test.questions.length}
				</Badge>
				<div className="flex items-center gap-2">
					<Badge variant="secondary" className="capitalize">
						{currentQuestion.type.replace('-', ' ')}
					</Badge>
					<Badge variant="outline">
						{answeredCount}/{test.questions.length} answered
					</Badge>
				</div>
			</div>
			<Card>
				<CardHeader>
					<CardTitle className="text-xl leading-relaxed">{currentQuestion.question}</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					{currentQuestion.type === 'multiple-choice' && currentQuestion.options && (
						<div className="space-y-2">
							{currentQuestion.options.map((option, index) => (
								<button
									key={index}
									onClick={() => handleAnswerChange(option)}
									className={`w-full text-left p-4 rounded-lg border transition-colors ${
										currentAnswer === option ? 'bg-primary/10 border-primary' : 'hover:bg-muted'
									}`}
								>
									{option}
								</button>
							))}
						</div>
					)}
					{(currentQuestion.type === 'written' || currentQuestion.type === 'riddle') && (
						<Textarea
							placeholder="Type your answer here..."
							value={currentAnswer}
							onChange={(e) => handleAnswerChange(e.target.value)}
							className="min-h-32"
						/>
					)}
				</CardContent>
			</Card>
			<div className="mt-6 flex justify-end">
				{isLastQuestion ? (
					<Button size="lg" onClick={handleFinishTest}>
						Submit Test
						<Trophy className="ml-2 size-4" />
					</Button>
				) : (
					<Button size="lg" onClick={handleNextQuestion}>
						Next
						<ArrowRight className="ml-2 size-4" />
					</Button>
				)}
			</div>
		</div>
	);
}

export default ActiveTechnicalTest;
