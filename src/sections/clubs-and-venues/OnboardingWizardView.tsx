import { useState } from 'react'
import { OnboardingWizard } from './components/OnboardingWizard'
import sampleData from '@/../product/sections/clubs-and-venues/data.json'
import type {
  OnboardingData,
  OnboardingStep,
  TierLimits,
  SubscriptionTier,
} from '@/../product/sections/clubs-and-venues/types'

// Cast sample data to proper types
const tiers = sampleData.subscriptionTiers as TierLimits[]
const initialOnboardingData = sampleData.onboardingData as OnboardingData

export default function OnboardingWizardView() {
  const [data, setData] = useState<OnboardingData>({
    ...initialOnboardingData,
    // Start at step 1 for preview
    currentStep: 'club_setup',
    completedSteps: [],
  })

  const handleUpdateClub = (updates: Partial<OnboardingData['club']>) => {
    setData((prev) => ({
      ...prev,
      club: { ...prev.club, ...updates },
    }))
    console.log('Update club:', updates)
  }

  const handleUpdateVenue = (updates: Partial<NonNullable<OnboardingData['venue']>>) => {
    setData((prev) => ({
      ...prev,
      venue: prev.venue ? { ...prev.venue, ...updates } : { hasVenue: true, name: '', address: null, courtCount: 4, indoor: false, surface: 'concrete', ...updates },
    }))
    console.log('Update venue:', updates)
  }

  const handleSelectTier = (tier: SubscriptionTier, billingCycle: 'monthly' | 'annual') => {
    setData((prev) => ({
      ...prev,
      subscription: { tier, billingCycle },
    }))
    console.log('Select tier:', tier, billingCycle)
  }

  const handleUpdateFirstEvent = (updates: Partial<NonNullable<OnboardingData['firstEvent']>>) => {
    setData((prev) => ({
      ...prev,
      firstEvent: prev.firstEvent ? { ...prev.firstEvent, ...updates } : { createEvent: true, template: null, dateTime: null, recurring: false, ...updates },
    }))
    console.log('Update first event:', updates)
  }

  const steps: OnboardingStep[] = ['club_setup', 'venue_setup', 'subscription', 'first_event', 'invite_members']

  const handleNextStep = () => {
    const currentIndex = steps.indexOf(data.currentStep)
    if (currentIndex < steps.length - 1) {
      setData((prev) => ({
        ...prev,
        currentStep: steps[currentIndex + 1],
        completedSteps: [...prev.completedSteps.filter(s => s !== prev.currentStep), prev.currentStep],
      }))
    }
    console.log('Next step')
  }

  const handlePreviousStep = () => {
    const currentIndex = steps.indexOf(data.currentStep)
    if (currentIndex > 0) {
      setData((prev) => ({
        ...prev,
        currentStep: steps[currentIndex - 1],
      }))
    }
    console.log('Previous step')
  }

  const handleSkipStep = () => {
    handleNextStep()
    console.log('Skip step')
  }

  const handleComplete = () => {
    console.log('Complete onboarding!', data)
    alert('🎉 Club setup complete! In a real app, this would navigate to your new club dashboard.')
  }

  const handleUploadLogo = (file: File) => {
    console.log('Upload logo:', file.name)
    // Create a preview URL for demo purposes
    const url = URL.createObjectURL(file)
    handleUpdateClub({ logoUrl: url })
  }

  return (
    <OnboardingWizard
      data={data}
      tiers={tiers}
      isLoading={false}
      onUpdateClub={handleUpdateClub}
      onUpdateVenue={handleUpdateVenue}
      onSelectTier={handleSelectTier}
      onUpdateFirstEvent={handleUpdateFirstEvent}
      onNextStep={handleNextStep}
      onPreviousStep={handlePreviousStep}
      onSkipStep={handleSkipStep}
      onComplete={handleComplete}
      onUploadLogo={handleUploadLogo}
    />
  )
}
