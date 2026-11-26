"use client";

import React, { useState, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
} from "framer-motion";
import { Binary, Sparkles, CheckCircle2, Layers, Cpu } from "lucide-react";
import { ReleasePill } from "@/components/glass/ReleasePill";
import { cn } from "@/lib/utils";

const TABS = ["Frontend", "Backend", "Databases", "Cloud & DevOps", "AI & ML"] as const;
type Tab = (typeof TABS)[number];

const TECH_LOGOS: Record<string, React.ReactNode> = {
  // Frontend
  "React 18 / 19": (
    <svg viewBox="-11.5 -10.23 23 20.46" className="w-5 h-5 shrink-0">
      <circle cx="0" cy="0" r="2.05" fill="#61DAFB" />
      <g stroke="#61DAFB" strokeWidth="1" fill="none">
        <ellipse rx="11" ry="4.2" />
        <ellipse rx="11" ry="4.2" transform="rotate(60)" />
        <ellipse rx="11" ry="4.2" transform="rotate(120)" />
      </g>
    </svg>
  ),
  TypeScript: (
    <svg viewBox="0 0 24 24" className="w-5 h-5 rounded shrink-0">
      <rect width="24" height="24" rx="3.5" fill="#3178C6" />
      <path
        fill="#FFFFFF"
        d="M17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 0 1 1.306.34v2.458a3.95 3.95 0 0 0-.643-.361 5.093 5.093 0 0 0-.717-.26 5.453 5.453 0 0 0-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 0 0-.623.242c-.17.104-.3.229-.393.374a.888.888 0 0 0-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.423.276.696.41c.273.135.582.274.926.416.47.197.892.407 1.266.628.374.222.695.473.963.753.268.279.472.598.614.957.142.359.214.776.214 1.253 0 .657-.125 1.21-.373 1.656a3.033 3.033 0 0 1-1.012 1.085 4.38 4.38 0 0 1-1.487.596c-.566.12-1.163.18-1.79.18a9.916 9.916 0 0 1-1.84-.164 5.544 5.544 0 0 1-1.512-.493v-2.63a5.033 5.033 0 0 0 3.237 1.2c.333 0 .624-.03.872-.09.249-.06.456-.144.623-.25.166-.108.29-.234.373-.38a1.023 1.023 0 0 0-.074-1.089 2.12 2.12 0 0 0-.537-.5 5.597 5.597 0 0 0-.807-.444 27.72 27.72 0 0 0-1.007-.436c-.918-.383-1.602-.852-2.053-1.405-.45-.553-.676-1.222-.676-2.005 0-.614.123-1.141.369-1.582.246-.441.58-.804 1.004-1.089a4.494 4.494 0 0 1 1.47-.629 7.536 7.536 0 0 1 1.77-.201zm-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z"
      />
    </svg>
  ),
  "Next.js (App Router)": (
    <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0">
      <circle
        cx="12"
        cy="12"
        r="11"
        fill="#000000"
        stroke="rgba(255,255,255,0.3)"
        strokeWidth="1"
      />
      <path
        fill="#FFFFFF"
        d="M18.665 21.978C16.758 23.255 14.465 24 12 24 5.377 24 0 18.623 0 12S5.377 0 12 0s12 5.377 12 12c0 3.583-1.574 6.801-4.067 9.001L9.219 7.2H7.2v9.596h1.615V9.251l9.85 12.727Zm-3.332-8.533 1.6 2.061V7.2h-1.6v6.245Z"
      />
    </svg>
  ),
  "Web Workers / WASM": (
    <svg viewBox="0 0 24 24" className="w-5 h-5 rounded shrink-0">
      <rect width="24" height="24" rx="3.5" fill="#654FF0" />
      <path
        fill="#FFFFFF"
        d="M11.454,21.431l-1.169-5.783h-0.02l-1.264,5.783H7.39l-1.824-8.497h1.59l1.088,5.783 h0.02l1.311-5.783h1.487l1.177,5.854h0.02l1.242-5.854h1.561l-2.027,8.497H11.454z M20.209,21.431l-0.542-1.891h-2.861l-0.417,1.891 h-1.59l2.056-8.497h2.509l2.5,8.497H20.209z M17.812,15.028l-0.694,3.118h2.159l-0.796-3.118H17.812z"
      />
    </svg>
  ),

  // Backend
  "Go (Golang)": (
    <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0">
      <path
        fill="#00ADD8"
        d="M1.811 10.231c-.047 0-.058-.023-.035-.059l.246-.315c.023-.035.081-.058.128-.058h4.172c.046 0 .058.035.035.07l-.199.303c-.023.036-.082.07-.117.07zM.047 11.306c-.047 0-.059-.023-.035-.058l.245-.316c.023-.035.082-.058.129-.058h5.328c.047 0 .07.035.058.07l-.093.28c-.012.047-.058.07-.105.07zm2.828 1.075c-.047 0-.059-.035-.035-.07l.163-.292c.023-.035.07-.07.117-.07h2.337c.047 0 .07.035.07.082l-.023.28c0 .047-.047.082-.082.082zm12.129-2.36c-.736.187-1.239.327-1.963.514-.176.046-.187.058-.34-.117-.174-.199-.303-.327-.548-.444-.737-.362-1.45-.257-2.115.175-.795.514-1.204 1.274-1.192 2.22.011.935.654 1.706 1.577 1.835.795.105 1.46-.175 1.987-.77.105-.13.198-.27.315-.434H10.47c-.245 0-.304-.152-.222-.35.152-.362.432-.97.596-1.274a.315.315 0 01.292-.187h4.253c-.023.316-.023.631-.07.947a4.983 4.983 0 01-.958 2.29c-.841 1.11-1.94 1.8-3.33 1.986-1.145.152-2.209-.07-3.143-.77-.865-.655-1.356-1.52-1.484-2.595-.152-1.274.222-2.419.993-3.424.83-1.086 1.928-1.776 3.272-2.02 1.098-.2 2.15-.07 3.096.571.62.41 1.063.97 1.356 1.648.07.105.023.164-.117.2m3.868 6.461c-1.064-.024-2.034-.328-2.852-1.029a3.665 3.665 0 01-1.262-2.255c-.21-1.32.152-2.489.947-3.529.853-1.122 1.881-1.706 3.272-1.95 1.192-.21 2.314-.095 3.33.595.923.63 1.496 1.484 1.648 2.605.198 1.578-.257 2.863-1.344 3.962-.771.783-1.718 1.273-2.805 1.495-.315.06-.63.07-.934.106zm2.78-4.72c-.011-.153-.011-.27-.034-.387-.21-1.157-1.274-1.81-2.384-1.554-1.087.245-1.788.935-2.045 2.033-.21.912.234 1.835 1.075 2.21.643.28 1.285.244 1.905-.07.923-.48 1.425-1.228 1.484-2.233z"
      />
    </svg>
  ),
  "Node.js / Bun": (
    <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0">
      <path
        fill="#5FA04E"
        d="M11.998,24c-0.321,0-0.641-0.084-0.922-0.247l-2.936-1.737c-0.438-0.245-0.224-0.332-0.08-0.383 c0.585-0.203,0.703-0.25,1.328-0.604c0.065-0.037,0.151-0.023,0.218,0.017l2.256,1.339c0.082,0.045,0.197,0.045,0.272,0l8.795-5.076 c0.082-0.047,0.134-0.141,0.134-0.238V6.921c0-0.099-0.053-0.192-0.137-0.242l-8.791-5.072c-0.081-0.047-0.189-0.047-0.271,0 L3.075,6.68C2.99,6.729,2.936,6.825,2.936,6.921v10.15c0,0.097,0.054,0.189,0.139,0.235l2.409,1.392 c1.307,0.654,2.108-0.116,2.108-0.89V7.787c0-0.142,0.114-0.253,0.256-0.253h1.115c0.139,0,0.255,0.112,0.255,0.253v10.021 c0,1.745-0.95,2.745-2.604,2.745c-0.508,0-0.909,0-2.026-0.551L2.28,18.675c-0.57-0.329-0.922-0.945-0.922-1.604V6.921 c0-0.659,0.353-1.275,0.922-1.603l8.795-5.082c0.557-0.315,1.296-0.315,1.848,0l8.794,5.082c0.57,0.329,0.924,0.944,0.924,1.603 v10.15c0,0.659-0.354,1.273-0.924,1.604l-8.794,5.078C12.643,23.916,12.324,24,11.998,24z M19.099,13.993 c0-1.9-1.284-2.406-3.987-2.763c-2.731-0.361-3.009-0.548-3.009-1.187c0-0.528,0.235-1.233,2.258-1.233 c1.807,0,2.473,0.389,2.747,1.607c0.024,0.115,0.129,0.199,0.247,0.199h1.141c0.071,0,0.138-0.031,0.186-0.081 c0.048-0.054,0.074-0.123,0.067-0.196c-0.177-2.098-1.571-3.076-4.388-3.076c-2.508,0-4.004,1.058-4.004,2.833 c0,1.925,1.488,2.457,3.895,2.695c2.88,0.282,3.103,0.703,3.103,1.269c0,0.983-0.789,1.402-2.642,1.402 c-2.327,0-2.839-0.584-3.011-1.742c-0.02-0.124-0.126-0.215-0.253-0.215h-1.137c-0.141,0-0.254,0.112-0.254,0.253 c0,1.482,0.806,3.248,4.655,3.248C17.501,17.007,19.099,15.91,19.099,13.993z"
      />
    </svg>
  ),
  Rust: (
    <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0">
      <path
        fill="#DEA584"
        d="M23.8346 11.7033l-1.0073-.6236a13.7268 13.7268 0 00-.0283-.2936l.8656-.8069a.3483.3483 0 00-.1154-.578l-1.1066-.414a8.4958 8.4958 0 00-.087-.2856l.6904-.9587a.3462.3462 0 00-.2257-.5446l-1.1663-.1894a9.3574 9.3574 0 00-.1407-.2622l.49-1.0761a.3437.3437 0 00-.0274-.3361.3486.3486 0 00-.3006-.154l-1.1845.0416a6.7444 6.7444 0 00-.1873-.2268l.2723-1.153a.3472.3472 0 00-.417-.4172l-1.1532.2724a14.0183 14.0183 0 00-.2278-.1873l.0415-1.1845a.3442.3442 0 00-.49-.328l-1.076.491c-.0872-.0476-.1742-.0952-.2623-.1407l-.1903-1.1673A.3483.3483 0 0016.256.955l-.9597.6905a8.4867 8.4867 0 00-.2855-.086l-.414-1.1066a.3483.3483 0 00-.5781-.1154l-.8069.8666a9.2936 9.2936 0 00-.2936-.0284L12.2946.1683a.3462.3462 0 00-.5892 0l-.6236 1.0073a13.7383 13.7383 0 00-.2936.0284L9.9803.3374a.3462.3462 0 00-.578.1154l-.4141 1.1065c-.0962.0274-.1903.0567-.2855.086L7.744.955a.3483.3483 0 00-.5447.2258L7.009 2.348a9.3574 9.3574 0 00-.2622.1407l-1.0762-.491a.3462.3462 0 00-.49.328l.0416 1.1845a7.9826 7.9826 0 00-.2278.1873L3.8413 3.425a.3472.3472 0 00-.4171.4171l.2713 1.1531c-.0628.075-.1255.1509-.1863.2268l-1.1845-.0415a.3462.3462 0 00-.328.49l.491 1.0761a9.167 9.167 0 00-.1407.2622l-1.1662.1894a.3483.3483 0 00-.2258.5446l.6904.9587a13.303 13.303 0 00-.087.2855l-1.1065.414a.3483.3483 0 00-.1155.5781l.8656.807a9.2936 9.2936 0 00-.0283.2935l-1.0073.6236a.3442.3442 0 000 .5892l1.0073.6236c.008.0982.0182.1964.0283.2936l-.8656.8079a.3462.3462 0 00.1155.578l1.1065.4141c.0273.0962.0567.1914.087.2855l-.6904.9587a.3452.3452 0 00.2268.5447l1.1662.1893c.0456.088.0922.1751.1408.2622l-.491 1.0762a.3462.3462 0 00.328.49l1.1834-.0415c.0618.0769.1235.1528.1873.2277l-.2713 1.1541a.3462.3462 0 00.4171.4161l1.153-.2713c.075.0638.151.1255.2279.1863l-.0415 1.1845a.3442.3442 0 00.49.327l1.0761-.49c.087.0486.1741.0951.2622.1407l.1903 1.1662a.3483.3483 0 00.5447.2268l.9587-.6904a9.299 9.299 0 00.2855.087l.414 1.1066a.3452.3452 0 00.5781.1154l.8079-.8656c.0972.0111.1954.0203.2936.0294l.6236 1.0073a.3472.3472 0 00.5892 0l.6236-1.0073c.0982-.0091.1964-.0183.2936-.0294l.8069.8656a.3483.3483 0 00.578-.1154l.4141-1.1066a8.4626 8.4626 0 00.2855-.087l.9587.6904a.3452.3452 0 00.5447-.2268l.1903-1.1662c.088-.0456.1751-.0931.2622-.1407l1.0762.49a.3472.3472 0 00.49-.327l-.0415-1.1845a6.7267 6.7267 0 00.2267-.1863l1.1531.2713a.3472.3472 0 00.4171-.416l-.2713-1.1542c.0628-.0749.1255-.1508.1863-.2278l1.1845.0415a.3442.3442 0 00.328-.49l-.49-1.076c.0475-.0872.0951-.1742.1407-.2623l1.1662-.1893a.3483.3483 0 00.2258-.5447l-.6904-.9587.087-.2855 1.1066-.414a.3462.3462 0 00.1154-.5781l-.8656-.8079c.0101-.0972.0202-.1954.0283-.2936l1.0073-.6236a.3442.3442 0 000-.5892zm-6.7413 8.3551a.7138.7138 0 01.2986-1.396.714.714 0 11-.2997 1.396zm-.3422-2.3142a.649.649 0 00-.7715.5l-.3573 1.6685c-1.1035.501-2.3285.7795-3.6193.7795a8.7368 8.7368 0 01-3.6951-.814l-.3574-1.6684a.648.648 0 00-.7714-.499l-1.473.3158a8.7216 8.7216 0 01-.7613-.898h7.1676c.081 0 .1356-.0141.1356-.088v-2.536c0-.074-.0536-.0881-.1356-.0881h-2.0966v-1.6077h2.2677c.2065 0 1.1065.0587 1.394 1.2088.0901.3533.2875 1.5044.4232 1.8729.1346.413.6833 1.2381 1.2685 1.2381h3.5716a.7492.7492 0 00.1296-.0131 8.7874 8.7874 0 01-.8119.9526zM6.8369 20.024a.714.714 0 11-.2997-1.396.714.714 0 01.2997 1.396zM4.1177 8.9972a.7137.7137 0 11-1.304.5791.7137.7137 0 011.304-.579zm-.8352 1.9813l1.5347-.6824a.65.65 0 00.33-.8585l-.3158-.7147h1.2432v5.6025H3.5669a8.7753 8.7753 0 01-.2834-3.348zm6.7343-.5437V8.7836h2.9601c.153 0 1.0792.1772 1.0792.8697 0 .575-.7107.7815-1.2948.7815zm10.7574 1.4862c0 .2187-.008.4363-.0243.651h-.9c-.09 0-.1265.0586-.1265.1477v.413c0 .973-.5487 1.1846-1.0296 1.2382-.4576.0517-.9648-.1913-1.0275-.4717-.2704-1.5186-.7198-1.8436-1.4305-2.4034.8817-.5599 1.799-1.386 1.799-2.4915 0-1.1936-.819-1.9458-1.3769-2.3153-.7825-.5163-1.6491-.6195-1.883-.6195H5.4682a8.7651 8.7651 0 014.907-2.7699l1.0974 1.151a.648.648 0 00.9182.0213l1.227-1.1743a8.7753 8.7753 0 016.0044 4.2762l-.8403 1.8982a.652.652 0 00.33.8585l1.6178.7188c.0283.2875.0425.577.0425.8717zm-9.3006-9.5993a.7128.7128 0 11.984 1.0316.7137.7137 0 01-.984-1.0316zm8.3389 6.71a.7107.7107 0 01.9395-.3625.7137.7137 0 11-.9405.3635z"
      />
    </svg>
  ),
  "Elixir / OTP": (
    <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0">
      <path
        fill="#A367DC"
        d="M19.793 16.575c0 3.752-2.927 7.426-7.743 7.426-5.249 0-7.843-3.71-7.843-8.29 0-5.21 3.892-12.952 8-15.647a.397.397 0 0 1 .61.371 9.716 9.716 0 0 0 1.694 6.518c.522.795 1.092 1.478 1.763 2.352.94 1.227 1.637 1.906 2.644 3.842l.015.028a7.107 7.107 0 0 1 .86 3.4z"
      />
    </svg>
  ),

  // Databases
  PostgreSQL: (
    <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0">
      <path
        fill="#4169E1"
        d="M23.5594 14.7228a.5269.5269 0 0 0-.0563-.1191c-.139-.2632-.4768-.3418-1.0074-.2321-1.6533.3411-2.2935.1312-2.5256-.0191 1.342-2.0482 2.445-4.522 3.0411-6.8297.2714-1.0507.7982-3.5237.1222-4.7316a1.5641 1.5641 0 0 0-.1509-.235C21.6931.9086 19.8007.0248 17.5099.0005c-1.4947-.0158-2.7705.3461-3.1161.4794a9.449 9.449 0 0 0-.5159-.0816 8.044 8.044 0 0 0-1.3114-.1278c-1.1822-.0184-2.2038.2642-3.0498.8406-.8573-.3211-4.7888-1.645-7.2219.0788C.9359 2.1526.3086 3.8733.4302 6.3043c.0409.818.5069 3.334 1.2423 5.7436.4598 1.5065.9387 2.7019 1.4334 3.582.553.9942 1.1259 1.5933 1.7143 1.7895.4474.1491 1.1327.1441 1.8581-.7279.8012-.9635 1.5903-1.8258 1.9446-2.2069.4351.2355.9064.3625 1.39.3772a.0569.0569 0 0 0 .0004.0041 11.0312 11.0312 0 0 0-.2472.3054c-.3389.4302-.4094.5197-1.5002.7443-.3102.064-1.1344.2339-1.1464.8115-.0025.1224.0329.2309.0919.3268.2269.4231.9216.6097 1.015.6331 1.3345.3335 2.5044.092 3.3714-.6787-.017 2.231.0775 4.4174.3454 5.0874.2212.5529.7618 1.9045 2.4692 1.9043.2505 0 .5263-.0291.8296-.0941 1.7819-.3821 2.5557-1.1696 2.855-2.9059.1503-.8707.4016-2.8753.5388-4.1012.0169-.0703.0357-.1207.057-.1362.0007-.0005.0697-.0471.4272.0307a.3673.3673 0 0 0 .0443.0068l.2539.0223.0149.001c.8468.0384 1.9114-.1426 2.5312-.4308.6438-.2988 1.8057-1.0323 1.5951-1.6698zM2.371 11.8765c-.7435-2.4358-1.1779-4.8851-1.2123-5.5719-.1086-2.1714.4171-3.6829 1.5623-4.4927 1.8367-1.2986 4.8398-.5408 6.108-.13-.0032.0032-.0066.0061-.0098.0094-2.0238 2.044-1.9758 5.536-1.9708 5.7495-.0002.0823.0066.1989.0162.3593.0348.5873.0996 1.6804-.0735 2.9184-.1609 1.1504.1937 2.2764.9728 3.0892.0806.0841.1648.1631.2518.2374-.3468.3714-1.1004 1.1926-1.9025 2.1576-.5677.6825-.9597.5517-1.0886.5087-.3919-.1307-.813-.5871-1.2381-1.3223-.4796-.839-.9635-2.0317-1.4155-3.5126zm6.0072 5.0871c-.1711-.0428-.3271-.1132-.4322-.1772.0889-.0394.2374-.0902.4833-.1409 1.2833-.2641 1.4815-.4506 1.9143-1.0002.0992-.126.2116-.2687.3673-.4426a.3549.3549 0 0 0 .0737-.1298c.1708-.1513.2724-.1099.4369-.0417.156.0646.3078.26.3695.4752.0291.1016.0619.2945-.0452.4444-.9043 1.2658-2.2216 1.2494-3.1676 1.0128zm2.094-3.988-.0525.141c-.133.3566-.2567.6881-.3334 1.003-.6674-.0021-1.3168-.2872-1.8105-.8024-.6279-.6551-.9131-1.5664-.7825-2.5004.1828-1.3079.1153-2.4468.079-3.0586-.005-.0857-.0095-.1607-.0122-.2199.2957-.2621 1.6659-.9962 2.6429-.7724.4459.1022.7176.4057.8305.928.5846 2.7038.0774 3.8307-.3302 4.7363-.084.1866-.1633.3629-.2311.5454zm7.3637 4.5725c-.0169.1768-.0358.376-.0618.5959l-.146.4383a.3547.3547 0 0 0-.0182.1077c-.0059.4747-.054.6489-.115.8693-.0634.2292-.1353.4891-.1794 1.0575-.11 1.4143-.8782 2.2267-2.4172 2.5565-1.5155.3251-1.7843-.4968-2.0212-1.2217a6.5824 6.5824 0 0 0-.0769-.2266c-.2154-.5858-.1911-1.4119-.1574-2.5551.0165-.5612-.0249-1.9013-.3302-2.6462.0044-.2932.0106-.5909.019-.8918a.3529.3529 0 0 0-.0153-.1126 1.4927 1.4927 0 0 0-.0439-.208c-.1226-.4283-.4213-.7866-.7797-.9351-.1424-.059-.4038-.1672-.7178-.0869.067-.276.1831-.5875.309-.9249l.0529-.142c.0595-.16.134-.3257.213-.5012.4265-.9476 1.0106-2.2453.3766-5.1772-.2374-1.0981-1.0304-1.6343-2.2324-1.5098-.7207.0746-1.3799.3654-1.7088.5321a5.6716 5.6716 0 0 0-.1958.1041c.0918-1.1064.4386-3.1741 1.7357-4.4823a4.0306 4.0306 0 0 1 .3033-.276.3532.3532 0 0 0 .1447-.0644c.7524-.5706 1.6945-.8506 2.802-.8325.4091.0067.8017.0339 1.1742.081 1.939.3544 3.2439 1.4468 4.0359 2.3827.8143.9623 1.2552 1.9315 1.4312 2.4543-1.3232-.1346-2.2234.1268-2.6797.779-.9926 1.4189.543 4.1729 1.2811 5.4964.1353.2426.2522.4522.2889.5413.2403.5825.5515.9713.7787 1.2552.0696.087.1372.1714.1885.245-.4008.1155-1.1208.3825-1.0552 1.717-.0123.1563-.0423.4469-.0834.8148-.0461.2077-.0702.4603-.0994.7662zm.8905-1.6211c-.0405-.8316.2691-.9185.5967-1.0105a2.8566 2.8566 0 0 0 .135-.0406 1.202 1.202 0 0 0 .1342.103c.5703.3765 1.5823.4213 3.0068.1344-.2016.1769-.5189.3994-.9533.6011-.4098.1903-1.0957.333-1.7473.3636-.7197.0336-1.0859-.0807-1.1721-.151zm.5695-9.2712c-.0059.3508-.0542.6692-.1054 1.0017-.055.3576-.112.7274-.1264 1.1762-.0142.4368.0404.8909.0932 1.3301.1066.887.216 1.8003-.2075 2.7014a3.5272 3.5272 0 0 1-.1876-.3856c-.0527-.1276-.1669-.3326-.3251-.6162-.6156-1.1041-2.0574-3.6896-1.3193-4.7446.3795-.5427 1.3408-.5661 2.1781-.463zm.2284 7.0137a12.3762 12.3762 0 0 0-.0853-.1074l-.0355-.0444c.7262-1.1995.5842-2.3862.4578-3.4385-.0519-.4318-.1009-.8396-.0885-1.2226.0129-.4061.0666-.7543.1185-1.0911.0639-.415.1288-.8443.1109-1.3505.0134-.0531.0188-.1158.0118-.1902-.0457-.4855-.5999-1.938-1.7294-3.253-.6076-.7073-1.4896-1.4972-2.6889-2.0395.5251-.1066 1.2328-.2035 2.0244-.1859 2.0515.0456 3.6746.8135 4.8242 2.2824a.908.908 0 0 1 .0667.1002c.7231 1.3556-.2762 6.2751-2.9867 10.5405zm-8.8166-6.1162c-.025.1794-.3089.4225-.6211.4225a.5821.5821 0 0 1-.0809-.0056c-.1873-.026-.3765-.144-.5059-.3156-.0458-.0605-.1203-.178-.1055-.2844.0055-.0401.0261-.0985.0925-.1488.1182-.0894.3518-.1226.6096-.0867.3163.0441.6426.1938.6113.4186zm7.9305-.4114c.0111.0792-.049.201-.1531.3102-.0683.0717-.212.1961-.4079.2232a.5456.5456 0 0 1-.075.0052c-.2935 0-.5414-.2344-.5607-.3717-.024-.1765.2641-.3106.5611-.352.297-.0414.6111.0088.6356.1851z"
      />
    </svg>
  ),
  "Redis Cluster": (
    <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0">
      <path
        fill="#FF4438"
        d="M22.71 13.145c-1.66 2.092-3.452 4.483-7.038 4.483-3.203 0-4.397-2.825-4.48-5.12.701 1.484 2.073 2.685 4.214 2.63 4.117-.133 6.94-3.852 6.94-7.239 0-4.05-3.022-6.972-8.268-6.972-3.752 0-8.4 1.428-11.455 3.685C2.59 6.937 3.885 9.958 4.35 9.626c2.648-1.904 4.748-3.13 6.784-3.744C8.12 9.244.886 17.05 0 18.425c.1 1.261 1.66 4.648 2.424 4.648.232 0 .431-.133.664-.365a100.49 100.49 0 0 0 5.54-6.765c.222 3.104 1.748 6.898 6.014 6.898 3.819 0 7.604-2.756 9.33-8.965.2-.764-.73-1.361-1.261-.73zm-4.349-5.013c0 1.959-1.926 2.922-3.685 2.922-.941 0-1.664-.247-2.235-.568 1.051-1.592 2.092-3.225 3.21-4.973 1.972.334 2.71 1.43 2.71 2.619z"
      />
    </svg>
  ),
  ClickHouse: (
    <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0">
      <path
        fill="#FF7A00"
        d="M21.333 10H24v4h-2.667ZM16 1.335h2.667v21.33H16Zm-5.333 0h2.666v21.33h-2.666ZM0 22.665V1.335h2.667v21.33zm5.333-21.33H8v21.33H5.333Z"
      />
    </svg>
  ),
  "Vector Stores (Qdrant)": (
    <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0">
      <path
        fill="#DC2626"
        d="m12 16.5 3.897-2.25v-4.5L12 7.5 8.103 9.75v4.5zM1.607 18 12 24l3.897-2.25v-4.5L12 19.5l-6.495-3.75v-7.5L12 4.5l6.495 3.75v15L22.393 21V6L12 0 1.607 6Z"
      />
    </svg>
  ),

  // Cloud & DevOps
  "Kubernetes (EKS/GKE)": (
    <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0">
      <path
        fill="#326CE5"
        d="M10.204 14.35l.007.01-.999 2.413a5.171 5.171 0 0 1-2.075-2.597l2.578-.437.004.005a.44.44 0 0 1 .484.606zm-.833-2.129a.44.44 0 0 0 .173-.756l.002-.011L7.585 9.7a5.143 5.143 0 0 0-.73 3.255l2.514-.725.002-.009zm1.145-1.98a.44.44 0 0 0 .699-.337l.01-.005.15-2.62a5.144 5.144 0 0 0-3.01 1.442l2.147 1.523.004-.002zm.76 2.75l.723.349.722-.347.18-.78-.5-.623h-.804l-.5.623.179.779zm1.5-3.095a.44.44 0 0 0 .7.336l.008.003 2.134-1.513a5.188 5.188 0 0 0-2.992-1.442l.148 2.615.002.001zm10.876 5.97l-5.773 7.181a1.6 1.6 0 0 1-1.248.594l-9.261.003a1.6 1.6 0 0 1-1.247-.596l-5.776-7.18a1.583 1.583 0 0 1-.307-1.34L2.1 5.573c.108-.47.425-.864.863-1.073L11.305.513a1.606 1.606 0 0 1 1.385 0l8.345 3.985c.438.209.755.604.863 1.073l2.062 8.955c.108.47-.005.963-.308 1.34zm-3.289-2.057c-.042-.01-.103-.026-.145-.034-.174-.033-.315-.025-.479-.038-.35-.037-.638-.067-.895-.148-.105-.04-.18-.165-.216-.216l-.201-.059a6.45 6.45 0 0 0-.105-2.332 6.465 6.465 0 0 0-.936-2.163c.052-.047.15-.133.177-.159.008-.09.001-.183.094-.282.197-.185.444-.338.743-.522.142-.084.273-.137.415-.242.032-.024.076-.062.11-.089.24-.191.295-.52.123-.736-.172-.216-.506-.236-.745-.045-.034.027-.08.062-.111.088-.134.116-.217.23-.33.35-.246.25-.45.458-.673.609-.097.056-.239.037-.303.033l-.19.135a6.545 6.545 0 0 0-4.146-2.003l-.012-.223c-.065-.062-.143-.115-.163-.25-.022-.268.015-.557.057-.905.023-.163.061-.298.068-.475.001-.04-.001-.099-.001-.142 0-.306-.224-.555-.5-.555-.275 0-.499.249-.499.555l.001.014c0 .041-.002.092 0 .128.006.177.044.312.067.475.042.348.078.637.056.906a.545.545 0 0 1-.162.258l-.012.211a6.424 6.424 0 0 0-4.166 2.003 8.373 8.373 0 0 1-.18-.128c-.09.012-.18.04-.297-.029-.223-.15-.427-.358-.673-.608-.113-.12-.195-.234-.329-.349-.03-.026-.077-.062-.111-.088a.594.594 0 0 0-.348-.132.481.481 0 0 0-.398.176c-.172.216-.117.546.123.737l.007.005.104.083c.142.105.272.159.414.242.299.185.546.338.743.522.076.082.09.226.1.288l.16.143a6.462 6.462 0 0 0-1.02 4.506l-.208.06c-.055.072-.133.184-.215.217-.257.081-.546.11-.895.147-.164.014-.305.006-.48.039-.037.007-.09.02-.133.03l-.004.002-.007.002c-.295.071-.484.342-.423.608.061.267.349.429.645.365l.007-.001.01-.003.129-.029c.17-.046.294-.113.448-.172.33-.118.604-.217.87-.256.112-.009.23.069.288.101l.217-.037a6.5 6.5 0 0 0 2.88 3.596l-.09.218c.033.084.069.199.044.282-.097.252-.263.517-.452.813-.091.136-.185.242-.268.399-.02.037-.045.095-.064.134-.128.275-.034.591.213.71.248.12.556-.007.69-.282v-.002c.02-.039.046-.09.062-.127.07-.162.094-.301.144-.458.132-.332.205-.68.387-.897.05-.06.13-.082.215-.105l.113-.205a6.453 6.453 0 0 0 4.609.012l.106.192c.086.028.18.042.256.155.136.232.229.507.342.84.05.156.074.295.145.457.016.037.043.09.062.129.133.276.442.402.69.282.247-.118.341-.435.213-.71-.02-.039-.045-.096-.065-.134-.083-.156-.177-.261-.268-.398-.19-.296-.346-.541-.443-.793-.04-.13.007-.21.038-.294-.018-.022-.059-.144-.083-.202a6.499 6.499 0 0 0 2.88-3.622c.064.01.176.03.213.038.075-.05.144-.114.28-.104.266.039.54.138.87.256.154.06.277.128.448.173.036.01.088.019.13.028l.009.003.007.001c.297.064.584-.098.645-.365.06-.266-.128-.537-.423-.608zM16.4 9.701l-1.95 1.746v.005a.44.44 0 0 0 .173.757l.003.01 2.526.728a5.199 5.199 0 0 0-.108-1.674A5.208 5.208 0 0 0 16.4 9.7zm-4.013 5.325a.437.437 0 0 0-.404-.232.44.44 0 0 0-.372.233h-.002l-1.268 2.292a5.164 5.164 0 0 0 3.326.003l-1.27-2.296h-.01zm1.888-1.293a.44.44 0 0 0-.27.036.44.44 0 0 0-.214.572l-.003.004 1.01 2.438a5.15 5.15 0 0 0 2.081-2.615l-2.6-.44-.004.005z"
      />
    </svg>
  ),
  "Terraform / OpenTofu": (
    <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0">
      <path
        fill="#844FBA"
        d="M1.44 0v7.575l6.561 3.79V3.787zm21.12 4.227l-6.561 3.791v7.574l6.56-3.787zM8.72 4.23v7.575l6.561 3.787V8.018zm0 8.405v7.575L15.28 24v-7.578z"
      />
    </svg>
  ),
  "GitHub Actions / Argo": (
    <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0">
      <path
        fill="#2088FF"
        d="M10.984 13.836a.5.5 0 0 1-.353-.146l-.745-.743a.5.5 0 1 1 .706-.708l.392.391 1.181-1.18a.5.5 0 0 1 .708.707l-1.535 1.533a.504.504 0 0 1-.354.146zm9.353-.147l1.534-1.532a.5.5 0 0 0-.707-.707l-1.181 1.18-.392-.391a.5.5 0 1 0-.706.708l.746.743a.497.497 0 0 0 .706-.001zM4.527 7.452l2.557-1.585A1 1 0 0 0 7.09 4.17L4.533 2.56A1 1 0 0 0 3 3.406v3.196a1.001 1.001 0 0 0 1.527.85zm2.03-2.436L4 6.602V3.406l2.557 1.61zM24 12.5c0 1.93-1.57 3.5-3.5 3.5a3.503 3.503 0 0 1-3.46-3h-2.08a3.503 3.503 0 0 1-3.46 3 3.502 3.502 0 0 1-3.46-3h-.558c-.972 0-1.85-.399-2.482-1.042V17c0 1.654 1.346 3 3 3h.04c.244-1.693 1.7-3 3.46-3 1.93 0 3.5 1.57 3.5 3.5S13.43 24 11.5 24a3.502 3.502 0 0 1-3.46-3H8c-2.206 0-4-1.794-4-4V9.899A5.008 5.008 0 0 1 0 5c0-2.757 2.243-5 5-5s5 2.243 5 5a5.005 5.005 0 0 1-4.952 4.998A2.482 2.482 0 0 0 7.482 12h.558c.244-1.693 1.7-3 3.46-3a3.502 3.502 0 0 1 3.46 3h2.08a3.503 3.503 0 0 1 3.46-3c1.93 0 3.5 1.57 3.5 3.5zm-15 8c0 1.378 1.122 2.5 2.5 2.5s2.5-1.122 2.5-2.5-1.122-2.5-2.5-2.5S9 19.122 9 20.5zM5 9c2.206 0 4-1.794 4-4S7.206 1 5 1 1 2.794 1 5s1.794 4 4 4zm9 3.5c0-1.378-1.122-2.5-2.5-2.5S9 11.122 9 12.5s1.122 2.5 2.5 2.5 2.5-1.122 2.5-2.5zm9 0c0-1.378-1.122-2.5-2.5-2.5S18 11.122 18 12.5s1.122 2.5 2.5 2.5 2.5-1.122 2.5-2.5zm-13 8a.5.5 0 1 0 1 0 .5.5 0 0 0-1 0zm2 0a.5.5 0 1 0 1 0 .5.5 0 0 0-1 0zm12 0c0 1.93-1.57 3.5-3.5 3.5a3.503 3.503 0 0 1-3.46-3.002c-.007.001-.013.005-.021.005l-.506.017h-.017a.5.5 0 0 1-.016-.999l.506-.017c.018-.002.035.006.052.007A3.503 3.503 0 0 1 20.5 17c1.93 0 3.5 1.57 3.5 3.5zm-1 0c0-1.378-1.122-2.5-2.5-2.5S18 19.122 18 20.5s1.122 2.5 2.5 2.5 2.5-1.122 2.5-2.5z"
      />
    </svg>
  ),
  "eBPF / Cilium": (
    <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0">
      <path
        fill="#F7781E"
        d="M13.607 14.583h-3.215l-1.626-2.764 1.626-2.802h3.215l1.626 2.802-1.626 2.764ZM14.186 8H9.799l-2.2 3.813 2.2 3.787h4.387l2.213-3.787L14.186 8Zm-4.387 8.4-2.2 3.813L9.799 24h4.387l2.213-3.787-2.213-3.813H9.799Zm-1.034 3.819 1.627-2.802h3.215l1.626 2.802-1.626 2.765h-3.215l-1.627-2.765ZM9.799 0l-2.2 3.813 2.2 3.787h4.387l2.213-3.787L14.186 0H9.799ZM8.765 3.819l1.627-2.802h3.215l1.626 2.802-1.626 2.764h-3.215L8.765 3.819Zm8.234 8.581-2.2 3.813 2.2 3.787h4.388l2.213-3.787-2.213-3.813h-4.388Zm-1.034 3.819 1.627-2.802h3.215l1.626 2.802-1.626 2.765h-3.215l-1.627-2.765ZM16.999 4l-2.2 3.813 2.2 3.787h4.388L23.6 7.813 21.387 4h-4.388Zm-1.034 3.819 1.627-2.802h3.215l1.626 2.802-1.626 2.764h-3.215l-1.627-2.764ZM2.599 12.4l-2.2 3.813L2.599 20h4.387l2.213-3.787L6.986 12.4H2.599Zm-1.034 3.819 1.627-2.802h3.214l1.627 2.802-1.627 2.765H3.192l-1.627-2.765ZM2.599 4l-2.2 3.813 2.2 3.787h4.387l2.213-3.787L6.986 4H2.599ZM1.565 7.819l1.627-2.802h3.214l1.627 2.802-1.627 2.764H3.192L1.565 7.819Z"
      />
    </svg>
  ),

  // AI & ML
  "RAG & Embeddings": (
    <svg viewBox="0 0 32 32" className="w-5 h-5 shrink-0">
      <circle cx="8" cy="8" r="4" fill="#10B981" />
      <circle cx="24" cy="8" r="4" fill="#10B981" />
      <circle cx="16" cy="24" r="4" fill="#10B981" />
      <path
        d="M11 9.5h10M9.5 11l5 9.5M22.5 11l-5 9.5"
        stroke="#10B981"
        strokeWidth="2"
        strokeDasharray="3 2"
      />
      <circle cx="16" cy="14.5" r="2.5" fill="#34D399" />
    </svg>
  ),
  "LangChain / LlamaIndex": (
    <svg viewBox="0 0 32 32" className="w-5 h-5 shrink-0">
      <path
        d="M12 8a4 4 0 0 1 4-4h4a4 4 0 0 1 0 8h-4"
        stroke="#00A67E"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M20 24a4 4 0 0 1-4 4h-4a4 4 0 0 1 0-8h4"
        stroke="#34D399"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
      <line
        x1="12"
        y1="16"
        x2="20"
        y2="16"
        stroke="#00A67E"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  ),
  "vLLM / Self-Hosted": (
    <svg viewBox="0 0 32 32" className="w-5 h-5 shrink-0">
      <rect
        x="5"
        y="5"
        width="22"
        height="22"
        rx="5"
        stroke="#8B5CF6"
        strokeWidth="2.5"
        fill="#1E1B4B"
      />
      <path
        d="M11 16l4 4 6-8"
        stroke="#A78BFA"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  ),
  "Fine-Tuning LoRA": (
    <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0">
      <path
        fill="#EE4C2C"
        d="M12.005 0L4.952 7.053a9.865 9.865 0 000 14.022 9.866 9.866 0 0014.022 0c3.984-3.9 3.986-10.205.085-14.023l-1.744 1.743c2.904 2.905 2.904 7.634 0 10.538s-7.634 2.904-10.538 0-2.904-7.634 0-10.538l4.647-4.646.582-.665zm3.568 3.899a1.327 1.327 0 00-1.327 1.327 1.327 1.327 0 001.327 1.328A1.327 1.327 0 0016.9 5.226 1.327 1.327 0 0015.573 3.9z"
      />
    </svg>
  ),
};

