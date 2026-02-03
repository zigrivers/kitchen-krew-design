# Club Management Specification

## Overview
Club Management is the Super Admin dashboard for overseeing all clubs on the platform. Admins can browse clubs, handle disputes, review non-profit applications, override subscription tiers, respond to escalations from club admins, and take platform-wide action against bad actors.

## User Flows

### Club Oversight
- List all clubs with filters (status, tier, location, activity level)
- View club details including members, events, and activity metrics
- Search clubs by name, owner email, or ID
- Suspend clubs for policy violations
- Remove/delete fraudulent or abandoned clubs
- Transfer club ownership between users

### Non-Profit Review
- Queue of pending Community Impact tier applications
- View application details (org name, type, documentation, email domain)
- Use verification tools (IRS lookup, TechSoup, WHOIS)
- Approve, request more info, or reject with reason
- Set annual re-verification reminders
- Bulk process similar applications

### Subscription Overrides
- Override any club's subscription tier (Free, Pro, Elite, Community Impact)
- Require reason for audit trail
- Set permanent or time-limited overrides
- View list of all active overrides
- Alert before time-limited overrides expire

### Ownership Disputes
- Dispute queue for venue and club ownership conflicts
- View submitted evidence from both parties
- Contact parties and request documentation
- Resolution options: transfer, co-admin, reject, delete, merge
- One appeal allowed per dispute

### Platform Escalations
- Queue of users escalated by Club Admins
- View case summary with escalation reason and evidence
- See user's activity across all clubs and previous escalations
- Investigation tools: add notes, request info, contact other clubs
- Resolution: no action, platform warning, suspension, or ban

### Suspicious Activity
- Alerts for rapid club creation, duplicate names, spam behavior
- One-click investigation to open relevant entity
- Quick actions: suspend, request verification, mark false positive

### Rate Limit Management
- Configure max clubs/venues per user
- Set minimum account age requirements
- Grant exceptions for legitimate power users
- View users approaching limits

## UI Requirements
- Club list with sortable columns and multi-filter search
- Club detail view with tabs (overview, members, events, activity, notes)
- Non-profit application review cards with verification tool links
- Dispute timeline view with party communications
- Escalation case view with cross-club user history
- Suspicious activity alert cards with severity badges
- Override management table with expiration countdowns
- Quick action buttons for common admin tasks
- Audit trail sidebar on all admin actions

## Configuration
- shell: true
