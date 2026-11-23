"use client";

import { useState, useMemo } from "react";
import { Search, MapPin, Briefcase, ArrowRight, Eye, Sparkles } from "lucide-react";
import { JobItem } from "@/lib/api";
import { JobDetailsModal } from "./JobDetailsModal";
import { cn } from "@/lib/utils";

interface JobListProps {
  jobs: JobItem[];
  onSelectRole: (job: JobItem) => void;
}

export function JobList({ jobs, onSelectRole }: JobListProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeJobDetails, setActiveJobDetails] = useState<JobItem | null>(null);

  // Extract unique departments from actual job data
  const departments = useMemo(() => {
    const set = new Set<string>();
    jobs.forEach((j) => {
      if (j.department) set.add(j.department);
    });
    return Array.from(set);
  }, [jobs]);

  // Filter jobs based on active tab and search
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesCategory =
        selectedCategory === "ALL" || job.department.toLowerCase() === selectedCategory.toLowerCase();

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        job.title.toLowerCase().includes(q) ||
        job.department.toLowerCase().includes(q) ||
        job.skills.some((s) => s.toLowerCase().includes(q)) ||
        job.location.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [jobs, selectedCategory, searchQuery]);

  return (
    <section id="roles-section" className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-12">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <span className="font-mono text-xs text-[var(--brand-primary)] uppercase tracking-wider font-bold">
            02 // Open Positions
          </span>
          <h2 className="font-display text-2xl sm:text-3xl text-[var(--text-primary)] font-extrabold tracking-tight mt-1">
            Current Strategic Openings ({filteredJobs.length})
          </h2>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <input
            type="text"
            placeholder="Search role, skill, or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-9 pr-4 rounded-xl text-xs bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] shadow-sm"
          />
          <Search size={15} className="absolute left-3 top-3 text-[var(--text-muted)]" />
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] w-fit mb-8">
        <button
          type="button"
          onClick={() => setSelectedCategory("ALL")}
          className={cn(
            "px-4 py-1.5 rounded-lg text-xs font-semibold transition-all",
            selectedCategory === "ALL"
              ? "bg-[var(--brand-primary)] text-[var(--brand-contrast)] shadow-sm"
              : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          )}
        >
          All Disciplines ({jobs.length})
        </button>
        {departments.map((dept) => {
          const count = jobs.filter((j) => j.department.toLowerCase() === dept.toLowerCase()).length;
          return (
            <button
              key={dept}
              type="button"
              onClick={() => setSelectedCategory(dept)}
              className={cn(
                "px-4 py-1.5 rounded-lg text-xs font-semibold transition-all",
                selectedCategory.toLowerCase() === dept.toLowerCase()
                  ? "bg-[var(--brand-primary)] text-[var(--brand-contrast)] shadow-sm"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              )}
            >
              {dept} ({count})
            </button>
          );
        })}
      </div>

      {/* Roles Listing Stack */}
      {filteredJobs.length === 0 ? (
        <div className="p-12 text-center rounded-2xl devcore-glass-card border border-[var(--border-subtle)] bg-[var(--bg-elevated)]/60 space-y-3">
          <div className="w-12 h-12 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-muted)] flex items-center justify-center mx-auto">
            <Briefcase size={22} />
          </div>
          <h3 className="font-display font-bold text-base text-[var(--text-primary)]">
            No open positions found
          </h3>
          <p className="text-xs text-[var(--text-secondary)] max-w-sm mx-auto">
            No active positions match your current search criteria. Try selecting another discipline or clear your search query.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory("ALL");
              setSearchQuery("");
            }}
            className="text-xs font-semibold text-[var(--brand-primary)] hover:underline pt-2 inline-block"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filteredJobs.map((job) => (
            <article
              key={job.id}
              className="rounded-2xl devcore-glass-card p-6 border border-[var(--border-subtle)] bg-[var(--bg-elevated)]/90 shadow-sm hover:border-[var(--border-strong)] transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6 group"
            >
              {/* Job Info */}
              <div className="flex flex-col gap-3 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded font-mono text-[11px] bg-[var(--bg-surface)] text-[var(--brand-primary)] border border-[var(--border-subtle)] font-bold uppercase tracking-wider">
                    {job.department}
                  </span>
                  <span className="text-[var(--text-muted)] font-mono text-xs flex items-center gap-1">
                    <MapPin size={13} /> {job.location} ({job.workplaceType})
                  </span>
                  <span className="text-[var(--text-muted)] font-mono text-xs">&bull; {job.type}</span>
                </div>

                <h3 className="font-display text-xl text-[var(--text-primary)] font-bold tracking-tight">
                  {job.title}
                </h3>

                <p className="text-xs text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
                  {job.description}
                </p>

                {/* Skills tags */}
                {job.skills && job.skills.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {job.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2.5 py-0.5 rounded bg-[var(--bg-surface)] border border-[var(--border-subtle)] font-mono text-[11px] text-[var(--text-secondary)]"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 shrink-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-[var(--border-subtle)]">
                <button
                  type="button"
                  onClick={() => setActiveJobDetails(job)}
                  className="h-10 px-4 rounded-lg bg-[var(--bg-surface)] hover:bg-[var(--bg-elevated)] border border-[var(--border-subtle)] hover:border-[var(--brand-primary)] text-xs font-semibold text-[var(--text-primary)] inline-flex items-center gap-1.5 transition-colors"
                >
                  <Eye size={14} />
                  <span>View Details</span>
                </button>

                <button
                  type="button"
                  onClick={() => onSelectRole(job)}
                  className="h-10 px-5 rounded-lg bg-[var(--brand-primary)] text-[var(--brand-contrast)] text-xs font-semibold hover:bg-[var(--brand-hover)] transition-all shadow-sm btn-liquid-hover inline-flex items-center gap-1.5 whitespace-nowrap"
                >
                  <span>Apply Now</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Modal Dialog for Job Details */}
      <JobDetailsModal
        job={activeJobDetails}
        isOpen={Boolean(activeJobDetails)}
        onClose={() => setActiveJobDetails(null)}
        onApply={(job) => onSelectRole(job)}
      />
    </section>
  );
}
