import { useState } from 'react'
import type { IntegrationsPanelProps, Integration, IntegrationLog } from '@/../product/sections/system-settings/types'

// =============================================================================
// Sub-Components
// =============================================================================

interface StatusIndicatorProps {
  status: Integration['status']
  showLabel?: boolean
  size?: 'sm' | 'md' | 'lg'
}

function StatusIndicator({ status, showLabel = false, size = 'md' }: StatusIndicatorProps) {
  const styles = {
    healthy: {
      dot: 'bg-lime-500',
      ring: 'ring-lime-500/30',
      text: 'text-lime-600 dark:text-lime-400',
      label: 'Healthy',
    },
    degraded: {
      dot: 'bg-amber-500',
      ring: 'ring-amber-500/30',
      text: 'text-amber-600 dark:text-amber-400',
      label: 'Degraded',
    },
    error: {
      dot: 'bg-red-500',
      ring: 'ring-red-500/30',
      text: 'text-red-600 dark:text-red-400',
      label: 'Error',
    },
    disconnected: {
      dot: 'bg-slate-400',
      ring: 'ring-slate-400/30',
      text: 'text-slate-500 dark:text-slate-400',
      label: 'Disconnected',
    },
  }

  const sizes = {
    sm: { dot: 'w-2 h-2', ring: 'ring-2' },
    md: { dot: 'w-3 h-3', ring: 'ring-4' },
    lg: { dot: 'w-4 h-4', ring: 'ring-4' },
  }

  const style = styles[status]
  const sizeStyle = sizes[size]

  return (
    <div className="flex items-center gap-2">
      <span className="relative flex">
        <span className={`${sizeStyle.dot} rounded-full ${style.dot}`} />
        {status === 'healthy' && (
          <span className={`absolute inset-0 ${sizeStyle.dot} rounded-full ${style.dot} animate-ping opacity-75`} />
        )}
      </span>
      {showLabel && (
        <span className={`text-sm font-medium ${style.text}`}>{style.label}</span>
      )}
    </div>
  )
}

interface IntegrationIconProps {
  integrationKey: string
}

function IntegrationIcon({ integrationKey }: IntegrationIconProps) {
  const icons: Record<string, React.ReactNode> = {
    dupr: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    ),
    stripe: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z" />
      </svg>
    ),
    sendgrid: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M15.9 13.2H8.1V6h7.8v7.2zM8.1 15.9V24h7.8v-8.1H8.1zM0 8.1v7.8h7.8V8.1H0zM15.9 0v7.8H24V0h-8.1zM0 0v7.8h7.8V0H0z" />
      </svg>
    ),
    google_maps: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C7.31 0 3.5 3.81 3.5 8.5c0 6.08 7.58 14.82 7.9 15.17.17.18.4.28.64.28s.47-.1.64-.28c.32-.35 7.9-9.09 7.9-15.17C20.5 3.81 16.69 0 12 0zm0 11.5c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z" />
      </svg>
    ),
    google_calendar: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM9 14H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2zm-8 4H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2z" />
      </svg>
    ),
  }

  return (
    <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
      {icons[integrationKey] || (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      )}
    </div>
  )
}

interface LogEntryProps {
  log: IntegrationLog
}

