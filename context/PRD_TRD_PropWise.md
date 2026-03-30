# PropWise — Product Requirements Document (PRD)
**Version:** 1.0  
**Prepared for:** Codex / Development Use  
**Project Type:** BCA Final Year Major Project — Web Application  
**Domain:** Real Estate / PropTech / CRM  
**Stack:** Next.js 15 + TypeScript + Tailwind CSS + shadcn/ui + Firebase + Recharts  

## P1: Project Overview

PropWise is a real estate CRM and property intelligence web application designed for property seekers, investors, real estate agents, and property managers. Instead of functioning only as a listing portal, it combines property discovery with decision-support tools such as side-by-side comparison, investment analysis, and lead/customer management so users can evaluate properties with more confidence and less dependence on scattered external tools. The platform is built as a modern full-stack web app using Next.js App Router, TypeScript, Tailwind CSS, shadcn/ui, and Firebase-backed authentication, data storage, file storage, and hosting. 

**Core problem:** Existing property portals mainly show listings and basic details, but they do not provide enough comparative analysis, ROI projections, rental yield analysis, or integrated CRM workflows. This forces users to jump between multiple tools and makes real-estate decision-making fragmented and inefficient.  

**Solution summary:** PropWise solves this by combining property listings, advanced search/filtering, financial calculators, comparison heatmaps/charts, and CRM workflows into one unified platform. Property seekers get data-driven insights, while agents and managers get tools for lead tracking, customer profiling, scheduling, and conversion analytics. fileciteturn0file1

## P2: User Roles

**Role: Property Seeker / Buyer / Investor**
- Who they are: End users looking to buy or evaluate residential or investment properties.
- What they can do:
  - Register and log in
  - Browse property listings
  - Search and filter properties
  - View detailed property pages
  - Compare up to four properties
  - Use EMI, rental yield, ROI, and tax calculators
  - Save shortlists or preferred properties (inferred)
- Their dashboard: Personalized property recommendations, recent comparisons, saved properties, and investment insights.

**Role: Real Estate Agent**
- Who they are: Sales professionals who manage client leads, recommend properties, and track follow-ups.
- What they can do:
  - Manage leads and customers
  - Create/update property listings
  - View interaction history
  - Schedule property viewings
  - Share comparisons and financial insights with clients
  - Track conversions and productivity metrics
- Their dashboard: Lead pipeline, scheduled viewings, customer profiles, assigned properties, and conversion analytics.

**Role: Property Manager**
- Who they are: Operational users maintaining listings, media, and property metadata.
- What they can do:
  - Add/edit/delete listings
  - Upload images and property documents
  - Maintain availability/status and amenity data
  - Oversee listing quality and completeness
- Their dashboard: Property inventory, status summaries, recent updates, and listing management controls.

**Role: Admin**
- Who they are: Platform supervisors responsible for user access, platform governance, and high-level analytics.
- What they can do:
  - Manage users and roles
  - Monitor listings and CRM activity
  - Review platform analytics
  - Enforce data access rules
  - Configure system-level settings (inferred)
- Their dashboard: Aggregate KPIs, user counts, listing health, lead/conversion reports, and role-management tools.

## P3: Feature List (Complete)

### Module: Authentication & Access Control

**Feature: User Registration & Login**
- Description: Allows users to create accounts and securely sign in using Firebase Authentication.
- User role(s): Property Seeker, Agent, Property Manager, Admin
- Input: Name, email, password, role selection or assigned role
- Output / Result: Account created and user redirected to role-specific dashboard
- Edge cases: Duplicate email, weak password, invalid credentials, unauthorized role assignment
- Priority: High

**Feature: Role-Based Access Control**
- Description: Restricts pages and actions based on the user's role.
- User role(s): All logged-in users
- Input: Authenticated user session and stored role
- Output / Result: Appropriate dashboard access and protected routes
- Edge cases: Missing role record, unauthorized route access, stale session
- Priority: High

### Module: Property Listing Management

**Feature: Property Listing Creation and Management**
- Description: Enables authorized users to create, update, and manage property listings with full specifications.
- User role(s): Agent, Property Manager, Admin
- Input: Title, price, location, type, area, amenities, descriptions, images, neighborhood info
- Output / Result: Property listing stored and made searchable in the system
- Edge cases: Missing mandatory fields, invalid media uploads, incomplete property metadata
- Priority: High

