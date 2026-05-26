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
    title: "Cofounding Engineer - Study Spot",
    url: "dvayn.com › experience › study-spot",
    href: "https://github.com/twaldin/studyspot",
    snippet:
      "Cofounding Engineer at <b>Study Spot</b>. AI-based study tool using <b>Anthropic LLM</b>, <b>Next.js</b>, and <b>Supabase</b>. Integrated Canvas LMS API and LlamaParse.",
    details:
      "May 2025 - Sep 2025 · San Francisco, CA. AI-based study tool that uses school documents as context with the Anthropic LLM. Built with Next.js, TypeScript, and Supabase. Integrated Canvas LMS API to determine courses and upload documents based on API key, decreasing onboarding time by 50%. Improved document ingestion speed by 30% using LlamaParse.",
  },
  {
    id: "exp-2",
    title: "Software Engineer - ACM Riverside",
    url: "dvayn.com › experience › acm-riverside",
    href: "https://github.com/acm-ucr/wizard-chess",
    snippet:
      "Software Engineer at <b>ACM Riverside</b>. Developed a self-moving chess set using <b>Python</b>, <b>SpeechRecognizer</b>, and <b>Whisper C++</b>.",
    details:
      "Jan 2025 - Mar 2025 · Riverside, CA. Collaborated on a 10-member team to develop a self-moving chess set. Utilized Python SpeechRecognizer and PyAudio to detect and parse voice commands. Compared Whisper C++ speech-to-text model against Python SpeechRecognizer for speech accuracy to determine optimal implementation.",
  },
];
