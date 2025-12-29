
/**
 * Metacogna Lab - Profile Export
 * Purpose: Data source for Proposal Generation / Website Render / PDF Export
 */

// --- Type Definitions (The "Serious" Structure) ---

export interface ContactDetails {
  entityName: string;
  address: {
    planet: string;
    system: string;
    galaxy: string;
  };
  email: string;
  logoPlaceholder: string; // URL or Base64 string
}

export interface Methodology {
  title: string;
  tagline: string;
  description: string;
  cyclePhilosophy: string;
}

export interface EngagementTier {
  id: string;
  name: string;
  duration: string;
  focus: string;
  deliverables: string[];
}

export interface ServiceItem {
  id: string;
  name: string;
  description: string;
  tags: string[];
  link?: string; // Optional external link
}

export interface ServiceCatalog {
  technical: ServiceItem[];
  executiveOps: ServiceItem[];
  solutionsDesign: ServiceItem[];
  creativeSolutions: ServiceItem[];
}

export interface MetacognaProfile {
  contact: ContactDetails;
  methodology: Methodology;
  engagementModels: EngagementTier[];
  services: ServiceCatalog;
}

// --- The Content (The "Approachable & Creative" Data) ---

export const metacognaProfile: MetacognaProfile = {
  contact: {
    entityName: "Metacogna Lab",
    address: {
      planet: "Earth",
      system: "Solar System",
      galaxy: "Milky Way",
    },
    email: "hi@metacogna.ai",
    // In a real render, replace with actual asset path
    logoPlaceholder: "/assets/branding/metacogna-logo-ink.svg", 
  },

  methodology: {
    title: "High-Velocity Iteration & Abundant Solutions",
    tagline: "Vibe coding at the speed of thought, with the engineering rigor you demand.",
    description: 
      "We believe that perfection is a moving target. Rather than aiming once and missing, " +
      "we utilize high-frequency feedback loops to converge on the optimal solution. " +
      "We combine the creativity of a design studio with the brutality of a systems engineering firm.",
    cyclePhilosophy: 
      "We work in cycles—fractal patterns of development. Whether it's a micro-cycle (hours) " +
      "to fix a bug, or a macro-cycle (months) to pivot a business model, the physics remain the same: " +
      "Observe, Orient, Decide, Act. Fast."
  },

  engagementModels: [
    {
      id: "cycle-spark",
      name: "The Spark (Short Cycle)",
      duration: "2 - 6 Weeks",
      focus: "Validation & Prototyping",
      deliverables: [
        "Rapid Proof of Concept (PoC)",
        "Technical Viability Assessment",
        "Clickable UI/UX Prototypes",
        "Root Cause Diagnosis"
      ]
    },
    {
      id: "cycle-orbit",
      name: "The Orbit (Long Cycle)",
      duration: "3 - 12 Months",
      focus: "Scale, Engineering & Transformation",
      deliverables: [
        "Full-Stack Application Development",
        "Machine Learning Pipeline Integration",
        "Legacy System Migration",
        "Long-term Strategic Pivot Execution"
      ]
    }
  ],

  services: {
    executiveOps: [
      {
        id: "ops-pivot",
        name: "Strategic Pivot Logic",
        description: "We provide an unemotional diagnostic of your current business trajectory against harsh market realities, identifying points of failure before they become existential threats. By building data-driven 'Pivot or Persevere' decision trees, we help executive teams navigate critical crossroads with mathematical confidence rather than ego-driven guesswork.",
        tags: ["Strategy", "Market Analysis", "Decision Science"]
      },
      {
        id: "ops-capital",
        name: "Capital Efficiency & Unit Economics",
        description: "We optimize your startup's 'Power Supply' by rigorously analyzing burn rates, customer acquisition costs, and lifetime value to find the hidden leaks in your balance sheet. Our focus is on extending your runway through operational efficiency and structuring your financial operations to ensure you survive long enough to thrive in a capital-constrained environment.",
        tags: ["Finance", "Unit Economics", "Runway"]
      },
      {
        id: "ops-human",
        name: "Human Systems Engineering",
        description: "We design the 'wetware' architecture of your organization to prevent communication deadlocks, role ambiguity, and decision fatigue. This involves defining clear responsibilities and information buses, ensuring that your team structure scales effectively as complexity increases, treating your org chart as a distributed system that requires latency optimization.",
        tags: ["Org Design", "Hiring", "Culture"]
      }
    ],

    solutionsDesign: [
      {
        id: "sol-graph",
        name: "Graphical Representations of Complex Data",
        description: "We transform flat, unintelligible datasets into interactive, multi-dimensional knowledge graphs. We structure unstructured data using Data Analysis developer tools and LLMs to extract actionable schema from chaos, creating an 'Organizational Memory' that evolves with your data.",
        tags: ["Data Vis", "Knowledge Graph", "Neo4j", "LLM ETL"]
      },
      {
        id: "sol-entropy",
        name: "Workflow Entropy Reduction",
        description: "We map your existing chaotic processes to identify human-in-the-loop bottlenecks and energy leaks that are slowing down delivery. Then, we refactor these workflows for automation and sanity, reducing operational entropy and freeing your team to focus on high-leverage creative work rather than administrative drudgery.",
        tags: ["Process Mapping", "Automation", "Efficiency"]
      },
      {
        id: "sol-pmf",
        name: "PMF Stress Testing",
        description: "We conduct rigorous validation of your value propositions before a single line of code is written, effectively simulating market resistance in a controlled environment. By aggressively testing assumptions and seeking disconfirming evidence, we kill bad ideas early, saving you from the expensive mistake of building products that nobody wants.",
        tags: ["Validation", "User Research", "Market Fit"]
      },
      {
        id: "sol-revops",
        name: "RevOps Architecture",
        description: "We architect the data flow across your sales and marketing funnels to create a single source of truth that aligns revenue teams. By connecting your CRM, automation tools, and analytics platforms into a cohesive ecosystem, we ensure that every interaction is tracked and every lead is nurtured efficiently without data silos.",
        tags: ["CRM", "HubSpot", "Data Flow"]
      }
    ],

    creativeSolutions: [
      {
        id: "create-startup",
        name: "0 to 1: The Startup Catalyst",
        description: "We serve as your entire 'full stack' co-founder, covering the complete lifecycle from Fundraising to Deployment. We bypass the hiring slog to deliver functional Prototypes and scalable MVPs in weeks, tailored to the length of engagement.",
        tags: ["Startup", "MVP", "0-to-1"]
      },
      {
        id: "create-research",
        name: "Research to Product",
        description: "We specialize in the transformation of dense, academic language and frameworks into rich, intuitive user experiences. We bridge the gap between rigorous research and product utility.",
        link: "https://compilar.app",
        tags: ["Academic", "UX Design", "Frameworks"]
      },
      {
        id: "create-enterprise",
        name: "Enterprise Micro-Labs",
        description: "For large organizations stifled by their own gravity, we act as an external 'Skunkworks' to bypass bureaucracy and prove new concepts. We execute micro-projects and rapid experiments outside the main codebase, validating new features or AI integrations before they are merged into the mothership.",
        tags: ["Enterprise", "Innovation", "Skunkworks"]
      },
      {
        id: "create-build",
        name: "Full-Cycle Technical Execution",
        description: "We handle the messy reality of software engineering—from database schema design and API integration to UI implementation and cloud orchestration—so you can focus on the business logic. We don't just write code; we own the outcome, ensuring that the final product is robust, scalable, and ready for the real world.",
        tags: ["Full Stack", "Engineering", "Deployment"]
      }
    ],

    technical: [
      {
        id: "tech-fs",
        name: "Full-Stack Web Development",
        description: "We build robust, scalable full-stack applications using modern frameworks that prioritize performance, security, and maintainability. Our focus is on creating clean, self-documenting codebases that can grow with your business, ensuring fast load times and a seamless user experience across all devices.",
        tags: ["React", "Node.js", "Next.js", "TypeScript"]
      },
      {
        id: "tech-ai",
        name: "AI & ML Engineering",
        description: "We move beyond the hype to implement practical, high-value AI solutions, from RAG architectures to fine-tuned models that actually solve business problems. We integrate these intelligent systems into your existing workflows to enhance capabilities without introducing unnecessary complexity or hallucination risks.",
        tags: ["Python", "LLMs", "RAG", "Data Pipelines"]
      },
      {
        id: "tech-mobile",
        name: "Mobile & Native Solutions",
        description: "We develop high-performance native and cross-platform mobile applications for iOS and Android that users actually enjoy using. By leveraging tools like React Native and Expo, we deliver fluid, responsive experiences that maintain a native feel while maximizing code reuse and development speed.",
        tags: ["React Native", "Expo", "Mobile Architecture"]
      },
      {
        id: "tech-arch",
        name: "Systems Architecture",
        description: "We design the invisible skeleton that holds your digital infrastructure together, ensuring security, scalability, and reliability under load. From database schema design to cloud infrastructure orchestration, we build the foundation that supports your application's weight and future growth.",
        tags: ["Cloud Infrastructure", "Database Design", "Security"]
      }
    ]
  }
};

export default metacognaProfile;
