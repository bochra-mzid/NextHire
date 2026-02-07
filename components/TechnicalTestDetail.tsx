import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Trophy, Calendar, Target } from 'lucide-react';
import BackButton from '@/components/BackButton';

function TechnicalTestDetail({ test, job }: TechnicalTestDetailProps) {
	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		});
	};

	const getQuestionTypeLabel = (type: TechnicalTestQuestionType) => {
		const labels: Record<TechnicalTestQuestionType, string> = {
			'multiple-choice': 'Multiple Choice',
			written: 'Written Answer',
			riddles: 'Riddles & Puzzles',
			mixed: 'Mixed',
		};
		return labels[type];
	};

	const getScoreColor = (score: number) => {
		if (score >= 80) return 'text-green-600';
		if (score >= 60) return 'text-yellow-600';
		return 'text-red-600';
	};

	const getScoreBgColor = (score: number) => {
		if (score >= 80) return 'bg-green-50 dark:bg-green-900/20';
		if (score >= 60) return 'bg-yellow-50 dark:bg-yellow-900/20';
		return 'bg-red-50 dark:bg-red-900/20';
	};

	const correctCount = test.answers.filter((a) => a.isCorrect).length;

	return (
		<div className="space-y-6">
			<div className="mb-4">
				<BackButton />
			</div>
			<div className="flex items-start justify-between flex-wrap gap-4">
				<div>
					<h1 className="text-3xl font-bold mb-2">Test Results</h1>
					<p className="text-muted-foreground">
						{job.name} • {job.jobTitle}
					</p>
				</div>
				<div className="flex items-center gap-2">
					<Badge variant="outline" className="capitalize">
						{getQuestionTypeLabel(test.questionType)}
					</Badge>
					<Badge variant="outline">{test.totalQuestions} Questions</Badge>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<Card className={`${getScoreBgColor(test.score)} border`}>
					<CardHeader>
						<CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
							<Trophy className="size-4" />
							Score
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className={`text-4xl font-bold ${getScoreColor(test.score)}`}>{test.score}%</div>
						<p className="text-sm text-muted-foreground mt-1">
							{correctCount}/{test.totalQuestions} correct
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
							<Target className="size-4" />
							Performance
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-semibold">
							{test.score >= 80 ? 'Excellent' : test.score >= 60 ? 'Good' : 'Needs Practice'}
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
							<Calendar className="size-4" />
							Completed
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-sm">{formatDate(test.completedAt || test.createdAt)}</div>
					</CardContent>
				</Card>
			</div>
			<Card>
				<CardHeader>
					<CardTitle>Questions & Answers</CardTitle>
					<CardDescription>Review your responses and learn from explanations</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					{test.questions.map((question, index) => {
						const answer = test.answers.find((a) => a.questionId === question.id);
						const isCorrect = answer?.isCorrect ?? false;
						return (
							<div key={question.id} className="border rounded-lg p-4 space-y-3">
								<div className="flex items-start justify-between gap-4">
									<div className="flex-1">
										<div className="flex items-center gap-2 mb-2">
											<Badge variant="outline">Q{index + 1}</Badge>
											<Badge variant="secondary" className="capitalize">
												{question.type.replace('-', ' ')}
											</Badge>
											{isCorrect ? (
												<CheckCircle className="size-5 text-green-500" />
											) : (
												<XCircle className="size-5 text-red-500" />
											)}
										</div>
										<p className="font-medium">{question.question}</p>
									</div>
								</div>
								{answer && (
									<div className="pl-4 border-l-2 border-muted space-y-2">
										<div>
											<p className="text-sm text-muted-foreground">Your Answer:</p>
											<p className={isCorrect ? 'text-green-600' : 'text-red-600'}>
												{answer.userAnswer}
											</p>
										</div>
										{!isCorrect && (
											<div>
												<p className="text-sm text-muted-foreground">Correct Answer:</p>
												<p className="text-green-600">{question.correctAnswer}</p>
											</div>
										)}
										<div>
											<p className="text-sm text-muted-foreground">Explanation:</p>
											<p className="text-sm">{question.explanation}</p>
										</div>
									</div>
								)}
							</div>
						);
					})}
				</CardContent>
			</Card>
		</div>
	);
}

export default TechnicalTestDetail;
