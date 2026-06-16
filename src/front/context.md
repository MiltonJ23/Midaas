# Project Overview

## Executive Summary

Midaas (referenced in foundation blueprints as "Midas Sape") is a decentralized-inspired financial inclusion and democratic crowdsourced investment engine. It allows unbanked, underbanked, and standard retail investors to discover, vet, and back local entrepreneurial initiatives and micro-enterprises.

By implementing strict milestone-based escrow tracking and integrating communication hooks (such as WhatsApp transaction signals), the platform creates a highly accountable framework for fundraising in low-resource environments.

The project is currently transitioning from a validated architectural blueprint to a functional MVP/Beta phase. It is built on a modern decoupled stack utilizing Next.js (App Router), TypeScript, and specialized role-gated asset layers.

```
+-------------------------------------------------------+
|                    MIDAAS CLIENT                      |
|      (Next.js App Router UI / WhatsApp Interface)     |
+---------------------------+---------------------------+
                            |
                            | JSON / HTTPS REST
                            v
+-------------------------------------------------------+
|                    BACKEND CORE API                   |
|       (Authentication, Profile Engine, Analytics)     |
+---------------------------+---------------------------+
                            |
                            | Progressive Payout Checks
                            v
+-------------------------------------------------------+
|                 ESCROW MILESTONE LEDGER               |
|      (Asset Protection & Validation Layer)            |
+-------------------------------------------------------+

```

## Business Context

* **Problem Being Solved:** Small-to-medium enterprises (SMEs) and agricultural/tech innovators in emerging markets face structural deficits when seeking traditional credit. Conversely, micro-investors lack accessible, transparent channels to fund local businesses with clear tracking of how their capital is deployed. This often leads to post-harvest or operational losses.
* **Target Users:** * **Investors (`ROLE_CLIENT`):** Individuals looking to discover verified regional projects, securely pledge micro-payouts, and track investment progress.
* **Entrepreneurs (`ROLE_FRANCHISEE`):** Registered local operators seeking capital validation who agree to transparent milestone audits.
* **Platform Operators (`ROLE_ADMIN`):** Verification authorities processing security approvals and auditing project completions.


