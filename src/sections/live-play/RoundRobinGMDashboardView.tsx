import data from '@/../product/sections/live-play/data.json'
import { RoundRobinGMDashboard } from './components/RoundRobinGMDashboard'

export default function RoundRobinGMDashboardView() {
  // Get in-progress matches from the active matches
  const activeMatches = data.roundRobinMatches.filter(
    m => m.status === 'in_progress' || m.status === 'calling'
  )

  return (
    <RoundRobinGMDashboard
      event={data.roundRobinEvent as any}
      config={data.roundRobinConfig as any}
      progress={data.roundRobinEventProgress as any}
      pools={data.roundRobinPools as any}
      teams={data.roundRobinTeams as any}
      activeMatches={activeMatches as any}
      upcomingMatches={data.upcomingRoundRobinMatches as any}
      schedule={data.roundRobinSchedule as any}
      courts={data.courts as any}
      playoffBracket={data.pendingPlayoffBracket as any}
      onCallMatch={(matchId, courtId) => console.log('Call match:', matchId, 'to court:', courtId)}
      onStartMatch={(matchId) => console.log('Start match:', matchId)}
      onEnterScore={(matchId) => console.log('Enter score for:', matchId)}
      onViewPool={(poolId) => console.log('View pool:', poolId)}
      onViewPlayoffBracket={() => console.log('View playoff bracket')}
      onStartPlayoffs={() => console.log('Start playoffs')}
      onPauseEvent={() => console.log('Pause event')}
      onResumeEvent={() => console.log('Resume event')}
      onEndEvent={() => console.log('End event')}
      onOpenCourtBoard={() => console.log('Open court board')}
    />
  )
}
