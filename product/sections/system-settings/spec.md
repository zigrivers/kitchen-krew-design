# System Settings

## Overview

System Settings is the Super Admin interface for configuring platform-wide defaults, feature toggles, integrations, and maintenance schedules. This section allows admins to customize platform behavior without code changes.

## User Flows

### Configure Default Settings
- Set platform-wide defaults for events (scoring rules, game formats, registration settings)
- Configure default notification timing and templates
- Set new user onboarding defaults (profile completion requirements, welcome messages)
- Define default privacy settings for new accounts

### Manage Feature Flags
- Enable/disable features across the platform
- Feature categories: Core features, Beta features, Deprecated features
- Per-feature configuration: On/Off, Percentage rollout, User group targeting
- Feature flag examples: SMS notifications, payment processing, specific game formats, offline mode, achievements
- Preview mode: Enable features for admin testing before public release

### Configure Rate Limits
- API rate limits by endpoint category
- User action limits: Club/venue creation per user, event creation per day
- Communication limits: Max emails per day, SMS rate caps
- Registration limits: Max registrations per user per day
- Abuse prevention thresholds with automatic alerts

### Manage Integrations
- DUPR: Configure sync frequency, API credentials, connection status
- Stripe: Payment processing settings, fee configuration, webhook status
- SendGrid: Email delivery configuration, template management, delivery stats
- Google Maps: API key management, usage monitoring
- Calendar providers: Google Calendar, Apple Calendar integration settings
- Webhook endpoints: Configure outbound webhooks for external systems (Phase 3)

### Schedule Maintenance
- Toggle maintenance mode (immediate or scheduled)
- Schedule maintenance windows with advance notice period
- Configure maintenance banner message (customizable text)
- Set allowed IP addresses for admin access during maintenance
- Automatic notifications to users before scheduled maintenance
- Emergency maintenance mode with instant activation

### Configure Roles & Permissions
- View all system roles with current permissions matrix
- Edit permissions for each role (feature access, data visibility, actions)
- Create custom roles for special needs (e.g., Regional Manager, Support Staff)
- Role hierarchy visualization
- Permission audit: See who has access to what
- Changes logged in audit trail

## UI Requirements

### Settings Dashboard
- Category navigation sidebar (General, Features, Limits, Integrations, Maintenance, Roles)
- Search settings functionality
- Quick access to recently modified settings
- Environment indicator badge (Production/Staging/Development)

### General Settings Panel
- Grouped form sections with collapsible categories
- Input validation with helpful error messages
- "Reset to default" option per setting
- Save confirmation with summary of changes

### Feature Flags Panel
- Toggle switches with clear on/off visual states
- Feature descriptions explaining what each flag controls
- Dependency warnings (e.g., "Disabling X will also disable Y")
- Rollout percentage slider for gradual releases
- User group targeting selector
- Last modified timestamp and by whom

### Rate Limits Panel
- Numeric inputs with min/max validation
- Current usage statistics alongside limits
- Visual indicators when limits are frequently hit
- "Test limit" functionality for verification

### Integrations Panel
- Status cards per integration showing:
  - Connection health (green/yellow/red indicator)
  - Last successful sync timestamp
  - Error count in last 24 hours
- "Test Connection" button per integration
- Credentials management (masked display, secure update)
- Sync logs with recent activity
- Manual sync trigger buttons

### Maintenance Panel
- Large toggle for maintenance mode
- Datetime picker for scheduled maintenance
- Preview of maintenance banner as users will see it
- Rich text editor for maintenance message
- IP allowlist management for admin access
- Countdown display for scheduled maintenance

### Roles & Permissions Panel
- Permission matrix grid (roles × permissions)
- Expandable role details showing all granted permissions
- Visual diff when editing permissions
- "Clone role" functionality for creating similar roles
- Impact preview: Show affected users before saving changes

### General Patterns
- All changes require confirmation before saving
- Settings change history with timestamps and actor
- Rollback capability to previous configuration
- Export/import settings for environment migration
- Dark mode support with clear form contrast

## Configuration

- shell: true
