import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Calendar, TrendingUp, TrendingDown, MessageSquare, FileText, Lightbulb } from 'lucide-react';
import BackButton from '@/components/BackButton';

function InterviewDetail({ interview, job }: InterviewDetailProps) {
	const formatDuration = (seconds?: number) => {
		if (!seconds) return 'N/A';
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;
		return `${minutes}m ${remainingSeconds}s`;
	};

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		});
	};

	const getScoreColor = (score?: number) => {
		if (!score) return 'text-muted-foreground';
		if (score >= 80) return 'text-green-500';
		if (score >= 60) return 'text-yellow-500';
		return 'text-red-500';
	};

	const getScoreBgColor = (score?: number) => {
		if (!score) return 'bg-muted';
		if (score >= 80) return 'bg-green-500/10 border-green-500/20';
		if (score >= 60) return 'bg-yellow-500/10 border-yellow-500/20';
		return 'bg-red-500/10 border-red-500/20';
	};

	const parseTranscript = (transcript?: string): TranscriptMessage[] => {
		if (!transcript) return [];
		const lines = transcript.split('\n\n');
		return lines
			.map((line) => {
				const match = line.match(/^(ASSISTANT|USER):\s*(.+)$/);
				if (match) {
					return {
						role: match[1].toLowerCase(),
						content: match[2].trim(),
					};
				}
				return null;
			})
			.filter((msg): msg is TranscriptMessage => msg !== null);
	};
	const messages = parseTranscript(interview.transcript);

	return (
		<div className="space-y-6">
			<div className="mb-6">
				<BackButton />
				<div className="flex items-start justify-between flex-wrap gap-4">
					<div>
						<h1 className="text-3xl font-bold mb-2">Interview Details</h1>
						<p className="text-muted-foreground">
							{job.name} • {job.jobTitle}
						</p>
					</div>
					<div className="flex items-center gap-2">
						<Badge variant="outline" className="capitalize">
							{interview.type}
						</Badge>
						<Badge variant="outline">{interview.questionCount} Questions</Badge>
					</div>
				</div>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<Card className={`${getScoreBgColor(interview.score)} border`}>
					<CardHeader>
						<CardTitle className="text-sm font-medium text-muted-foreground">Score</CardTitle>
					</CardHeader>
					<CardContent>
						<div className={`text-4xl font-bold ${getScoreColor(interview.score)}`}>
							{interview.score !== undefined ? `${interview.score}%` : 'N/A'}
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
							<Clock className="size-4" />
							Duration
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-semibold">{formatDuration(interview.duration)}</div>
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
						<div className="text-sm">{formatDate(interview.completedAt || interview.createdAt)}</div>
					</CardContent>
				</Card>
			</div>
			{interview.feedback && (
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<FileText className="size-5" />
							AI Feedback
						</CardTitle>
						<CardDescription>Detailed analysis of your interview performance</CardDescription>
					</CardHeader>
					<CardContent>
						<p className="text-sm leading-relaxed whitespace-pre-wrap">{interview.feedback}</p>
					</CardContent>
				</Card>
			)}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				{interview.strengths && interview.strengths.length > 0 && (
					<Card className="bg-green-500/5 border-green-500/20">
						<CardHeader>
							<CardTitle className="flex items-center gap-2 text-green-600 dark:text-green-400">
								<TrendingUp className="size-5" />
								Strengths
							</CardTitle>
						</CardHeader>
						<CardContent>
							<ul className="space-y-2">
								{interview.strengths.map((strength, index) => (
									<li key={index} className="flex items-start gap-2 text-sm">
										<span className="text-green-600 dark:text-green-400 mt-0.5">✓</span>
										<span>{strength}</span>
									</li>
								))}
							</ul>
						</CardContent>
					</Card>
				)}
				{interview.improvements && interview.improvements.length > 0 && (
					<Card className="bg-yellow-500/5 border-yellow-500/20">
						<CardHeader>
							<CardTitle className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
								<TrendingDown className="size-5" />
								Areas for Improvement
							</CardTitle>
						</CardHeader>
						<CardContent>
							<ul className="space-y-2">
								{interview.improvements.map((improvement, index) => (
									<li key={index} className="flex items-start gap-2 text-sm">
										<span className="text-yellow-600 dark:text-yellow-400 mt-0.5">→</span>
										<span>{improvement}</span>
									</li>
								))}
							</ul>
						</CardContent>
					</Card>
				)}
			</div>
			{interview.questionExamples && interview.questionExamples.length > 0 && (
				<Card className="bg-blue-500/5 border-blue-500/20">
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
							<Lightbulb className="size-5" />
							Example Answers
						</CardTitle>
						<CardDescription>
							High-quality example answers to help you improve your responses
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-6">
							{interview.questionExamples.map((example, index) => (
								<div key={index} className="space-y-2">
									<div className="flex items-start gap-2">
										<span className="font-semibold text-blue-600 dark:text-blue-400 min-w-[2rem]">
											Q{index + 1}:
										</span>
										<p className="text-sm font-medium">{example.question}</p>
									</div>
									<div className="ml-8 p-4 bg-muted/50 rounded-lg border border-blue-500/10">
										<p className="text-sm leading-relaxed whitespace-pre-wrap text-muted-foreground">
											{example.exampleAnswer}
										</p>
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			)}
			{interview.transcript && (
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<MessageSquare className="size-5" />
							Interview Transcript
						</CardTitle>
						<CardDescription>Full conversation recording</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
							{messages.map((message: TranscriptMessage, index: number) => (
								<div
									key={index}
									className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
								>
									<div
										className={`max-w-[80%] rounded-lg p-4 ${
											message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'
										}`}
									>
										<div className="text-xs font-semibold mb-1 opacity-70">
											{message.role === 'user' ? 'You' : 'AI Interviewer'}
										</div>
										<p className="text-sm leading-relaxed">{message.content}</p>
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			)}
		</div>
	);
}

export default InterviewDetail;
