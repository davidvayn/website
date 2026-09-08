export interface Experience {
  id: string;
  title: string;
  url: string;
  href?: string;
  snippet: string;
  details: string;
}

export const experiences: Experience[] = [
  {
    id: "exp-1",
    title: "Cofounding Engineer - StudySpot",
    url: "dvayn.com › experience › study-spot",
    href: "https://studyspot.us",
    snippet:
      "Built an AI study tool with <b>Next.js</b>, <b>TypeScript</b>, <b>Supabase</b>, and the <b>Anthropic LLM</b>, cutting onboarding time by <b>50%</b>.",
    details:
      "May 2025 - Sep 2025. Cofounded an AI study tool that uses school documents as context for the Anthropic LLM, built with a Next.js and TypeScript frontend and Supabase backend. Integrated the Canvas LMS API to identify courses and upload documents from an API key, decreasing new-user onboarding time by 50%. Improved document-ingestion speed by 30% by integrating LlamaParse.",
  },
  {
    id: "exp-2",
    title: "Software Engineer - ACM Riverside Forge",
    url: "dvayn.com › experience › acm-riverside",
    href: "https://github.com/acm-ucr/wizard-chess",
    snippet:
      "Developed voice control for a self-moving chess set, reducing speech-recognition Word Error Rate by <b>73%</b>.",
    details:
      "Jan 2025 - Mar 2025. Collaborated on a 10-member team to develop a self-moving chess set. Used Python SpeechRecognition and PyAudio to detect and parse voice commands, then optimized the speech-processing pipeline to reduce Word Error Rate by 73%, from 15% to 4%.",
  },
];
