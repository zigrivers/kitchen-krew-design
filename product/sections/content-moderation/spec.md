# Content Moderation

## Overview

Content Moderation is the Super Admin interface for maintaining community standards across the platform. Admins review user reports, manage flagged content, handle escalations from club admins, and take platform-wide disciplinary actions against users who violate policies.

## User Flows

### Review User Reports Queue
- View queue of pending user reports sorted by priority and age
- Report categories: Harassment/abuse, Cheating/score manipulation, Inappropriate content, Spam, Impersonation, Other
- Priority levels: Low, Medium, High, Urgent
- View report details with context (reported user, reporter, content/behavior)
- Contact reported user for response
- Take action: dismiss, warn, suspend, ban
- Notify reporter of resolution
- Auto-escalate based on report volume thresholds
- SLA tracking with first response time targets and overdue alerts

### Review Flagged Content
- View queue of flagged user-generated content (profile photos, bios, club descriptions, event descriptions)
- Automatic profanity filter flags
- Manual user flags
- Approve, edit, or remove content
- Warn users about content violations
- Track repeat offenders

### Platform Review Queue (Club Escalations)
- Dedicated queue for cases escalated by Club Admins
- Case categories: Severe harassment, Threats/violence, Fraud/impersonation, Illegal activity, Pattern of abuse across clubs
- View escalation details with supporting evidence
- Access user's activity timeline across all clubs
- See previous escalations, warnings, and bans
- Add internal investigation notes
- Request more info from escalating admin
- Contact other clubs where user is member
- Resolution options: No platform action, Platform warning, Platform suspension, Platform ban

### Platform-Wide Disciplinary Actions
- **Platform Warning**: Formal warning recorded on account, email notification to user, visible to all club admins where user is member, no functionality restriction
- **Platform Suspension**: Temporary restriction (1 day to 1 year), user cannot access platform features, active registrations preserved but marked "suspended", clubs notified, appeal available via support ticket
- **Platform Ban**: Permanent removal from platform, account deactivated, email/phone blocked from creating new accounts, all club memberships terminated, match history anonymized to "Banned User", requires second Super Admin approval and 24-hour delay before execution
- All actions require reason selection (harassment, fraud, safety threat, ToS violation, other) and detailed notes
- All actions logged in audit trail

### Appeals Management
- View pending appeals submitted via support tickets
- Review original action, reason, and user's appeal statement
- Access full user history and context
- Decision options: Uphold, Modify (reduce severity), Overturn
- One appeal allowed per action
- Notify user of appeal outcome
- Track appeal success rates and patterns

## UI Requirements

### Reports Dashboard
- Queue with filters: status (new, in review, resolved), priority, category, age, assignee
- Bulk actions for similar reports
- SLA indicators showing time remaining/overdue
- Quick stats: open reports, resolved today, average resolution time

### Report Detail View
- Full report context with original content/behavior
- Reporter information and history (track false reports)
- Reported user profile summary with prior violations
- Conversation thread if contact made
- Action buttons: Dismiss, Warn, Suspend, Ban
- Internal notes visible only to admins

### Flagged Content Queue
- Thumbnail grid view for visual content (photos)
- List view for text content (bios, descriptions)
- Quick approve/reject buttons
- Expand to see full context
- Filter by content type, flag source (auto/manual)

### Platform Review Queue (Escalations)
- Case cards with severity color coding
- Summary: user, escalating club, category, date, status
- Detail panel with full investigation tools
- Evidence attachments viewer
- Cross-club activity summary
- Resolution workflow with approval chain for bans

### User Action Modal
- Action type dropdown (warning, suspension, ban)
- Reason category selection (required)
- Duration picker for suspensions
- Detailed notes field (required)
- Preview of notification to user
- Confirmation with impact summary
- For bans: second approver selection

### Appeals Panel
- Side-by-side: original action details and appeal statement
- User's history and context
- Decision buttons with required justification
- Outcome notification preview

### Moderation Dashboard
- Key metrics: Open reports, Escalations pending, Content flagged, Actions this week
- Trend charts: Reports over time, Resolution time trends
- Breakdown by category and action type
- SLA compliance percentage
- Repeat offender alerts
- Team workload distribution

### General Patterns
- Repeat offender badges on user cards
- Reporter reputation indicators (for false report detection)
- Keyboard shortcuts for power users
- Real-time updates when new reports arrive
- Dark mode support with appropriate severity colors

## Configuration

- shell: true
