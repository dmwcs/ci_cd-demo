# InformAG Technical Assessment – Pump Management System

## Description

A demo pump management system for agricultural scenarios, built with React, TypeScript, and Vite, using Bootstrap for responsive UI. It provides core features such as pump listing, filtering, search, batch actions, and detail view. The project follows a frontend-backend separation architecture; all data is mocked and no real backend is implemented.

**Live Demo**: [https://mango-coast-0a674fc00.2.azurestaticapps.net/](https://mango-coast-0a674fc00.2.azurestaticapps.net/)

## Test Account

- **Username**: `admin`
- **Password**: `888888`

## Features

- 🔐 JWT-based authentication
- 📊 Pump management with CRUD operations
- 🔍 Search and filtering capabilities
- 📱 Responsive design for mobile and desktop
- 🧪 Comprehensive test coverage
- 🚀 CI/CD pipeline with GitHub Actions
- 🌐 Deployed to Azure Static Web App

## Prerequisites

- Node.js 22+
- npm

## Quick Start

1. Clone the repository
2. Run `npm install`
3. Run `npm run dev`
4. Open [http://localhost:5173](http://localhost:5173)
5. Login with test credentials:
   - Username: `admin`
   - Password: `888888`

## Technical Assessment Responses

### Assumptions and Dependencies

- This application is designed for business (B2B) users who need to monitor pump status on both desktop and mobile devices. Therefore, responsive layout is important.
- Since the current dataset is small and primarily for testing purposes, I used **client-side pagination** and search to better demonstrate frontend skills. In a real enterprise environment, these can be switched to backend implementations for better performance and scalability.
- The backend is assumed to be designed with **RESTful API**, providing standard CRUD interfaces for managing pump data. The response data is stable and has clear types, so the frontend does not need extra mapping or transformation, which allows us to focus on UI and logic.
- The backend is assumed to use **JWT** Authentication for user login.
- The backend is assumed to include full pump data management and always returns data in a predictable and correct format, so no additional data transformation or manual data mapping is required.

### Web Application Architecture & Code Structure

#### Architecture Design

- I chose to use **Bootstrap** and **React** for component-based development. All pages and components are responsive, so the project can easily scale to more devices and business scenarios.
- The project follows **CI/CD** standards, using **GitHub Actions** for the pipeline, and tools like **ESLint**, **Prettier**, and **Husky** for code checks. This makes sure code quality is automated. The app is deployed to **Azure Static Web Application**, and in the future, it can use CDN and load balancing for fast scaling and canary releases.

#### Fractal Architecture Design

- I use the fractal architecture, so every component manages its own subcomponents, styles, tests, and resources. Each component only cares about its own job, which makes testing, refactoring, and fast iteration easier.
- The project uses a **route-driven** directory structure. Global reusable hooks, utils, and components are separated from business modules. Business-related pages and components are organized by route, which makes the code easier to find and maintain.

#### Code Structure

```
ci_cd-demo/
├── src/
│   ├── app/
│   │   ├── components/  Global components (shared UI elements)
│   │   ├── Login/       Page - Login
│   │   ├── PumpDetail/  Page - Pump details
│   │   └── PumpPage/    Page- Pump management
│   │       ├── index.ts         Route entry
│   │       ├── PumpPage.tsx      Page implementation
│   │       ├── PumpPage.test.tsx Unit tests
│   │       └── components/       child components
│   │          └── ...      follows the same fractal structure as components in the app folder...
│   ├── hooks/           Custom hooks
│   ├── types/           Types
│   ├── utils/           Utils
│   ├── App.tsx          Root
│   ├── App.css          Styles
│   ├── main.tsx         Bootstrap
│   ├── index.css        Base CSS
│   └── vite-env.d.ts    Env types
├── public/
│   ├── image.png        Global static assets
```

**Fractal Principle**: Each page/component contains its own subcomponents, styles, and tests, so it's easy to maintain and reuse.

### Integration with Existing Backend

#### API Module Design

- The project calls two virtual .NET RESTful API modules: user authentication and pump data management.

#### Authentication Module

- During user login, the frontend calls `POST /login` with username and password, receiving JWT Token and user information from the backend. Using a custom `useAuth` hook, login state is stored in localStorage and global context for application-wide access.
- After login, automatic redirection to the main page occurs, with logout clearing token and state. The login process uses **React Hook Form + Zod** for form validation, ensuring valid input. All authenticated pages are wrapped in AuthProvider, accessible only after login.

#### Pump Data Module

This module includes several core interfaces:

- **GET /pumps**: Frontend fetches all pump data at once when entering the main page, storing it in state
- **GET /pumps/:id**: When clicking a pump to view details, fetches detailed information using its id
- **POST /pumps**: Submits form data when adding a new pump
- **PUT /pumps/:id**: Updates pump information during editing
- **DELETE /pumps/:id**: Deletes pumps, supporting single or batch deletion

#### Data Handling Strategy

Since we're using mock data and the dataset is small, pagination and search are handled on the frontend. We fetch all data at once and do paging and filtering locally. This is easy for development and feels fast. But in a real project with more data, pagination and search should be done on the backend, and the frontend should only request the current page or filtered data. This keeps things fast and scalable.

#### User Experience Optimization

For an enterprise (B2B) system, real-time data and fast feedback are critical. I would use **optimistic update** strategy: when the user takes an action, the UI updates right away, and then confirms or rolls back after the backend responds. This ensures the user experience is always smooth and responsive.

### Tooling & Technologies

- **TypeScript**: Selected for comprehensive type constraints, combined with Zod for runtime validation, significantly improving code robustness and reducing type-related bugs.
- **React Hook Form**: Chosen for handling complex form scenarios, offering excellent performance and seamless integration with Zod validation.
- **Zod**: Selected for declarative schema definitions and automatic TypeScript type inference, essential for enterprise-level type safety.
- **React Router v6**: Chosen for declarative routing, nested routes, and dynamic routing, perfectly suiting large-scale app structure and auth requirements.
- **Recharts**: Selected for React-based component approach and rapid enterprise chart implementation, ideal for real-time data visualization.
- **React Bootstrap & Bootstrap**: Adopted for rapid development of responsive, consistent enterprise interfaces.
- **Vite**: Chosen for fast startup and hot reload, supporting rapid iteration and collaborative development.
- **ESLint**: Implemented for static code analysis, maintaining coding standards and early bug detection.
- **Prettier**: Adopted for automated code formatting, ensuring consistent style and developer focus on business logic.
- **Vitest**: Selected for quick startup and simple integration, enabling efficient component testing with React Testing Library.
- **Testing Library**: Chosen for seamless integration with modern frameworks, ensuring stable core functionality through reliable UI/UX testing.

### Testing and Validation

To make sure the app is high quality, reliable, and correct, I use the following testing and validation strategy:

- **Unit Testing**: I use Vitest with React Testing Library to do unit and component tests for all core business logic and UI components. This makes sure every function and component works as expected, both alone and together.

- **Data Validation**: All user input on the frontend is strictly checked for type and format using Zod. This stops bad data from being sent to the backend and makes the system more robust from the start.

- **Code Quality**: I use ESLint and Prettier for code style and static checks. In real business projects, these can work with Husky and lint-staged for automatic pre-commit checks, making sure every commit meets team standards and reduces bugs.

- **CI/CD**: We use GitHub Actions for CI/CD, so every push and pull request automatically runs all tests and code checks. This keeps the main branch stable and helps catch and fix problems quickly.

- **User Experience**: All async data fetching shows loading, error, and empty states, so users always get clear, friendly feedback no matter the network or backend status.

### Project Timeline & Iteration Plan

#### Sprint 1: Project Initialization and Basic Environment Setup

- Init GitHub repository
- Install and configure ESLint, Prettier, and other static code checking tools
- Configure Husky, lint-staged for pre-commit code checking (production environment)
- Configure GitHub Actions for automated testing and continuous integration (CI/CD)
- Install and configure Vite as development and build tool
- Set up basic mock data and mock API for independent frontend-backend development

#### Sprint 2: Login Feature MVP

- Implement global Header
- Develop login page and form UI
- Integrate React Hook Form and Zod for form validation
- Implement user authentication flow (call login API, handle response)
- Manage JWT Token, implement login/logout state control

#### Sprint 3: Pumps List Page MVP

- Implement basic display of pump list page
- Integrate core features like pagination and search
- Encapsulate pump-related business logic into custom Hooks
- Perfect page loading, error, and other state handling

#### Sprint 4: Enhance Pumps List Page

- Implement pump create, edit, delete operations
- Optimize UI interactions and user experience
- Add batch operations, table/card view switching
- Supplement and perfect related tests

#### Sprint 5: Pump Detail Page and Project Wrap-up

- Implement pump detail page, showing detailed information and historical data
- Integrate data visualization (like pressure curves)
- Optimize global styles and responsive layout
- Supplement documentation, perfect tests, prepare for project delivery
