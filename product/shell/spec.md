# Application Shell Specification

## Overview
KitchenKrew uses a sidebar navigation pattern optimized for dashboard-style interactions. The shell provides persistent access to all five main sections while keeping the focus on content. The sidebar collapses to a hamburger menu on mobile devices for on-court usability.

## Navigation Structure

### Player Navigation (All Users)
- **Events** → Default/home view, event discovery and management
- **Live Play** → Active game dashboard with court assignments and scoring
- **Players** → Player profiles, search, and friend management
- **Clubs & Venues** → Club membership, venue details, and court info
- **Stats & Leaderboards** → Performance statistics and rankings

### Admin Navigation (Super Admins Only)
A separate section appears below the player navigation, visually distinguished by a divider and section header. Only visible when `userRole === 'super_admin'`.

- **User Management** → View/search all users, edit profiles, suspend/delete accounts
- **Club Management** → Oversee all clubs, approve/reject clubs, manage club admins
- **Support Tickets** → View and respond to user support requests
- **Audit Logs** → Review system activity, security events, and administrative actions
- **Content Moderation** → Review flagged content, handle reports, enforce policies
- **System Settings** → Configure platform-wide settings, feature flags, integrations

## User Menu
Located at the bottom of the sidebar, the user menu displays:
- Player avatar (or initials fallback)
- Player display name
- Role badge (shows "Super Admin" for super_admin users)
- Dropdown with: Settings, Help, Logout

## Layout Pattern
**Sidebar Navigation**
- Fixed sidebar on the left (240px width on desktop)
- Main content area fills remaining horizontal space
- Sidebar contains: Logo, navigation items, user menu at bottom
- Content area has its own scroll context

## Responsive Behavior
- **Desktop (1024px+):** Full sidebar always visible, 240px width
- **Tablet (768px-1023px):** Collapsible sidebar with toggle button in header
- **Mobile (<768px):** Hamburger menu in top header, sidebar slides in as overlay from left

## Design Notes
- Active nav item highlighted with lime accent (left border + background tint)
- Hover states use subtle lime background
- Sidebar background uses slate-900 in dark mode, white in light mode
- Icons from lucide-react accompany each nav label
- Logo appears at top of sidebar with app name "KitchenKrew"
- Smooth transitions (200ms) for sidebar open/close on mobile
- Admin section uses sky accent color to distinguish from player navigation
- Admin section header styled in muted slate with uppercase text
