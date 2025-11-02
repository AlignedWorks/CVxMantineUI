# Collaborative Value Exchange Platform

A full-stack web application for managing collaborative organizations, project workflows, and token-based compensation systems. Built with React/TypeScript frontend and .NET Core Web API backend.

## 🚀 Live Demo

- **Frontend:** [https://c-vx-mantine-ui-knwx.vercel.app/](https://c-vx-mantine-ui-knwx.vercel.app/)
- **API:** Hosted on Interserver.net

## 📋 Overview

This platform enables organizations to manage collaborative projects with built-in governance workflows, milestone tracking, and token-based budget allocation. Users can create collaboratives, propose projects, assign milestones to team members, and track completion through multi-level approval processes.

### Key Features

#### 🏢 Multi-Tier Organization Structure
- **Network Level:** Global user management and collaborative approvals
- **Collaborative Level:** Independent organizations with their own admins and token treasuries
- **Project Level:** Individual projects with milestone tracking and budget management

#### 👥 Role-Based Access Control
- **Network Admin:** Approve new users and collaborative proposals
- **Collaborative Admin:** Manage members, approve projects, oversee treasury
- **Project Admin:** Create milestones, assign tasks, approve completions
- **Members:** Accept invitations, complete assigned milestones

#### 💰 Token Budget Management
- Real-time balance calculations (never stored, always computed)
- Project admin compensation tracking
- Milestone token allocation with budget constraints
- Automated network transaction fees
- Member wallet tracking with transaction history

#### ✅ Approval Workflows
- User application approval (Network Admin)
- Collaborative proposal approval (Network Admin)
- CSA (Collaborative Services Agreement) signing and approval
- Project proposal approval (Collaborative Admin)
- Milestone completion approval (Project Admin)
- Multi-state lifecycle management (Draft → Active → Submitted → Approved/Declined → Archived)

#### 📄 Document Management
- PDF viewer integration for CSA agreements
- Milestone artifact uploads
- Page-by-page reading tracking for legal documents
- Secure document storage and retrieval

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Mantine UI** component library
- **React Router** for client-side routing
- **Vite** for build tooling
- **Vercel** for deployment

### Backend
- **.NET 8** Web API
- **Entity Framework Core** with SQL Server
- **Interserver.net** traditional hosting
- **Cookie authentication** with HTTP-only cookies

### Infrastructure
- **GitHub Actions** for CI/CD and backend health monitoring
- **SQL Server** database
- **Interserver.net** hosting with custom domain

## 🏗️ Architecture Decisions

### Calculated Fields vs. Stored Values
Token balances and budget allocations are **always calculated on-the-fly** rather than stored in the database. This ensures:
- Single source of truth (no sync issues)
- Data integrity (impossible to have stale balances)
- Simplified business logic (one calculation method)

**Example:**
```typescript
// Backend calculates on each request
launchTokenBalance = project.budget 
  - project.adminPay 
  - project.milestones.sum(m => m.allocatedLaunchTokens)
  - networkTransactionFees
```

### State Machine Pattern for Milestones
Milestones follow a strict state machine to prevent invalid transitions:

```
Draft → Assigned → Submitted → (Approved/Declined) → Archived
                      ↑________________|
                     (Resubmit on decline)
```

### Polling for Real-Time Updates
Dashboard uses 30-second polling to keep data fresh without WebSocket infrastructure:
```typescript
useEffect(() => {
  fetchDashboardData(); // Initial fetch
  const pollInterval = setInterval(fetchDashboardData, 30000);
  return () => clearInterval(pollInterval); // Cleanup on unmount
}, []);
```

## 📁 Project Structure

```
CVxMantineUI/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Header/
│   │   ├── Navbar/
│   │   ├── ProtectedRoute.tsx
│   │   └── ...
│   ├── pages/               # Page components
│   │   ├── Auth/            # Login, registration, password reset
│   │   ├── Collaborative/   # Collaborative management pages
│   │   ├── Project/         # Project and milestone pages
│   │   └── Dashboard.page.tsx
│   ├── AuthContext.tsx      # Authentication state and heartbeat
│   ├── data.ts              # TypeScript interfaces
│   ├── Router.tsx           # Route definitions
│   └── App.tsx              # Root component
├── api/                     # Serverless functions (optional)
├── .github/workflows/       # CI/CD and monitoring
│   └── keepalive.yml        # Backend health check
└── public/                  # Static assets
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- .NET 8 SDK (for backend development)
- Hosting account (for deployment)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/AlignedWorks/CVxMantineUI.git
   cd CVxMantineUI
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_API_BASE=https://your-backend-api.azurewebsites.net/api/
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`

### Backend Setup

The backend API repository is separate. Contact the repository owner for backend setup instructions.

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## 🔐 Authentication Flow

1. User registers with email and personal information
2. Network Admin approves user application (status: Applicant → Network Contributor)
3. User logs in with credentials
4. Backend sets HTTP-only cookie with session token
5. Frontend stores basic user info in localStorage (not sensitive data)
6. Client heartbeat pings backend every 30 minutes to keep session alive
7. Backend validates cookie on every request

## 📊 Business Logic Examples

### Budget Validation
```typescript
// Before creating a milestone, validate against available budget
const project = await fetchProject(projectId);
const totalAllocated = project.milestones.reduce(
  (sum, m) => sum + m.allocatedLaunchTokens, 
  0
);
const remaining = project.budget - project.adminPay - totalAllocated;

if (milestoneTokens > remaining) {
  throw new Error(`Insufficient budget: ${remaining} tokens available`);
}
```

### Approval State Transitions
```typescript
// Only project admin can approve submitted milestones
if (milestone.approvalStatus === 'Submitted' && user.isProjectAdmin) {
  await approveMilestone(milestone.id);
  // Status: Submitted → Archived
  // Assignee receives token payout
}
```

## 🚦 Deployment

### Frontend (Vercel)
1. Connect repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to `master`

### Backend (Interserver.net)
1. Publish .NET API to hosting provider
2. Configure connection string for SQL Server database
3. Set up custom domain and SSL certificate

### Automated Health Checks
GitHub Actions workflow pings backend every hour to keep the server warm:
```yaml
# .github/workflows/keepalive.yml
on:
  schedule:
    - cron: '0 * * * *'  # Every hour
```

## 🎯 Future Enhancements

- [ ] Migrate to Next.js with Server Components and Server Actions
- [ ] Replace polling with WebSocket or Server-Sent Events for real-time updates
- [ ] Add comprehensive unit and integration tests (Jest + React Testing Library)
- [ ] Implement optimistic UI updates for better perceived performance
- [ ] Add email notifications for approval requests and status changes
- [ ] Create analytics dashboard for token flow visualization
- [ ] Implement audit logging for all state changes
- [ ] Add export functionality for transaction history (CSV/PDF)

## 📝 License

- MIT

## 👤 Author

**Jordon Byers**
- GitHub: [@AlignedWorks](https://github.com/AlignedWorks)
- Website: [jordonbyers.com](https://jordonbyers.com)

## 🙏 Acknowledgments

- Built with [Mantine UI](https://mantine.dev/) component library
- PDF viewing powered by [PDF.js](https://mozilla.github.io/pdf.js/)
- Frontend hosted on [Vercel](https://vercel.com)
- Backend hosted on [Interserver.net](https://www.interserver.net)
