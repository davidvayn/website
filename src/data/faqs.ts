export interface FAQ {
  question: string;
  answer: string;
}

export const faqs: FAQ[] = [
  {
    question: "What technologies does David Vayntrub use?",
    answer:
      "David works with Python, TypeScript, JavaScript, Rust, C++, Java, SQL, and HTML/CSS. His toolkit includes PyTorch, React, Next.js, Three.js, Vite, Tailwind CSS, scikit-learn, pandas, NumPy, Google Blockly, PyAudio, SpeechRecognition, Supabase/PostgreSQL, IndexedDB, Git, Figma, Jupyter Notebooks, Gemini, Anthropic, LlamaParse, FlyVis, FlyWire, and REST APIs.",
  },
  {
    question: "Where does David Vayntrub go to school?",
    answer:
      "David is currently pursuing a degree in Computer Science at the University of California, Riverside (UCR), with an expected graduation in 2027.",
  },
  {
    question: "What is David Vayntrub's specialized experience?",
    answer:
      "David specializes in AI integration, full-stack development, machine learning, real-time systems, and computational neuroscience. His work includes cofounding StudySpot, developing voice control for a self-moving chess set, shipping a Blockly programming environment, building a Rust CFR/neural poker solver with 95.2% action-EV precision, and creating PokerFly: a FlyVis-constrained PyTorch network that reached 85.5% teacher agreement while driving a live Three.js neural-activity interface.",
  },
  {
    question: "What is PokerFly?",
    answer:
      "PokerFly is David's experimental neural observatory for studying whether a poker policy can be distilled into a recurrent network constrained by fruit-fly visual-system wiring. Its 56,752-parameter PyTorch student models 443 cells and 7,698 directed edges, reached 85.5% teacher top-action agreement on 435 held-out decisions, and powers an interactive React and Three.js experience built around 118,104 measured FlyWire soma positions. It is a policy-imitation research experiment rather than a biological whole-brain simulation or a validated poker solver.",
  },
];
