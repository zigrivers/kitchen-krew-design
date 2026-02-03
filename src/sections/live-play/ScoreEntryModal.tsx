import data from '@/../product/sections/live-play/data.json'
import { ScoreEntryModal } from './components/ScoreEntryModal'

/**
 * Preview wrapper for the Score Entry Modal
 * Shows a Best of 3 semifinals match with 2 games already played (1-1)
 */
export default function ScoreEntryModalPreview() {
  const scenario = data.scoreEntryScenario

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <ScoreEntryModal
        match={scenario.matchContext as any}
        scoringRules={scenario.scoringRules as any}
        isModal={false}
        onSubmit={(scores, winner) =>
          console.log('Submit scores:', scores, 'Winner:', winner)
        }
        onSubmitGame={(gameNumber, score) =>
          console.log('Submit game', gameNumber, ':', score)
        }
        onClose={() => console.log('Close modal')}
        onMarkForfeit={(team) => console.log('Forfeit by:', team)}
      />
    </div>
  )
}
