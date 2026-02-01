import { useState } from 'react'
import {
  Calendar,
  Clock,
  MapPin,
  Trophy,
  Users,
  DollarSign,
  Star,
  ChevronRight,
  ChevronLeft,
  Check,
  X,
  FileText,
  Settings,
  Sparkles,
  AlertCircle,
} from 'lucide-react'
import type { Venue, GameFormat, EventCreateWizardProps, EventCreateData } from '@/../product/sections/events/types'

// =============================================================================
// Types
// =============================================================================

type WizardStep = 'basics' | 'format' | 'settings' | 'review'

interface FormData {
  name: string
  description: string
  venueId: string
  startDate: string
  startTime: string
  endTime: string
  format: string
  skillLevelMin: number
  skillLevelMax: number
  maxPlayers: number
  fee: string
  registrationDeadline: string
  requiresApproval: boolean
  allowPartnerRegistration: boolean
}

// =============================================================================
// Helper Components
// =============================================================================

function StepIndicator({
  steps,
  currentStep,
  onStepClick,
}: {
  steps: { id: WizardStep; label: string; icon: React.ReactNode }[]
  currentStep: WizardStep
  onStepClick?: (step: WizardStep) => void
}) {
  const currentIndex = steps.findIndex((s) => s.id === currentStep)

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-4">
      {steps.map((step, index) => {
        const isCompleted = index < currentIndex
        const isCurrent = step.id === currentStep
        const isClickable = index < currentIndex

        return (
          <div key={step.id} className="flex items-center">
            <button
              onClick={() => isClickable && onStepClick?.(step.id)}
              disabled={!isClickable}
              className={`
                flex items-center gap-2 px-3 py-2 rounded-xl transition-all
                ${isCurrent ? 'bg-lime-500 text-white shadow-lg shadow-lime-500/25' : ''}
                ${isCompleted ? 'bg-lime-100 dark:bg-lime-900/30 text-lime-700 dark:text-lime-400 hover:bg-lime-200 dark:hover:bg-lime-900/50 cursor-pointer' : ''}
                ${!isCurrent && !isCompleted ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500' : ''}
              `}
            >
              <span
                className={`
                w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                ${isCurrent ? 'bg-white/20' : ''}
                ${isCompleted ? 'bg-lime-500 text-white' : ''}
                ${!isCurrent && !isCompleted ? 'bg-slate-200 dark:bg-slate-700' : ''}
              `}
              >
                {isCompleted ? <Check className="w-3.5 h-3.5" /> : index + 1}
              </span>
              <span className="hidden sm:inline text-sm font-medium">{step.label}</span>
            </button>
            {index < steps.length - 1 && (
              <ChevronRight className="w-4 h-4 mx-1 sm:mx-2 text-slate-300 dark:text-slate-600" />
            )}
          </div>
        )
      })}
    </div>
  )
}

function FormField({
  label,
  required,
  error,
  children,
}: {
  label: string
  required?: boolean
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {error}
        </p>
      )}
    </div>
  )
}

function VenueCard({
  venue,
  selected,
  onClick,
}: {
  venue: Venue
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full p-4 rounded-xl border-2 text-left transition-all
        ${selected
          ? 'border-lime-500 bg-lime-50 dark:bg-lime-900/20 ring-2 ring-lime-500/20'
          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800'
        }
      `}
    >
      <div className="flex items-start gap-3">
        <div
          className={`
          p-2 rounded-lg
          ${selected ? 'bg-lime-500 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'}
        `}
        >
          <MapPin className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className={`font-medium ${selected ? 'text-lime-700 dark:text-lime-400' : 'text-slate-900 dark:text-white'}`}>
            {venue.name}
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{venue.address}</p>
          <p className="text-xs text-slate-400 dark:text-slate-500">{venue.city}</p>
        </div>
        {selected && (
          <div className="flex-shrink-0">
            <Check className="w-5 h-5 text-lime-500" />
          </div>
        )}
      </div>
    </button>
  )
}

function FormatCard({
  format,
  selected,
  onClick,
}: {
  format: GameFormat
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full p-4 rounded-xl border-2 text-left transition-all
        ${selected
          ? 'border-lime-500 bg-lime-50 dark:bg-lime-900/20 ring-2 ring-lime-500/20'
          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800'
        }
      `}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className={`font-medium ${selected ? 'text-lime-700 dark:text-lime-400' : 'text-slate-900 dark:text-white'}`}>
            {format.name}
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{format.description}</p>
        </div>
        {selected && (
          <div className="flex-shrink-0 ml-3">
            <div className="w-6 h-6 rounded-full bg-lime-500 flex items-center justify-center">
              <Check className="w-4 h-4 text-white" />
            </div>
          </div>
        )}
      </div>
    </button>
  )
}

