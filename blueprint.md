# Blueprint: DIGI Mobile Repair Shop

This document outlines the architecture, features, and implementation plan for the DIGI Mobile Repair Shop application.

## 1. Core Purpose & Capabilities

The application is a comprehensive platform for managing mobile device repairs, connecting customers with repair technicians and administrative staff.

*   **User-Facing:** Customers can submit new repair requests, track the status of existing repairs, and communicate with support.
*   **Admin-Facing:** Administrators have a full dashboard to manage incoming requests, assign jobs to technicians, update repair statuses, and oversee the entire workflow.

## 2. Implemented Features & Design

### UI/UX & Styling
*   **Theme:** A modern, dark theme using a slate color palette for a professional and visually comfortable experience.
*   **Layout:** Responsive and clean, focusing on clarity and ease of use for both mobile and desktop users.
*   **Components:** Utilizes modern UI components with clear visual hierarchy, including interactive forms, modals, and status timelines.

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
*   **Customer & Technician Management:** (Future) Sections for managing user and technician profiles.

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

### New Repair Request Form Features
*   **In-Store vs. Home Pickup:** A toggle switch allows users to select their preferred repair mode.
*   **Conditional Fields:** The form dynamically shows and hides fields based on the selected mode (e.g., address fields for home pickup).
*   **Geolocation:** For home pickups, users can share their current location with a single click to generate a Google Maps URL.

## 3. Current Task: Advanced Time Slot Booking System

This task implements a shared and robust time slot booking system for repair drop-offs.

### Logic Flow & Requirements
*   **Data Source:** A new `timeSlots` collection in Firestore will store daily slot availability.
*   **Working Hours:** Slots will be generated from 10:00 AM to 7:00 PM.
*   **Interval:** Each slot will be 30 minutes.
*   **No Past Slots:** The system will automatically prevent booking of slots that are in the past.
*   **No Double Booking:** A slot cannot be booked if it has reached its maximum capacity.
*   **Shared Data:** Both users and admins will see the same availability data in real-time.

### Firestore Data Structure
*   **Collection:** `timeSlots`
*   **Document ID:** A unique ID for each slot (e.g., `2024-08-01_10:30`).
*   **Fields:**
    *   `timestamp` (Firestore Timestamp): The exact start time of the slot.
    *   `capacity` (Number): The maximum number of bookings allowed for this slot (e.g., 2).
    *   `booked` (Number): The current number of bookings for this slot.

### React Implementation (`TimeSlotPicker.jsx`)
*   **Admin View (`isAdmin` prop = `true`):**
    *   The component will display ALL time slots for a given day.
    *   Each slot will show its status (e.g., "1/2 Booked", "Full").
    *   Admins can select any slot, even if full, to override or adjust bookings.
*   **User View (`isAdmin` prop = `false`):**
    *   The component will ONLY display available slots.
    *   Past slots and full slots will be hidden and disabled.

### Firestore Security Rules
*   **Read:** All authenticated users will have read-only access to the `timeSlots` collection to check availability.
*   **Update:** Only authenticated users can update a time slot document, and the update is restricted to only allow incrementing the `booked` count by 1. This prevents malicious updates. Admins will have full write access.
