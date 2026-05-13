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
    title: "Inventory Management System",
    url: "dvayn.com › projects › inventory-system",
    snippet:
      "RESTful API for inventory management built with <b>Java Spring Boot</b> and <b>MySQL</b>.",
    tags: ["Java", "Spring Boot", "MySQL", "REST API"],
    image: "/placeholder-inventory.svg",
    details:
      "Jun 2025 - Jul 2025. Individually designed a RESTful inventory management API using Java Spring Boot. Implemented CRUD functionality, category-based filtering, and integration with MySQL for persistence.",
  },
  {
    id: "project-3",
    title: "Task Terry - Schedule Management App",
    url: "dvayn.com › projects › task-terry",
    snippet:
      "Full-stack schedule management app using <b>C++</b>, <b>Node.js/Express</b>, and <b>React + Tailwind CSS</b>.",
    tags: ["C++", "Node.js", "React", "Tailwind CSS", "Express"],
    image: "/placeholder-task-terry.svg",
    details:
      "Apr 2025 - Jun 2025. Developed a full-stack schedule management web app using C++ backend integrated with Node.js/Express and a React + Tailwind CSS frontend. Applied Agile and SOLID principles. Implemented unit tests using Google Test for high reliability across C++-JS communication.",
  },
];
