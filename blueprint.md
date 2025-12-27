# Blueprint: DIGI Mobile Repair Shop

This document outlines the architecture, features, and implementation plan for the DIGI Mobile Repair Shop application.

## 1. Core Purpose & Capabilities

The application is a comprehensive platform for managing mobile device repairs, connecting customers with repair technicians and administrative staff.

*   **User-Facing:** Customers can submit new repair requests, track the status of existing repairs, view promotions, and learn about the company.
*   **Admin-Facing:** Administrators have a full dashboard to manage incoming requests, assign jobs to technicians, update repair statuses, and manage promotional offers.

## 2. Implemented Features & Design

### UI/UX & Styling
*   **Theme:** A modern, dark theme using a slate color palette for a professional and visually comfortable experience.
*   **Layout:** Fully responsive and clean, focusing on clarity and ease of use for both mobile and desktop users.
*   **Components:** Utilizes modern UI components with clear visual hierarchy, including interactive forms, modals, status timelines, and responsive cards.
*   **Branding:** Consistent branding with a logo and color scheme applied throughout the application.

### User Authentication
*   **Firebase Authentication:** Secure email/password and phone (OTP) authentication flows.
*   **Role-Based Access Control (RBAC):** A `role` field (`user` or `admin`) in the user's Firestore document controls access to different parts of the application.
*   **Protected Routes:** Separate routing for users and admins ensures that users cannot access administrative areas.

### Core User Features
*   **New Repair Request:** A detailed form for users to submit repair requests, including device information, issue description, and an option for in-store drop-off or home pickup.
*   **Repair Tracking:** A visual timeline allows users to track the status of their repairs from "Requested" to "Completed."
*   **Real-time Notifications:** Users receive real-time notifications for important status updates on their repairs.

### Core Admin Features
*   **Admin Dashboard:** A central hub for viewing all repair requests, sorted and searchable.
*   **Job Assignment:** Admins can assign specific repair jobs to available technicians.
*   **Status Updates:** Admins can update the status of any repair, which notifies the user in real-time.

### Offers & Promotions
*   **Admin Interface:** A dedicated section in the Admin Dashboard for creating, editing, and deleting promotions.
*   **User-Facing Page:** A dedicated `/promotions` page displays all active offers to users.
*   **Real-time Updates:** The promotions page updates in real-time based on data from Firestore, hiding expired offers automatically.

### Responsive Design Enhancements
*   **Goal:** To ensure a consistent and optimal viewing experience across all devices, from mobile phones to desktops.
*   **Home Page (`Home.jsx`):** Adjusted the hero section text alignment and button layout for better mobile readability. The "Our Services" and "Why Us" sections now use a responsive grid that stacks vertically on smaller screens.
*   **Services Page (`pages/Services.jsx`):** Created and populated the page with service details, implementing a responsive grid layout for the service cards.
*   **About Page (`pages/About.jsx`):** Fine-tuned spacing in the "Meet the Team" section to prevent crowding on smaller viewports.
*   **Promotions Page (`PromotionsPage.jsx`):** Created a new page to display active promotions, designed with a responsive grid to ensure offer cards display correctly on all screen sizes.
*   **Navigation (`Navigation.jsx` & `App.jsx`):** Added a "Services" link to the main navigation. Ensured the mobile (hamburger) menu and desktop navigation are fully responsive and consistent.

## 3. Next Steps

*   **Final Testing:** Conduct a comprehensive review of the application to ensure all features are working correctly.
*   **Deployment:** Deploy the application to Firebase Hosting.
