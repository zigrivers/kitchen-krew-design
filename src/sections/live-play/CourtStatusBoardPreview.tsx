import data from '@/../product/sections/live-play/data.json'
import { CourtStatusBoard } from './components/CourtStatusBoard'
import type { Court, Match, LiveEvent } from '@/../product/sections/live-play/types'

export default function CourtStatusBoardPreview() {
  return (
    <CourtStatusBoard
      courts={data.courts as Court[]}
      matches={data.matches as Match[]}
      event={data.event as LiveEvent}
      onClose={() => console.log('Close court status board')}
    />
  )
}