**Feature: Property Detail Pages**
- Description: Shows complete property information including galleries and neighborhood details.
- User role(s): Public, Property Seeker, Agent, Property Manager, Admin
- Input: Property selection or property ID
- Output / Result: Detailed property page with images, features, pricing, and locality context
- Edge cases: Property removed, missing images, partial neighborhood data
- Priority: High

### Module: Search & Discovery

**Feature: Advanced Search Filters**
- Description: Lets users refine properties by multiple criteria such as location, price, type, area, and amenities.
- User role(s): Public, Property Seeker, Agent
- Input: Filter values and search keywords
- Output / Result: Filtered property list matching user preferences
- Edge cases: No matching results, invalid ranges, conflicting filters
- Priority: High

### Module: Comparison & Analytics

**Feature: Visual Comparison Tool**
- Description: Compares up to four properties side by side using charts and comparative metrics.
- User role(s): Property Seeker, Agent, Admin
- Input: Up to four selected properties and optional comparison priorities
- Output / Result: Comparative tables, charts, and ratings across multiple attributes
- Edge cases: Less than two properties selected, duplicate selections, missing metrics for a property
- Priority: High

**Feature: Interactive Heatmaps**
- Description: Highlights which properties perform better on criteria such as price, amenities, area, and location ratings.
- User role(s): Property Seeker, Agent, Admin
- Input: Selected properties and normalized comparison metrics
- Output / Result: Visual strength indicators for quick decision-making
- Edge cases: Incomplete metric set, tie cases, unsupported property combinations
- Priority: Medium

**Feature: Customizable Comparison Criteria**
- Description: Allows users to prioritize criteria important to them during comparison.
- User role(s): Property Seeker, Agent
- Input: User-weighted comparison preferences
- Output / Result: Comparison output aligned with personalized decision priorities
- Edge cases: All weights set equally or invalid weighting combinations
- Priority: Medium

### Module: Investment Calculator

**Feature: EMI Calculator**
- Description: Calculates estimated monthly mortgage payments based on loan amount, tenure, and interest rate.
- User role(s): Property Seeker, Agent
- Input: Property price or loan amount, interest rate, tenure, down payment
- Output / Result: EMI amount and affordability insight
- Edge cases: Zero/negative values, invalid tenure, unrealistic interest rates
- Priority: High

**Feature: Rental Yield Calculator**
- Description: Estimates rental yield using property value and expected rental income.
- User role(s): Property Seeker, Investor, Agent
- Input: Property price, expected monthly/annual rental income
- Output / Result: Rental yield percentage
- Edge cases: Zero property price, empty rent values, unrealistic assumptions
- Priority: High

**Feature: ROI Projection Calculator**
- Description: Projects return on investment based on appreciation and holding period assumptions.
- User role(s): Property Seeker, Investor, Agent
- Input: Purchase price, appreciation rate, holding period, expected income
- Output / Result: ROI projection over time
- Edge cases: Negative appreciation, very long holding periods, incomplete inputs
- Priority: High

**Feature: Tax Benefit Calculator**
- Description: Estimates home-loan-related tax deduction benefits.
- User role(s): Property Seeker, Investor, Agent
- Input: Loan amount, interest/principal assumptions, tax bracket (inferred)
- Output / Result: Estimated tax savings
- Edge cases: Missing tax assumptions, unsupported tax rules, invalid user inputs
- Priority: Medium

**Feature: Alternative Investment Comparison**
- Description: Compares property returns against other investment options.
- User role(s): Investor, Agent
- Input: Property ROI data and benchmark investment assumptions
- Output / Result: Relative investment attractiveness summary
- Edge cases: Missing benchmark values, inconsistent periods, unsupported scenarios
- Priority: Medium

### Module: CRM Functionality

**Feature: Lead Capture and Management**
- Description: Captures prospects and tracks them with priority classification.
- User role(s): Agent, Admin
- Input: Lead name, contact info, source, priority, budget, preferences
- Output / Result: Structured lead records and management pipeline
- Edge cases: Duplicate lead entry, incomplete contact info, invalid priority values
- Priority: High