interface StackItem {
  name: string;
  level: number;
  desc: string;
  productionRole: string;
}

const STACK_DATA: Record<Tab, StackItem[]> = {
  Frontend: [
    {
      name: "React 18 / 19",
      level: 100,
      desc: "Modern concurrent mode, server components, design token architecture.",
      productionRole: "Powers interactive dashboards, optimistic mutations & multi-theme UIs",
    },
    {
      name: "TypeScript",
      level: 100,
      desc: "Strict typing across all interfaces, end-to-end type safety with Zod.",
      productionRole: "Enforces zero-drift shared contracts between Next.js & Express APIs",
    },
    {
      name: "Next.js (App Router)",
      level: 70,
      desc: "High-scale hybrid rendering, edge middleware, dynamic streaming layouts.",
      productionRole: "Drives SEO-critical storefronts, SaaS portals & edge route protection",
    },
    {
      name: "Web Workers / WASM",
      level: 45,
      desc: "Offloading heavy in-browser computation and client cryptographic signing.",
      productionRole: "Handles client-side PDF/image processing without blocking 60fps UI",
    },
  ],
  Backend: [
    {
      name: "Go (Golang)",
      level: 100,
      desc: "High-concurrency daemons, network routing engines, microservice nodes.",
      productionRole: "Executes high-throughput telemetry workers & low-latency API gateways",
    },
    {
      name: "Node.js / Bun",
      level: 70,
      desc: "Event-driven I/O APIs, orchestration layers, webhook ingestion bridges.",
      productionRole: "Powers Express REST services, Stripe webhooks & real-time queues",
    },
    {
      name: "Rust",
      level: 45,
      desc: "Zero-overhead memory safety kernels and ultra-low latency data protocols.",
      productionRole: "Secures performance-critical parsers and cryptographic verification",
    },
    {
      name: "Elixir / OTP",
      level: 25,
      desc: "Fault-tolerant distributed telecommunications and stateful WebSockets.",
      productionRole: "Supports high-concurrency live kitchen & order dispatch channels",
    },
  ],
  Databases: [
    {
      name: "PostgreSQL",
      level: 100,
      desc: "Primary relational transactional backbone with pgvector and schema migrations.",
      productionRole: "ACID multi-tenant storage via Neon Serverless & Prisma ORM",
    },
    {
      name: "Redis Cluster",
      level: 70,
      desc: "Sub-millisecond memory caching, session storage, distributed rate-limiting.",
      productionRole: "Protects public endpoints & caches hot catalog queries at the edge",
    },
    {
      name: "ClickHouse",
      level: 45,
      desc: "Columnar store for high-volume logs, telemetry time-series, and reporting.",
      productionRole: "Aggregates real-time operational analytics & audit trails",
    },
    {
      name: "Vector Stores (Qdrant)",
      level: 25,
      desc: "High-dimensional vector indexing and semantic retrieval workloads.",
      productionRole: "Enables sub-20ms similarity search across enterprise knowledge bases",
    },
  ],
  "Cloud & DevOps": [
    {
      name: "Kubernetes (EKS/GKE)",
      level: 100,
      desc: "Declarative cluster orchestration, ingress traffic routing, auto-scaling.",
      productionRole: "Orchestrates stateless container workloads across multi-AZ clusters",
    },
    {
      name: "Terraform / OpenTofu",
      level: 70,
      desc: "Reproducible cloud resources with version-controlled state modules.",
      productionRole: "Provisions repeatable VPCs, databases & IAM policies via IaC",
    },
    {
      name: "GitHub Actions / Argo",
      level: 45,
      desc: "GitOps continuous delivery with automated canary verification checks.",
      productionRole: "Automates type-checks, security scans & zero-downtime rollouts",
    },
    {
      name: "eBPF / Cilium",
      level: 25,
      desc: "Kernel-level networking observability, mTLS encryption without sidecars.",
      productionRole: "Provides deep packet-level security & zero-trust service mesh",
    },
  ],
  "AI & ML": [
    {
      name: "RAG & Embeddings",
      level: 100,
      desc: "Enterprise semantic search and grounded document extraction workflows.",
      productionRole: "Eliminates hallucinations by grounding Gemini responses in live DB data",
    },
    {
      name: "LangChain / LlamaIndex",
      level: 70,
      desc: "Multi-agent orchestrations with strict deterministic tool calling schemas.",
      productionRole: "Coordinates multi-step AI assistants with Zod schema guardrails",
    },
    {
      name: "vLLM / Self-Hosted",
      level: 45,
      desc: "Private GPU hosting on sovereign VPC infrastructure for strict data privacy.",
      productionRole: "Deploys air-gapped open-weights models for regulated clients",
    },
    {
      name: "Fine-Tuning LoRA",
      level: 25,
      desc: "Domain-adapted lightweight adapter weights for proprietary syntax & tasks.",
      productionRole: "Specializes compact models for domain-specific classification & JSON",
    },
  ],
};

