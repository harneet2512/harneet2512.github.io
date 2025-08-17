import React, { useState, useEffect } from 'react';

interface ToolkitCard {
  title: string;
  description: string;
  tools: string[];
  tagline: string;
}

interface ToolkitCategory {
  emoji: string;
  accent: string;
  cards: ToolkitCard[];
}

const TOOLKIT: Record<string, ToolkitCategory> = {
  ai: {
    emoji: '🤖',
    accent: '#7C3AED',
    cards: [
      {
        title: 'Deep Learning & ML Algorithms',
        description: 'Implementing and deploying deep learning models including CNNs, RNNs, Transformers, and traditional ML algorithms for computer vision, NLP, and predictive analytics.',
        tools: ['TensorFlow', 'PyTorch', 'Keras', 'Scikit-learn', 'CNN', 'RNN', 'LSTM', 'GRU', 'Transformers', 'BERT', 'GPT', 'XGBoost', 'Random Forest', 'SVM', 'Neural Networks'],
        tagline: 'State-of-the-art • Production-ready'
      },
      {
        title: 'Computer Vision & Image Processing',
        description: 'Building computer vision systems using OpenCV, deep learning frameworks, and image processing techniques for object detection, segmentation, and analysis.',
        tools: ['OpenCV', 'Pillow', 'TensorFlow Object Detection', 'YOLO', 'Faster R-CNN', 'Mask R-CNN', 'Image Segmentation', 'Image Classification', 'Face Recognition', 'OCR', 'Image Augmentation'],
        tagline: 'Visual intelligence • Real-time processing'
      },
      {
        title: 'Natural Language Processing',
        description: 'Developing NLP solutions using transformers, language models, and text processing techniques for understanding, generation, and analysis of human language.',
        tools: ['Transformers', 'Hugging Face', 'spaCy', 'NLTK', 'BERT', 'GPT', 'T5', 'RoBERTa', 'Named Entity Recognition', 'Sentiment Analysis', 'Text Classification', 'Machine Translation'],
        tagline: 'Language understanding • Context-aware'
      },
      {
        title: 'RAG & Multi-Agent Systems',
        description: 'Building retrieval-augmented generation systems and multi-agent workflows for intelligent information processing, knowledge management, and automated decision-making.',
        tools: ['LangChain', 'LlamaIndex', 'RAGAS', 'Pinecone', 'Weaviate', 'ChromaDB', 'Qdrant', 'AutoGen', 'CrewAI', 'Semantic Search', 'Vector Databases', 'Knowledge Graphs'],
        tagline: 'Intelligent retrieval • Multi-agent orchestration'
      }
    ]
  },
  pm: {
    emoji: '🧭',
    accent: '#06B6D4',
    cards: [
      {
        title: 'Product Vision & Strategy',
        description: 'Turning ambiguous bets into a sequenced roadmap aligned to architecture and business value; crisp narratives that earn alignment.',
        tools: ['OKRs', 'Roadmap Frameworks', 'Productboard', 'Aha!', 'ProductPlan', 'Craft.io', 'Notion', 'Miro', 'Figma', 'Lucidchart', 'Whimsical'],
        tagline: 'Direction with evidence'
      },
      {
        title: 'Discovery & Validation',
        description: 'Research, prototyping, and market probes to validate riskiest assumptions early; reduce waste before build.',
        tools: ['Maze', 'UserTesting', 'Mixpanel', 'Amplitude', 'UserZoom', 'Lookback'],
        tagline: 'Learn fast • Spend smart'
      },
      {
        title: 'Execution & Delivery',
        description: 'Managing scope, dependencies, and risks so teams ship predictably with quality; unblockers, not blockers.',
        tools: ['Jira Advanced Roadmaps', 'Linear', 'ClickUp', 'Monday.com', 'Asana', 'Trello', 'Notion', 'Confluence', 'Slack', 'Microsoft Teams', 'Discord'],
        tagline: 'Cadence you can trust'
      },
      {
        title: 'Analytics-Driven Decisions',
        description: 'Tie KPIs to releases and prioritize based on impact; close the loop with adoption and quality telemetry.',
        tools: ['Amplitude', 'Funnel Dashboards', 'Mixpanel', 'Google Analytics', 'Heap', 'Pendo', 'PostHog', 'Segment', 'RudderStack', 'Snowplow', 'mParticle'],
        tagline: 'Metrics that matter'
      }
    ]
  },
  design: {
    emoji: '✏️',
    accent: '#22C55E',
    cards: [
      {
        title: 'User Research & Discovery',
        description: 'Targeted interviews, surveys, and journey maps that translate directly into roadmap choices.',
        tools: ['JTBD Frameworks', 'UserZoom', 'Lookback', 'UserTesting', 'Mixpanel'],
        tagline: 'Insight → Action'
      },
      {
        title: 'Prototyping & Interaction Design',
        description: 'Low→high fidelity flows in Figma to clarify states and edge cases before code; reduce ambiguity for engineers.',
        tools: ['Figma', 'Interactive Components', 'Adobe XD', 'Sketch'],
        tagline: 'Decide before you build'
      }
    ]
  },
  data: {
    emoji: '📊',
    accent: '#F59E0B',
    cards: [
      {
        title: 'Business Intelligence & Dashboards',
        description: 'Executive-ready dashboards and reporting that surface trends and drive action across teams.',
        tools: ['Power BI', 'Tableau', 'Looker'],
        tagline: 'Signal over noise'
      },
      {
        title: 'Statistical & Predictive Analysis',
        description: 'Forecasting, hypothesis testing, and modeling to inform product bets with rigor.',
        tools: ['Python (NumPy, SciPy)', 'R', 'SAS'],
        tagline: 'Decisions with rigor'
      },
      {
        title: 'Data Strategy & Governance',
        description: 'Quality checks, lineage docs, and governance practices so analytics are trustworthy at scale.',
        tools: ['dbt', 'Data Catalogs'],
        tagline: 'Trust the numbers'
      },
      {
        title: 'Experimentation & A/B Testing',
        description: 'Controlled tests with guardrails and solid measurement to learn without risking the core.',
        tools: ['Optimizely', 'DoE Techniques', 'VWO', 'Google Optimize', 'Adobe Target', 'AB Tasty', 'Convert', 'Kameleoon', 'Dynamic Yield', 'Monetate'],
        tagline: 'Learn without risk'
      }
    ]
  },
  sde: {
    emoji: '🧩',
    accent: '#3B82F6',
    cards: [
      {
        title: 'Full-Stack Development',
        description: 'Reliable end-to-end systems across backend, frontend, and integrations; pragmatic over flashy.',
        tools: ['Java', 'React', 'Node.js', 'Python', 'TypeScript', 'Django', 'FastAPI', 'Next.js'],
        tagline: 'Practical • Maintainable'
      },
      {
        title: 'Cloud Architecture',
        description: 'Distributed services on cloud platforms with sensible SLOs and cost awareness.',
        tools: ['AWS (S3, EC2, IAM)', 'Azure', 'Google Cloud Platform', 'Heroku', 'Vercel'],
        tagline: 'Designed to endure'
      },
      {
        title: 'DevOps & CI/CD',
        description: 'Containerized apps and automated pipelines for faster, safer releases.',
        tools: ['Docker', 'GitHub Actions', 'GitLab CI', 'Kubernetes'],
        tagline: 'Ship with confidence'
      },
      {
        title: 'APIs & Integration',
        description: 'Clean, versioned APIs and secure third-party integrations with strong contracts.',
        tools: ['REST', 'GraphQL', 'Postman', 'AWS API Gateway', 'Azure API Management', 'FastAPI'],
        tagline: 'Contracts that last'
      }
    ]
  }
};

