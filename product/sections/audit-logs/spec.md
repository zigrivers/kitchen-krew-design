# Audit Logs

## Overview

Audit Logs is the Super Admin interface for tracking and reviewing all administrative actions across the platform. It provides a comprehensive, searchable history of who did what, when, and to which resources—essential for security compliance, dispute resolution, and accountability.

## User Flows

### Browse Audit History
- View chronological list of all audit events
- See event type, actor, target resource, timestamp, and IP address
- Quick filters: Today, Last 7 days, Last 30 days, Custom range
- Color-coded severity levels (info, warning, critical)

### Advanced Filtering
- Filter by date range (start/end date pickers)
- Filter by user (who performed the action)
- Filter by action type (create, update, delete, login, escalate, etc.)
- Filter by entity type (User, Event, Score, Permission, Subscription, etc.)
- Filter by resource ID (specific record lookup)
- Filter by IP address (for security investigations)
- Combine multiple filters for precise queries

### Event Detail View
- Full details of the audit event
- Before/after values for data changes (diff view)
- Related events (same session, same resource)
- Actor's context (role, permissions at time of action)
- Exportable event details

### Security Investigations
- Track user impersonation sessions
- Monitor failed login attempts
- Review permission escalations
- Identify suspicious IP patterns
- Bulk operation tracking

### Reporting & Export
- Export filtered results to CSV/JSON
- Summary statistics by time period
- Activity heatmap by hour/day
- Top actors by action count
- Most modified resources

## Audited Operations

The following actions are tracked in the audit log:

### User Management
- Account creation, updates, and deletion
- Role and permission changes
- Account suspension and reactivation
- Password resets and email changes

### Score Management
- Score entry and modifications
- Score corrections with reasons
- Dispute resolution decisions
- Match result overrides

### Event Management
- Event creation and modification
- Event cancellation with reasons
- Bracket and pool changes
- Registration overrides

### Permission Changes
- Role assignments and revocations
- Access grants and revokes
- Permission escalations
- Team member additions/removals

### Financial Operations
- Subscription overrides
- Refund processing
- Payment adjustments
- Promo code applications

### System Operations
- Backup and restore operations
- Configuration changes
- Feature flag toggles
- Scheduled task modifications

### Security Events
- Login attempts (success and failure)
- Password reset requests
- User impersonation sessions (start/end)
- API key generation and revocation

### Bulk Operations
- Mass user updates
- Batch imports
- Bulk email sends
- Data migrations

### Support & Escalations
- Ticket escalations
- Conflict resolutions
- Manual overrides
- Administrative decisions

## UI Requirements

### Audit Log Viewer (Main List)
- Compact event list with expandable rows for quick preview
- Columns: Timestamp, Severity, Action, Actor, Entity Type, Resource, IP
- Severity badges: info (blue), warning (amber), critical (red)
- Expandable row shows before/after summary
- Sticky header with filter controls
- Infinite scroll or pagination with page size selector
- Quick copy buttons for IDs and values
- Keyboard shortcuts for navigation

### Filter Panel
- Collapsible advanced filters
- Date range picker with presets (Today, 7d, 30d, Custom)
- User search with autocomplete
- Action type multi-select dropdown
- Entity type multi-select dropdown
- Resource ID text input
- IP address text input with CIDR support
- "Clear all" and "Apply" buttons
- Save filter as preset functionality

### Event Detail View
- Split or modal layout
- Full event metadata display
- Before/after diff view with syntax highlighting
- Related events timeline
- Actor profile card with role at time of action
- Export single event button
- Link to related resource (if accessible)

### Security Dashboard
- Key metrics: Total events, Failed logins, Escalations, Impersonations
- Activity heatmap (hour × day matrix)
- Failed login attempts chart (time series)
- Top actors by action count (bar chart)
- Recent critical events list
- Suspicious pattern alerts

### General UI Patterns
- Real-time updates indicator (optional auto-refresh)
- Responsive table with horizontal scroll on mobile
- Dark mode support with appropriate severity colors
- Loading skeletons for async data
- Empty states with helpful guidance
- Error states with retry options

## Configuration

- shell: true
