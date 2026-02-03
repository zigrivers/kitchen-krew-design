import data from '@/../product/sections/live-play/data.json'
import { LargeBracketView } from './components/LargeBracketView'
import type { Bracket, BracketMatch, EventProgress } from '@/../product/sections/live-play/types'

/**
 * Preview wrapper for the 32-team Large Bracket View
 * Uses the bracket32TeamScenario from sample data to showcase
 * dense bracket visualization with zoom controls
 */
export default function LargeBracketViewPreview() {
  const scenario = data.bracket32TeamScenario

  return (
    <LargeBracketView
      bracket={scenario.bracket as Bracket}
      bracketMatches={scenario.bracketMatches as BracketMatch[]}
      currentUserId="p-005" // Sarah Martinez - seed 3, in the Quarterfinals
      isGameManager={false}
      tournamentName={scenario.event.name}
      eventProgress={scenario.eventProgress as EventProgress}
      shareableLink={scenario.tournament.shareableLink}
      onViewMatch={(id) => console.log('View match:', id)}
      onStartMatch={(id) => console.log('Start match:', id)}
      onEnterScore={(id) => console.log('Enter score:', id)}
      onShareBracket={() => console.log('Share bracket')}
      onZoomChange={(level) => console.log('Zoom changed:', level)}
    />
  )
}
