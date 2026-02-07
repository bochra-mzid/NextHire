'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { LoadingOverlay } from '@/components/ui/loading-overlay';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { EXPERIENCE_LEVELS, type ExperienceLevel } from '@/lib/constants';

function TechnicalTestConfiguration({ job, user, onTestStarted }: TechnicalTestConfigurationProps) {
	const [questionType, setQuestionType] = useState<TechnicalTestQuestionType>('multiple-choice');
	const [questionCount, setQuestionCount] = useState<number>(5);
	const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>('mid');
	const [isStarting, setIsStarting] = useState(false);

	const handleStart = async () => {
		if (!job || !user) {
			toast.error('Job or user information missing');
			return;
		}

		setIsStarting(true);
		try {
			const response = await fetch('/api/technical-test/generate', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					questionType,
					jobId: job.id,
					title: job.jobTitle,
					level: experienceLevel,
					questionCount,
					userId: user.id,
					description: job.description,
				}),
			});
			const data = await response.json();
			if (!data.success || !data.test) {
				toast.error(data.error || 'Failed to generate test questions');
				return;
			}
			onTestStarted(data.test.id, data.test);
		} catch (error) {
			toast.error('Failed to start test');
			console.error('Error starting test:', error);
		} finally {
			setIsStarting(false);
		}
	};

	if (isStarting) {
		return <LoadingOverlay message="Generating test questions..." />;
	}

	return (
		<Card className="w-full p-6">
			<h2 className="text-2xl font-bold mb-6">Technical Test Configuration</h2>
			<div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_auto] gap-4">
				<div className="space-y-2">
					<Label htmlFor="question-type">Question Type</Label>
					<Select
						value={questionType}
						onValueChange={(value) => setQuestionType(value as TechnicalTestQuestionType)}
					>
						<SelectTrigger id="question-type" className="w-full !h-14 py-4">
							<SelectValue placeholder="Select question type" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="multiple-choice">
								<div className="flex flex-col items-start">
									<span className="font-medium">Multiple Choice</span>
									<span className="text-xs text-muted-foreground">
										Select the correct answer from options
									</span>
								</div>
							</SelectItem>
							<SelectItem value="written">
								<div className="flex flex-col items-start">
									<span className="font-medium">Written Answer</span>
									<span className="text-xs text-muted-foreground">
										Type your answer in free-form text
									</span>
								</div>
							</SelectItem>
							<SelectItem value="riddles">
								<div className="flex flex-col items-start">
									<span className="font-medium">Riddles & Puzzles</span>
									<span className="text-xs text-muted-foreground">
										Brain teasers and logic puzzles
									</span>
								</div>
							</SelectItem>
							<SelectItem value="mixed">
								<div className="flex flex-col items-start">
									<span className="font-medium">Mixed</span>
									<span className="text-xs text-muted-foreground">
										Combination of all question types
									</span>
								</div>
							</SelectItem>
						</SelectContent>
					</Select>
				</div>
				<div className="space-y-2">
					<Label htmlFor="experience-level">Experience Level</Label>
					<Select
						value={experienceLevel}
						onValueChange={(value) => setExperienceLevel(value as ExperienceLevel)}
					>
						<SelectTrigger id="experience-level" className="w-full !h-14 py-4">
							<SelectValue placeholder="Select experience level" />
						</SelectTrigger>
						<SelectContent>
							{EXPERIENCE_LEVELS.map((level) => (
								<SelectItem key={level.value} value={level.value}>
									<div className="flex flex-col items-start">
										<span className="font-medium">{level.label}</span>
										<span className="text-xs text-muted-foreground">{level.description}</span>
									</div>
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<div className="space-y-2">
					<Label htmlFor="question-count">Number of Questions</Label>
					<Select
						value={questionCount.toString()}
						onValueChange={(value) => setQuestionCount(parseInt(value))}
					>
						<SelectTrigger id="question-count" className="w-full !h-14 py-4">
							<SelectValue placeholder="Select number of questions" />
						</SelectTrigger>
						<SelectContent>
							{[5, 10, 15, 20].map((count) => (
								<SelectItem key={count} value={count.toString()}>
									<span className="font-medium">{count} Questions</span>
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<div className="flex items-end">
					<Button className="!h-14" size="lg" onClick={handleStart}>
						Start Test
					</Button>
				</div>
			</div>
		</Card>
	);
}

export default TechnicalTestConfiguration;
