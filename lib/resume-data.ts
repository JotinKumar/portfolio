export interface ResumeExperience {
  id: string;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
  achievements: string[];
  skills: string[];
}

export const RESUME_NAME = "Jotin Kumar Madugula";
export const RESUME_TITLE = "Pricing and Solutions Director";
export const RESUME_LOCATION = "Hyderabad, India";
export const RESUME_DOWNLOAD_PATH = "/jotin-madugula-resume.pdf";

export const RESUME_SUMMARY =
  "A seasoned professional with 21+ years of experience in the BPO/ITES industry, including 13 years in US Healthcare Operations and 8+ years in Pricing and Financial Strategy. As a Director in Pricing and Solutioning, he has hands-on experience in end-to-end RFX pricing, multi-geo cost modelling, and crafting financial narratives to drive multi-million-dollar deal closures. He has also led global delivery operations, scaling teams and driving SLA/KPI excellence through automation, process re-engineering, and analytics.";

export const RESUME_CORE_COMPETENCIES = [
  "Strategic Pricing & RFX Ownership",
  "Multi-Geo Cost Modelling",
  "Executive Financial Storytelling",
  "Price-to-Win Strategy",
  "US Healthcare Life Cycle Expertise",
  "Operations Leadership",
  "Process Re-engineering",
  "RPA and Automation",
  "MIS & Performance Analytics",
  "Global Stakeholder Governance",
];

export const RESUME_EXPERIENCES: ResumeExperience[] = [
  {
    id: "sutherland-pricing-director",
    company: "Sutherland Global Services",
    role: "Pricing and Solutions - Director",
    location: "Hyderabad, India",
    startDate: "Oct 2018",
    endDate: undefined,
    current: true,
    description:
      "Own end-to-end pricing for complex global RFX/RFP opportunities across multiple geographies, combining healthcare domain depth with commercial rigor to deliver competitive and compliant financial solutions.",
    skills: [
      "Strategic Pricing",
      "RFX/RFP Ownership",
      "Multi-Geo Cost Modelling",
      "Price-to-Win",
      "Financial Modelling",
      "Automation",
    ],
    achievements: [
      "Designed and validated Cost-Plus, Outcome-Based, Transactional, T&M, TCO, and Revenue Share models aligned to margin and growth goals.",
      "Built competitive benchmarks and analyzed cost drivers and financial risks for new-logo pursuits and expansion deals.",
      "Led process automation using Excel VBA and RPA principles to improve data consistency and reduce turnaround time.",
      "Drove innovation through strategic inputs for AI-enhanced internal tools to improve team productivity.",
    ],
  },
  {
    id: "sutherland-operations-manager",
    company: "Sutherland Global Services",
    role: "Operations Leadership - Deputy Manager / Manager",
    location: "Hyderabad, India",
    startDate: "Apr 2013",
    endDate: "Sep 2018",
    current: false,
    description:
      "Led end-to-end US healthcare operations covering Credentialing, Claims Administration, and Benefits with ownership of scale, quality, and contractual performance.",
    skills: [
      "Operations Leadership",
      "SLA/KPI Governance",
      "Capacity Planning",
      "Stakeholder Management",
      "People Management",
      "Continuous Improvement",
    ],
    achievements: [
      "Managed 200+ FTEs across healthcare operations while maintaining efficiency and contractual targets.",
      "Scaled operations across complex global delivery centers with strong quality outcomes.",
      "Integrated automation and continuous improvement initiatives to improve productivity.",
      "Built leadership bench strength by mentoring high-potential talent into expanded roles.",
    ],
  },
  {
    id: "sutherland-team-manager",
    company: "Sutherland Global Services",
    role: "Operations - Team Manager / Associate Manager",
    location: "Hyderabad, India",
    startDate: "Apr 2010",
    endDate: "Mar 2013",
    current: false,
    description:
      "Managed healthcare backend operations teams with accountability for delivery quality, SLA adherence, client governance, and productivity improvement.",
    skills: [
      "Team Management",
      "Client Governance",
      "Healthcare Operations",
      "Training & Coaching",
      "Process Improvement",
    ],
    achievements: [
      "Led teams across stages of the US healthcare backend lifecycle with high data accuracy.",
      "Owned performance tracking and governance calls as key client contact.",
      "Implemented training and productivity enhancement programs to optimize workflows.",
    ],
  },
  {
    id: "sutherland-associate-mis-sme",
    company: "Sutherland Global Services",
    role: "Entry-Level - Associate / MIS / SME",
    location: "Hyderabad, India",
    startDate: "Jun 2004",
    endDate: "Mar 2010",
    current: false,
    description:
      "Progressed through associate, MIS, and SME responsibilities by building data visibility, improving workflows, and supporting operational decision-making.",
    skills: [
      "MIS & Analytics",
      "Dashboarding",
      "Workflow Optimization",
      "SLA Tracking",
      "Team Supervision",
    ],
    achievements: [
      "Developed automated dashboards and performance metrics for operations leadership.",
      "Identified and removed bottlenecks in data validation and backend research workflows.",
      "Managed small teams for daily SLA adherence and analytical support.",
    ],
  },
];
