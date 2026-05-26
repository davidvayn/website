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
    title: "Analysis of Machine Learning Methods",
    url: "dvayn.com › projects › ml-analysis",
    href: "/analysis-of-machine-learning-methods.pdf",
    snippet:
      "Analyzed classification and regression models using <b>Jupyter Notebook</b>, <b>Python</b> (NumPy, Pandas), <b>SVM</b>, and <b>KNN</b>.",
    tags: ["Python", "Jupyter", "Machine Learning", "NumPy", "Pandas"],
    image: "/ml-methods-page-18.png",
    details:
      "Aug 2022 - Mar 2024. Analyzed classification models: Decision Trees, Logistic Regression, SVM, and KNN. Used NumPy and Pandas for data visualization and handling. Wrote a 20-page paper analyzing algorithm effectiveness based on multivariable datasets influencing income.",
  },
  {
    id: "project-2",
    title: "BitWizards",
    url: "bitwizards-seven.vercel.app",
    href: "https://bitwizards-seven.vercel.app/",
    snippet:
      "Fantasy-themed educational platform built for <b>Cutie Hack 2025</b> using <b>Next.js</b>, <b>React</b>, <b>TypeScript</b>, and the <b>Blockly Library</b>.",
    tags: ["Next.js", "React", "TypeScript", "Blockly", "Vercel"],
    image: "/bitwizards-home.png",
    details:
      "Nov 2025. Built BitWizards as an educational platform for K-12 students in a 12-hour hackathon. Created a fantasy-themed web experience using Next.js, React, and TypeScript, with Blockly-powered interactive programming blocks backed by real-time JavaScript execution. Deployed the finished app on Vercel.",
  },
];
