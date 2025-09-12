// lib/jobs.ts
export type Job = {
  id: string;
  title: string;
  company: string;
  location?: string;
  url?: string;
  source?: string;
  notes?: string;
  postedAt?: string;
  expiresAt?: string;
};

export const STATIC_JOBS: Job[] = [
  //   {
  //     id: "example-eit-bridge",
  //     title: "Engineer in Training I, Bridge",
  //     company: "Colorado Department of Transportation (DOT)",
  //     location: "Eagle County, CO",
  //     notes: "DOT roles may require an active account before applying.",
  //     postedAt: "2025-09-01",
  //   },
];
