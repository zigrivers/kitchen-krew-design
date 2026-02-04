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
  RefreshCw,
  TrendingUp,
  Smile,
  UsersRound,
  Layers,
} from 'lucide-react'
import type {
  Venue,
  FormatCategory,
  FormatSubtype,
  FormatCategoryId,
  FormatCategoryIcon,
  EventCreateWizardProps,
  EventCreateData,
  FormatConfig,
  PartnershipType,
} from '@/../product/sections/events/types'

// =============================================================================
// Types
// =============================================================================

type WizardStep = 'basics' | 'format' | 'config' | 'settings' | 'review'

interface FormData {
  // Basics
  name: string
  description: string
  venueId: string
  courtIds: string[]
  startDate: string
  startTime: string
  endTime: string
  // Format Selection
  formatCategoryId: FormatCategoryId | null
  formatSubtypeId: string | null
  // Format Configuration
  skillLevelMin: number
  skillLevelMax: number
  // Scoring (most formats)
  scoringType: 'side_out' | 'rally'
  pointsToWin: number
  winBy: number
  capPoints: number | null
  // Tournament specific
  bracketType: 'single_elimination' | 'double_elimination' | 'pool_play'
  consolationBracket: boolean
  bronzeMatch: boolean
  seedingMethod: 'manual' | 'rating_based' | 'random'
  // Round Robin specific
  playoffEnabled: boolean
  playoffAdvancement: number
  // Ladder/KotC specific
  courtMovementEnabled: boolean
  courtMovementType: 'winners_up_losers_down' | 'performance_based' | 'rotation'
  // Recreational specific
  courtRotation: 'paddle_stack' | 'winners_stay' | 'time_based'
  // Registration Settings
  maxPlayers: number
  fee: string
  registrationDeadline: string
  waitlistEnabled: boolean
  waitlistMax: number
  requiresApproval: boolean
}

// =============================================================================
// Constants
// =============================================================================

/** Color schemes for each format category */
const categoryColors: Record<
  string,
  {
    bg: string
    bgActive: string
    text: string
    textActive: string
    border: string
    borderActive: string
    iconBg: string
    gradient: string
  }
> = {
  tournament: {
    bg: 'bg-white dark:bg-slate-800',
    bgActive: 'bg-amber-50 dark:bg-amber-900/30',
    text: 'text-slate-600 dark:text-slate-400',
    textActive: 'text-amber-700 dark:text-amber-400',
    border: 'border-slate-200 dark:border-slate-700',
    borderActive: 'border-amber-400 dark:border-amber-600',
    iconBg: 'bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400',
    gradient: 'from-amber-500 to-orange-500',
  },
  'round-robin': {
    bg: 'bg-white dark:bg-slate-800',
    bgActive: 'bg-sky-50 dark:bg-sky-900/30',
    text: 'text-slate-600 dark:text-slate-400',
    textActive: 'text-sky-700 dark:text-sky-400',
    border: 'border-slate-200 dark:border-slate-700',
    borderActive: 'border-sky-400 dark:border-sky-600',
    iconBg: 'bg-sky-100 dark:bg-sky-900/50 text-sky-600 dark:text-sky-400',
    gradient: 'from-sky-500 to-blue-500',
  },
  'ladder-league': {
    bg: 'bg-white dark:bg-slate-800',
    bgActive: 'bg-violet-50 dark:bg-violet-900/30',
    text: 'text-slate-600 dark:text-slate-400',
    textActive: 'text-violet-700 dark:text-violet-400',
    border: 'border-slate-200 dark:border-slate-700',
    borderActive: 'border-violet-400 dark:border-violet-600',
    iconBg: 'bg-violet-100 dark:bg-violet-900/50 text-violet-600 dark:text-violet-400',
    gradient: 'from-violet-500 to-purple-500',
  },
  recreational: {
    bg: 'bg-white dark:bg-slate-800',
    bgActive: 'bg-lime-50 dark:bg-lime-900/30',
    text: 'text-slate-600 dark:text-slate-400',
    textActive: 'text-lime-700 dark:text-lime-400',
    border: 'border-slate-200 dark:border-slate-700',
    borderActive: 'border-lime-400 dark:border-lime-600',
    iconBg: 'bg-lime-100 dark:bg-lime-900/50 text-lime-600 dark:text-lime-400',
    gradient: 'from-lime-500 to-green-500',
  },
  team: {
    bg: 'bg-white dark:bg-slate-800',
    bgActive: 'bg-rose-50 dark:bg-rose-900/30',
    text: 'text-slate-600 dark:text-slate-400',
    textActive: 'text-rose-700 dark:text-rose-400',
    border: 'border-slate-200 dark:border-slate-700',
    borderActive: 'border-rose-400 dark:border-rose-600',
    iconBg: 'bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400',
    gradient: 'from-rose-500 to-pink-500',
  },
  specialty: {
    bg: 'bg-white dark:bg-slate-800',
    bgActive: 'bg-orange-50 dark:bg-orange-900/30',
    text: 'text-slate-600 dark:text-slate-400',
    textActive: 'text-orange-700 dark:text-orange-400',
    border: 'border-slate-200 dark:border-slate-700',
    borderActive: 'border-orange-400 dark:border-orange-600',
    iconBg: 'bg-orange-100 dark:bg-orange-900/50 text-orange-600 dark:text-orange-400',
    gradient: 'from-orange-500 to-red-500',
  },
}

