import React from "react";
import { Key, ShieldCheck, UserCheck, Terminal } from "lucide-react";

export function AuthBrandingPanel() {
  return (
    <div className="hidden lg:flex relative w-full lg:w-[45%] bg-[#131619] text-[#FAF8F5] p-8 sm:p-12 lg:p-16 flex-col justify-between overflow-hidden shadow-2xl shrink-0">
      {/* Ambient Optical Mesh Gradients */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 -right-24 w-80 h-80 rounded-full bg-cyan-500/10 blur-[130px] pointer-events-none" />
      <div className="absolute -bottom-24 left-16 w-88 h-88 rounded-full bg-[#546571]/20 blur-[110px] pointer-events-none" />
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: "radial-gradient(#ffffff08 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Top Header & Brand Identity */}
      <div className="relative z-10 flex flex-col space-y-10">
        <div className="flex items-center space-x-3">
          <img
            src="https://res.cloudinary.com/vrbru3ro/image/upload/v1795471040/devcore/branding/logo-dark.png"
            alt="DevCore Solutions"
            className="h-10 w-auto object-contain"
          />
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#B5B2AE] px-2 py-0.5 rounded bg-white/5 border border-white/10">
            v4.8.2-prod
          </span>
        </div>

        {/* Hero Headline & Core Philosophy */}
        <div className="space-y-4 max-w-lg">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Zero-Drift Architecture Verified</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl text-white font-bold font-mono leading-tight tracking-tight">
            Building the Digital Core for a Smarter Tomorrow.
          </h1>
          <p className="text-sm sm:text-base text-[#c6c7c4] leading-relaxed font-sans">
            Enterprise technical systems engineering, verified cloud runtimes, and distributed
            software systems engineered under deterministic zero-drift guarantees.
          </p>
        </div>

        {/* 3 Assurances Bento Cards with Frosted Dark Glass */}
        <div className="space-y-3 max-w-lg pt-2">
          {/* Assurance 1 */}
          <div className="p-4 rounded-xl bg-white/[0.04] backdrop-blur-md border border-white/10 hover:border-emerald-500/30 transition-all">
            <div className="flex items-start space-x-3.5">
              <div className="p-2 rounded-lg bg-white/5 text-emerald-400 mt-0.5">
                <Key className="w-4 h-4" />
              </div>
              <div className="space-y-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <h3 className="text-sm font-semibold text-white font-mono">Encrypted Sessions</h3>
                  <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider px-1.5 py-0.2 rounded bg-emerald-500/10">
                    AES-256
                  </span>
                </div>
                <p className="text-xs text-[#c6c7c4] leading-relaxed font-sans">
                  Hardware-backed session tokens with automated rotation &amp; TLS 1.3 cryptographic
                  integrity.
                </p>
              </div>
            </div>
          </div>

          {/* Assurance 2 */}
          <div className="p-4 rounded-xl bg-white/[0.04] backdrop-blur-md border border-white/10 hover:border-cyan-500/30 transition-all">
            <div className="flex items-start space-x-3.5">
              <div className="p-2 rounded-lg bg-white/5 text-cyan-400 mt-0.5">
                <UserCheck className="w-4 h-4" />
              </div>
              <div className="space-y-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <h3 className="text-sm font-semibold text-white font-mono">Email-Verified Accounts</h3>
                  <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider px-1.5 py-0.2 rounded bg-cyan-500/10">
                    Multi-Factor
                  </span>
                </div>
                <p className="text-xs text-[#c6c7c4] leading-relaxed font-sans">
                  Strict cryptographic email verification ensuring high-assurance corporate identity
                  validation.
                </p>
              </div>
            </div>
          </div>

          {/* Assurance 3 */}
          <div className="p-4 rounded-xl bg-white/[0.04] backdrop-blur-md border border-white/10 hover:border-[#b7c9d7]/40 transition-all">
            <div className="flex items-start space-x-3.5">
              <div className="p-2 rounded-lg bg-white/5 text-[#d0e2f0] mt-0.5">
                <Terminal className="w-4 h-4" />
              </div>
              <div className="space-y-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <h3 className="text-sm font-semibold text-white font-mono">Role-Based Access</h3>
                  <span className="text-[10px] font-mono text-[#b7c9d7] uppercase tracking-wider px-1.5 py-0.2 rounded bg-white/10">
                    RBAC
                  </span>
                </div>
                <p className="text-xs text-[#c6c7c4] leading-relaxed font-sans">
                  Deterministic granular access control mapping client telemetry, staff engineers,
                  and admin dashboards.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Cryptographic Status */}
      <div className="relative z-10 pt-8 mt-6 border-t border-white/10 space-y-3">
        <div className="flex items-center justify-between text-xs font-mono">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-white tracking-wide">SYS_STATUS: ALL SYSTEMS NOMINAL</span>
          </div>
          <span className="text-emerald-400">P99 &lt; 14ms</span>
        </div>
        <div className="flex items-center justify-between text-[11px] font-mono text-[#847E7A] bg-black/40 px-3 py-2 rounded-lg border border-white/5">
          <span className="text-white/40">NODE FINGERPRINT:</span>
          <span className="text-emerald-300/80 tracking-wider">
            4A9F E320 882C B771 05F4 C09E D28B 1150
          </span>
        </div>
      </div>
    </div>
  );
}
