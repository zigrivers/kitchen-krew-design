import { useState } from 'react'
import {
  Building2,
  MapPin,
  Users,
  Calendar,
  ChevronRight,
  ChevronLeft,
  Check,
  Upload,
  Camera,
  X,
  Sparkles,
  QrCode,
  Download,
  Link2,
  Copy,
  MessageSquare,
  Mail,
  Smartphone,
  Crown,
  Zap,
  Star,
} from 'lucide-react'
import type {
  OnboardingData,
  OnboardingStep,
  TierLimits,
  SubscriptionTier,
  Location,
  Address,
  Court,
} from '@/../product/sections/clubs-and-venues/types'

// =============================================================================
// Props
// =============================================================================

export interface OnboardingWizardProps {
  data: OnboardingData
  tiers: TierLimits[]
  isLoading: boolean
  onUpdateClub: (club: Partial<OnboardingData['club']>) => void
  onUpdateVenue: (venue: Partial<NonNullable<OnboardingData['venue']>>) => void
  onSelectTier: (tier: SubscriptionTier, billingCycle: 'monthly' | 'annual') => void
  onUpdateFirstEvent: (event: Partial<NonNullable<OnboardingData['firstEvent']>>) => void
  onNextStep: () => void
  onPreviousStep: () => void
  onSkipStep: () => void
  onComplete: () => void
  onUploadLogo: (file: File) => void
}

// =============================================================================
// Constants
// =============================================================================

const STEPS: { id: OnboardingStep; title: string; subtitle: string }[] = [
  { id: 'club_setup', title: 'Your Club', subtitle: 'Basic info' },
  { id: 'venue_setup', title: 'Home Venue', subtitle: 'Optional' },
  { id: 'subscription', title: 'Plan', subtitle: 'Choose tier' },
  { id: 'first_event', title: 'First Event', subtitle: 'Optional' },
  { id: 'invite_members', title: 'Invite', subtitle: 'Share link' },
]

const SURFACE_OPTIONS = [
  { value: 'concrete', label: 'Concrete' },
  { value: 'sport_court', label: 'Sport Court' },
  { value: 'asphalt', label: 'Asphalt' },
  { value: 'wood', label: 'Wood' },
  { value: 'other', label: 'Other' },
] as const

const EVENT_TEMPLATES = [
  { value: 'open_play', label: 'Open Play', description: 'Casual drop-in play for all levels', icon: Users },
  { value: 'round_robin', label: 'Round Robin', description: 'Everyone plays everyone', icon: Calendar },
  { value: 'ladder', label: 'Ladder Match', description: 'Competitive ranked play', icon: Crown },
] as const

// =============================================================================
// Sub-Components
// =============================================================================