function LogEntry({ log }: LogEntryProps) {
  const formatTimestamp = (ts: string) => {
    const date = new Date(ts)
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  }

  const levelStyles = {
    info: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400',
    warning: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    error: 'bg-red-500/10 text-red-600 dark:text-red-400',
  }

  const levelIcons = {
    info: (
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4M12 8h.01" />
      </svg>
    ),
    warning: (
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    error: (
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  }

  return (
    <div className="flex items-start gap-3 py-2">
      <span className="text-xs text-slate-400 dark:text-slate-500 font-mono w-12 flex-shrink-0 mt-0.5">
        {formatTimestamp(log.timestamp)}
      </span>
      <span className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium ${levelStyles[log.level]}`}>
        {levelIcons[log.level]}
      </span>
      <span className="text-sm text-slate-700 dark:text-slate-300 flex-1">{log.message}</span>
    </div>
  )
}

interface CredentialFieldProps {
  label: string
  value: string
  isConfigured: boolean
}

function CredentialField({ label, value, isConfigured }: CredentialFieldProps) {
  const [isRevealed, setIsRevealed] = useState(false)

  return (
    <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800 last:border-0">
      <span className="text-sm text-slate-600 dark:text-slate-400">{label}</span>
      <div className="flex items-center gap-2">
        {isConfigured ? (
          <>
            <code className="text-sm font-mono text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
              {isRevealed ? value : value.slice(0, -12) + '••••••••••••'}
            </code>
            <button
              onClick={() => setIsRevealed(!isRevealed)}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            >
              {isRevealed ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </>
        ) : (
          <span className="text-sm text-slate-400 dark:text-slate-500 italic">Not configured</span>
        )}
      </div>
    </div>
  )
}

interface IntegrationCardProps {
  integration: Integration
  isExpanded: boolean
  onToggle: () => void
  onTestConnection?: () => void
  onManualSync?: () => void
  onUpdateCredentials?: () => void
  onUpdateSettings?: (settings: Record<string, unknown>) => void
  onViewLogs?: () => void
}

function IntegrationCard({
  integration,
  isExpanded,
  onToggle,
  onTestConnection,
  onManualSync,
  onUpdateCredentials,
  onViewLogs,
}: IntegrationCardProps) {
  const formatTimestamp = (ts: string) => {
    const date = new Date(ts)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(hours / 24)

    if (hours < 1) return 'Just now'
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const frequencyLabels: Record<string, string> = {
    realtime: 'Real-time',
    hourly: 'Hourly',
    daily: 'Daily',
    weekly: 'Weekly',
    on_demand: 'On demand',
  }

  const statusColors = {
    healthy: 'border-lime-500/30',
    degraded: 'border-amber-500/30',
    error: 'border-red-500/30',
    disconnected: 'border-slate-300 dark:border-slate-700',
  }

  return (
    <div className={`bg-white dark:bg-slate-900 border-2 rounded-xl transition-all ${
      isExpanded ? statusColors[integration.status] + ' shadow-lg' : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
    }`}>
      {/* Header */}
      <div
        className="flex items-center gap-4 p-4 cursor-pointer"
        onClick={onToggle}
      >
        <IntegrationIcon integrationKey={integration.key} />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">{integration.name}</h3>
            <StatusIndicator status={integration.status} showLabel size="sm" />
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{integration.description}</p>
        </div>

        <div className="hidden sm:flex flex-col items-end gap-1">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Last sync: {formatTimestamp(integration.lastSync)}
          </span>
          <span className="text-xs text-slate-400 dark:text-slate-500">
            {frequencyLabels[integration.syncFrequency]}
          </span>
        </div>

        {integration.errorsLast24h > 0 && (
          <span className="px-2.5 py-1 text-xs font-semibold bg-red-500/10 text-red-600 dark:text-red-400 rounded-full">
            {integration.errorsLast24h} errors
          </span>
        )}

        <svg
          className={`w-5 h-5 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-slate-100 dark:border-slate-800">
          {/* Action Buttons */}
          <div className="flex items-center gap-2 p-4 bg-slate-50 dark:bg-slate-800/50">
            <button
              onClick={onTestConnection}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-lime-700 dark:text-lime-400 bg-lime-500/10 hover:bg-lime-500/20 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Test Connection
            </button>
            <button
              onClick={onManualSync}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Sync Now
            </button>
            <button
              onClick={onUpdateCredentials}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
              Update Credentials
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4">
            {/* Credentials Section */}
            <div>
              <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3">
                Credentials
              </h4>
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3">
                {integration.credentials.apiKey && (
                  <CredentialField
                    label="API Key"
                    value={integration.credentials.apiKey}
                    isConfigured={integration.credentials.configured}
                  />
                )}
                {integration.credentials.webhookSecret && (
                  <CredentialField
                    label="Webhook Secret"
                    value={integration.credentials.webhookSecret}
                    isConfigured={integration.credentials.configured}
                  />
                )}
                {integration.credentials.clientId && (
                  <CredentialField
                    label="Client ID"
                    value={integration.credentials.clientId}
                    isConfigured={integration.credentials.configured}
                  />
                )}
                {integration.credentials.clientSecret && (
                  <CredentialField
                    label="Client Secret"
                    value={integration.credentials.clientSecret}
                    isConfigured={integration.credentials.configured}
                  />
                )}
              </div>
            </div>

            {/* Settings Section */}
            <div>
              <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3">
                Configuration
              </h4>
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3 space-y-2">
                {Object.entries(integration.settings).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between py-1">
                    <span className="text-sm text-slate-600 dark:text-slate-400 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').trim()}
                    </span>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {typeof value === 'boolean' ? (value ? 'Yes' : 'No') :
                       typeof value === 'object' ? JSON.stringify(value).slice(0, 20) + '...' :
                       String(value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Logs */}
          <div className="p-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Recent Activity
              </h4>
              <button
                onClick={onViewLogs}
                className="text-xs text-lime-600 dark:text-lime-400 hover:text-lime-700 dark:hover:text-lime-300 font-medium"
              >
                View all logs →
              </button>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3 divide-y divide-slate-100 dark:divide-slate-700">
              {integration.recentLogs.slice(0, 3).map((log, index) => (
                <LogEntry key={index} log={log} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// =============================================================================
// Main Component
// =============================================================================

export function IntegrationsPanel({
  integrations,
  onTestConnection,
  onManualSync,
  onUpdateCredentials,
  onUpdateSettings,
  onViewLogs,
}: IntegrationsPanelProps) {
  const [expandedIntegrationId, setExpandedIntegrationId] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'healthy' | 'issues'>('all')

  // Calculate stats
  const healthyCount = integrations.filter(i => i.status === 'healthy').length
  const issueCount = integrations.filter(i => i.status !== 'healthy').length
  const totalErrors = integrations.reduce((sum, i) => sum + i.errorsLast24h, 0)

  // Filter integrations
  const filteredIntegrations = integrations.filter(integration => {
    if (filter === 'all') return true
    if (filter === 'healthy') return integration.status === 'healthy'
    if (filter === 'issues') return integration.status !== 'healthy'
    return true
  })

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-5xl mx-auto px-4 lg:px-6 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Integrations</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Manage third-party service connections and sync configurations
              </p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-lime-600 dark:text-lime-400">{healthyCount}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Healthy</div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${issueCount > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-slate-400'}`}>
                  {issueCount}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Issues</div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${totalErrors > 0 ? 'text-red-600 dark:text-red-400' : 'text-slate-400'}`}>
                  {totalErrors}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Errors (24h)</div>
              </div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2">
            {(['all', 'healthy', 'issues'] as const).map((option) => (
              <button
                key={option}
                onClick={() => setFilter(option)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                  filter === option
                    ? 'bg-lime-500 text-white shadow-lg shadow-lime-500/25'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {option === 'all' ? 'All' : option === 'healthy' ? 'Healthy' : 'Has Issues'}
                {option === 'issues' && issueCount > 0 && (
                  <span className="ml-2 px-1.5 py-0.5 text-xs bg-white/20 rounded-full">
                    {issueCount}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Integration List */}
      <div className="max-w-5xl mx-auto px-4 lg:px-6 py-6">
        {/* Alert Banner for Errors */}
        {integrations.some(i => i.status === 'error') && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg bg-red-500/20 text-red-600 dark:text-red-400">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-red-700 dark:text-red-400">Integration Errors Detected</h3>
                <p className="text-sm text-red-600/80 dark:text-red-400/80 mt-0.5">
                  {integrations.filter(i => i.status === 'error').map(i => i.name).join(', ')} {integrations.filter(i => i.status === 'error').length === 1 ? 'has' : 'have'} connection issues that need attention.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {filteredIntegrations.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 mb-4">
                <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">No integrations found</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {filter !== 'all' ? 'No integrations match this filter.' : 'Configure your first integration to get started.'}
              </p>
            </div>
          ) : (
            filteredIntegrations.map((integration) => (
              <IntegrationCard
                key={integration.id}
                integration={integration}
                isExpanded={expandedIntegrationId === integration.id}
                onToggle={() => setExpandedIntegrationId(expandedIntegrationId === integration.id ? null : integration.id)}
                onTestConnection={() => onTestConnection?.(integration.id)}
                onManualSync={() => onManualSync?.(integration.id)}
                onUpdateCredentials={() => onUpdateCredentials?.(integration.id)}
                onUpdateSettings={(settings) => onUpdateSettings?.(integration.id, settings)}
                onViewLogs={() => onViewLogs?.(integration.id)}
              />
            ))
          )}
        </div>

        {/* Integration Summary */}
        <div className="mt-8 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          <h3 className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-4">Integration Overview</h3>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {integrations.map((integration) => (
              <div
                key={integration.id}
                className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50"
              >
                <StatusIndicator status={integration.status} size="sm" />
                <span className="text-sm text-slate-700 dark:text-slate-300 truncate">{integration.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
