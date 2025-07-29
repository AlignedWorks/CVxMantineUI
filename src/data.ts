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
  // default: 10,000
  launchTokensCreated: number;
  // in weeks, default is 12
  launchCyclePeriod: number;
  // a percentage, default is 10%
  launchTokenReleaseRate: number;
  // this in relation to when the collaborative goes live, so uncertain at time of proposal
  // thus it's either 1) at the same time collab goes live (0) or 1,2,3,etc. weeks after
  launchTokenInitialReleaseWeeks: number;
}

export interface CollabInvite {
  userId: string;
  userRole: string;
  collabId: number;
  collabName: string;
  collabLogoUrl: string;
  inviteStatus: string;
}

export interface CollabApprovalRequest {
  userId: string;
  collabId: number;
  collabName: string;
  collabLogoUrl: string;
  currentCSA: string;
  currentCSAUrl: string;
}

export interface CollabsNeedingApproval {
  id: number,
  name: string,
  description: string,
  websiteUrl: string,
  revenueShare: number,
  indirectCosts: number,
  payoutFrequency: string,
  adminCompensation: number,
  admin: string;
  createdAt: string,
  stakingTiers: { tier: string, exchangeRate: number }[],
}

export interface CollaborativeData {
  id: number;
  name: string;
  description: string;
  approvalStatus: string;
  websiteUrl: string;
  logoUrl: string;
  csaDocUrl?: string;
  city: string;
  state: string;
  adminEmail: string;
  adminName: string;
  createdAt: string;
  revenueShare: number;
  indirectCosts: number;
  collabLeaderCompensation: number;
  payoutFrequency: PayoutFrequency;
  userIsCollabAdmin: boolean;
  skills: { id: number; value: string }[];
  experience: { id: number; value: string }[];
  
}

export interface CollabDataCompact {
  id: number;
  name: string;
  logoUrl: string;
  description: string;
  status: string;
}

export interface CollaborativeDataWithMembers {
  id: number;
  name: string;
  logoUrl: string;
  userIsCollabAdmin: boolean;
  members: CollabMember[];
}

export interface CollaborativeDataTreasury {
  id: number;
  name: string;
  logoUrl: string;
  revenueShare: number;
  payoutFrequency: PayoutFrequency;
  stakingTiers: StakingTier[];
  indirectCosts: number;
  collabLeaderCompensation: number;
  userIsCollabAdmin: boolean;
  nextTokenReleaseDate: string;
  currentTokenRelease: number;
  nextTokenRelease: number;
  tokensReceivable: number;
  tokenBalance: number;
  tokensCollabAdmin: number;
  tokenLiabilities: number;
}

export interface CollabMember {
  id: string;
  firstName: string;
  lastName: string
  userName: string;
  avatarUrl: string;
  role: string;
  inviteStatus: string;
  isActive: boolean;
}

export interface Project {
  id: number;
  collabId: number;
  name: string;
  description: string;
  approvalStatus: string;
  launchTokenBudget: number;
  createdAt: string;
  projectAdminName: string;
  projectAdminEmail: string;
  projectAdminCompensation: number;
}

export interface ProjectDataHome {
  collabId: number;
  collabName: string;
  collabLogoUrl: string;
  name: string;
  description: string;
  approvalStatus: string;
  launchTokenBudget: number;
  createdAt: string;
  projectAdminName: string;
  projectAdminEmail: string;
  projectAdminCompensation: number;
}

export interface ProjectDataWithMembers {
  collabName: string;
  collabLogoUrl: string;
  id: number;
  name: string;
  userIsProjectAdminAndStatusAccepted: boolean;
  members: ProjectMember[];
}

export interface ProjectDataWithMilestones {
  collabName: string;
  collabLogoUrl: string;
  id: number;
  name: string;
  launchTokenBudget: number;
  launchTokenBalance: number;
  userIsProjectAdminAndStatusAccepted: boolean;
  milestones: Milestone[];
}

export interface ProjectMember {
  id: string;
  firstName: string;
  lastName: string
  userName: string;
  avatarUrl: string;
  role: string;
  inviteStatus: string;
  isActive: boolean;
}

