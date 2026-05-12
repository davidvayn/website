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
    title: "Full-Stack Developer - Tech Company Inc.",
    url: "dvayn.com › experience › tech-company",
    snippet:
      "Developed and maintained web applications using <b>React</b>, <b>Node.js</b>, and <b>TypeScript</b>. Led migration of legacy systems to modern architecture, improving performance by 40%.",
    details:
      "Led a team of 3 developers in building customer-facing web applications. Architected microservices backend, implemented CI/CD pipelines, and reduced page load times by 40% through code splitting and lazy loading. Collaborated with product and design teams in an Agile environment.",
  },
  {
    id: "exp-2",
    title: "Junior Developer - Startup Co.",
    url: "dvayn.com › experience › startup-co",
    snippet:
      "Built frontend features with <b>React</b> and integrated <b>REST APIs</b>. Contributed to the development of an internal tools dashboard used by 50+ employees daily.",
    details:
      "Developed responsive UI components, integrated third-party APIs, and wrote comprehensive unit tests. Participated in code reviews, contributed to documentation, and helped onboard new team members. Gained experience with agile methodologies and rapid iteration cycles.",
  },
];
