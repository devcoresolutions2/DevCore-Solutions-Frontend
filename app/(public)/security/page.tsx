import Link from "next/link";
import { Lock, ArrowLeft, CheckCircle2 } from "lucide-react";

export const metadata = {
    title: "Security & Vulnerability Disclosure | DevCore Solutions",
    description: "Security architecture practices and responsible vulnerability disclosure policy for DevCore Solutions.",
};

export default function SecurityPage() {
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
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full devcore-glass-badge font-mono text-[11px] font-bold text-[var(--success)]">
                    <Lock size={13} />
                    <span>ZERO-TRUST SECURITY &amp; DISCLOSURE</span>
                </div>

                <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-[var(--text-primary)] tracking-tight">
                    Vulnerability Disclosure &amp; Security
                </h1>

                <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
                    Security is engineered into every layer of DevCore Solutions&apos; software lifecycle—from strict Zod runtime validation and HTTP-only session cookies to tenant-isolated PostgreSQL schemas.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {[
                        "Encrypted TLS 1.3 transport & secrets management",
                        "Role-Based Access Control (RBAC) & OAuth 2.0",
                        "Automated dependency & CVE vulnerability audits",
                        "Idempotent webhook signature verification",
                    ].map((item) => (
                        <div
                            key={item}
                            className="p-4 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex items-start gap-2.5 text-xs font-medium text-[var(--text-primary)]"
                        >
                            <CheckCircle2 size={15} className="text-[var(--success)] shrink-0 mt-0.5" />
                            <span>{item}</span>
                        </div>
                    ))}
                </div>

                <div className="p-5 rounded-2xl devcore-glass-inset space-y-2 text-sm text-[var(--text-secondary)]">
                    <div className="font-mono text-xs font-bold uppercase text-[var(--brand-primary)]">
                        RESPONSIBLE DISCLOSURE CHANNEL
                    </div>
                    <p>
                        If you discover a potential security vulnerability in any DevCore Solutions domain or product, please report it confidentially to{" "}
                        <a
                            href="mailto:dev.core.solution2@gmail.com?subject=Security%20Disclosure"
                            className="font-semibold text-[var(--brand-primary)] hover:underline"
                        >
                            dev.core.solution2@gmail.com
                        </a>
                        . We acknowledge reports within 24 hours.
                    </p>
                </div>
            </div>
        </main>
    );
}