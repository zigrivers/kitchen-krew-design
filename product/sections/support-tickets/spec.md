# Support Tickets Section Specification

## Overview
Support Tickets is the Super Admin interface for managing user support requests across the platform. Admins can view ticket queues, assign tickets to team members, respond to users, track SLA compliance, and maintain quality through satisfaction surveys and canned responses.

## User Flows

### Ticket Queue Management
- View all tickets with filters (status, priority, category, assignee)
- Sort by created date, last updated, SLA deadline
- Quick filters: unassigned, overdue, awaiting response, starred
- Bulk actions: assign, change priority, merge duplicates
- Search tickets by ID, user email, or keywords

### Ticket Categories
- Account issues (login, password, profile problems)
- Event problems (registration, check-in, scoring disputes)
- Technical bugs (app crashes, features not working)
- Billing questions (payments, refunds, subscriptions)
- Report abuse (harassment, inappropriate content)
- Feature requests (suggestions for improvements)

### Ticket Detail View
- User information with account status and history
- Full conversation thread with timestamps
- Internal notes visible only to admins
- Attached files and screenshots from user
- Related tickets from same user
- Quick actions: assign, escalate, merge, close

### Response Tools
- Canned responses for common issues (library of templates)
- Rich text editor with formatting
- Attach files/images to responses
- Insert knowledge base article links
- Internal notes vs public replies toggle
- Preview response before sending

### SLA Tracking
- Response time targets by priority level:
  - Urgent: 1 hour first response
  - High: 4 hours first response
  - Normal: 24 hours first response
  - Low: 48 hours first response
- Resolution time targets by category
- Visual indicators: green (on track), yellow (at risk), red (breached)
- SLA breach alerts with escalation

### Assignment & Workload
- Assign tickets to team members
- View team member workload (ticket counts)
- Auto-assignment rules by category
- Reassign overdue tickets
- Out-of-office/vacation coverage

### Resolution & Satisfaction
- Resolution types: solved, duplicate, cannot reproduce, won't fix, feature shipped
- Satisfaction survey sent after resolution (1-5 stars + comment)
- View satisfaction scores by agent and category
- Reopen ticket from survey feedback

### Reporting Dashboard
- Tickets created vs resolved over time
- Average response and resolution times
- SLA compliance percentage
- Satisfaction score trends
- Top categories by volume
- Agent performance metrics

## UI Requirements
- Ticket list with status badges, priority indicators, and SLA countdown
- Split-pane detail view (conversation left, context right)
- Quick reply bar at bottom of conversation
- Canned response picker with search
- User profile card with support history
- SLA timeline visualization
- Team workload bar chart
- Category breakdown pie chart
- Satisfaction trend sparklines
- Filter presets for common views

## Screens
1. **Support Dashboard** - Overview with key metrics, charts, recent tickets
2. **Ticket Queue** - Filterable list with status tabs and SLA indicators
3. **Ticket Detail** - Conversation view with context sidebar
4. **Canned Responses** - Library management for response templates
5. **Reports** - SLA compliance, satisfaction trends, agent performance

## Configuration
- shell: true
