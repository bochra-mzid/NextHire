'use client';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EXPERIENCE_LEVELS } from '@/lib/constants';
import { getExperienceLevelLabel } from '@/lib/utils';

function JobFormFields({ formData, onChange, readOnly = false }: JobFormFieldsProps) {
	const handleChange = (data: JobFormData) => {
		if (onChange) {
			onChange(data);
		}
	};

	return (
		<div className={readOnly ? 'space-y-6' : 'flex flex-col flex-1 gap-6'}>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				<div>
					<Label>Display Name</Label>
					{readOnly ? (
						<p className="text-lg mt-2">{formData.name}</p>
					) : (
						<Input
							id="name"
							value={formData.name}
							onChange={(e) => handleChange({ ...formData, name: e.target.value })}
							placeholder="Enter display name"
							className="mt-2"
						/>
					)}
				</div>
				<div>
					<Label>Job Title</Label>
					{readOnly ? (
						<p className="text-lg mt-2">{formData.jobTitle}</p>
					) : (
						<Input
							id="jobTitle"
							value={formData.jobTitle}
							onChange={(e) => handleChange({ ...formData, jobTitle: e.target.value })}
							placeholder="Enter job title"
							className="mt-2"
						/>
					)}
				</div>
				<div>
					<Label>Experience Level</Label>
					{readOnly ? (
						<p className="text-lg mt-2">
							<span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-sm font-medium text-primary">
								{getExperienceLevelLabel(formData.level)}
							</span>
						</p>
					) : (
						<Select
							value={formData.level}
							onValueChange={(value) => handleChange({ ...formData, level: value })}
						>
							<SelectTrigger className="mt-2 w-full">
								<SelectValue placeholder="Select experience level" />
							</SelectTrigger>
							<SelectContent>
								{EXPERIENCE_LEVELS.map((level) => (
									<SelectItem key={level.value} value={level.value}>
										{level.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					)}
				</div>
			</div>
			<div className={readOnly ? '' : 'flex flex-col flex-1'}>
				<Label>Job Description</Label>
				{readOnly ? (
					<div className="mt-2 p-4 bg-muted rounded-md whitespace-pre-wrap">{formData.description}</div>
				) : (
					<Textarea
						id="description"
						value={formData.description}
						onChange={(e) => handleChange({ ...formData, description: e.target.value })}
						placeholder="Paste the job description here..."
						className="mt-2 flex-1 min-h-48 max-h-none"
					/>
				)}
			</div>
		</div>
	);
}

export default JobFormFields;
