export interface Collaborative {
  name: string;
  description: string;
  skills: { id: number; value: string }[];
  experience: { id: number; value: string }[];
  websiteUrl: string;
  revenueShare: number;
  indirectCosts: number;
  collabLeaderCompensation: number;
  payoutFrequency: PayoutFrequency;
  stakingTiers: StakingTier[];
}

export enum PayoutFrequency {
  Monthly = 'Monthly',
  Quarterly = 'Quarterly',
  Yearly = 'Yearly',
};

export interface StakingTier {
  tier: string;
  exchangeRate: number;
}
export const monthlyStakingTiers = [
  '1 Month',
  '2 Months',
  '1 Quarter',
  '2 Quarters',
  '3 Quarters',
  '1 Year',
  '2 Years',
  '3 Years',
  '4 Years',
  '5 Years',
];

export const quarterlyStakingTiers = [
  '1 Quarter',
  '2 Quarters',
  '3 Quarters',
  '1 Year',
  '2 Years',
  '3 Years',
  '4 Years',
  '5 Years',
  '6 Years',
  '7 Years',
];

export const annualStakingTiers = [
  '1 Year',
  '2 Years',
  '3 Years',
  '4 Years',
  '5 Years',
  '6 Years',
  '7 Years',
  '8 Years',
  '9 Years',
  '10 Years',
];

export interface User {
  id: number;
  name: string;
  email: string;
  description: string;
  phone_number: string;
  avatar_url: string;
  location: string;
  member_since: string;
  linkedin: string;
  skills: { id: number; value: string }[];
  experience: { id: number; value: string }[];
};

export const users: User[] = [
  {
    id: 1,
    name: 'Gary Hartis',
    email: 'gerry@aligned.works',
    description: '',
    phone_number: '123-456-7890',
    avatar_url: '/assets/profile-pic-Gerry-Hartis.jpeg',
    location: 'Somewhere, PA soon to be SC',
    member_since: '01-01-2023',
    linkedin: 'https://www.linkedin.com/in/garyhartis/',
    skills: [{id: 1, value: 'Design & Creative'}],
    experience: [{id: 1, value: 'Education'},{id: 2, value: 'Non-Profit'},{id: 3, value: 'Retail'}],
  },
  {
    id: 2,
    name: 'AlignedWorks',
    email: '',
    description: '',
    phone_number: '123-456-7890',
    avatar_url: 'assets/alignedWorksLogoCompact.png',
    location: 'Mechanicsburg, PA',
    member_since: '01-01-2023',
    linkedin: 'https://www.linkedin.com/in/alignedworks/',
    skills: [{id: 0, value: ''}],
    experience: [{id: 0, value: ''}],
  },
  {
    id: 3,
    name: 'David Vader',
    email: 'david@aligned.works',
    description: '',
    phone_number: '123-456-7890',
    avatar_url: '/assets/David_profile_pic.JPG',
    location: 'Mechanicsburg, PA',
    member_since: '01-01-2023',
    linkedin: 'https://www.linkedin.com/in/davidtvader/',
    skills: [{id: 1, value: 'Design & Creative'},{id: 2, value: 'Development & IT'}],
    experience: [{id: 1, value: 'Education'},{id: 2, value: 'Non-Profit'}],
  },
  {
    id: 4,
    name: 'Leif Uptegrove',
    email: 'focalshine@gmail.com',
    description: '',
    phone_number: '123-456-7890',
    avatar_url: '/assets/Profile-pic-Leif-Uptegrove.jpg',
    location: 'Somewhere, PA',
    member_since: '01-01-2023',
    linkedin: 'https://www.linkedin.com/in/leifuptegrove/',
    skills: [{id: 2, value: 'Development & IT'}],
    experience: [{id: 0, value: ''}],
  },
  {
    id: 5,
    name: 'Peter Sahajian',
    email: 'peter.sahajian@gmail.com',
    description: '',
    phone_number: '123-456-7890',
    avatar_url: 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-10.png',
    location: 'Fairfax, VA',
    member_since: '01-01-2023',
    linkedin: 'https://www.linkedin.com/in/petersahajian/',
    skills: [{id: 2, value: 'Development & IT'},{id: 3, value: 'Engineering & Architecture'}],
    experience: [{id: 4, value: 'Telecoms'}],
  },
  {
    id: 6,
    name: 'Ben Huang',
    email: 'benjaminwong1985@gmail.com',
    description: '',
    phone_number: '123-456-7890',
    avatar_url: 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-2.png',
    location: 'Mechanicsburg, PA',
    member_since: '01-01-2023',
    linkedin: 'https://www.linkedin.com/in/benhuangbmj/',
    skills: [{id: 1, value: 'Design & Creative'},{id: 2, value: 'Development & IT'}],
    experience: [{id: 1, value: 'Education'}],
  },
  {
    id: 7,
    name: 'Jordon Byers',
    email: 'jordonbyers@gmail.com',
    description: '',
    phone_number: '123-456-7890',
    avatar_url: 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-1.png',
    location: 'Mechanicsburg, PA',
    member_since: '01-01-2023',
    linkedin: 'https://www.linkedin.com/in/jordonbyers/',
    skills: [{id: 1, value: 'Design & Creative'},{id: 2, value: 'Development & IT'}],
    experience: [{id: 2, value: 'Non-Profit'}],
  },
  // Add more user data as needed
];

