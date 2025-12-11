import { ResumeKeywords } from './geminiService';

export interface Job {
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

const apiKey = import.meta.env.VITE_APIFY_TOKEN;

export class JobService {
  // For demo purposes, we'll return mock data
  // In production, replace this with actual job API integration
  async searchJobs(keywords: ResumeKeywords): Promise<Job[]> {
    const result = await fetch('https://api.apify.com/v2/acts/bluelightco~jobscan-ai/run-sync-get-dataset-items?token=' + apiKey, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "mandatory_keywords": [
          ...keywords
        ],
        "search_sites": [
          "boards.greenhouse.io",
          "jobs.lever.co",
          "myworkdayjobs.com",
          "careers.smartrecruiters.com",
          "jobs.jobvite.com",
          "careers.icims.com",
          "angel.co",
          "stackoverflow.com/jobs",
          "weworkremotely.com",
          "remotive.io",
          "bamboohr.com",
          "https://www.linkedin.com/jobs"
        ]
      })
    })

    const data = (await result.json()) as Job[];

    return data;
  }
} 3