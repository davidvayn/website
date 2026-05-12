export interface Experience {
  id: string;
  title: string;
  url: string;
  snippet: string;
  details: string;
}

export const experiences: Experience[] = [
  {
    id: "exp-1",
    title: "Cofounding Engineer - Study Spot",
    url: "dvayn.com › experience › study-spot",
    snippet:
      "Cofounding Engineer at <b>Study Spot</b>. AI-based study tool using <b>Anthropic LLM</b>, <b>Next.js</b>, and <b>Supabase</b>. Integrated Canvas LMS API and LlamaParse.",
    details:
      "May 2025 - Sep 2025 · San Francisco, CA. AI-based study tool that uses school documents as context with the Anthropic LLM. Built with Next.js, TypeScript, and Supabase. Integrated Canvas LMS API to determine courses and upload documents based on API key, decreasing onboarding time by 50%. Improved document ingestion speed by 30% using LlamaParse.",
  },
  {
    id: "exp-2",
    title: "Software Engineer - ACM Riverside",
    url: "dvayn.com › experience › acm-riverside",
    snippet:
      "Software Engineer at <b>ACM Riverside</b>. Developed a self-moving chess set using <b>Python</b>, <b>SpeechRecognizer</b>, and <b>Whisper C++</b>.",
    details:
      "Jan 2025 - Mar 2025 · Riverside, CA. Collaborated on a 10-member team to develop a self-moving chess set. Utilized Python SpeechRecognizer and PyAudio to detect and parse voice commands. Compared Whisper C++ speech-to-text model against Python SpeechRecognizer for speech accuracy to determine optimal implementation.",
  },
  {
    id: "exp-3",
    title: "Frontend Developer - Citrus Hack 2025",
    url: "dvayn.com › experience › citrus-hack",
    snippet:
      "Frontend Developer at <b>Citrus Hack</b>. Created an AI-based movie recommendation platform using <b>Next.js</b>, <b>Convex</b>, and <b>Clerk</b>.",
    details:
      "Apr 2025. Created an AI-based movie recommendation platform in a 36-hour hackathon. Used Next.js and TypeScript for frontend with Convex backend and Clerk for authentication. Implemented cosine similarity algorithm in Python to generate user-specific suggestions.",
  },
  {
    id: "exp-4",
    title: "Frontend Developer - Cutie Hack 2025",
    url: "dvayn.com › experience › cutie-hack",
    snippet:
      "Frontend Developer at <b>Cutie Hack</b>. Built a <b>Next.js</b> educational platform for K-12 students using the <b>Blockly Library</b>.",
    details:
      "Nov 2025. Built a Next.js educational platform in a 12-hour hackathon to teach CS fundamentals to K-12 students using the Blockly Library. Coded 15 custom interactive logic blocks backed by real-time JavaScript execution.",
  },
];