* **Primary Use Cases:**
* Secure user signup requiring structural KYC identification documents (National ID Card / *CNI* or official receipt/*Récépissé*).
* Project creation by verified entrepreneurs, detailing funding caps, target allocations, and phased milestone execution lists.
* Crowdfunded micro-investments routed via the interface or conversational application touchpoints (WhatsApp automation bridges).
* Safe escrow holding where capital is withheld and disbursed progressively to project owners only when verified evidence for a milestone is approved.


* **Success Criteria:** * Zero capital leakage across milestones.
* Low friction for onboarding non-technical investors via fallback channels.
* Clean runtime routing based on verified roles.



---

# Current Status

## Development Stage

The system is classified as an **Advanced MVP / Early Beta Entry**. The structural design patterns, routing layouts, authentication payload formats, and view interfaces are standardized. Core data normalization and UI elements are live, while high-scale database bindings and external payment routing gateways are mock-simulated.

### Major Completed Milestones

* Dynamic workspace rendering with custom UI atom sets (`Button`, `MUIInput`, `Select`).
* Structured authorization profile engine including token persistence engines and data normalization wrappers.
* Fully refactored role-gated architecture configuration (`sidebar.tsx`) that screens view contexts across Client, Franchisee, and Admin profiles.
* Comprehensive, high-fidelity project analytics view (`[projectID]/page.tsx`) mapping capital speed metrics and timeline progression tracks.

### Major Unfinished Milestones

* Native hardware file uploading for KYC storage targets.
* Bidirectional conversational transaction tracking via the WhatsApp execution layer.
* Live integration of automated regional payment endpoints (Mobile Money API layers).

## Known Blockers

* **Linguistic/KYC Verification Complexity:** Handling a wide variety of format shapes for the *Récépissé* identification files requires human-in-the-loop fallback verification processes.
* **Network Reliability and Latency Constraints:** Low-bandwidth data states mean client bundles must remain lean, avoiding heavy processing steps or large structural overhead during UI renders.

---

# Architecture

## High-Level Architecture

Midaas utilizes a decoupled, single-page client architecture powered by Next.js. State hydration maps dynamically against an independent REST API service layer.

```
   [ Unauthenticated Client ]                 [ Authenticated Workspace ]
               │                                           │
               ▼                                           ▼
   ┌───────────────────────┐                   ┌───────────────────────┐
   │  Public Landing &    │                   │   Gated Dashboard     │
   │  Project Catalog      │                   │   (Role-Filtered Grid)│
   └───────────┬───────────┘                   └───────────┬───────────┘
               │                                           │
               └───────────────────┬───────────────────────┘
                                   │
                                   ▼
                       ┌───────────────────────┐
                       │  Next.js Auth Store   │
                       │  & Local Storage Jar  │
                       └───────────┬───────────┘
                                   │
                                   ▼
                       ┌───────────────────────┐
                       │   Axios Engine        │
                       │   with Error Wrappers │
                       └───────────┬───────────┘
                                   │
                                   ▼
                       ┌───────────────────────┐
                       │   Remote V1 REST API  │
                       └───────────────────────┘

```

* **Frontend Engine:** Next.js single-page environment running client-side React Hook Form models and component injection tracks.
* **State Management:** Layered Zustand or state-hook data stores tracking active system user structures (`useAuthStore`). This is backed by an isolation engine wrapper over the browser’s `localStorage` APIs.
* **Data Layer:** Axios abstraction clients using automated execution wrapper functions (`withErrorHandling`) to handle status logging and authorization injection headers.

## Data Flow

```
[User Form Entry] ──> [React Hook Form State] ──> [Axios Secure Core Wrapper]
                                                          │
[Local Profile UI] <── [Normalized Store Entity] <── [API Response Payload]

```

1. **Input Capture:** Forms parse values using functional controller boundaries.
2. **Interception/Injection:** Outbound calls pull dynamic token markers from local application storage keys to append Authorization Bearer headers.
3. **Normalization:** Inbound payload matrices are fed into translation filters (`normalizeUserFromResponse`), resolving schema differences between varying API builds.
4. **Hydration:** Clean entities populate core system states, refreshing client workspaces instantly.

## Request Lifecycle

1. **Trigger:** A user invokes an administrative action, such as submitting an identification file update or requesting an escrow stage release.
2. **Form Interception:** React Hook Form validates data contracts on the client.
3. **Execution Guarding:** The network wrapper validates that active authorization tokens exist. If missing, it immediately routes the user to the log-in page.
4. **Transport:** The client dispatches a structured payload to the target backend route (e.g., `/v1/user/update/${userId}`).
5. **Payload Processing:** The remote gateway evaluates authorization rights against the database and returns a status response code.
6. **Toast Alert Notification:** The UI catches the server status code inside an error wrapper, showing a localized status notice via `react-toastify`.

---

# Technology Stack

## Core Technologies

* **Language:** TypeScript (Strict typing enabled across application contracts and entity boundary models).
* **Framework:** Next.js (App Router variant, using explicit `"use client"` hydration boundaries).
* **Styling & Presentation:** Tailwind CSS (Utility classes mapped to design tokens).

## Key Libraries & Utilities

* **Form Management:** `react-hook-form` (Declarative form state capture via custom structural controllers).
* **Notification Layer:** `react-toastify` (Asynchronous event notifications for operations).
* **State Hydration:** Custom Storage API interface wrapper isolating physical `localStorage` keys.

## Data Persistence & Models

* **Client-Side Storage:** Structured keys isolate JWT and token references to prevent structural collisions:
* `midaas-access`: Active authentication layer.
* `midaas-refresh`: Session renewal key.
* `midaas-user-id`: Unique identifier signature for lookup resolution.



---

# Repository Structure

```
├── app/
│   ├── auth/
│   │   ├── signin/         # Login entry workspace using React Hook Form structures
│   │   └── signup/         # Account creation interface capturing identity details
│   └── admin/
│       ├── dashboard/      # Context-aware operational workspace for authenticated sessions
│       ├── projects/
│       │   └── [projectID]/# Dynamic milestone overview, charts, and escrow telemetry matrix
│       ├── portfolio/      # Investment monitoring dashboard for retail backers
│       └── my-campaigns/   # Operations center for entrepreneur funding tracks
├── components/
│   ├── atoms/              # Base functional interfaces (Button, MUIInput, Select triggers)
│   ├── molecules/          # Integrated structures (Data layout tables)
│   └── hoc/                # Higher-Order Components (Bulk delete wrappers)
├── store/                  # Centralized cross-component state tracking (Modal, Auth states)
├── api/
│   ├── auth/               # Gateway endpoints, transport logic, and profile storage controls
│   └── api-wrapper-utility # Error capture logic and global request interceptors
└── entities/               # Normalized runtime business classes (User domain definitions)

```

---

# Component Inventory

## `ProjectDetailsPage`

* **Purpose:** Provides a comprehensive overview of single project campaigns, including real-time progress trackers and fund utilization histories.
* **Responsibilities:**
* Renders target metrics (funding caps, current commitment velocity, and tracking timelines).
* Manages tab states across long-form descriptions, multi-stage milestone escrows, and investor contributions.


* **Inputs:** Dynamic dynamic URL properties (`projectID`).
* **Outputs:** Interactive tracking views and structural operations toggles.
* **Important Files:** `app/admin/projects/[projectID]/page.tsx`

## `MUIInput`

* **Purpose:** Unified text entry node providing clean floating label aesthetics.
* **Responsibilities:** Standardizes accessibility behaviors, validation borders, and focus ring styling across all platform forms.
* **Inputs:** HTML input properties, labels, and error tracking references.
* **Outputs:** Validated change events fed back to parent form fields.

## `Sidebar`

* **Purpose:** Main navigation system for authenticated workspaces.
* **Responsibilities:** Filters visible system links dynamically based on the active user profile's access rights.
* **Dependencies:** `sidebar.tsx` metadata matrix.

---

# Database Design

## Domain Entity Model: `User`

The client-side platform handles authentication profiles through a unified user domain model that tracks validation and access state metrics.

```
+------------------------------------------+
|                  USER                    |
+------------------------------------------+
| - _id: string                            |
| - _email: string                         |
| - _name: string                          |
| - _profileType: "owner" | "agencies"     |
| - _validationStatus: string | null       |
+------------------------------------------+
| + id()                                   |
| + email()                                |
| + name()                                 |
| + profileType()                          |
| + validationStatus()                     |
+------------------------------------------+

```

### Key Data Fields

* `id` / `_id`: Primary identifier signature.
* `email` / `_email`: Unique communications locator string.
* `name` / `_name`: Derived full profile name string.
* `profileType`: Operational classification tracking entity structures (`"owner"` or `"agencies"`).
* `validationStatus`: Administrative review status tracking verification states for files.

## Identity Document Layer

* **Identity Tracking Requirements:** Accounts must supply physical identifier documentation parameters before executing financial actions:
* Physical attachment data reference payload.
* Explicit identifier key signature sequence string (`idCardNumber`).



---

# API Documentation

## Auth Service Layer

### Profile Sync Endpoint

* **Route:** `/v1/auth/profile`
* **Method:** `GET`
* **Purpose:** Pulls fresh server state details to hydrate the active client storage keys on startup.
* **Request Format:** Empty body. Requires authorization header validation.
* **Response Format:**
```json
{
  "status": 200,
  "data": {
    "user": {
      "id": "USR-9281X",
      "email": "dev@midaas.io",
      "firstName": "Nde Hurich",
      "lastName": "Dilan",
      "roles": ["ROLE_CLIENT"]
    },
    "message": "Profil récupéré avec succès"
  }
}

```



### Update Identity Metadata

* **Route:** `/v1/user/update/${userId}`
* **Method:** `PUT`
* **Purpose:** Updates user profile attributes and binds identification data fields.
* **Request Format:** Mixed form body including demographic records or identity key strings.
* **Authentication Requirements:** Must provide active Bearer authentication headers.

---

# Authentication & Authorization

## User Roles Matrix

1. **`ROLE_CLIENT` (Investor/Backer):** Access to public discovery tools, micro-payment workflows, and investment portfolio panels. Forbidden from creating campaigns.
2. **`ROLE_FRANCHISEE` (Entrepreneur/Project Owner):** Access to project setup tooling, milestone creation boards, and proof submission forms. Forbidden from backing other campaigns within the same profile scope.
3. **`ROLE_ADMIN` (Platform Manager/Auditor):** Global system access, verification management controls, and escrow validation release capabilities.

## Runtime Access Control Flow

```
[User Request] ──> [Sidebar Component] ──> [Filter against item.allowedRoles]
                                                    │
[Hide Navigation Item] <── [Role Mismatch] <──── [Role Matches] ──> [Render View Link]

```

---

# Configuration

## Storage Properties

The client relies on consistent system string keys to query local storage contexts:

```ts
export const StorageKeys = {
  access: "midaas-access",
  refresh: "midaas-refresh",
  userId: "midaas-user-id",
} as const;

```

---

# Deployment

## Local Development Setup

1. **Clone Environment:** Clone the repository branch structure to a local development machine.
2. **Install Dependencies:** Run the following command from the root directory to set up system packages:
```bash
npm install

```


3. **Launch Engine:** Start the local development server:
```bash
npm run dev

```


4. **Access UI Portal:** Open your browser and navigate to `http://localhost:3000`.

---

# Technical Debt

## Architectural & Type Debt

* **Role Typo Handling:** The signup controller interface contains structural role type declarations with a spelling mismatch (`ROLE_FRACHISEE` missing an 'N' vs standard `ROLE_FRANCHISEE`). Ensure values match downstream validations exactly.
* **Strict Schema Unification:** The data normalization wrapper uses layered fallback checks (`rawData?.Data ?? rawData?.data ?? rawData`) to parse backend payloads. Standardizing server response formats will allow this fallback parsing block to be removed.
* **Mock Data Boundaries:** Core analytical modules rely on internal data objects. These must be decoupled and mapped directly to live API query methods.

---

# AI Agent Onboarding Guide

## Critical Architecture & Formatting Rules

1. **Never Bypass Error Wrappers:** All network requests must use the standard request handler wrappers rather than raw client calls to ensure errors are tracked correctly.
2. **Always Use Role Guards:** When adding new views or features, update the access rules matrix inside `sidebar.tsx` to maintain security boundaries across roles.
3. **Design Consistency:** Build input components around the established styling guidelines, ensuring clear focus states and validation borders.

---

# Quick Context for Future AI Agents

```
================================================================================
MIDAAS SYSTEM PROFILE TRACE SHEET
================================================================================
Core Focus: Inclusive Crowdfundescrow Infrastructure Layer
Active Profile Configurations: ROLE_CLIENT | ROLE_FRANCHISEE | ROLE_ADMIN
Token Keys: midaas-access | midaas-refresh | midaas-user-id
================================================================================
ARCHITECTURE DESIGN PRINCIPLES:
 1. Milestone Tracking: Funds are held in escrow and released progressively.
 2. Profile Isolation: Sidebar menus use explicit role filters.
 3. Normalization: Data mappings handle multiple server response formats.
================================================================================

```

---

# Confidence Assessment

* **Project Overview:** **High** — Core business rules, target demographics, and escrow mechanics are explicitly detailed in foundation design documents.
* **Architecture:** **High** — Form definitions, network wrapper layers, and profile states are verified directly within active source files.
* **Database Design / Entity Schema:** **Medium** — Class definitions are explicitly set up on the client side, but backend sync engines remain subject to remote API changes.