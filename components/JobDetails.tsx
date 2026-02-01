'use client';

import { useState } from 'react';
import JobActions from '@/components/JobActions';
import JobForm from '@/components/JobForm';

function JobDetails({ job }: JobDetailsProps) {
	const [isEditing, setIsEditing] = useState(false);

	return (
		<>
			<JobActions job={job} isEditing={isEditing} setIsEditing={setIsEditing} />
			<JobForm job={job} isEditing={isEditing} setIsEditing={setIsEditing} />
		</>
	);
}

export default JobDetails;

