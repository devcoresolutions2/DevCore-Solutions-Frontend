"use client";

import { useState } from "react";
import { JobItem } from "@/lib/api";
import { JobList } from "./JobList";
import { HiringProtocol } from "./HiringProtocol";
import { JobApplicationForm } from "./JobApplicationForm";

interface CareersContentProps {
  jobs: JobItem[];
}

export function CareersContent({ jobs }: CareersContentProps) {
  const [selectedJob, setSelectedJob] = useState<JobItem | null>(jobs[0] || null);

  const handleApplyClick = (job: JobItem) => {
    setSelectedJob(job);
    const formSection = document.getElementById("candidacy-form-section");
    if (formSection) {
      formSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <>
      {/* SECTION 2: OPEN ROLES DIRECTORY (3 ACTIVE ROLES) */}
      <JobList jobs={jobs} onSelectRole={handleApplyClick} />

      {/* SECTION 3: HIRING PROTOCOL TIMELINE */}
      <HiringProtocol />

      {/* SECTION 4: APPLICATION WORKFLOW FORM */}
      <JobApplicationForm
        jobs={jobs}
        selectedJob={selectedJob}
        onJobSelect={(job) => setSelectedJob(job)}
      />
    </>
  );
}