const LEVEL_LABELS: Record<number, string> = {
  100: "Core",
  70: "Standard",
  45: "Specialized",
  25: "Emerging",
};

const LEVEL_BADGE_STYLES: Record<number, string> = {
  100: "bg-[var(--success)]/12 text-[var(--success)] border-[var(--success)]/30",
  70: "bg-[var(--brand-primary)]/12 text-[var(--brand-primary)] border-[var(--brand-primary)]/30",
  45: "bg-sky-500/12 text-sky-600 dark:text-sky-300 border-sky-500/30",
  25: "bg-amber-500/12 text-amber-600 dark:text-amber-300 border-amber-500/30",
};

function TechMatrixCard({
  item,
  index,
  highlightedLevel,
  isSelected,
  onSelect,
}: {
  item: StackItem;
  index: number;
  highlightedLevel: number | null;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const cardRef = useRef<HTMLDivElement | null>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const spotX = useMotionValue(140);
  const spotY = useMotionValue(110);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [4.5, -4.5]), {
    stiffness: 250,
    damping: 26,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-5.5, 5.5]), {
    stiffness: 250,
    damping: 26,
  });

  const spotlightBg = useMotionTemplate`radial-gradient(280px circle at ${spotX}px ${spotY}px, color-mix(in oklab, var(--success) 14%, transparent), transparent 74%)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const localX = e.clientX - rect.left;
    const localY = e.clientY - rect.top;
    mouseX.set(localX / rect.width - 0.5);
    mouseY.set(localY / rect.height - 0.5);
    spotX.set(localX);
    spotY.set(localY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const isDimmed =
    highlightedLevel !== null && highlightedLevel !== item.level;

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{
        opacity: isDimmed ? 0.38 : 1,
        y: 0,
        scale: isDimmed ? 0.98 : 1,
      }}
      transition={{
        duration: 0.42,
        delay: index * 0.06,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{ perspective: 950 }}
      className="h-full"
    >
      <motion.div
        ref={cardRef}
        onClick={onSelect}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          borderColor: isSelected
            ? "color-mix(in oklab, var(--success) 55%, transparent)"
            : "color-mix(in oklab, var(--border-subtle) 85%, transparent)",
        }}
        whileHover={{ y: -5 }}
        transition={{ type: "spring", stiffness: 320, damping: 24 }}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onSelect();
          }
        }}
        className="group relative h-full p-5 sm:p-6 rounded-2xl bg-[var(--bg-elevated)]/92 backdrop-blur-md border shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between cursor-pointer focus:outline-none"
      >
        {/* Cursor-Tracked Optical Spotlight */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: spotlightBg }}
        />

        {/* Soft Luminous Top Glass Rim (Zero Black Outline) */}
        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-x-6 top-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--success)] to-transparent transition-opacity duration-300",
            isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          )}
        />

        <div className="relative z-10">
          {/* Header Row: Brand Logo + Name + Maturity Pill */}
          <div className="flex items-start justify-between gap-2.5 pb-3.5 border-b border-[var(--border-subtle)]/70 mb-3.5">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center justify-center p-1.5 shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-2xs">
                {TECH_LOGOS[item.name] || (
                  <Binary className="w-4 h-4 text-[var(--brand-primary)]" />
                )}
              </div>
              <span className="font-display font-bold text-sm text-[var(--text-primary)] leading-tight">
                {item.name}
              </span>
            </div>

            <span
              className={cn(
                "px-2 py-0.5 rounded-md border text-[10px] font-bold shrink-0 font-mono tabular-nums",
                LEVEL_BADGE_STYLES[item.level]
              )}
              aria-label={`${item.level}% — ${LEVEL_LABELS[item.level]}`}
            >
              {item.level}%
            </span>
          </div>

          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            {item.desc}
          </p>
        </div>

        {/* Bottom Animated Proficiency Meter */}
        <div className="relative z-10 mt-5 pt-3 border-t border-[var(--border-subtle)]/60 space-y-1.5">
          <div className="flex items-center justify-between font-mono text-[10px]">
            <span className="text-[var(--text-muted)] uppercase tracking-wider">
              {LEVEL_LABELS[item.level]} Tier
            </span>
            <span className="font-semibold text-[var(--text-primary)] inline-flex items-center gap-1">
              <CheckCircle2 size={10} className="text-[var(--success)]" />
              Verified
            </span>
          </div>

          <div className="h-1.5 w-full rounded-full bg-[var(--bg-surface)] overflow-hidden">
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: item.level / 100 }}
              transition={{
                duration: 0.75,
                delay: 0.1 + index * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
              style={{ transformOrigin: "left" }}
              className={cn(
                "h-full w-full rounded-full",
                item.level === 100
                  ? "bg-[var(--success)]"
                  : "bg-gradient-to-r from-[var(--brand-primary)] to-[var(--success)]"
              )}
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function TechMatrix() {
  const [activeTab, setActiveTab] = useState<Tab>("Frontend");
  const [highlightedLevel, setHighlightedLevel] = useState<number | null>(null);
  const [selectedTechName, setSelectedTechName] = useState<string>(
    STACK_DATA.Frontend[0].name
  );

  const consoleRef = useRef<HTMLDivElement | null>(null);
  const spotX = useMotionValue(420);
  const spotY = useMotionValue(220);
  const consoleSpotlightBg = useMotionTemplate`radial-gradient(560px circle at ${spotX}px ${spotY}px, color-mix(in oklab, var(--brand-primary) 10%, transparent), transparent 75%)`;

  const handleConsoleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = consoleRef.current?.getBoundingClientRect();
    if (!rect) return;
    spotX.set(e.clientX - rect.left);
    spotY.set(e.clientY - rect.top);
  };

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    setSelectedTechName(STACK_DATA[tab][0].name);
  };

  const activeTechItem =
    STACK_DATA[activeTab].find((item) => item.name === selectedTechName) ||
    STACK_DATA[activeTab][0];

  return (
    <section
      id="tech-matrix"
      aria-labelledby="tech-heading"
      className="relative isolate overflow-hidden py-24 sm:py-32 px-4 sm:px-6"
    >
      {/* Subtle Ambient Aura Blending Seamlessly With Page Canvas */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(180deg, transparent 0%, black 14%, black 86%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(180deg, transparent 0%, black 14%, black 86%, transparent 100%)",
        }}
      >
        <div
          className="h-[520px] w-[520px] sm:w-[860px] rounded-full opacity-75"
          style={{
            background:
              "radial-gradient(circle, color-mix(in oklab, var(--brand-primary) 12%, transparent) 0%, color-mix(in oklab, var(--success) 5%, transparent) 48%, transparent 72%)",
            filter: "blur(50px)",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto w-full">
        {/* Centered Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-2xl mx-auto mb-12 flex flex-col items-center"
        >
          <ReleasePill>
            <Binary size={13} aria-hidden="true" />
            &nbsp;CURATED STACK PROFICIENCY
          </ReleasePill>

          <h2
            id="tech-heading"
            className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[var(--text-primary)] mt-4 tracking-tight leading-[1.1]"
          >
            Enterprise Technology{" "}
            <span className="text-liquid-gradient">Matrix.</span>
          </h2>

          <p className="text-sm sm:text-base text-[var(--text-secondary)] mt-3 leading-relaxed">
            Tiered by production deployment frequency: Core (100%), Standard (70%), Specialized (45%), Emerging (25%).
          </p>
        </motion.div>

        {/* Spring-Loaded Sliding Category Tabs */}
        <div className="flex justify-center mb-10">
          <div
            role="tablist"
            aria-label="Technology categories"
            className="inline-flex flex-wrap items-center justify-center gap-1.5 p-1.5 rounded-2xl bg-[var(--bg-surface)]/85 backdrop-blur-md border border-[var(--border-subtle)] shadow-2xs"
          >
            {TABS.map((tab) => {
              const isSelected = activeTab === tab;
              return (
                <button
                  key={tab}
                  role="tab"
                  type="button"
                  aria-selected={isSelected}
                  aria-controls={`panel-${tab}`}
                  id={`tab-${tab}`}
                  onClick={() => handleTabChange(tab)}
                  className={cn(
                    "relative px-4 sm:px-5 py-2.5 rounded-xl text-xs font-semibold font-mono transition-colors duration-200 cursor-pointer",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]",
                    isSelected
                      ? "text-[var(--brand-contrast)]"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  )}
                >
                  {isSelected && (
                    <motion.span
                      layoutId="tech-matrix-active-tab"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      className="absolute inset-0 rounded-xl bg-[var(--brand-primary)] shadow-sm -z-10"
                    />
                  )}
                  <span className="relative z-10">{tab}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Glass Matrix Console (Explicit soft border prevents black hover outline) */}
        <div
          ref={consoleRef}
          onMouseMove={handleConsoleMouseMove}
          style={{
            borderColor: "color-mix(in oklab, var(--border-subtle) 85%, transparent)",
          }}
          className="group/console relative rounded-3xl bg-[var(--bg-elevated)]/65 backdrop-blur-xl border p-6 sm:p-8 lg:p-10 max-w-6xl mx-auto shadow-lg overflow-hidden transition-shadow duration-300 hover:shadow-xl"
        >
          {/* Cursor-Tracked Optical Console Spotlight */}
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-0 group-hover/console:opacity-100 transition-opacity duration-300"
            style={{ background: consoleSpotlightBg }}
          />

          {/* Top & Bottom Specular Glass Rims */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-14 top-0 h-px bg-gradient-to-r from-transparent via-[var(--brand-primary)]/50 to-transparent"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-24 bottom-0 h-px bg-gradient-to-r from-transparent via-[var(--success)]/45 to-transparent"
          />

          {/* Interactive Maturity Legend Bar */}
          <div className="relative z-10 flex flex-wrap items-center justify-between pb-6 mb-8 border-b border-[var(--border-subtle)]/80 gap-4">
            <div className="inline-flex items-center gap-2 font-mono text-xs font-semibold text-[var(--text-muted)]">
              <Layers size={14} className="text-[var(--brand-primary)]" />
              <span>Stack Maturity Levels (click to highlight):</span>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
              {Object.entries(LEVEL_LABELS).map(([level, label]) => {
                const numLevel = Number(level);
                const isHighlighted = highlightedLevel === numLevel;
                return (
                  <button
                    key={level}
                    type="button"
                    onClick={() =>
                      setHighlightedLevel((prev) =>
                        prev === numLevel ? null : numLevel
                      )
                    }
                    className={cn(
                      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-all cursor-pointer",
                      isHighlighted
                        ? "bg-[var(--brand-primary)] text-[var(--brand-contrast)] border-[var(--brand-primary)] shadow-2xs"
                        : "bg-[var(--bg-elevated)]/85 text-[var(--text-primary)] border-[var(--border-subtle)] hover:bg-[var(--bg-elevated)]"
                    )}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-sm"
                      style={{
                        backgroundColor: isHighlighted
                          ? "currentColor"
                          : `rgba(84, 101, 113, ${numLevel / 100})`,
                      }}
                      aria-hidden="true"
                    />
                    <span>
                      {level}% {label}
                    </span>
                  </button>
                );
              })}

              {highlightedLevel !== null && (
                <button
                  type="button"
                  onClick={() => setHighlightedLevel(null)}
                  className="font-mono text-[11px] font-semibold text-[var(--brand-primary)] hover:underline ml-1 cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Animated Tab Panel */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              id={`panel-${activeTab}`}
              role="tabpanel"
              aria-labelledby={`tab-${activeTab}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6"
            >
              {STACK_DATA[activeTab].map((item, idx) => (
                <TechMatrixCard
                  key={item.name}
                  item={item}
                  index={idx}
                  highlightedLevel={highlightedLevel}
                  isSelected={activeTechItem.name === item.name}
                  onSelect={() => setSelectedTechName(item.name)}
                />
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Interactive Selected Technology Production Role Strip */}
          <div className="relative z-10 mt-8 p-4 rounded-2xl devcore-glass-inset flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start sm:items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-[var(--success)]/12 text-[var(--success)] flex items-center justify-center shrink-0">
                <Cpu size={14} />
              </div>
              <AnimatePresence mode="wait">
                <motion.p
                  key={activeTechItem.name}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="font-mono text-xs text-[var(--text-secondary)] truncate"
                >
                  <strong className="text-[var(--text-primary)] font-bold">
                    {activeTechItem.name}:
                  </strong>{" "}
                  {activeTechItem.productionRole}
                </motion.p>
              </AnimatePresence>
            </div>

            <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-[var(--brand-primary)] font-semibold shrink-0">
              <Sparkles size={12} />
              <span>Click any card to inspect role</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}