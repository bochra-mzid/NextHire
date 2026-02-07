'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LoadingOverlay } from '@/components/ui/loading-overlay';
import { toast } from 'sonner';
import { Upload, FileText, CheckCircle, AlertCircle, Lightbulb, Target, Sparkles, X } from 'lucide-react';

function ResumeOptimizer({ job }: { job: Job }) {
	const [resumeFile, setResumeFile] = useState<File | null>(null);
	const [isAnalyzing, setIsAnalyzing] = useState(false);
	const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file) return;

		if (file.type === 'application/pdf') {
			setResumeFile(file);
		} else {
			toast.error('Please upload a PDF file.');
		}

		if (fileInputRef.current) {
			fileInputRef.current.value = '';
		}
	};

	const handleRemoveFile = () => {
		setResumeFile(null);
		setAnalysis(null);
	};

	const handleAnalyze = async () => {
		setIsAnalyzing(true);
		setAnalysis(null);

		try {
			const formData = new FormData();
			formData.append('resume', resumeFile!);
			formData.append('jobTitle', job.jobTitle);
			formData.append('jobDescription', job.description);
			formData.append('experienceLevel', job.level);

			const response = await fetch('/api/resume/optimize', {
				method: 'POST',
				body: formData,
			});
			const { success, analysis } = await response.json();
			if (!success) {
				throw new Error('Failed to analyze resume');
			}
			setAnalysis(analysis);
		} catch {
			toast.error('Failed to analyze resume. Please try again.');
		} finally {
			setIsAnalyzing(false);
		}
	};

	const getPriorityColor = (priority: string) => {
		switch (priority) {
			case 'high':
				return 'bg-red-500/10 text-red-500 border-red-500/20';
			case 'medium':
				return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
			case 'low':
				return 'bg-green-500/10 text-green-500 border-green-500/20';
			default:
				return '';
		}
	};

	const getScoreColor = (score: number) => {
		if (score >= 80) return 'text-green-500';
		if (score >= 60) return 'text-yellow-500';
		return 'text-red-500';
	};

	if (isAnalyzing) {
		return <LoadingOverlay message="Analyzing your resume..." />;
	}

	return (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<FileText className="size-5" />
						Your Resume
					</CardTitle>
					<CardDescription>
						Upload your resume as a PDF to get personalized optimization suggestions for this job.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<input
						type="file"
						ref={fileInputRef}
						onChange={handleFileUpload}
						accept=".pdf"
						className="hidden"
					/>
					{!resumeFile ? (
						<div
							onClick={() => fileInputRef.current?.click()}
							className="border-2 border-dashed rounded-lg p-12 text-center cursor-pointer hover:border-primary hover:bg-muted/50 transition-colors"
						>
							<Upload className="size-12 mx-auto mb-4 text-muted-foreground" />
							<p className="font-medium">Click to upload your resume</p>
							<p className="text-sm text-muted-foreground mt-1">PDF files only</p>
						</div>
					) : (
						<div className="border rounded-lg p-4 flex items-center justify-between bg-muted/50">
							<div className="flex items-center gap-3">
								<FileText className="size-8 text-primary" />
								<p className="font-medium">{resumeFile.name}</p>
							</div>
							<Button variant="ghost" size="icon" onClick={handleRemoveFile}>
								<X className="size-4" />
							</Button>
						</div>
					)}
					<Button onClick={handleAnalyze} disabled={!resumeFile} className="w-full" size="lg">
						<Sparkles className="mr-2 size-4" />
						Analyze & Optimize
					</Button>
				</CardContent>
			</Card>
			{analysis && (
				<div className="space-y-6">
					<Card>
						<CardHeader>
							<div className="flex items-center justify-between">
								<CardTitle>Analysis Results</CardTitle>
								<div className={`text-4xl font-bold ${getScoreColor(analysis.overallScore)}`}>
									{analysis.overallScore}/100
								</div>
							</div>
							<CardDescription className="text-base mt-2">{analysis.summary}</CardDescription>
						</CardHeader>
					</Card>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2 text-green-500">
									<CheckCircle className="size-5" />
									Strengths
								</CardTitle>
							</CardHeader>
							<CardContent>
								<ul className="space-y-2">
									{analysis.strengths.map((strength, i) => (
										<li key={i} className="flex items-start gap-2">
											<span className="text-green-500 mt-1">•</span>
											<span>{strength}</span>
										</li>
									))}
								</ul>
							</CardContent>
						</Card>
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2 text-red-500">
									<AlertCircle className="size-5" />
									Areas to Improve
								</CardTitle>
							</CardHeader>
							<CardContent>
								<ul className="space-y-2">
									{analysis.weaknesses.map((weakness, i) => (
										<li key={i} className="flex items-start gap-2">
											<span className="text-red-500 mt-1">•</span>
											<span>{weakness}</span>
										</li>
									))}
								</ul>
							</CardContent>
						</Card>
					</div>
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Target className="size-5" />
								Keyword Analysis
							</CardTitle>
							<CardDescription>Important keywords from the job description</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div>
								<h4 className="font-medium mb-2 text-green-500">✓ Keywords Found</h4>
								<div className="flex flex-wrap gap-2">
									{analysis.keywordMatch.matched.map((keyword, i) => (
										<Badge
											key={i}
											variant="outline"
											className="bg-green-500/10 border-green-500/20"
										>
											{keyword}
										</Badge>
									))}
									{analysis.keywordMatch.matched.length === 0 && (
										<span className="text-muted-foreground text-sm">
											No matching keywords found
										</span>
									)}
								</div>
							</div>
							<div>
								<h4 className="font-medium mb-2 text-red-500">✗ Missing Keywords</h4>
								<div className="flex flex-wrap gap-2">
									{analysis.keywordMatch.missing.map((keyword, i) => (
										<Badge key={i} variant="outline" className="bg-red-500/10 border-red-500/20">
											{keyword}
										</Badge>
									))}
									{analysis.keywordMatch.missing.length === 0 && (
										<span className="text-muted-foreground text-sm">
											Great! No major keywords missing
										</span>
									)}
								</div>
							</div>
						</CardContent>
					</Card>
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Lightbulb className="size-5" />
								Actionable Suggestions
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{analysis.suggestions.map((suggestion, i) => (
									<div key={i} className="border rounded-lg p-4 space-y-2">
										<div className="flex items-center justify-between">
											<Badge variant="secondary">{suggestion.category}</Badge>
											<Badge className={getPriorityColor(suggestion.priority)}>
												{suggestion.priority} priority
											</Badge>
										</div>
										<p className="font-medium">{suggestion.issue}</p>
										<p className="text-muted-foreground">{suggestion.recommendation}</p>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Sparkles className="size-5" />
								Suggested Professional Summary
							</CardTitle>
							<CardDescription>Use this tailored summary at the top of your resume</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="bg-muted p-4 rounded-lg italic">
								{analysis.tailoredSummary};
							</div>
						</CardContent>
					</Card>
				</div>
			)}
		</div>
	);
}

export default ResumeOptimizer;
