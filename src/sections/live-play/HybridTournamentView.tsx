import { useState } from 'react'
import { HybridTournamentDashboard } from './components/HybridTournamentDashboard'
import { HybridSeedingView } from './components/HybridSeedingView'
import { PhaseTransitionScreen } from './components/PhaseTransitionScreen'
import type {
  LiveEvent,
  HybridTournament,
  HybridTournamentProgress,
  RoundRobinTeam,
  Court,
  CurrentUser,
  PlayerScheduleView,
  HybridSeedingResult,
} from '@/../product/sections/live-play/types'

// Import sample data
import sampleData from '@/../product/sections/live-play/data.json'

/**
 * HybridTournamentView - Preview wrapper for hybrid tournament components
 *
 * This component demonstrates the hybrid tournament flow which combines:
 * 1. Seeding Phase - Round robin play to determine tournament seeding
 * 2. Transition Phase - Review standings and generate bracket
 * 3. Bracket Phase - Single/double elimination tournament
 *
 * The view mode toggles between GM Dashboard and Player View
 */
export function HybridTournamentView() {
  const [viewMode, setViewMode] = useState<'gm' | 'player' | 'transition'>('gm')

  // Extract sample data
  const event = sampleData.hybridTournamentEvent as unknown as LiveEvent
  const tournament = sampleData.hybridTournament as unknown as HybridTournament
  const progress = sampleData.hybridTournamentProgress as unknown as HybridTournamentProgress
  const teams = sampleData.hybridTournamentTeams as unknown as RoundRobinTeam[]
  const courts = sampleData.courts as unknown as Court[]
  const currentUser = sampleData.hybridCurrentUser as unknown as CurrentUser & {
    teamId: string
    currentSeed: number
  }
  const scheduleView = sampleData.hybridPlayerScheduleView as unknown as PlayerScheduleView

  // Generate mock seeding results for transition screen
  const seedingResults: HybridSeedingResult[] = tournament.seedingStandings.map((standing, idx) => ({
    rank: idx + 1,
    teamId: standing.teamId,
    displayName: standing.displayName,
    originalSeed: standing.seed,
    wins: standing.wins,
    losses: standing.losses,
    pointDiff: standing.pointDiff,
    pointsFor: standing.pointsFor,
    pointsAgainst: standing.pointsAgainst,
    bracketSeed: idx + 1,
    tiebreaker: standing.tiebreaker,
  }))

  // Generate bracket preview matchups (standard 8-team bracket: 1v8, 4v5, 3v6, 2v7)
  const bracketPreview = [
    {
      matchId: 'preview-1',
      position: 'QF1',
      seed1: 1,
      team1Name: seedingResults[0]?.displayName || 'TBD',
      seed2: 8,
      team2Name: seedingResults[7]?.displayName || 'TBD',
    },
    {
      matchId: 'preview-2',
      position: 'QF2',
      seed1: 4,
      team1Name: seedingResults[3]?.displayName || 'TBD',
      seed2: 5,
      team2Name: seedingResults[4]?.displayName || 'TBD',
    },
    {
      matchId: 'preview-3',
      position: 'QF3',
      seed1: 3,
      team1Name: seedingResults[2]?.displayName || 'TBD',
      seed2: 6,
      team2Name: seedingResults[5]?.displayName || 'TBD',
    },
    {
      matchId: 'preview-4',
      position: 'QF4',
      seed1: 2,
      team1Name: seedingResults[1]?.displayName || 'TBD',
      seed2: 7,
      team2Name: seedingResults[6]?.displayName || 'TBD',
    },
  ]

  return (
    <div className="min-h-screen bg-slate-950">
      {/* View Mode Selector */}
      <div className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 uppercase tracking-wider">Preview Mode:</span>
              <div className="flex gap-1">
                <button
                  onClick={() => setViewMode('gm')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    viewMode === 'gm'
                      ? 'bg-lime-500 text-slate-900'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  GM Dashboard
                </button>
                <button
                  onClick={() => setViewMode('player')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    viewMode === 'player'
                      ? 'bg-lime-500 text-slate-900'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  Player View
                </button>
                <button
                  onClick={() => setViewMode('transition')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    viewMode === 'transition'
                      ? 'bg-lime-500 text-slate-900'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  Transition Screen
                </button>
              </div>
            </div>
            <div className="text-xs text-slate-500">
              Phase: <span className="text-lime-400 capitalize">{tournament.currentPhase}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      {viewMode === 'gm' && (
        <HybridTournamentDashboard
          event={event}
          tournament={tournament}
          progress={progress}
          teams={teams}
          courts={courts}
          currentUser={currentUser}
          onCallSeedingMatch={(matchId, courtId) =>
            console.log('Call seeding match:', matchId, 'to court:', courtId)
          }
          onStartSeedingMatch={(matchId) => console.log('Start seeding match:', matchId)}
          onEnterSeedingScore={(matchId, t1, t2) =>
            console.log('Enter seeding score:', matchId, t1, t2)
          }
          onLockSeeding={() => console.log('Lock seeding')}
          onGenerateBracket={() => console.log('Generate bracket')}
          onStartBracketPhase={() => console.log('Start bracket phase')}
          onCallBracketMatch={(matchId, courtId) =>
            console.log('Call bracket match:', matchId, 'to court:', courtId)
          }
          onStartBracketMatch={(matchId) => console.log('Start bracket match:', matchId)}
          onEnterBracketScore={(matchId) => console.log('Enter bracket score:', matchId)}
          onPauseEvent={(reason) => console.log('Pause event:', reason)}
          onResumeEvent={() => console.log('Resume event')}
          onEndEvent={() => console.log('End event')}
          onViewBracket={() => console.log('View bracket')}
          onViewTeam={(teamId) => console.log('View team:', teamId)}
          onViewMatch={(matchId) => console.log('View match:', matchId)}
          onOpenCourtBoard={() => console.log('Open court board')}
          onShareTournament={() => console.log('Share tournament')}
        />
      )}

      {viewMode === 'player' && (
        <HybridSeedingView
          event={event}
          tournament={tournament}
          progress={progress}
          teams={teams}
          currentUser={{
            id: currentUser.id,
            name: currentUser.name,
            teamId: currentUser.teamId,
            currentMatchId: currentUser.currentMatchId,
            nextMatchId: currentUser.nextMatchId,
            currentSeed: currentUser.currentSeed,
          }}
          scheduleView={scheduleView}
          onCheckIn={(matchId) => console.log('Check in:', matchId)}
          onSubmitScore={(matchId, t1, t2) => console.log('Submit score:', matchId, t1, t2)}
          onConfirmScore={(matchId) => console.log('Confirm score:', matchId)}
          onViewMatch={(matchId) => console.log('View match:', matchId)}
          onViewTeam={(teamId) => console.log('View team:', teamId)}
          onViewStandings={() => console.log('View standings')}
        />
      )}

      {viewMode === 'transition' && (
        <PhaseTransitionScreen
          seedingResults={seedingResults}
          bracketPreview={bracketPreview}
          bracketConfig={tournament.bracketPhase}
          allowSeedOverride={true}
          onConfirmAndGenerate={() => console.log('Confirm and generate bracket')}
          onOverrideSeed={(teamId, newSeed) => console.log('Override seed:', teamId, 'to', newSeed)}
          onBack={() => setViewMode('gm')}
        />
      )}
    </div>
  )
}

export default HybridTournamentView
