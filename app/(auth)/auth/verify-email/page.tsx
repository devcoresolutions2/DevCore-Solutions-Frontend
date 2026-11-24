import { Suspense } from "react";
import { VerifyEmailView } from "@/components/auth/VerifyEmailView";

export const metadata = {
  title: "Verify Your Email | DevCore Solutions",
  description: "Cryptographic email identity challenge and verification gateway.",
};

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[var(--bg-canvas)]">
          <div className="w-8 h-8 border-2 border-[var(--brand-primary)] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <VerifyEmailView />
    </Suspense>
  );
}
