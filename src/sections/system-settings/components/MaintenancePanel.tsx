import { useState } from 'react'
import type { MaintenancePanelProps, MaintenanceConfig } from '@/../product/sections/system-settings/types'

// =============================================================================
// Sub-Components
// =============================================================================

interface MaintenanceToggleProps {
  isActive: boolean
  onToggle?: (enabled: boolean) => void
}

function MaintenanceToggle({ isActive, onToggle }: MaintenanceToggleProps) {
  return (
    <div className={`relative p-6 rounded-2xl border-2 transition-all ${
      isActive
        ? 'bg-red-500/10 border-red-500/50'
        : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`w-16 h-16 flex items-center justify-center rounded-xl ${
            isActive
              ? 'bg-red-500/20 text-red-600 dark:text-red-400'
              : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
          }`}>
            {isActive ? (
              <svg className="w-8 h-8 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            ) : (
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            )}
          </div>
          <div>
            <h3 className={`text-xl font-bold ${
              isActive ? 'text-red-700 dark:text-red-400' : 'text-slate-900 dark:text-white'
            }`}>
              Maintenance Mode
            </h3>
            <p className={`text-sm ${
              isActive ? 'text-red-600/70 dark:text-red-400/70' : 'text-slate-500 dark:text-slate-400'
            }`}>
              {isActive
                ? 'Platform is currently in maintenance mode. Users cannot access the application.'
                : 'Toggle to put the platform into maintenance mode immediately.'}
            </p>
          </div>
        </div>

        <button
          onClick={() => onToggle?.(!isActive)}
          className={`relative w-20 h-10 rounded-full transition-all ${
            isActive
              ? 'bg-red-500 shadow-lg shadow-red-500/30'
              : 'bg-slate-300 dark:bg-slate-600'
          }`}
        >
          <span
            className={`absolute top-1 w-8 h-8 bg-white rounded-full shadow-md transition-all ${
              isActive ? 'left-11' : 'left-1'
            }`}
          />
        </button>
      </div>

      {isActive && (
        <div className="mt-4 pt-4 border-t border-red-500/20">
          <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Activated manually — deactivate when ready</span>
          </div>
        </div>
      )}
    </div>
  )
}

interface ScheduledMaintenanceProps {
  scheduled: MaintenanceConfig['scheduledMaintenance']
  onSchedule?: (startTime: string, endTime: string, noticeHours: number) => void
}

function ScheduledMaintenance({ scheduled, onSchedule }: ScheduledMaintenanceProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [startTime, setStartTime] = useState(scheduled.startTime)
  const [endTime, setEndTime] = useState(scheduled.endTime)
  const [noticeHours, setNoticeHours] = useState(scheduled.noticeHours)

  const formatDateTime = (ts: string) => {
    return new Date(ts).toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getCountdown = () => {
    const now = new Date()
    const start = new Date(scheduled.startTime)
    const diff = start.getTime() - now.getTime()

    if (diff <= 0) return 'Starting now'

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    if (days > 0) return `${days}d ${hours}h remaining`
    if (hours > 0) return `${hours}h ${minutes}m remaining`
    return `${minutes}m remaining`
  }

  const handleSave = () => {
    onSchedule?.(startTime, endTime, noticeHours)
    setIsEditing(false)
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
      <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Scheduled Maintenance</h3>
        {scheduled.enabled && !isEditing && (
          <span className="px-2.5 py-1 text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-full">
            {getCountdown()}
          </span>
        )}
      </div>

      {scheduled.enabled && !isEditing ? (
        <div className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">Start</span>
              <div className="text-sm font-medium text-slate-900 dark:text-white mt-1">
                {formatDateTime(scheduled.startTime)}
              </div>
            </div>
            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">End</span>
              <div className="text-sm font-medium text-slate-900 dark:text-white mt-1">
                {formatDateTime(scheduled.endTime)}
              </div>
            </div>
            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">Notice Period</span>
              <div className="text-sm font-medium text-slate-900 dark:text-white mt-1">
                {scheduled.noticeHours} hours before
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {scheduled.notificationSent ? (
              <span className="flex items-center gap-1 text-xs text-lime-600 dark:text-lime-400">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path d="M5 13l4 4L19 7" />
                </svg>
                Users notified
              </span>
            ) : (
              <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Notification pending
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => setIsEditing(true)}
              className="px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              Edit Schedule
            </button>
            <button
              onClick={() => onSchedule?.('', '', 0)}
              className="px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
            >
              Cancel Maintenance
            </button>
          </div>
        </div>
      ) : (
        <div className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm text-slate-600 dark:text-slate-400 mb-2">Start Time</label>
              <input
                type="datetime-local"
                value={startTime.slice(0, 16)}
                onChange={(e) => setStartTime(e.target.value + ':00Z')}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500/50 focus:border-lime-500 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-600 dark:text-slate-400 mb-2">End Time</label>
              <input
                type="datetime-local"
                value={endTime.slice(0, 16)}
                onChange={(e) => setEndTime(e.target.value + ':00Z')}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500/50 focus:border-lime-500 text-slate-900 dark:text-white"
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm text-slate-600 dark:text-slate-400 mb-2">Advance Notice (hours)</label>
            <input
              type="number"
              min="1"
              max="168"
              value={noticeHours}
              onChange={(e) => setNoticeHours(parseInt(e.target.value, 10))}
              className="w-32 px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500/50 focus:border-lime-500 text-slate-900 dark:text-white"
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm font-medium text-white bg-lime-500 hover:bg-lime-600 rounded-lg transition-colors"
            >
              {scheduled.enabled ? 'Update Schedule' : 'Schedule Maintenance'}
            </button>
            {isEditing && (
              <button
                onClick={() => setIsEditing(false)}
                className="px-3 py-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

interface BannerPreviewProps {
  message: string
  onChange?: (message: string) => void
}

function BannerPreview({ message, onChange }: BannerPreviewProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editMessage, setEditMessage] = useState(message)

  const handleSave = () => {
    onChange?.(editMessage)
    setIsEditing(false)
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
      <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Banner Message</h3>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="text-xs text-lime-600 dark:text-lime-400 hover:text-lime-700 dark:hover:text-lime-300 font-medium"
          >
            Edit
          </button>
        )}
      </div>

      <div className="p-4">
        {/* Preview */}
        <div className="mb-4">
          <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">Preview</span>
          <div className="mt-2 p-4 bg-amber-500 rounded-lg">
            <div className="flex items-center gap-3 text-white">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-sm font-medium">{message || 'No message configured'}</p>
            </div>
          </div>
        </div>

        {/* Editor */}
        {isEditing && (
          <div>
            <label className="block text-sm text-slate-600 dark:text-slate-400 mb-2">Message</label>
            <textarea
              value={editMessage}
              onChange={(e) => setEditMessage(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500/50 focus:border-lime-500 text-slate-900 dark:text-white resize-none"
              placeholder="Enter the maintenance message users will see..."
            />
            <div className="flex items-center gap-2 mt-3">
              <button
                onClick={handleSave}
                className="px-3 py-2 text-sm font-medium text-white bg-lime-500 hover:bg-lime-600 rounded-lg transition-colors"
              >
                Save Message
              </button>
              <button
                onClick={() => {
                  setEditMessage(message)
                  setIsEditing(false)
                }}
                className="px-3 py-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

interface IPAllowlistProps {
  ips: string[]
  onChange?: (ips: string[]) => void
}

function IPAllowlist({ ips, onChange }: IPAllowlistProps) {
  const [newIP, setNewIP] = useState('')

  const handleAdd = () => {
    if (newIP && !ips.includes(newIP)) {
      onChange?.([...ips, newIP])
      setNewIP('')
    }
  }

  const handleRemove = (ip: string) => {
    onChange?.(ips.filter(i => i !== ip))
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
      <div className="p-4 border-b border-slate-100 dark:border-slate-800">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Admin IP Allowlist</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          These IP addresses can access the admin panel during maintenance
        </p>
      </div>

      <div className="p-4">
        {/* Add IP */}
        <div className="flex items-center gap-2 mb-4">
          <input
            type="text"
            value={newIP}
            onChange={(e) => setNewIP(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            placeholder="Enter IP address (e.g., 192.168.1.100)"
            className="flex-1 px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500/50 focus:border-lime-500 text-slate-900 dark:text-white font-mono"
          />
          <button
            onClick={handleAdd}
            disabled={!newIP}
            className="px-3 py-2 text-sm font-medium text-white bg-lime-500 hover:bg-lime-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
          >
            Add IP
          </button>
        </div>

        {/* IP List */}
        {ips.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-sm text-slate-500 dark:text-slate-400">No IP addresses configured</p>
          </div>
        ) : (
          <div className="space-y-2">
            {ips.map((ip) => (
              <div
                key={ip}
                className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"
              >
                <code className="text-sm font-mono text-slate-700 dark:text-slate-300">{ip}</code>
                <button
                  onClick={() => handleRemove(ip)}
                  className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

interface EmergencyContactsProps {
  contacts: MaintenanceConfig['emergencyContacts']
}

function EmergencyContacts({ contacts }: EmergencyContactsProps) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
      <div className="p-4 border-b border-slate-100 dark:border-slate-800">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Emergency Contacts</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Notify these contacts when emergency maintenance is activated
        </p>
      </div>

      <div className="p-4">
        <div className="space-y-3">
          {contacts.map((contact, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-slate-900 dark:text-white">{contact.name}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">{contact.email} · {contact.phone}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// =============================================================================
// Main Component
// =============================================================================

export function MaintenancePanel({
  config,
  onToggleMaintenanceMode,
  onScheduleMaintenance,
  onUpdateBannerMessage,
  onUpdateAllowedIPs,
  onEmergencyMaintenance,
}: MaintenancePanelProps) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-4 lg:px-6 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Maintenance</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Manage platform downtime and maintenance windows
              </p>
            </div>
            <button
              onClick={onEmergencyMaintenance}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-lg shadow-lg shadow-red-500/25 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Emergency Maintenance
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 lg:px-6 py-6 space-y-6">
        {/* Maintenance Toggle */}
        <MaintenanceToggle
          isActive={config.isMaintenanceMode}
          onToggle={onToggleMaintenanceMode}
        />

        {/* Status Summary */}
        {!config.isMaintenanceMode && config.scheduledMaintenance.enabled && (
          <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-amber-700 dark:text-amber-400">Maintenance Scheduled</h3>
                <p className="text-sm text-amber-600/80 dark:text-amber-400/80 mt-0.5">
                  Maintenance is scheduled for {new Date(config.scheduledMaintenance.startTime).toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                  })}. Users will be notified {config.scheduledMaintenance.noticeHours} hours in advance.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Scheduled Maintenance */}
          <ScheduledMaintenance
            scheduled={config.scheduledMaintenance}
            onSchedule={onScheduleMaintenance}
          />

          {/* Banner Preview */}
          <BannerPreview
            message={config.bannerMessage}
            onChange={onUpdateBannerMessage}
          />

          {/* IP Allowlist */}
          <IPAllowlist
            ips={config.allowedIPs}
            onChange={onUpdateAllowedIPs}
          />

          {/* Emergency Contacts */}
          <EmergencyContacts contacts={config.emergencyContacts} />
        </div>

        {/* Help Section */}
        <div className="p-4 bg-slate-100 dark:bg-slate-800/50 rounded-xl">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Maintenance Mode Guide</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-lime-500/10 text-lime-600 dark:text-lime-400 flex-shrink-0">
                <span className="text-sm font-bold">1</span>
              </div>
              <div>
                <h4 className="text-sm font-medium text-slate-900 dark:text-white">Schedule Ahead</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Give users notice by scheduling maintenance in advance
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-lime-500/10 text-lime-600 dark:text-lime-400 flex-shrink-0">
                <span className="text-sm font-bold">2</span>
              </div>
              <div>
                <h4 className="text-sm font-medium text-slate-900 dark:text-white">Add Your IP</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Allowlist your IP to access admin during maintenance
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-lime-500/10 text-lime-600 dark:text-lime-400 flex-shrink-0">
                <span className="text-sm font-bold">3</span>
              </div>
              <div>
                <h4 className="text-sm font-medium text-slate-900 dark:text-white">Customize Banner</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Set a clear message explaining the maintenance
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
