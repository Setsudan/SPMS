import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class SkillsSeeder {
  private readonly logger = new Logger(SkillsSeeder.name);

  constructor(private readonly prisma: PrismaService) {}

  async seed() {
    const skills = [
        // Programming Languages
        { name: 'JavaScript', description: 'Frontend & Backend development' },
        { name: 'TypeScript', description: 'Strictly typed JavaScript' },
        { name: 'Python', description: 'Data Science, AI, and Backend' },
        { name: 'Go', description: 'High-performance, concurrent backend development' },
        { name: 'Rust', description: 'Memory-safe, high-performance programming' },
        { name: 'C', description: 'Low-level system programming' },
        { name: 'C++', description: 'Performance-critical applications and game development' },
        { name: 'C#', description: 'Game development (Unity) and enterprise applications' },
        { name: 'Java', description: 'Backend, Android development, and enterprise applications' },
        { name: 'Kotlin', description: 'Modern Android and backend development' },
        { name: 'Swift', description: 'iOS/macOS app development' },
        { name: 'Dart', description: 'Flutter-based mobile and web development' },
        { name: 'Ruby', description: 'Web development with Ruby on Rails' },
        { name: 'PHP', description: 'Web development, mainly for backend' },
        { name: 'Shell Scripting', description: 'Automating system tasks with Bash/Zsh' },

        // Web Development (Frontend)
        { name: 'HTML', description: 'Markup language for web pages' },
        { name: 'CSS', description: 'Styling for web pages' },
        { name: 'SCSS/SASS', description: 'CSS preprocessor with variables and functions' },
        { name: 'Tailwind CSS', description: 'Utility-first CSS framework' },
        { name: 'Bootstrap', description: 'Popular CSS framework for responsive design' },

        // Frontend Frameworks & Libraries
        { name: 'Angular', description: 'TypeScript-based frontend framework' },
        { name: 'Vue.js', description: 'Lightweight, progressive frontend framework' },
        { name: 'Svelte', description: 'Modern frontend framework with compiler optimizations' },
        { name: 'Lit', description: 'Lightweight library for Web Components' },

        // Backend Frameworks
        { name: 'NestJS', description: 'Node.js framework for scalable applications' },
        { name: 'Express.js', description: 'Minimalist web framework for Node.js' },
        { name: 'Fastify', description: 'High-performance web framework for Node.js' },
        { name: 'Spring Boot', description: 'Java backend framework for microservices' },
        { name: 'Django', description: 'Python web framework with built-in admin panel' },
        { name: 'Flask', description: 'Lightweight Python web framework' },
        { name: 'Fiber', description: 'Fast Golang web framework' },

        // Databases & ORM
        { name: 'SQL', description: 'Structured Query Language for relational databases' },
        { name: 'PostgreSQL', description: 'Advanced open-source relational database' },
        { name: 'MySQL', description: 'Popular relational database' },
        { name: 'SQLite', description: 'Lightweight, file-based database' },
        { name: 'MongoDB', description: 'NoSQL database for flexible data storage' },
        { name: 'Redis', description: 'In-memory key-value store for caching' },
        { name: 'Neo4j', description: 'Graph database for complex relationships' },
        { name: 'Prisma ORM', description: 'TypeScript ORM for databases' },
        { name: 'TypeORM', description: 'ORM for TypeScript and JavaScript' },

        // Cloud & DevOps
        { name: 'Docker', description: 'Containerization platform' },
        { name: 'Kubernetes', description: 'Container orchestration system' },
        { name: 'Terraform', description: 'Infrastructure as Code (IaC)' },
        { name: 'AWS', description: 'Amazon Web Services for cloud computing' },
        { name: 'Google Cloud Platform', description: 'Cloud computing services by Google' },
        { name: 'Azure', description: 'Microsoft’s cloud computing platform' },
        { name: 'Firebase', description: 'Google’s backend-as-a-service for web & mobile' },
        { name: 'Vercel', description: 'Frontend deployment platform' },
        { name: 'Cloudflare Workers', description: 'Serverless compute on the edge' },
        { name: 'CI/CD', description: 'Continuous Integration/Continuous Deployment' },
        { name: 'GitHub Actions', description: 'Automation for CI/CD workflows' },
        { name: 'Jenkins', description: 'Automation server for CI/CD' },

        // API & Authentication
        { name: 'GraphQL', description: 'Query language for APIs' },
        { name: 'REST API', description: 'Standard architecture for web APIs' },
        { name: 'WebSockets', description: 'Real-time communication protocol' },
        { name: 'OAuth', description: 'Authorization framework' },
        { name: 'JWT', description: 'JSON Web Token for authentication' },

        // AI, Machine Learning & Data Science
        { name: 'Machine Learning', description: 'Training models for AI applications' },
        { name: 'Deep Learning', description: 'Advanced neural networks and AI' },
        { name: 'TensorFlow', description: 'Machine learning framework' },
        { name: 'PyTorch', description: 'Deep learning framework' },
        { name: 'Pandas', description: 'Data analysis library for Python' },
        { name: 'NumPy', description: 'Scientific computing library for Python' },
        { name: 'scikit-learn', description: 'Machine learning library for Python' },

        // Blockchain & Web3
        { name: 'Solidity', description: 'Smart contract programming language for Ethereum' },
        { name: 'Hardhat', description: 'Ethereum development environment' },
        { name: 'Web3.js', description: 'Ethereum blockchain interaction library' },
        { name: 'Ethers.js', description: 'Ethereum smart contract library' },

        // System Administration & Security
        { name: 'Linux', description: 'Operating system for servers & development' },
        { name: 'Bash Scripting', description: 'Automating system tasks' },
        { name: 'Ansible', description: 'IT automation tool' },
        { name: 'Cybersecurity', description: 'Protecting systems from attacks' },
        { name: 'Penetration Testing', description: 'Security testing methodologies' },

        // Testing & Debugging
        { name: 'Jest', description: 'JavaScript testing framework' },
        { name: 'Mocha', description: 'JavaScript test framework' },
        { name: 'Cypress', description: 'End-to-end testing framework' },
        { name: 'Postman', description: 'API testing tool' },

        // Mobile App Development
        { name: 'Flutter', description: 'Cross-platform mobile development' },
        { name: 'React Native', description: 'JavaScript framework for mobile apps' },
        { name: 'SwiftUI', description: 'Modern UI framework for iOS' },

        // Miscellaneous
        { name: 'Git', description: 'Version control system' },
        { name: 'GitHub', description: 'Hosting service for Git repositories' },
        { name: 'GitLab', description: 'CI/CD and version control' },
        { name: 'Notion', description: 'Knowledge management and note-taking' },
        { name: 'Figma', description: 'UI/UX design tool' },
        { name: 'Adobe XD', description: 'User experience design software' }
        ];


    for (const skill of skills) {
      await this.prisma.client.skill.upsert({
        where: { name: skill.name },
        update: {},
        create: { name: skill.name, description: skill.description },
      });
      this.logger.log(`Inserted skill: ${skill.name}`);
    }
  }
}
