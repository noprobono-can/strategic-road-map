export interface Company {
  id: string;
  name: string;
  role: string;
}

export const COMPANIES: Company[] = [
  {
    id: "pmi-energy",
    name: "PMI Energy",
    role: "Industrial power backup, power electronics and integrated storage systems",
  },
  {
    id: "custom-lithium-battery",
    name: "Custom Lithium Battery Entity",
    role: "Application-specific lithium battery-pack design and integration",
  },
  {
    id: "workybe",
    name: "Workybe",
    role: "AI, machine learning and IoT software for energy and asset management",
  },
  {
    id: "agrovisio",
    name: "Agrovisio",
    role: "Agricultural image intelligence for crop and plant monitoring",
  },
  {
    id: "accelflare",
    name: "Accelflare",
    role: "Rapid AI software development and digital-twin technology",
  },
  {
    id: "eeli",
    name: "EELI",
    role: "Electrochemical recovery of lithium and other valuable minerals",
  },
  {
    id: "bottom-up",
    name: "Bottom Up",
    role: "Algorithmic trading technology with a pathway into energy trading",
  },
];

export const DEFAULT_COMPANY_ID = COMPANIES[0].id;
