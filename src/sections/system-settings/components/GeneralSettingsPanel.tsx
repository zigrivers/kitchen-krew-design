import { useState } from 'react'
import type { GeneralSettingsPanelProps, GeneralSettings } from '@/../product/sections/system-settings/types'

// =============================================================================
// Sub-Components
// =============================================================================

interface CollapsibleSectionProps {
  title: string
  description: string
  icon: React.ReactNode
  isExpanded: boolean
  onToggle: () => void
  children: React.ReactNode
}

function CollapsibleSection({ title, description, icon, isExpanded, onToggle, children }: CollapsibleSectionProps) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
      >
        <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-lime-500/10 text-lime-600 dark:text-lime-400">
          {icon}
        </div>
        <div className="flex-1 text-left">
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">{title}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>
        </div>
        <svg
          className={`w-5 h-5 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 border-t border-slate-100 dark:border-slate-800">
          {children}
        </div>
      )}
    </div>
  )
}

interface SettingRowProps {
  label: string
  description?: string
  children: React.ReactNode
  onReset?: () => void
}

function SettingRow({ label, description, children, onReset }: SettingRowProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between py-4 border-b border-slate-100 dark:border-slate-800 last:border-b-0 gap-3">
      <div className="flex-1">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>
        {description && (
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{description}</p>
        )}
      </div>
      <div className="flex items-center gap-2">
        {children}
        {onReset && (
          <button
            onClick={onReset}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
            title="Reset to default"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}

interface ToggleSwitchProps {
  enabled: boolean
  onChange?: (enabled: boolean) => void
}

function ToggleSwitch({ enabled, onChange }: ToggleSwitchProps) {
  return (
    <button
      onClick={() => onChange?.(!enabled)}
      className={`relative w-11 h-6 rounded-full transition-all ${
        enabled
          ? 'bg-lime-500 shadow-sm shadow-lime-500/30'
          : 'bg-slate-300 dark:bg-slate-600'
      }`}
    >
      <span
        className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${
          enabled ? 'left-6' : 'left-1'
        }`}
      />
    </button>
  )
}

interface SelectInputProps {
  value: string
  options: { value: string; label: string }[]
  onChange?: (value: string) => void
}

function SelectInput({ value, options, onChange }: SelectInputProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      className="px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500/50 focus:border-lime-500 text-slate-900 dark:text-white"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )
}

interface NumberInputProps {
  value: number
  min?: number
  max?: number
  suffix?: string
  onChange?: (value: number) => void
}

function NumberInput({ value, min, max, suffix, onChange }: NumberInputProps) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        onChange={(e) => onChange?.(parseInt(e.target.value, 10))}
        className="w-20 px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500/50 focus:border-lime-500 text-slate-900 dark:text-white text-center"
      />
      {suffix && (
        <span className="text-sm text-slate-500 dark:text-slate-400">{suffix}</span>
      )}
    </div>
  )
}

interface TextInputProps {
  value: string
  placeholder?: string
  onChange?: (value: string) => void
}

function TextInput({ value, placeholder, onChange }: TextInputProps) {
  return (
    <input
      type="text"
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange?.(e.target.value)}
      className="w-full sm:w-64 px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500/50 focus:border-lime-500 text-slate-900 dark:text-white"
    />
  )
}

interface MultiSelectChipsProps {
  value: number[]
  options: { value: number; label: string }[]
  onChange?: (value: number[]) => void
}