**Feature: Customer Profile Tracking**
- Description: Stores customer preferences, budgets, and property interests for personalized follow-up.
- User role(s): Agent, Admin
- Input: Customer profile details, preferences, budgets, notes
- Output / Result: Complete customer record for relationship management
- Edge cases: Missing required profile fields, conflicting preference data
- Priority: High

**Feature: Interaction History**
- Description: Records calls, emails, meetings, and property viewing activity.
- User role(s): Agent, Admin
- Input: Interaction type, date/time, notes, associated customer/property
- Output / Result: Chronological activity timeline per lead/customer
- Edge cases: Missing references, invalid timestamps, duplicate logs
- Priority: High

**Feature: Property Viewing Scheduling**
- Description: Schedules property visits and associates them with customers and listings.
- User role(s): Agent, Property Manager, Admin
- Input: Property, customer, date/time, notes, status
- Output / Result: Viewing schedule entry with calendar integration intent
- Edge cases: Scheduling conflicts, unavailable property, canceled appointments
- Priority: High

**Feature: Analytics Dashboard**
- Description: Presents conversion metrics and productivity data for professional users.
- User role(s): Agent, Admin
- Input: CRM and property activity data
- Output / Result: KPI cards, charts, and trend summaries
- Edge cases: No data available, partial period data, inconsistent event logging
- Priority: Medium

## P4: User Flows

**Flow: User Registration & Login**
1. User opens the app and lands on the public landing page.
2. User clicks **Register** and fills in name, email, password, and basic role details.
3. Firebase Authentication creates the account.
4. The app creates a user profile in Firestore with role metadata.
5. User is redirected to the appropriate dashboard.
6. On future visits, the user clicks **Login** and enters email and password.
7. Firebase verifies credentials and restores the session.
8. Route guards check the role and redirect the user to the correct area.
9. On logout, the session ends and protected pages become inaccessible.

**Flow: Property Search, Evaluation, and Comparison**
1. User visits the property listing page.
2. User applies filters such as location, price range, area, type, and amenities.
3. The system returns matching property cards.
4. User opens property detail pages to review images, specifications, and neighborhood information.
5. User selects up to four properties for comparison.
6. The comparison module generates tables, charts, and heatmaps showing relative strengths.
7. User customizes criteria priorities to view results from their preferred perspective.
8. User uses investment calculators on shortlisted properties to evaluate affordability and returns.
9. User decides whether to save, inquire about, or schedule a viewing for a property.

**Flow: Agent Lead Management and Viewing Schedule**
1. Agent logs into the CRM dashboard.
2. Agent captures a new lead with contact details, budget, and preferences.
3. Lead is classified by priority and stored in the CRM.
4. Agent matches the lead with relevant property listings.
5. Agent records call/email interactions in the lead history.
6. Agent schedules a property viewing and links it to the lead and selected listing.
7. The dashboard updates with the upcoming appointment and pipeline status.
8. After the viewing, the agent updates notes, follow-up actions, and conversion status.

## P5: Page & Screen Inventory

| Page Name | Route | Who Can Access | Key Components on This Page |
|-----------|-------|----------------|-----------------------------|
| Landing Page | / | Public | Hero section, value proposition, CTA buttons, feature highlights |
| Login | /login | Public | Email/password form, validation, redirect logic |
| Register | /register | Public | Registration form, role/profile setup, validation |
| Property Listings | /properties | Public / Logged-in users | Search bar, filter panel, property cards, sorting |
| Property Details | /properties/:id | Public / Logged-in users | Image gallery, specs, amenities, price, neighborhood info |
| Compare Properties | /compare | Logged-in users | Selected property panels, charts, heatmap, criteria controls |
| Investment Calculator | /calculator | Logged-in users | EMI form, rental yield form, ROI form, tax calculator cards |
| User Dashboard | /dashboard | Logged-in users | Personalized widgets, saved properties, recent activity |
| Agent CRM Dashboard | /agent | Agent | Lead summary, tasks, appointments, conversion charts |
| Leads Management | /agent/leads | Agent / Admin | Lead table, filters, status tags, action buttons |
| Customer Profiles | /agent/customers | Agent / Admin | Customer cards/table, preferences, notes, linked properties |
| Interaction History | /agent/interactions | Agent / Admin | Activity timeline, notes forms, communication logs |
| Viewing Scheduler | /agent/viewings | Agent / Property Manager / Admin | Calendar/list view, booking form, status controls |
| Property Management | /manage-properties | Property Manager / Admin | CRUD table, upload form, listing status, media controls |
| Analytics Dashboard | /analytics | Agent / Admin | KPI cards, Chart.js charts, conversion and productivity stats |
| Admin Panel | /admin | Admin | User management, role control, system overview |
| Profile / Settings | /profile | Logged-in users | Account details, password update, preferences |
| Not Found | * | Public | Error state, navigation back to safe routes |