export interface Milestone {
  id: number;
  name: string;
  description: string;
  assigneeId: string;
  assigneeName: string;
  inviteStatus: string;
  approvalStatus: string;
  launchTokenValue: number;
  dueDate: string;
  createdAt: string;
  completedAt?: string;
}

export interface ProjectInvite {
  userId: string;
  userRole: string;
  projectId: number;
  projectName: string;
  collabId: number;
  collabLogoUrl: string;
  inviteStatus: string;
}

export const collabRoles = ['Collaborative Admin','Collaborative Member']

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
    approvalStatus: 'Active',
    websiteUrl: 'https://breadcoin.org/locations/pa/',
    logoUrl: '/assets/logos/ByteSecure.png',
    city: "Harrisburg",
    state: "PA",
    adminEmail: 'david@aligned.works',
    adminName: 'David Vader',
    createdAt: 'February 1, 2022',
    revenueShare: 5,
    indirectCosts: 5,
    collabLeaderCompensation: 5,
    payoutFrequency: PayoutFrequency.Monthly,
    userIsCollabAdmin: false,
    skills: [
      { id: 101, value: 'Software Development' },
      { id: 102, value: 'Open Source' },
      { id: 103, value: 'DevOps' }
    ],
    experience: [
      { id: 201, value: 'Technology' }
    ],
  },
  {
    id: 2,
    name: '717 Tacos',
    description: 'We believe that a balanced diet, is a taco in each hand.',
    approvalStatus: 'Active',
    websiteUrl: 'https://717tacos.com/',
    logoUrl: '/assets/logos/717.png',
    city: "Harrisburg",
    state: "PA",
    adminEmail: 'alex@codeforge.com',
    adminName: 'Abdul Moosa',
    createdAt: '06-12-2023',
    revenueShare: 5,
    indirectCosts: 5,
    collabLeaderCompensation: 5,
    payoutFrequency: PayoutFrequency.Monthly,
    userIsCollabAdmin: false,
    skills: [
      { id: 104, value: 'Software Development' },
      { id: 105, value: 'Open Source' },
      { id: 106, value: 'DevOps' }
    ],
    experience: [
      { id: 202, value: 'Technology' }
    ],
  },
  {
    id: 3,
    name: 'SCC Tattoos',
    description: 'Established by award-winning artist Dre Ceja, SCC TATTOOS has quickly become a popular destination for custom tattooing in Downtown Harrisburg. The private studio provides a friendly, professional, and hygienic setting for both newcomers and experienced tattoo enthusiasts.',
    approvalStatus: 'Active',
    websiteUrl: 'https://scctattoos.com/',
    logoUrl: '/assets/logos/SCC.png',
    city: "Harrisburg",
    state: "PA",
    adminEmail: 'alex@codeforge.com',
    adminName: 'Dre',
    createdAt: '06-12-2023',
    revenueShare: 5,
    indirectCosts: 5,
    collabLeaderCompensation: 5,
    payoutFrequency: PayoutFrequency.Monthly,
    userIsCollabAdmin: false,
    skills: [
      { id: 107, value: 'Software Development' },
      { id: 108, value: 'Open Source' },
      { id: 109, value: 'DevOps' }
    ],
    experience: [
      { id: 203, value: 'Technology' }
    ],
  },
  {
    id: 11,
    name: 'CodeForge Collective',
    description: 'A developer-focused collaborative building open-source tools and frameworks.',
    approvalStatus: 'Draft',
    websiteUrl: '',
    logoUrl: '/assets/EmptyLogo.png',
    city: "Los Angeles",
    state: "CA",
    adminEmail: 'alex@codeforge.com',
    adminName: 'Alex BobbyFay',
    createdAt: '06-12-2023',
    revenueShare: 5,
    indirectCosts: 5,
    collabLeaderCompensation: 5,
    payoutFrequency: PayoutFrequency.Monthly,
    userIsCollabAdmin: false,
    skills: [
      { id: 110, value: 'Software Development' },
      { id: 111, value: 'Open Source' },
      { id: 112, value: 'DevOps' }
    ],
    experience: [
      { id: 204, value: 'Technology' }
    ],
  },
  {
    id: 12,
    name: 'GreenFuture Innovators',
    description: 'A sustainability-driven group working on eco-friendly solutions and smart energy.',
    approvalStatus: 'Draft',
    websiteUrl: '',
    logoUrl: '/assets/EmptyLogo.png',
    city: "Austin",
    state: "TX",
    adminEmail: 'emily@greenfuture.org',
    adminName: 'Alex BobbyFay',
    createdAt: '09-25-2022',
    revenueShare: 5,
    indirectCosts: 5,
    collabLeaderCompensation: 5,
    payoutFrequency: PayoutFrequency.Monthly,
    userIsCollabAdmin: false,
    skills: [
      { id: 113, value: 'Renewable Energy' },
      { id: 114, value: 'Environmental Science' },
      { id: 115, value: 'IoT' }
    ],
    experience: [
      { id: 205, value: 'Clean Energy' }
    ],
  },
  {
    id: 13,
    name: 'HealthSync Alliance',
    description: 'A collaborative focused on building seamless healthcare integration systems.',
    approvalStatus: 'Draft',
    websiteUrl: '',
    logoUrl: '/assets/EmptyLogo.png',
    city: "Denver",
    state: "CO",
    adminEmail: 'james@healthsync.com',
    adminName: 'Alex BobbyFay',
    createdAt: '01-18-2024',
    revenueShare: 5,
    indirectCosts: 5,
    collabLeaderCompensation: 5,
    payoutFrequency: PayoutFrequency.Monthly,
    userIsCollabAdmin: false,
    skills: [
      { id: 116, value: 'Healthcare IT' },
      { id: 117, value: 'Data Security' },
      { id: 118, value: 'AI in Medicine' }
    ],
    experience: [
      { id: 206, value: 'Healthcare' }
    ],
  },
  {
    id: 4,
    name: 'NextGen Creators',
    description: 'A creative hub for digital artists, animators, and designers working on innovative media projects.',
    approvalStatus: 'Draft',
    websiteUrl: '',
    logoUrl: '/assets/EmptyLogo.png',
    city: "Miami",
    state: "FL",
    adminEmail: 'sophia@nextgencreators.com',
    adminName: 'Alex BobbyFay',
    createdAt: '03-14-2023',
    revenueShare: 5,
    indirectCosts: 5,
    collabLeaderCompensation: 5,
    payoutFrequency: PayoutFrequency.Monthly,
    userIsCollabAdmin: false,
    skills: [
      { id: 119, value: 'Graphic Design' },
      { id: 120, value: 'Animation' },
      { id: 121, value: 'Digital Art' }
    ],
    experience: [
      { id: 207, value: 'Creative Arts' }
    ],
  },
  {
    id: 5,
    name: 'EdTech Visionaries',
    description: 'A team dedicated to enhancing education through technology and AI-driven learning solutions.',
    approvalStatus: 'Active',
    websiteUrl: '',
    logoUrl: '/assets/EmptyLogo.png',
    city: "Seattle",
    state: "WA",
    adminEmail: 'michael@edtechvision.com',
    adminName: 'Alex BobbyFay',
    createdAt: '11-30-2021',
    revenueShare: 5,
    indirectCosts: 5,
    collabLeaderCompensation: 5,
    payoutFrequency: PayoutFrequency.Quarterly,
    userIsCollabAdmin: false,
    skills: [
      { id: 122, value: 'AI in Education' },
      { id: 123, value: 'E-Learning' },
      { id: 124, value: 'Software Development' }
    ],
    experience: [
      { id: 208, value: 'Education Technology' }
    ],
  },
  {
    id: 6,
    name: 'ByteSecure Collective',
    description: 'A cybersecurity-focused group tackling modern threats with cutting-edge defense strategies.',
    approvalStatus: 'Active',
    websiteUrl: '',
    logoUrl: '/assets/EmptyLogo.png',
    city: "Chicago",
    state: "IL",
    adminEmail: 'oliver@bytesecure.net',
    adminName: 'Alex BobbyFay',
    createdAt: '08-05-2023',
    revenueShare: 5,
    indirectCosts: 5,
    collabLeaderCompensation: 5,
    payoutFrequency: PayoutFrequency.Yearly,
    userIsCollabAdmin: false,
    skills: [
      { id: 125, value: 'Cybersecurity' },
      { id: 126, value: 'Ethical Hacking' },
      { id: 127, value: 'Cloud Security' }
    ],
    experience: [
      { id: 209, value: 'Cybersecurity' }
    ],
  },
  {
    id: 7,
    name: 'UrbanAgri Solutions',
    description: 'An urban farming think tank developing high-tech agricultural solutions for cities.',
    approvalStatus: 'Draft',
    websiteUrl: '',
    logoUrl: '/assets/EmptyLogo.png',
    city: "Phoenix",
    state: "AZ",
    adminEmail: 'jessica@urbanagri.com',
    adminName: 'Alex BobbyFay',
    createdAt: '05-10-2022',
    revenueShare: 5,
    indirectCosts: 5,
    collabLeaderCompensation: 5,
    payoutFrequency: PayoutFrequency.Monthly,
    userIsCollabAdmin: false,
    skills: [
      { id: 128, value: 'Vertical Farming' },
      { id: 129, value: 'Hydroponics' },
      { id: 130, value: 'IoT in Agriculture' }
    ],
    experience: [
      { id: 210, value: 'AgTech' }
    ],
  },
  {
    id: 8,
    name: 'FinTech Pioneers',
    description: 'A team of financial innovators building next-gen banking and investment solutions.',
    approvalStatus: 'Draft',
    websiteUrl: '',
    logoUrl: '/assets/EmptyLogo.png',
    city: "Boston",
    state: "MA",
    adminEmail: 'william@fintechpioneers.com',
    adminName: 'Alex BobbyFay',
    createdAt: '12-01-2023',
    revenueShare: 5,
    indirectCosts: 5,
    collabLeaderCompensation: 5,
    payoutFrequency: PayoutFrequency.Quarterly,
    userIsCollabAdmin: false,
    skills: [
      { id: 131, value: 'Blockchain' },
      { id: 132, value: 'FinTech' },
      { id: 133, value: 'Data Analytics' }
    ],
    experience: [
      { id: 211, value: 'Financial Technology' }
    ],
  },
  {
    id: 9,
    name: 'GameCraft Studios',
    description: 'An indie game development collaborative focused on immersive storytelling and gameplay.',
    approvalStatus: 'Draft',
    websiteUrl: '',
    logoUrl: '/assets/EmptyLogo.png',
    city: "Atlanta",
    state: "GA",
    adminEmail: 'david@gamecraftstudios.com',
    adminName: 'Alex BobbyFay',
    createdAt: '02-20-2024',
    revenueShare: 5,
    indirectCosts: 5,
    collabLeaderCompensation: 5,
    payoutFrequency: PayoutFrequency.Yearly,
    userIsCollabAdmin: false,
    skills: [
      { id: 134, value: 'Game Development' },
      { id: 135, value: 'Unreal Engine' },
      { id: 136, value: 'Narrative Design' }
    ],
    experience: [
      { id: 212, value: 'Gaming' }
    ],
  },
  {
    id: 10,
    name: 'BuildTogether Makerspace',
    description: 'A community of engineers, designers, and tinkerers creating hardware and robotics projects.',
    approvalStatus: 'Draft',
    websiteUrl: '',
    logoUrl: '/assets/EmptyLogo.png',
    city: "Portland",
    state: "OR",
    adminEmail: 'sarah@buildtogether.com',
    adminName: 'Alex BobbyFay',
    createdAt: '07-15-2021',
    revenueShare: 5,
    indirectCosts: 5,
    collabLeaderCompensation: 5,
    payoutFrequency: PayoutFrequency.Quarterly,
    userIsCollabAdmin: false,
    skills: [
      { id: 137, value: 'Robotics' },
      { id: 138, value: '3D Printing' },
      { id: 139, value: 'Hardware Prototyping' }
    ],
    experience: [
      { id: 213, value: 'Engineering & Manufacturing' }
    ],
  },
];

export const us_states = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
];