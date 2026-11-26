"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface TechBadgeProps {
  tech: string;
  className?: string;
  size?: "xs" | "sm" | "md";
  showIcon?: boolean;
}

// Normalized matching helper with official brand vectors
function getTechLogo(name: string): React.ReactNode | null {
  const n = name.trim().toLowerCase();

  // TypeScript (Crisp official blue badge + sharp white TS typography)
  if (
    n === "ts" ||
    n.includes("typescript") ||
    n.startsWith("ts ") ||
    n.includes("ts rest") ||
    n.includes("type script")
  ) {
    return (
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 rounded shrink-0 shadow-2xs">
        <rect width="24" height="24" rx="4" fill="#3178C6" />
        <path
          fill="#FFFFFF"
          d="M11.6 6.5H5.4v2.2h2v8.8h2.4v-8.8h1.8V6.5zm7 4.7c0-2.8-2.1-3.2-3.8-3.2-2.1 0-3.7.8-3.7 2.6 0 1.6 1.1 2.2 2.7 2.6l.8.2c1 .3 1.6.5 1.6 1.2 0 .8-.8 1.1-1.7 1.1-1.3 0-2.2-.5-2.6-1.1l-1.5 1.3c.8 1.1 2.2 1.8 4.1 1.8 2.5 0 4.1-1.3 4.1-3.3 0-1.8-1.2-2.5-3-2.9l-.8-.2c-.9-.2-1.3-.4-1.3-1 0-.6.6-.9 1.4-.9.9 0 1.7.3 2.1.8l1.7-1.4z"
        />
      </svg>
    );
  }

  // Next.js (Black disc + white border + pure white N)
  if (n.includes("next")) {
    return (
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 shrink-0">
        <circle cx="12" cy="12" r="11" fill="#000000" stroke="rgba(255,255,255,0.35)" strokeWidth="1" />
        <path fill="#FFFFFF" d="M18.665 21.978C16.758 23.255 14.465 24 12 24 5.377 24 0 18.623 0 12S5.377 0 12 0s12 5.377 12 12c0 3.583-1.574 6.801-4.067 9.001L9.219 7.2H7.2v9.596h1.615V9.251l9.85 12.727Zm-3.332-8.533 1.6 2.061V7.2h-1.6v6.245Z" />
      </svg>
    );
  }

  // React (Official cyan atom)
  if (n.includes("react")) {
    return (
      <svg viewBox="-11.5 -10.23 23 20.46" className="w-3.5 h-3.5 shrink-0">
        <circle cx="0" cy="0" r="2.05" fill="#61DAFB" />
        <g stroke="#61DAFB" strokeWidth="1" fill="none">
          <ellipse rx="11" ry="4.2" />
          <ellipse rx="11" ry="4.2" transform="rotate(60)" />
          <ellipse rx="11" ry="4.2" transform="rotate(120)" />
        </g>
      </svg>
    );
  }

  // Vite (Official gradient V)
  if (n === "vite" || n.includes("vite")) {
    return (
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 shrink-0">
        <path fill="#41D1FF" d="M13.056 23.238a.57.57 0 0 1-1.02-.355v-5.202c0-.63-.512-1.143-1.144-1.143H5.148a.57.57 0 0 1-.464-.903l3.777-5.29c.54-.753 0-1.804-.93-1.804H.57a.574.574 0 0 1-.543-.746.6.6 0 0 1 .08-.157L5.008.78a.57.57 0 0 1 .467-.24h14.589a.57.57 0 0 1 .466.903l-3.778 5.29c-.54.755 0 1.806.93 1.806h5.745c.238 0 .424.138.513.322a.56.56 0 0 1-.063.603z" />
        <path fill="#FFD859" d="M11.9 14.5l-2.4 4.8 5.5-10h-3.4l1.6-4.8-5.3 10h4z" />
      </svg>
    );
  }

  // Tailwind CSS (Official cyan waves)
  if (n.includes("tailwind")) {
    return (
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 shrink-0" fill="#06B6D4">
        <path d="M12.001,4.8c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 C13.666,10.618,15.027,12,18.001,12c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C16.337,6.182,14.976,4.8,12.001,4.8z M6.001,12c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 c1.177,1.194,2.538,2.576,5.512,2.576c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C10.337,13.382,8.976,12,6.001,12z" />
      </svg>
    );
  }

  // Framer Motion (Official Blue Triangles)
  if (n.includes("framer")) {
    return (
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 shrink-0" fill="#0055FF">
        <path d="M4 0h16v8h-8zM4 8h8l8 8H4zM4 16h8v8z" />
      </svg>
    );
  }

  // Node.js (Official Hexagon)
  if (n.includes("node")) {
    return (
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 shrink-0" fill="#5FA04E">
        <path d="M11.998,24c-0.321,0-0.641-0.084-0.922-0.247l-2.936-1.737c-0.438-0.245-0.224-0.332-0.08-0.383 c0.585-0.203,0.703-0.25,1.328-0.604c0.065-0.037,0.151-0.023,0.218,0.017l2.256,1.339c0.082,0.045,0.197,0.045,0.272,0l8.795-5.076 c0.082-0.047,0.134-0.141,0.134-0.238V6.921c0-0.099-0.053-0.192-0.137-0.242l-8.791-5.072c-0.081-0.047-0.189-0.047-0.271,0 L3.075,6.68C2.99,6.729,2.936,6.825,2.936,6.921v10.15c0,0.097,0.054,0.189,0.139,0.235l2.409,1.392 c1.307,0.654,2.108-0.116,2.108-0.89V7.787c0-0.142,0.114-0.253,0.256-0.253h1.115c0.139,0,0.255,0.112,0.255,0.253v10.021 c0,1.745-0.95,2.745-2.604,2.745c-0.508,0-0.909,0-2.026-0.551L2.28,18.675c-0.57-0.329-0.922-0.945-0.922-1.604V6.921 c0-0.659,0.353-1.275,0.922-1.603l8.795-5.082c0.557-0.315,1.296-0.315,1.848,0l8.794,5.082c0.57,0.329,0.924,0.944,0.924,1.603 v10.15c0,0.659-0.354,1.273-0.924,1.604l-8.794,5.078C12.643,23.916,12.324,24,11.998,24z M19.099,13.993 c0-1.9-1.284-2.406-3.987-2.763c-2.731-0.361-3.009-0.548-3.009-1.187c0-0.528,0.235-1.233,2.258-1.233 c1.807,0,2.473,0.389,2.747,1.607c0.024,0.115,0.129,0.199,0.247,0.199h1.141c0.071,0,0.138-0.031,0.186-0.081 c0.048-0.054,0.074-0.123,0.067-0.196c-0.177-2.098-1.571-3.076-4.388-3.076c-2.508,0-4.004,1.058-4.004,2.833 c0,1.925,1.488,2.457,3.895,2.695c2.88,0.282,3.103,0.703,3.103,1.269c0,0.983-0.789,1.402-2.642,1.402 c-2.327,0-2.839-0.584-3.011-1.742c-0.02-0.124-0.126-0.215-0.253-0.215h-1.137c-0.141,0-0.254,0.112-0.254,0.253 c0,1.482,0.806,3.248,4.655,3.248C17.501,17.007,19.099,15.91,19.099,13.993z" />
      </svg>
    );
  }

  // Express (Clean minimal devicon)
  if (n.includes("express")) {
    return (
      <svg viewBox="0 0 32 32" className="w-3.5 h-3.5 shrink-0">
        <rect width="32" height="32" rx="4" fill="#000" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
        <text x="5" y="21" fontFamily="system-ui, sans-serif" fontSize="13" fontWeight="bold" fill="#FFF">ex</text>
        <circle cx="25" cy="18" r="2.5" fill="#38BDF8" />
      </svg>
    );
  }

  // PostgreSQL / Neon (Official Slonik)
  if (n.includes("postgres") || n.includes("neon") || n.includes("pgvector")) {
    return (
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 shrink-0" fill="#4169E1">
        <path d="M23.5594 14.7228a.5269.5269 0 0 0-.0563-.1191c-.139-.2632-.4768-.3418-1.0074-.2321-1.6533.3411-2.2935.1312-2.5256-.0191 1.342-2.0482 2.445-4.522 3.0411-6.8297.2714-1.0507.7982-3.5237.1222-4.7316a1.5641 1.5641 0 0 0-.1509-.235C21.6931.9086 19.8007.0248 17.5099.0005c-1.4947-.0158-2.7705.3461-3.1161.4794a9.449 9.449 0 0 0-.5159-.0816 8.044 8.044 0 0 0-1.3114-.1278c-1.1822-.0184-2.2038.2642-3.0498.8406-.8573-.3211-4.7888-1.645-7.2219.0788C.9359 2.1526.3086 3.8733.4302 6.3043c.0409.818.5069 3.334 1.2423 5.7436.4598 1.5065.9387 2.7019 1.4334 3.582.553.9942 1.1259 1.5933 1.7143 1.7895.4474.1491 1.1327.1441 1.8581-.7279.8012-.9635 1.5903-1.8258 1.9446-2.2069.4351.2355.9064.3625 1.39.3772a.0569.0569 0 0 0 .0004.0041 11.0312 11.0312 0 0 0-.2472.3054c-.3389.4302-.4094.5197-1.5002.7443-.3102.064-1.1344.2339-1.1464.8115-.0025.1224.0329.2309.0919.3268.2269.4231.9216.6097 1.015.6331 1.3345.3335 2.5044.092 3.3714-.6787-.017 2.231.0775 4.4174.3454 5.0874.2212.5529.7618 1.9045 2.4692 1.9043.2505 0 .5263-.0291.8296-.0941 1.7819-.3821 2.5557-1.1696 2.855-2.9059.1503-.8707.4016-2.8753.5388-4.1012.0169-.0703.0357-.1207.057-.1362.0007-.0005.0697-.0471.4272.0307a.3673.3673 0 0 0 .0443.0068l.2539.0223.0149.001c.8468.0384 1.9114-.1426 2.5312-.4308.6438-.2988 1.8057-1.0323 1.5951-1.6698z" />
      </svg>
    );
  }

  // TanStack Query (Official Query Flower)
  if (n.includes("tanstack") || n.includes("query")) {
    return (
      <svg viewBox="0 0 32 32" className="w-3.5 h-3.5 shrink-0">
        <circle cx="16" cy="16" r="14" fill="#FF4154" />
        <path d="M16 7a9 9 0 1 0 6.36 15.36L26 26" stroke="#FFF" strokeWidth="3" strokeLinecap="round" fill="none" />
      </svg>
    );
  }

  // Stripe (Official blurple S)
  if (n.includes("stripe")) {
    return (
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 shrink-0" fill="#635BFF">
        <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.594-7.305h.003z" />
      </svg>
    );
  }

  // Firebase (Official Flame)
  if (n.includes("firebase") || n.includes("oauth")) {
    return (
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 shrink-0" fill="#FFCA28">
        <path d="M19.455 8.369c-.538-.748-1.778-2.285-3.681-4.569-.826-.991-1.535-1.832-1.884-2.245a146 146 0 0 0-.488-.576l-.207-.245-.113-.133-.022-.032-.01-.005L12.57 0l-.609.488c-1.555 1.246-2.828 2.851-3.681 4.64-.523 1.064-.864 2.105-1.043 3.176-.047.241-.088.489-.121.738-.209-.017-.421-.028-.632-.033-.018-.001-.035-.002-.059-.003a7.46 7.46 0 0 0-2.28.274l-.317.089-.163.286c-.765 1.342-1.198 2.869-1.252 4.416-.07 2.01.477 3.954 1.583 5.625 1.082 1.633 2.61 2.882 4.42 3.611l.236.095.071.025.003-.001a9.59 9.59 0 0 0 2.941.568q.171.006.342.006c1.273 0 2.513-.249 3.69-.742l.008.004.313-.145a9.63 9.63 0 0 0 3.927-3.335c1.01-1.49 1.577-3.234 1.641-5.042.075-2.161-.643-4.304-2.133-6.371" />
      </svg>
    );
  }

  // Nodemailer (Email transport)
  if (n.includes("nodemailer") || n.includes("mailer") || n.includes("mail")) {
    return (
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 shrink-0" fill="none" stroke="#00B0FF" strokeWidth="2">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    );
  }

  // Cloudinary (Official Cloud)
  if (n.includes("cloudinary")) {
    return (
      <svg viewBox="0 0 32 32" className="w-3.5 h-3.5 shrink-0">
        <path fill="#3448C5" d="M25.7 14.3C24.8 9.6 20.7 6 15.8 6c-4.4 0-8.2 2.9-9.5 7.1C2.7 13.9 0 17.1 0 21c0 4.4 3.6 8 8 8h17c3.9 0 7-3.1 7-7 0-3.6-2.7-6.5-6.3-7.7z" />
        <path fill="#FFF" d="M17.3 12.5l-5.6 5.6 1.8 1.8 3.8-3.8 6.4 6.4 1.8-1.8z" />
      </svg>
    );
  }

  // Gemini AI / Google AI
  if (n.includes("gemini") || n.includes("ai")) {
    return (
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 shrink-0">
        <defs>
          <linearGradient id="tb-gemini-grad-solid" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1BA1E3" />
            <stop offset="50%" stopColor="#5468FF" />
            <stop offset="100%" stopColor="#BD34FE" />
          </linearGradient>
        </defs>
        <path fill="url(#tb-gemini-grad-solid)" d="M12 0C12 6.627 6.627 12 0 12c6.627 0 12 5.373 12 12 0-6.627 5.373-12 12-12-6.627 0-12-5.373-12-12z" />
      </svg>
    );
  }

  // Go / Golang
  if (n === "go" || n.includes("golang")) {
    return (
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 shrink-0" fill="#00ADD8">
        <path d="M1.811 10.231c-.047 0-.058-.023-.035-.059l.246-.315c.023-.035.081-.058.128-.058h4.172c.046 0 .058.035.035.07l-.199.303c-.023.036-.082.07-.117.07zM.047 11.306c-.047 0-.059-.023-.035-.058l.245-.316c.023-.035.082-.058.129-.058h5.328c.047 0 .07.035.058.07l-.093.28c-.012.047-.058.07-.105.07zm2.828 1.075c-.047 0-.059-.035-.035-.07l.163-.292c.023-.035.07-.07.117-.07h2.337c.047 0 .07.035.07.082l-.023.28c0 .047-.047.082-.082.082zm12.129-2.36c-.736.187-1.239.327-1.963.514-.176.046-.187.058-.34-.117-.174-.199-.303-.327-.548-.444-.737-.362-1.45-.257-2.115.175-.795.514-1.204 1.274-1.192 2.22.011.935.654 1.706 1.577 1.835.795.105 1.46-.175 1.987-.77.105-.13.198-.27.315-.434H10.47c-.245 0-.304-.152-.222-.35.152-.362.432-.97.596-1.274a.315.315 0 01.292-.187h4.253c-.023.316-.023.631-.07.947a4.983 4.983 0 01-.958 2.29c-.841 1.11-1.94 1.8-3.33 1.986-1.145.152-2.209-.07-3.143-.77-.865-.655-1.356-1.52-1.484-2.595-.152-1.274.222-2.419.993-3.424.83-1.086 1.928-1.776 3.272-2.02 1.098-.2 2.15-.07 3.096.571.62.41 1.063.97 1.356 1.648.07.105.023.164-.117.2m3.868 6.461c-1.064-.024-2.034-.328-2.852-1.029a3.665 3.665 0 01-1.262-2.255c-.21-1.32.152-2.489.947-3.529.853-1.122 1.881-1.706 3.272-1.95 1.192-.21 2.314-.095 3.33.595.923.63 1.496 1.484 1.648 2.605.198 1.578-.257 2.863-1.344 3.962-.771.783-1.718 1.273-2.805 1.495-.315.06-.63.07-.934.106zm2.78-4.72c-.011-.153-.011-.27-.034-.387-.21-1.157-1.274-1.81-2.384-1.554-1.087.245-1.788.935-2.045 2.033-.21.912.234 1.835 1.075 2.21.643.28 1.285.244 1.905-.07.923-.48 1.425-1.228 1.484-2.233z" />
      </svg>
    );
  }

  // OpenTofu / Terraform
  if (n.includes("opentofu") || n.includes("terraform")) {
    return (
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 shrink-0" fill="#7B42BC">
        <path d="M1.44 0v7.68l6.72 3.84V3.84L1.44 0zm7.68 4.38v7.68l6.72 3.84V8.22L9.12 4.38zm7.68 4.38v7.68l6.72 3.84v-7.68l-6.72-3.84zM1.44 8.76v7.68l6.72 3.84v-7.68L1.44 8.76z" />
      </svg>
    );
  }

  // LangChain
  if (n.includes("langchain")) {
    return (
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 shrink-0" fill="#1C3C3C">
        <circle cx="12" cy="12" r="10" fill="#00A67E" />
        <path d="M7 14l5-5 5 5" stroke="#FFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
    );
  }

  // Redis
  if (n.includes("redis")) {
    return (
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 shrink-0" fill="#FF4438">
        <path d="M22.71 13.145c-1.66 2.092-3.452 4.483-7.038 4.483-3.203 0-4.397-2.825-4.48-5.12.701 1.484 2.073 2.685 4.214 2.63 4.117-.133 6.94-3.852 6.94-7.239 0-4.05-3.022-6.972-8.268-6.972-3.752 0-8.4 1.428-11.455 3.685C2.59 6.937 3.885 9.958 4.35 9.626c2.648-1.904 4.748-3.13 6.784-3.744C8.12 9.244.886 17.05 0 18.425c.1 1.261 1.66 4.648 2.424 4.648.232 0 .431-.133.664-.365a100.49 100.49 0 0 0 5.54-6.765c.222 3.104 1.748 6.898 6.014 6.898 3.819 0 7.604-2.756 9.33-8.965.2-.764-.73-1.361-1.261-.73z" />
      </svg>
    );
  }

  // ClickHouse
  if (n.includes("clickhouse")) {
    return (
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 shrink-0" fill="#FF7A00">
        <path d="M21.333 10H24v4h-2.667ZM16 1.335h2.667v21.33H16Zm-5.333 0h2.666v21.33h-2.666ZM0 22.665V1.335h2.667v21.33zm5.333-21.33H8v21.33H5.333Z" />
      </svg>
    );
  }

  // Kubernetes
  if (n.includes("kubernetes") || n === "k8s") {
    return (
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 shrink-0" fill="#326CE5">
        <path d="M12 0l10.392 6v12L12 24 1.608 18V6L12 0zm0 3.2L4.33 7.63v8.74L12 20.8l7.67-4.43V7.63L12 3.2z" />
      </svg>
    );
  }

  // PyTorch
  if (n.includes("pytorch")) {
    return (
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 shrink-0" fill="#EE4C2C">
        <path d="M12.005 0L4.952 7.053a9.865 9.865 0 000 14.022 9.866 9.866 0 0014.022 0c3.984-3.9 3.986-10.205.085-14.023l-1.744 1.743c2.904 2.905 2.904 7.634 0 10.538s-7.634 2.904-10.538 0-2.904-7.634 0-10.538l4.647-4.646.582-.665zm3.568 3.899a1.327 1.327 0 00-1.327 1.327 1.327 1.327 0 001.327 1.328A1.327 1.327 0 0016.9 5.226 1.327 1.327 0 0015.573 3.9z" />
      </svg>
    );
  }

  // Rust
  if (n.includes("rust")) {
    return (
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 shrink-0" fill="#DEA584">
        <circle cx="12" cy="12" r="10" fill="#DEA584" />
        <path d="M9 7h6v2H9zm0 4h6v2H9zm0 4h6v2H9z" fill="#000" />
      </svg>
    );
  }

  // WASM / WebAssembly
  if (n.includes("wasm") || n.includes("webassembly")) {
    return (
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 rounded shrink-0">
        <rect width="24" height="24" rx="3.5" fill="#654FF0" />
        <text x="3.5" y="16" fontFamily="sans-serif" fontSize="9" fontWeight="bold" fill="#FFF">WA</text>
      </svg>
    );
  }

  // Python
  if (n.includes("python")) {
    return (
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 shrink-0">
        <path fill="#3776AB" d="M11.87 0c-3.13 0-5.06 1.37-5.06 4.01v2.93h5.18v.73H4.76C2.07 7.67 0 9.77 0 12.87c0 3.1 1.76 5.09 4.88 5.09h1.7v-2.39c0-1.84 1.55-3.37 3.39-3.37h5.18c1.53 0 2.8-1.25 2.8-2.77V4.01C17.95 1.37 15 0 11.87 0zm-2.48 1.48a1.05 1.05 0 1 1 0 2.1 1.05 1.05 0 0 1 0-2.1z" />
        <path fill="#FFD438" d="M12.13 24c3.13 0 5.06-1.37 5.06-4.01v-2.93h-5.18v-.73h7.23c2.69 0 4.76-2.1 4.76-5.2 0-3.1-1.76-5.09-4.88-5.09h-1.7v2.39c0 1.84-1.55 3.37-3.39 3.37H8.85c-1.53 0-2.8 1.25-2.8 2.77v5.42C6.05 22.63 9 24 12.13 24zm2.48-1.48a1.05 1.05 0 1 1 0-2.1 1.05 1.05 0 0 1 0 2.1z" />
      </svg>
    );
  }

  // SQLite
  if (n.includes("sqlite")) {
    return (
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 shrink-0">
        <rect width="24" height="24" rx="3.5" fill="#003B57" />
        <path fill="#00ADEF" d="M18.8 8.4c-.4-.6-1.1-1-2.1-1.2l-4.2-.8c-1.7-.3-2.9-.8-3.4-1.4-.4-.5-.4-1.1 0-1.6.5-.5 1.4-.8 2.6-.8 1.4 0 2.5.4 3.2 1.1.3.3.6.5.9.4l2.1-.6c.3-.1.5-.4.4-.7-.9-1.2-2.3-2-4.1-2.4-1.8-.4-3.5-.2-4.9.5-1.5.8-2.3 2-2.3 3.6 0 1.5.8 2.8 2.2 3.6.9.5 2.2.9 3.8 1.2l3.4.6c1.3.2 2.2.6 2.6 1.1.4.5.4 1.2 0 1.7-.5.6-1.6 1-3 1-1.8 0-3.2-.5-4.1-1.5-.2-.2-.5-.4-.8-.3l-2.2.7c-.3.1-.4.4-.4.7 1.1 1.5 2.8 2.5 5 2.9 1.1.2 2.2.2 3.2 0 1.9-.3 3.4-1.2 4.4-2.5 1-1.3 1.2-2.9.7-4.4-.4-1.2-1.3-2.1-2.9-2.7z" />
      </svg>
    );
  }

  // Apache Kafka
  if (n.includes("kafka")) {
    return (
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 shrink-0" fill="#231F20">
        <circle cx="12" cy="12" r="11" fill="#231F20" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
        <circle cx="7" cy="12" r="2" fill="#FFFFFF" />
        <circle cx="16" cy="7" r="2" fill="#FFFFFF" />
        <circle cx="16" cy="17" r="2" fill="#FFFFFF" />
        <path d="M7 12l9-5M7 12l9 5" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }

  // gRPC
  if (n.includes("grpc")) {
    return (
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 shrink-0">
        <rect width="24" height="24" rx="3.5" fill="#244C5A" />
        <text x="2" y="16" fontFamily="monospace" fontSize="8" fontWeight="bold" fill="#38BDF8">gRPC</text>
      </svg>
    );
  }

  // Figma
  if (n.includes("figma")) {
    return (
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 shrink-0">
        <path fill="#F24E1E" d="M8 2a4 4 0 0 0 0 8h4V2H8Z" />
        <path fill="#FF7262" d="M12 2h4a4 4 0 0 1 0 8h-4V2Z" />
        <path fill="#1ABCFE" d="M12 10h4a4 4 0 0 1 0 8h-4v-8Z" />
        <path fill="#0ACF83" d="M8 18a4 4 0 0 0 4 4v-4H8a4 4 0 0 0 0-4h4v4H8a4 4 0 0 0 0-4Z" />
        <path fill="#A259FF" d="M8 10a4 4 0 0 0 0 8h4v-8H8Z" />
      </svg>
    );
  }

  // WebSockets
  if (n.includes("websocket")) {
    return (
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 shrink-0" fill="none" stroke="#38BDF8" strokeWidth="2">
        <path d="M4 12a8 8 0 0 1 16 0" />
        <path d="M7 12a5 5 0 0 1 10 0" />
        <circle cx="12" cy="12" r="1.5" fill="#38BDF8" />
      </svg>
    );
  }

  // Default subtle dot
  return <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand-primary)]/70 dark:bg-sky-400 shrink-0" />;
}

export function TechBadge({ tech, className, size = "sm", showIcon = true }: TechBadgeProps) {
  const icon = showIcon ? getTechLogo(tech) : null;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-mono rounded-md bg-[var(--bg-elevated)] border border-[var(--border-subtle)] dark:bg-white/[0.08] dark:border-white/15 text-[var(--text-primary)] dark:text-slate-100 hover:border-[var(--brand-primary)]/50 transition-colors shadow-2xs font-medium tracking-tight",
        size === "xs" && "text-[10px] px-2 py-0.5",
        size === "sm" && "text-[11px] px-2.5 py-1",
        size === "md" && "text-xs px-3 py-1.5",
        className
      )}
    >
      {icon}
      <span>{tech}</span>
    </span>
  );
}