## P6: UI/UX Requirements

**Layout pattern:**  
- Public browsing pages use a top navbar with prominent search and CTA actions.
- Logged-in professional dashboards use a sidebar layout for quick access to CRM, analytics, and property tools.
- Comparison and calculator pages should prioritize wide content areas for charts, tables, and forms.

**Responsiveness:**  
- Desktop-first, fully mobile-responsive design.
- Filter panels should collapse into drawers on smaller screens.
- Tables should support horizontal scroll or card fallback on mobile.

**Color theme guidance:**  
- Premium, modern, and trustworthy visual style.
- Use a design system built with Tailwind CSS tokens and shadcn/ui primitives.
- Neutral guidance only; final aesthetic can be refined during design phase.

**Key UI components needed:**
- Property cards: Preview image, title, price, location, area, CTA actions.
- Filter sidebar/panel: Location, price, type, area, amenities, sort controls.
- Image gallery: Multiple property photos with thumbnails.
- Comparison table: Attribute-by-attribute property comparison.
- Heatmap grid: Highlights strong/weak property attributes visually.
- Charts: Price, area, amenities, ratings, ROI projections using Recharts.
- Calculator cards/forms: EMI, rental yield, ROI, tax inputs and outputs.
- CRM tables: Leads, customers, properties, appointments.
- Activity timeline: Calls, emails, meetings, and status history.
- KPI cards: Total leads, conversions, scheduled visits, listing performance.
- Modals/forms: Add lead, schedule viewing, edit property, upload images.

**Empty states:**  
- No properties found → show friendly message with filter reset suggestion.
- No leads/customers yet → show onboarding CTA to add first record.
- No comparison selected → prompt user to choose properties.
- No analytics data → show explanation and quick-start actions.

**Loading states:**  
- Skeleton loaders for property cards, dashboards, and tables.
- Placeholder charts before analytics render.
- Button-level loading indicators for form submissions and calculator actions.

---

# PropWise — Technical Requirements Document (TRD)
**Version:** 1.0  
**Stack:** Next.js 15 (App Router) + TypeScript + Tailwind CSS + shadcn/ui + Firebase (Auth + Firestore + Storage + Hosting) + Recharts  
**ML:** None for Phase 1-2  

## T1: System Architecture

```text
[Browser / Next.js App Router UI]
        ↓
[Firebase Authentication] — handles login, roles, sessions
        ↓
[Cloud Firestore] — stores users, properties, leads, customers, interactions, viewings
        ↓
[Firebase Storage] — stores property images and supporting files
        ↓
[Next.js Runtime + Vercel / Firebase Hosting] — serves SSR/CSR application
        ↓
[Recharts + TypeScript Business Logic] — powers visual comparison and calculators
```

PropWise follows a modern web architecture where users interact with a Next.js 15 application built with the App Router and TypeScript. The UI layer uses Tailwind CSS and shadcn/ui for responsive, reusable design systems. Authentication is handled by Firebase Auth. After login, server and client components fetch user-role data from Firestore and apply protected access rules using middleware and route guards. Core business data such as properties, leads, customers, interactions, and viewing schedules is stored in Firestore. Property images are stored in Firebase Storage. The application can be deployed on Vercel or Firebase Hosting, while visualization and financial calculations are processed in the frontend using Recharts and TypeScript-based financial utilities. fileciteturn0file1

## T2: Firebase Firestore Schema

**Collection: users**  
Document ID: Firebase Auth UID

