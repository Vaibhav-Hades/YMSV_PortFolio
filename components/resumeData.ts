/**
 * Centralized Resume Data Configuration
 * 
 * Edit this file to customize the content on your portfolio website.
 * All text, project details, skills, and links are imported from here.
 */

export const resumeData = {
  // PERSONAL DETAILS
  // NOTE: Replace "Sai Yelem" with your full name if desired.
  firstName: "Yele",
  lastName: "Mohan Sai Vaibhav",
  title: "Computer Science Undergraduate",
  subtitle: "Passionate about software engineering and artificial intelligence. Crafting real-world scalable applications with modern tech stacks.",
  email: "2400030527cse3@gmail.com", // Replace with your actual email
  github: "https://github.com/Vaibhav-Hades", // Replace with your actual GitHub profile
  linkedin: "https://www.linkedin.com/in/mohan-sai-vaibhav-yele-b61335344/", // Replace with your actual LinkedIn profile
  certificateRepo: "https://drive.google.com/drive/folders/1XidFy7wTNa0XQDEXEUwdmiw4g07-oCiY", // Replace with your certificates repository URL

  // PROFESSIONAL SUMMARY
  summary: "Computer Science undergraduate passionate about software engineering and artificial intelligence, with strong problem-solving and analytical abilities. Experienced in building real-world full-stack applications and continuously expanding expertise in machine learning, data science, cloud computing, and modern software development.",

  // EDUCATION
  education: [
    {
      institution: "Koneru Lakshmaiah University",
      period: "2024 – 2028",
      degree: "Bachelor of Technology (Computer Science Engineering)",
      details: "CGPA: 9.07 / 10",
      location: "Vijayawada, Andhra Pradesh"
    },
    {
      institution: "Sri Sarada Junior College",
      period: "2022 – 2024",
      degree: "Intermediate (MPC)",
      details: "Percentage: 92%",
      location: "Vijayawada, Andhra Pradesh"
    }
  ],

  // TECHNICAL SKILLS (Grouped for interactive categorization)
  skills: [
    {
      category: "Programming",
      items: ["Java", "Python", "C", "SQL"]
    },
    {
      category: "Web Development",
      items: ["HTML", "CSS", "JavaScript", "React", "Node.js"]
    },
    {
      category: "Backend Engineering",
      items: ["Spring Boot", "REST API Design", "Spring Security", "MVC Architecture", "JWT Authentication", "CORS"]
    },
    {
      category: "Databases",
      items: ["MySQL", "PostgreSQL", "Database Design"]
    },
    {
      category: "Tools & Concepts",
      items: ["Git", "GitHub", "VS Code", "Eclipse", "AWS", "API Integration", "Debugging"]
    },
    {
      category: "Data Science & AI",
      items: ["NumPy", "Pandas", "Feature Engineering", "EDA", "Data Visualization", "Machine Learning", "NLP", "Prompt Engineering", "LLM Application Dev", "Semantic Search"]
    },
    {
      category: "Core Computer Science",
      items: ["Data Structures & Algorithms", "OOP", "DBMS", "Operating Systems", "Computer Networks", "Software Engineering"]
    }
  ],

  // PROJECTS
  projects: [
    {
      title: "AgriValue Connect",
      subtitle: "Agricultural Marketplace Platform",
      description: "Built a scalable full-stack marketplace enabling secure farmer-to-buyer transactions through role-based authentication and RESTful services.",
      demoUrl: "https://agri-value-connect-frontend.vercel.app/", // Replace with live demo URL if available
      githubUrl: "https://github.com/Vaibhav-Hades/AgriValue-Connect-Frontend", // Replace with project GitHub
      tags: ["React", "Spring Boot", "MySQL", "REST APIs", "Security"]
    },
    {
      title: "TruthLens AI",
      subtitle: "Video Analysis Platform",
      description: "Developed and deployed a full-stack AI platform for multilingual misinformation detection using NLP, secure REST APIs, and cloud-based architecture.",
      githubUrl: "https://github.com/Vaibhav-Hades/TruthLensAI", // Replace with project GitHub
      tags: ["Python", "React", "NLP", "Machine Learning", "FastAPI"]
    },
    {
      title: "HealthAI",
      subtitle: "IoT Health Monitoring System",
      description: "Engineered a real-time healthcare monitoring platform for patient data visualization and analysis using React, Spring Boot, and MySQL.",
      githubUrl: "https://github.com/Vaibhav-Hades/HealthAI-Monitoring-System", // Replace with project GitHub
      tags: ["React", "Spring Boot", "MySQL", "IoT", "Data Viz"]
    },
    {
      title: "Transaction Management API",
      subtitle: "Backend System",
      description: "Designed and developed a secure RESTful backend system for transaction processing using Spring Boot, MySQL, and scalable software architecture.",
      githubUrl: "https://github.com/Vaibhav-Hades/Transaction-Management-API-Backend-System", // Replace with project GitHub
      tags: ["Spring Boot", "MySQL", "RESTful APIs", "JWT", "Security"]
    }
  ],

  // CERTIFICATIONS
  certifications: [
    {
      name: "AWS Certified Cloud Practitioner",
      validity: "Valid: Jul. 2026 – Jul. 2029",
      issuer: "Amazon Web Services (AWS)"
    },
    {
      name: "Cambridge Linguaskill English Assessment",
      validity: "CEFR Level: B2 (Overall Score: 161)",
      issuer: "Cambridge English Language Assessment"
    },
    {
      name: "Data Science Master Virtual Internship",
      validity: "Period: Apr. 2026 – Jun. 2026",
      issuer: "AICTE — EduSkills — Siemens"
    }
  ],

  // ENGINEERING STRENGTHS
  strengths: [
    "AI-Assisted Software Development",
    "Rapid Prototyping",
    "LLM Application Development",
    "Problem Solving",
    "Scalable System Design",
    "Cloud-Native Development",
    "AI Tool Integration",
    "Analytical Thinking",
    "Debugging & Optimization",
    "Continuous Learning"
  ]
};