export const skills = [
  {
    "group": "Architecture",
    "items": [
      // "Commercial",
      "Conservation",
      // "Industrial",
      "Interior",
      "Landscape",
      "Residential",
      "Urban"
    ]
  },
  {
    "group": "Finance and Accounting",
    "items": [
      "Accounting",
      "Bookkeeping",
      "Finance",
      "Insurance",
      "Tax"
    ]
  },
  {
    "group": "Fundraising",
    "items": [
      "Development Officer",
      "Grant Writing",
      "Grants Manager"
    ]
  },
  {
    "group": "Construction",
    "items": [
      "Carpentry",
      "Electrician",
      "Heavy Equipment Operator",
      "HVAC",
      "Land Development",
      "Masonry",
      "Paving",
      "Plumbing",
      "Roofer"
    ]
  },
  {
    "group": "Creative",
    "items": [
      "Audio",
      "Animation",
      "Editing",
      "Graphic Design",
      "Illustration",
      "Music",
      "Photography",
      "Presentation Design",
      "Product Design",
      "Videography",
      "Writing"
    ]
  },
  {
    "group": "Data Science",
    "items": [
      "Artificial Intelligence",
      "Data Analytics",
      "Data Mining",
      "Data Visualization",
      "Experimentation and Testing",
      "Math Modeling",
      "Statistical Analysis",
      "Machine Learning"
    ]
  },
  {
    "group": "Engineering",
    "items": [
      "Aerospace",
      "Biomedical",
      "Chemical",
      "Civil",
      "Electrical",
      "Industrial",
      "Manufacturing",
      "Mechanical"
    ]
  },
  {
    "group": "Entertainment",
    "items": [
      "Event Planner",
      "Event Manager",
      "Travel Planning",
      "Tour Guide"
    ]
  },
  {
    "group": "Legal",
    "items": [
      "Contracts",
      "Corporate",
      "Intellectual Property",
      "Litigation",
      "Non-Profit",
      "Family"
    ]
  },
  {
    "group": "Manufacturing",
    "items": [
      "Computer Aided Manufacturing",
      "Machinist",
      "Manufacturing Process Design",
      "Production Worker",
      "Prototyping",
      "Quality Assurance and Control",
      "Supply Chain Management",
      "Tool and Die"
    ]
  },
  {
    "group": "Marketing and Sales",
    "items": [
      "Advertising",
      "Business Development",
      "Brand Design",
      "Customer Support",
      "Email Marketing",
      "Marketing Strategy",
      "Search Engine Optimization",
      "Social Media Marketing",
      "Sales"
    ]
  },
  {
    "group": "Organization",
    "items": [
      "Administration",
      "Administrative Assistant",
      "Organizational Design",
      "Leadership",
      "Management",
      "Strategic Planning"
    ]
  },
  {
    "group": "People",
    "items": [
      "Mediation",
      "Coaching and Mentoring",
      "Counseling",
      "Teaching"
    ]
  },
  {
    "group": "Public Relations",
    "items": [
      "Communications",
      // "Event Manager",
      "Government Relations",
      "Media Relations",
      "Social Media Manager"
    ]
  },
  {
    "group": "Real Estate",
    "items": [
      "Agent",
      "Appraiser",
      "Commercial",
      "Developer",
      "Inspector",
      "Leasing",
      "Property Management",
      // "Residential",
      "Retail",
      "Buyer",
      "Cashier",
      "Display",
      "Inventory Control",
      "Store Manager"
    ]
  },
  {
    "group": "IT and Software",
    "items": [
      "Cyber Security",
      "Full-stack Development",
      "Front-end Development",
      "Process Automation",
      "Network Design and Operation",
      "User Experience (UX) Design",
      "Website Design",
      "Website Management"
    ]
  },
  {
    "group": "Trades (Non-Construction)",
    "items": [
      "Auto Mechanic",
      "Cleaning Services",
      "Landscaping",
      "Painter",
      "Welder"
    ]
  }
];
  
export const experience = [
  "Accommodation Services",
  "Administration and Business Support",
  "Agriculture",
  "Arts, Entertainment, and Recreation",
  "Construction",
  "Economic Development",
  "Educational Services",
  "Engineering Services",
  "Environmental Services",
  "Faith Communities",
  "Finance, Investing, and Banking",
  "Food Services",
  "Government",
  "Healthcare",
  "Housing",
  "Human Services",
  "Information Technology",
  "Insurance",
  "Law Enforcement",
  "Legal Services",
  "Manufacturing",
  "Mining",
  "Public Administration",
  "Philanthropy",
  "Publishing",
  "Real Estate, Rental, and Leasing",
  "Relief and Development",
  "Retail Trade",
  "Scientific and Technical Services",
  "Shipping and Warehousing",
  "Social Services",
  "Telecommunications",
  "Transportation",
  "Utilities",
  "Wholesale Trade",
  "Waste Management"
];