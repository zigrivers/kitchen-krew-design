import data from '@/../product/sections/system-settings/data.json'
import { RolesPermissionsPanel } from './components/RolesPermissionsPanel'

export default function RolesPermissionsPanelPreview() {
  return (
    <RolesPermissionsPanel
      roles={data.roles}
      permissions={data.permissions}
      onUpdateRolePermissions={(roleId, permissions) => console.log('Update role permissions:', roleId, permissions)}
      onCreateRole={(role) => console.log('Create role:', role)}
      onCloneRole={(roleId) => console.log('Clone role:', roleId)}
      onViewRoleDetails={(roleId) => console.log('View role details:', roleId)}
      onViewPermissionAudit={() => console.log('View permission audit')}
    />
  )
}
