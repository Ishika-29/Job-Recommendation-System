import React from 'react';

interface Job {
  company_name: string;
  role_name: string;
  job_description: string;
  requirements: string;
  salary: string;
  employment_type: string;
  remote: string;
  location: string;
  country: string;
  publish_date: string;
  url: string;
  viewed_date: string;
}

interface JobCardProps {
  job: Job;
  index: number;
}

export const JobCard: React.FC<JobCardProps> = ({ job, index }) => {
  return (
    <pre>
      <code>
        {JSON.stringify(job, null, 2)}
      </code>
    </pre>
  );
};