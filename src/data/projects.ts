export interface Project {
  id: string;
  title: string;
  url: string;
  href?: string;
  snippet: string;
  tags: string[];
  image: string;
  details: string;
}

export const projects: Project[] = [
  {
    id: "project-1",
    title: "Analysis of Machine Learning Methods with Regression",
    url: "dvayn.com › projects › ml-analysis",
    href: "/analysis-of-machine-learning-methods.pdf",
    snippet:
      "Built a classification pipeline across <b>32,560+ census records</b>, achieving <b>78.01% accuracy</b> with Logistic Regression.",
    tags: [
      "Python",
      "scikit-learn",
      "Jupyter",
      "Machine Learning",
      "NumPy",
      "Pandas",
    ],
    image: "/ml-methods-page-18.png",
    details:
      "Aug 2022 - Mar 2024. Created a classification pipeline across more than 32,560 U.S. Census records to predict adult income brackets, using NumPy and Pandas for data handling and visualization. Achieved 78.01% prediction accuracy with Logistic Regression after evaluating Decision Trees, KNN, and SVM in scikit-learn using 5-fold cross-validation. Wrote a 20-page research paper detailing the methodology and comparative results.",
  },
  {
    id: "project-2",
    title: "BitWizards",
    url: "bitwizards-seven.vercel.app",
    href: "https://bitwizards-seven.vercel.app/",
    snippet:
      "Built a fantasy-themed visual programming environment with <b>15+ custom blocks</b> during the <b>12-hour Cutie Hack 2025</b>.",
    tags: ["Next.js", "React", "TypeScript", "Blockly", "Vercel"],
    image: "/bitwizards-home.png",
    details:
      "Nov 2025. Served as Fullstack Developer and shipped BitWizards during a 12-hour hackathon. Engineered an interactive visual programming environment with Next.js, React, TypeScript, and Blockly, mapping custom block-based logic into executable JavaScript. Designed more than 15 custom syntax and control-flow blocks with code generators and a sandboxed client-side runtime for real-time evaluation and instant visual feedback, then deployed the completed app on Vercel.",
  },
  {
    id: "project-3",
    title: "Personal Website",
    url: "github.com › davidvayn › website",
    href: "https://github.com/davidvayn/website",
    snippet:
      "A Google-search-styled personal portfolio built with <b>Next.js</b>, <b>React</b>, <b>TypeScript</b>, and <b>Tailwind CSS</b>, featuring an <b>AI Overview</b> search powered by <b>Gemini</b>.",
    tags: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Gemini"],
    image: "/website.png",
    details:
      "May 2026 - Present. Architected a multimodal portfolio that reimagines a resume as a Google search results page. Built with Next.js, React, TypeScript, and Tailwind CSS, it features typed, voice, and visual search with fuzzy ranking and typo tolerance. Eliminated redundant LLM calls and reduced repeat-query latency with a client-side session cache, pre-rendered summaries, and streamed Gemini API responses.",
  },
  {
    id: "project-4",
    title: "Open Source Poker Solver",
    url: "github.com › davidvayn › pokersolver",
    href: "https://github.com/davidvayn/pokersolver",
    snippet:
      "Rust CFR/neural Heads-Up No-Limit Hold'em trainer achieving <b>95.2% action-EV precision</b> and <b>100% policy-lookup coverage</b> across <b>114 automated tests</b>.",
    tags: [
      "Rust",
      "CFR",
      "Neural Networks",
      "Next.js",
      "TypeScript",
      "IndexedDB",
      "Poker",
    ],
    image: "",
    details:
      "Jul 2026 - Present. Engineered a full-stack Heads-Up No-Limit Hold'em trainer that integrates a high-performance Rust counterfactual regret minimization and neural solver with a Next.js gameplay interface. Achieved 95.2% action-EV precision and 100% policy-lookup coverage through compressed-model inference, exact card-removal logic, and deterministic betting-state trees. Built real-time expected-value feedback, adaptive drill modes, and IndexedDB session persistence while maintaining reliability across 114 automated tests.",
  },
];
