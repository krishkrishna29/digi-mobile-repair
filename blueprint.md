# Project Blueprint

## Overview

This document outlines the design, features, and implementation of the RepairDash application. The goal is to create a modern, user-friendly, and efficient application for managing mobile device repairs.

## Design and Styling

### Color Palette

*   **Primary:** Blue (used for buttons, links, and highlights)
*   **Secondary:** Pink (used for accents and visual interest)
*   **Background:** Dark Gray (`bg-gray-900`) and a slightly lighter shade (`bg-gray-800`) provide a modern and clean backdrop.
*   **Text:** White (ensures readability and contrast)

### Typography

*   **Font:** Sans-serif (for a clean and modern look)
*   **Hierarchy:** Clear visual hierarchy is established through the use of different font sizes and weights for headings, subheadings, and body text.

### Visual Elements

*   **Illustration:** A relevant and visually engaging illustration is used on the authentication pages to create a unique experience.
*   **Iconography:** The Heroicons library is used to provide a consistent and modern set of icons for user actions and navigation.
*   **Animation:** A subtle, slow-spinning cog animation (`animate-spin-slow`) is used next to the company name to add a polished visual touch.

## Implemented Changes & Features

### Authentication
*   **Pages:** Sign Up and Login pages.
*   **Functionality:**
    *   Users can create a new account with their full name, mobile number, email, and password.
    *   Existing users can log in with their email and password.
    *   User data is stored in Firebase Authentication and Firestore.
*   **UI/UX:**
    *   Modernized UI with a dark theme, centered forms, and clear calls to action.
    *   Includes a visually engaging panel with an illustration and brand messaging.

### Dashboard
*   **Layout:** A two-column layout with a sidebar for navigation and a main content area.
*   **Features:**
    *   Displays active and completed repair requests.
    *   Provides a summary of key metrics (active repairs, completed repairs, pending payments).
    *   Includes a "Request a Repair" button for easy access to the new repair form.
    *   A repair history table shows details of past and current repairs.
*   **Styling:** Consistent dark theme with clear information hierarchy.

### Notification System
*   **Components:**
    *   `Notification.jsx`: A floating notification panel that displays recent notifications.
    *   `Notifications.jsx`: A full-page notification management interface.
*   **Functionality:**
    *   **Real-time Updates:** Real-time listeners (onSnapshot) for new notifications and unread counts.
    *   **User-Specific Content:** Non-admin users only see their own notifications.
    *   **Admin Capabilities:** Admins can view and manage all notifications, with a specific focus on new repair requests.
    *   **Actions:** Support for marking individual notifications as read, marking all as read, deleting read notifications, and clearing all notifications.
    *   **Confirmation Modals:** Integrated confirmation modals for bulk actions to prevent accidental data loss.
*   **Permissions & Security:**
    *   Firestore security rules updated to support role-based access control.
    *   Resolved `FirebaseError: Missing or insufficient permissions` by simplifying rules and aligning client-side queries with the 10-get-call limit in Firestore batch operations.
    *   Admins are explicitly targeted with notifications using a `userId: 'admin'` identifier.

### Offers & Promotions
*   **Admin Interface:** A dedicated section in the Admin Dashboard for managing promotions.
*   **Functionality:**
    *   Admins can create new promotions with a title, description, discount code, and an optional expiry date.
    *   A modal form provides a user-friendly way to input promotion details.
    *   All existing promotions are displayed in a list, showing their status (active/expired).
    *   Admins have the ability to edit or delete promotions.
*   **Firestore Integration:**
    *   A new `promotions` collection is created in Firestore to store all promotion-related data.

### Admin Dashboard Enhancements
*   **Streamlined Notifications:** Admins now only receive notifications for new repair requests (`type: 'repair_request_new'`), reducing clutter from routine status updates.
*   **Role-Aware Logic:** Navigation and data fetching are now fully aware of the user's role (admin vs. regular user).

### Bug Fixes & Refinements
*   **Resolved 3D Model Error:** Replaced a broken 3D model link that was causing a "404 Not Found" error.
*   **Fixed Console Errors:** Disabled unnecessary Augmented Reality (AR) features that were causing security errors in the browser console.
*   **Corrected Typo:** Fixed a typo in the company name ("Drgi" to "DIGI") on the Dashboard page.
*   **Layout Correction:** Resolved a layout issue causing a white line to appear at the bottom of the authentication pages.
*   **Code Refactoring:** Refactored the login and sign-up pages to remove the `AuthLayout` component and instead use a conditional rendering approach in `App.jsx`. This fixed a persistent issue with the header and a stray comment. The `Login.jsx` and `SignUp.jsx` files were simplified to remove duplicate layout code. The `Layout.jsx` file was deleted as it was no longer needed.
*   **Home Page Fixes:** Fixed a broken image link in the "About Us" section and removed a stray `\` character in the "Why Us" section of the `Home.jsx` file.
*   **Routing and Blank Page Fix:** Resolved a critical bug that caused a blank page and a 404 error on startup. This was due to an incorrect import of a deleted `Layout.jsx` file. The fix involved:
    *   Moving the entire routing logic into `App.jsx`.
    *   Simplifying `main.jsx` to only render the main `App` component.
    *   Creating an `AppWrapper` component to provide the necessary `Router` context for the `useLocation` hook, which is now used in `App.jsx` to conditionally render the main navigation.
*   **UI/UX Enhancements:**
    *   **Navigation:** The "Login" and "Sign Up" buttons in the header have been restyled to be more prominent and visually appealing, improving user guidance.
    *   **Authentication Forms:** The input fields on the Login and Sign Up pages have been enlarged and the form layout has been refined to improve usability and provide a more consistent user experience.
    *   **Visual Polish:** A subtle spinning animation was added to the logo icon in the header for a more dynamic feel.
