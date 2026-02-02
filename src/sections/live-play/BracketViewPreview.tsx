import data from '@/../product/sections/live-play/data.json'
import { BracketView } from './components/BracketView'
import type { Bracket, BracketMatch, Tournament, EventProgress } from '@/../product/sections/live-play/types'

export default function BracketViewPreview() {
  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <BracketView
        bracket={data.bracket as Bracket}
        bracketMatches={data.bracketMatches as BracketMatch[]}
        currentUserId={data.currentUser.id}
        isGameManager={false}
        eventProgress={data.eventProgress as EventProgress}
        tournament={data.tournament as Tournament}
        onViewMatch={(id) => console.log('View match:', id)}
        onStartMatch={(id) => console.log('Start match:', id)}
        onEnterScore={(id) => console.log('Enter score:', id)}
        onShareBracket={() => console.log('Share bracket')}
      />
    </div>
  )
}
