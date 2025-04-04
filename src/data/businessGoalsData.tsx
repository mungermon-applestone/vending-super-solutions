import { 
  TrendingUp,
  ShoppingBag,
  Activity,
  BarChart,
  Truck,
  Users,
  MapPin,
  Calendar,
  BadgePercent,
  ShoppingCart,
  LineChart,
  BarChart2,
  LayoutDashboard,
  Zap,
  Smartphone,
  CreditCard,
  Database,
  Share2,
  RefreshCcw,
  MessageSquare,
  Star
} from 'lucide-react';
import { ReactNode } from 'react';

interface Integration {
  name: string;
  description: string;
  icon: ReactNode;
}

interface CaseStudy {
  title: string;
  description: string;
  image: string;
  slug: string;
  results: string[];
}

interface Feature {
  title: string;
  description: string;
  icon: ReactNode;
}

interface BusinessGoal {
  title: string;
  slug: string;
  description: string;
  heroDescription: string;
  icon: ReactNode;
  heroImage: string;
  features: Feature[];
  caseStudies: CaseStudy[];
  integrations: Integration[];
}

export const businessGoalsData: BusinessGoal[] = [
  {
    title: "Expand Footprint",
    slug: "expand-footprint",
    description: "Grow your business with scalable vending solutions that adapt to various locations and needs.",
    heroDescription: "Strategically expand your vending machine network with our platform's location intelligence, deployment planning tools, and scalable management features.",
    icon: <TrendingUp className="h-8 w-8 text-white" />,
    heroImage: "https://images.unsplash.com/photo-1485628390555-1a7bd503f9fe",
    features: [
      {
        title: "Location Intelligence",
        description: "Use data-driven insights to identify optimal locations for new machines based on foot traffic, demographics, and competitive analysis.",
        icon: <MapPin className="h-6 w-6 text-vending-blue" />
      },
      {
        title: "Multi-Location Management",
        description: "Easily manage hundreds or thousands of machines across multiple locations from a single dashboard.",
        icon: <LayoutDashboard className="h-6 w-6 text-vending-blue" />
      },
      {
        title: "Scalable Infrastructure",
        description: "Our cloud-based platform scales with your business, whether you're managing 10 machines or 10,000.",
        icon: <Database className="h-6 w-6 text-vending-blue" />
      },
      {
        title: "Deployment Planning",
        description: "Plan and execute machine deployments with tools for site surveys, approval workflows, and installation tracking.",
        icon: <Calendar className="h-6 w-6 text-vending-blue" />
      },
      {
        title: "Performance Forecasting",
        description: "Forecast performance of new locations based on historical data from similar sites.",
        icon: <LineChart className="h-6 w-6 text-vending-blue" />
      },
      {
        title: "Remote Monitoring",
        description: "Monitor machine health, inventory levels, and sales performance remotely to ensure optimal operations.",
        icon: <Activity className="h-6 w-6 text-vending-blue" />
      }
    ],
    caseStudies: [
      {
        title: "National Gym Chain Expansion",
        description: "How a fitness company expanded from 50 to 500 locations with centralized vending management.",
        image: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f",
        slug: "gym-chain-expansion",
        results: [
          "Deployed 450 new machines in 18 months",
          "Reduced deployment time by 60%",
          "Achieved 99.8% machine uptime across all locations"
        ]
      },
      {
        title: "University Campus Coverage",
        description: "Strategic placement of smart vending machines across multiple campus buildings.",
        image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f",
        slug: "university-campus-coverage",
        results: [
          "Increased student accessibility to essentials by 78%",
          "Generated 35% higher revenue than traditional campus retail",
          "Reduced operational costs by 22% compared to staffed locations"
        ]
      }
    ],
    integrations: [
      {
        name: "Google Maps Platform",
        description: "Location intelligence and mapping",
        icon: <MapPin className="h-6 w-6 text-vending-blue" />
      },
      {
        name: "Salesforce",
        description: "Customer and location management",
        icon: <Users className="h-6 w-6 text-vending-blue" />
      },
      {
        name: "Tableau",
        description: "Advanced visualization and reporting",
        icon: <BarChart className="h-6 w-6 text-vending-blue" />
      },
      {
        name: "ServiceNow",
        description: "Deployment and installation workflows",
        icon: <Zap className="h-6 w-6 text-vending-blue" />
      }
    ]
  },
  {
    title: "Buy Online, Pickup In Store (BOPIS)",
    slug: "bopis",
    description: "Enable customers to order ahead and collect purchases from your vending machines.",
    heroDescription: "Transform your vending machines into 24/7 pickup points with our seamless online ordering and secure pickup system that integrates with your existing e-commerce platform.",
    icon: <ShoppingBag className="h-8 w-8 text-white" />,
    heroImage: "https://images.unsplash.com/photo-1612630741022-b29ec14d5def",
    features: [
      {
        title: "E-commerce Integration",
        description: "Seamlessly connect your online store with physical vending locations for unified inventory and ordering.",
        icon: <ShoppingCart className="h-6 w-6 text-vending-blue" />
      },
      {
        title: "Mobile App Support",
        description: "Native mobile app integration allows customers to browse, order, and unlock machines for pickup.",
        icon: <Smartphone className="h-6 w-6 text-vending-blue" />
      },
      {
        title: "Secure Pickup Authentication",
        description: "QR codes, PIN numbers, or NFC validation ensure only authorized customers can access their orders.",
        icon: <CreditCard className="h-6 w-6 text-vending-blue" />
      },
      {
        title: "Real-time Availability",
        description: "Show customers exactly which products and pickup locations are available in real-time.",
        icon: <RefreshCcw className="h-6 w-6 text-vending-blue" />
      },
      {
        title: "Order Management System",
        description: "Track orders from placement through fulfillment with automated status updates.",
        icon: <LayoutDashboard className="h-6 w-6 text-vending-blue" />
      },
      {
        title: "Customer Communications",
        description: "Automated notifications keep customers informed about their order status and pickup instructions.",
        icon: <MessageSquare className="h-6 w-6 text-vending-blue" />
      }
    ],
    caseStudies: [
      {
        title: "Urban Grocery Chain",
        description: "How a grocery retailer increased sales by 32% with 24/7 pickup lockers.",
        image: "https://images.unsplash.com/photo-1506617564039-2f3b650b7010",
        slug: "urban-grocery-chain",
        results: [
          "32% increase in off-hours sales",
          "45% of customers became repeat BOPIS users",
          "Reduced in-store wait times by 67%"
        ]
      },
      {
        title: "Campus Bookstore Revolution",
        description: "University bookstore streamlined textbook distribution with smart lockers.",
        image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f",
        slug: "campus-bookstore-revolution",
        results: [
          "Eliminated 95% of start-of-term lines",
          "Increased student satisfaction scores by 4.2 points",
          "Reduced staffing requirements by 30% during peak periods"
        ]
      }
    ],
    integrations: [
      {
        name: "Shopify",
        description: "E-commerce platform integration",
        icon: <ShoppingCart className="h-6 w-6 text-vending-blue" />
      },
      {
        name: "Square",
        description: "Payment processing",
        icon: <CreditCard className="h-6 w-6 text-vending-blue" />
      },
      {
        name: "Twilio",
        description: "Customer notifications",
        icon: <MessageSquare className="h-6 w-6 text-vending-blue" />
      },
      {
        name: "Adobe Commerce",
        description: "Enterprise e-commerce",
        icon: <ShoppingBag className="h-6 w-6 text-vending-blue" />
      }
    ]
  },
  {
    title: "Marketing & Promotions",
    slug: "marketing",
    description: "Drive sales with targeted promotions, digital advertising, and customer loyalty programs.",
    heroDescription: "Transform your vending machines into powerful marketing channels with digital displays, personalized promotions, and loyalty programs that increase engagement and sales.",
    icon: <Activity className="h-8 w-8 text-white" />,
    heroImage: "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f",
    features: [
      {
        title: "Digital Signage",
        description: "Turn machine screens into dynamic advertising displays with scheduled content and eye-catching promotions.",
        icon: <LayoutDashboard className="h-6 w-6 text-vending-blue" />
      },
      {
        title: "Loyalty Programs",
        description: "Create and manage customer loyalty initiatives with points, rewards, and personalized offers.",
        icon: <Star className="h-6 w-6 text-vending-blue" />
      },
      {
        title: "Dynamic Pricing",
        description: "Implement time-based discounts, bundle deals, and flash sales to boost conversion rates.",
        icon: <BadgePercent className="h-6 w-6 text-vending-blue" />
      },
      {
        title: "Campaign Management",
        description: "Plan, execute, and measure marketing campaigns across your entire machine network.",
        icon: <Calendar className="h-6 w-6 text-vending-blue" />
      },
      {
        title: "Customer Analytics",
        description: "Gain insights into customer behavior, preferences, and purchase patterns to refine your marketing strategy.",
        icon: <BarChart2 className="h-6 w-6 text-vending-blue" />
      },
      {
        title: "Social Media Integration",
        description: "Enable social sharing and engagement directly from your vending machines to amplify your reach.",
        icon: <Share2 className="h-6 w-6 text-vending-blue" />
      }
    ],
    caseStudies: [
      {
        title: "Beverage Brand Seasonal Campaign",
        description: "How a major beverage company increased summer sales by 47% with interactive promotions.",
        image: "https://images.unsplash.com/photo-1527960471264-932f39eb5846",
        slug: "beverage-brand-seasonal-campaign",
        results: [
          "47% increase in summer sales",
          "12,000+ social media interactions",
          "28% redemption rate on mobile coupons"
        ]
      },
      {
        title: "Airport Retail Transformation",
        description: "Duty-free retailer's success with digital promotions to travelers.",
        image: "https://images.unsplash.com/photo-1530521954074-e64f6810b32d",
        slug: "airport-retail-transformation",
        results: [
          "52% increase in average transaction value",
          "2.6x higher conversion rate than traditional displays",
          "Built 45,000 loyalty program members in 6 months"
        ]
      }
    ],
    integrations: [
      {
        name: "Mailchimp",
        description: "Email marketing campaigns",
        icon: <MessageSquare className="h-6 w-6 text-vending-blue" />
      },
      {
        name: "HubSpot",
        description: "Marketing automation",
        icon: <Activity className="h-6 w-6 text-vending-blue" />
      },
      {
        name: "Facebook Ads",
        description: "Social media advertising",
        icon: <Share2 className="h-6 w-6 text-vending-blue" />
      },
      {
        name: "Adobe Analytics",
        description: "Customer insights platform",
        icon: <BarChart className="h-6 w-6 text-vending-blue" />
      }
    ]
  },
  {
    title: "Data & Analytics",
    slug: "data",
    description: "Leverage powerful insights to optimize your inventory, pricing, and machine placement.",
    heroDescription: "Make data-driven decisions with our comprehensive analytics platform that provides real-time insights into sales patterns, inventory optimization, and consumer behavior.",
    icon: <BarChart className="h-8 w-8 text-white" />,
    heroImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71",
    features: [
      {
        title: "Real-time Dashboards",
        description: "Monitor key performance indicators and business metrics in real-time across your entire network.",
        icon: <LayoutDashboard className="h-6 w-6 text-vending-blue" />
      },
      {
        title: "Sales Analytics",
        description: "Track sales performance by product, location, time period, and customer segments.",
        icon: <TrendingUp className="h-6 w-6 text-vending-blue" />
      },
      {
        title: "Inventory Optimization",
        description: "Use predictive analytics to optimize stock levels and reduce waste based on historical patterns.",
        icon: <ShoppingBag className="h-6 w-6 text-vending-blue" />
      },
      {
        title: "Custom Reports",
        description: "Create custom reports and automated data exports for deeper analysis and business planning.",
        icon: <BarChart2 className="h-6 w-6 text-vending-blue" />
      },
      {
        title: "Machine Health Monitoring",
        description: "Track machine performance, maintenance needs, and operational efficiency.",
        icon: <Activity className="h-6 w-6 text-vending-blue" />
      },
      {
        title: "Consumer Behavior Analysis",
        description: "Understand purchase patterns, product preferences, and consumer engagement across locations.",
        icon: <Users className="h-6 w-6 text-vending-blue" />
      }
    ],
    caseStudies: [
      {
        title: "Healthcare Facility Optimization",
        description: "How a hospital network used data to optimize product selection and machine placement.",
        image: "https://images.unsplash.com/photo-1504439468489-c8920d796a29",
        slug: "healthcare-facility-optimization",
        results: [
          "38% increase in machine utilization",
          "Reduced restocking trips by 42%",
          "Identified $145,000 in annual cost savings"
        ]
      },
      {
        title: "Retail Chain Data Revolution",
        description: "Major retailer's journey to data-driven decision making for their vending operations.",
        image: "https://images.unsplash.com/photo-1542744095-fcf48d80b0fd",
        slug: "retail-chain-data-revolution",
        results: [
          "Increased product margins by 18%",
          "Optimized product mix leading to 27% sales growth",
          "Reduced stockouts by 82% across all locations"
        ]
      }
    ],
    integrations: [
      {
        name: "Tableau",
        description: "Data visualization",
        icon: <BarChart className="h-6 w-6 text-vending-blue" />
      },
      {
        name: "Power BI",
        description: "Business intelligence",
        icon: <BarChart2 className="h-6 w-6 text-vending-blue" />
      },
      {
        name: "Google Analytics",
        description: "Web and app analytics",
        icon: <LineChart className="h-6 w-6 text-vending-blue" />
      },
      {
        name: "Snowflake",
        description: "Cloud data warehouse",
        icon: <Database className="h-6 w-6 text-vending-blue" />
      }
    ]
  },
  {
    title: "Fleet Management",
    slug: "fleet-management",
    description: "Efficiently manage your entire network of machines with centralized controls and monitoring.",
    heroDescription: "Streamline operations with our comprehensive fleet management system that provides real-time monitoring, predictive maintenance, and efficient route planning.",
    icon: <Truck className="h-8 w-8 text-white" />,
    heroImage: "https://images.unsplash.com/photo-1553413077-190dd305871c",
    features: [
      {
        title: "Machine Monitoring",
        description: "Track the status and performance of all machines in real-time, with instant alerts for issues.",
        icon: <Activity className="h-6 w-6 text-vending-blue" />
      },
      {
        title: "Predictive Maintenance",
        description: "Use AI-powered diagnostics to predict and prevent machine failures before they happen.",
        icon: <Zap className="h-6 w-6 text-vending-blue" />
      },
      {
        title: "Route Optimization",
        description: "Plan the most efficient routes for restocking and maintenance visits to minimize travel time and costs.",
        icon: <MapPin className="h-6 w-6 text-vending-blue" />
      },
      {
        title: "Inventory Tracking",
        description: "Real-time inventory levels across your entire fleet with automated restock alerts.",
        icon: <ShoppingBag className="h-6 w-6 text-vending-blue" />
      },
      {
        title: "Field Service Management",
        description: "Dispatch and track field service technicians with digital work orders and completion verification.",
        icon: <Users className="h-6 w-6 text-vending-blue" />
      },
      {
        title: "Performance Benchmarking",
        description: "Compare performance metrics across machines, locations, and routes to identify best practices.",
        icon: <BarChart className="h-6 w-6 text-vending-blue" />
      }
    ],
    caseStudies: [
      {
        title: "National Vending Operator",
        description: "How a vending operator with 2,500 machines reduced operational costs by 34%.",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71",
        slug: "national-vending-operator",
        results: [
          "34% reduction in operational costs",
          "28% fewer miles driven by service teams",
          "Increased machine uptime from 92% to 99.5%"
        ]
      },
      {
        title: "Smart Campus Initiative",
        description: "University's journey to efficient management of diverse vending services across campus.",
        image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1",
        slug: "smart-campus-initiative",
        results: [
          "Reduced maintenance response time by 76%",
          "Decreased product wastage by 37%",
          "Streamlined operations from 5 staff to 2"
        ]
      }
    ],
    integrations: [
      {
        name: "ServiceNow",
        description: "Service management platform",
        icon: <Zap className="h-6 w-6 text-vending-blue" />
      },
      {
        name: "Fleetio",
        description: "Fleet management software",
        icon: <Truck className="h-6 w-6 text-vending-blue" />
      },
      {
        name: "Samsara",
        description: "IoT solutions for fleets",
        icon: <Activity className="h-6 w-6 text-vending-blue" />
      },
      {
        name: "Salesforce Field Service",
        description: "Field service management",
        icon: <Users className="h-6 w-6 text-vending-blue" />
      }
    ]
  },
  {
    title: "Customer Satisfaction",
    slug: "customer-satisfaction",
    description: "Enhance user experience with intuitive interfaces, reliable service, and modern payment options.",
    heroDescription: "Create exceptional vending experiences that keep customers coming back with intuitive interfaces, diverse payment options, and personalized interactions.",
    icon: <Users className="h-8 w-8 text-white" />,
    heroImage: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d",
    features: [
      {
        title: "Intuitive User Interface",
        description: "Simple, attractive touchscreen interfaces that make purchasing quick and enjoyable.",
        icon: <Smartphone className="h-6 w-6 text-vending-blue" />
      },
      {
        title: "Multiple Payment Options",
        description: "Support for cards, mobile payments, contactless, and even cryptocurrency for maximum convenience.",
        icon: <CreditCard className="h-6 w-6 text-vending-blue" />
      },
      {
        title: "Personalization",
        description: "Remember user preferences and purchase history to provide tailored recommendations.",
        icon: <Users className="h-6 w-6 text-vending-blue" />
      },
      {
        title: "Feedback System",
        description: "Built-in customer feedback collection with real-time response capabilities.",
        icon: <MessageSquare className="h-6 w-6 text-vending-blue" />
      },
      {
        title: "Loyalty Rewards",
        description: "Integrated loyalty programs that reward repeat customers and drive engagement.",
        icon: <Star className="h-6 w-6 text-vending-blue" />
      },
      {
        title: "Accessibility Features",
        description: "ADA-compliant designs and interfaces that make vending accessible to all users.",
        icon: <Users className="h-6 w-6 text-vending-blue" />
      }
    ],
    caseStudies: [
      {
        title: "Hotel Chain Transformation",
        description: "How a hotel group increased guest satisfaction scores with 24/7 smart vending.",
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945",
        slug: "hotel-chain-transformation",
        results: [
          "Guest satisfaction scores increased by 18%",
          "58% of guests made repeat purchases",
          "Positive social media mentions increased 215%"
        ]
      },
      {
        title: "Corporate Office Experience",
        description: "Tech company's journey to creating the perfect employee refreshment experience.",
        image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72",
        slug: "corporate-office-experience",
        results: [
          "98% employee satisfaction rating with vending services",
          "Reduced wait times by 87% during peak hours",
          "35% increase in healthy food selection purchases"
        ]
      }
    ],
    integrations: [
      {
        name: "Stripe",
        description: "Payment processing",
        icon: <CreditCard className="h-6 w-6 text-vending-blue" />
      },
      {
        name: "Zendesk",
        description: "Customer service platform",
        icon: <MessageSquare className="h-6 w-6 text-vending-blue" />
      },
      {
        name: "ApplePay",
        description: "Mobile payment solution",
        icon: <Smartphone className="h-6 w-6 text-vending-blue" />
      },
      {
        name: "Yotpo",
        description: "Reviews and loyalty platform",
        icon: <Star className="h-6 w-6 text-vending-blue" />
      }
    ]
  }
];
