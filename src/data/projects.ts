export interface Project {
  id: string;
  title: string;
  url: string;
  snippet: string;
  tags: string[];
  image: string;
  details: string;
}

export const projects: Project[] = [
  {
    id: "project-1",
    title: "E-Commerce Platform - Full-Stack Web Application",
    url: "dvayn.com › projects › e-commerce-platform",
    snippet:
      "A full-stack e-commerce platform built with <b>Next.js</b>, <b>TypeScript</b>, and <b>Stripe</b> integration. Features include real-time inventory management, user authentication, and responsive design.",
    tags: ["Next.js", "TypeScript", "Stripe", "PostgreSQL"],
    image: "/placeholder-project-1.svg",
    details:
      "Built a complete e-commerce solution featuring product catalog management, shopping cart functionality, Stripe payment processing, and an admin dashboard. Implemented server-side rendering for SEO optimization and integrated PostgreSQL for data persistence.",
  },
  {
    id: "project-2",
    title: "Real-Time Chat Application - WebSocket Messaging",
    url: "dvayn.com › projects › realtime-chat",
    snippet:
      "A real-time messaging application using <b>React</b>, <b>Node.js</b>, and <b>WebSockets</b>. Supports group chats, file sharing, and end-to-end message delivery tracking.",
    tags: ["React", "Node.js", "WebSocket", "MongoDB"],
    image: "/placeholder-project-2.svg",
    details:
      "Developed a scalable real-time chat application with WebSocket-based communication, supporting multiple chat rooms, file uploads, typing indicators, and message read receipts. Used MongoDB for message persistence and Redis for session management.",
  },
  {
    id: "project-3",
    title: "Task Management Dashboard - Project Tracking Tool",
    url: "dvayn.com › projects › task-dashboard",
    snippet:
      "A project management dashboard built with <b>React</b> and <b>Node.js</b>. Features drag-and-drop task boards, team collaboration tools, and automated workflow notifications.",
    tags: ["React", "Node.js", "REST API", "Tailwind CSS"],
    image: "/placeholder-project-3.svg",
    details:
      "Created a Kanban-style project management tool with drag-and-drop task organization, team member assignment, deadline tracking, and email notifications. Built a RESTful API backend with JWT authentication and role-based access control.",
  },
];
