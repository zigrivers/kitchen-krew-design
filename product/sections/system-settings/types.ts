// =============================================================================
// Data Types
// =============================================================================

// General Settings
export interface EventDefaults {
  defaultScoringFormat: 'rally' | 'sideout' | 'traditional'
  defaultGameFormat: 'singles' | 'doubles' | 'mixed_doubles'
  defaultRegistrationDeadline: number // hours before event
  defaultMinPlayers: number
  defaultMaxPlayers: number
  allowWaitlist: boolean
  requireSkillLevel: boolean
}

export interface NotificationDefaults {
  eventReminderHours: number[]
  registrationConfirmation: boolean
  matchResultNotification: boolean
  weeklyDigest: boolean
  defaultEmailEnabled: boolean
  defaultPushEnabled: boolean
  defaultSmsEnabled: boolean
}

export interface OnboardingDefaults {
  requireProfilePhoto: boolean
  requireSkillLevel: boolean
  requireLocation: boolean
  welcomeMessageEnabled: boolean
  welcomeMessageTemplate: string
  suggestNearbyClubs: boolean
}

export interface PrivacyDefaults {
  defaultProfileVisibility: 'public' | 'members' | 'private'
  defaultShowRating: boolean
  defaultShowMatchHistory: boolean
  allowAnonymousViewing: boolean
}

export interface GeneralSettings {
  events: EventDefaults
  notifications: NotificationDefaults
  onboarding: OnboardingDefaults
  privacy: PrivacyDefaults
}

// Feature Flags
export interface FeatureFlag {
  id: string
  key: string
  name: string
  description: string
  category: 'core' | 'beta' | 'deprecated'
  enabled: boolean
  rolloutPercentage: number
  targetGroups: string[]
  dependencies: string[]
  lastModified: string
  modifiedBy: string
}

// Rate Limits
export interface RateLimit {
  id: string
  category: 'api' | 'user_action' | 'communication' | 'registration' | 'abuse_prevention'
  name: string
  description: string
  limit: number
  period: 'minute' | 'hour' | 'day' | 'lifetime'
  currentUsage: number
  peakUsage: number
  breachCount24h: number
  alertThreshold: number
}

// Integrations
export interface IntegrationLog {
  timestamp: string
  message: string
  level: 'info' | 'warning' | 'error'
}

export interface IntegrationCredentials {
  apiKey?: string
  webhookSecret?: string
  clientId?: string
  clientSecret?: string
  configured: boolean
}

export interface Integration {
  id: string
  key: string
  name: string
  description: string
  status: 'healthy' | 'degraded' | 'error' | 'disconnected'
  lastSync: string
  syncFrequency: 'realtime' | 'hourly' | 'daily' | 'weekly' | 'on_demand'
  errorsLast24h: number
  credentials: IntegrationCredentials
  settings: Record<string, unknown>
  recentLogs: IntegrationLog[]
}

// Maintenance
export interface ScheduledMaintenance {
  enabled: boolean
  startTime: string
  endTime: string
  noticeHours: number
  notificationSent: boolean
}

export interface EmergencyContact {
  name: string
  email: string
  phone: string
}

export interface MaintenanceConfig {
  isMaintenanceMode: boolean
  scheduledMaintenance: ScheduledMaintenance
  bannerMessage: string
  allowedIPs: string[]
  emergencyContacts: EmergencyContact[]
}

// Roles & Permissions
export interface Permission {
  key: string
  name: string
  category: string
  description: string
}

export interface Role {
  id: string
  key: string
  name: string
  description: string
  isSystem: boolean
  hierarchy: number
  userCount: number
  permissions: string[]
  createdAt: string
  modifiedAt: string
}

// Settings History
export interface SettingsChange {
  id: string
  timestamp: string
  actor: string
  actorId: string
  category: 'general' | 'feature_flags' | 'rate_limits' | 'integrations' | 'maintenance' | 'roles'
  setting: string
  action: 'created' | 'updated' | 'deleted'
  previousValue: unknown
  newValue: unknown
  reason?: string
}

// Admin
export interface Admin {
  id: string
  name: string
  email: string
  role: string
  avatar: string
  lastActive: string
}

// =============================================================================
// Component Props
// =============================================================================

