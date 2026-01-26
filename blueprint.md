# Blueprint: DIGI Mobile Repair Shop

This document outlines the architecture, features, and implementation plan for the DIGI Mobile Repair Shop application.

## 1. Core Purpose & Capabilities

The application is a comprehensive platform for managing mobile device repairs, connecting customers with repair technicians, delivery partners, and administrative staff.

*   **User-Facing:** Customers can submit new repair requests, track the status of existing repairs, view promotions, and learn about the company.
*   **Admin-Facing:** Administrators have a full dashboard to manage incoming requests, assign jobs, manage delivery partners, and oversee the entire repair lifecycle.
*   **Delivery-Facing:** Delivery Partners have a streamlined mobile interface to manage assigned pickup and delivery tasks.

## 2. General Architecture & Design

### UI/UX & Styling
*   **Theme:** A modern, dark theme using a slate color palette for a professional and visually comfortable experience.
*   **Layout:** Fully responsive and clean, focusing on clarity and ease of use for all roles across mobile and desktop.
*   **Components:** Utilizes modern UI components with clear visual hierarchy.
*   **Branding:** Consistent branding with a logo and color scheme applied throughout the application.

### User Authentication & Data Model
*   **Firebase Authentication:** Secure email/password and phone (OTP) authentication flows.
*   **Role-Based Access Control (RBAC):** A `role` field (`user`, `admin`, or `delivery`) in the user's Firestore document controls access.
*   **Protected Routes:** Separate routing for each role ensures users can only access their designated areas.
*   **Data Model:** Core collections include `users`, `repairs`, `promotions`, and `notifications`.

---

## 3. Role: Admin Dashboard

This section details the features and UI for the Admin role.

### 3.1. Core Repair Management
*   **Admin Dashboard:** A central hub for viewing and managing all repair requests.
*   **Job Assignment:** Admins can assign pickup, repair, and delivery jobs to technicians and delivery partners.
*   **Status Updates:** Admins can update the status of any repair, which notifies the user in real-time.
*   **Offers & Promotions:** A dedicated section to create, edit, and delete promotional offers.

### 3.2. Delivery Partner Integration & Management

This outlines the integration of delivery partner management into the Admin Dashboard, designed to be backward-compatible.

#### 3.2.1. Data Model Extensions
*   **`repairs` Collection:** The `repairs` document schema is extended with a new `delivery` object. This avoids altering core repair fields.
    ```json
    "delivery": {
      "deliveryPartnerId": "delivery-partner-xyz",
      "deliveryPartnerName": "John Doe",
      "status": "Scheduled for Pickup", // Detailed status: e.g., 'Picked Up', 'Out for Delivery', 'Delivered', 'Failed Pickup'
      "pickupSchedule": { "date": "YYYY-MM-DD", "timeSlot": "HH:MM - HH:MM", "priority": "High" },
      "deliverySchedule": { "date": "YYYY-MM-DD", "timeSlot": "HH:MM - HH:MM" },
      "payment": { "amount": 55.50, "method": "COD", "status": "Pending" },
      "activityLog": [
        { "timestamp": "...", "action": "Delivery partner assigned by admin." }
      ]
    }
    ```
*   **`users` Collection:** Users with `role: 'delivery'` are managed here. A new field is added:
    *   `enabled: boolean`: Allows admins to activate or deactivate partners without deletion.

#### 3.2.2. UI/UX Specification

*   **Sidebar Navigation:**
    *   A new item, **"Delivery Partners"**, will be added, leading to `/admin/delivery-partners`.

*   **Delivery Partners Page (`/admin/delivery-partners`):**
    *   **UI:** A full-page table listing all users with the `'delivery'` role.
    *   **Columns:** `Name`, `Email`, `Phone`, `Status (Enabled/Disabled)`, `Actions`.
    *   **Page Actions:** A primary "**+ Add New Partner**" button opens a creation **modal**.
    *   **Row Actions:** Each row will feature an "**Edit**" button (opens a management **modal**) and a prominent "**Enable/Disable**" toggle switch for quick status changes.

*   **Main Repairs Table (`/admin/dashboard`):**
    *   **New Columns:**
        *   `Delivery Partner`: Displays the assigned partner's name. Clickable to filter by partner.
        *   `Delivery Status`: Shows the real-time status from the `delivery.status` field.
    *   **New Filters:**
        *   Dropdowns above the table: "**Filter by Delivery Partner**" and "**Filter by Delivery Status**".
    *   **Row Actions (`...` menu):**
        *   A new option, "**Assign Delivery**", will be added. This is the central point of action.

*   **Assign/Manage Delivery Modal:**
    *   **Context:** Opened by clicking "**Assign Delivery**". It handles initial assignment, reassignment, and managing failed pickups/deliveries.
    *   **Controls:**
        *   Dropdown to select an *enabled* Delivery Partner.
        *   Date and time-slot pickers for scheduling.
        *   "Priority" toggle.
        *   Payment/COD amount field (read-only for re-assignments).
        *   A "**Confirm Assignment**" button to save changes and trigger notifications.