const categories = [
  { key: 'ai', label: 'AI', emoji: '🤖' },
  { key: 'pm', label: 'PM', emoji: '🧭' },
  { key: 'design', label: 'Design', emoji: '✏️' },
  { key: 'data', label: 'Data', emoji: '📊' },
  { key: 'sde', label: 'SDE', emoji: '🧩' }
];

// Grain texture SVG data URI
const grainTexture = `data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E`;

// Helper function for accent colors
const getAccentColor = (category: string) => TOOLKIT[category]?.accent || '#7C3AED';

// ToolkitCard component with enhanced hover and press effects
const ToolkitCard: React.FC<{ card: ToolkitCard; category: string; accent: string }> = ({ card, category, accent }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height
    });
  };
            
            return (
    <div
      className={[
        "group relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md",
        "shadow-[0_8px_30px_rgba(0,0,0,0.25)]",
        "transition-all duration-300 cursor-pointer overflow-hidden",
        !prefersReducedMotion ? "hover:-translate-y-1 hover:scale-[1.02] hover:shadow-[0_20px_60px_rgba(0,0,0,0.4)]" : "",
        "hover:border-white/20 hover:bg-white/8"
      ].join(" ")}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => !prefersReducedMotion && setMousePosition({ x: 0.5, y: 0.5 })}
      onMouseLeave={() => setMousePosition({ x: 0, y: 0 })}
    >
      {/* Icon Badge */}
      <div className="relative mb-4 px-6 pt-6">
        <div 
          className="w-10 h-10 rounded-xl flex items-center justify-center text-lg relative z-10 transition-all duration-300"
          style={{
            backgroundColor: `${accent}20`,
            border: `1px solid ${accent}40`
          }}
        >
          {TOOLKIT[category].emoji}
                    </div>
                  </div>

      {/* Card Content */}
      <div className="space-y-4 relative z-10 px-6 pb-6">
        {/* Title */}
        <h3 className="text-xl font-mono text-white font-light leading-tight">{card.title}</h3>
        
        {/* Description */}
        <p className="text-base font-mono text-gray-400 font-light leading-relaxed">{card.description}</p>

        {/* Tools & Technologies */}
        <div>
          <h4 className="text-xs font-mono text-gray-400 font-medium uppercase tracking-wider mb-3">Tools & Technologies</h4>
                    <div className="flex flex-wrap gap-2">
            {card.tools.map((tool, toolIndex) => (
              <span
                key={toolIndex}
                className="text-xs px-2.5 py-1 rounded-full border border-white/15 bg-white/5 text-gray-300 hover:bg-white/10 hover:border-white/25 transition-colors duration-200"
                        >
                          {tool}
              </span>
                      ))}
                    </div>
                  </div>

        {/* Divider */}
        <div className="relative pt-2">
          <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  </div>

        {/* Tagline */}
        <p className="text-xs font-mono text-gray-400 font-light">{card.tagline}</p>
                        </div>
                      </div>
  );
};

