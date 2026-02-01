import { LivePlay } from './components'
import data from '@/../product/sections/live-play/data.json'

// =============================================================================
// Preview Wrapper
// =============================================================================

export default function LivePlayView() {
  return (
    <LivePlay
      currentUser={data.currentUser}
      event={data.event as any}
      eventProgress={data.eventProgress}
      courts={data.courts as any}
      matches={data.matches as any}
      matchQueue={data.matchQueue as any}
      players={data.players as any}
      standings={data.standings}
      scoreDisputes={data.scoreDisputes as any}
      completedMatches={data.completedMatches}
      // Player actions
      onCourtCheckIn={(matchId) => console.log('Check in:', matchId)}
      onSubmitScore={(matchId, t1, t2) => console.log('Submit score:', matchId, t1, t2)}
      onConfirmScore={(matchId) => console.log('Confirm score:', matchId)}
      onDisputeScore={(matchId) => console.log('Dispute score:', matchId)}
      // GM actions
      onCallMatch={(matchId, courtId) => console.log('Call match:', matchId, courtId)}
      onStartMatch={(matchId) => console.log('Start match:', matchId)}
      onEnterScore={(matchId, t1, t2) => console.log('Enter score:', matchId, t1, t2)}
      onResolveDispute={(disputeId, t1, t2) => console.log('Resolve:', disputeId, t1, t2)}
      onMarkNoShow={(matchId, playerId) => console.log('No show:', matchId, playerId)}
      onSubstitutePlayer={(matchId, old, newP) => console.log('Sub:', matchId, old, newP)}
      onReorderQueue={(matchId, pos) => console.log('Reorder:', matchId, pos)}
      onPauseEvent={(reason) => console.log('Pause:', reason)}
      onResumeEvent={() => console.log('Resume')}
      onEndEvent={() => console.log('End event')}
      // Navigation
      onViewPlayer={(playerId) => console.log('View player:', playerId)}
      onViewMatch={(matchId) => console.log('View match:', matchId)}
      onOpenCourtBoard={() => console.log('Open court board')}
    />
  )
}