| Field Name | Type | Description | Example |
|------------|------|-------------|---------|
| uid | string | Firebase Auth user ID | "abc123xyz" |
| fullName | string | Full name of user | "Rahul Sharma" |
| email | string | Email address | "rahul@email.com" |
| role | string | User role | "agent" |
| phone | string | Contact number | "+91XXXXXXXXXX" |
| avatarUrl | string | Profile image URL | "https://..." |
| createdAt | timestamp | Account creation time | Timestamp |
| updatedAt | timestamp | Last update time | Timestamp |
| status | string | Account status | "active" |

**Collection: properties**  
Document ID: auto-generated by Firestore

| Field Name | Type | Description | Example |
|------------|------|-------------|---------|
| title | string | Listing title | "3 BHK Apartment in Noida" |
| description | string | Full listing description | "Spacious apartment near metro..." |
| type | string | Property type | "apartment" |
| price | number | Property asking price | 8500000 |
| areaSqFt | number | Built-up area | 1450 |
| location | map | Address/location info | {city: "Noida", locality: "Sector 137"} |
| amenities | array | Amenity list | ["Parking", "Gym", "Lift"] |
| neighborhoodInfo | string | Nearby area details | "Near schools and metro" |
| imageUrls | array | Property image URLs | ["https://..."] |
| createdBy | string | UID of creator | "abc123xyz" |
| status | string | Listing state | "active" |
| createdAt | timestamp | Created time | Timestamp |
| updatedAt | timestamp | Updated time | Timestamp |

**Collection: savedComparisons**  
Document ID: auto-generated by Firestore

| Field Name | Type | Description | Example |
|------------|------|-------------|---------|
| userId | string | Owner of comparison | "abc123xyz" |
| propertyIds | array | Compared property IDs | ["p1", "p2", "p3"] |
| criteriaWeights | map | User priority weights | {price: 3, location: 5} |
| generatedAt | timestamp | Comparison generation time | Timestamp |

**Collection: calculatorSessions**  
Document ID: auto-generated by Firestore

| Field Name | Type | Description | Example |
|------------|------|-------------|---------|
| userId | string | User who ran calculation | "abc123xyz" |
| propertyId | string | Related property | "prop001" |
| emiInput | map | EMI calculation input values | {loanAmount: 5000000, rate: 8.5, tenureYears: 20} |
| rentalYieldInput | map | Rental yield inputs | {annualRent: 360000, propertyPrice: 8500000} |
| roiInput | map | ROI projection inputs | {appreciationRate: 6, holdingYears: 10} |
| resultSummary | map | Key outputs | {emi: 43391, rentalYield: 4.23, projectedROI: 68} |
| createdAt | timestamp | Creation time | Timestamp |

**Collection: leads**  
Document ID: auto-generated by Firestore

| Field Name | Type | Description | Example |
|------------|------|-------------|---------|
| name | string | Lead name | "Priya Verma" |
| email | string | Lead email | "priya@email.com" |
| phone | string | Lead phone | "+91XXXXXXXXXX" |
| source | string | Lead source channel | "Website" |
| priority | string | Lead priority | "high" |
| budgetMin | number | Lower budget range | 5000000 |
| budgetMax | number | Upper budget range | 9000000 |
| preferences | map | Lead preferences | {type: "apartment", city: "Noida"} |
| assignedAgentId | string | Linked agent UID | "agent123" |
| status | string | Funnel status | "new" |
| createdAt | timestamp | Lead creation time | Timestamp |
| updatedAt | timestamp | Last update time | Timestamp |

**Collection: customers**  
Document ID: auto-generated by Firestore

| Field Name | Type | Description | Example |
|------------|------|-------------|---------|
| leadId | string | Source lead reference | "lead001" |
| name | string | Customer name | "Priya Verma" |
| email | string | Customer email | "priya@email.com" |
| phone | string | Customer phone | "+91XXXXXXXXXX" |
| budget | number | Stated budget | 8000000 |
| preferences | map | Search preferences | {bedrooms: 3, locality: "Sector 137"} |
| notes | string | Agent notes | "Interested in metro connectivity" |
| assignedAgentId | string | Linked agent UID | "agent123" |
| createdAt | timestamp | Record creation | Timestamp |
| updatedAt | timestamp | Record update | Timestamp |

