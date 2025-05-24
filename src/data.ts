export interface Collaborative {
  name: string;
  description: string;
  skills: { id: number; value: string }[];
  experience: { id: number; value: string }[];
  websiteUrl: string;
  city: string;
  state: string;
  revenueShare: number;
  indirectCosts: number;
  collabLeaderCompensation: number;
  payoutFrequency: PayoutFrequency;
  stakingTiers: StakingTier[];
  logoUrl: string;
}

export interface CollaborativeData {
  id: number;
  name: string;
  description: string;
  websiteUrl: string;
  logoUrl: string;
  city: string;
  state: string;
  leaderEmail: string;
  leaderName: string;
  createdAt: string;
  revenueShare: number;
  indirectCosts: number;
  collabLeaderCompensation: number;
  payoutFrequency: PayoutFrequency;
  skills: string[];
  experience: string[];
}

export interface CollaborativeDataWithMembers {
  id: number;
  name: string;
  logoUrl: string;
  members: CollabMember[];
}

export interface CollaborativeDataTreasury {
  id: number;
  name: string;
  logoUrl: string;
  revenueShare: number;
  payoutFrequency: PayoutFrequency;
  stakingTiers: StakingTier[];
}

export interface CollabMember {
  id: string;
  firstName: string;
  lastName: string
  userName: string;
  avatarUrl: string;
  role: string;
  inviteStatus: string;
}

export const collabRoles = ['Collaborative Leader','Collaborative Member']

export const inviteStatusColors: { [key: string]: string } = {
  Invited: 'yellow',
  Accepted: 'green',
  Declined: 'red',
};

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
  invite_status: string;
  linkedin: string;
  skills: { id: number; value: string }[];
  experience: { id: number; value: string }[];
};

