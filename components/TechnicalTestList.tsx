import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronRight } from 'lucide-react';

function formatDate(dateString: string) {
	const date = new Date(dateString);
	return date.toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	});
}

function getQuestionTypeLabel(type: TechnicalTestQuestionType) {
	const labels: Record<TechnicalTestQuestionType, string> = {
		'multiple-choice': 'Multiple Choice',
		written: 'Written Answer',
		riddles: 'Riddles & Puzzles',
		mixed: 'Mixed',
	};
	return labels[type];
}

function getScoreColor(score: number) {
	if (score >= 80) return 'text-green-600';
	if (score >= 60) return 'text-yellow-600';
	return 'text-red-600';
}

function TechnicalTestList({ tests, jobId }: TechnicalTestListProps) {
	if (tests.length === 0) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Test History</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="text-center py-8 text-muted-foreground">
						<p>No technical tests yet. Start your first test to practice!</p>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Test History ({tests.length})</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
					{tests.map((test) => (
						<Link
							key={test.id}
							href={`/jobs/${jobId}/technical-tests/${test.id}`}
							className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group"
						>
							<div className="flex-1 space-y-1">
								<div className="flex items-center gap-2 flex-wrap">
									<Badge variant="outline" className="capitalize">
										{getQuestionTypeLabel(test.questionType)}
									</Badge>
									<Badge variant="outline">{test.totalQuestions} Questions</Badge>
									{test.status === 'completed' && (
										<Badge variant="outline" className={getScoreColor(test.score)}>
											Score: {test.score}%
										</Badge>
									)}
								</div>
								<div className="flex items-center gap-4 text-sm text-muted-foreground">
									<span>{formatDate(test.completedAt || test.createdAt)}</span>
									{test.status === 'completed' && (
										<span>
											{test.answers.filter((a) => a.isCorrect).length}/{test.totalQuestions} correct
										</span>
									)}
								</div>
							</div>
							<ChevronRight className="size-5 text-muted-foreground group-hover:text-foreground transition-colors" />
						</Link>
					))}
				</div>
			</CardContent>
		</Card>
	);
}

export default TechnicalTestList;

