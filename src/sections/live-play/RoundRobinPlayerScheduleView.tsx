import data from '@/../product/sections/live-play/data.json'
import { RoundRobinPlayerSchedule } from './components/RoundRobinPlayerSchedule'

export default function RoundRobinPlayerScheduleView() {
  // Find the user's pool
  const userPool = data.roundRobinPools.find(p => p.id === data.playerScheduleView.poolId)

  if (!userPool) {
    return <div>Pool not found</div>
  }

  return (
    <RoundRobinPlayerSchedule
      scheduleView={data.playerScheduleView as any}
      pool={userPool as any}
      poolColor={userPool.color as any}
      notifications={data.roundRobinNotifications as any}
      eventName={data.roundRobinEvent.name}
      onViewMatch={(roundNumber) => console.log('View match round:', roundNumber)}
      onViewPool={() => console.log('View pool standings')}
      onViewPlayoffBracket={() => console.log('View playoff bracket preview')}
      onDismissNotification={(id) => console.log('Dismiss notification:', id)}
    />
  )
}
