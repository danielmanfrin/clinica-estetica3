# AI Rules for Clínica Estética Belleza Pura

This document outlines the technical stack and specific guidelines for using libraries within the "Clínica Estética Belleza Pura" application. Adhering to these rules ensures consistency, maintainability, and optimal performance.

## Tech Stack Description

*   **Frontend Framework**: React (using functional components and hooks for building dynamic user interfaces).
*   **Language**: TypeScript (for strong typing, improved code quality, and better developer experience).
*   **Styling**: Tailwind CSS (a utility-first CSS framework for rapidly building custom designs directly in your markup, ensuring responsiveness).
*   **Routing**: Custom client-side routing (managed internally within `App.tsx` using React state, rather than an external routing library).
*   **Charting & Data Visualization**: Recharts (a composable charting library built on React components for displaying data in reports).
*   **UI Component Library**: Shadcn/ui (a collection of re-usable components built with Radix UI and Tailwind CSS, providing accessible and customizable UI elements).
*   **Accessibility Primitives**: Radix UI (low-level UI components that provide a solid foundation for building accessible design systems).
*   **Icons**: Lucide-react (a collection of beautiful and consistent SVG icons).

## Library Usage Rules

To maintain a cohesive and efficient codebase, please follow these guidelines when developing:

*   **UI Components**:
    *   **Prioritize Shadcn/ui**: For common UI elements like buttons, forms, modals, cards, etc., always check if a suitable component exists in `shadcn/ui`. This ensures consistency, accessibility, and leverages pre-built solutions.
    *   **Radix UI**: Use Radix UI primitives when building custom components that require advanced accessibility features or specific behaviors not covered by `shadcn/ui`.
    *   **Custom Components**: If a component is not available in `shadcn/ui` or `Radix UI`, create a new, small, and focused React component in `src/components/` using Tailwind CSS for styling.

*   **Styling**:
    *   **Tailwind CSS Only**: All styling *must* be implemented using Tailwind CSS utility classes. Avoid writing custom CSS in separate `.css` files or using inline styles, except for global styles defined in `index.css` or specific dynamic styles that cannot be expressed with Tailwind.
    *   **Responsive Design**: Always consider responsiveness and use Tailwind's responsive prefixes (e.g., `sm:`, `md:`, `lg:`) to ensure the application looks good on all screen sizes.

*   **State Management**:
    *   **React Hooks**: Utilize React's built-in hooks (`useState`, `useContext`, `useReducer`) for managing component-level and application-wide state.
    *   **Global State**: For global state, leverage the `AppContext` and `useApp` hook provided in `App.tsx`.

*   **Routing**:
    *   **Internal Routing**: The application uses a custom routing mechanism. Navigate between pages by updating the `currentPage` state via `setCurrentPage` from the `useApp` hook. Do not introduce external routing libraries like `react-router-dom`.

*   **Data Visualization**:
    *   **Recharts**: For any charts, graphs, or data visualization needs, use the `Recharts` library.

*   **Icons**:
    *   **Lucide-react**: All icons used throughout the application should come from the `lucide-react` package.

*   **Date Handling**:
    *   **Native Date Objects**: Use native JavaScript `Date` objects for date and time manipulation. `toLocaleDateString` and `toLocaleTimeString` are preferred for display formatting. Avoid introducing heavy date utility libraries unless absolutely necessary for complex time zone or internationalization requirements.

*   **Form Validation**:
    *   **In-component Validation**: Implement form validation logic directly within the component using state to manage errors and conditional rendering for feedback.

*   **File Structure**:
    *   **`src/pages/`**: For top-level views or screens of the application.
    *   **`src/components/`**: For reusable UI components.
    *   **`src/utils/`**: For utility functions.
    *   **`src/hooks/`**: For custom React hooks.
    *   Directory names must be all lower-case.