function ProgressBar({ currentStep, completedSteps }: { currentStep: OnboardingStep; completedSteps: OnboardingStep[] }) {
  const currentIndex = STEPS.findIndex(s => s.id === currentStep)

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
      {STEPS.map((step, index) => {
        const isCompleted = completedSteps.includes(step.id)
        const isCurrent = step.id === currentStep
        const isPast = index < currentIndex

        return (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                  isCompleted
                    ? 'bg-lime-500 text-white'
                    : isCurrent
                      ? 'bg-lime-100 dark:bg-lime-900/30 text-lime-600 dark:text-lime-400 ring-2 ring-lime-500'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                }`}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : index + 1}
              </div>
              <span className={`text-xs mt-1.5 ${isCurrent ? 'text-lime-600 dark:text-lime-400 font-medium' : 'text-slate-400'}`}>
                {step.title}
              </span>
            </div>
            {index < STEPS.length - 1 && (
              <div
                className={`w-8 sm:w-12 h-0.5 mx-1 sm:mx-2 ${
                  isPast || isCompleted ? 'bg-lime-500' : 'bg-slate-200 dark:bg-slate-700'
                }`}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

function StepContainer({
  children,
  title,
  subtitle,
  onBack,
  onNext,
  onSkip,
  nextLabel = 'Continue',
  showSkip = false,
  canProceed = true,
  isLoading = false,
}: {
  children: React.ReactNode
  title: string
  subtitle: string
  onBack?: () => void
  onNext?: () => void
  onSkip?: () => void
  nextLabel?: string
  showSkip?: boolean
  canProceed?: boolean
  isLoading?: boolean
}) {
  return (
    <div className="flex flex-col min-h-[calc(100vh-120px)]">
      {/* Header */}
      <div className="px-6 py-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{title}</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">{subtitle}</p>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 pb-6 overflow-y-auto">{children}</div>

      {/* Footer Actions */}
      <div className="sticky bottom-0 px-6 py-4 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 space-y-3">
        <div className="flex gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
          )}
          <button
            onClick={onNext}
            disabled={!canProceed || isLoading}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-lime-500 hover:bg-lime-600 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                {nextLabel}
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
        {showSkip && (
          <button
            onClick={onSkip}
            className="w-full text-center py-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
          >
            Skip for now
          </button>
        )}
      </div>
    </div>
  )
}

// =============================================================================
// Step 1: Club Setup
// =============================================================================

function ClubSetupStep({
  data,
  isLoading,
  onChange,
  onUploadLogo,
  onNext,
}: {
  data: OnboardingData['club']
  isLoading: boolean
  onChange: (updates: Partial<OnboardingData['club']>) => void
  onUploadLogo: (file: File) => void
  onNext: () => void
}) {
  const canProceed = data.name.trim().length > 0

  return (
    <StepContainer
      title="Let's set up your club"
      subtitle="Only the club name is required — you can add everything else later."
      onNext={onNext}
      canProceed={canProceed}
      isLoading={isLoading}
    >
      <div className="space-y-6">
        {/* Logo Upload */}
        <div className="flex justify-center">
          <label className="relative cursor-pointer group">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && onUploadLogo(e.target.files[0])}
            />
            {data.logoUrl ? (
              <div className="relative">
                <img src={data.logoUrl} alt="Club logo" className="w-24 h-24 rounded-2xl object-cover" />
                <div className="absolute inset-0 rounded-2xl bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <Camera className="w-6 h-6 text-white" />
                </div>
              </div>
            ) : (
              <div className="w-24 h-24 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-600 flex flex-col items-center justify-center gap-2 hover:border-lime-400 dark:hover:border-lime-500 hover:bg-lime-50 dark:hover:bg-lime-900/10 transition-colors">
                <Upload className="w-6 h-6 text-slate-400" />
                <span className="text-xs text-slate-500">Logo</span>
              </div>
            )}
          </label>
        </div>

        {/* Club Name */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Club Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={data.name}
            onChange={(e) => onChange({ name: e.target.value })}
            placeholder="Austin Pickleball Club"
            className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-lime-500 focus:border-transparent transition-all"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Description <span className="text-slate-400 font-normal">(optional)</span>
          </label>
          <textarea
            value={data.description}
            onChange={(e) => onChange({ description: e.target.value })}
            placeholder="Tell potential members about your club..."
            rows={3}
            className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-lime-500 focus:border-transparent transition-all resize-none"
          />
        </div>

        {/* Location */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">City</label>
            <input
              type="text"
              value={data.location.city}
              onChange={(e) => onChange({ location: { ...data.location, city: e.target.value } })}
              placeholder="Austin"
              className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-lime-500 focus:border-transparent transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">State</label>
            <input
              type="text"
              value={data.location.state}
              onChange={(e) => onChange({ location: { ...data.location, state: e.target.value } })}
              placeholder="TX"
              maxLength={2}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-lime-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Membership Type */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Membership</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => onChange({ membershipType: 'open' })}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                data.membershipType === 'open'
                  ? 'border-lime-500 bg-lime-50 dark:bg-lime-900/20'
                  : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
              }`}
            >
              <Users className={`w-5 h-5 mb-2 ${data.membershipType === 'open' ? 'text-lime-600' : 'text-slate-400'}`} />
              <p className="font-medium text-slate-900 dark:text-white">Open</p>
              <p className="text-xs text-slate-500 mt-0.5">Anyone can join</p>
            </button>
            <button
              onClick={() => onChange({ membershipType: 'closed' })}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                data.membershipType === 'closed'
                  ? 'border-lime-500 bg-lime-50 dark:bg-lime-900/20'
                  : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
              }`}
            >
              <Crown className={`w-5 h-5 mb-2 ${data.membershipType === 'closed' ? 'text-lime-600' : 'text-slate-400'}`} />
              <p className="font-medium text-slate-900 dark:text-white">Invite Only</p>
              <p className="text-xs text-slate-500 mt-0.5">Approval required</p>
            </button>
          </div>
        </div>
      </div>
    </StepContainer>
  )
}

// =============================================================================
// Step 2: Venue Setup
// =============================================================================

function VenueSetupStep({
  data,
  isLoading,
  onChange,
  onSkip,
  onNext,
  onBack,
}: {
  data: OnboardingData['venue']
  isLoading: boolean
  onChange: (updates: Partial<NonNullable<OnboardingData['venue']>>) => void
  onSkip: () => void
  onNext: () => void
  onBack: () => void
}) {
  const venue = data || { hasVenue: false, name: '', address: null, courtCount: 4, indoor: false, surface: 'concrete' as const }
  const canProceed = !venue.hasVenue || (venue.name.trim().length > 0 && venue.courtCount > 0)

  return (
    <StepContainer
      title="Do you have a home venue?"
      subtitle="Add your playing location so members can find you."
      onBack={onBack}
      onNext={onNext}
      onSkip={onSkip}
      showSkip
      canProceed={canProceed}
      isLoading={isLoading}
    >
      <div className="space-y-6">
        {/* Has Venue Toggle */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-3">
            <Building2 className="w-5 h-5 text-slate-400" />
            <span className="font-medium text-slate-900 dark:text-white">I have a venue to add</span>
          </div>
          <button
            onClick={() => onChange({ hasVenue: !venue.hasVenue })}
            className={`relative w-12 h-7 rounded-full transition-colors ${
              venue.hasVenue ? 'bg-lime-500' : 'bg-slate-300 dark:bg-slate-600'
            }`}
          >
            <div
              className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                venue.hasVenue ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {venue.hasVenue && (
          <>
            {/* Venue Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Venue Name</label>
              <input
                type="text"
                value={venue.name}
                onChange={(e) => onChange({ name: e.target.value })}
                placeholder="Riverside Recreation Center"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-lime-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Address</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search for address..."
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-lime-500 focus:border-transparent transition-all"
                />
              </div>
              <p className="text-xs text-slate-400 mt-1.5">Address autocomplete powered by Google Places</p>
            </div>

            {/* Court Count */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                How many courts? <span className="text-lime-600 font-bold">{venue.courtCount}</span>
              </label>
              <input
                type="range"
                min={1}
                max={20}
                value={venue.courtCount}
                onChange={(e) => onChange({ courtCount: parseInt(e.target.value) })}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-lime-500"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>1</span>
                <span>20</span>
              </div>
              <p className="text-sm text-slate-500 mt-2">
                We'll auto-generate Court 1, Court 2, ... Court {venue.courtCount}
              </p>
            </div>

            {/* Indoor/Outdoor */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Type</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => onChange({ indoor: false })}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    !venue.indoor
                      ? 'border-lime-500 bg-lime-50 dark:bg-lime-900/20'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                  }`}
                >
                  <p className="font-medium text-slate-900 dark:text-white">Outdoor</p>
                </button>
                <button
                  onClick={() => onChange({ indoor: true })}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    venue.indoor
                      ? 'border-lime-500 bg-lime-50 dark:bg-lime-900/20'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                  }`}
                >
                  <p className="font-medium text-slate-900 dark:text-white">Indoor</p>
                </button>
              </div>
            </div>

            {/* Surface Type */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Surface</label>
              <div className="flex flex-wrap gap-2">
                {SURFACE_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => onChange({ surface: option.value })}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      venue.surface === option.value
                        ? 'bg-lime-500 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </StepContainer>
  )
}

// =============================================================================
// Step 3: Subscription
// =============================================================================

function SubscriptionStep({
  currentTier,
  billingCycle,
  tiers,
  isLoading,
  onSelectTier,
  onNext,
  onBack,
}: {
  currentTier: SubscriptionTier
  billingCycle: 'monthly' | 'annual'
  tiers: TierLimits[]
  isLoading: boolean
  onSelectTier: (tier: SubscriptionTier, billingCycle: 'monthly' | 'annual') => void
  onNext: () => void
  onBack: () => void
}) {
  const [cycle, setCycle] = useState<'monthly' | 'annual'>(billingCycle)

  const handleCycleChange = (newCycle: 'monthly' | 'annual') => {
    setCycle(newCycle)
  }

  return (
    <StepContainer
      title="Choose your plan"
      subtitle="Start free and upgrade anytime as you grow."
      onBack={onBack}
      onNext={onNext}
      nextLabel={currentTier === 'community' ? 'Start Free' : 'Continue'}
      isLoading={isLoading}
    >
      <div className="space-y-6">
        {/* Billing Cycle Toggle */}
        <div className="flex justify-center">
          <div className="inline-flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800">
            <button
              onClick={() => handleCycleChange('monthly')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                cycle === 'monthly'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => handleCycleChange('annual')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                cycle === 'annual'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              Annual
              <span className="ml-1 text-xs text-lime-600 dark:text-lime-400">Save 15%</span>
            </button>
          </div>
        </div>

        {/* Tier Cards */}
        <div className="space-y-4">
          {tiers.map((tier) => {
            const isSelected = currentTier === tier.tier
            const price = cycle === 'annual' && tier.annualPrice ? Math.round(tier.annualPrice / 12) : tier.price
            const isFree = tier.price === 0

            return (
              <button
                key={tier.tier}
                onClick={() => onSelectTier(tier.tier, cycle)}
                className={`w-full p-4 rounded-2xl border-2 text-left transition-all ${
                  isSelected
                    ? 'border-lime-500 bg-lime-50 dark:bg-lime-900/20'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      {tier.tier === 'community' && <Users className="w-5 h-5 text-slate-400" />}
                      {tier.tier === 'pro' && <Zap className="w-5 h-5 text-sky-500" />}
                      {tier.tier === 'elite' && <Star className="w-5 h-5 text-amber-500" />}
                      <h3 className="font-bold text-slate-900 dark:text-white">{tier.name}</h3>
                      {tier.tier === 'pro' && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-400">
                          Popular
                        </span>
                      )}
                    </div>
                    <div className="mt-1">
                      {isFree ? (
                        <span className="text-2xl font-bold text-slate-900 dark:text-white">Free</span>
                      ) : (
                        <>
                          <span className="text-2xl font-bold text-slate-900 dark:text-white">${price}</span>
                          <span className="text-slate-500 dark:text-slate-400">/mo</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      isSelected ? 'border-lime-500 bg-lime-500' : 'border-slate-300 dark:border-slate-600'
                    }`}
                  >
                    {isSelected && <Check className="w-4 h-4 text-white" />}
                  </div>
                </div>

                {/* Limits */}
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="px-2 py-1 rounded-lg text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    {tier.eventsPerMonth ? `${tier.eventsPerMonth} events/mo` : 'Unlimited events'}
                  </span>
                  <span className="px-2 py-1 rounded-lg text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    {tier.maxCourts ? `${tier.maxCourts} courts` : 'Unlimited courts'}
                  </span>
                  <span className="px-2 py-1 rounded-lg text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    {tier.transactionFeePercent}% fees
                  </span>
                </div>

                {/* Features */}
                <ul className="mt-3 space-y-1.5">
                  {tier.features.slice(0, 3).map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <Check className="w-4 h-4 text-lime-500 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </button>
            )
          })}
        </div>
      </div>
    </StepContainer>
  )
}

// =============================================================================
// Step 4: First Event
// =============================================================================

function FirstEventStep({
  data,
  clubName,
  venueName,
  isLoading,
  onChange,
  onSkip,
  onNext,
  onBack,
}: {
  data: OnboardingData['firstEvent']
  clubName: string
  venueName: string | null
  isLoading: boolean
  onChange: (updates: Partial<NonNullable<OnboardingData['firstEvent']>>) => void
  onSkip: () => void
  onNext: () => void
  onBack: () => void
}) {
  const event = data || { createEvent: false, template: null, dateTime: null, recurring: false }
  const canProceed = !event.createEvent || (event.template !== null)

  return (
    <StepContainer
      title="Create your first event?"
      subtitle="Get members playing right away with a quick event setup."
      onBack={onBack}
      onNext={onNext}
      onSkip={onSkip}
      showSkip
      canProceed={canProceed}
      isLoading={isLoading}
    >
      <div className="space-y-6">
        {/* Create Event Toggle */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-slate-400" />
            <span className="font-medium text-slate-900 dark:text-white">Yes, let's schedule one</span>
          </div>
          <button
            onClick={() => onChange({ createEvent: !event.createEvent })}
            className={`relative w-12 h-7 rounded-full transition-colors ${
              event.createEvent ? 'bg-lime-500' : 'bg-slate-300 dark:bg-slate-600'
            }`}
          >
            <div
              className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                event.createEvent ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {event.createEvent && (
          <>
            {/* Event Template Selection */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Choose a format</label>
              <div className="space-y-3">
                {EVENT_TEMPLATES.map((template) => {
                  const Icon = template.icon
                  const isSelected = event.template === template.value

                  return (
                    <button
                      key={template.value}
                      onClick={() => onChange({ template: template.value })}
                      className={`w-full p-4 rounded-xl border-2 text-left transition-all flex items-center gap-4 ${
                        isSelected
                          ? 'border-lime-500 bg-lime-50 dark:bg-lime-900/20'
                          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          isSelected ? 'bg-lime-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                        }`}
                      >
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-slate-900 dark:text-white">{template.label}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{template.description}</p>
                      </div>
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          isSelected ? 'border-lime-500 bg-lime-500' : 'border-slate-300 dark:border-slate-600'
                        }`}
                      >
                        {isSelected && <Check className="w-4 h-4 text-white" />}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Date/Time */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">When?</label>
              <input
                type="datetime-local"
                value={event.dateTime || ''}
                onChange={(e) => onChange({ dateTime: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-lime-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Recurring */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <div>
                <p className="font-medium text-slate-900 dark:text-white">Make it recurring?</p>
                <p className="text-sm text-slate-500">Repeat weekly at the same time</p>
              </div>
              <button
                onClick={() => onChange({ recurring: !event.recurring })}
                className={`relative w-12 h-7 rounded-full transition-colors ${
                  event.recurring ? 'bg-lime-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <div
                  className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                    event.recurring ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Venue Info */}
            {venueName && (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-sky-50 dark:bg-sky-900/20 border border-sky-200 dark:border-sky-800">
                <Building2 className="w-5 h-5 text-sky-500" />
                <div>
                  <p className="text-sm text-sky-800 dark:text-sky-200">Event will be at</p>
                  <p className="font-medium text-sky-900 dark:text-sky-100">{venueName}</p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </StepContainer>
  )
}

// =============================================================================
// Step 5: Invite Members
// =============================================================================

function InviteMembersStep({
  clubName,
  isLoading,
  onComplete,
  onBack,
}: {
  clubName: string
  isLoading: boolean
  onComplete: () => void
  onBack: () => void
}) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <StepContainer
      title="Invite your first members"
      subtitle="Share your club link to start building your community."
      onBack={onBack}
      onNext={onComplete}
      nextLabel="Complete Setup"
      isLoading={isLoading}
    >
      <div className="space-y-6">
        {/* QR Code */}
        <div className="flex flex-col items-center p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <div className="p-4 bg-white rounded-xl shadow-lg">
            {/* Placeholder QR Code */}
            <div className="w-40 h-40 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center">
              <QrCode className="w-20 h-20 text-slate-300 dark:text-slate-600" />
            </div>
          </div>
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400 text-center">
            Scan to join <span className="font-medium text-slate-900 dark:text-white">{clubName}</span>
          </p>

          {/* Download Buttons */}
          <div className="flex gap-3 mt-4">
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-medium hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors">
              <Download className="w-4 h-4" />
              PNG
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              <Download className="w-4 h-4" />
              SVG
            </button>
          </div>
        </div>

        {/* Copy Link */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Or share the link</label>
          <div className="flex gap-2">
            <div className="flex-1 flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <Link2 className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <span className="text-sm text-slate-600 dark:text-slate-400 truncate">
                kitchenkrew.app/join/{clubName.toLowerCase().replace(/\s+/g, '-')}
              </span>
            </div>
            <button
              onClick={handleCopy}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${
                copied
                  ? 'bg-lime-500 text-white'
                  : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100'
              }`}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Share Options */}
        <div className="grid grid-cols-2 gap-3">
          <button className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            <MessageSquare className="w-5 h-5" />
            Text
          </button>
          <button className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            <Mail className="w-5 h-5" />
            Email
          </button>
        </div>

        {/* Success Message Preview */}
        <div className="p-4 rounded-xl bg-lime-50 dark:bg-lime-900/20 border border-lime-200 dark:border-lime-800">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-lime-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-lime-800 dark:text-lime-200">Almost there!</p>
              <p className="text-sm text-lime-600 dark:text-lime-400 mt-0.5">
                Click "Complete Setup" to launch your club. You can always invite more members later.
              </p>
            </div>
          </div>
        </div>
      </div>
    </StepContainer>
  )
}

// =============================================================================
// Main Component
// =============================================================================

export function OnboardingWizard({
  data,
  tiers,
  isLoading,
  onUpdateClub,
  onUpdateVenue,
  onSelectTier,
  onUpdateFirstEvent,
  onNextStep,
  onPreviousStep,
  onSkipStep,
  onComplete,
  onUploadLogo,
}: OnboardingWizardProps) {
  const currentStepIndex = STEPS.findIndex((s) => s.id === data.currentStep)

  const handleBack = () => {
    if (currentStepIndex > 0) {
      onPreviousStep()
    }
  }

  const renderStep = () => {
    switch (data.currentStep) {
      case 'club_setup':
        return (
          <ClubSetupStep
            data={data.club}
            isLoading={isLoading}
            onChange={onUpdateClub}
            onUploadLogo={onUploadLogo}
            onNext={onNextStep}
          />
        )
      case 'venue_setup':
        return (
          <VenueSetupStep
            data={data.venue}
            isLoading={isLoading}
            onChange={onUpdateVenue}
            onSkip={onSkipStep}
            onNext={onNextStep}
            onBack={handleBack}
          />
        )
      case 'subscription':
        return (
          <SubscriptionStep
            currentTier={data.subscription.tier}
            billingCycle={data.subscription.billingCycle}
            tiers={tiers}
            isLoading={isLoading}
            onSelectTier={onSelectTier}
            onNext={onNextStep}
            onBack={handleBack}
          />
        )
      case 'first_event':
        return (
          <FirstEventStep
            data={data.firstEvent}
            clubName={data.club.name}
            venueName={data.venue?.name || null}
            isLoading={isLoading}
            onChange={onUpdateFirstEvent}
            onSkip={onSkipStep}
            onNext={onNextStep}
            onBack={handleBack}
          />
        )
      case 'invite_members':
        return (
          <InviteMembersStep
            clubName={data.club.name}
            isLoading={isLoading}
            onComplete={onComplete}
            onBack={handleBack}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Progress */}
      <ProgressBar currentStep={data.currentStep} completedSteps={data.completedSteps} />

      {/* Step Content */}
      {renderStep()}
    </div>
  )
}