function MultiSelectChips({ value, options, onChange }: MultiSelectChipsProps) {
  const toggleOption = (optionValue: number) => {
    if (value.includes(optionValue)) {
      onChange?.(value.filter(v => v !== optionValue))
    } else {
      onChange?.([...value, optionValue].sort((a, b) => a - b))
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const isSelected = value.includes(option.value)
        return (
          <button
            key={option.value}
            onClick={() => toggleOption(option.value)}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${
              isSelected
                ? 'bg-lime-500 text-white shadow-sm shadow-lime-500/30'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}

// =============================================================================
// Main Component
// =============================================================================

export function GeneralSettingsPanel({
  settings,
  onUpdate,
  onResetToDefault,
  onSave,
}: GeneralSettingsPanelProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>(['events'])
  const [hasChanges, setHasChanges] = useState(false)

  const toggleSection = (section: string) => {
    setExpandedSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    )
  }

  const handleUpdate = (path: string, value: unknown) => {
    onUpdate?.(path, value)
    setHasChanges(true)
  }

  const handleSave = () => {
    onSave?.()
    setHasChanges(false)
  }

  const scoringOptions = [
    { value: 'rally', label: 'Rally Scoring' },
    { value: 'sideout', label: 'Side Out' },
    { value: 'traditional', label: 'Traditional' },
  ]

  const gameFormatOptions = [
    { value: 'singles', label: 'Singles' },
    { value: 'doubles', label: 'Doubles' },
    { value: 'mixed_doubles', label: 'Mixed Doubles' },
  ]

  const visibilityOptions = [
    { value: 'public', label: 'Public' },
    { value: 'members', label: 'Members Only' },
    { value: 'private', label: 'Private' },
  ]

  const reminderOptions = [
    { value: 1, label: '1h' },
    { value: 2, label: '2h' },
    { value: 6, label: '6h' },
    { value: 12, label: '12h' },
    { value: 24, label: '24h' },
    { value: 48, label: '48h' },
  ]

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 lg:px-6 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">General Settings</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Configure platform-wide defaults and behaviors
              </p>
            </div>
            <div className="flex items-center gap-3">
              {hasChanges && (
                <span className="px-2.5 py-1 text-xs font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-full">
                  Unsaved changes
                </span>
              )}
              <button
                onClick={handleSave}
                disabled={!hasChanges}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                  hasChanges
                    ? 'bg-lime-500 text-white hover:bg-lime-600 shadow-lg shadow-lime-500/25'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                }`}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 lg:px-6 py-6 space-y-4">
        {/* Event Defaults */}
        <CollapsibleSection
          title="Event Defaults"
          description="Default settings for new events"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          }
          isExpanded={expandedSections.includes('events')}
          onToggle={() => toggleSection('events')}
        >
          <div className="pt-4">
            <SettingRow
              label="Default Scoring Format"
              description="The scoring system used by default for new events"
              onReset={() => onResetToDefault?.('events.defaultScoringFormat')}
            >
              <SelectInput
                value={settings.events.defaultScoringFormat}
                options={scoringOptions}
                onChange={(v) => handleUpdate('events.defaultScoringFormat', v)}
              />
            </SettingRow>

            <SettingRow
              label="Default Game Format"
              description="The game type used by default"
              onReset={() => onResetToDefault?.('events.defaultGameFormat')}
            >
              <SelectInput
                value={settings.events.defaultGameFormat}
                options={gameFormatOptions}
                onChange={(v) => handleUpdate('events.defaultGameFormat', v)}
              />
            </SettingRow>

            <SettingRow
              label="Registration Deadline"
              description="How many hours before the event registration closes"
              onReset={() => onResetToDefault?.('events.defaultRegistrationDeadline')}
            >
              <NumberInput
                value={settings.events.defaultRegistrationDeadline}
                min={1}
                max={168}
                suffix="hours before"
                onChange={(v) => handleUpdate('events.defaultRegistrationDeadline', v)}
              />
            </SettingRow>

            <SettingRow
              label="Player Limits"
              description="Minimum and maximum players per event"
            >
              <div className="flex items-center gap-2">
                <NumberInput
                  value={settings.events.defaultMinPlayers}
                  min={2}
                  max={100}
                  onChange={(v) => handleUpdate('events.defaultMinPlayers', v)}
                />
                <span className="text-slate-400">to</span>
                <NumberInput
                  value={settings.events.defaultMaxPlayers}
                  min={2}
                  max={256}
                  onChange={(v) => handleUpdate('events.defaultMaxPlayers', v)}
                />
              </div>
            </SettingRow>

            <SettingRow
              label="Allow Waitlist"
              description="Enable waitlist when events are full"
              onReset={() => onResetToDefault?.('events.allowWaitlist')}
            >
              <ToggleSwitch
                enabled={settings.events.allowWaitlist}
                onChange={(v) => handleUpdate('events.allowWaitlist', v)}
              />
            </SettingRow>

            <SettingRow
              label="Require Skill Level"
              description="Require players to have a skill rating to register"
              onReset={() => onResetToDefault?.('events.requireSkillLevel')}
            >
              <ToggleSwitch
                enabled={settings.events.requireSkillLevel}
                onChange={(v) => handleUpdate('events.requireSkillLevel', v)}
              />
            </SettingRow>
          </div>
        </CollapsibleSection>

        {/* Notification Defaults */}
        <CollapsibleSection
          title="Notification Defaults"
          description="Default notification settings for new users"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          }
          isExpanded={expandedSections.includes('notifications')}
          onToggle={() => toggleSection('notifications')}
        >
          <div className="pt-4">
            <SettingRow
              label="Event Reminder Timing"
              description="When to send reminders before events"
            >
              <MultiSelectChips
                value={settings.notifications.eventReminderHours}
                options={reminderOptions}
                onChange={(v) => handleUpdate('notifications.eventReminderHours', v)}
              />
            </SettingRow>

            <SettingRow
              label="Registration Confirmation"
              description="Send confirmation when users register for events"
              onReset={() => onResetToDefault?.('notifications.registrationConfirmation')}
            >
              <ToggleSwitch
                enabled={settings.notifications.registrationConfirmation}
                onChange={(v) => handleUpdate('notifications.registrationConfirmation', v)}
              />
            </SettingRow>

            <SettingRow
              label="Match Result Notifications"
              description="Notify players when match results are posted"
              onReset={() => onResetToDefault?.('notifications.matchResultNotification')}
            >
              <ToggleSwitch
                enabled={settings.notifications.matchResultNotification}
                onChange={(v) => handleUpdate('notifications.matchResultNotification', v)}
              />
            </SettingRow>

            <SettingRow
              label="Weekly Digest"
              description="Send weekly summary of activity"
              onReset={() => onResetToDefault?.('notifications.weeklyDigest')}
            >
              <ToggleSwitch
                enabled={settings.notifications.weeklyDigest}
                onChange={(v) => handleUpdate('notifications.weeklyDigest', v)}
              />
            </SettingRow>

            <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
              <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3">
                Default Channels
              </h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Email</span>
                  <ToggleSwitch
                    enabled={settings.notifications.defaultEmailEnabled}
                    onChange={(v) => handleUpdate('notifications.defaultEmailEnabled', v)}
                  />
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Push</span>
                  <ToggleSwitch
                    enabled={settings.notifications.defaultPushEnabled}
                    onChange={(v) => handleUpdate('notifications.defaultPushEnabled', v)}
                  />
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                  <span className="text-sm text-slate-600 dark:text-slate-400">SMS</span>
                  <ToggleSwitch
                    enabled={settings.notifications.defaultSmsEnabled}
                    onChange={(v) => handleUpdate('notifications.defaultSmsEnabled', v)}
                  />
                </div>
              </div>
            </div>
          </div>
        </CollapsibleSection>

        {/* Onboarding Defaults */}
        <CollapsibleSection
          title="Onboarding Defaults"
          description="New user registration and welcome settings"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          }
          isExpanded={expandedSections.includes('onboarding')}
          onToggle={() => toggleSection('onboarding')}
        >
          <div className="pt-4">
            <SettingRow
              label="Require Profile Photo"
              description="New users must upload a profile photo"
              onReset={() => onResetToDefault?.('onboarding.requireProfilePhoto')}
            >
              <ToggleSwitch
                enabled={settings.onboarding.requireProfilePhoto}
                onChange={(v) => handleUpdate('onboarding.requireProfilePhoto', v)}
              />
            </SettingRow>

            <SettingRow
              label="Require Skill Level"
              description="New users must set their skill level"
              onReset={() => onResetToDefault?.('onboarding.requireSkillLevel')}
            >
              <ToggleSwitch
                enabled={settings.onboarding.requireSkillLevel}
                onChange={(v) => handleUpdate('onboarding.requireSkillLevel', v)}
              />
            </SettingRow>

            <SettingRow
              label="Require Location"
              description="New users must set their location"
              onReset={() => onResetToDefault?.('onboarding.requireLocation')}
            >
              <ToggleSwitch
                enabled={settings.onboarding.requireLocation}
                onChange={(v) => handleUpdate('onboarding.requireLocation', v)}
              />
            </SettingRow>

            <SettingRow
              label="Welcome Message"
              description="Show a welcome message to new users"
              onReset={() => onResetToDefault?.('onboarding.welcomeMessageEnabled')}
            >
              <ToggleSwitch
                enabled={settings.onboarding.welcomeMessageEnabled}
                onChange={(v) => handleUpdate('onboarding.welcomeMessageEnabled', v)}
              />
            </SettingRow>

            {settings.onboarding.welcomeMessageEnabled && (
              <div className="py-4">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Welcome Message Template
                </label>
                <textarea
                  value={settings.onboarding.welcomeMessageTemplate}
                  onChange={(e) => handleUpdate('onboarding.welcomeMessageTemplate', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500/50 focus:border-lime-500 text-slate-900 dark:text-white resize-none"
                />
              </div>
            )}

            <SettingRow
              label="Suggest Nearby Clubs"
              description="Recommend clubs based on user location"
              onReset={() => onResetToDefault?.('onboarding.suggestNearbyClubs')}
            >
              <ToggleSwitch
                enabled={settings.onboarding.suggestNearbyClubs}
                onChange={(v) => handleUpdate('onboarding.suggestNearbyClubs', v)}
              />
            </SettingRow>
          </div>
        </CollapsibleSection>

        {/* Privacy Defaults */}
        <CollapsibleSection
          title="Privacy Defaults"
          description="Default privacy settings for new accounts"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          }
          isExpanded={expandedSections.includes('privacy')}
          onToggle={() => toggleSection('privacy')}
        >
          <div className="pt-4">
            <SettingRow
              label="Default Profile Visibility"
              description="Who can see new user profiles by default"
              onReset={() => onResetToDefault?.('privacy.defaultProfileVisibility')}
            >
              <SelectInput
                value={settings.privacy.defaultProfileVisibility}
                options={visibilityOptions}
                onChange={(v) => handleUpdate('privacy.defaultProfileVisibility', v)}
              />
            </SettingRow>

            <SettingRow
              label="Show Rating by Default"
              description="Display skill rating on profiles"
              onReset={() => onResetToDefault?.('privacy.defaultShowRating')}
            >
              <ToggleSwitch
                enabled={settings.privacy.defaultShowRating}
                onChange={(v) => handleUpdate('privacy.defaultShowRating', v)}
              />
            </SettingRow>

            <SettingRow
              label="Show Match History"
              description="Display match history on profiles"
              onReset={() => onResetToDefault?.('privacy.defaultShowMatchHistory')}
            >
              <ToggleSwitch
                enabled={settings.privacy.defaultShowMatchHistory}
                onChange={(v) => handleUpdate('privacy.defaultShowMatchHistory', v)}
              />
            </SettingRow>

            <SettingRow
              label="Allow Anonymous Viewing"
              description="Let non-logged-in users view public content"
              onReset={() => onResetToDefault?.('privacy.allowAnonymousViewing')}
            >
              <ToggleSwitch
                enabled={settings.privacy.allowAnonymousViewing}
                onChange={(v) => handleUpdate('privacy.allowAnonymousViewing', v)}
              />
            </SettingRow>
          </div>
        </CollapsibleSection>
      </div>
    </div>
  )
}
