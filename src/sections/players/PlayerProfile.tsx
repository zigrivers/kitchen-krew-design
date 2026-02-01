import data from '@/../product/sections/players/data.json'
import { PlayerProfile } from './components/PlayerProfile'
import type { CurrentUser, Achievement, SkillLevelDescription } from '@/../product/sections/players/types'

export default function PlayerProfilePreview() {
  return (
    <PlayerProfile
      player={data.currentUser as CurrentUser}
      isCurrentUser={true}
      achievements={data.achievements as Achievement[]}
      skillLevelDescriptions={data.skillLevelDescriptions as SkillLevelDescription[]}
      onBack={() => console.log('Navigate back')}
      onEditProfile={() => console.log('Edit profile')}
      onEditAvatar={() => console.log('Edit avatar')}
      onEditPreferences={() => console.log('Edit preferences')}
      onEditPrivacy={() => console.log('Edit privacy')}
      onViewAllAchievements={() => console.log('View all achievements')}
    />
  )
}
