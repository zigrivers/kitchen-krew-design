import data from '@/../product/sections/live-play/data.json'
import { TournamentDashboard } from './components/TournamentDashboard'

/**
 * Preview wrapper for the Tournament Dashboard
 * Shows the GM control center for managing the Spring Doubles Championship
 */
export default function TournamentDashboardPreview() {
  const dashboard = data.tournamentDashboard

  return (
    <TournamentDashboard
      event={data.event as any}
      tournament={data.tournament as any}
      eventProgress={data.eventProgress as any}
      bracket={data.bracket as any}
      bracketMatches={data.bracketMatches as any}
      courtAssignments={dashboard.courtAssignments as any}
      roundSchedules={dashboard.roundSchedules as any}
      timeline={dashboard.timeline as any}
      alerts={dashboard.alerts as any}
      quickStats={dashboard.quickStats as any}
      seeds={data.seeds as any}
      completedMatches={data.completedBracketMatches as any}
      scoreDisputes={data.scoreDisputes as any}
      // GM Actions
      onCallMatch={(bracketMatchId, courtId) =>
        console.log('Call match:', bracketMatchId, 'to court:', courtId)
      }
      onStartMatch={(bracketMatchId) => console.log('Start match:', bracketMatchId)}
      onEnterScore={(bracketMatchId) => console.log('Enter score for:', bracketMatchId)}
      onMarkForfeit={(bracketMatchId, forfeitingTeam) =>
        console.log('Forfeit:', bracketMatchId, 'by:', forfeitingTeam)
      }
      onManualAdvance={(bracketMatchId, winner, reason) =>
        console.log('Manual advance:', bracketMatchId, winner, reason)
      }
      onUndoAdvancement={(bracketMatchId) => console.log('Undo advancement:', bracketMatchId)}
      onAnnounceRound={(roundNumber) => console.log('Announce round:', roundNumber)}
      onScheduleMatch={(bracketMatchId, scheduledTime) =>
        console.log('Schedule match:', bracketMatchId, 'at:', scheduledTime)
      }
      onAssignCourt={(bracketMatchId, courtId) =>
        console.log('Assign court:', courtId, 'to match:', bracketMatchId)
      }
      onPauseEvent={(reason) => console.log('Pause event:', reason)}
      onResumeEvent={() => console.log('Resume event')}
      onResolveDispute={(disputeId, team1Score, team2Score) =>
        console.log('Resolve dispute:', disputeId, team1Score, '-', team2Score)
      }
      onDismissAlert={(alertId) => console.log('Dismiss alert:', alertId)}
      onViewBracket={() => console.log('View bracket')}
      onOpenCourtBoard={() => console.log('Open court status board')}
      onShareTournament={() => console.log('Share tournament')}
    />
  )
}