// TabButton component with enhanced active state visuals
const TabButton: React.FC<{
  label: string;
  icon: string;
  active: boolean;
  accent: string;
  onClick: () => void;
  prefersReducedMotion: boolean;
}> = ({ label, icon, active, accent, onClick, prefersReducedMotion }) => {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={[
        "relative rounded-full px-4 md:px-5 py-2.5 md:py-3 text-sm md:text-base font-medium",
        "border border-white/12 bg-white/6 backdrop-blur",
        "transition-all duration-200",
        !prefersReducedMotion ? "hover:-translate-y-[1px] hover:shadow-[0_8px_20px_rgba(0,0,0,0.35)]" : "",
        !prefersReducedMotion ? "active:translate-y-[1px] active:scale-[0.99]" : "",
        "active:shadow-[inset_0_3px_10px_rgba(0,0,0,0.35)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50",
        active ? "text-white shadow-lg" : "text-gray-300 hover:text-white hover:bg-white/8"
      ].join(" ")}
      style={active ? { 
        boxShadow: `0 0 0 2px ${accent} inset`,
        backgroundColor: `${accent}20`,
        border: `1px solid ${accent}40`
      } : undefined}
    >
      {/* Active tab backdrop spotlight */}
      {active && (
        <div 
          className="absolute inset-0 rounded-full opacity-20 pointer-events-none"
          style={{
            background: `radial-gradient(circle at center, ${accent}40 0%, transparent 70%)`,
            filter: 'blur(8px)'
          }}
        />
      )}
      
      {/* Active tab conic gradient inner ring */}
      {active && (
        <div 
          className="absolute inset-0 rounded-full opacity-0 animate-pulse pointer-events-none"
          style={{
            background: `conic-gradient(from 0deg, ${accent}40, ${accent}20, ${accent}40)`,
            filter: 'blur(1px)',
            transform: 'scale(1.1)'
          }}
        />
      )}
      
      <span className="mr-1 text-base">{icon}</span>
      <span>{label}</span>
                    </button>
  );
};

export default function Toolkit() {
  const [activeCategory, setActiveCategory] = useState('ai');
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const activeCategoryData = TOOLKIT[activeCategory];
  const activeAccent = getAccentColor(activeCategory);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return (
    <section className="py-16 md:py-24 bg-black relative overflow-hidden">
      {/* Background Layers */}
      {/* Radial spotlight behind header + grid */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          background: `radial-gradient(circle at center, ${activeAccent}10 0%, transparent 70%)`,
          transform: 'scale(1.2)'
        }}
      />
      
      {/* Grain overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-5"
        style={{
          backgroundImage: `url("${grainTexture}")`,
          backgroundSize: '200px 200px'
        }}
      />

      <div className="container mx-auto w-full px-6 md:px-8 lg:px-12 relative z-10" style={{ maxWidth: "min(92vw, 1760px)" }}>
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-6xl font-mono text-white font-light tracking-tight mb-4 md:mb-6">
            My{" "}
            <span className="text-blue-400">Toolkit</span>
          </h2>
          <p className="text-lg md:text-xl font-mono text-gray-400 font-light max-w-3xl mx-auto leading-relaxed px-4">
            A curated set of tools, methodologies, and technologies I use across AI, product management, design, data, and engineering—shown as skills in action.
          </p>
                  </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((category) => {
            const isActive = activeCategory === category.key;
            const accentColor = getAccentColor(category.key);
            
            return (
              <TabButton
                key={category.key}
                label={category.label}
                icon={category.emoji}
                active={isActive}
                accent={accentColor}
                onClick={() => setActiveCategory(category.key)}
                prefersReducedMotion={prefersReducedMotion}
              />
            );
          })}
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12">
          {activeCategoryData.cards.map((card, index) => (
            <ToolkitCard
              key={index}
              card={card}
              category={activeCategory}
              accent={activeAccent}
            />
          ))}
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </section>
  );
}