*   **Repair Details View:**
    *   A new "**Delivery Tracking**" section will display the `delivery.activityLog` as a read-only, timestamped timeline of events.

#### 3.2.3. Functional Requirements
*   **Admin Control:** Full CRUD on delivery partners and their assignments.
*   **Scheduling:** Admin sets pickup/delivery date, time, and priority.
*   **Real-time Tracking:** The `delivery.status` field provides live updates.
*   **Audit Trail:** The `delivery.activityLog` provides timestamps for every delivery action.
*   **Payment Visibility:** Admins manage COD amounts; partners have read-only access.
*   **Failure Handling:** Admins can reassign partners or reschedule from the "Assign/Manage Delivery Modal".
*   **Notifications:** Assigning or reassigning a job automatically triggers a notification to the relevant delivery partner.

---

## 4. Role: Delivery Partner Dashboard

This section details the features, UI, and workflow for the new **Delivery Partner** role, designed to be a simple, mobile-first experience.

### 4.1. Core Principles
*   **Backward-Compatible:** Extends the system without altering existing `user` or `admin` logic.
*   **Mobile-First:** Designed as a lightweight PWA for use on low-end smartphones.
*   **Task-Oriented:** The UI is focused on the core tasks: viewing assigned jobs, navigating to customers, and updating delivery-related statuses.
*   **Secure:** Delivery Partners can only view and modify information related to their assigned jobs.

### 4.2. Functional Requirements
*   **View Assigned Jobs:** See a clear list of active pickup and delivery tasks assigned to them.
*   **Navigation:** One-tap to open the customer's address in Google Maps.
*   **Communication:** One-tap to call the customer directly.
*   **Status Updates:** Ability to update job status for key delivery milestones (`Picked Up`, `Out for Delivery`, `Delivered`, `Failed`).
*   **Payment Info:** View the final amount to be collected (read-only).
*   **Job History:** See a list of all completed pickups and deliveries.
*   **Notifications:** Receive push notifications for newly assigned jobs or updates.

### 4.3. Delivery Workflow & Status Updates
The Delivery Partner can only update a specific subset of statuses:

1.  **Pickup Workflow:**
    *   **Initial State:** An admin assigns a new pickup request to a Delivery Partner. The job status is **`Pending`**.
    *   **Delivery Partner Action:** The Partner sees the job, travels to the customer, and collects the device. They then tap the **`Picked Up`** button.
    *   **System Update:** The repair status changes to **`Picked Up`**. The user and admin are notified.

2.  **Delivery Workflow:**
    *   **Initial State:** A repair is finished and the admin assigns it to a Delivery Partner for return. The job status is **`Ready for Delivery`**.
    *   **Delivery Partner Action:** The Partner picks up the device from the shop and taps **`Out for Delivery`**.
    *   **System Update:** The status changes to **`Out for Delivery`**. The user is notified that their device is on its way.
    *   **Delivery Partner Action:** After delivering the device and collecting payment (if applicable), the Partner taps **`Completed`**.
    *   **System Update:** The status changes to **`Completed`**. The job is moved to the Partner's history.

### 4.4. Screen-by-Screen UI Design (Mobile-First)

*   **Login Page:**
    *   Uses the **exact same** existing login screen (`/login`).
    *   After successful login, the system checks the user's `role` and redirects them to the appropriate dashboard (`/admin` for admins, `/` for users, and `/delivery` for partners).

*   **Delivery Partner Dashboard (Default Screen):**
    *   **Header:** "Active Jobs"
    *   **Layout:** A simple, scrollable list of job cards. Each card is a summary.
    *   **Job Card UI:**
        *   **Type:** A clear "PICKUP" or "DELIVERY" tag.
        *   **Customer Name & Phone:** e.g., "John Doe - ★★★★★"
        *   **Address:** "123 Main St, Anytown" (truncated).
        *   **Due Time:** e.g., "Pickup by 4:30 PM".
        *   **Status Badge:** e.g., `Pending Pickup`, `Ready for Delivery`.

*   **Job Details Screen:**
    *   **Header:** "Pickup Details" or "Delivery Details".
    *   **Map View:** A small, embedded map showing the customer's location.
    *   **Customer Info:**
        *   Full Name
        *   **Address:** Full address with a prominent "Navigate" button (opens Google Maps).
        *   **Phone:** Phone number with a "Call Customer" button (initiates a phone call).
    *   **Device Info:** "Device: iPhone 14 Pro", "Issue: Screen Replacement".
    *   **Payment Section (Read-Only):**
        *   "Amount to Collect: ₹4,500"
        *   "Payment Method: Cash on Delivery"
    *   **Action Button:** A single, large button at the bottom of the screen, e.g., **"Confirm Pickup"** or **"Start Delivery"**.

*   **History Screen:**
    *   **Header:** "Completed Jobs"
    *   **Layout:** A list of past jobs, similar to the dashboard but with less detail.
    *   **History Card UI:** "DELIVERY to Jane Smith - 24/01/2026 - Completed".

*   **Profile Screen:**
    *   **Header:** "My Profile"
    *   **Info:** Displays the partner's name and email.
    *   **Action:** A "Sign Out" button.
