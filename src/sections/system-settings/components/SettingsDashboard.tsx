import { useState } from 'react'
import type {
  SettingsDashboardProps,
  FeatureFlag,
  RateLimit,
  Integration,
  SettingsChange,
  Admin,
} from '@/../product/sections/system-settings/types'

// =============================================================================
// Sub-Components
// =============================================================================

interface EnvironmentBadgeProps {
  environment: 'production' | 'staging' | 'development'
}

function EnvironmentBadge({ environment }: EnvironmentBadgeProps) {
  const styles = {
    production: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30',
    staging: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
    development: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/30',
  }

  const icons = {
    production: (
      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 8 8">
        <circle cx="4" cy="4" r="3" />
      </svg>
    ),
    staging: (
      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    development: (
      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold uppercase tracking-wider rounded-full border ${styles[environment]}`}>
      {icons[environment]}
      {environment}
    </span>
  )
}

interface CategoryCardProps {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  stats?: { label: string; value: string | number; status?: 'success' | 'warning' | 'error' }[]
  onClick?: () => void
}

function CategoryCard({ title, description, icon, stats, onClick }: CategoryCardProps) {
  return (
    <button
      onClick={onClick}
      className="group relative flex flex-col p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-lime-500/50 dark:hover:border-lime-500/50 hover:shadow-lg hover:shadow-lime-500/5 transition-all text-left"
    >
      {/* Icon & Title */}
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 group-hover:bg-lime-500/10 group-hover:text-lime-600 dark:group-hover:text-lime-400 transition-colors">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-slate-900 dark:text-white group-hover:text-lime-600 dark:group-hover:text-lime-400 transition-colors">
            {title}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">{description}</p>
        </div>
        <svg className="w-5 h-5 text-slate-300 dark:text-slate-600 group-hover:text-lime-500 group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path d="M9 5l7 7-7 7" />
        </svg>
      </div>

      {/* Stats */}
      {stats && stats.length > 0 && (
        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          {stats.map((stat, index) => (
            <div key={index} className="flex items-center gap-2">
              {stat.status && (
                <span className={`w-2 h-2 rounded-full ${
                  stat.status === 'success' ? 'bg-lime-500' :
                  stat.status === 'warning' ? 'bg-amber-500' : 'bg-red-500'
                }`} />
              )}
              <span className="text-xs text-slate-500 dark:text-slate-400">{stat.label}:</span>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{stat.value}</span>
            </div>
          ))}
        </div>
      )}
    </button>
  )
}

interface IntegrationStatusProps {
  integration: Integration
}

function IntegrationStatus({ integration }: IntegrationStatusProps) {
  const statusStyles = {
    healthy: 'bg-lime-500',
    degraded: 'bg-amber-500',
    error: 'bg-red-500',
    disconnected: 'bg-slate-400',
  }

  const statusLabels = {
    healthy: 'Healthy',
    degraded: 'Degraded',
    error: 'Error',
    disconnected: 'Disconnected',
  }

  const formatTimestamp = (ts: string) => {
    const date = new Date(ts)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(minutes / 60)

    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
      <div className="relative">
        <div className={`w-2.5 h-2.5 rounded-full ${statusStyles[integration.status]}`} />
        {integration.status === 'healthy' && (
          <div className={`absolute inset-0 w-2.5 h-2.5 rounded-full ${statusStyles[integration.status]} animate-ping opacity-75`} />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-slate-900 dark:text-white">{integration.name}</div>
        <div className="text-xs text-slate-500 dark:text-slate-400">
          {statusLabels[integration.status]} · Last sync {formatTimestamp(integration.lastSync)}
        </div>
      </div>
      {integration.errorsLast24h > 0 && (
        <span className="px-2 py-0.5 text-xs font-medium bg-red-500/10 text-red-600 dark:text-red-400 rounded-full">
          {integration.errorsLast24h} errors
        </span>
      )}
    </div>
  )
}

interface RecentChangeProps {
  change: SettingsChange
  onClick?: () => void
}

function RecentChange({ change, onClick }: RecentChangeProps) {
  const formatTimestamp = (ts: string) => {
    const date = new Date(ts)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  const actionIcons = {
    created: (
      <svg className="w-4 h-4 text-lime-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path d="M12 4v16m8-8H4" />
      </svg>
    ),
    updated: (
      <svg className="w-4 h-4 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
    deleted: (
      <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
    ),
  }

  const categoryLabels: Record<string, string> = {
    general: 'General',
    feature_flags: 'Feature Flags',
    rate_limits: 'Rate Limits',
    integrations: 'Integrations',
    maintenance: 'Maintenance',
    roles: 'Roles',
  }

  return (
    <button
      onClick={onClick}
      className="flex items-start gap-3 p-3 w-full text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg transition-colors"
    >
      <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
        {actionIcons[change.action]}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm text-slate-900 dark:text-white">
          <span className="font-medium">{change.actor}</span>
          <span className="text-slate-500 dark:text-slate-400"> {change.action} </span>
          <span className="font-medium">{change.setting.replace(/_/g, ' ')}</span>
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-slate-500 dark:text-slate-400">{formatTimestamp(change.timestamp)}</span>
          <span className="text-xs text-slate-300 dark:text-slate-600">·</span>
          <span className="text-xs text-slate-500 dark:text-slate-400">{categoryLabels[change.category] || change.category}</span>
        </div>
        {change.reason && (
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1 italic">"{change.reason}"</p>
        )}
      </div>
    </button>
  )
}

interface ActiveAdminProps {
  admin: Admin
}

function ActiveAdmin({ admin }: ActiveAdminProps) {
  const formatLastActive = (ts: string) => {
    const date = new Date(ts)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)

    if (minutes < 5) return 'Active now'
    if (minutes < 60) return `${minutes}m ago`
    return `${Math.floor(minutes / 60)}h ago`
  }

  const isActive = new Date().getTime() - new Date(admin.lastActive).getTime() < 300000 // 5 minutes

  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <img
          src={admin.avatar}
          alt={admin.name}
          className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700"
        />
        {isActive && (
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-lime-500 rounded-full border-2 border-white dark:border-slate-900" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-slate-900 dark:text-white truncate">{admin.name}</div>
        <div className="text-xs text-slate-500 dark:text-slate-400">{formatLastActive(admin.lastActive)}</div>
      </div>
    </div>
  )
}

interface QuickStatProps {
  label: string
  value: string | number
  trend?: { direction: 'up' | 'down' | 'neutral'; value: string }
  status?: 'success' | 'warning' | 'error'
}

function QuickStat({ label, value, trend, status }: QuickStatProps) {
  return (
    <div className="flex flex-col">
      <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">{label}</span>
      <div className="flex items-baseline gap-2 mt-1">
        <span className={`text-2xl font-semibold ${
          status === 'success' ? 'text-lime-600 dark:text-lime-400' :
          status === 'warning' ? 'text-amber-600 dark:text-amber-400' :
          status === 'error' ? 'text-red-600 dark:text-red-400' :
          'text-slate-900 dark:text-white'
        }`}>
          {value}
        </span>
        {trend && (
          <span className={`flex items-center text-xs font-medium ${
            trend.direction === 'up' ? 'text-lime-600 dark:text-lime-400' :
            trend.direction === 'down' ? 'text-red-600 dark:text-red-400' :
            'text-slate-500 dark:text-slate-400'
          }`}>
            {trend.direction === 'up' && '↑'}
            {trend.direction === 'down' && '↓'}
            {trend.value}
          </span>
        )}
      </div>
    </div>
  )
}

// =============================================================================
// Main Component
// =============================================================================

export function SettingsDashboard({
  environment,
  admins,
  generalSettings,
  featureFlags,
  rateLimits,
  integrations,
  maintenanceConfig,
  settingsHistory,
  onNavigateCategory,
  onSearch,
}: SettingsDashboardProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch?.(searchQuery)
  }

  // Calculate stats
  const enabledFeatures = featureFlags.filter(f => f.enabled).length
  const betaFeatures = featureFlags.filter(f => f.category === 'beta' && f.enabled).length
  const healthyIntegrations = integrations.filter(i => i.status === 'healthy').length
  const totalErrors24h = integrations.reduce((sum, i) => sum + i.errorsLast24h, 0)
  const breachedLimits = rateLimits.filter(l => l.breachCount24h > 0).length

  // Category cards configuration
  const categories = [
    {
      id: 'general',
      title: 'General Settings',
      description: 'Platform defaults for events, notifications, onboarding, and privacy',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      stats: [
        { label: 'Events', value: generalSettings.events.defaultGameFormat },
        { label: 'Notifications', value: generalSettings.notifications.defaultEmailEnabled ? 'Email On' : 'Email Off' },
      ],
    },
    {
      id: 'features',
      title: 'Feature Flags',
      description: 'Enable, disable, and configure feature rollouts across the platform',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
        </svg>
      ),
      stats: [
        { label: 'Enabled', value: `${enabledFeatures}/${featureFlags.length}`, status: 'success' as const },
        { label: 'In Beta', value: betaFeatures, status: 'warning' as const },
      ],
    },
    {
      id: 'limits',
      title: 'Rate Limits',
      description: 'API and user action limits with usage monitoring',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      stats: [
        { label: 'Active Limits', value: rateLimits.length },
        { label: 'Breaches (24h)', value: breachedLimits, status: breachedLimits > 0 ? 'warning' as const : 'success' as const },
      ],
    },
    {
      id: 'integrations',
      title: 'Integrations',
      description: 'Third-party service connections and sync configurations',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      ),
      stats: [
        { label: 'Healthy', value: `${healthyIntegrations}/${integrations.length}`, status: healthyIntegrations === integrations.length ? 'success' as const : 'warning' as const },
        { label: 'Errors (24h)', value: totalErrors24h, status: totalErrors24h > 0 ? 'error' as const : 'success' as const },
      ],
    },
    {
      id: 'maintenance',
      title: 'Maintenance',
      description: 'Schedule downtime, manage maintenance windows, and emergency mode',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      stats: maintenanceConfig.isMaintenanceMode
        ? [{ label: 'Status', value: 'ACTIVE', status: 'error' as const }]
        : maintenanceConfig.scheduledMaintenance.enabled
        ? [{ label: 'Scheduled', value: new Date(maintenanceConfig.scheduledMaintenance.startTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), status: 'warning' as const }]
        : [{ label: 'Status', value: 'None scheduled', status: 'success' as const }],
    },
    {
      id: 'roles',
      title: 'Roles & Permissions',
      description: 'Manage access control, role hierarchy, and permission matrices',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
    },
  ]

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-lime-500 to-lime-600 text-white shadow-lg shadow-lime-500/25">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">System Settings</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">Configure platform behavior and integrations</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <EnvironmentBadge environment={environment} />
            </div>
          </div>

          {/* Search */}
          <form onSubmit={handleSearch} className="mt-6">
            <div className="relative max-w-xl">
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search settings, features, integrations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-lime-500/50 focus:border-lime-500 text-slate-900 dark:text-white placeholder-slate-400"
              />
              <kbd className="absolute right-4 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center px-2 py-0.5 text-xs font-medium text-slate-400 bg-slate-100 dark:bg-slate-700 rounded">
                ⌘K
              </kbd>
            </div>
          </form>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-8">
        {/* Maintenance Warning Banner */}
        {(maintenanceConfig.isMaintenanceMode || maintenanceConfig.scheduledMaintenance.enabled) && (
          <div className={`mb-6 p-4 rounded-xl border ${
            maintenanceConfig.isMaintenanceMode
              ? 'bg-red-500/10 border-red-500/30'
              : 'bg-amber-500/10 border-amber-500/30'
          }`}>
            <div className="flex items-start gap-3">
              <div className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg ${
                maintenanceConfig.isMaintenanceMode ? 'bg-red-500/20 text-red-600 dark:text-red-400' : 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
              }`}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className={`text-sm font-semibold ${
                  maintenanceConfig.isMaintenanceMode ? 'text-red-700 dark:text-red-400' : 'text-amber-700 dark:text-amber-400'
                }`}>
                  {maintenanceConfig.isMaintenanceMode ? 'Maintenance Mode Active' : 'Scheduled Maintenance'}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
                  {maintenanceConfig.bannerMessage}
                </p>
                {maintenanceConfig.scheduledMaintenance.enabled && !maintenanceConfig.isMaintenanceMode && (
                  <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
                    Starts: {new Date(maintenanceConfig.scheduledMaintenance.startTime).toLocaleString()}
                  </p>
                )}
              </div>
              <button
                onClick={() => onNavigateCategory?.('maintenance')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  maintenanceConfig.isMaintenanceMode
                    ? 'bg-red-500/20 text-red-700 dark:text-red-400 hover:bg-red-500/30'
                    : 'bg-amber-500/20 text-amber-700 dark:text-amber-400 hover:bg-amber-500/30'
                }`}
              >
                Manage
              </button>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          <QuickStat
            label="Features Enabled"
            value={`${enabledFeatures}/${featureFlags.length}`}
            status="success"
          />
          <QuickStat
            label="Integrations"
            value={`${healthyIntegrations} healthy`}
            status={healthyIntegrations === integrations.length ? 'success' : 'warning'}
          />
          <QuickStat
            label="Rate Breaches"
            value={breachedLimits}
            status={breachedLimits === 0 ? 'success' : 'warning'}
          />
          <QuickStat
            label="Changes (7d)"
            value={settingsHistory.length}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Categories */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
              Configuration Categories
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {categories.map((category) => (
                <CategoryCard
                  key={category.id}
                  {...category}
                  onClick={() => onNavigateCategory?.(category.id)}
                />
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Integration Status */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
                  Integration Status
                </h3>
                <button
                  onClick={() => onNavigateCategory?.('integrations')}
                  className="text-xs text-lime-600 dark:text-lime-400 hover:text-lime-700 dark:hover:text-lime-300 font-medium"
                >
                  View all →
                </button>
              </div>
              <div className="space-y-2">
                {integrations.slice(0, 4).map((integration) => (
                  <IntegrationStatus key={integration.id} integration={integration} />
                ))}
              </div>
            </div>

            {/* Recent Changes */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
                  Recent Changes
                </h3>
                <span className="text-xs text-slate-500 dark:text-slate-400">Last 7 days</span>
              </div>
              <div className="space-y-1">
                {settingsHistory.slice(0, 5).map((change) => (
                  <RecentChange key={change.id} change={change} />
                ))}
              </div>
            </div>

            {/* Active Admins */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
                Active Admins
              </h3>
              <div className="space-y-3">
                {admins.map((admin) => (
                  <ActiveAdmin key={admin.id} admin={admin} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