// =============================================================================
// Helper Components
// =============================================================================

/** Maps format category icon names to Lucide icon components */
function FormatIcon({ icon, className }: { icon: FormatCategoryIcon; className?: string }) {
  const iconMap = {
    trophy: Trophy,
    'refresh-cw': RefreshCw,
    'trending-up': TrendingUp,
    smile: Smile,
    users: UsersRound,
    star: Star,
  }
  const IconComponent = iconMap[icon] || Trophy
  return <IconComponent className={className} />
}

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
    <div className="flex items-center justify-center gap-1 sm:gap-2">
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
                flex items-center gap-1.5 px-2 sm:px-3 py-2 rounded-xl transition-all
                ${isCurrent ? 'bg-lime-500 text-white shadow-lg shadow-lime-500/25' : ''}
                ${isCompleted ? 'bg-lime-100 dark:bg-lime-900/30 text-lime-700 dark:text-lime-400 hover:bg-lime-200 dark:hover:bg-lime-900/50 cursor-pointer' : ''}
                ${!isCurrent && !isCompleted ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500' : ''}
              `}
            >
              <span
                className={`
                w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-xs font-bold
                ${isCurrent ? 'bg-white/20' : ''}
                ${isCompleted ? 'bg-lime-500 text-white' : ''}
                ${!isCurrent && !isCompleted ? 'bg-slate-200 dark:bg-slate-700' : ''}
              `}
              >
                {isCompleted ? <Check className="w-3 h-3" /> : index + 1}
              </span>
              <span className="hidden md:inline text-sm font-medium">{step.label}</span>
            </button>
            {index < steps.length - 1 && (
              <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 mx-0.5 sm:mx-1 text-slate-300 dark:text-slate-600" />
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
  hint,
  children,
}: {
  label: string
  required?: boolean
  error?: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-slate-400">{hint}</p>}
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
        ${
          selected
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

function FormatCategoryCard({
  category,
  selected,
  onClick,
}: {
  category: FormatCategory
  selected: boolean
  onClick: () => void
}) {
  const colors = categoryColors[category.id] || categoryColors['recreational']

  return (
    <button
      onClick={onClick}
      className={`
        w-full p-5 rounded-2xl border-2 text-left transition-all
        ${selected ? `${colors.bgActive} ${colors.borderActive} ring-2 ring-offset-2 ring-offset-white dark:ring-offset-slate-900` : `${colors.bg} ${colors.border} hover:border-slate-300 dark:hover:border-slate-600`}
        ${selected ? `ring-${category.id === 'tournament' ? 'amber' : category.id === 'round-robin' ? 'sky' : category.id === 'ladder-league' ? 'violet' : category.id === 'recreational' ? 'lime' : category.id === 'team' ? 'rose' : 'orange'}-500/30` : ''}
      `}
    >
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-xl ${colors.iconBg}`}>
          <FormatIcon icon={category.icon} className="w-6 h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <p className={`font-semibold text-lg ${selected ? colors.textActive : 'text-slate-900 dark:text-white'}`}>
              {category.name}
            </p>
            {selected && (
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center ${category.id === 'tournament' ? 'bg-amber-500' : category.id === 'round-robin' ? 'bg-sky-500' : category.id === 'ladder-league' ? 'bg-violet-500' : category.id === 'recreational' ? 'bg-lime-500' : category.id === 'team' ? 'bg-rose-500' : 'bg-orange-500'}`}
              >
                <Check className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{category.description}</p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
            <span className="font-medium">Best for:</span> {category.bestFor}
          </p>
        </div>
      </div>
    </button>
  )
}

function FormatSubtypeCard({
  subtype,
  selected,
  onClick,
  categoryId,
}: {
  subtype: FormatSubtype
  selected: boolean
  onClick: () => void
  categoryId: FormatCategoryId
}) {
  const colors = categoryColors[categoryId] || categoryColors['recreational']

  return (
    <button
      onClick={onClick}
      className={`
        w-full p-4 rounded-xl border-2 text-left transition-all
        ${selected ? `${colors.bgActive} ${colors.borderActive}` : `${colors.bg} ${colors.border} hover:border-slate-300 dark:hover:border-slate-600`}
      `}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className={`font-medium ${selected ? colors.textActive : 'text-slate-900 dark:text-white'}`}>
            {subtype.name}
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">{subtype.description}</p>
          <div className="flex items-center gap-3 mt-2 text-xs text-slate-400 dark:text-slate-500">
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              {subtype.minPlayers}–{subtype.maxPlayers}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {subtype.estimatedDuration}
            </span>
          </div>
        </div>
        {selected && (
          <div className="flex-shrink-0 ml-3">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center ${categoryId === 'tournament' ? 'bg-amber-500' : categoryId === 'round-robin' ? 'bg-sky-500' : categoryId === 'ladder-league' ? 'bg-violet-500' : categoryId === 'recreational' ? 'bg-lime-500' : categoryId === 'team' ? 'bg-rose-500' : 'bg-orange-500'}`}
            >
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
            {levels
              .filter((l) => l <= max)
              .map((level) => (
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
            {levels
              .filter((l) => l >= min)
              .map((level) => (
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
  badge,
  badgeColor,
}: {
  icon: React.ReactNode
  label: string
  value: string
  subValue?: string
  badge?: string
  badgeColor?: string
}) {
  return (
    <div className="flex items-start gap-3 py-3">
      <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">{icon}</div>
      <div className="flex-1">
        <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
        <div className="flex items-center gap-2">
          <p className="font-medium text-slate-900 dark:text-white">{value}</p>
          {badge && (
            <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${badgeColor || 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
              {badge}
            </span>
          )}
        </div>
        {subValue && <p className="text-sm text-slate-500 dark:text-slate-400">{subValue}</p>}
      </div>
    </div>
  )
}

function SelectField({
  label,
  value,
  options,
  onChange,
  hint,
}: {
  label: string
  value: string
  options: { value: string; label: string }[]
  onChange: (value: string) => void
  hint?: string
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {hint && <p className="text-xs text-slate-400">{hint}</p>}
    </div>
  )
}

// =============================================================================
// Main Component
// =============================================================================

export function EventCreateWizard({
  venues,
  formatCategories,
  initialData,
  onSubmit,
  onCancel,
}: EventCreateWizardProps) {
  const [currentStep, setCurrentStep] = useState<WizardStep>('basics')
  const [formData, setFormData] = useState<FormData>({
    // Basics
    name: initialData?.name || '',
    description: initialData?.description || '',
    venueId: initialData?.venueId || '',
    courtIds: initialData?.courtIds || [],
    startDate: initialData?.startDateTime?.split('T')[0] || '',
    startTime: initialData?.startDateTime?.split('T')[1]?.slice(0, 5) || '',
    endTime: initialData?.endDateTime?.split('T')[1]?.slice(0, 5) || '',
    // Format Selection
    formatCategoryId: initialData?.formatCategoryId || null,
    formatSubtypeId: initialData?.formatSubtypeId || null,
    // Format Configuration
    skillLevelMin: initialData?.formatConfig?.skillRange?.min || 2.5,
    skillLevelMax: initialData?.formatConfig?.skillRange?.max || 4.0,
    // Scoring
    scoringType: initialData?.formatConfig?.scoring?.type || 'rally',
    pointsToWin: initialData?.formatConfig?.scoring?.pointsToWin || 11,
    winBy: initialData?.formatConfig?.scoring?.winBy || 2,
    capPoints: initialData?.formatConfig?.scoring?.capPoints || null,
    // Tournament specific
    bracketType: initialData?.formatConfig?.bracketType || 'single_elimination',
    consolationBracket: initialData?.formatConfig?.consolationBracket || false,
    bronzeMatch: initialData?.formatConfig?.bronzeMatch || true,
    seedingMethod: initialData?.formatConfig?.seeding || 'rating_based',
    // Round Robin specific
    playoffEnabled: initialData?.formatConfig?.playoffEnabled || false,
    playoffAdvancement: initialData?.formatConfig?.playoffAdvancement || 4,
    // Ladder/KotC specific
    courtMovementEnabled: initialData?.formatConfig?.courtMovement?.enabled || true,
    courtMovementType: initialData?.formatConfig?.courtMovement?.type || 'winners_up_losers_down',
    // Recreational specific
    courtRotation: initialData?.formatConfig?.courtRotation || 'paddle_stack',
    // Registration Settings
    maxPlayers: initialData?.maxPlayers || 16,
    fee: initialData?.fee?.toString() || '',
    registrationDeadline: initialData?.registrationCloses || '',
    waitlistEnabled: initialData?.waitlistEnabled || true,
    waitlistMax: initialData?.waitlistMax || 10,
    requiresApproval: initialData?.requiresApproval || false,
  })

  const steps: { id: WizardStep; label: string; icon: React.ReactNode }[] = [
    { id: 'basics', label: 'Basics', icon: <FileText className="w-4 h-4" /> },
    { id: 'format', label: 'Format', icon: <Trophy className="w-4 h-4" /> },
    { id: 'config', label: 'Configure', icon: <Layers className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
    { id: 'review', label: 'Review', icon: <Sparkles className="w-4 h-4" /> },
  ]

  const stepOrder: WizardStep[] = ['basics', 'format', 'config', 'settings', 'review']
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

  // Get selected category and subtype
  const selectedCategory = formatCategories.find((c) => c.id === formData.formatCategoryId)
  const selectedSubtype = selectedCategory?.subtypes.find((s) => s.id === formData.formatSubtypeId)
  const selectedVenue = venues.find((v) => v.id === formData.venueId)

  // Build formatConfig based on selected format
  const buildFormatConfig = (): Partial<FormatConfig> => {
    const config: Partial<FormatConfig> = {
      skillRange: {
        min: formData.skillLevelMin,
        max: formData.skillLevelMax,
      },
    }

    // Add scoring for most formats
    if (formData.formatCategoryId !== 'recreational') {
      config.scoring = {
        type: formData.scoringType,
        pointsToWin: formData.pointsToWin,
        winBy: formData.winBy,
        capPoints: formData.capPoints,
      }
    }

    // Tournament-specific config
    if (formData.formatCategoryId === 'tournament') {
      config.bracketType = formData.bracketType
      config.consolationBracket = formData.consolationBracket
      config.bronzeMatch = formData.bronzeMatch
      config.seeding = formData.seedingMethod
    }

    // Round Robin-specific config
    if (formData.formatCategoryId === 'round-robin') {
      config.playoffEnabled = formData.playoffEnabled
      if (formData.playoffEnabled) {
        config.playoffAdvancement = formData.playoffAdvancement
      }
    }

    // Ladder/League-specific config
    if (formData.formatCategoryId === 'ladder-league' || formData.formatCategoryId === 'specialty') {
      config.courtMovement = {
        enabled: formData.courtMovementEnabled,
        type: formData.courtMovementType,
        movementCount: 1,
      }
    }

    // Recreational-specific config
    if (formData.formatCategoryId === 'recreational') {
      config.courtRotation = formData.courtRotation
    }

    return config
  }

  const handleSubmit = () => {
    if (!formData.formatCategoryId || !formData.formatSubtypeId) return

    const eventData: EventCreateData = {
      name: formData.name,
      description: formData.description,
      venueId: formData.venueId,
      courtIds: formData.courtIds,
      startDateTime: `${formData.startDate}T${formData.startTime}:00`,
      endDateTime: `${formData.startDate}T${formData.endTime}:00`,
      formatCategoryId: formData.formatCategoryId,
      formatSubtypeId: formData.formatSubtypeId,
      formatConfig: buildFormatConfig(),
      maxPlayers: formData.maxPlayers,
      fee: formData.fee ? parseFloat(formData.fee) : null,
      registrationCloses: formData.registrationDeadline || undefined,
      waitlistEnabled: formData.waitlistEnabled,
      waitlistMax: formData.waitlistMax,
      requiresApproval: formData.requiresApproval,
    }
    onSubmit?.(eventData)
  }

  const inputClasses =
    'w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent transition-all'
  const textareaClasses =
    'w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent transition-all resize-none'

  // Get category-specific colors for review badges
  const getCategoryBadgeColors = () => {
    if (!formData.formatCategoryId) return ''
    const colorMap: Record<string, string> = {
      tournament: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
      'round-robin': 'bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-400',
      'ladder-league': 'bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400',
      recreational: 'bg-lime-100 dark:bg-lime-900/30 text-lime-700 dark:text-lime-400',
      team: 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400',
      specialty: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400',
    }
    return colorMap[formData.formatCategoryId] || ''
  }

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

        {/* Step 2: Format Selection (Category → Subtype) */}
        {currentStep === 'format' && (
          <div className="space-y-6">
            {/* Category Selection */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Event Category</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                Choose the type of event you want to organize.
              </p>

              <div className="grid gap-4">
                {formatCategories.map((category) => (
                  <FormatCategoryCard
                    key={category.id}
                    category={category}
                    selected={formData.formatCategoryId === category.id}
                    onClick={() =>
                      setFormData({
                        ...formData,
                        formatCategoryId: category.id,
                        formatSubtypeId: null, // Reset subtype when category changes
                      })
                    }
                  />
                ))}
              </div>
            </div>

            {/* Subtype Selection (only shown when category is selected) */}
            {selectedCategory && (
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Format Variation</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                  Select a specific format within {selectedCategory.name}.
                </p>

                <div className="grid sm:grid-cols-2 gap-3">
                  {selectedCategory.subtypes.map((subtype) => (
                    <FormatSubtypeCard
                      key={subtype.id}
                      subtype={subtype}
                      categoryId={selectedCategory.id}
                      selected={formData.formatSubtypeId === subtype.id}
                      onClick={() => setFormData({ ...formData, formatSubtypeId: subtype.id })}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Format Configuration (varies by format) */}
        {currentStep === 'config' && (
          <div className="space-y-6">
            {/* Skill Level (all formats) */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <SkillSlider
                min={formData.skillLevelMin}
                max={formData.skillLevelMax}
                onMinChange={(val) => setFormData({ ...formData, skillLevelMin: val })}
                onMaxChange={(val) => setFormData({ ...formData, skillLevelMax: val })}
              />
            </div>

            {/* Scoring Configuration (most formats except pure recreational) */}
            {formData.formatCategoryId !== 'recreational' && (
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Scoring Rules</h2>

                <div className="grid sm:grid-cols-2 gap-5">
                  <SelectField
                    label="Scoring Type"
                    value={formData.scoringType}
                    onChange={(val) => setFormData({ ...formData, scoringType: val as 'side_out' | 'rally' })}
                    options={[
                      { value: 'rally', label: 'Rally Scoring' },
                      { value: 'side_out', label: 'Side-Out Scoring' },
                    ]}
                    hint="Rally scoring is faster and recommended for most events"
                  />

                  <FormField label="Points to Win">
                    <input
                      type="number"
                      min="7"
                      max="21"
                      value={formData.pointsToWin}
                      onChange={(e) => setFormData({ ...formData, pointsToWin: parseInt(e.target.value) || 11 })}
                      className={inputClasses}
                    />
                  </FormField>

                  <FormField label="Win By">
                    <input
                      type="number"
                      min="1"
                      max="3"
                      value={formData.winBy}
                      onChange={(e) => setFormData({ ...formData, winBy: parseInt(e.target.value) || 2 })}
                      className={inputClasses}
                    />
                  </FormField>

                  <FormField label="Point Cap" hint="Leave empty for no cap">
                    <input
                      type="number"
                      min={formData.pointsToWin}
                      max="25"
                      value={formData.capPoints || ''}
                      onChange={(e) => setFormData({ ...formData, capPoints: e.target.value ? parseInt(e.target.value) : null })}
                      placeholder="No cap"
                      className={inputClasses}
                    />
                  </FormField>
                </div>
              </div>
            )}

            {/* Tournament-specific Configuration */}
            {formData.formatCategoryId === 'tournament' && (
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Tournament Settings</h2>

                <div className="space-y-5">
                  <SelectField
                    label="Bracket Type"
                    value={formData.bracketType}
                    onChange={(val) =>
                      setFormData({ ...formData, bracketType: val as 'single_elimination' | 'double_elimination' | 'pool_play' })
                    }
                    options={[
                      { value: 'single_elimination', label: 'Single Elimination' },
                      { value: 'double_elimination', label: 'Double Elimination' },
                      { value: 'pool_play', label: 'Pool Play + Playoffs' },
                    ]}
                  />

                  <SelectField
                    label="Seeding Method"
                    value={formData.seedingMethod}
                    onChange={(val) => setFormData({ ...formData, seedingMethod: val as 'manual' | 'rating_based' | 'random' })}
                    options={[
                      { value: 'rating_based', label: 'Rating-Based' },
                      { value: 'manual', label: 'Manual Seeding' },
                      { value: 'random', label: 'Random' },
                    ]}
                  />

                  <div className="space-y-3">
                    <Toggle
                      enabled={formData.consolationBracket}
                      onChange={(val) => setFormData({ ...formData, consolationBracket: val })}
                      label="Consolation Bracket"
                      description="Allow eliminated players to continue competing"
                    />

                    <Toggle
                      enabled={formData.bronzeMatch}
                      onChange={(val) => setFormData({ ...formData, bronzeMatch: val })}
                      label="Bronze Match"
                      description="Play a 3rd place match between semifinal losers"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Round Robin-specific Configuration */}
            {formData.formatCategoryId === 'round-robin' && (
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Round Robin Settings</h2>

                <div className="space-y-5">
                  <Toggle
                    enabled={formData.playoffEnabled}
                    onChange={(val) => setFormData({ ...formData, playoffEnabled: val })}
                    label="Enable Playoffs"
                    description="Top players advance to elimination bracket after pool play"
                  />

                  {formData.playoffEnabled && (
                    <FormField label="Players Advancing to Playoffs">
                      <input
                        type="number"
                        min="2"
                        max="8"
                        value={formData.playoffAdvancement}
                        onChange={(e) => setFormData({ ...formData, playoffAdvancement: parseInt(e.target.value) || 4 })}
                        className={inputClasses}
                      />
                    </FormField>
                  )}
                </div>
              </div>
            )}

            {/* Ladder/League-specific Configuration */}
            {(formData.formatCategoryId === 'ladder-league' || formData.formatCategoryId === 'specialty') && (
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Court Movement</h2>

                <div className="space-y-5">
                  <Toggle
                    enabled={formData.courtMovementEnabled}
                    onChange={(val) => setFormData({ ...formData, courtMovementEnabled: val })}
                    label="Enable Court Movement"
                    description="Players move between courts based on performance"
                  />

                  {formData.courtMovementEnabled && (
                    <SelectField
                      label="Movement Type"
                      value={formData.courtMovementType}
                      onChange={(val) =>
                        setFormData({
                          ...formData,
                          courtMovementType: val as 'winners_up_losers_down' | 'performance_based' | 'rotation',
                        })
                      }
                      options={[
                        { value: 'winners_up_losers_down', label: 'Winners Up, Losers Down' },
                        { value: 'performance_based', label: 'Performance-Based' },
                        { value: 'rotation', label: 'Rotation' },
                      ]}
                    />
                  )}
                </div>
              </div>
            )}

            {/* Recreational-specific Configuration */}
            {formData.formatCategoryId === 'recreational' && (
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Open Play Settings</h2>

                <SelectField
                  label="Court Rotation Style"
                  value={formData.courtRotation}
                  onChange={(val) => setFormData({ ...formData, courtRotation: val as 'paddle_stack' | 'winners_stay' | 'time_based' })}
                  options={[
                    { value: 'paddle_stack', label: 'Paddle Stack (Traditional)' },
                    { value: 'winners_stay', label: 'Winners Stay On' },
                    { value: 'time_based', label: 'Time-Based Rotation' },
                  ]}
                  hint="Paddle stack is the most common rotation method for open play"
                />
              </div>
            )}
          </div>
        )}

        {/* Step 4: Registration Settings */}
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

                <FormField label="Registration Fee" hint="Leave empty for free events">
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
                </FormField>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Waitlist</h2>

              <div className="space-y-4">
                <Toggle
                  enabled={formData.waitlistEnabled}
                  onChange={(val) => setFormData({ ...formData, waitlistEnabled: val })}
                  label="Enable Waitlist"
                  description="Allow players to join a waitlist when event is full"
                />

                {formData.waitlistEnabled && (
                  <FormField label="Waitlist Capacity">
                    <input
                      type="number"
                      min="1"
                      max="50"
                      value={formData.waitlistMax}
                      onChange={(e) => setFormData({ ...formData, waitlistMax: parseInt(e.target.value) || 10 })}
                      className={inputClasses}
                    />
                  </FormField>
                )}
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
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <FormField label="Registration Deadline" hint="Leave empty for no deadline">
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="datetime-local"
                    value={formData.registrationDeadline}
                    onChange={(e) => setFormData({ ...formData, registrationDeadline: e.target.value })}
                    className={`${inputClasses} pl-11`}
                  />
                </div>
              </FormField>
            </div>
          </div>
        )}

        {/* Step 5: Review */}
        {currentStep === 'review' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-lime-500 to-lime-600 text-white">
              <div className="flex items-center gap-3 mb-2">
                <Sparkles className="w-6 h-6" />
                <h2 className="text-lg font-semibold">Ready to Create!</h2>
              </div>
              <p className="text-lime-100 text-sm">
                Review your event details below. Once published, players will be able to discover and register for your event.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{formData.name || 'Untitled Event'}</h2>
              {formData.description && <p className="text-slate-600 dark:text-slate-400 text-sm mt-2">{formData.description}</p>}

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
                  value={
                    formData.startDate
                      ? new Date(formData.startDate).toLocaleDateString('en-US', {
                          weekday: 'long',
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })
                      : 'Not set'
                  }
                  subValue={formData.startTime && formData.endTime ? `${formData.startTime} – ${formData.endTime}` : undefined}
                />

                <ReviewItem
                  icon={<Trophy className="w-4 h-4" />}
                  label="Format"
                  value={selectedSubtype?.name || 'Not selected'}
                  subValue={selectedSubtype?.description}
                  badge={selectedCategory?.name}
                  badgeColor={getCategoryBadgeColors()}
                />

                <ReviewItem icon={<Star className="w-4 h-4" />} label="Skill Level" value={`${formData.skillLevelMin.toFixed(1)} – ${formData.skillLevelMax.toFixed(1)}`} />

                <ReviewItem icon={<Users className="w-4 h-4" />} label="Capacity" value={`${formData.maxPlayers} players max`} />

                <ReviewItem
                  icon={<DollarSign className="w-4 h-4" />}
                  label="Fee"
                  value={formData.fee ? `$${parseFloat(formData.fee).toFixed(2)}` : 'Free'}
                />
              </div>

              {/* Format-specific review items */}
              {formData.formatCategoryId === 'tournament' && (
                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Tournament Configuration</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-medium">
                      {formData.bracketType.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-medium">
                      {formData.seedingMethod.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())} Seeding
                    </span>
                    {formData.consolationBracket && (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-medium">
                        Consolation Bracket
                      </span>
                    )}
                    {formData.bronzeMatch && (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-medium">
                        Bronze Match
                      </span>
                    )}
                  </div>
                </div>
              )}

              {formData.formatCategoryId === 'round-robin' && formData.playoffEnabled && (
                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Round Robin Configuration</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-400 text-xs font-medium">
                      Playoffs Enabled
                    </span>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-medium">
                      Top {formData.playoffAdvancement} Advance
                    </span>
                  </div>
                </div>
              )}

              {(formData.requiresApproval || formData.waitlistEnabled) && (
                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Registration Options</p>
                  <div className="flex flex-wrap gap-2">
                    {formData.requiresApproval && (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-medium">
                        Requires Approval
                      </span>
                    )}
                    {formData.waitlistEnabled && (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-medium">
                        Waitlist ({formData.waitlistMax} max)
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
              disabled={!formData.formatCategoryId || !formData.formatSubtypeId}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium bg-lime-500 hover:bg-lime-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white transition-colors shadow-lg shadow-lime-500/25"
            >
              <Sparkles className="w-4 h-4" />
              Publish Event
            </button>
          ) : (
            <button
              onClick={goNext}
              disabled={currentStep === 'format' && (!formData.formatCategoryId || !formData.formatSubtypeId)}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium bg-lime-500 hover:bg-lime-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white transition-colors shadow-lg shadow-lime-500/25"
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