**Collection: interactions**  
Document ID: auto-generated by Firestore

| Field Name | Type | Description | Example |
|------------|------|-------------|---------|
| customerId | string | Linked customer | "cust001" |
| leadId | string | Optional lead link | "lead001" |
| propertyId | string | Linked property | "prop001" |
| agentId | string | Agent performing interaction | "agent123" |
| type | string | Interaction type | "call" |
| notes | string | Summary notes | "Discussed EMI options" |
| interactionAt | timestamp | Date/time of interaction | Timestamp |
| outcome | string | Interaction result | "follow_up_required" |

**Collection: viewings**  
Document ID: auto-generated by Firestore

| Field Name | Type | Description | Example |
|------------|------|-------------|---------|
| propertyId | string | Property being viewed | "prop001" |
| customerId | string | Customer attending | "cust001" |
| agentId | string | Assigned agent | "agent123" |
| scheduledAt | timestamp | Viewing date/time | Timestamp |
| status | string | Viewing status | "scheduled" |
| notes | string | Remarks | "Bring property brochure" |
| createdAt | timestamp | Creation time | Timestamp |

## T3: Firebase Auth Setup

**Method:** Email + Password  
**Roles:** Stored in Firestore `users` collection as the `role` field  
**Role check:** On login, fetch the user's Firestore document using the Auth UID, read the `role`, then redirect to the correct dashboard  
**Session:** Firebase handles session persistence automatically  
**Protected routes:** Use an auth state observer and route guards to restrict unauthorized pages  

**Redirect logic by role:**
- `buyer` / `investor` → `/dashboard`
- `agent` → `/agent`
- `property_manager` → `/manage-properties`
- `admin` → `/admin`

## T4: File & Folder Structure

```text
PropWise/
├── public/
│   └── logo.svg
├── src/
│   ├── app/
│   │   ├── (public)/
│   │   │   ├── page.tsx                  # Landing Page
│   │   │   ├── login/page.tsx
│   │   │   ├── register/page.tsx
│   │   │   ├── properties/page.tsx
│   │   │   └── properties/[id]/page.tsx
│   │   ├── (dashboard)/
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── compare/page.tsx
│   │   │   ├── calculator/page.tsx
│   │   │   ├── agent/page.tsx
│   │   │   ├── agent/leads/page.tsx
│   │   │   ├── agent/customers/page.tsx
│   │   │   ├── agent/interactions/page.tsx
│   │   │   ├── agent/viewings/page.tsx
│   │   │   ├── manage-properties/page.tsx
│   │   │   ├── analytics/page.tsx
│   │   │   ├── admin/page.tsx
│   │   │   └── profile/page.tsx
│   │   ├── api/
│   │   │   └── health/route.ts
│   │   ├── layout.tsx
│   │   ├── not-found.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/                           # shadcn/ui components
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   └── Sidebar.tsx
│   │   ├── property/
│   │   │   ├── PropertyCard.tsx
│   │   │   ├── FilterPanel.tsx
│   │   │   ├── ComparisonTable.tsx
│   │   │   └── HeatmapGrid.tsx
│   │   ├── crm/
│   │   │   ├── LeadTable.tsx
│   │   │   ├── CustomerTable.tsx
│   │   │   └── ViewingCalendar.tsx
│   │   └── analytics/
│   │       ├── KPIWidget.tsx
│   │       └── ROIChart.tsx
│   ├── lib/
│   │   ├── firebase.ts
│   │   ├── auth.ts
│   │   ├── firestore/
│   │   │   ├── properties.ts
│   │   │   ├── crm.ts
│   │   │   └── users.ts
│   │   ├── calculations/
│   │   │   ├── emi.ts
│   │   │   ├── roi.ts
│   │   │   └── rentalYield.ts
│   │   ├── validations.ts
│   │   └── utils.ts
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useProperties.ts
│   │   └── useLeads.ts
│   ├── types/
│   │   ├── property.ts
│   │   ├── crm.ts
│   │   └── user.ts
│   └── middleware.ts
├── .env.local
├── .gitignore
├── components.json
├── next.config.ts
├── package.json
├── postcss.config.js
├── tailwind.config.ts
└── README.md
```

## T5: Next.js Route Setup

