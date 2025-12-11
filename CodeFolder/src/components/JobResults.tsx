import React from 'react';
import { motion } from 'framer-motion';
import { JobCard } from './JobCard';
import { Briefcase } from 'lucide-react';

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

interface JobResultsProps {
  jobs: Job[];
}

export const JobResults: React.FC<JobResultsProps> = ({ jobs }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mt-12"
    >
      <div className="text-center mb-12">
        <p className="text-lg text-gray-600">
          We found {jobs.length} job{jobs.length !== 1 ? 's' : ''} that match your profile
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {jobs.map((job, index) => (
          <JobCard key={index} job={job} index={index} />
        ))}
      </div>
    </motion.div>
  );
};