function SkillSlider({
  min,
  max,
  onMinChange,
  onMaxChange,
}: {
  min: number
  max: number
  onMinChange: (val: number) => void
  onMaxChange: (val: number) => void
}) {
  const levels = [1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Star className="w-4 h-4 text-amber-500" />
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Skill Range</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-sm font-mono font-medium text-slate-700 dark:text-slate-300">
            {min.toFixed(1)} – {max.toFixed(1)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1.5">Minimum</label>
          <select
            value={min}
            onChange={(e) => onMinChange(parseFloat(e.target.value))}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent"
          >
            {levels.filter((l) => l <= max).map((level) => (
              <option key={level} value={level}>
                {level.toFixed(1)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1.5">Maximum</label>
          <select
            value={max}
            onChange={(e) => onMaxChange(parseFloat(e.target.value))}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent"
          >
            {levels.filter((l) => l >= min).map((level) => (
              <option key={level} value={level}>
                {level.toFixed(1)}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}

function Toggle({
  enabled,
  onChange,
  label,
  description,
}: {
  enabled: boolean
  onChange: (val: boolean) => void
  label: string
  description: string
}) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className="w-full flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
    >
      <div>
        <p className="font-medium text-slate-900 dark:text-white">{label}</p>
        <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>
      </div>
      <div
        className={`
        relative w-12 h-7 rounded-full transition-colors
        ${enabled ? 'bg-lime-500' : 'bg-slate-300 dark:bg-slate-600'}
      `}
      >
        <div
          className={`
          absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-transform
          ${enabled ? 'translate-x-6' : 'translate-x-1'}
        `}
        />
      </div>
    </button>
  )
}

function ReviewItem({
  icon,
  label,
  value,
  subValue,
}: {
  icon: React.ReactNode
  label: string
  value: string
  subValue?: string
}) {
  return (
    <div className="flex items-start gap-3 py-3">
      <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">{icon}</div>
      <div className="flex-1">
        <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
        <p className="font-medium text-slate-900 dark:text-white">{value}</p>
        {subValue && <p className="text-sm text-slate-500 dark:text-slate-400">{subValue}</p>}
      </div>
    </div>
  )
}

// =============================================================================
// Main Component
// =============================================================================

export function EventCreateWizard({
  venues,
  gameFormats,
  initialData,
  onSubmit,
  onCancel,
}: EventCreateWizardProps) {
  const [currentStep, setCurrentStep] = useState<WizardStep>('basics')
  const [formData, setFormData] = useState<FormData>({
    name: initialData?.name || '',
    description: initialData?.description || '',
    venueId: initialData?.venueId || '',
    startDate: initialData?.startDateTime?.split('T')[0] || '',
    startTime: initialData?.startDateTime?.split('T')[1]?.slice(0, 5) || '',
    endTime: initialData?.endDateTime?.split('T')[1]?.slice(0, 5) || '',
    format: initialData?.format || '',
    skillLevelMin: initialData?.skillLevelMin || 2.5,
    skillLevelMax: initialData?.skillLevelMax || 4.0,
    maxPlayers: initialData?.maxPlayers || 16,
    fee: initialData?.fee?.toString() || '',
    registrationDeadline: initialData?.registrationDeadline || '',
    requiresApproval: initialData?.requiresApproval || false,
    allowPartnerRegistration: initialData?.allowPartnerRegistration || false,
  })

  const steps: { id: WizardStep; label: string; icon: React.ReactNode }[] = [
    { id: 'basics', label: 'Basics', icon: <FileText className="w-4 h-4" /> },
    { id: 'format', label: 'Format', icon: <Trophy className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
    { id: 'review', label: 'Review', icon: <Sparkles className="w-4 h-4" /> },
  ]

  const stepOrder: WizardStep[] = ['basics', 'format', 'settings', 'review']
  const currentIndex = stepOrder.indexOf(currentStep)

  const goNext = () => {
    if (currentIndex < stepOrder.length - 1) {
      setCurrentStep(stepOrder[currentIndex + 1])
    }
  }

  const goBack = () => {
    if (currentIndex > 0) {
      setCurrentStep(stepOrder[currentIndex - 1])
    }
  }

  const handleSubmit = () => {
    const eventData: EventCreateData = {
      name: formData.name,
      description: formData.description,
      venueId: formData.venueId,
      startDateTime: `${formData.startDate}T${formData.startTime}:00`,
      endDateTime: `${formData.startDate}T${formData.endTime}:00`,
      format: formData.format,
      skillLevelMin: formData.skillLevelMin,
      skillLevelMax: formData.skillLevelMax,
      maxPlayers: formData.maxPlayers,
      fee: formData.fee ? parseFloat(formData.fee) : null,
      registrationDeadline: formData.registrationDeadline || undefined,
      requiresApproval: formData.requiresApproval,
      allowPartnerRegistration: formData.allowPartnerRegistration,
    }
    onSubmit?.(eventData)
  }

  const selectedVenue = venues.find((v) => v.id === formData.venueId)
  const selectedFormat = gameFormats.find((f) => f.id === formData.format)

  const inputClasses =
    'w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent transition-all'
  const textareaClasses =
    'w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent transition-all resize-none'

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Create Event</h1>
            <button
              onClick={onCancel}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <StepIndicator steps={steps} currentStep={currentStep} onStepClick={setCurrentStep} />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {/* Step 1: Basics */}
        {currentStep === 'basics' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Event Details</h2>

              <div className="space-y-5">
                <FormField label="Event Name" required>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Tuesday Night Open Play"
                    className={inputClasses}
                  />
                </FormField>

                <FormField label="Description">
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe your event..."
                    rows={4}
                    className={textareaClasses}
                  />
                </FormField>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Venue</h2>
              <div className="grid gap-3">
                {venues.map((venue) => (
                  <VenueCard
                    key={venue.id}
                    venue={venue}
                    selected={formData.venueId === venue.id}
                    onClick={() => setFormData({ ...formData, venueId: venue.id })}
                  />
                ))}
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Date & Time</h2>

              <div className="grid sm:grid-cols-3 gap-4">
                <FormField label="Date" required>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className={`${inputClasses} pl-11`}
                    />
                  </div>
                </FormField>

                <FormField label="Start Time" required>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="time"
                      value={formData.startTime}
                      onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                      className={`${inputClasses} pl-11`}
                    />
                  </div>
                </FormField>

                <FormField label="End Time" required>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="time"
                      value={formData.endTime}
                      onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                      className={`${inputClasses} pl-11`}
                    />
                  </div>
                </FormField>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Format */}
        {currentStep === 'format' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Game Format</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                Choose how the games will be organized during your event.
              </p>

              <div className="grid sm:grid-cols-2 gap-3">
                {gameFormats.map((format) => (
                  <FormatCard
                    key={format.id}
                    format={format}
                    selected={formData.format === format.id}
                    onClick={() => setFormData({ ...formData, format: format.id })}
                  />
                ))}
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <SkillSlider
                min={formData.skillLevelMin}
                max={formData.skillLevelMax}
                onMinChange={(val) => setFormData({ ...formData, skillLevelMin: val })}
                onMaxChange={(val) => setFormData({ ...formData, skillLevelMax: val })}
              />
            </div>
          </div>
        )}

        {/* Step 3: Settings */}
        {currentStep === 'settings' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Capacity & Pricing</h2>

              <div className="grid sm:grid-cols-2 gap-5">
                <FormField label="Max Players" required>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="number"
                      min="2"
                      max="100"
                      value={formData.maxPlayers}
                      onChange={(e) => setFormData({ ...formData, maxPlayers: parseInt(e.target.value) || 16 })}
                      className={`${inputClasses} pl-11`}
                    />
                  </div>
                </FormField>

                <FormField label="Registration Fee">
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.fee}
                      onChange={(e) => setFormData({ ...formData, fee: e.target.value })}
                      placeholder="Free"
                      className={`${inputClasses} pl-11`}
                    />
                  </div>
                  <p className="text-xs text-slate-400 mt-1">Leave empty for free events</p>
                </FormField>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Registration Options</h2>

              <div className="space-y-3">
                <Toggle
                  enabled={formData.requiresApproval}
                  onChange={(val) => setFormData({ ...formData, requiresApproval: val })}
                  label="Require Approval"
                  description="Manually approve each registration before confirming"
                />

                <Toggle
                  enabled={formData.allowPartnerRegistration}
                  onChange={(val) => setFormData({ ...formData, allowPartnerRegistration: val })}
                  label="Allow Partner Registration"
                  description="Let players register with a partner (for doubles formats)"
                />
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <FormField label="Registration Deadline">
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="datetime-local"
                    value={formData.registrationDeadline}
                    onChange={(e) => setFormData({ ...formData, registrationDeadline: e.target.value })}
                    className={`${inputClasses} pl-11`}
                  />
                </div>
                <p className="text-xs text-slate-400 mt-1">Leave empty for no deadline</p>
              </FormField>
            </div>
          </div>
        )}

        {/* Step 4: Review */}
        {currentStep === 'review' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-lime-500 to-lime-600 text-white">
              <div className="flex items-center gap-3 mb-2">
                <Sparkles className="w-6 h-6" />
                <h2 className="text-lg font-semibold">Ready to Create!</h2>
              </div>
              <p className="text-lime-100 text-sm">
                Review your event details below. Once published, players will be able to discover and register for your
                event.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{formData.name || 'Untitled Event'}</h2>
              {formData.description && (
                <p className="text-slate-600 dark:text-slate-400 text-sm mt-2">{formData.description}</p>
              )}

              <div className="mt-6 divide-y divide-slate-100 dark:divide-slate-800">
                <ReviewItem
                  icon={<MapPin className="w-4 h-4" />}
                  label="Venue"
                  value={selectedVenue?.name || 'Not selected'}
                  subValue={selectedVenue ? `${selectedVenue.address}, ${selectedVenue.city}` : undefined}
                />

                <ReviewItem
                  icon={<Calendar className="w-4 h-4" />}
                  label="Date & Time"
                  value={formData.startDate ? new Date(formData.startDate).toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  }) : 'Not set'}
                  subValue={formData.startTime && formData.endTime ? `${formData.startTime} – ${formData.endTime}` : undefined}
                />

                <ReviewItem
                  icon={<Trophy className="w-4 h-4" />}
                  label="Format"
                  value={selectedFormat?.name || 'Not selected'}
                  subValue={selectedFormat?.description}
                />

                <ReviewItem
                  icon={<Star className="w-4 h-4" />}
                  label="Skill Level"
                  value={`${formData.skillLevelMin.toFixed(1)} – ${formData.skillLevelMax.toFixed(1)}`}
                />

                <ReviewItem
                  icon={<Users className="w-4 h-4" />}
                  label="Capacity"
                  value={`${formData.maxPlayers} players max`}
                />

                <ReviewItem
                  icon={<DollarSign className="w-4 h-4" />}
                  label="Fee"
                  value={formData.fee ? `$${parseFloat(formData.fee).toFixed(2)}` : 'Free'}
                />
              </div>

              {(formData.requiresApproval || formData.allowPartnerRegistration) && (
                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Options</p>
                  <div className="flex flex-wrap gap-2">
                    {formData.requiresApproval && (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-medium">
                        Requires Approval
                      </span>
                    )}
                    {formData.allowPartnerRegistration && (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-400 text-xs font-medium">
                        Partner Registration
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <button
            onClick={currentIndex === 0 ? onCancel : goBack}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            {currentIndex === 0 ? 'Cancel' : 'Back'}
          </button>

          {currentStep === 'review' ? (
            <button
              onClick={handleSubmit}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium bg-lime-500 hover:bg-lime-600 text-white transition-colors shadow-lg shadow-lime-500/25"
            >
              <Sparkles className="w-4 h-4" />
              Publish Event
            </button>
          ) : (
            <button
              onClick={goNext}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium bg-lime-500 hover:bg-lime-600 text-white transition-colors shadow-lg shadow-lime-500/25"
            >
              Continue
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Spacer for fixed footer */}
      <div className="h-20" />
    </div>
  )
}