| Route | App Router File | Protected? | Role Required |
|-------|------------------|------------|---------------|
| / | `src/app/(public)/page.tsx` | No | Public |
| /login | `src/app/(public)/login/page.tsx` | No | Public |
| /register | `src/app/(public)/register/page.tsx` | No | Public |
| /properties | `src/app/(public)/properties/page.tsx` | No | Public |
| /properties/[id] | `src/app/(public)/properties/[id]/page.tsx` | No | Public |
| /compare | `src/app/(dashboard)/compare/page.tsx` | Yes | Any logged-in |
| /calculator | `src/app/(dashboard)/calculator/page.tsx` | Yes | Any logged-in |
| /dashboard | `src/app/(dashboard)/dashboard/page.tsx` | Yes | buyer / investor |
| /agent | `src/app/(dashboard)/agent/page.tsx` | Yes | agent |
| /agent/leads | `src/app/(dashboard)/agent/leads/page.tsx` | Yes | agent / admin |
| /agent/customers | `src/app/(dashboard)/agent/customers/page.tsx` | Yes | agent / admin |
| /agent/interactions | `src/app/(dashboard)/agent/interactions/page.tsx` | Yes | agent / admin |
| /agent/viewings | `src/app/(dashboard)/agent/viewings/page.tsx` | Yes | agent / property_manager / admin |
| /manage-properties | `src/app/(dashboard)/manage-properties/page.tsx` | Yes | property_manager / admin |
| /analytics | `src/app/(dashboard)/analytics/page.tsx` | Yes | agent / admin |
| /admin | `src/app/(dashboard)/admin/page.tsx` | Yes | admin |
| /profile | `src/app/(dashboard)/profile/page.tsx` | Yes | Any logged-in |
| not-found | `src/app/not-found.tsx` | No | Public |

## T6: Environment Variables

```env
# Firebase configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Optional app config
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## T7: ML Model Specification

**ML Integration:** Not applicable for this project.

## T8: Third-Party APIs / Libraries

**Service: Firebase Authentication**
- Purpose: User registration, login, session persistence
- Endpoint used: Firebase SDK client methods
- Auth: Firebase project credentials
- How to get key: Create Firebase project and copy config values into `.env`

**Service: Cloud Firestore**
- Purpose: Store user, property, CRM, and scheduling data
- Endpoint used: Firebase SDK client methods
- Auth: Firebase project credentials and Firestore security rules
- How to get key: Enable Firestore in Firebase Console

**Service: Firebase Storage**
- Purpose: Store property images and media
- Endpoint used: Firebase SDK storage APIs
- Auth: Firebase project credentials and storage rules
- How to get key: Enable Storage in Firebase Console

**Library: Recharts**
- Purpose: Render comparison charts and analytics dashboard visualizations
- Endpoint used: N/A (frontend library)
- Auth: None
- How to get key: Install via package manager

**Library: shadcn/ui**
- Purpose: Provide accessible, reusable UI primitives for forms, dialogs, tables, cards, sheets, and inputs
- Endpoint used: N/A (component library)
- Auth: None
- How to get key: Initialize in the Next.js app and add required components

## T9: Development Setup Instructions

```bash
# Setting up the project locally

1. Clone the repo:
   git clone [repo-url]
   cd propwise

2. Install dependencies:
   npm install

3. Set up Firebase:
   - Go to console.firebase.google.com
   - Create a new project named "PropWise"
   - Enable Authentication (Email/Password)
   - Create Firestore database (start in test mode for development)
   - Enable Storage
   - Enable Hosting
   - Copy config values into the .env file

4. Initialize UI and install dependencies:
   npm install
   npx shadcn@latest init

5. Run the app:
   npm run dev

6. Open in browser:
   http://localhost:3000
```

## Notes for Codex / Implementation

- Place this file in the project root folder before opening Codex.
- Codex can use this PRD/TRD to scaffold pages, routes, Firebase collections, and reusable components.
- The PRD and TRD were generated from the provided PropWise synopsis and then modernized to a current implementation stack using Next.js, TypeScript, Tailwind CSS, shadcn/ui, Firebase, and Recharts while preserving the original product scope. fileciteturn0file0 fileciteturn0file1
