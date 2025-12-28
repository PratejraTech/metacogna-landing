
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
}

export interface ServiceCatalog {
  technical: ServiceItem[];
  executiveOps: ServiceItem[];
  solutionsDesign: ServiceItem[];
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
        description: "We diagnose your current trajectory against harsh market realities to identify points of failure before they occur. By building data-driven 'Pivot or Persevere' decision trees, we help you navigate existential crossroads without ego clouding the judgment.",
        tags: ["Strategy", "Market Analysis", "Decision Science"]
      },
      {
        id: "ops-capital",
        name: "Capital Efficiency & Unit Economics",
        description: "We optimize your startup's 'Power Supply' by rigorously analyzing burn rates, unit economics, and capital allocation. Our focus is on extending your runway through efficiency and structuring operations to ensure you survive long enough to thrive.",
        tags: ["Finance", "Unit Economics", "Runway"]
      },
      {
        id: "ops-human",
        name: "Human Systems Engineering",
        description: "We design the 'wetware' architecture of your organization to prevent communication deadlocks and role ambiguity. This involves defining clear responsibilities and information buses, ensuring that your team structure scales effectively as complexity increases.",
        tags: ["Org Design", "Hiring", "Culture"]
      }
    ],

    solutionsDesign: [
      {
        id: "sol-graph",
        name: "Graphical Representations of Complex Data",
        description: "We transform flat, unintelligible datasets into interactive, multi-dimensional knowledge graphs. By visualizing the relationships between entities, we unlock insights that were previously hidden in spreadsheets, creating 'Organizational Memory' that actually works.",
        tags: ["Data Vis", "Knowledge Graph", "Neo4j"]
      },
      {
        id: "sol-entropy",
        name: "Workflow Entropy Reduction",
        description: "We map your existing chaotic processes, identifying human-in-the-loop bottlenecks and energy leaks. Then, we refactor these workflows for automation and sanity, reducing operational entropy and freeing your team to focus on high-leverage creative work.",
        tags: ["Process Mapping", "Automation", "Efficiency"]
      },
      {
        id: "sol-pmf",
        name: "PMF Stress Testing",
        description: "We conduct rigorous validation of your value propositions before a single line of code is written. By aggressively testing assumptions and seeking disconfirming evidence, we kill bad ideas early, saving you from building products that nobody wants.",
        tags: ["Validation", "User Research", "Market Fit"]
      },
      {
        id: "sol-revops",
        name: "RevOps Architecture",
        description: "We architect the data flow across your sales and marketing funnels to create a single source of truth. By connecting your CRM, automation tools, and analytics platforms, we ensure that every interaction is tracked and every lead is nurtured efficiently.",
        tags: ["CRM", "HubSpot", "Data Flow"]
      }
    ],

    technical: [
      {
        id: "tech-fs",
        name: "Full-Stack Web Development",
        description: "We build robust, scalable full-stack applications using modern frameworks that prioritize performance and maintainability. Our focus is on creating clean, self-documenting codebases that can grow with your business, ensuring fast load times and a seamless user experience.",
        tags: ["React", "Node.js", "Next.js", "TypeScript"]
      },
      {
        id: "tech-ai",
        name: "AI & ML Engineering",
        description: "We move beyond the hype to implement practical, high-value AI solutions, from RAG architectures to fine-tuned models. We integrate these systems into your existing workflows to solve specific problems, enhancing capabilities without introducing unnecessary complexity.",
        tags: ["Python", "LLMs", "RAG", "Data Pipelines"]
      },
      {
        id: "tech-mobile",
        name: "Mobile & Native Solutions",
        description: "We develop high-performance native and cross-platform mobile applications for iOS and Android. By leveraging tools like React Native and Expo, we deliver fluid, responsive experiences that maintain native feel while maximizing code reuse and development speed.",
        tags: ["React Native", "Expo", "Mobile Architecture"]
      },
      {
        id: "tech-arch",
        name: "Systems Architecture",
        description: "We design the invisible skeleton that holds your digital infrastructure together, ensuring security, scalability, and reliability. From database schema design to cloud infrastructure orchestration, we build the foundation that supports your application's weight.",
        tags: ["Cloud Infrastructure", "Database Design", "Security"]
      }
    ]
  }
};

export default metacognaProfile;
