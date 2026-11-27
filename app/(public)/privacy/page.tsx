import Link from "next/link";
import { ShieldCheck, ArrowLeft } from "lucide-react";

export const metadata = {
    title: "Privacy Policy | DevCore Solutions",
    description: "How DevCore Solutions collects, processes, and safeguards client and visitor data.",
};

export default function PrivacyPolicyPage() {
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
                    <ShieldCheck size={13} />
                    <span>DATA GOVERNANCE · EFFECTIVE NOVEMBER 2026</span>
                </div>

                <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-[var(--text-primary)] tracking-tight">
                    Privacy Policy
                </h1>

                <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
                    DevCore Solutions (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;) respects your privacy and protects all project briefs, technical specifications, and contact information submitted through our platform.
                </p>

                <div className="space-y-5 text-sm text-[var(--text-secondary)] leading-relaxed">
                    <section className="space-y-2">
                        <h2 className="font-display font-bold text-lg text-[var(--text-primary)]">
                            1. Information We Collect
                        </h2>
                        <p>
                            We collect only the contact details (name, work email, phone/WhatsApp handle, and project requirements) you voluntarily submit when requesting a consultation, callback, or proposal.
                        </p>
                    </section>

                    <section className="space-y-2">
                        <h2 className="font-display font-bold text-lg text-[var(--text-primary)]">
                            2. Confidentiality &amp; NDA Protection
                        </h2>
                        <p>
                            All architectural documents, source repositories, and commercial product ideas shared during discovery are treated as strictly confidential and never shared with third-party brokers.
                        </p>
                    </section>

                    <section className="space-y-2">
                        <h2 className="font-display font-bold text-lg text-[var(--text-primary)]">
                            3. Data Retention &amp; Contact
                        </h2>
                        <p>
                            To request access to, correction of, or deletion of your inquiry records, email{" "}
                            <a
                                href="mailto:dev.core.solution2@gmail.com"
                                className="font-semibold text-[var(--brand-primary)] hover:underline"
                            >
                                dev.core.solution2@gmail.com
                            </a>
                            .
                        </p>
                    </section>
                </div>
            </div>
        </main>
    );
}