export const users: User[] = [
  {
    id: 1,
    name: 'Gerry Hartis',
    email: 'gerry@aligned.works',
    description: 'The AlignedWorks’ vision for aligning the full value of people with full value solutions to social, economic and environmental problems originated with co-founder Gerry Hartis when he worked with outdoor adventure teams in the 1980s as an educator. Gerry asked each member of the team to affirm that they would give the full value of their commitment, knowledge, skills, and effort to the other members of the team as they jointly negotiated the rigors of the deep wilderness.',
    phone_number: '123-456-7890',
    avatar_url: '/assets/profile-pic-Gerry-Hartis.jpeg',
    location: 'Somewhere, PA soon to be SC',
    member_since: '01-01-2023',
    invite_status: 'Invited',
    linkedin: 'https://www.linkedin.com/in/gerryhartis',
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
    member_since: '01/01/2023',
    invite_status: 'Accepted',
    linkedin: 'https://www.linkedin.com/in/alignedworks',
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
    member_since: '01/01/2023',
    invite_status: 'Accepted',
    linkedin: 'https://www.linkedin.com/in/davidtvader',
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
    member_since: '01/01/2023',
    invite_status: 'Invited',
    linkedin: 'https://www.linkedin.com/in/leifuptegrove',
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
    member_since: '01/01/2023',
    invite_status: 'Declined',
    linkedin: 'https://www.linkedin.com/in/petersahajian',
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
    member_since: '01/01/2023',
    invite_status: 'Invited',
    linkedin: 'https://www.linkedin.com/in/benhuangbmj',
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
    member_since: '01/01/2023',
    invite_status: 'Declined',
    linkedin: 'https://www.linkedin.com/in/jordonbyers',
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
    name: 'Breadcoin PA Capital region',
    description: 'Breadcoin destigmatizes hunger and bridges divides. The same coin used in Harrisburg is the same coin used in Mechanicsburg. Breadcoin makes sure everyone is included at the table. We are proud to partner with many local organizations and churches throughout central Pennsylvania.',
    websiteUrl: 'https://breadcoin.org/locations/pa/',
    logoUrl: '/assets/logos/ByteSecure.png',
    city: "Harrisburg",
    state: "PA",
    leaderEmail: 'david@aligned.works',
    leaderName: 'David Vader',
    createdAt: 'February 1, 2022',
    revenueShare: 5,
    indirectCosts: 5,
    collabLeaderCompensation: 5,
    payoutFrequency: PayoutFrequency.Monthly,
    skills: ['Software Development', 'Open Source', 'DevOps'],
    experience: ['Technology'],
  },
  {
    id: 2,
    name: '717 Tacos',
    description: 'We believe that a balanced diet, is a taco in each hand.',
    websiteUrl: 'https://717tacos.com/',
    logoUrl: '/assets/logos/717.png',
    city: "Harrisburg",
    state: "PA",
    leaderEmail: 'alex@codeforge.com',
    leaderName: 'Abdul Moosa',
    createdAt: '06-12-2023',
    revenueShare: 5,
    indirectCosts: 5,
    collabLeaderCompensation: 5,
    payoutFrequency: PayoutFrequency.Monthly,
    skills: ['Software Development', 'Open Source', 'DevOps'],
    experience: ['Technology'],
  },
  {
    id: 3,
    name: 'SCC Tattoos',
    description: 'Established by award-winning artist Dre Ceja, SCC TATTOOS has quickly become a popular destination for custom tattooing in Downtown Harrisburg. The private studio provides a friendly, professional, and hygienic setting for both newcomers and experienced tattoo enthusiasts.',
    websiteUrl: 'https://scctattoos.com/',
    logoUrl: '/assets/logos/SCC.png',
    city: "Harrisburg",
    state: "PA",
    leaderEmail: 'alex@codeforge.com',
    leaderName: 'Dre',
    createdAt: '06-12-2023',
    revenueShare: 5,
    indirectCosts: 5,
    collabLeaderCompensation: 5,
    payoutFrequency: PayoutFrequency.Monthly,
    skills: ['Software Development', 'Open Source', 'DevOps'],
    experience: ['Technology'],
  },
  {
    id: 11,
    name: 'CodeForge Collective',
    description: 'A developer-focused collaborative building open-source tools and frameworks.',
    websiteUrl: '',
    logoUrl: '/assets/EmptyLogo.png',
    city: "Los Angeles",
    state: "CA",
    leaderEmail: 'alex@codeforge.com',
    leaderName: 'Alex BobbyFay',
    createdAt: '06-12-2023',
    revenueShare: 5,
    indirectCosts: 5,
    collabLeaderCompensation: 5,
    payoutFrequency: PayoutFrequency.Monthly,
    skills: ['Software Development', 'Open Source', 'DevOps'],
    experience: ['Technology'],
  },
  {
    id: 12,
    name: 'GreenFuture Innovators',
    description: 'A sustainability-driven group working on eco-friendly solutions and smart energy.',
    websiteUrl: '',
    logoUrl: '/assets/EmptyLogo.png',
    city: "Austin",
    state: "TX",
    leaderEmail: 'emily@greenfuture.org',
    leaderName: 'Alex BobbyFay',
    revenueShare: 5,
    indirectCosts: 5,
    collabLeaderCompensation: 5,
    payoutFrequency: PayoutFrequency.Monthly,
    createdAt: '09-25-2022',
    skills: ['Renewable Energy', 'Environmental Science', 'IoT'],
    experience: ['Clean Energy'],
  },
  {
    id: 13,
    name: 'HealthSync Alliance',
    description: 'A collaborative focused on building seamless healthcare integration systems.',
    websiteUrl: '',
    logoUrl: '/assets/EmptyLogo.png',
    city: "Denver",
    state: "CO",
    leaderEmail: 'james@healthsync.com',
    leaderName: 'Alex BobbyFay',
    revenueShare: 5,
    indirectCosts: 5,
    collabLeaderCompensation: 5,
    payoutFrequency: PayoutFrequency.Monthly,
    createdAt: '01-18-2024',
    skills: ['Healthcare IT', 'Data Security', 'AI in Medicine'],
    experience: ['Healthcare'],
  },
  {
    id: 4,
    name: 'NextGen Creators',
    description: 'A creative hub for digital artists, animators, and designers working on innovative media projects.',
    websiteUrl: '',
    logoUrl: '/assets/EmptyLogo.png',
    city: "Miami",
    state: "FL",
    leaderEmail: 'sophia@nextgencreators.com',
    leaderName: 'Alex BobbyFay',
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
    websiteUrl: '',
    logoUrl: '/assets/EmptyLogo.png',
    city: "Seattle",
    state: "WA",
    leaderEmail: 'michael@edtechvision.com',
    leaderName: 'Alex BobbyFay',
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
    websiteUrl: '',
    logoUrl: '/assets/EmptyLogo.png',
    city: "Chicago",
    state: "IL",
    leaderEmail: 'oliver@bytesecure.net',
    leaderName: 'Alex BobbyFay',
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
    websiteUrl: '',
    logoUrl: '/assets/EmptyLogo.png',
    city: "Phoenix",
    state: "AZ",
    leaderEmail: 'jessica@urbanagri.com',
    leaderName: 'Alex BobbyFay',
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
    websiteUrl: '',
    logoUrl: '/assets/EmptyLogo.png',
    city: "Boston",
    state: "MA",
    leaderEmail: 'william@fintechpioneers.com',
    leaderName: 'Alex BobbyFay',
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
    websiteUrl: '',
    logoUrl: '/assets/EmptyLogo.png',
    city: "Atlanta",
    state: "GA",
    leaderEmail: 'david@gamecraftstudios.com',
    leaderName: 'Alex BobbyFay',
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
    websiteUrl: '',
    logoUrl: '/assets/EmptyLogo.png',
    city: "Portland",
    state: "OR",
    leaderEmail: 'sarah@buildtogether.com',
    leaderName: 'Alex BobbyFay',
    revenueShare: 5,
    indirectCosts: 5,
    collabLeaderCompensation: 5,
    payoutFrequency: PayoutFrequency.Quarterly,
    createdAt: '07-15-2021',
    skills: ['Robotics', '3D Printing', 'Hardware Prototyping'],
    experience: ['Engineering & Manufacturing'],
  },
];

export const us_states = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
];