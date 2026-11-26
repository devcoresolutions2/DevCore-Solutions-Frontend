import Link from "next/link";
import { FileText, ArrowLeft } from "lucide-react";

export const metadata = {
    title: "Terms of Service | DevCore Solutions",
    description: "Engagement terms, intellectual property ownership, and delivery standards at DevCore Solutions.",
};

export default function TermsOfServicePage() {
    return (
        <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-32 pb-24 space-y-8">
            <Link
                href="/"
                className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-[var(--brand-primary)] hover:underline"
            >
                <ArrowLeft size={13} />
                <span>Back to Home</span>
            </Link>

            <div className="devcore-glass-card p-7 sm:p-10 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full devcore-glass-badge font-mono text-[11px] font-bold text-[var(--brand-primary)]">
                    <FileText size={13} />
                    <span>ENGAGEMENT TERMS · 2026 EDITION</span>
                </div>

                <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-[var(--text-primary)] tracking-tight">
                    Terms of Service
                </h1>

                <div className="space-y-5 text-sm text-[var(--text-secondary)] leading-relaxed">
                    <section className="space-y-2">
                        <h2 className="font-display font-bold text-lg text-[var(--text-primary)]">
                            1. Scope &amp; Milestone Delivery
                        </h2>
                        <p>
                            Every engineering engagement is governed by a mutually signed Statement of Work (SOW) specifying architectural deliverables, sprint milestones, acceptance criteria, and fixed pricing.
                        </p>
                    </section>

                    <section className="space-y-2">
                        <h2 className="font-display font-bold text-lg text-[var(--text-primary)]">
                            2. 100% Client Intellectual Property Ownership
                        </h2>
                        <p>
                            Upon milestone completion and settlement, full ownership of custom source code, database schemas, design tokens, and deployment configurations transfers exclusively to the client.
                        </p>
                    </section>

                    <section className="space-y-2">
                        <h2 className="font-display font-bold text-lg text-[var(--text-primary)]">
                            3. Warranty &amp; Production Support
                        </h2>
                        <p>
                            All production releases include post-launch stabilization support and optional SLA-backed maintenance retainers.
                        </p>
                    </section>
                </div>
            </div>
        </main>
    );
}