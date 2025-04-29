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

export interface CollaborativeData {
  id: number;
  name: string;
  description: string;
  leaderEmail: string;
  createdAt: string;
  revenueShare: number;
  indirectCosts: number;
  collabLeaderCompensation: number;
  payoutFrequency: PayoutFrequency;
  skills: string[];
  experience: string[];
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
    name: 'Gerry Hartis',
    email: 'gerry@aligned.works',
    description: '',
    phone_number: '123-456-7890',
    avatar_url: '/assets/profile-pic-Gerry-Hartis.jpeg',
    location: 'Somewhere, PA soon to be SC',
    member_since: '01-01-2023',
    linkedin: 'https://www.linkedin.com/in/gerryhartis/',
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

export const mock_collab_data: CollaborativeData[] = [
  {
    id: 1,
    name: 'CodeForge Collective',
    description: 'A developer-focused collaborative building open-source tools and frameworks.',
    leaderEmail: 'alex@codeforge.com',
    createdAt: '06-12-2023',
    revenueShare: 5,
    indirectCosts: 5,
    collabLeaderCompensation: 5,
    payoutFrequency: PayoutFrequency.Monthly,
    skills: ['Software Development', 'Open Source', 'DevOps'],
    experience: ['Technology'],
  },
  {
    id: 2,
    name: 'GreenFuture Innovators',
    description: 'A sustainability-driven group working on eco-friendly solutions and smart energy.',
    leaderEmail: 'emily@greenfuture.org',
    revenueShare: 5,
    indirectCosts: 5,
    collabLeaderCompensation: 5,
    payoutFrequency: PayoutFrequency.Quarterly,
    createdAt: '09-25-2022',
    skills: ['Renewable Energy', 'Environmental Science', 'IoT'],
    experience: ['Clean Energy'],
  },
  {
    id: 3,
    name: 'HealthSync Alliance',
    description: 'A collaborative focused on building seamless healthcare integration systems.',
    leaderEmail: 'james@healthsync.com',
    revenueShare: 5,
    indirectCosts: 5,
    collabLeaderCompensation: 5,
    payoutFrequency: PayoutFrequency.Yearly,
    createdAt: '01-18-2024',
    skills: ['Healthcare IT', 'Data Security', 'AI in Medicine'],
    experience: ['Healthcare'],
  },
  {
    id: 4,
    name: 'NextGen Creators',
    description: 'A creative hub for digital artists, animators, and designers working on innovative media projects.',
    leaderEmail: 'sophia@nextgencreators.com',
    revenueShare: 5,
    indirectCosts: 5,
    collabLeaderCompensation: 5,
    payoutFrequency: PayoutFrequency.Monthly,
    createdAt: '03-14-2023',
    skills: ['Graphic Design', 'Animation', 'Digital Art'],
    experience: ['Creative Arts'],
  },
  {
    id: 5,
    name: 'EdTech Visionaries',
    description: 'A team dedicated to enhancing education through technology and AI-driven learning solutions.',
    leaderEmail: 'michael@edtechvision.com',
    revenueShare: 5,
    indirectCosts: 5,
    collabLeaderCompensation: 5,
    payoutFrequency: PayoutFrequency.Quarterly,
    createdAt: '11-30-2021',
    skills: ['AI in Education', 'E-Learning', 'Software Development'],
    experience: ['Education Technology'],
  },
  {
    id: 6,
    name: 'ByteSecure Collective',
    description: 'A cybersecurity-focused group tackling modern threats with cutting-edge defense strategies.',
    leaderEmail: 'oliver@bytesecure.net',
    revenueShare: 5,
    indirectCosts: 5,
    collabLeaderCompensation: 5,
    payoutFrequency: PayoutFrequency.Yearly,
    createdAt: '08-05-2023',
    skills: ['Cybersecurity', 'Ethical Hacking', 'Cloud Security'],
    experience: ['Cybersecurity'],
  },
  {
    id: 7,
    name: 'UrbanAgri Solutions',
    description: 'An urban farming think tank developing high-tech agricultural solutions for cities.',
    leaderEmail: 'jessica@urbanagri.com',
    revenueShare: 5,
    indirectCosts: 5,
    collabLeaderCompensation: 5,
    payoutFrequency: PayoutFrequency.Monthly,
    createdAt: '05-10-2022',
    skills: ['Vertical Farming', 'Hydroponics', 'IoT in Agriculture'],
    experience: ['AgTech'],
  },
  {
    id: 8,
    name: 'FinTech Pioneers',
    description: 'A team of financial innovators building next-gen banking and investment solutions.',
    leaderEmail: 'william@fintechpioneers.com',
    revenueShare: 5,
    indirectCosts: 5,
    collabLeaderCompensation: 5,
    payoutFrequency: PayoutFrequency.Quarterly,
    createdAt: '12-01-2023',
    skills: ['Blockchain', 'FinTech', 'Data Analytics'],
    experience: ['Financial Technology'],
  },
  {
    id: 9,
    name: 'GameCraft Studios',
    description: 'An indie game development collaborative focused on immersive storytelling and gameplay.',
    leaderEmail: 'david@gamecraftstudios.com',
    revenueShare: 5,
    indirectCosts: 5,
    collabLeaderCompensation: 5,
    payoutFrequency: PayoutFrequency.Yearly,
    createdAt: '02-20-2024',
    skills: ['Game Development', 'Unreal Engine', 'Narrative Design'],
    experience: ['Gaming'],
  },
  {
    id: 10,
    name: 'BuildTogether Makerspace',
    description: 'A community of engineers, designers, and tinkerers creating hardware and robotics projects.',
    leaderEmail: 'sarah@buildtogether.com',
    revenueShare: 5,
    indirectCosts: 5,
    collabLeaderCompensation: 5,
    payoutFrequency: PayoutFrequency.Quarterly,
    createdAt: '07-15-2021',
    skills: ['Robotics', '3D Printing', 'Hardware Prototyping'],
    experience: ['Engineering & Manufacturing'],
  },
];