export interface SettingsDashboardProps {
  /** Current environment indicator */
  environment: 'production' | 'staging' | 'development'
  /** List of admins with access */
  admins: Admin[]
  /** General platform settings */
  generalSettings: GeneralSettings
  /** Feature flags configuration */
  featureFlags: FeatureFlag[]
  /** Rate limit configurations */
  rateLimits: RateLimit[]
  /** Third-party integrations */
  integrations: Integration[]
  /** Maintenance configuration */
  maintenanceConfig: MaintenanceConfig
  /** Recent settings changes */
  settingsHistory: SettingsChange[]
  /** Called when navigating to a settings category */
  onNavigateCategory?: (category: string) => void
  /** Called when searching settings */
  onSearch?: (query: string) => void
}

export interface GeneralSettingsPanelProps {
  /** Current general settings */
  settings: GeneralSettings
  /** Called when a setting is updated */
  onUpdate?: (path: string, value: unknown) => void
  /** Called when resetting a setting to default */
  onResetToDefault?: (path: string) => void
  /** Called when saving all changes */
  onSave?: () => void
}

export interface FeatureFlagsPanelProps {
  /** List of feature flags */
  featureFlags: FeatureFlag[]
  /** Called when toggling a feature flag */
  onToggle?: (id: string, enabled: boolean) => void
  /** Called when updating rollout percentage */
  onUpdateRollout?: (id: string, percentage: number) => void
  /** Called when updating target groups */
  onUpdateTargetGroups?: (id: string, groups: string[]) => void
  /** Called when viewing feature details */
  onViewDetails?: (id: string) => void
}

export interface RateLimitsPanelProps {
  /** List of rate limits */
  rateLimits: RateLimit[]
  /** Called when updating a rate limit */
  onUpdate?: (id: string, limit: number, alertThreshold: number) => void
  /** Called when testing a rate limit */
  onTest?: (id: string) => void
  /** Called when viewing limit details */
  onViewDetails?: (id: string) => void
}

export interface IntegrationsPanelProps {
  /** List of integrations */
  integrations: Integration[]
  /** Called when testing a connection */
  onTestConnection?: (id: string) => void
  /** Called when triggering a manual sync */
  onManualSync?: (id: string) => void
  /** Called when updating credentials */
  onUpdateCredentials?: (id: string) => void
  /** Called when updating integration settings */
  onUpdateSettings?: (id: string, settings: Record<string, unknown>) => void
  /** Called when viewing sync logs */
  onViewLogs?: (id: string) => void
}

export interface MaintenancePanelProps {
  /** Current maintenance configuration */
  config: MaintenanceConfig
  /** Called when toggling maintenance mode */
  onToggleMaintenanceMode?: (enabled: boolean) => void
  /** Called when scheduling maintenance */
  onScheduleMaintenance?: (startTime: string, endTime: string, noticeHours: number) => void
  /** Called when updating the banner message */
  onUpdateBannerMessage?: (message: string) => void
  /** Called when updating allowed IPs */
  onUpdateAllowedIPs?: (ips: string[]) => void
  /** Called when activating emergency maintenance */
  onEmergencyMaintenance?: () => void
}

export interface RolesPermissionsPanelProps {
  /** List of roles */
  roles: Role[]
  /** List of all available permissions */
  permissions: Permission[]
  /** Called when updating a role's permissions */
  onUpdateRolePermissions?: (roleId: string, permissions: string[]) => void
  /** Called when creating a new role */
  onCreateRole?: (role: Omit<Role, 'id' | 'createdAt' | 'modifiedAt'>) => void
  /** Called when cloning a role */
  onCloneRole?: (roleId: string) => void
  /** Called when viewing role details */
  onViewRoleDetails?: (roleId: string) => void
  /** Called when viewing permission audit */
  onViewPermissionAudit?: () => void
}

export interface SettingsHistoryPanelProps {
  /** List of settings changes */
  history: SettingsChange[]
  /** Called when rolling back to a previous configuration */
  onRollback?: (changeId: string) => void
  /** Called when viewing change details */
  onViewDetails?: (changeId: string) => void
  /** Called when filtering history */
  onFilter?: (category?: string, actor?: string) => void
  /** Called when loading more history */
  onLoadMore?: () => void
}
