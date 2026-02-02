# User Management Specification

## Overview
The User Management section provides tools for managing users at two levels: Club Admins can manage members within their club (notes, warnings, suspensions, bans), while Super Admins have platform-wide tools to search all users, investigate activity, process compliance requests (GDPR/CCPA), and take platform-wide moderation actions. Club Admins can escalate severe cases to Super Admin review.

## User Flows

### Club Admin (Club-Scoped)
- View player's club profile with activity summary, notes, and warning history
- Add private notes about players (General, Positive, Concern, Incident categories)
- Issue formal warnings with incident details and expected corrective action
- Suspend members temporarily (1 day to 1 year) or ban permanently
- Escalate severe cases to Super Admin platform review

### Super Admin (Platform-Wide)
- Search and filter all users by multiple criteria (name, email, status, role, date ranges)
- View detailed user profile with complete activity timeline
- Review escalated cases from club admins in Platform Review Queue
- Issue platform warnings, suspensions, or bans (with dual-approval for bans)
- Reset user passwords, merge duplicate accounts, impersonate for debugging
- Process GDPR/CCPA data export and deletion requests
- Add admin notes visible across the platform

## UI Requirements

### Club Admin Views
- Player club profile panel with activity summary, notes list, warning history
- Note editor with category selection and chronological display
- Warning/suspension/ban modal with reason selection and documentation
- Escalation form with evidence attachment for severe cases

### Super Admin Views
- Advanced search panel with multi-criteria filters and saved presets
- User list table with sortable columns, status badges, bulk actions
- User detail view with tabbed sections (profile, timeline, clubs, reports, notes)
- Activity timeline with filterable event types and date ranges
- Platform Review Queue for escalated cases with investigation tools
- Moderation action modal with reason selection, notes, and approval workflow
- GDPR compliance workflow with data export and deletion tracking

## Configuration
- shell: true
